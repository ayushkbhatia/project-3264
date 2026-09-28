"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { subscribe as copy } from "@/content/playbooks";
import { subscribe } from "./subscribe";

type Status = "idle" | "submitting" | "success" | "invalid" | "error";

// Survives the card unmounting while the library is filtered (the prototype kept `sub` in page
// state for the same reason): back to browsing, the card still says "You are on the list."
let subscribedThisVisit = false;

/**
 * The subscribe card's form (specs/04): idle → submitting → success, with an inline message for
 * an invalid address or a failed request. The prototype only toggles to success; the other
 * states are the handoff's production additions.
 *
 * While submitting, the field is read-only and the button aria-disabled rather than disabled:
 * disabling the focused control would drop keyboard focus onto the page.
 *
 * Validation is the browser's own rules for a required type=email field, but shown inline in
 * the card's type rather than as the browser's bubble. Focus rings are white here: the accent
 * does not read against the red wash.
 */
export function SubscribeForm() {
  const [status, setStatus] = useState<Status>(() => (subscribedThisVisit ? "success" : "idle"));
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const hadFocus = useRef(false);

  // The form (and the focused button with it) is replaced by the success line: move focus there
  // rather than dropping it on the page, which also reads the line out.
  useEffect(() => {
    if (status === "success" && hadFocus.current) successRef.current?.focus();
  }, [status]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const input = inputRef.current!;
    if (!input.validity.valid) {
      setStatus("invalid");
      input.focus();
      return;
    }
    hadFocus.current = e.currentTarget.contains(document.activeElement);
    // Keep the button's width while its label reads "Subscribing…".
    setButtonWidth(buttonRef.current?.offsetWidth ?? null);
    setStatus("submitting");
    try {
      await subscribe(input.value);
      subscribedThisVisit = true;
      setStatus("success");
    } catch {
      setStatus("error");
      setButtonWidth(null);
    }
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="mt-6 flex h-[52px] items-center gap-2.5 text-[15px] outline-none"
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-[#6FCF97]" />
        {copy.success}
      </div>
    );
  }

  const submitting = status === "submitting";
  const message = status === "invalid" ? copy.invalid : status === "error" ? copy.error : null;

  return (
    <>
      <form
        noValidate
        onSubmit={onSubmit}
        className="mt-6 box-content flex max-w-[480px] gap-1.5 rounded-[10px] bg-white p-[5px] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-white"
      >
        <input
          ref={inputRef}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          aria-invalid={status === "invalid" || undefined}
          aria-describedby={message ? "subscribe-message" : undefined}
          readOnly={submitting}
          onInput={() => { if (status === "invalid" || status === "error") setStatus("idle"); }}
          className="box-content h-[42px] min-w-0 flex-auto border-0 bg-transparent px-3 py-0 text-[15px] text-ink outline-none read-only:opacity-60"
        />
        <button
          ref={buttonRef}
          type="submit"
          aria-busy={submitting || undefined}
          aria-disabled={submitting || undefined}
          style={submitting && buttonWidth ? { width: buttonWidth, paddingInline: 0 } : undefined}
          className="h-[42px] flex-none cursor-pointer justify-center rounded-[7px] border-0 bg-a px-5 text-[14.5px] font-medium whitespace-nowrap text-white hover:bg-[#0F6A43] focus-visible:outline-white aria-disabled:cursor-default aria-disabled:hover:bg-a forced-colors:border"
        >
          {submitting ? copy.submitting : copy.button}
        </button>
      </form>
      {message ? (
        <p id="subscribe-message" role="alert" className="mt-2.5 mb-0 text-[13px] text-white/92">
          {message}
        </p>
      ) : null}
    </>
  );
}
