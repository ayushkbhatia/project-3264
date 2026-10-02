#!/usr/bin/env node
// The Contact form and its endpoint, end to end:
//   - the form: errors only after a failed submit, then clearing live; Sending… with repeat
//     submits ignored; the success view (focus on its heading); Send another message; a failed
//     request keeping the values; errors the endpoint returns;
//   - its states against the prototype (errors, sending, sent) at 1440 and 390;
//   - the endpoint: delivery, the form's rules, the honeypot, origin, size, rate limit, method,
//     and a browser without script (redirects to #enquiry-sent / #enquiry-failed);
//   - /company redirecting to /contact.
//
// Run against the production build with a stand-in delivery target, e.g.
//   node <scratch>/mock-hook.mjs                      (records POSTs to hook-log.jsonl)
//   CONTACT_WEBHOOK_URL=http://127.0.0.1:4199/hook npx next start -p 3100
//   node qa/ct-form.mjs --hook-log <scratch>/hook-log.jsonl --fail-flag <scratch>/fail
// Without --hook-log the delivery checks are skipped; with --fail-flag (a file whose presence makes
// the stand-in answer 500) a real delivery failure is checked too. Each browser context and
// request carries its own x-real-ip, so the endpoint's rate limit only meets the check aimed at it.

import fs from "node:fs";
import { arg, BASE, diffPng, launch, openPage, outDir, pct, PORT, REF } from "./ct-lib.mjs";

const HOOK_LOG = arg("hook-log");
const FAIL_FLAG = arg("fail-flag");
const OUT = outDir("contact/form");
const API = `${BASE}/api/contact`;
let failures = 0;
const check = (pass, label) => {
  if (!pass) failures++;
  console.log(`${pass ? "ok  " : "FAIL"} ${label}`);
};
let ipSeq = Math.floor(Math.random() * 200);
const freshIp = () => `198.51.100.${(ipSeq++ % 250) + 1}`;
const hookLines = () => (HOOK_LOG && fs.existsSync(HOOK_LOG) ? fs.readFileSync(HOOK_LOG, "utf8").trim().split("\n").filter(Boolean) : []);
const sameOriginHeaders = (ip) => ({ "x-real-ip": ip, Origin: BASE });

const browser = await launch();
const portPage = (w = 1440, h = 900, opts = {}) => openPage(browser, PORT, w, h, { extraHTTPHeaders: { "x-real-ip": freshIp() }, ...opts });
const card = (page) => page.locator("#top form >> xpath=..").first();
const errorsShown = (page) =>
  page.evaluate(() => [...document.querySelectorAll("#top form span")].map((s) => s.textContent).filter((t) => /Add your name|Enter a work email/.test(t)));

