"use client";

import Image from "next/image";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./additionals.module.css";

export function Additionals() {
  const copy = useCms().copy.additionals;
  return (
    <section className={styles.section} aria-labelledby="additionals-heading">
      <svg
        className={styles.wave}
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          d="M0,34 C280,40 460,74 720,76 C1000,78 1220,26 1440,18"
        />
      </svg>

      <div className={styles.body}>
        <div className={styles.inner}>
          <h2 id="additionals-heading" className={styles.heading}>
            <span data-cms="copy.additionals.headingLead">{copy.headingLead}</span>
            <span className={styles.accent} data-cms="copy.additionals.headingAccent">{copy.headingAccent}</span>
          </h2>
          <ul className={styles.grid}>
            {copy.cards.map((card, index) => (
              <li key={`${card.title}-${index}`} className={styles.card} data-cms-card={`additional:${index}`}>
                <div className={styles.media}>
                  <Image
                    src={assetPath(card.image)}
                    alt={card.alt}
                    data-cms-src={`copy.additionals.cards.${index}.image`}
                    data-cms-alt={`copy.additionals.cards.${index}.alt`}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                    className={styles.image}
                    style={{ objectPosition: card.position }}
                  />
                </div>
                <h3 className={styles.title} data-cms={`copy.additionals.cards.${index}.title`}>{card.title}</h3>
                <p className={styles.text} data-cms={`copy.additionals.cards.${index}.text`}>{card.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
