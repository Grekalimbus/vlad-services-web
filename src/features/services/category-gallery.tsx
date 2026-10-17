"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuoteCta } from "@/features/quote";
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

const offers: Record<string, Offer[]> = {
  electrical: [
    {
      title: "Chandeliers & Light Fixtures",
      description:
        "Installation of chandeliers, pendants, and other interior light fixtures. Each one is hung, leveled, and wired so it sits cleanly in the finished room.",
      slides: [
        {
          image: "/works/pexels-bedroom-tv.jpg",
          alt: "Chandelier hanging in a finished room",
          position: "center 18%",
        },
        {
          image: "/works/chandelier-crystal.jpg",
          alt: "Cluster of pendant lights",
          position: "center 42%",
        },
        {
          image: "/works/pexels-kitchen.jpg",
          alt: "Kitchen island pendants and a dining fixture",
          position: "center 22%",
        },
        {
          image: "/works/pendant-lights.jpg",
          alt: "Pendant light hung from the ceiling",
          position: "center 28%",
        },
      ],
    },
    {
      title: "Ceiling Fans",
      description:
        "Ceiling fan mounting and replacement. The fan is hung, wired, and balanced before we leave.",
      slides: [
        {
          image: "/works/tv-living-cream.jpg",
          alt: "Ceiling fans in a finished living room",
          position: "center top",
        },
        {
          image: "/works/tv-living-cream.jpg",
          alt: "Living room with ceiling fans above the seating",
          position: "18% top",
        },
      ],
    },
    {
      title: "Outlets & Switches",
      description:
        "Outlets, switches, and other minor electrical work, finished on site with clean wiring.",
      slides: [
        {
          image: "/works/electrician.jpg",
          alt: "Technician completing electrical work",
          position: "center 40%",
        },
        {
          image: "/works/wiring.jpg",
          alt: "Electrical panel and wiring",
          position: "center 42%",
        },
      ],
    },
  ],
  handyman: [
    {
      title: "Furniture Assembly",
      description:
        "Assembly of household furniture, from sofas and seating to shelving and custom closet systems, built and placed in the room.",
      slides: [
        {
          image: "/works/furniture.jpg",
          alt: "Assembled sofa in a living room",
          position: "center 62%",
        },
        {
          image: "/works/pexels-sofa.jpg",
          alt: "Leather sofa after assembly",
          position: "center 55%",
        },
        {
          image: "/works/modern-interior.jpg",
          alt: "Sectional sofa placed in a finished living room",
          position: "center 68%",
        },
      ],
    },
    {
      title: "Wall Repair & Painting",
      description:
        "Patching and drywall repair, then interior painting and touch-ups so the wall is smooth and finished.",
      slides: [
        {
          image: "/works/pexels-drywall.jpg",
          alt: "Painter rolling an interior wall",
          position: "center 42%",
        },
        {
          image: "/works/ceiling-fan.jpg",
          alt: "Ladder, roller, and paint prepared for a room",
          position: "center 55%",
        },
        {
          image: "/works/pexels-electrician.jpg",
          alt: "Hand smoothing a patched wall",
          position: "center 50%",
        },
      ],
    },
    {
      title: "Hanging & Small Repairs",
      description:
        "Pictures, artwork, and mirrors hung level. Curtain rods and blinds installed or repaired, plus door and window repairs and other small jobs around the house.",
      slides: [
        {
          image: "/works/pexels-living3.jpg",
          alt: "Pictures hung on a living room wall",
          position: "62% 28%",
        },
        {
          image: "/works/furniture-pexels.jpg",
          alt: "Shelves and lights mounted on a wall",
          position: "center 45%",
        },
        {
          image: "/works/interior-styled.jpg",
          alt: "Framed artwork hung above a chair",
          position: "center 32%",
        },
      ],
    },
  ],
};

export function OfferGrid({ categoryId }: { categoryId: string }) {
  const cards = offers[categoryId] ?? [];
  if (cards.length === 0) return null;

  return (
    <section className={styles.offers} aria-label="Services">
      <ul className={styles.grid}>
        {cards.map((card) => (
          <OfferCard key={card.title} offer={card} />
        ))}
      </ul>
      <QuoteCta className={styles.book}>BOOK NOW</QuoteCta>
    </section>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const [open, setOpen] = useState(false);
  const detailId = useId();

  return (
    <li className={styles.card}>
      <SlideStage slides={offer.slides} label={offer.title} />
      <h2 className={styles.cardTitle}>{offer.title}</h2>
      <button
        type="button"
        className={styles.more}
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Show less" : "Show more"}
      </button>
      <p id={detailId} className={styles.detail} hidden={!open}>
        {offer.description}
      </p>
    </li>
  );
}

export function PhotoFeature({
  name,
  slides,
}: {
  name: string;
  slides: Slide[];
}) {
  if (slides.length === 0) return null;
  const headingId = `${name.toLowerCase().replace(/\s+/g, "-")}-photos-heading`;

  return (
    <section className={styles.photos} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        {name} <span className={styles.accent}>photos</span>
      </h2>
      <div className={styles.feature}>
        <SlideStage slides={slides} label={`${name} photos`} large />
      </div>
      <QuoteCta className={styles.book}>BOOK NOW</QuoteCta>
    </section>
  );
}

function SlideStage({
  slides,
  label,
  large = false,
}: {
  slides: Slide[];
  label: string;
  large?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [frame, setFrame] = useState<{ leaving: number; direction: -1 | 1 } | null>(null);
  const count = slides.length;
  const slide = slides[index];
  const leaving = frame ? slides[frame.leaving] : null;
  const sizes = large
    ? "(min-width: 1024px) 72rem, 100vw"
    : "(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw";

  function go(next: number, direction: -1 | 1) {
    if (next === index || frame || count < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setFrame({ leaving: index, direction });
    setIndex(next);
  }

  return (
    <div className={large ? styles.featureMedia : styles.media}>
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
        style={{ objectPosition: slide.position ?? "center" }}
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
    </div>
  );
}
