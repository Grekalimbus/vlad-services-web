import type { CmsDocument } from "./cms/types";
import {
  categoryForPageSlug,
  ensureServiceTemplates,
  isServicePageSlug,
  pageSlugForCategory,
} from "./service-pages";

export const PRODUCTION_ORIGIN = "https://primefixpros.com";
const GENERIC_AREA = /^(california|southern california|ca|socal|so cal)$/i;
const OLD_HERO_TAGLINE = "Fast Response • Same-Day Availability • High Quality Service";
const OLD_PORTFOLIO_TITLE = "Project gallery";
const OLD_PORTFOLIO_DESCRIPTION = "TV mounting, electrical, and general handyman work. Browse by category.";

export const LANDING_SLUGS = ["tv-mounting", "electrical", "handyman"] as const;

const PORTFOLIO_REDIRECTS: Record<string, string> = {
  "/portfolio/tv-mounting": "/services/tv-mounting",
  "/portfolio/electrical": "/services/electrical",
  "/portfolio/handyman": "/services/handyman",
  "/portfolio": "/",
  "/portfolio/before-after": "/",
};

const LEGACY_SERVICE_REDIRECTS: Record<string, string> = {
  "/services/service1": "/services/painter",
  "/services/service2": "/services/appliance-expert",
  "/services/service3": "/services/landscaper",
};

type Area = { short: string; full: string };

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  index: boolean;
  follow: boolean;
  siteName: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  jsonLd: Record<string, unknown>;
};

export function publicOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (
    configured &&
    /^https:\/\/[a-z0-9.-]+$/i.test(configured) &&
    !/localhost|127\.0\.0\.1/i.test(configured)
  ) {
    return configured;
  }
  return PRODUCTION_ORIGIN;
}

