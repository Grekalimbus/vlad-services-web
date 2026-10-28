import type { CmsDocument } from "./cms/types";
import { projectCardFor } from "./project-cards";

export const CORE_SERVICE_IDS = ["tv-mounting", "electrical", "handyman"] as const;

export const SERVICE_PAGE_SLUGS = [
  "tv-mounting",
  "electrical",
  "handyman",
  "painter",
  "appliance-expert",
  "landscaper",
] as const;

const CORE_IDS = new Set<string>(CORE_SERVICE_IDS);
const PAGE_SLUGS = new Set<string>(SERVICE_PAGE_SLUGS);
const RETIRED_SERVICE_IDS = new Set(["service-a0fccda4", "service-39acdf40", "service-3dbbdaa1"]);
const LEGACY_SLUGS = new Set(["service1", "service2", "service3", "service4"]);
const GENERATED_SLUG = /^service-[a-z0-9]+$/i;
const KNOWN_SLUGS: Record<string, string> = {
  "service-44da8977": "painter",
  "service-0ed47ac2": "appliance-expert",
  "service-b7cb3d8a": "landscaper",
};

type CategoryLike = {
  id: string;
  slug: string;
  name?: string;
  featured?: boolean;
  status?: string;
};

export function isServicePageSlug(slug: string) {
  return PAGE_SLUGS.has(slug);
}

export function extraLandingCategories<T extends CategoryLike>(categories: T[]) {
  return categories.filter(
    (category) => category.featured && category.status === "active" && !CORE_IDS.has(category.id),
  );
}

export function pageSlugForCategory(category: CategoryLike, categories: CategoryLike[] = []) {
  const current = categories.find((item) => item.id === category.id) ?? category;
  if (current.featured === false) return null;
  if (current.status && current.status !== "active") return null;
  return current.slug;
}

