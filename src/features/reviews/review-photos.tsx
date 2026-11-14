"use client";

import Image from "next/image";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";
import styles from "./review-photos.module.css";

export function reviewPhotoUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => (typeof item === "string" && item.trim() ? [item.trim()] : []));
}

export function ReviewPhotos({ photos, label }: { photos: string[]; label: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  if (photos.length === 0) return null;

  const preview = photos.slice(0, Math.min(3, photos.length));

  return (
    <>
      <ul className={styles.grid} data-count={preview.length}>
        {preview.map((src, index) => {
          const isMore = index === 2 && photos.length > 2;
          const remaining = photos.length - 2;
          return (
            <li key={`${src}-${index}`} className={index === 2 && preview.length === 3 ? styles.wide : undefined}>
              <button
                type="button"
                className={styles.thumb}
                onClick={() => setOpenAt(isMore ? 2 : index)}
                aria-label={
                  isMore
                    ? `View all ${photos.length} photos from ${label}`
                    : `View photo ${index + 1} from ${label}`
                }
              >
                <Image
                  src={assetPath(src)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 10rem, 40vw"
                  className={styles.image}
                  unoptimized={src.startsWith("/api/media/") || src.startsWith("http")}
                />
                {isMore ? (
                  <span className={styles.more} aria-hidden="true">
                    <span className={styles.moreShade} />
                    <span className={styles.moreBadge}>
                      <Plus size={16} strokeWidth={2.5} />
                      <span>{remaining}</span>
                    </span>
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {openAt != null
        ? createPortal(
            <PhotoLightbox photos={photos} start={openAt} label={label} onClose={() => setOpenAt(null)} />,
            document.body,
          )
        : null}
    </>
  );
}

function PhotoLightbox({
  photos,
  start,
  label,
  onClose,
}: {
  photos: string[];
  start: number;
  label: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(() => Math.min(Math.max(start, 0), photos.length - 1));
  const current = photos[index] ?? photos[0];

  const step = useCallback(
    (delta: number) => {
      setIndex((currentIndex) => {
        const next = (currentIndex + delta + photos.length) % photos.length;
        return next < 0 ? next + photos.length : next;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, step]);

  if (!current) return null;

  return (
    <div className={styles.lightbox} data-editor-ui>
      <button type="button" className={styles.dismiss} aria-label="Close photos" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.dialog}
      >
        <div className={styles.dialogHead}>
          <h2 id={titleId} className={styles.dialogTitle}>
            {label}
            <span className={styles.dialogCount}>
              {index + 1} / {photos.length}
            </span>
          </h2>
          <button type="button" className={styles.close} onClick={onClose}>
            <X size={16} aria-hidden="true" />
            <span className={shared.visuallyHidden}>Close</span>
          </button>
        </div>
        <div className={styles.stage}>
          <Image
            key={current}
            src={assetPath(current)}
            alt=""
            fill
            sizes="90vw"
            className={styles.stageImage}
            unoptimized={current.startsWith("/api/media/") || current.startsWith("http")}
            priority
          />
          {photos.length > 1 ? (
            <>
              <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)}>
                <ChevronLeft size={22} aria-hidden="true" />
                <span className={shared.visuallyHidden}>Previous photo</span>
              </button>
              <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)}>
                <ChevronRight size={22} aria-hidden="true" />
                <span className={shared.visuallyHidden}>Next photo</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
