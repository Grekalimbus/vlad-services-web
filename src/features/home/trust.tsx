import { BadgeCheck, BadgeDollarSign, Clock, Tv } from "lucide-react";
import { trustItems } from "@/lib/content";
import styles from "./trust.module.css";

const icons = {
  guarantee: BadgeCheck,
  response: Clock,
  tvs: Tv,
  pricing: BadgeDollarSign,
} as const;

export function Trust() {
  return (
    <section id="trust" aria-labelledby="trust-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="trust-heading" className={styles.heading}>
          WHY CHOOSE PRIMEFIX?
        </h2>
        <p className={styles.intro}>
          Professional home services you can count on — from small fixes to bigger projects.
        </p>
        <ul className={styles.grid}>
          {trustItems.map((item) => {
            const Icon = icons[item.id];
            return (
              <li key={item.id} className={styles.item}>
                <Icon className={styles.icon} size={22} strokeWidth={1.5} aria-hidden="true" />
                <h3 className={styles.cardHeading}>{item.title}</h3>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
