import { DealsSignup } from "@/components/deals-signup";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Reviews } from "@/components/reviews";
import { ServicesOverview } from "@/components/services-overview";
import { Trust } from "@/components/trust";
import { Works } from "@/components/works";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <div className="relative bg-background">
        <main id="content">
          <ServicesOverview />
          <Trust />
          <Works />
          <Reviews />
          <Faq />
          <DealsSignup />
        </main>
        <Footer />
      </div>
    </>
  );
}
