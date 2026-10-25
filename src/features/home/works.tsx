"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projectReels } from "@/features/home/project-photos";
import { TvPhotoMarquee } from "@/features/services/tv-photo-marquee";
import { useCms } from "@/lib/cms/use-cms";
import { pageSlugForCategory } from "@/lib/service-pages";
import { categoryHref } from "@/lib/services";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";
import styles from "./works.module.css";

export function Works() {
  const cms = useCms();
  const works = cms.copy.home.works;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reels = projectReels(cms);
  const rows = [
    { gallery: "reels:top", direction: "right" as const, photos: reels.top },
    { gallery: "reels:bottom", direction: "left" as const, photos: reels.bottom },
  ];
  const services = cms.serviceCategories.flatMap((category) => {
    if (category.status !== "active" || !category.featured) return [];
    const slug = pageSlugForCategory(category, cms.serviceCategories);
    if (!slug) return [];
    return [{ id: category.id, slug, name: category.name }];
  });

  function closePicker() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <section id="works" aria-labelledby="works-heading" className={styles.section} data-cms-photo="copy.home.works.backdrop">
      <Image
        src={assetPath(works.backdrop)}
        data-cms-src="copy.home.works.backdrop"
        alt=""
        fill
        unoptimized={works.backdrop.startsWith("/api/media/")}
        sizes="100vw"
        quality={80}
        className={styles.backdrop}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={`${styles.container} ${styles.headingWrap}`}>
        <h2 id="works-heading" className={styles.heading}>
          <span data-cms="copy.home.works.headingLead">{works.headingLead}</span>{" "}
          <span className={styles.headingAccent} data-cms="copy.home.works.headingAccent">{works.headingAccent}</span>
        </h2>
      </div>

      <div className={styles.reels}>
        {rows.map((row) => (
          <div key={row.gallery} data-cms-gallery={row.gallery} data-empty={row.photos.length === 0 ? "" : undefined}>
            {row.photos.length > 0 ? (
              <TvPhotoMarquee
                photos={row.photos.map((photo, index) => ({
                  id: `${row.gallery}-${index}`,
                  src: photo.image,
                  alt: photo.alt,
                }))}
                direction={row.direction}
                heading={false}
                paired
                label="Projects"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className={`${styles.container} ${styles.actionWrap}`}>
        <button
          ref={buttonRef}
          type="button"
          className={styles.projectsButton}
          onClick={() => setOpen(true)}
        >
          <span data-cms="copy.home.works.explore">{works.explore}</span>
        </button>
      </div>

      {open ? createPortal(<ServicePicker services={services} onClose={closePicker} />, document.body) : null}
    </section>
  );
}

function ServicePicker({
  services,
  onClose,
}: {
  services: { id: string; slug: string; name: string }[];
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = dialogRef.current;
    const focusable = () => Array.from(root?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !root) return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className={styles.picker} data-editor-ui>
      <button type="button" className={styles.dismiss} aria-label="Close" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.dialog}
      >
        <div className={styles.dialogHead}>
          <h2 id={titleId} className={styles.dialogTitle}>Choose a service</h2>
          <button type="button" className={styles.close} onClick={onClose}>
            <X size={16} aria-hidden="true" />
            <span className={shared.visuallyHidden}>Close</span>
          </button>
        </div>
        <ul className={styles.choices}>
          {services.map((service) => (
            <li key={service.id}>
              <Link href={categoryHref(service)} className={styles.choice}>
                <span>{service.name}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
