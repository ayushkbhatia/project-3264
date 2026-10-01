import "server-only";
import type { Enquiry } from "@/components/contact/enquiry";

// Where an enquiry goes. The handoff leaves the endpoint, notification address and CRM to 3264, so
// delivery is configured, not built in: set either or both of these in the environment (Vercel:
// Project Settings → Environment Variables; locally, .env.local). See .env.example.
//
//   CONTACT_WEBHOOK_URL   POST the enquiry as JSON to a URL: a Slack incoming webhook (the payload
//                         carries a `text` line for it), or Zapier, Make, n8n or a CRM's inbound
//                         webhook (the fields are top level).
//   RESEND_API_KEY        Email it through Resend (resend.com) to CONTACT_TO (comma-separated),
//   CONTACT_TO            from CONTACT_FROM, with Reply-To set to the sender, so answering the
//   CONTACT_FROM          email answers them. CONTACT_FROM must be on a domain verified in
//                         Resend; until then Resend's onboarding@resend.dev (the default) can
//                         send only to the Resend account's own address.
//
// With both set, both are tried, and the enquiry counts as delivered if either takes it. With
// neither set, development logs the enquiry and reports it delivered; production reports a failure,
// so the form tells the visitor to write instead of pretending the message went somewhere.

export type Delivery = Enquiry & {
  /** ISO time the endpoint received it. */
  receivedAt: string;
  /** The page it was sent from. */
  source: string;
};

const TIMEOUT_MS = 8_000;

export async function deliverEnquiry(enquiry: Delivery): Promise<boolean> {
  const sinks: Array<[string, () => Promise<void>]> = [];
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (webhook) sinks.push(["webhook", () => postWebhook(webhook, enquiry)]);
  if (resendKey && to) sinks.push(["email", () => sendEmail(resendKey, to, enquiry)]);

  if (!sinks.length) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] no delivery configured; in development the enquiry is only logged:", enquiry);
      return true;
    }
    console.error("[contact] no delivery configured: set CONTACT_WEBHOOK_URL, or RESEND_API_KEY and CONTACT_TO");
    return false;
  }

  const results = await Promise.allSettled(sinks.map(([, send]) => send()));
  results.forEach((result, i) => {
    // The reason names the channel and the HTTP status, never the enquiry itself.
    if (result.status === "rejected") console.error(`[contact] ${sinks[i][0]} delivery failed:`, String(result.reason));
  });
  return results.some((result) => result.status === "fulfilled");
}

/** The enquiry as plain text, for the email body and the Slack line. */
function summary({ name, email, message, receivedAt, source }: Delivery): string {
  return [
    `New enquiry from the contact page (${source})`,
    "",
    `Name: ${name}`,
    `Work email: ${email}`,
    `Received: ${receivedAt}`,
    "",
    "How can we help?",
    message || "(left blank)",
  ].join("\n");
}

/** Slack reads <…> as links and mentions and &…; as entities; escape the three it asks for. */
const slackText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function postWebhook(url: string, enquiry: Delivery): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: slackText(summary(enquiry)), ...enquiry }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`webhook answered ${res.status}`);
}

async function sendEmail(apiKey: string, to: string, enquiry: Delivery): Promise<void> {
  // One line, so a name cannot add a header; Resend takes the fields as JSON, not raw headers.
  const subject = `New enquiry: ${enquiry.name.replace(/[\r\n]+/g, " ").slice(0, 120)}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "3264.ai contact form <onboarding@resend.dev>",
      to: to.split(",").map((address) => address.trim()).filter(Boolean),
      reply_to: enquiry.email,
      subject,
      text: summary(enquiry),
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Resend answered ${res.status}`);
}
