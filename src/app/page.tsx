import { Capabilities } from "@/components/home/Capabilities";
import { ClosingCta } from "@/components/home/ClosingCta";
import { Footer } from "@/components/home/Footer";
import { FooterImage } from "@/components/home/FooterImage";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { Industries } from "@/components/home/Industries";
import { Intro } from "@/components/home/Intro";
import { Model } from "@/components/home/Model";
import { Playbooks } from "@/components/home/Playbooks";
import { Stack } from "@/components/home/Stack";
import { Team } from "@/components/home/Team";
import { Work } from "@/components/home/Work";

export default function Home() {
  return (
    <>
      <Intro />
      <div>
        <Header />
        <main>
          <Hero />
          <Model />
          <Capabilities />
          <Industries />
          <Work />
          <Stack />
          <Team />
          <Playbooks />
          <ClosingCta />
          {/* Inside main: its h2 and "Book a call" are page content, and outside every
              landmark they were skipped by landmark navigation. */}
          <FooterImage />
        </main>
        <Footer />
      </div>
    </>
  );
}
