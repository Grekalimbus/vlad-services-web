"use client";

import { ChevronDown } from "lucide-react";
import { useCms } from "@/lib/cms/use-cms";
import styles from "./faq.module.css";

export function Faq() {
  const cms = useCms();
  const heading = cms.copy.home.faq;
  const faqs = cms.faqs;
  return (
    <section id="faq" aria-labelledby="faq-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="faq-heading" className={styles.heading}>
          <span data-cms="copy.home.faq.headingLead">{heading.headingLead}</span>{" "}
          <span className={styles.headingAccent} data-cms="copy.home.faq.headingAccent">{heading.headingAccent}</span>
        </h2>
        <div className={styles.list}>
          {faqs.map((item, index) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.summary}>
                <span data-cms={`faqs.${index}.q`}>{item.q}</span>
                <ChevronDown size={18} aria-hidden="true" className={styles.chevron} />
              </summary>
              <p className={styles.answer} data-cms={`faqs.${index}.a`}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
