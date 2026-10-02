import Image from "next/image";
import { pageMetadata } from "@/app/shared-metadata";
import { ContactForm } from "@/components/contact/ContactForm";
import { LogoMarquee } from "@/components/contact/LogoMarquee";
import { ContactMotion, PauseControl } from "@/components/contact/Motion";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { GridTexture } from "@/components/home/primitives";
import { directLine, email, footerColumns, headerCta, intro, meta, nav } from "@/content/contact";

// Contact — 3264's one place for new enquiries, ported from design_handoff_contact (its prototype,
// Contact.dc.html, is the source of truth; copy in src/content/contact.ts). It replaced the Company
// page in the nav.
//
// A split screen under the site header, at least the rest of the viewport tall: the headline,
// brief and rolling "Built on" strip on the left; the form card on the watercolour on the right.
// The grid gives two equal columns from 880px and stacks them below that (two 440px minimums).
// Content-box, as in the prototype: the minimum height is the viewport less the header, and the
// bottom hairline sits under it.
// Static apart from the form, which posts to /api/contact, and the strip's pause state.

export const metadata = pageMetadata({ title: meta.title, description: meta.description });

/** The right half's painting, "Ink": the AI Engineering audit card's file, so both pages share
    its optimised copies. Through the optimiser by path (Turbopack does not read AVIF for a static
    import). */
const PANEL = "/img/ai-engineering/cta-d.avif";

/** The width the painting is DRAWN at, which is wider than its panel: it covers a panel taller
    than its own 3420×2317 proportions, so it is scaled to the panel's height (× 1.48) and cropped
    at the sides. Side by side the panel is about the viewport less the header tall, and never much
    under 700px (its content); stacked, about 680px tall at most widths. Sized by the panel instead,
    a phone or a retina screen got a copy two or three times too small and lost the paper's grain.
    A browser that cannot read max() here falls back to 100vw. */
const PANEL_SIZES = "(min-width: 880px) max(50vw, calc((100vh - 69px) * 1.48), 1000px), max(100vw, 1000px)";

export default function ContactPage() {
  return (
    <>
      <Header nav={nav} cta={headerCta} homeHref="/" collapseBelow="1000" menu />
      <ContactMotion>
        <main>
          <section
            id="top"
            data-screen-label="Contact"
            className="box-content grid min-h-[calc(100vh-69px)] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] border-b border-line2"
          >
            <div className="relative flex items-center justify-center overflow-hidden px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,120px)]">
              <GridTexture variant="half" />
              <div className="relative w-full max-w-[520px] text-center">
                <h1 className="m-0 text-[clamp(44px,5.4vw,76px)] leading-none font-normal tracking-[-0.04em]">
                  {intro.title}
                </h1>
                <p className="mx-auto mt-[26px] mb-0 max-w-[440px] text-[18px] leading-[1.55] text-sec">{intro.lede}</p>
                <div className="mt-16">
                  <div className="text-[13px] tracking-[-0.005em] text-mut">{intro.logosLabel}</div>
                  <LogoMarquee />
                </div>
              </div>
            </div>
            <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#DDE9EC] px-[clamp(20px,4vw,48px)] py-[clamp(56px,7vw,88px)]">
              {/* Decorative. The largest thing in the first screen at desktop widths, so it is
                  fetched first rather than lazily. */}
              <Image
                src={PANEL}
                alt=""
                fill
                sizes={PANEL_SIZES}
                quality={90}
                loading="eager"
                fetchPriority="high"
                className="object-cover object-[center_45%]"
              />
              <ContactForm />
              <p className="relative mt-6 mb-0 text-center text-[14.5px] tracking-[-0.005em] text-ink">
                {directLine.before}
                <a href={`mailto:${email}`} className="underline underline-offset-[3px]">
                  {email}
                </a>
              </p>
            </div>
          </section>
        </main>
        <Footer columns={footerColumns} extra={<PauseControl />} />
      </ContactMotion>
    </>
  );
}
