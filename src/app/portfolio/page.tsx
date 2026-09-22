import type { Metadata } from "next";
import { PageFrame } from "@/shared/layout";
import { PortfolioBrowser } from "@/features/gallery";
import { site } from "@/lib/site";
import styles from "@/styles/shared.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: `Project gallery for ${site.legalName}: TV mounting, electrical, and handyman work.`,
};

export default function PortfolioPage() {
  return (
    <PageFrame
      eyebrow="Projects"
      title="Project gallery"
      description="TV mounting, electrical, and general handyman work. Browse by category."
    >
      <div className={styles.pageContent}>
        <PortfolioBrowser />
      </div>
    </PageFrame>
  );
}
