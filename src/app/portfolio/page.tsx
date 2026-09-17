import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { site } from "@/lib/site";

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
      <div className="container-page py-16 md:py-24">
        <PortfolioBrowser />
      </div>
    </PageFrame>
  );
}
