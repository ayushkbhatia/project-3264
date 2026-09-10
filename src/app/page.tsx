import HeroVisual from "@/components/hero-visual";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1248px] flex-1 items-center px-8 py-16">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <h1 className="max-w-[14ch] text-[clamp(36px,4.4vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Placeholder headline for project&nbsp;3264.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-fg-muted">
            Copy and layout land with the Claude Design renders. The hero visual on
            the right is the finished asset — a live WebGL network that resolves from
            tangled to ordered, then holds and reverses.
          </p>
          <div className="flex flex-wrap gap-3 text-base font-medium">
            <a
              href="#"
              className="flex h-12 items-center justify-center rounded-full bg-viz-order px-6 text-white transition-colors duration-200 hover:opacity-90"
            >
              Primary action
            </a>
            <a
              href="#"
              className="flex h-12 items-center justify-center rounded-full border border-hairline px-6 transition-colors duration-200 hover:bg-black/[.04]"
            >
              Secondary
            </a>
          </div>
        </div>

        <div
          className="relative w-full overflow-hidden bg-viz-surface"
          style={{ borderRadius: "var(--radius-card)", aspectRatio: "1172 / 1080" }}
        >
          <HeroVisual />
        </div>
      </div>
    </main>
  );
}
