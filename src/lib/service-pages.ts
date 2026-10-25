import type { CmsDocument } from "./cms/types";

export const CORE_SERVICE_IDS = ["tv-mounting", "electrical", "handyman"] as const;

export const TEMPLATE_PAGE_SLUGS = ["service1", "service2", "service3", "service4"] as const;

const CORE_IDS = new Set<string>(CORE_SERVICE_IDS);
const TEMPLATE_SLUGS = new Set<string>(TEMPLATE_PAGE_SLUGS);

type CategoryLike = {
  id: string;
  slug: string;
  featured?: boolean;
  status?: string;
};

export function isServicePageSlug(slug: string) {
  return CORE_IDS.has(slug) || TEMPLATE_SLUGS.has(slug);
}

export function extraLandingCategories<T extends CategoryLike>(categories: T[]) {
  return categories.filter(
    (category) => category.featured && category.status === "active" && !CORE_IDS.has(category.id),
  );
}

export function pageSlugForCategory(category: CategoryLike, categories: CategoryLike[]) {
  if (CORE_IDS.has(category.id)) return category.id;
  const index = extraLandingCategories(categories).findIndex((item) => item.id === category.id);
  if (index < 0 || index >= TEMPLATE_PAGE_SLUGS.length) return null;
  return TEMPLATE_PAGE_SLUGS[index];
}

export function categoryForPageSlug<T extends CategoryLike>(slug: string, categories: T[]) {
  if (CORE_IDS.has(slug)) return categories.find((category) => category.id === slug || category.slug === slug);
  const index = TEMPLATE_PAGE_SLUGS.indexOf(slug as (typeof TEMPLATE_PAGE_SLUGS)[number]);
  if (index < 0) return undefined;
  return extraLandingCategories(categories)[index];
}

export function fillElectricalTemplate(document: CmsDocument, categoryId: string) {
  if (!categoryId || categoryId === "electrical") return;
  const offers = document.copy.offers as unknown as Record<string, CmsDocument["copy"]["offers"]["electrical"]>;
  const current = offers[categoryId];
  if (!Array.isArray(current) || current.length === 0) {
    offers[categoryId] = structuredClone(document.copy.offers.electrical);
  }
  const hasPhotos = document.galleryItems.some((item) => item.categoryId === categoryId && item.src);
  if (hasPhotos) return;
  const clones = document.galleryItems
    .filter((item) => item.categoryId === "electrical" && item.src)
    .map((item) => ({
      ...item,
      id: `${categoryId}-${item.id}`,
      categoryId,
    }));
  document.galleryItems.push(...clones);
}

export function ensureServiceTemplates(document: CmsDocument): CmsDocument {
  if (!document?.copy?.offers?.electrical || !Array.isArray(document.galleryItems) || !Array.isArray(document.serviceCategories)) {
    return document;
  }
  const targets = extraLandingCategories(document.serviceCategories).slice(0, TEMPLATE_PAGE_SLUGS.length);
  const offers = document.copy.offers as Record<string, unknown>;
  const missing = targets.some((category) => {
    const list = offers[category.id];
    const hasOffers = Array.isArray(list) && list.length > 0;
    const hasPhotos = document.galleryItems.some((item) => item.categoryId === category.id && item.src);
    return !hasOffers || !hasPhotos;
  });
  if (!missing) return document;
  const next = structuredClone(document);
  for (const category of extraLandingCategories(next.serviceCategories).slice(0, TEMPLATE_PAGE_SLUGS.length)) {
    fillElectricalTemplate(next, category.id);
  }
  return next;
}
