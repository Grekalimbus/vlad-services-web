"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuoteCta } from "@/features/quote";
import { PhotoLightbox } from "@/features/gallery/photo-lightbox";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./tv-gallery.module.css";

type Slide = {
  image: string;
  alt: string;
  position: string;
};

export function TvGallery() {
  const copy = useCms().copy.tvGallery;
  return (
    <section className={styles.section} aria-labelledby="tvs-gallery-heading">
      <div className={styles.inner}>
        <h2 id="tvs-gallery-heading" className={styles.heading}>
          <span data-cms="copy.tvGallery.headingLead">{copy.headingLead}</span>{" "}
          <span className={styles.accent} data-cms="copy.tvGallery.headingAccent">{copy.headingAccent}</span>
        </h2>
        <ul className={styles.grid}>
          {copy.cards.map((card, index) => (
            <GalleryCard
              key={`${card.title}-${index}`}
              title={card.title}
              titlePath={`copy.tvGallery.cards.${index}.title`}
              galleryPath={`slides:copy.tvGallery.cards.${index}.slides`}
              slides={card.slides}
            />
          ))}
        </ul>
        <QuoteCta className={styles.book}>
          <span data-cms="copy.tvGallery.book">{copy.book}</span>
        </QuoteCta>
      </div>
    </section>
  );
}

function GalleryCard({
  title,
  titlePath,
  galleryPath,
  slides,
}: {
  title: string;
  titlePath: string;
  galleryPath: string;
  slides: Slide[];
}) {
  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState<{ leaving: number; direction: -1 | 1 } | null>(null);
  const [zoom, setZoom] = useState(false);
  const editing = useEditing();
  const count = slides.length;
  const safeIndex = count === 0 ? 0 : Math.min(index, count - 1);
  const slide = slides[safeIndex];
  const leaving = frame ? slides[frame.leaving] : null;

  function go(next: number, direction: -1 | 1) {
    if (next === index || frame) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setFrame({ leaving: index, direction });
    setIndex(next);
  }

  return (
    <li className={styles.card} data-cms-gallery={galleryPath} data-empty={slide ? undefined : ""}>
      {slide ? (
        <>
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
        style={{ objectPosition: slide.position, cursor: editing ? undefined : "pointer" }}
        onClick={() => {
          if (!editing) setZoom(true);
        }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setFrame(null);
        }}
      />
      <span className={styles.shade} aria-hidden="true" />
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
        </>
      ) : null}
      <span className={styles.bar}>
        <span className={styles.title} data-cms={titlePath}>{title}</span>
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
        </>
      ) : null}
      {zoom ? (
        <PhotoLightbox photos={slides} index={safeIndex} onIndex={setIndex} onClose={() => setZoom(false)} />
      ) : null}
    </li>
  );
}
