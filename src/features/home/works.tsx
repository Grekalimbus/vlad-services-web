"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { projectIcons } from "@/lib/project-cards";
import { pageSlugForCategory } from "@/lib/service-pages";
import { categoryHref } from "@/lib/services";
import { assetPath } from "@/lib/site";
import shared from "@/styles/shared.module.css";
import styles from "./works.module.css";

function exploreLabel(value: string) {
  return value.replace(/\s+projects?\b/gi, " ").replace(/\s+/g, " ").trim() || "Explore more";
}

export function Works() {
  const cms = useCms();
  const works = cms.copy.home.works;
  const editing = useEditing();
  const [slide, setSlide] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const services = cms.serviceCategories.flatMap((category) => {
    if (category.status !== "active" || !category.featured) return [];
    const slug = pageSlugForCategory(category, cms.serviceCategories);
    if (!slug) return [];
    return [{ id: category.id, slug, name: category.name.trim() }];
  });
  const closePicker = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  function step(index: number, delta: number, count: number) {
    setSlide((current) => {
      const next = ((current[index] ?? 0) + delta + count) % count;
      return { ...current, [index]: next };
    });
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

      <div className={styles.container}>
        <h2 id="works-heading" className={styles.heading}>
          <span data-cms="copy.home.works.headingLead">{works.headingLead}</span>{" "}
          <span className={styles.headingAccent} data-cms="copy.home.works.headingAccent">
            {works.headingAccent}
          </span>
        </h2>

        <ul className={styles.grid}>
          {works.cards.map((card, index) => {
            const photos = card.photos.filter((photo) => photo.image);
            const current = photos[(slide[index] ?? 0) % Math.max(photos.length, 1)] ?? null;
            const Icon = projectIcons[card.icon]?.icon ?? Wrench;
            const label = (
              <span className={styles.cardLabel}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span data-cms={`copy.home.works.cards.${index}.title`}>{card.title}</span>
              </span>
            );
            return (
              <li key={`${card.href}-${index}`}>
                <article className={styles.card}>
                  <div
                    className={styles.media}
                    data-cms-gallery={`slides:copy.home.works.cards.${index}.photos`}
                    data-empty={photos.length === 0 ? "" : undefined}
                  >
                    {current ? (
                      <Image
                        src={assetPath(current.image)}
                        alt=""
                        fill
                        unoptimized={current.image.startsWith("/api/media/")}
                        sizes="(min-width: 1024px) 22rem, (min-width: 720px) 45vw, 92vw"
                        className={styles.cardImage}
                        style={{ objectPosition: current.position || card.position }}
                      />
                    ) : null}
                    <span className={styles.cardShade} aria-hidden="true" />
                  </div>
                  {photos.length > 1 ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.nav} ${styles.prev}`}
                        aria-label="Previous photo"
                        onClick={() => step(index, -1, photos.length)}
                      >
                        <ChevronLeft size={18} strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.nav} ${styles.next}`}
                        aria-label="Next photo"
                        onClick={() => step(index, 1, photos.length)}
                      >
                        <ChevronRight size={18} strokeWidth={1.75} />
                      </button>
                    </>
                  ) : null}
                  {editing ? (
                    <div className={styles.cardBar} data-cms-card={`works:${index}`}>
                      {label}
                    </div>
                  ) : (
                    <Link href={card.href} className={styles.stretch}>
                      <span className={styles.cardBar}>{label}</span>
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ul>

        <button ref={buttonRef} type="button" className={styles.projectsButton} onClick={() => setOpen(true)}>
          <span data-cms="copy.home.works.explore">{exploreLabel(works.explore)}</span>
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
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={styles.dialog}>
        <div className={styles.dialogHead}>
          <h2 id={titleId} className={styles.dialogTitle}>
            Choose a service
          </h2>
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
