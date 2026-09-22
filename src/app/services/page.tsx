import type { Metadata } from "next";
import { PageFrame } from "@/shared/layout";
import { QuoteCta } from "@/features/quote";
import { ServiceCategoryCard } from "@/features/services";
import { buttonPrimaryClass } from "@/lib/forms";
import { featuredCategories } from "@/lib/services";
import { site } from "@/lib/site";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description: `TV mounting, electrical, and general handyman services from ${site.legalName} across Southern California.`,
};

export default function ServicesPage() {
  return (
    <PageFrame
      eyebrow="Services"
      title="TV mounting, electrical, and handyman work"
      description="Three primary services. Open a section for the details that belong with that job."
    >
      <div className={styles.page}>
        <div className={styles.categoryGrid}>
          {featuredCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} heading="h2" />
          ))}
        </div>

        <div className={styles.ctaWrap}>
          <QuoteCta className={buttonPrimaryClass} />
        </div>
      </div>
    </PageFrame>
  );
}
