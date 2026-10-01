"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { email as studioEmail, form as copy } from "@/content/contact";
import { checkEnquiry, firstName, LIMITS, type Enquiry } from "./enquiry";

/** Where the form posts: as JSON from the handler below, or as an ordinary form post when the
    page's script has not run (the endpoint answers that with a redirect to /contact#enquiry-sent
    or #enquiry-failed, which the card shows without script: see globals.css). */
export const ENDPOINT = "/api/contact";

const CONTROL =
  "w-full rounded-[6px] border border-line bg-white text-[15.5px] text-ink placeholder:text-[#8C8A83] placeholder:opacity-100 focus:border-a focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--a)_16%,transparent)] focus:outline-hidden";

const AGAIN =
  "mt-[26px] cursor-pointer self-start border-0 border-b border-line bg-transparent p-0 pb-0.5 text-[14.5px] text-ink hover:border-a hover:text-a";

const FAILED = "m-0 text-[13px] leading-[1.5] text-[#B3261E]";

type Sent = { firstName: string; email: string };

/** The fields as the form holds them (uncontrolled, as in the prototype). */
function read(form: HTMLFormElement): Enquiry & { website: string } {
  const data = new FormData(form);
  const field = (key: string) => {
    const value = data.get(key);
    return typeof value === "string" ? value : "";
  };
  return { name: field("name"), email: field("email"), message: field("message"), website: field("website") };
}

/** Once the script runs, the form shows its own messages instead of the browser's bubbles (the
    prototype's `form.noValidate = true`). Before that, the browser's checks still apply. */
const scripted = (form: HTMLFormElement | null) => {
  if (form) form.noValidate = true;
};

/**
 * The form card (design_handoff_contact, "Form" and "Success view"). Errors show after the first
 * failed submit and then clear as each field becomes valid; while the request is out the button
 * reads "Sending…" and further submits are ignored; the success view replaces the form, and
 * "Send another message" brings back an empty one. A failed request keeps the form and its values
 * and adds the handoff's suggested line under the submit row.
 *
 * Production additions: each error is tied to its field (aria-describedby, aria-invalid); a failed
 * submit moves focus to the first field to fix; the success heading takes focus, which reads it
 * out; a hidden honeypot field for bots.
 */
