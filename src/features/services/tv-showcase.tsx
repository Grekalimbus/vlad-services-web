"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { tvShowcaseCards } from "@/lib/cms/tv-page";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import overview from "@/features/home/services-overview.module.css";
import styles from "./tv-showcase.module.css";

export function TvShowcase() {
  const cms = useCms();
  const cards = tvShowcaseCards(cms);

  return (
    <section className={styles.section} aria-labelledby="mount-types-heading">
      <div className={`${overview.container} ${styles.frame}`}>
        <h2 id="mount-types-heading" className={styles.heading}>
          Mount Types We Install
        </h2>
        <ul
          className={`${overview.strip} ${overview.stripCompact} ${styles.grid}`}
          style={{ "--count": cards.length } as CSSProperties}
        >
          {cards.map((card, index) => (
            <li key={`${card.title}-${index}`} className={`${overview.item} ${styles.item}`}>
              <div className={`${overview.card} ${overview.cardStatic}`} data-cms-card={`tvShowcase:${index}`}>
                {card.image ? (
                  <Image
                    src={assetPath(card.image)}
                    alt={card.alt}
                    data-cms-alt={`copy.tvShowcase.cards.${index}.alt`}
                    fill
                    unoptimized={card.image.startsWith("/api/media/")}
                    sizes="(min-width: 900px) 24vw, 100vw"
                    className={overview.image}
                    style={{ objectPosition: card.position || "center" }}
                    data-cms-src={`copy.tvShowcase.cards.${index}.image`}
                  />
                ) : null}
                <span className={`${overview.shade} ${styles.shade}`} aria-hidden="true" />
                <span className={overview.footer}>
                  <span className={styles.copy}>
                    <span className={overview.title} data-cms={`copy.tvShowcase.cards.${index}.title`}>
                      {card.title}
                    </span>
                    <span className={styles.note} data-cms={`copy.tvShowcase.cards.${index}.text`}>
                      {card.text}
                    </span>
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
