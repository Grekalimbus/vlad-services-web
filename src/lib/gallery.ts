import { live, readCms } from "@/lib/cms/read";

export type GalleryKind = "project" | "before-after";

export type GalleryCategory = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  serviceCategoryId?: string;
};

export type GallerySubcategory = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
};

export type GalleryItem = {
  id: string;
  categoryId: string;
  subcategoryId: string | null;
  title: string;
  summary?: string;
  alt: string;
  kind: GalleryKind;
  src: string | null;
  beforeSrc?: string | null;
  afterSrc?: string | null;
};

export const galleryCategories = live(() => readCms().galleryCategories as GalleryCategory[]);
export const gallerySubcategories = live(() => readCms().gallerySubcategories as GallerySubcategory[]);
export const galleryItems = live(() => readCms().galleryItems as GalleryItem[]);

export function getGalleryCategory(slug: string) {
  return galleryCategories.find((category) => category.slug === slug);
}

export function subcategoriesIn(categoryId: string) {
  return gallerySubcategories.filter((item) => item.categoryId === categoryId);
}

export function itemsInCategory(categoryId: string, subcategoryId?: string) {
  return galleryItems.filter((entry) => {
    if (entry.categoryId !== categoryId) return false;
    if (subcategoryId) return entry.subcategoryId === subcategoryId;
    return true;
  });
}
