"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cog, Frame, PaintRoller, Tv, Wrench, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath, routes } from "@/lib/site";
import styles from "./works.module.css";

const icons: Record<string, LucideIcon> = {
  tv: Tv,
  paint: PaintRoller,
  zap: Zap,
  wrench: Wrench,
  frame: Frame,
  cog: Cog,
};

export function Works() {
  const works = useCms().copy.home.works;
  return (
    <section id="works" aria-labelledby="works-heading" className={styles.section} data-cms-photo="copy.home.works.backdrop">
      <Image
        src={assetPath(works.backdrop)}
        data-cms-src="copy.home.works.backdrop"
        alt=""
        fill
        sizes="100vw"
        quality={80}
        className={styles.backdrop}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.container}>
        <h2 id="works-heading" className={styles.heading}>
          <span data-cms="copy.home.works.headingLead">{works.headingLead}</span>{" "}
          <span className={styles.headingAccent} data-cms="copy.home.works.headingAccent">{works.headingAccent}</span>
        </h2>

        <ul className={styles.grid}>
          {works.cards.map((card, index) => {
            const Icon = icons[card.icon] ?? Wrench;
            const lines = card.lines.filter(Boolean);
            return (
              <li key={`${card.title}-${index}`}>
                <Link href={card.href} className={styles.card} data-cms-card={`works:${index}`}>
                  <Image
                    src={assetPath(card.src)}
                    alt={card.alt}
                    data-cms-src={`copy.home.works.cards.${index}.src`}
                    data-cms-alt={`copy.home.works.cards.${index}.alt`}
                    fill
                    sizes="(min-width: 1024px) 22rem, (min-width: 720px) 45vw, 92vw"
                    className={styles.cardImage}
                    style={{ objectPosition: card.position }}
                  />
                  <span className={styles.cardShade} aria-hidden="true" />
                  <span className={styles.cardBar}>
                    <span className={styles.cardLabel}>
                      <span className={styles.icon} aria-hidden="true">
                        <Icon size={18} strokeWidth={1.75} />
                      </span>
                      <span>
                        {lines.length > 0
                          ? lines.map((line, lineIndex) => (
                              <span key={`${line}-${lineIndex}`} className={styles.line} data-cms={`copy.home.works.cards.${index}.lines.${lineIndex}`}>
                                {line}
                              </span>
                            ))
                          : <span data-cms={`copy.home.works.cards.${index}.title`}>{card.title}</span>}
                      </span>
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <ArrowRight size={16} strokeWidth={1.75} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href={routes.portfolio} className={styles.projectsButton} data-cms="copy.home.works.explore">
          {works.explore}
        </Link>
      </div>
    </section>
  );
}
