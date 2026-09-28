"use client";

import { useEffect, useRef, useState } from "react";

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
    const done = () => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    };
    try {
      navigator.clipboard.writeText(window.location.href).then(done, () => {});
    } catch {}
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
