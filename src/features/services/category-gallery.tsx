"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuoteCta } from "@/features/quote";
import { PhotoLightbox } from "@/features/gallery/photo-lightbox";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./category-landing.module.css";

type Slide = {
  image: string;
  alt: string;
  position?: string;
  title?: string;
};

type Offer = {
  title: string;
  description: string;
  slides: Slide[];
};

function offersFor(categoryId: string, offers: ReturnType<typeof useCms>["copy"]["offers"]): Offer[] {
  const list = (offers as unknown as Record<string, Offer[] | undefined>)[categoryId];
  return Array.isArray(list) ? list : [];
}

export function OfferGrid({ categoryId }: { categoryId: string }) {
  const cms = useCms();
  const cards = offersFor(categoryId, cms.copy.offers);
  const ui = cms.copy.offers;
  if (cards.length === 0) return null;

  return (
    <section className={styles.offers} aria-label="Services">
      <ul className={styles.grid}>
        {cards.map((card, index) => (
          <OfferCard key={`${card.title}-${index}`} offer={card} categoryId={categoryId} index={index} />
        ))}
      </ul>
      <QuoteCta className={styles.book}>
        <span data-cms="copy.offers.book">{ui.book}</span>
      </QuoteCta>
    </section>
  );
}

function OfferCard({ offer, categoryId, index }: { offer: Offer; categoryId: string; index: number }) {
  const ui = useCms().copy.offers;
  const editing = useEditing();
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const galleryPath = `slides:copy.offers.${categoryId}.${index}.slides`;
  const description = offer.description ?? "";
  const missing = description.trim() === "";
  const showDetail = open || (editing && missing);

  return (
    <li className={styles.card}>
      <SlideStage slides={offer.slides} label={offer.title} galleryPath={galleryPath} />
      <div className={styles.cardCopy} data-cms-card={`offer:${categoryId}:${index}`}>
        <h2 className={styles.cardTitle} data-cms={`copy.offers.${categoryId}.${index}.title`}>{offer.title}</h2>
        <button
          type="button"
          className={styles.more}
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((value) => !value)}
        >
          <span data-cms={open ? "copy.offers.showLess" : "copy.offers.showMore"}>
            {open ? ui.showLess : ui.showMore}
          </span>
        </button>
        <p
          id={detailId}
          className={missing ? `${styles.detail} ${styles.detailEmpty}` : styles.detail}
          hidden={!showDetail}
          data-cms={`copy.offers.${categoryId}.${index}.description`}
        >
          {description}
        </p>
      </div>
    </li>
  );
}

export function PhotoFeature({
  name,
  namePath,
  slides,
  galleryPath,
  compact = false,
  body = "",
  bodyPath,
}: {
  name: string;
  namePath?: string;
  slides: Slide[];
  galleryPath: string;
  compact?: boolean;
  body?: string;
  bodyPath?: string;
}) {
  const editing = useEditing();
  const offers = useCms().copy.offers;
  if (slides.length === 0 && !editing && !body) return null;
  const headingId = `${name.toLowerCase().replace(/\s+/g, "-")}-photos-heading`;
  const showReel = slides.length > 0 || editing;
  const heading = (
    <h2 id={headingId} className={styles.heading}>
      <span data-cms={namePath}>{name}</span> <span className={styles.accent} data-cms="copy.offers.photosAccent">{offers.photosAccent}</span>
    </h2>
  );

  return (
    <section className={compact ? `${styles.photos} ${styles.photosCompact}` : styles.photos} aria-labelledby={headingId}>
      {compact ? null : heading}
      {showReel ? (
        <div className={compact ? styles.compactFrame : styles.feature}>
          <SlideStage slides={slides} label={`${name} photos`} large compact={compact} galleryPath={galleryPath} />
        </div>
      ) : null}
      {compact ? (
        <>
          {heading}
          {body ? (
            <div className={styles.dealsCopy} data-cms={bodyPath}>
              {body
                .split(/\n\n+/)
                .map((block) => block.trim())
                .filter(Boolean)
                .map((block) => (
                  <p key={block.slice(0, 32)}>{block}</p>
                ))}
            </div>
          ) : null}
        </>
      ) : null}
      <QuoteCta className={styles.book}>
        <span data-cms="copy.offers.book">{offers.book}</span>
      </QuoteCta>
    </section>
  );
}

function SlideStage({
  slides,
  label,
  large = false,
  compact = false,
  galleryPath,
}: {
  slides: Slide[];
  label: string;
  large?: boolean;
  compact?: boolean;
  galleryPath: string;
}) {
  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState<{ leaving: number; direction: -1 | 1 } | null>(null);
  const [zoom, setZoom] = useState(false);
  const editing = useEditing();
  const count = slides.length;
  if (index >= count && index !== 0) setIndex(0);
  const slide = slides[Math.min(index, Math.max(count - 1, 0))];
  const leaving = frame ? slides[frame.leaving] : null;
  const sizes = compact
    ? "(min-width: 720px) 600px, 100vw"
    : large
      ? "(min-width: 1024px) 72rem, 100vw"
      : "(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw";

  function go(next: number, direction: -1 | 1) {
    if (!slide || next === index || frame || count < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setFrame({ leaving: index, direction });
    setIndex(next);
  }

  return (
    <>
    <div className={compact ? styles.featureCompact : large ? styles.featureMedia : styles.media} data-cms-gallery={galleryPath} data-empty={slide ? undefined : ""}>
      {slide ? (
        <>
      {leaving ? (
        <Image
          key={`${leaving.image}-out`}
          src={assetPath(leaving.image)}
          alt=""
          fill
          sizes={sizes}
          className={frame?.direction === 1 ? styles.leaveLeft : styles.leaveRight}
          style={{ objectPosition: leaving.position ?? "center" }}
        />
      ) : null}
      <Image
        key={`${slide.image}-${index}`}
        src={assetPath(slide.image)}
        alt={slide.alt}
        fill
        sizes={sizes}
        className={
          frame ? (frame.direction === 1 ? styles.enterRight : styles.enterLeft) : styles.image
        }
        style={{ objectPosition: slide.position ?? "center", cursor: large && !editing ? "pointer" : undefined }}
        onClick={() => {
          if (large && !editing) setZoom(true);
        }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setFrame(null);
        }}
      />
      {count > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label={`Previous photo, ${label}`}
            onClick={() => go((index - 1 + count) % count, -1)}
          >
            <ChevronLeft size={18} strokeWidth={2.25} />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            aria-label={`Next photo, ${label}`}
            onClick={() => go((index + 1) % count, 1)}
          >
            <ChevronRight size={18} strokeWidth={2.25} />
          </button>
          <span className={styles.pager}>
            {slides.map((item, dotIndex) => (
              <button
                key={`${item.image}-${dotIndex}`}
                type="button"
                className={dotIndex === index ? styles.dotActive : styles.dot}
                aria-label={`${label}, photo ${dotIndex + 1} of ${count}`}
                aria-current={dotIndex === index ? "true" : undefined}
                onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
              />
            ))}
          </span>
        </>
      ) : null}
        </>
      ) : null}
    </div>
    {zoom && large ? (
      <PhotoLightbox photos={slides} index={Math.min(index, Math.max(count - 1, 0))} onIndex={setIndex} onClose={() => setZoom(false)} />
    ) : null}
    </>
  );
}
