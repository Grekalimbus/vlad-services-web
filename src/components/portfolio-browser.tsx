"use client";

import { useState } from "react";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import {
  galleryCategories,
  itemsInCategory,
  subcategoriesIn,
  type GalleryCategory,
} from "@/lib/gallery";
import { routes } from "@/lib/site";

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
      <div className="flex flex-wrap gap-2">
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
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                selected
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {subcategories.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubcategoryId("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              subcategoryId === "all"
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground"
            }`}
          >
            All
          </button>
          {subcategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubcategoryId(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                subcategoryId === item.id
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
