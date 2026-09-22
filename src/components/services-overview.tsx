import { ServiceCategoryCard } from "@/components/service-category-card";
import { featuredCategories } from "@/lib/services";

export function ServicesOverview() {
  return (
    <section id="services" aria-labelledby="services-heading" className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <h2
          id="services-heading"
          className="text-4xl font-medium tracking-[-0.03em] md:text-5xl"
        >
          Three ways we help around the house
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {featuredCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
