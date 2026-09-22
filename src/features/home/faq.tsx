import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/content";
import styles from "./faq.module.css";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="faq-heading" className={styles.heading}>
          QUESTIONS &amp; ANSWERS
        </h2>
        <div className={styles.list}>
          {faqs.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.summary}>
                {item.q}
                <ChevronDown size={18} aria-hidden="true" className={styles.chevron} />
              </summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
