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
            <div className={styles.atmosphere} aria-hidden="true">
              <span className={styles.wash} />
              <span className={`${styles.arc} ${styles.arcTl}`} />
              <span className={`${styles.arc} ${styles.arcTlInner}`} />
              <span className={`${styles.arc} ${styles.arcTr}`} />
              <span className={`${styles.arc} ${styles.arcTrInner}`} />
              <span className={`${styles.arc} ${styles.arcBl}`} />
              <span className={`${styles.arc} ${styles.arcBr}`} />
              <span className={`${styles.arc} ${styles.arcBrInner}`} />
            </div>
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
