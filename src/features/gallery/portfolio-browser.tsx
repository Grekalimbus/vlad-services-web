"use client";

import { useState } from "react";
import { MediaPlaceholder } from "./media-placeholder";
import { useCms } from "@/lib/cms/use-cms";
import type { GalleryCategory } from "@/lib/gallery";
import styles from "./portfolio-browser.module.css";

export function PortfolioBrowser({
  initialCategory,
}: {
  initialCategory?: GalleryCategory;
}) {
  const cms = useCms();
  const galleryCategories = cms.galleryCategories;
  const [categoryId, setCategoryId] = useState(
    initialCategory?.id ?? galleryCategories[0]?.id ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState<string>("all");

  const category =
    galleryCategories.find((item) => item.id === categoryId) ?? galleryCategories[0];

  if (!category) return null;

  const subcategories = cms.gallerySubcategories.filter((item) => item.categoryId === category.id);
  const items = cms.galleryItems.filter((entry) => {
    if (entry.categoryId !== category.id) return false;
    if (subcategoryId === "all") return true;
    return entry.subcategoryId === subcategoryId;
  });

  return (
    <div>
      <div className={styles.tabs}>
        {galleryCategories.map((item) => {
          const selected = item.id === category.id;
          const index = cms.galleryCategories.findIndex((entry) => entry.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCategoryId(item.id);
                setSubcategoryId("all");
              }}
              className={`${styles.tab} ${selected ? styles.selected : styles.unselected}`}
            >
              <span data-cms={`galleryCategories.${index}.name`}>{item.name}</span>
            </button>
          );
        })}
      </div>

      {subcategories.length > 0 ? (
        <div className={styles.subtabs}>
          <button
            type="button"
            onClick={() => setSubcategoryId("all")}
            className={`${styles.subtab} ${
              subcategoryId === "all" ? styles.selected : styles.unselected
            }`}
          >
            All
          </button>
          {subcategories.map((item) => {
            const index = cms.gallerySubcategories.findIndex((entry) => entry.id === item.id);
            return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubcategoryId(item.id)}
              className={`${styles.subtab} ${
                subcategoryId === item.id ? styles.selected : styles.unselected
              }`}
            >
              <span data-cms={`gallerySubcategories.${index}.name`}>{item.name}</span>
            </button>
            );
          })}
        </div>
      ) : null}

      <div className={styles.grid} data-cms-gallery={`items:${category.id}`}>
        {items.map((entry) => (
          <MediaPlaceholder
            key={entry.id}
            label={entry.title}
            src={entry.src}
            alt={entry.alt}
            variant={entry.kind === "before-after" ? "split" : "frame"}
            beforeSrc={entry.beforeSrc}
            afterSrc={entry.afterSrc}
          />
        ))}
      </div>
    </div>
  );
}
