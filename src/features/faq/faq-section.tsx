import { ChevronDown } from "lucide-react";
import styles from "./faq.module.css";

export type FaqItem = {
  q: string;
  a: string;
};

export function FaqSection({
  id = "faq",
  headingId = "faq-heading",
  headingLead,
  headingAccent,
  items,
  paths,
}: {
  id?: string;
  headingId?: string;
  headingLead: string;
  headingAccent: string;
  items: FaqItem[];
  paths?: {
    headingLead?: string;
    headingAccent?: string;
    item?: (index: number, field: "q" | "a") => string;
  };
}) {
  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <div className={styles.container}>
        <h2 id={headingId} className={styles.heading}>
          <span data-cms={paths?.headingLead}>{headingLead}</span>{" "}
          <span className={styles.headingAccent} data-cms={paths?.headingAccent}>
            {headingAccent}
          </span>
        </h2>
        <div className={styles.list}>
          {items.map((item, index) => (
            <details key={`${item.q}-${index}`} className={styles.item}>
              <summary className={styles.summary}>
                <span data-cms={paths?.item?.(index, "q")}>{item.q}</span>
                <ChevronDown size={18} aria-hidden="true" className={styles.chevron} />
              </summary>
              <p className={styles.answer} data-cms={paths?.item?.(index, "a")}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
