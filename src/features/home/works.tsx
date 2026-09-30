import Link from "next/link";
import { ProjectCarousel } from "@/features/gallery";
import { routes } from "@/lib/site";
import styles from "./works.module.css";

export function Works() {
  return (
    <section id="works" aria-labelledby="works-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="works-heading" className={styles.heading}>
          Projects Completed
        </h2>
        <ProjectCarousel />
        <Link href={routes.portfolio} className={styles.projectsButton}>
          View projects
        </Link>
      </div>
    </section>
  );
}
