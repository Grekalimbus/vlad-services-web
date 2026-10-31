"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { additionalSlides, type TvSlide } from "@/lib/cms/tv-page";
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
              <li key={`${card.title}-${index}`} className={styles.card}>
                <CardReel
                  title={card.title}
                  slides={additionalSlides(card, index)}
                  galleryPath={`slides:copy.additionals.cards.${index}.slides`}
                />
                <div className={styles.copy} data-cms-card={`additional:${index}`}>
                  <h3 className={styles.title} data-cms={`copy.additionals.cards.${index}.title`}>{card.title}</h3>
                  <p className={styles.text} data-cms={`copy.additionals.cards.${index}.text`}>{card.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CardReel({
  title,
  slides,
  galleryPath,
}: {
  title: string;
  slides: TvSlide[];
  galleryPath: string;
}) {
  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState<{ leaving: number; direction: -1 | 1 } | null>(null);
  const count = slides.length;
  const safeIndex = count === 0 ? 0 : Math.min(index, count - 1);
  const slide = slides[safeIndex];
  const leaving = frame ? slides[frame.leaving] : null;

  function go(next: number, direction: -1 | 1) {
    if (next === index || frame || count < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setFrame({ leaving: index, direction });
    setIndex(next);
  }

  return (
    <div
      className={styles.media}
      data-cms-gallery={galleryPath}
      data-empty={slide ? undefined : ""}
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
    >
      {slide ? (
        <>
          {leaving ? (
            <Image
              key={`${leaving.image}-out`}
              src={assetPath(leaving.image)}
              alt=""
              fill
              unoptimized={leaving.image.startsWith("/api/media/")}
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
              className={frame?.direction === 1 ? styles.leaveLeft : styles.leaveRight}
              style={{ objectPosition: leaving.position }}
            />
          ) : null}
          <Image
            key={`${slide.image}-${safeIndex}`}
            src={assetPath(slide.image)}
            alt={slide.alt}
            fill
            unoptimized={slide.image.startsWith("/api/media/")}
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
            className={frame ? (frame.direction === 1 ? styles.enterRight : styles.enterLeft) : styles.image}
            style={{ objectPosition: slide.position }}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) setFrame(null);
            }}
          />
          {count > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev}`}
                aria-label={`Previous photo, ${title}`}
                onClick={() => go((index - 1 + count) % count, -1)}
              >
                <ChevronLeft size={18} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                aria-label={`Next photo, ${title}`}
                onClick={() => go((index + 1) % count, 1)}
              >
                <ChevronRight size={18} strokeWidth={2.25} />
              </button>
              <span className={styles.pager}>
                {slides.map((item, dotIndex) => (
                  <button
                    key={`${item.image}-${dotIndex}`}
                    type="button"
                    className={dotIndex === safeIndex ? styles.dotActive : styles.dot}
                    aria-label={`${title}, photo ${dotIndex + 1} of ${count}`}
                    aria-current={dotIndex === safeIndex ? "true" : undefined}
                    onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
                  />
                ))}
              </span>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
