import type { CmsDocument } from "./types";

function normalizePath(pathname: string) {
  const path = pathname.split("?")[0]?.split("#")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

function asCopy(document: CmsDocument): Record<string, unknown> {
  return document.copy as unknown as Record<string, unknown>;
}

/**
 * Strip CMS fields that the current public route does not render.
 * The visual editor replaces window.__CMS__ with the full /api/content
 * document before editing starts, so editor workflows stay intact.
 */
export function toPublicCms(document: CmsDocument, pathname: string): CmsDocument {
  const path = normalizePath(pathname);
  const isHome = path === "/";
  const isDeals = path === "/deals";
  const isLegal = path === "/privacy-policy" || path === "/messaging-terms";
  const isTv = path === "/services/tv-mounting";
  const isService = path.startsWith("/services/");
  const serviceSlug = isService ? path.slice("/services/".length) : "";

  const next = structuredClone(document);
  const copy = asCopy(next);
  const sourceCopy = asCopy(document);

  if (!isLegal) {
    next.legalPages = [];
  }

  const dealsPage = copy.dealsPage;
  if (!isDeals && dealsPage && typeof dealsPage === "object") {
    copy.dealsPage = { ...(dealsPage as object), items: [] };
  }

  if (!isTv) {
    copy.plan = {
      headingLead: "",
      headingAccent: "",
      book: "",
      labels: { "1": "", "2": "", "3": "", "4plus": "" },
      descriptions: {},
      offers: {},
      quiz: {},
    };
    copy.tvPage = {
      eyebrow: "",
      title: "",
      description: "",
      steps: [],
    };
    copy.additionals = {
      headingLead: "",
      headingAccent: "",
      cards: [],
    };
    copy.tvGallery = {
      headingLead: "",
      headingAccent: "",
      book: "",
      cards: [],
      body: "",
    };
    copy.tvShowcase = { heading: "", cards: [] };
  }

  if (!isService) {
    next.galleryItems = [];
    next.galleryCategories = [];
    next.gallerySubcategories = [];
    const offers = (sourceCopy.offers ?? {}) as Record<string, unknown>;
    copy.offers = {
      showMore: String(offers.showMore ?? ""),
      showLess: String(offers.showLess ?? ""),
      photosAccent: String(offers.photosAccent ?? ""),
      book: String(offers.book ?? ""),
    };
    copy.serviceLanding = {};
  } else if (isTv) {
    copy.serviceLanding = {};
    const offers = (sourceCopy.offers ?? {}) as Record<string, unknown>;
    copy.offers = {
      showMore: String(offers.showMore ?? ""),
      showLess: String(offers.showLess ?? ""),
      photosAccent: String(offers.photosAccent ?? ""),
      book: String(offers.book ?? ""),
    };
  } else if (serviceSlug) {
    const category =
      document.serviceCategories.find((item) => item.slug === serviceSlug || item.id === serviceSlug) ?? null;
    const landings = (sourceCopy.serviceLanding ?? {}) as Record<string, unknown>;
    if (category && landings[category.id]) {
      copy.serviceLanding = { [category.id]: landings[category.id] };
    } else {
      copy.serviceLanding = {};
    }
    const offers = (sourceCopy.offers ?? {}) as Record<string, unknown>;
    if (category) {
      copy.offers = {
        showMore: String(offers.showMore ?? ""),
        showLess: String(offers.showLess ?? ""),
        photosAccent: String(offers.photosAccent ?? ""),
        book: String(offers.book ?? ""),
        [category.id]: offers[category.id] ?? [],
      };
    }
  }

  if (!isHome) {
    next.googleReviews = [];
  }

  return next;
}
