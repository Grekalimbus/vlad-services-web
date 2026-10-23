"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { QuoteCta } from "@/features/quote";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./hero.module.css";

const NEXT_IMAGE = "/works/tv-living-blue.jpg";
const NEXT_ALT = "Large wall-mounted television with a soundbar";

export function Hero() {
  const cms = useCms();
  const hero = cms.copy.home.hero;
  const slides = [
    {
      src: hero.image,
      alt: hero.imageAlt,
      srcPath: "copy.home.hero.image",
      altPath: "copy.home.hero.imageAlt",
    },
    {
      src: hero.imageNext || NEXT_IMAGE,
      alt: hero.imageNextAlt || NEXT_ALT,
      srcPath: "copy.home.hero.imageNext",
      altPath: "copy.home.hero.imageNextAlt",
    },
  ].filter((slide, index, all) => slide.src && all.findIndex((item) => item.src === slide.src) === index);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className={styles.section}
      data-cms-photo="copy.home.hero.image"
    >
      <div className={styles.slides} aria-hidden="true">
        {slides.map((slide, index) => (
          <Image
            key={slide.srcPath}
            src={assetPath(slide.src)}
            alt={slide.alt}
            data-cms-src={slide.srcPath}
            data-cms-alt={slide.altPath}
            fill
            priority={index === 0}
            quality={75}
            sizes="100vw"
            className={index === active ? `${styles.background} ${styles.visible}` : styles.background}
          />
        ))}
      </div>
      <div
        className={styles.overlay}
        aria-hidden="true"
      />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.copy}>
            <h1
              id="hero-heading"
              className={styles.heading}
            >
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
              <QuoteCta className={styles.startButton}>
                <span data-cms="ctas.letsStart">{cms.ctas.letsStart}</span>
              </QuoteCta>
              <a
                href="#services"
                className={styles.scrollCue}
                aria-label={hero.scrollLabel}
                data-cms-aria="copy.home.hero.scrollLabel"
              >
                <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
