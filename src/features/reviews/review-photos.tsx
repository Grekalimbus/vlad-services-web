"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PhotoLightbox } from "@/features/gallery/photo-lightbox";
import { assetPath } from "@/lib/site";
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
      {openAt != null ? (
        <PhotoLightbox photos={photos} start={openAt} label={label} onClose={() => setOpenAt(null)} />
      ) : null}
    </>
  );
}
