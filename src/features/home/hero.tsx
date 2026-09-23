import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { QuoteCta } from "@/features/quote";
import { assetPath } from "@/lib/site";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className={styles.section}
    >
      <Image
        src={assetPath("/works/hero.jpg")}
        alt="Finished living room with a wall-mounted television"
        fill
        priority
        quality={75}
        sizes="100vw"
        className={styles.background}
      />
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
              <span className={styles.line}>Tell Us About Your Project</span>
              <span className={styles.line}>
                & Get <strong className={styles.discount}>$30</strong> OFF Your Service
              </span>
            </h1>

            <p className={styles.tagline}>
              Fast Response • Same-Day Availability • High Quality Service
            </p>

            <div className={styles.actions}>
              <QuoteCta className={styles.startButton}>
                LET&apos;S START
              </QuoteCta>
              <a
                href="#services"
                className={styles.scrollCue}
                aria-label="Scroll to services"
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
