import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Plan } from "@/components/plan";
import { TvMounting } from "@/components/tv-mounting";
import { Works } from "@/components/works";

export default function Home() {
  return (
    <>
      <JsonLd />
      <div className="sticky top-0 z-0">
        <Hero />
      </div>
      <div className="relative z-10 bg-background shadow-[0_-24px_64px_rgb(23_23_23/0.22)]">
        <main id="content">
          <Plan />
          <TvMounting />
          <Works />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
