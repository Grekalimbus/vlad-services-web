import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { QuoteCta } from "@/components/cta";
import { ServiceCategoryCard } from "@/components/service-category-card";
import { buttonPrimaryClass } from "@/lib/forms";
import { featuredCategories } from "@/lib/services";
import { site } from "@/lib/site";

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
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {featuredCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} heading="h2" />
          ))}
        </div>

        <div className="mt-10">
          <QuoteCta className={buttonPrimaryClass} />
        </div>
      </div>
    </PageFrame>
  );
}