export function publicUrl(path: string) {
  const origin = publicOrigin();
  const clean = path.split(/[?#]/)[0]?.replace(/\/+$/, "") || "/";
  if (clean === "/") return `${origin}/`;
  return `${origin}${clean}/`;
}

export function clip(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max - 1);
  const cut = sliced.replace(/\s+\S*$/, "").replace(/[.,;:–—-]+$/, "");
  return `${cut || sliced.trim()}…`;
}

export function phoneE164(display: string) {
  const digits = display.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

export function areaLabel(site: { areaServed?: string; areaServedShort?: string }): Area {
  const full = site.areaServed?.trim() ?? "";
  const short = site.areaServedShort?.trim() ?? "";
  if (full && !GENERIC_AREA.test(full)) {
    return { short: short && !GENERIC_AREA.test(short) ? short : full, full };
  }
  return { short: "San Diego", full: "San Diego and surrounding areas" };
}

function absolute(origin: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function isLandingSlug(slug: string) {
  return (LANDING_SLUGS as readonly string[]).includes(slug);
}

export function normalizePath(pathname: string) {
  const path = pathname.replace(/\/index\.html$/, "") || "/";
  return path.replace(/\/+$/, "") || "/";
}

export function normalizeCms(document: CmsDocument): CmsDocument {
  const prepared = ensureServiceTemplates(document);
  const area = areaLabel(prepared.site);
  const blob = [
    prepared.site.areaServed,
    prepared.site.areaServedShort,
    prepared.site.seoTitle,
    prepared.site.seoDescription,
    prepared.site.tagline,
    prepared.site.description,
    prepared.site.keywords,
    prepared.copy.home.hero.tagline,
    prepared.copy.portfolio.title,
    prepared.copy.portfolio.description,
    ...prepared.faqs.map((item) => item.a),
    ...prepared.services.map((item) => item.summary),
  ].join("\n");
  const stockHero = prepared.copy.home.hero.tagline === OLD_HERO_TAGLINE;
  const stockPortfolio =
    prepared.copy.portfolio.title === OLD_PORTFOLIO_TITLE ||
    prepared.copy.portfolio.description === OLD_PORTFOLIO_DESCRIPTION;
  if (!/southern california/i.test(blob) && !GENERIC_AREA.test(prepared.site.areaServed) && !GENERIC_AREA.test(prepared.site.areaServedShort) && !stockHero && !stockPortfolio) {
    return prepared;
  }

  const next = structuredClone(prepared);
  if (GENERIC_AREA.test(next.site.areaServed) || /southern california/i.test(next.site.areaServed)) {
    next.site.areaServed = area.full;
  }
  if (GENERIC_AREA.test(next.site.areaServedShort)) next.site.areaServedShort = area.short;
  const phrase = (value: string) => value.replace(/Southern California/gi, area.full);
  next.site.tagline = phrase(next.site.tagline);
  next.site.description = phrase(next.site.description);
  next.site.keywords = phrase(next.site.keywords);
  next.site.seoTitle = phrase(next.site.seoTitle);
  next.site.seoDescription = phrase(next.site.seoDescription);
  next.faqs = next.faqs.map((item) => ({ ...item, q: phrase(item.q), a: phrase(item.a) }));
  next.services = next.services.map((item) => ({ ...item, summary: phrase(item.summary) }));
  if (next.copy.home.hero.tagline === OLD_HERO_TAGLINE) {
    next.copy.home.hero.tagline = `${area.short} and nearby • Same-day availability • High quality service`;
  }
  if (next.copy.portfolio.title === OLD_PORTFOLIO_TITLE) next.copy.portfolio.title = `Projects in ${area.short}`;
  if (next.copy.portfolio.description === OLD_PORTFOLIO_DESCRIPTION) {
    next.copy.portfolio.description = `TV mounting, electrical, and handyman projects in ${area.full}.`;
  }
  return next;
}

function landingFor(document: CmsDocument, slug: string) {
  const mapped = categoryForPageSlug(slug, document.serviceCategories);
  if (mapped?.status === "active" && mapped.featured) return mapped;
  const service = document.services.find((item) => item.slug === slug && item.status === "active");
  if (!service) return undefined;
  const parent = document.serviceCategories.find((item) => item.id === service.categoryId);
  if (parent?.status === "active" && parent.featured && pageSlugForCategory(parent, document.serviceCategories)) return parent;
  return undefined;
}

export function redirectTarget(pathname: string, document?: CmsDocument | null) {
  const path = normalizePath(pathname);
  const portfolio = PORTFOLIO_REDIRECTS[path] ?? LEGACY_SERVICE_REDIRECTS[path];
  if (portfolio) return portfolio;
  if (!document) return null;
  const match = /^\/services\/([a-z0-9-]+)$/.exec(path);
  if (!match) return null;
  const slug = match[1];
  if (!slug || isServicePageSlug(slug)) return null;
  const category = document.serviceCategories.find((item) => item.id === slug || item.slug === slug);
  const categoryPage = category ? pageSlugForCategory(category, document.serviceCategories) : null;
  if (categoryPage && categoryPage !== slug) return `/services/${categoryPage}`;
  const service = document.services.find((item) => item.slug === slug && item.status === "active");
  if (!service) return null;
  const parent = document.serviceCategories.find((item) => item.id === service.categoryId);
  const page = parent ? pageSlugForCategory(parent, document.serviceCategories) : null;
  if (!page) return null;
  return `/services/${page}`;
}

export function redirectRules(document: CmsDocument) {
  const rules = Object.entries({ ...PORTFOLIO_REDIRECTS, ...LEGACY_SERVICE_REDIRECTS }).map(([source, destination]) => ({
    source,
    destination,
  }));
  for (const category of document.serviceCategories) {
    const page = pageSlugForCategory(category, document.serviceCategories);
    if (!page || page === category.slug) continue;
    rules.push({ source: `/services/${category.slug}`, destination: `/services/${page}` });
  }
  for (const service of document.services) {
    if (service.status !== "active" || isServicePageSlug(service.slug)) continue;
    const parent = document.serviceCategories.find((item) => item.id === service.categoryId);
    const page = parent ? pageSlugForCategory(parent, document.serviceCategories) : null;
    if (!page) continue;
    rules.push({ source: `/services/${service.slug}`, destination: `/services/${page}` });
  }
  return rules;
}

function serviceTitle(slug: string, name: string, area: string, brand: string) {
  const label =
    slug === "electrical" && name.trim().toLowerCase() === "electrical"
      ? "Electrical Services"
      : slug === "handyman" && name.trim().toLowerCase() === "handyman"
        ? "Handyman Services"
        : name;
  return clip(`${label} in ${area} | ${brand}`, 60);
}

function homeTitle(site: CmsDocument["site"], area: Area) {
  const current = site.seoTitle.trim();
  if (current && !/southern california/i.test(current) && !GENERIC_AREA.test(current) && current.length <= 65) {
    return current;
  }
  return clip(`TV Mounting, Electrical and Handyman in ${area.short} | ${site.shortName}`, 65);
}

function homeDescription(site: CmsDocument["site"], area: Area) {
  const current = site.seoDescription.trim();
  if (
    current &&
    !/southern california/i.test(current) &&
    !GENERIC_AREA.test(current) &&
    current.length >= 50 &&
    current.length <= 170
  ) {
    return current;
  }
  const insured = /insured/i.test(site.insured);
  const guarantee = site.guarantee.trim();
  return clip(
    `${site.shortName} provides TV mounting, electrical work, and handyman service in ${area.full}. ${insured ? "Insured. " : ""}${guarantee ? `${guarantee}.` : ""}`.trim(),
    160,
  );
}

function serviceDescription(summary: string, brand: string, area: Area) {
  const sentence = summary.trim().replace(/\s+/g, " ").replace(/\.?$/, ".");
  if (sentence.toLowerCase().includes(area.short.toLowerCase())) return clip(sentence, 160);
  const branded = `${sentence} ${brand} serves ${area.full}.`;
  if (branded.length <= 160) return branded;
  const local = `${sentence} Serving ${area.full}.`;
  if (local.length <= 160) return local;
  return clip(sentence, 160);
}

function keywordsFor(site: CmsDocument["site"], area: Area) {
  const fromCms = site.keywords
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && !/southern california/i.test(item));
  const local = [
    `TV mounting ${area.short}`,
    `electrical services ${area.short}`,
    `handyman ${area.short}`,
    "cable concealment",
    "ceiling fan installation",
    "furniture assembly",
    site.shortName,
  ];
  return Array.from(new Set([...local, ...fromCms])).slice(0, 12);
}

function areaServed(area: Area) {
  return [
    {
      "@type": "City",
      name: area.short,
      containedInPlace: { "@type": "State", name: "California" },
    },
    { "@type": "AdministrativeArea", name: area.full },
  ];
}

function businessNode(document: CmsDocument, origin: string, area: Area, description: string) {
  const phone = phoneE164(document.site.phoneDisplay);
  const hours = /24/.test(document.site.availability)
    ? {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      }
    : undefined;
  const maps = document.googleListing.mapsUrl;
  const offers = document.services
    .filter((service) => service.status === "active")
    .flatMap((service) => {
      const parent = document.serviceCategories.find((item) => item.id === service.categoryId);
      if (!parent || !isLandingSlug(parent.slug)) return [];
      return [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: service.summary,
            url: publicUrl(`/services/${parent.slug}`),
            areaServed: areaServed(area),
            provider: { "@id": `${origin}/#business` },
          },
        },
      ];
    });

  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${origin}/#business`,
    name: document.site.legalName,
    alternateName: document.googleListing.name || document.site.shortName,
    description,
    url: `${origin}/`,
    telephone: phone || undefined,
    email: document.site.email,
    image: [absolute(origin, document.site.logo), absolute(origin, "/og.jpg"), absolute(origin, document.copy.home.hero.image)],
    logo: { "@type": "ImageObject", url: absolute(origin, document.site.logo) },
    slogan: document.site.tagline,
    areaServed: areaServed(area),
    hasMap: /^https:\/\//.test(maps) ? maps : undefined,
    sameAs: /^https:\/\//.test(maps) ? [maps] : undefined,
    currenciesAccepted: "USD",
    knowsAbout: Array.from(new Set(document.services.filter((item) => item.status === "active").map((item) => item.name))),
    openingHoursSpecification: hours,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Home services",
      itemListElement: offers,
    },
  };
}

