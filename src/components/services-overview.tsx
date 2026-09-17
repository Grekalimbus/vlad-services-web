import Link from "next/link";
import { ServiceCategoryCard } from "@/components/service-category-card";
import { featuredCategories } from "@/lib/services";
import { routes } from "@/lib/site";

export function ServicesOverview() {
  return (
    <section id="services" aria-labelledby="services-heading" className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Services</p>
            <h2
              id="services-heading"
              className="mt-4 max-w-[18ch] text-4xl font-medium tracking-[-0.03em] md:text-5xl"
            >
              Three ways we help around the house
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-muted-foreground md:col-span-5">
            TV mounting, electrical, and general handyman work. Each opens to its own page with
            the details for that job.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {featuredCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>

        <p className="mt-8">
          <Link href={routes.services} className="text-sm font-medium text-accent">
            All services
          </Link>
        </p>
      </div>
    </section>
  );
}