export function ContactForm() {
  const [tried, setTried] = useState(false);
  const [errors, setErrors] = useState({ name: false, email: false });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const busyRef = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef<"thanks" | "name" | null>(null);
  const id = useId();

  // After the view swaps, focus goes where the visitor is: to the "Thanks" heading when they
  // sent from the form, and back to Name when they start another message.
  useEffect(() => {
    const next = focusNext.current;
    focusNext.current = null;
    if (next === "thanks") thanksRef.current?.focus();
    else if (next === "name") nameRef.current?.focus();
  }, [sent]);

  const onInput = (e: FormEvent<HTMLFormElement>) => {
    if (!tried) return;
    const check = checkEnquiry(read(e.currentTarget));
    setErrors({ name: check.errName, email: check.errEmail });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busyRef.current) return;
    const form = e.currentTarget;
    const fields = read(form);
    const check = checkEnquiry(fields);
    if (check.errName || check.errEmail) {
      setTried(true);
      setErrors({ name: check.errName, email: check.errEmail });
      setFailed(false);
      (check.errName ? nameRef : emailRef).current?.focus();
      return;
    }
    const fromForm = form.contains(document.activeElement);
    busyRef.current = true;
    setBusy(true);
    setFailed(false);
    setErrors({ name: false, email: false });
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
        // Give up rather than spin for ever (Safari before 16 has no AbortSignal.timeout).
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(20_000) : undefined,
      });
      const data: { ok?: boolean; errors?: { name?: boolean; email?: boolean } } | null = await res
        .json()
        .catch(() => null);
      if (res.ok && data?.ok) {
        focusNext.current = fromForm ? "thanks" : null;
        setTried(false);
        setSent({ firstName: firstName(fields.name), email: fields.email.trim() });
      } else if (data?.errors?.name || data?.errors?.email) {
        // The endpoint applies the same rules, so this needs a request the form did not shape.
        setTried(true);
        setErrors({ name: !!data.errors.name, email: !!data.errors.email });
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const reset = () => {
    focusNext.current = "name";
    setSent(null);
    setTried(false);
    setErrors({ name: false, email: false });
    setFailed(false);
  };

  const failedLine = (
    <>
      {copy.failed.before}
      <a href={`mailto:${studioEmail}`} className="underline underline-offset-[3px]">
        {studioEmail}
      </a>
      {copy.failed.after}
    </>
  );

  return (
    <div
      data-contact-card=""
      className="relative w-full max-w-[480px] rounded-[10px] bg-white px-[clamp(22px,3vw,34px)] py-[clamp(26px,3vw,36px)] shadow-[0_1px_0_rgba(20,20,18,0.04),0_28px_80px_rgba(20,20,18,0.18)] forced-colors:border"
    >
      {sent ? (
        <div className="flex flex-col pt-1.5 pb-0.5">
          <div className="text-[13px] tracking-[-0.005em] text-a">{copy.sent.eyebrow}</div>
          <h2
            ref={thanksRef}
            tabIndex={-1}
            className="mt-3.5 mb-0 text-[30px] leading-[1.1] font-normal tracking-[-0.03em] outline-none"
          >
            {copy.sent.title(sent.firstName)}
          </h2>
          <p className="mt-3.5 mb-0 text-[15.5px] leading-[1.58] text-sec">{copy.sent.body(sent.email)}</p>
          <button type="button" onClick={reset} className={AGAIN}>
            {copy.sent.again}
          </button>
        </div>
      ) : (
        <>
          <form
            ref={scripted}
            method="post"
            action={ENDPOINT}
            onSubmit={onSubmit}
            onInput={onInput}
            className="m-0 flex flex-col gap-[22px]"
          >
            <Field label={copy.name} error={errors.name ? copy.errors.name : null} errorId={`${id}-name`}>
              <input
                ref={nameRef}
                type="text"
                name="name"
                required
                autoComplete="name"
                maxLength={LIMITS.name}
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? `${id}-name` : undefined}
                className={`${CONTROL} h-[46px] px-3.5`}
              />
            </Field>
            <Field label={copy.email} error={errors.email ? copy.errors.email : null} errorId={`${id}-email`}>
              <input
                ref={emailRef}
                type="email"
                name="email"
                required
                autoComplete="email"
                spellCheck={false}
                maxLength={LIMITS.email}
                placeholder={copy.emailPlaceholder}
                aria-invalid={errors.email || undefined}
                aria-describedby={errors.email ? `${id}-email` : undefined}
                className={`${CONTROL} h-[46px] px-3.5`}
              />
            </Field>
            <Field label={copy.message}>
              <textarea
                name="message"
                rows={4}
                maxLength={LIMITS.message}
                placeholder={copy.messagePlaceholder}
                className={`${CONTROL} min-h-[112px] resize-y px-3.5 py-3 leading-[1.5]`}
              />
            </Field>
            {/* Honeypot: hidden by the stylesheet, so people never see, reach or fill it, while
                bots that fill every field in the markup do; the endpoint then drops the enquiry
                and answers as if it went. */}
            <div className="hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-[18px]">
              <button
                type="submit"
                aria-disabled={busy || undefined}
                className="h-12 cursor-pointer rounded-[6px] border-0 bg-ink px-[26px] text-[15px] font-medium tracking-[-0.01em] text-white hover:bg-a forced-colors:border"
              >
                {busy ? copy.sending : copy.submit}
              </button>
              <span className="text-[13.5px] tracking-[-0.005em] text-mut">{copy.note}</span>
            </div>
            {failed ? (
              <p role="alert" className={FAILED}>
                {failedLine}
              </p>
            ) : (
              // The same line after a submission made without script failed (a redirect to
              // #enquiry-failed); hidden otherwise.
              <p id="enquiry-failed" className={`hidden target:block ${FAILED}`}>
                {failedLine}
              </p>
            )}
          </form>
          {/* After a submission made without script went (a redirect to #enquiry-sent), this
              stands in for the success view; globals.css hides the form while it shows. */}
          <div id="enquiry-sent" className="hidden flex-col pt-1.5 pb-0.5 target:flex">
            <div className="text-[13px] tracking-[-0.005em] text-a">{copy.sent.eyebrow}</div>
            <h2 className="mt-3.5 mb-0 text-[30px] leading-[1.1] font-normal tracking-[-0.03em]">
              {copy.sentWithoutScript.title}
            </h2>
            <p className="mt-3.5 mb-0 text-[15.5px] leading-[1.58] text-sec">{copy.sentWithoutScript.body}</p>
            {/* A full page load: it drops the #enquiry-sent that shows this view. */}
            <a href="/contact" className={AGAIN}>
              {copy.sent.again}
            </a>
          </div>
        </>
      )}
    </div>
  );
}

/** A label wrapping its text and control (flex column, 9px apart), with the field's error 9px
    under it. The error sits outside the label so it is not read as part of the field's name;
    the control points at it with aria-describedby. */
function Field({
  label,
  error = null,
  errorId,
  children,
}: {
  label: string;
  error?: string | null;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[9px]">
      <label className="flex flex-col gap-[9px]">
        <span className="text-[14px] tracking-[-0.005em] text-sec">{label}</span>
        {children}
      </label>
      {error ? (
        <span id={errorId} className="text-[13px] text-[#B3261E]">
          {error}
        </span>
      ) : null}
    </div>
  );
}
