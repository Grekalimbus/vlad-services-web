import { AreasSection } from "@/features/areas";
import { DealsSignup, Faq, Hero, ServicesOverview, Trust, Works } from "@/features/home";
import { Reviews } from "@/features/reviews";
import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { metadataFor } from "@/lib/seo-metadata";
import { pageMeta } from "@/lib/seo";
import { Footer } from "@/shared/layout";
import { JsonLd } from "@/shared/seo";
import styles from "./page.module.css";

export function generateMetadata() {
  return metadataFor("/");
}

export default async function Home() {
  const cms = await bindCms();
  return (
    <CmsPage>
      <JsonLd data={pageMeta("/", cms).jsonLd} />
      <Hero />
      <div className={styles.homeContent}>
        <main id="content">
          <div className={styles.introBand}>
            <IntroAtmosphere />
            <ServicesOverview />
            <Trust />
          </div>
          <Reviews />
          <Works />
          <div className={styles.introBand}>
            <IntroAtmosphere />
            <Faq />
            <AreasSection id="areas" />
            <DealsSignup />
          </div>
        </main>
        <Footer />
      </div>
    </CmsPage>
  );
}

function IntroAtmosphere() {
  return (
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
  );
}
