"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuoteCta } from "@/features/quote";
import { assetPath } from "@/lib/site";
import styles from "./tv-gallery.module.css";

type Slide = {
  image: string;
  alt: string;
  position: string;
};

const cards: { title: string; slides: Slide[] }[] = [
  {
    title: "Fireplace TV Mount",
    slides: [
      {
        image: "/works/hero.jpg",
        alt: "Television mounted above a fireplace",
        position: "center 42%",
      },
      {
        image: "/works/tv-wood-wall.jpg",
        alt: "Television mounted on a wood feature wall",
        position: "72% 18%",
      },
    ],
  },
  {
    title: "Living Room TV Mount",
    slides: [
      {
        image: "/works/tv-living-blue.jpg",
        alt: "Television and soundbar mounted in a living room",
        position: "center 36%",
      },
      {
        image: "/works/tv-living-cream.jpg",
        alt: "Television mounted on a marble living room wall",
        position: "68% 42%",
      },
    ],
  },
  {
    title: "Bedroom TV Mount",
    slides: [
      {
        image: "/works/pexels-kitchen-tv.jpg",
        alt: "Bedroom interior prepared for a wall-mounted television",
        position: "center 48%",
      },
      {
        image: "/works/pexels-tv-black.jpg",
        alt: "Television in a relaxed seating area",
        position: "center 45%",
      },
    ],
  },
  {
    title: "Outdoor TV Mount",
    slides: [
      {
        image: "/works/gallery-wall.jpg",
        alt: "Wall-mounted television beside a view to the outdoors",
        position: "16% 40%",
      },
      {
        image: "/works/pexels-living2.jpg",
        alt: "Television beside tall windows opening outdoors",
        position: "32% 42%",
      },
    ],
  },
  {
    title: "Office TV Mount",
    slides: [
      {
        image: "/works/tv-office-wall.jpg",
        alt: "Television mounted on an office wall",
        position: "center 32%",
      },
      {
        image: "/works/interior-styled.jpg",
        alt: "Television at the edge of a finished interior",
        position: "88% 40%",
      },
    ],
  },
  {
    title: "Commercial TV Mount",
    slides: [
      {
        image: "/works/ceiling-fan-2.jpg",
        alt: "Television mounted in a dining and hospitality space",
        position: "12% 42%",
      },
      {
        image: "/works/tv-pexels.jpg",
        alt: "Television mounted on a brick wall for a group viewing",
        position: "center 40%",
      },
    ],
  },
];

export function TvGallery() {
  return (
    <section className={styles.section} aria-labelledby="tvs-gallery-heading">
      <div className={styles.inner}>
        <h2 id="tvs-gallery-heading" className={styles.heading}>
          TVs <span className={styles.accent}>Gallery</span>
        </h2>
        <ul className={styles.grid}>
          {cards.map((card) => (
            <GalleryCard key={card.title} title={card.title} slides={card.slides} />
          ))}
        </ul>
        <QuoteCta className={styles.book}>BOOK NOW</QuoteCta>
      </div>
    </section>
  );
}

function GalleryCard({ title, slides }: { title: string; slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState<{ leaving: number; direction: -1 | 1 } | null>(null);
  const count = slides.length;
  const slide = slides[index];
  const leaving = frame ? slides[frame.leaving] : null;

  function go(next: number, direction: -1 | 1) {
    if (next === index || frame) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setFrame({ leaving: index, direction });
    setIndex(next);
  }

  return (
    <li className={styles.card}>
      {leaving ? (
        <Image
          key={`${leaving.image}-out`}
          src={assetPath(leaving.image)}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
          className={frame?.direction === 1 ? styles.leaveLeft : styles.leaveRight}
          style={{ objectPosition: leaving.position }}
        />
      ) : null}
      <Image
        key={slide.image}
        src={assetPath(slide.image)}
        alt={slide.alt}
        fill
        sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
        className={
          frame ? (frame.direction === 1 ? styles.enterRight : styles.enterLeft) : styles.image
        }
        style={{ objectPosition: slide.position }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setFrame(null);
        }}
      />
      <span className={styles.shade} aria-hidden="true" />
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
      <span className={styles.bar}>
        <span className={styles.title}>{title}</span>
        <span className={styles.pager}>
          {slides.map((item, dotIndex) => (
            <button
              key={item.image}
              type="button"
              className={dotIndex === index ? styles.dotActive : styles.dot}
              aria-label={`${title}, photo ${dotIndex + 1} of ${count}`}
              aria-current={dotIndex === index ? "true" : undefined}
              onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
            />
          ))}
        </span>
      </span>
    </li>
  );
}
