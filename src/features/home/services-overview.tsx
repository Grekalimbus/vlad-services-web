"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { addHomepageService } from "@/features/editor/service-actions";
import { useCms, useEditing } from "@/lib/cms/use-cms";
import { categoryHref } from "@/lib/services";
import { assetPath } from "@/lib/site";
import styles from "./services-overview.module.css";

const PAGE_SLUGS = new Set(["tv-mounting", "electrical", "handyman"]);

export function ServicesOverview() {
  const cms = useCms();
  const editing = useEditing();
  const covers = Object.fromEntries(cms.copy.home.serviceCovers.map((cover) => [cover.id, cover]));
  const categories = cms.serviceCategories.filter((category) => category.featured && category.status === "active");

  return (
    <section id="services" tabIndex={-1} aria-labelledby="services-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="services-heading" className={styles.heading}>
          <span data-cms="copy.home.servicesHeading">{cms.copy.home.servicesHeading}</span>
        </h2>
        <ul
          className={styles.strip}
          style={{ "--count": Math.max(categories.length, 1) } as CSSProperties}
        >
          {categories.map((category, index) => {
            const sourceIndex = cms.serviceCategories.findIndex((item) => item.id === category.id);
            const coverIndex = cms.copy.home.serviceCovers.findIndex((item) => item.id === category.id);
            const cover = covers[category.id];
            const src = cover?.src ?? category.coverImage;
            const href = PAGE_SLUGS.has(category.slug) ? categoryHref(category) : "/#footer";
            return (
              <li key={category.id} className={styles.item}>
                <Link href={href} className={styles.card} data-cms-card={`service:${category.id}`}>
                  {src ? (
                    <Image
                      src={assetPath(src)}
                      alt={cover?.alt || category.coverAlt || ""}
                      data-cms-alt={coverIndex >= 0 ? `copy.home.serviceCovers.${coverIndex}.alt` : undefined}
                      fill
                      sizes="(min-width: 900px) 36vw, 100vw"
                      className={styles.image}
                      style={{ objectPosition: cover?.position ?? "center" }}
                      data-cms-src={
                        coverIndex >= 0
                          ? `copy.home.serviceCovers.${coverIndex}.src`
                          : `serviceCategories.${sourceIndex}.coverImage`
                      }
                    />
                  ) : null}
                  <span className={styles.shade} aria-hidden="true" />
                  <span className={styles.index} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.footer}>
                    <span className={styles.title} data-cms={`serviceCategories.${sourceIndex}.name`}>
                      {category.name}
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <ArrowRight size={18} strokeWidth={2.25} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        {editing ? (
          <button type="button" className={styles.add} data-editor-ui onClick={addHomepageService}>
            Add a service
          </button>
        ) : null}
      </div>
    </section>
  );
}
