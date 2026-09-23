import { ServiceCategoryCard } from "@/features/services";
import { featuredCategories } from "@/lib/services";
import styles from "./services-overview.module.css";

export function ServicesOverview() {
  return (
    <section id="services" aria-labelledby="services-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="services-heading" className={styles.heading}>
          SERVICES
        </h2>
        <div className={styles.grid}>
          {featuredCategories.map((category) => (
            <ServiceCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
