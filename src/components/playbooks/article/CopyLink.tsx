"use client";

import { useEffect, useRef, useState } from "react";

/** Copies through a hidden textarea: for browsers without the async clipboard (or an insecure
    origin), and when it refuses. Returns whether the copy went through. */
function copyWithTextarea(text: string): boolean {
  const focused = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  // off screen, and 16px so iOS does not zoom in on the selection
  area.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0;font-size:16px";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {}
  area.remove();
  focused?.focus({ preventScroll: true });
  return ok;
}

/**
 * "Copy link" in the hero's meta row: copies the page's address (with the section in its hash,
 * if the reader has jumped to one) and reads "Link copied" for 1.8s. The change is announced
 * too. The button is 15px tall; an invisible ::before gives it a 31px hit area.
 */
export function CopyLink() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () => {
    const href = window.location.href;
    const done = () => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    };
    const fallback = () => {
      if (copyWithTextarea(href)) done();
    };
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(href).then(done, fallback);
      else fallback();
    } catch {
      fallback();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="relative ml-auto cursor-pointer text-[12.5px] text-ink before:absolute before:-inset-2 before:content-[''] hover:text-a"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Link copied" : ""}
      </span>
    </>
  );
}
