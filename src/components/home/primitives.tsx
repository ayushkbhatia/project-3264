import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Shared building blocks for the home page. Values are the reference's, unrounded — see
// design_handoff_home/specs/00-foundation.md. Everything here is a server component.
//
// SIZING NOTE: the reference runs on the UA default `box-sizing: content-box`; Tailwind's
// preflight makes everything border-box. Wherever an element combines padding or a border
// with an explicit width, height, max-width or aspect-ratio, it carries `box-content` so its
// rendered size matches the design (e.g. the outlined buttons are 2px taller than the filled
// ones, exactly as in the reference).

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ links */

type SmartLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };

/**
 * In-page anchors and mailto links stay plain <a>; app routes go through next/link. Routes for
 * pages not yet built are not prefetched, so they cost nothing until they exist. External
 * http(s) pages (the booking URL, once there is one) open in a new tab and say so.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} prefetch={false} {...rest}>
        {children}
      </Link>
    );
  }
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------- type */

/** `NN / Name` label: 13px, -0.005em, muted. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("text-[13px] tracking-[-0.005em] text-mut", className)}>{children}</div>;
}

/** Section h2: clamp(30px,3.1vw,44px) / 400 / -0.032em / 1.06, 22px under its eyebrow. */
export const sectionTitle =
  "mt-[22px] mb-0 text-[clamp(30px,3.1vw,44px)] font-normal leading-[1.06] tracking-[-0.032em]";

/** Section standfirst: 16.5px / 1.6 / --sec. */
export const standfirst = "m-0 text-[16.5px] leading-[1.6] text-sec";

/** Placeholder note under the case studies and the team: 13.5px, muted. */
export function PlaceholderNote({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("mb-0 text-[13.5px] text-mut", className)}>{children}</p>;
}

/** The wordmark. `.ai` is its own span so it can be addressed separately (the intro does). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("font-medium tracking-[-0.03em]", className)}>
      3264<span>.ai</span>
    </span>
  );
}

/* ----------------------------------------------------------------- layout */

/**
 * A standard page section: 130px / 40px padding (88px / 24px below 768px) and a --line2
 * bottom hairline, with the 1280px content column inside.
 */
export function Section({
  id,
  label,
  className,
  columnClassName,
  children,
}: {
  id?: string;
  /** Mirrors the reference's data-screen-label; the QA harness selects on it. */
  label: string;
  className?: string;
  columnClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-screen-label={label}
      className={cx(
        "border-b border-line2 px-6 py-[88px] md:px-10 md:py-[130px]",
        className,
      )}
    >
      <div className={cx("mx-auto max-w-[1280px]", columnClassName)}>{children}</div>
    </section>
  );
}

/**
 * Two-column section header: eyebrow + h2 on the left (flex 1 1 280px), standfirst on the
 * right (flex 2 1 480px, max 560px), 72px apart, bottoms aligned, wrapping when narrow.
 */
export function SectionHeader({
  eyebrow,
  title,
  standfirst: copy,
}: {
  eyebrow: string;
  title: string;
  standfirst: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-[72px] gap-y-6 md:gap-y-[72px]">
      <div className="min-w-0 flex-[1_1_280px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className={sectionTitle}>{title}</h2>
      </div>
      <p className={cx(standfirst, "min-w-0 max-w-[560px] flex-[2_1_480px]")}>{copy}</p>
    </div>
  );
}

/**
 * Card grid whose rules read as one hairline table: 1px gaps over the --line colour inside a
 * 1px --line border. Children paint their own background. (Tailwind divide-* gets the outer
 * edge wrong, which is why this exists.) Forced colours repaint both the grid and the cells as
 * Canvas, which would erase the rules; a system colour survives, so the gaps become CanvasText.
 */
export function HairlineGrid({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cx("grid gap-px border border-line bg-line forced-colors:bg-[color:CanvasText]", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * The page's 32-column signature texture. Decorative.
 * - hero: vertical + 68px horizontal rules, fading out downward
 * - closing: vertical rules only, fading out upward
 */
export function GridTexture({ variant }: { variant: "hero" | "closing" }) {
  const style =
    variant === "hero"
      ? {
          opacity: "calc(var(--tex) * 0.34)",
          backgroundImage:
            "linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,18,0.05) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 32) 68px",
          maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 46%, transparent 88%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.35) 46%, transparent 88%)",
        }
      : {
          opacity: "calc(var(--tex) * 0.4)",
          backgroundImage: "linear-gradient(to right, rgba(20,20,18,0.07) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 32) 100%",
          maskImage: "linear-gradient(to top, #000 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 80%)",
        };
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={style} />;
}

/* ---------------------------------------------------------------- buttons */

type ButtonVariant = "header" | "primary" | "primaryLarge" | "secondary" | "onImage";

const buttonBase = "items-center rounded-[6px] tracking-[-0.01em] whitespace-nowrap";

// The filled variants have no border, so forced colours (which repaint the fill as Canvas) would
// leave bare link text. `forced-colors:border` gives them a system-coloured edge in that mode
// only; normal rendering is unchanged.
const filled = "forced-colors:border";

const buttonVariants: Record<ButtonVariant, string> = {
  // 36px outline in the header. Hover: border and label to accent.
  header:
    "box-content flex h-9 gap-2.5 border border-line bg-white px-4 text-[13.5px] hover:border-a hover:text-a",
  // 46px dark fill. Hover: fill to accent, label stays white.
  primary: `flex h-[46px] bg-ink px-6 text-[15px] font-medium text-white hover:bg-a hover:text-white ${filled}`,
  // 50px dark fill for the closing CTA.
  primaryLarge: `flex h-[50px] bg-ink px-7 text-[15.5px] font-medium text-white hover:bg-a hover:text-white ${filled}`,
  // 46px outline. Hover: border to accent (label takes the global link hover).
  secondary: "box-content flex h-[46px] border border-line bg-white px-6 text-[15px] hover:border-a",
  // 46px white fill over the footer image. Hover: warm grey fill, ink label.
  onImage: `inline-flex h-[46px] bg-white px-6 text-[15px] font-medium text-ink hover:bg-[#D8D6D1] hover:text-ink ${filled}`,
};

export function Button({
  href,
  variant,
  className,
  children,
}: {
  href: string;
  variant: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <SmartLink href={href} className={cx(buttonBase, buttonVariants[variant], className)}>
      {children}
    </SmartLink>
  );
}
