"use client";

import Image from "next/image";
import { useCms } from "@/lib/cms/use-cms";
import { HashLink } from "@/shared/layout/hash-link";
import { assetPath } from "@/lib/site";
import styles from "./hero.module.css";

export function Hero() {
  const cms = useCms();
  const hero = cms.copy.home.hero;

  return (
    <section id="top" aria-labelledby="hero-heading" className={styles.section}>
      <Image
        src={assetPath("/hero/tools-background.jpg")}
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.backdrop}
      />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.layout}>
        <div className={styles.copy}>
          <h1 id="hero-heading" className={styles.heading}>
            <span className={styles.line} data-cms="copy.home.hero.line1">{hero.line1}</span>
            <span className={styles.line}>
              <span data-cms="copy.home.hero.line2Lead">{hero.line2Lead}</span>{" "}
              <strong className={styles.discount} data-cms="copy.home.hero.discount">{hero.discount}</strong>{" "}
              <span data-cms="copy.home.hero.line2Tail">{hero.line2Tail}</span>
            </span>
          </h1>

          <p className={styles.tagline} data-cms="copy.home.hero.tagline">
            {hero.tagline}
          </p>

          <div className={styles.actions}>
            <HashLink href="/#services" className={styles.startButton}>
              <span data-cms="ctas.letsStart">{cms.ctas.letsStart}</span>
            </HashLink>
          </div>
        </div>

        <div className={styles.figure} aria-hidden="true">
          <Image
            src={assetPath("/hero/builder.webp")}
            alt=""
            width={1006}
            height={964}
            priority
            unoptimized
            className={styles.builder}
          />
        </div>
      </div>
    </section>
  );
}
