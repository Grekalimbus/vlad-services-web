import Link from "next/link";
import { MediaPlaceholder, ProjectCarousel } from "@/features/gallery";
import { itemsInCategory } from "@/lib/gallery";
import { routes } from "@/lib/site";
import styles from "./works.module.css";

export function Works() {
  const beforeAfter = itemsInCategory("before-after");

  return (
    <section id="works" aria-labelledby="works-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="works-heading" className={styles.heading}>
          OUR RECENT WORK
        </h2>
        <p className={styles.intro}>Real projects. Real results.</p>
        <ProjectCarousel />
        <div className={styles.beforeAfter}>
          <h3 className={styles.subheading}>Before &amp; After Projects</h3>
          <div className={styles.grid}>
            {beforeAfter.map((entry) => (
              <MediaPlaceholder
                key={entry.id}
                label={entry.title}
                variant="split"
                beforeSrc={entry.beforeSrc}
                afterSrc={entry.afterSrc}
                beforeAlt={`Before: ${entry.title}`}
                afterAlt={`After: ${entry.title}`}
              />
            ))}
          </div>
        </div>
        <Link href={routes.portfolio} className={styles.projectsButton}>
          View projects
        </Link>
      </div>
    </section>
  );
}