export function categoryForPageSlug<T extends CategoryLike>(slug: string, categories: T[]) {
  return categories.find(
    (category) =>
      (category.slug === slug || category.id === slug) &&
      category.featured !== false &&
      category.status === "active",
  );
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

function slugify(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "service";
}

function needsPublicSlug(category: CategoryLike) {
  if (CORE_IDS.has(category.id) || RETIRED_SERVICE_IDS.has(category.id)) return false;
  if (category.featured === false || (category.status && category.status !== "active")) return false;
  return GENERATED_SLUG.test(category.slug) || LEGACY_SLUGS.has(category.slug);
}

function allocateSlug(base: string, taken: Set<string>) {
  const root = base || "service";
  let slug = root;
  let count = 2;
  while (taken.has(slug)) slug = `${root}-${count++}`;
  taken.add(slug);
  return slug;
}

function landingCategories(categories: CmsDocument["serviceCategories"]) {
  return categories.filter((category) => category.featured && category.status === "active");
}

function footerNeedsServices(document: CmsDocument) {
  const hrefs = new Set(document.footerNav.map((item) => item.href.replace(/\/$/, "")));
  return landingCategories(document.serviceCategories).some((category) => {
    const slug = needsPublicSlug(category) ? (KNOWN_SLUGS[category.id] ?? slugify(category.name)) : category.slug;
    return !hrefs.has(`/services/${slug}`);
  });
}

function withFooterServices(document: CmsDocument) {
  const hrefs = new Set(document.footerNav.map((item) => item.href.replace(/\/$/, "")));
  const missing = landingCategories(document.serviceCategories).flatMap((category) => {
    const href = `/services/${category.slug}`;
    if (hrefs.has(href)) return [];
    hrefs.add(href);
    return [{ href, label: category.name.trim() || category.slug }];
  });
  if (!missing.length) return document.footerNav;
  const insertAt = document.footerNav.findIndex(
    (item) => item.href === "/#works" || item.href === "/portfolio" || /\bbook\b/i.test(item.label),
  );
  const index = insertAt < 0 ? document.footerNav.length : insertAt;
  return [...document.footerNav.slice(0, index), ...missing, ...document.footerNav.slice(index)];
}

function cardsMatch(document: CmsDocument, categories: CmsDocument["serviceCategories"]) {
  const cards = document.copy.home.works.cards;
  if (cards.length !== categories.length) return false;
  return categories.every((category, index) => {
    const card = cards[index];
    return card?.href === `/services/${category.slug}` && Array.isArray(card.photos);
  });
}

function hasRetired(document: CmsDocument) {
  const offers = document.copy.offers as Record<string, unknown>;
  return (
    document.serviceCategories.some((category) => RETIRED_SERVICE_IDS.has(category.id)) ||
    document.copy.home.serviceCovers.some((cover) => RETIRED_SERVICE_IDS.has(cover.id)) ||
    document.galleryItems.some((item) => RETIRED_SERVICE_IDS.has(item.categoryId)) ||
    document.services.some((service) => RETIRED_SERVICE_IDS.has(service.categoryId) || RETIRED_SERVICE_IDS.has(service.id)) ||
    [...RETIRED_SERVICE_IDS].some((id) => id in offers)
  );
}

export function normalizeServiceCatalog(document: CmsDocument): CmsDocument {
  if (!document?.serviceCategories || !document.copy?.home?.works?.cards || !Array.isArray(document.galleryItems)) {
    return document;
  }
  const slugChange = document.serviceCategories.some((category) => needsPublicSlug(category));
  const retired = hasRetired(document);
  const exploreLabel = /\bprojects?\b/i.test(document.copy.home.works.explore);
  const footerMissing = footerNeedsServices(document);
  if (!retired && !slugChange && !exploreLabel && !footerMissing && cardsMatch(document, landingCategories(document.serviceCategories))) {
    return document;
  }

  const next = structuredClone(document);
  if (retired) {
    next.serviceCategories = next.serviceCategories.filter((category) => !RETIRED_SERVICE_IDS.has(category.id));
    next.copy.home.serviceCovers = next.copy.home.serviceCovers.filter((cover) => !RETIRED_SERVICE_IDS.has(cover.id));
    next.galleryItems = next.galleryItems.filter((item) => !RETIRED_SERVICE_IDS.has(item.categoryId));
    next.services = next.services.filter(
      (service) => !RETIRED_SERVICE_IDS.has(service.categoryId) && !RETIRED_SERVICE_IDS.has(service.id),
    );
    const offers = next.copy.offers as Record<string, unknown>;
    for (const id of RETIRED_SERVICE_IDS) delete offers[id];
  }

  const taken = new Set(next.serviceCategories.map((category) => category.slug));
  for (const category of next.serviceCategories) {
    if (!needsPublicSlug(category)) continue;
    taken.delete(category.slug);
    category.slug = allocateSlug(KNOWN_SLUGS[category.id] ?? slugify(category.name), taken);
  }

  next.copy.home.works.explore = next.copy.home.works.explore.replace(/\s+projects?\b/gi, " ").replace(/\s+/g, " ").trim() || "Explore more";
  next.footerNav = withFooterServices(next);

  const featured = landingCategories(next.serviceCategories);
  if (!cardsMatch(next, featured)) {
    next.copy.home.works.cards = featured.map((category) => {
      const cover = next.copy.home.serviceCovers.find((item) => item.id === category.id)?.src || category.coverImage || "";
      return projectCardFor(category, cover);
    });
  }
  return next;
}

export function ensureServiceTemplates(document: CmsDocument): CmsDocument {
  if (!document?.copy?.offers?.electrical || !Array.isArray(document.galleryItems) || !Array.isArray(document.serviceCategories)) {
    return document;
  }
  const catalog = normalizeServiceCatalog(document);
  const targets = extraLandingCategories(catalog.serviceCategories);
  const offers = catalog.copy.offers as Record<string, unknown>;
  const missing = targets.some((category) => {
    const list = offers[category.id];
    const hasOffers = Array.isArray(list) && list.length > 0;
    const hasPhotos = catalog.galleryItems.some((item) => item.categoryId === category.id && item.src);
    return !hasOffers || !hasPhotos;
  });
  if (!missing) return catalog;
  const next = catalog === document ? structuredClone(document) : catalog;
  for (const category of extraLandingCategories(next.serviceCategories)) {
    fillElectricalTemplate(next, category.id);
  }
  return next;
}
