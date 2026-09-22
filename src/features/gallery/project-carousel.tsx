"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { galleryItems } from "@/lib/gallery";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";
import styles from "./project-carousel.module.css";

const timing = [2000, 3000, 5000, 10000, 10000, 10000];

export function ProjectCarousel() {
  const slides = useMemo(() => {
    const available = galleryItems.flatMap((item) => {
      const images = [
        item.src ? { src: item.src, alt: item.alt, title: item.title } : null,
        item.beforeSrc
          ? { src: item.beforeSrc, alt: `Before: ${item.title}`, title: item.title }
          : null,
        item.afterSrc
          ? { src: item.afterSrc, alt: `After: ${item.title}`, title: item.title }
          : null,
      ];
      return images.filter((image): image is NonNullable<typeof image> => Boolean(image));
    });
    return Array.from({ length: 20 }, (_, index) => available[index % available.length]);
  }, []);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const delay = timing[Math.min(active, timing.length - 1)];

  useEffect(() => {
    if (paused) return;
    const timeout = window.setTimeout(() => {
      setPrevious(active);
      setActive((active + 1) % slides.length);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [active, delay, paused, slides.length]);

  useEffect(() => {
    if (previous === null) return;
    const timeout = window.setTimeout(() => setPrevious(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [active, previous]);

  function move(step: number) {
    setPrevious(active);
    setActive((active + step + slides.length) % slides.length);
  }

  const slide = slides[active];
  const previousSlide = previous === null ? null : slides[previous];

  return (
    <div className={styles.carousel}>
      <div className={styles.viewport}>
        {previousSlide ? (
          <div
            key={`previous-${previous}-${active}`}
            className={`${styles.slide} ${styles.slideExit}`}
            aria-hidden="true"
          >
            <Image
              src={assetPath(previousSlide.src)}
              alt=""
              fill
              sizes="(min-width: 1152px) 64rem, 100vw"
              className={styles.image}
            />
          </div>
        ) : null}
        <div key={`active-${active}`} className={`${styles.slide} ${styles.slideEnter}`}>
          <Image
            src={assetPath(slide.src)}
            alt={slide.alt}
            fill
            sizes="(min-width: 1152px) 64rem, 100vw"
            className={styles.image}
            style={{ animationDuration: `${delay + 1200}ms` }}
            priority={active === 0}
          />
        </div>
        <div className={styles.captionOverlay}>
          <p key={active} className={styles.caption}>
            {slide.title}
          </p>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <span
            key={`${active}-${paused}`}
            className={styles.progress}
            style={{
              animationDuration: `${delay}ms`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => move(-1)}
          className={styles.previous}
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span className={shared.visuallyHidden}>Previous project</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          className={styles.next}
        >
          <ChevronRight size={20} aria-hidden="true" />
          <span className={shared.visuallyHidden}>Next project</span>
        </button>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className={styles.pause}
          aria-label={paused ? "Play project carousel" : "Pause project carousel"}
        >
          {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
        </button>
        <p className={styles.counter} aria-live="polite">
          {active + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
}
