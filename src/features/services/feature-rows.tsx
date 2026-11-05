"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { LandingFeatureRow } from "@/lib/cms/electrical-landing";
import { assetPath } from "@/lib/site";
import styles from "./feature-rows.module.css";

export function FeatureRows({
  rows,
  pathBase,
  categoryId,
  label,
}: {
  rows: LandingFeatureRow[];
  pathBase: string;
  categoryId: string;
  label: string;
}) {
  if (!rows.length) return null;

  return (
    <section className={styles.section} aria-label={`${label} work highlights`}>
      <div className={styles.stack}>
        {rows.map((row, index) => (
          <FeatureRow
            key={`${row.title}-${index}`}
            row={row}
            index={index}
            pathBase={pathBase}
            categoryId={categoryId}
          />
        ))}
      </div>
    </section>
  );
}

function FeatureRow({
  row,
  index,
  pathBase,
  categoryId,
}: {
  row: LandingFeatureRow;
  index: number;
  pathBase: string;
  categoryId: string;
}) {
  const photosRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const photosEnd = index % 2 === 1;

  useEffect(() => {
    const node = photosRef.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article className={styles.row} data-side={photosEnd ? "photos-end" : "photos-start"}>
      <div
        ref={photosRef}
        className={styles.photos}
        data-visible={visible ? "" : undefined}
      >
        {row.photos.map((photo, photoIndex) => (
          <figure
            key={`${photo.src}-${photoIndex}`}
            className={styles.figure}
            data-cms-card={`featurePhoto:${categoryId}:${index}:${photoIndex}`}
            data-empty={photo.src ? undefined : ""}
            style={{ "--enter-delay": `${photoIndex * 110}ms` } as CSSProperties}
          >
            {photo.src ? (
              <Image
                src={assetPath(photo.src)}
                alt={photo.alt}
                data-cms-src={`${pathBase}.${index}.photos.${photoIndex}.src`}
                data-cms-alt={`${pathBase}.${index}.photos.${photoIndex}.alt`}
                fill
                unoptimized={photo.src.startsWith("/api/media/")}
                sizes="(min-width: 900px) 28vw, 100vw"
                className={styles.image}
              />
            ) : null}
          </figure>
        ))}
      </div>
      <div className={styles.copy} data-cms-card={`featureRow:${categoryId}:${index}`}>
        <h2 className={styles.title} data-cms={`${pathBase}.${index}.title`}>
          {row.title}
        </h2>
        <p className={styles.body} data-cms={`${pathBase}.${index}.body`}>
          {row.body}
        </p>
      </div>
    </article>
  );
}
