"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { assetPath } from "@/lib/site";
import styles from "./photo-lightbox.module.css";

type Photo = {
  image: string;
  alt: string;
  position?: string;
};

export function PhotoLightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const onIndexRef = useRef(onIndex);
  const indexRef = useRef(index);
  const photo = photos[index];
  const count = photos.length;
  onCloseRef.current = onClose;
  onIndexRef.current = onIndex;
  indexRef.current = index;

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      const current = indexRef.current;
      if (event.key === "Escape") onCloseRef.current();
      if (count < 2) return;
      if (event.key === "ArrowRight") onIndexRef.current((current + 1) % count);
      if (event.key === "ArrowLeft") onIndexRef.current((current - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [count]);

  if (!photo || typeof document === "undefined") return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className={styles.title}>
          {photo.alt || "Photo"}
        </h2>
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
          <X size={22} strokeWidth={2.25} aria-hidden="true" />
          Close
        </button>
        <img src={assetPath(photo.image)} alt={photo.alt} className={styles.photo} onClick={(event) => event.stopPropagation()} />
        {count > 1 ? (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.previous}`}
              aria-label="Previous photo"
              onClick={() => onIndex((index - 1 + count) % count)}
            >
              <ChevronLeft size={22} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              aria-label="Next photo"
              onClick={() => onIndex((index + 1) % count)}
            >
              <ChevronRight size={22} strokeWidth={2.25} />
            </button>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