try {
  /* ------------------------------------------------------------------ the form */
  {
    const { ctx, page, errors } = await portPage();
    let posts = 0;
    page.on("request", (r) => { if (r.url() === API && r.method() === "POST") posts++; });

    await page.click("#top button[type=submit]");
    await page.waitForTimeout(150);
    const empty = await page.evaluate(() => {
      const name = document.querySelector("input[name=name]");
      const email = document.querySelector("input[name=email]");
      const described = (el) => document.getElementById(el.getAttribute("aria-describedby") || "")?.textContent;
      return { focus: document.activeElement?.name, invalid: [name.getAttribute("aria-invalid"), email.getAttribute("aria-invalid")], described: [described(name), described(email)] };
    });
    check(posts === 0, `empty submit sends nothing (${posts} requests)`);
    check(
      empty.described[0] === "Add your name so we know who to reply to." && empty.described[1] === "Enter a work email, like you@firm.com.",
      `both errors shown and tied to their fields: ${JSON.stringify(empty.described)}`,
    );
    check(empty.invalid.join() === "true,true" && empty.focus === "name", `aria-invalid ${empty.invalid}, focus on ${empty.focus}`);

    await page.fill("input[name=name]", "Jane Doe");
    let shown = await errorsShown(page);
    check(shown.length === 1 && /work email/.test(shown[0]), `name error clears as it is typed; email error stays (${shown.length} shown)`);
    await page.fill("input[name=email]", "jane@firm");
    shown = await errorsShown(page);
    check(shown.length === 1, `"jane@firm" still fails the address rule`);
    await page.fill("input[name=email]", "jane.doe@firm.com");
    shown = await errorsShown(page);
    check(shown.length === 0, `errors clear once both fields are valid`);
    await page.fill("textarea[name=message]", "Covenant monitoring across 40 facilities.");

    // Hold the request so "Sending…" can be seen, and try to submit twice.
    const before = hookLines().length;
    let release;
    const held = new Promise((r) => (release = r));
    await page.route(`${API}`, async (route) => { await held; await route.continue(); });
    await page.click("#top button[type=submit]");
    await page.waitForTimeout(100);
    const busy = await page.evaluate(() => { const b = document.querySelector("#top button[type=submit]"); return [b.textContent, b.getAttribute("aria-disabled")]; });
    // force: Playwright treats aria-disabled as disabled and would wait for the button
    await page.click("#top button[type=submit]", { force: true });
    await page.keyboard.press("Enter");
    check(busy[0] === "Sending…" && busy[1] === "true", `while sending: "${busy[0]}", aria-disabled ${busy[1]}`);
    {
      const files = [`${OUT}/sending-port.png`];
      await card(page).screenshot({ path: files[0], animations: "disabled" });
    }
    release();
    await page.waitForSelector("text=Message sent");
    await page.unroute(`${API}`);
    check(posts === 1, `repeat submits while sending are ignored (${posts} request)`);
    const sent = await page.evaluate(() => {
      const h2 = document.querySelector("#top h2");
      return { title: h2?.textContent, body: h2?.nextElementSibling?.textContent, focus: document.activeElement === h2, form: !!document.querySelector("#top form") };
    });
    check(sent.title === "Thanks, Jane." && sent.body === "We will reply to jane.doe@firm.com inside one business day.", `success view: "${sent.title}" / "${sent.body}"`);
    check(sent.focus && !sent.form, `focus on the heading (${sent.focus}); the form is gone (${!sent.form})`);
    if (HOOK_LOG) {
      const lines = hookLines();
      const last = lines.length > before ? JSON.parse(lines.at(-1)) : null;
      check(
        lines.length === before + 1 && last?.name === "Jane Doe" && last?.email === "jane.doe@firm.com" && /Covenant monitoring/.test(last?.message) && /Name: Jane Doe/.test(last?.text) && last?.source?.endsWith("/contact"),
        `delivered once to the webhook: ${last ? JSON.stringify({ name: last.name, email: last.email, receivedAt: last.receivedAt, source: last.source }) : "nothing"}`,
      );
    }

    await page.click("text=Send another message");
    await page.waitForTimeout(150);
    const again = await page.evaluate(() => ({
      values: [...document.querySelectorAll("#top form input:not([name=website]), #top form textarea")].map((e) => e.value),
      errors: document.querySelectorAll("#top [aria-invalid]").length,
      focus: document.activeElement?.name,
    }));
    check(again.values.every((v) => v === "") && again.errors === 0 && again.focus === "name", `"Send another message": empty form ${JSON.stringify(again.values)}, ${again.errors} errors, focus on ${again.focus}`);

    // A failed request keeps the form and its values and adds the line under the submit row.
    await page.fill("input[name=name]", "Jane Doe");
    await page.fill("input[name=email]", "jane.doe@firm.com");
    await page.route(`${API}`, (route) => route.fulfill({ status: 502, contentType: "application/json", body: '{"ok":false}' }));
    await page.click("#top button[type=submit]");
    await page.waitForSelector("#top [role=alert]");
    const failed = await page.evaluate(() => {
      const alert = document.querySelector("#top [role=alert]");
      return { text: alert?.textContent, mail: alert?.querySelector("a")?.getAttribute("href"), name: document.querySelector("input[name=name]").value, button: document.querySelector("#top button[type=submit]").textContent };
    });
    check(
      failed.text === "That didn't send. Write to hello@3264.ai and we'll pick it up." && failed.mail === "mailto:hello@3264.ai" && failed.name === "Jane Doe" && failed.button === "Submit",
      `failed request: "${failed.text}" (${failed.mail}); values kept (${failed.name}); button "${failed.button}"`,
    );
    await card(page).screenshot({ path: `${OUT}/failed-port.png`, animations: "disabled" });

    // A dropped connection reads the same; an endpoint verdict on a field shows that field's error.
    await page.unroute(`${API}`);
    await page.route(`${API}`, (route) => route.abort("connectionreset"));
    await page.click("#top button[type=submit]");
    await page.waitForTimeout(300);
    check((await page.locator("#top [role=alert]").count()) === 1, "a dropped connection shows the same line");
    await page.unroute(`${API}`);
    await page.route(`${API}`, (route) => route.fulfill({ status: 400, contentType: "application/json", body: '{"ok":false,"errors":{"name":false,"email":true}}' }));
    await page.click("#top button[type=submit]");
    await page.waitForTimeout(300);
    shown = await errorsShown(page);
    check(shown.length === 1 && /work email/.test(shown[0]) && (await page.locator("#top [role=alert]").count()) === 0, `the endpoint's field verdict shows that field's error (${shown.join(" | ")})`);
    await page.unroute(`${API}`);
    check(!errors.length, `no console errors${errors.length ? ": " + errors.join(" | ") : ""}`);
    await ctx.close();
  }

  /* ------------------------------------------------------- states vs prototype */
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ref = await openPage(browser, REF, w, h);
    const port = await portPage(w, h);
    const shot = async (name) => {
      const files = ["ref", "port"].map((k) => `${OUT}/${w}-${name}-${k}.png`);
      for (const [i, { page }] of [ref, port].entries()) {
        await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
        await page.mouse.move(0, 0);
        await page.waitForTimeout(100);
        await page.locator("#top form >> xpath=..").first().or(page.locator("#top h2 >> xpath=../..").first()).first().screenshot({ path: files[i], animations: "disabled" });
      }
      const r = diffPng(files[0], files[1], `${OUT}/${w}-${name}-diff.png`);
      check(r.ratio < 0.002 && r.ref === r.port, `${w} ${name} state: ${pct(r.ratio)} differ (ref ${r.ref}, port ${r.port})`);
    };
    for (const { page } of [ref, port]) await page.click("#top button[type=submit]");
    await shot("errors");
    // Sending: the prototype holds it for 650ms; the port's request is held here.
    await port.page.route(`${API}`, async (route) => { await new Promise((r) => setTimeout(r, 1500)); await route.continue(); });
    for (const { page } of [ref, port]) {
      await page.fill("input[name=name]", "Jane Doe");
      await page.fill("input[name=email]", "jane.doe@firm.com");
      await page.fill("textarea[name=message]", "Covenant monitoring across 40 facilities.");
    }
    await Promise.all([ref, port].map(({ page }) => page.click("#top button[type=submit]")));
    {
      const files = ["ref", "port"].map((k) => `${OUT}/${w}-sending-${k}.png`);
      await Promise.all([ref, port].map(({ page }, i) => page.locator("#top form >> xpath=..").first().screenshot({ path: files[i], animations: "disabled" })));
      const r = diffPng(files[0], files[1], `${OUT}/${w}-sending-diff.png`);
      check(r.ratio < 0.004 && r.ref === r.port, `${w} sending state: ${pct(r.ratio)} differ (ref ${r.ref}, port ${r.port})`);
    }
    for (const { page } of [ref, port]) await page.waitForSelector("text=Message sent", { timeout: 10000 });
    await shot("sent");
    await ref.ctx.close();
    await port.ctx.close();
  }

  /* ------------------------------------------------------------- the endpoint */
  {
    const post = (body, { ip = freshIp(), type = "application/json", headers = {} } = {}) =>
      fetch(API, { method: "POST", redirect: "manual", headers: { "Content-Type": type, ...sameOriginHeaders(ip), ...headers }, body });
    const json = async (res) => [res.status, await res.json().catch(() => null)];
    const valid = { name: "Ada Lovelace", email: "ada@analytical.example", message: "Hello", website: "" };

    check((await fetch(API)).status === 405, "GET is refused (405)");
    const before = hookLines().length;
    let [status, body] = await json(await post(JSON.stringify(valid)));
    check(status === 200 && body?.ok === true, `valid enquiry: ${status} ${JSON.stringify(body)}`);
    if (HOOK_LOG) check(hookLines().length === before + 1, "…and delivered");
    [status, body] = await json(await post(JSON.stringify({ ...valid, email: "ada@analytical" })));
    check(status === 400 && body?.errors?.email === true && body?.errors?.name === false, `bad address: ${status} ${JSON.stringify(body)}`);
    [status, body] = await json(await post(JSON.stringify({ ...valid, name: "   " })));
    check(status === 400 && body?.errors?.name === true, `blank name: ${status} ${JSON.stringify(body)}`);
    [status, body] = await json(await post(JSON.stringify({ ...valid, name: "x".repeat(201) })));
    check(status === 400 && body?.ok === false && !body?.errors, `over-long name: ${status}`);
    const hookBefore = hookLines().length;
    [status, body] = await json(await post(JSON.stringify({ ...valid, website: "https://spam.example" })));
    check(status === 200 && body?.ok === true && hookLines().length === hookBefore, `honeypot filled: answered ${status} ok, nothing delivered`);
    [status] = await json(await post(JSON.stringify(valid), { headers: { Origin: "https://elsewhere.example" } }));
    check(status === 403, `another site's origin: ${status}`);
    [status] = await json(await post(JSON.stringify({ ...valid, message: "x".repeat(70 * 1024) })));
    check(status === 413, `oversized body: ${status}`);
    [status] = await json(await post("{not json"));
    check(status === 400, `malformed JSON: ${status}`);
    const ip = freshIp();
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await post(JSON.stringify(valid), { ip })).status);
    check(codes.join() === "200,200,200,200,200,429", `rate limit, six from one address: ${codes.join(",")}`);
    // a form post from a browser that has not run the script
    const form = (fields) => new URLSearchParams(fields).toString();
    let res = await post(form(valid), { type: "application/x-www-form-urlencoded" });
    check(res.status === 303 && new URL(res.headers.get("location")).hash === "#enquiry-sent", `form post: ${res.status} → ${res.headers.get("location")}`);
    res = await post(form({ ...valid, email: "nope" }), { type: "application/x-www-form-urlencoded" });
    check(res.status === 303 && new URL(res.headers.get("location")).hash === "#enquiry-failed", `invalid form post: ${res.status} → ${res.headers.get("location")}`);
    res = await fetch(`${BASE}/company`, { redirect: "manual" });
    check(res.status === 307 && new URL(res.headers.get("location"), BASE).pathname === "/contact", `/company: ${res.status} → ${res.headers.get("location")}`);
  }

  /* ------------------------------------------------- a real delivery failure */
  if (FAIL_FLAG) {
    fs.writeFileSync(FAIL_FLAG, "");
    try {
      const { ctx, page } = await portPage();
      await page.fill("input[name=name]", "Jane Doe");
      await page.fill("input[name=email]", "jane.doe@firm.com");
      const [res] = await Promise.all([page.waitForResponse(API), page.click("#top button[type=submit]")]);
      await page.waitForSelector("#top [role=alert]");
      check(res.status() === 502 && (await page.inputValue("input[name=email]")) === "jane.doe@firm.com", `delivery refused by the webhook: ${res.status()}, the line shows, values kept`);
      await ctx.close();
    } finally {
      fs.rmSync(FAIL_FLAG, { force: true });
    }
  }

  /* -------------------------------------------------------- without script */
  {
    // Not openPage: Playwright's style injection never settles without script.
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false, extraHTTPHeaders: { "x-real-ip": freshIp() } });
    const page = await ctx.newPage();
    await page.goto(PORT, { waitUntil: "load" });
    await page.click("#top button[type=submit]");
    await page.waitForTimeout(300);
    check(new URL(page.url()).hash === "" && (await page.evaluate(() => document.querySelector("input[name=name]").validity.valueMissing)), "without script, an empty form is held by the browser's own checks");
    const before = hookLines().length;
    await page.fill("input[name=name]", "Grace Hopper");
    await page.fill("input[name=email]", "grace@navy.example");
    await page.fill("textarea[name=message]", "Sent without script.");
    await Promise.all([page.waitForURL(/#enquiry-sent$/), page.click("#top button[type=submit]")]);
    await page.waitForLoadState("networkidle");
    const view = await page.evaluate(() => ({
      form: getComputedStyle(document.querySelector("#top form")).display,
      sent: getComputedStyle(document.getElementById("enquiry-sent")).display,
      title: document.querySelector("#enquiry-sent h2").textContent,
    }));
    check(view.form === "none" && view.sent === "flex" && view.title === "Thanks.", `without script, sent: lands on #enquiry-sent, form ${view.form}, sent view ${view.sent} ("${view.title}")`);
    if (HOOK_LOG) check(hookLines().length === before + 1 && JSON.parse(hookLines().at(-1)).name === "Grace Hopper", "…and delivered");
    await page.locator("[data-contact-card]").screenshot({ path: `${OUT}/noscript-sent-port.png` });
    // A failed delivery (the stand-in refusing it), or else one the browser is told about.
    await page.goto(PORT, { waitUntil: "load" });
    if (FAIL_FLAG) fs.writeFileSync(FAIL_FLAG, "");
    else await page.route(`${API}`, (route) => route.fulfill({ status: 303, headers: { Location: `${PORT}#enquiry-failed` } }));
    await page.fill("input[name=name]", "Grace Hopper");
    await page.fill("input[name=email]", "grace@navy.example");
    try {
      await Promise.all([page.waitForURL(/#enquiry-failed$/, { timeout: 15000 }), page.click("#top button[type=submit]")]);
    } finally {
      if (FAIL_FLAG) fs.rmSync(FAIL_FLAG, { force: true });
    }
    const failedView = await page.evaluate(() => ({ line: getComputedStyle(document.getElementById("enquiry-failed")).display, form: getComputedStyle(document.querySelector("#top form")).display }));
    check(failedView.line === "block" && failedView.form === "flex", `without script, failed: the line shows (${failedView.line}) under the form (${failedView.form})`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(failures ? `\n${failures} check(s) failed` : "\nall checks pass");
process.exitCode = failures ? 1 : 0;
