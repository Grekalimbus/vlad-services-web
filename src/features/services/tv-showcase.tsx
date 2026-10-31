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
    <section className={styles.section} aria-label="TV mounting scenes">
      <div className={overview.container}>
        <ul
          className={`${overview.strip} ${overview.stripCompact}`}
          style={{ "--count": cards.length } as CSSProperties}
        >
          {cards.map((card, index) => (
            <li key={`${card.title}-${index}`} className={overview.item}>
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
                <span className={overview.shade} aria-hidden="true" />
                <span className={overview.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={overview.footer}>
                  <span className={overview.title} data-cms={`copy.tvShowcase.cards.${index}.title`}>
                    {card.title}
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
