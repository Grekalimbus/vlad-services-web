import { DealsSignup, Faq, Hero, ServicesOverview, Trust, Works } from "@/features/home";
import { Reviews } from "@/features/reviews";
import { Footer } from "@/shared/layout";
import { JsonLd } from "@/shared/seo";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Hero />
      <div className={styles.homeContent}>
        <main id="content">
          <div className={styles.introBand}>
            <ServicesOverview />
            <Trust />
          </div>
          <Reviews />
          <Works />
          <Faq />
          <DealsSignup />
        </main>
        <Footer />
      </div>
    </>
  );
}
