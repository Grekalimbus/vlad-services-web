import { trustItems } from "@/lib/content";
import styles from "./trust.module.css";

export function Trust() {
  return (
    <section id="trust" aria-labelledby="trust-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="trust-heading" className={styles.heading}>
          Clear work. California coverage.
        </h2>
        <ul className={styles.grid}>
          {trustItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <h3 className={styles.cardHeading}>{item.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
