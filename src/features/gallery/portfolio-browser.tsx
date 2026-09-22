"use client";

import { useState } from "react";
import Link from "next/link";
import { MediaPlaceholder } from "./media-placeholder";
import {
  galleryCategories,
  itemsInCategory,
  subcategoriesIn,
  type GalleryCategory,
} from "@/lib/gallery";
import { routes } from "@/lib/site";
import styles from "./portfolio-browser.module.css";

export function PortfolioBrowser({
  initialCategory,
}: {
  initialCategory?: GalleryCategory;
}) {
  const [categoryId, setCategoryId] = useState(
    initialCategory?.id ?? galleryCategories[0]?.id ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState<string>("all");

  const category =
    galleryCategories.find((item) => item.id === categoryId) ?? galleryCategories[0];

  if (!category) return null;

  const subcategories = subcategoriesIn(category.id);
  const items = itemsInCategory(
    category.id,
    subcategoryId === "all" ? undefined : subcategoryId,
  );

  return (
    <div>
      <div className={styles.tabs}>
        {galleryCategories.map((item) => {
          const selected = item.id === category.id;
          return (
            <Link
              key={item.id}
              href={routes.portfolioCategory(item.slug)}
              onClick={(event) => {
                if (initialCategory) return;
                event.preventDefault();
                setCategoryId(item.id);
                setSubcategoryId("all");
              }}
              className={`${styles.tab} ${selected ? styles.selected : styles.unselected}`}
            >
              {item.name}
            </Link>
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
          {subcategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubcategoryId(item.id)}
              className={`${styles.subtab} ${
                subcategoryId === item.id ? styles.selected : styles.unselected
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.grid}>
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