function crumbNode(origin: string, items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: publicUrl(item.path) === `${origin}/` ? `${origin}/` : publicUrl(item.path),
    })),
  };
}

function graph(nodes: Record<string, unknown>[]) {
  return { "@context": "https://schema.org", "@graph": nodes.map(clean) };
}

function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => clean(item)).filter((item) => item != null) as T;
  if (!value || typeof value !== "object") return value;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, item]) => item !== undefined && item !== null && item !== "")
    .map(([key, item]) => [key, clean(item)]);
  return Object.fromEntries(entries) as T;
}

function hiddenPage(document: CmsDocument, title: string, canonicalPath: string): PageMeta {
  const origin = publicOrigin();
  return {
    title: `${title} | ${document.site.shortName}`,
    description: document.site.seoDescription,
    canonical: publicUrl(canonicalPath),
    index: false,
    follow: true,
    siteName: document.site.legalName,
    image: absolute(origin, "/og.jpg"),
    imageAlt: `${document.site.legalName} in ${areaLabel(document.site).full}`,
    keywords: [],
    jsonLd: {},
  };
}

export function pageMeta(pathname: string, source: CmsDocument): PageMeta {
  const document = normalizeCms(source);
  const path = normalizePath(pathname);
  const origin = publicOrigin();
  const area = areaLabel(document.site);
  const description = homeDescription(document.site, area);
  const image = absolute(origin, "/og.jpg");
  const imageAlt = `${document.site.shortName} — TV mounting, electrical, and handyman in ${area.short}`;
  const siteName = document.site.legalName;
  const keywords = keywordsFor(document.site, area);
  const business = businessNode(document, origin, area, description);
  const website = {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: `${origin}/`,
    name: siteName,
    description,
    inLanguage: "en-US",
    publisher: { "@id": `${origin}/#business` },
  };

  const base = {
    siteName,
    image,
    imageAlt,
    keywords,
    follow: true as boolean,
  };

  if (path === "/services" || path === "/contact") {
    return hiddenPage(document, path === "/contact" ? "Contact" : "Services", "/");
  }

  if (path === "/") {
    const title = homeTitle(document.site, area);
    const canonical = publicUrl("/");
    return {
      ...base,
      title,
      description,
      canonical,
      index: true,
      jsonLd: graph([
        business,
        website,
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: title,
          description,
          inLanguage: "en-US",
          isPartOf: { "@id": `${origin}/#website` },
          about: { "@id": `${origin}/#business` },
          primaryImageOfPage: absolute(origin, document.copy.home.hero.image),
        },
        {
          "@type": "FAQPage",
          mainEntity: document.faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ]),
    };
  }

  const serviceMatch = /^\/services\/([a-z0-9-]+)$/.exec(path);
  if (serviceMatch) {
    const requested = serviceMatch[1] ?? "";
    const landing = landingFor(document, requested);
    if (!landing) return hiddenPage(document, "Page not found", "/");
    const pathSlug = pageSlugForCategory(landing, document.serviceCategories) ?? requested;
    const title = serviceTitle(pathSlug, landing.name, area.short, document.site.shortName);
    const summary = serviceDescription(landing.summary, document.site.shortName, area);
    const canonical = publicUrl(`/services/${pathSlug}`);
    return {
      ...base,
      title,
      description: summary,
      canonical,
      index: true,
      jsonLd: graph([
        business,
        website,
        {
          "@type": "Service",
          "@id": `${canonical}#service`,
          name: landing.name,
          serviceType: landing.name,
          description: landing.summary,
          url: canonical,
          provider: { "@id": `${origin}/#business` },
          areaServed: areaServed(area),
        },
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: title,
          description: summary,
          inLanguage: "en-US",
          isPartOf: { "@id": `${origin}/#website` },
          about: { "@id": `${canonical}#service` },
          mainEntity: { "@id": `${canonical}#service` },
        },
        crumbNode(origin, [
          { name: "Home", path: "/" },
          { name: landing.name, path: `/services/${landing.slug}` },
        ]),
      ]),
    };
  }

  if (path === "/portfolio") {
    const title = clip(`${document.copy.portfolio.title} | ${document.site.shortName}`, 60);
    const summary = clip(document.copy.portfolio.description, 160);
    const canonical = publicUrl("/portfolio");
    const images = document.galleryItems
      .filter((item) => item.src && item.alt)
      .slice(0, 12)
      .map((item) => ({
        "@type": "ImageObject",
        contentUrl: absolute(origin, item.src),
        name: item.title,
        description: item.alt,
      }));
    return {
      ...base,
      title,
      description: summary,
      canonical,
      index: true,
      jsonLd: graph([
        business,
        website,
        {
          "@type": "ImageGallery",
          "@id": `${canonical}#gallery`,
          name: document.copy.portfolio.title,
          description: summary,
          url: canonical,
          image: images,
        },
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: title,
          description: summary,
          inLanguage: "en-US",
          isPartOf: { "@id": `${origin}/#website` },
          about: { "@id": `${origin}/#business` },
          mainEntity: { "@id": `${canonical}#gallery` },
        },
        crumbNode(origin, [
          { name: "Home", path: "/" },
          { name: document.copy.portfolio.title, path: "/portfolio" },
        ]),
      ]),
    };
  }

  const legal = document.legalPages.find((item) => item.href === path || item.href === `${path}/`);
  if (legal) {
    const title = clip(`${legal.title} | ${document.site.shortName}`, 60);
    const summary =
      legal.slug === "privacy-policy"
        ? clip(`Privacy Policy for ${siteName}. How we collect, use, and share information for customers in ${area.full}.`, 160)
        : clip(`Messaging terms for ${siteName}: text messages and email, including how to opt out.`, 160);
    const canonical = publicUrl(legal.href);
    return {
      ...base,
      title,
      description: summary,
      canonical,
      index: true,
      keywords: [],
      jsonLd: graph([
        website,
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: title,
          description: summary,
          inLanguage: "en-US",
          isPartOf: { "@id": `${origin}/#website` },
          about: { "@id": `${origin}/#business` },
        },
        crumbNode(origin, [
          { name: "Home", path: "/" },
          { name: legal.title, path: legal.href },
        ]),
      ]),
    };
  }

  if (path === "/404") {
    return { ...hiddenPage(document, "Page not found", "/"), canonical: "", description: `That page is not on the ${document.site.shortName} site.` };
  }

  return hiddenPage(document, "Page not found", "/");
}
