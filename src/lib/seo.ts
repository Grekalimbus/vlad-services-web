import type { CmsDocument } from "./cms/types";
import { categoryForPageSlug, isServicePageSlug, pageSlugForCategory } from "./service-pages";

export const PRODUCTION_ORIGIN = "https://primefixpros.com";
const GENERIC_AREA =
  /^(california|southern california|south california|south cal|so\.?\s*cal|socal|ca)$/i;
const BROAD_AREA_PHRASE =
  /\b(?:southern|south)\s+california\b|\bsocal\b|\bso\.?\s*cal\b/gi;
const PLACEHOLDER_SUMMARY = /^(describe this service\.?|tbd|todo|coming soon\.?)$/i;

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
  "/services/service4": "/services/landscaper",
  "/services/service-44da8977": "/services/painter",
  "/services/service-0ed47ac2": "/services/appliance-expert",
  "/services/service-b7cb3d8a": "/services/landscaper",
  "/services/service-3dbbdaa1": "/services/handyman",
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

const BROAD_AREA_TEST = /\b(?:southern|south)\s+california\b|\bsocal\b|\bso\.?\s*cal\b/i;

export function areaLabel(site: { areaServed?: string; areaServedShort?: string }): Area {
  const full = site.areaServed?.trim() ?? "";
  const short = site.areaServedShort?.trim() ?? "";
  const fullIsBroad = !full || GENERIC_AREA.test(full) || BROAD_AREA_TEST.test(full);
  const shortIsBroad = !short || GENERIC_AREA.test(short) || BROAD_AREA_TEST.test(short);
  if (!fullIsBroad) {
    return { short: shortIsBroad ? full : short, full };
  }
  if (!shortIsBroad) return { short, full: `${short} and surrounding areas` };
  return { short: "—", full: "—" };
}

function localizeText(value: string, area: Area) {
  return value
    .replace(BROAD_AREA_PHRASE, area.full)
    .replace(/\bSouth California\b/gi, area.full)
    .replace(/\bSouthern California\b/gi, area.full);
}

function sentenceCase(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function absolute(origin: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalizePath(pathname: string) {
  const path = pathname.replace(/\/index\.html$/, "") || "/";
  return path.replace(/\/+$/, "") || "/";
}

export function normalizeCms(document: CmsDocument): CmsDocument {
  return document;
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
  if (portfolio) return slash(portfolio);
  if (!document) return null;
  const match = /^\/services\/([a-z0-9-]+)$/.exec(path);
  if (!match) return null;
  const slug = match[1];
  if (!slug || isServicePageSlug(slug)) return null;
  const category = document.serviceCategories.find((item) => item.id === slug || item.slug === slug);
  const categoryPage = category ? pageSlugForCategory(category, document.serviceCategories) : null;
  if (categoryPage && categoryPage !== slug) return slash(`/services/${categoryPage}`);
  const service = document.services.find((item) => item.slug === slug && item.status === "active");
  if (!service) return null;
  const parent = document.serviceCategories.find((item) => item.id === service.categoryId);
  const page = parent ? pageSlugForCategory(parent, document.serviceCategories) : null;
  if (!page) return null;
  return slash(`/services/${page}`);
}

function slash(path: string) {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

/** Legacy paths that do not depend on the CMS document. */
export function permanentRedirects() {
  const seen = new Set<string>();
  return Object.entries({ ...PORTFOLIO_REDIRECTS, ...LEGACY_SERVICE_REDIRECTS }).flatMap(([source, destination]) => {
    if (seen.has(source)) return [];
    seen.add(source);
    return [{ source, destination: slash(destination), permanent: true as const }];
  });
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

function serviceDescription(summary: string, brand: string, area: Area, serviceName?: string) {
  const raw = localizeText(summary.replace(/\s+/g, " ").trim(), area);
  if (!raw || PLACEHOLDER_SUMMARY.test(raw)) {
    const label = serviceName?.trim() || "This service";
    return clip(`${label} from ${brand} in ${area.full}. Request a free quote for pricing and availability.`, 160);
  }
  const sentence = sentenceCase(raw).replace(/\.?$/, ".");
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
      const page = parent ? pageSlugForCategory(parent, document.serviceCategories) : null;
      if (!page) return [];
      return [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            description: localizeText(service.summary, area),
            url: publicUrl(`/services/${page}`),
            areaServed: areaServed(area),
            provider: { "@id": `${origin}/#business` },
          },
        },
      ];
    });

  const sameAs = /^https:\/\//.test(maps) ? [maps] : undefined;

  return {
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness", "Organization"],
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
    sameAs,
    currenciesAccepted: "USD",
    knowsAbout: Array.from(new Set(document.services.filter((item) => item.status === "active").map((item) => item.name))),
    openingHoursSpecification: hours,
    contactPoint: phone
      ? {
          "@type": "ContactPoint",
          telephone: phone,
          contactType: "customer service",
          areaServed: area.full,
          availableLanguage: ["English"],
        }
      : undefined,
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
    const summary = serviceDescription(landing.summary, document.site.shortName, area, landing.name);
    const canonical = publicUrl(`/services/${pathSlug}`);
    const serviceCopy = localizeText(landing.summary || landing.name, area);
    return {
      ...base,
      title,
      description: summary,
      canonical,
      index: true,
      keywords: Array.from(
        new Set([
          `${landing.name.trim()} ${area.short}`,
          `${landing.name.trim()} near me`,
          ...keywords.slice(0, 10),
        ]),
      ).slice(0, 12),
      jsonLd: graph([
        business,
        website,
        {
          "@type": "Service",
          "@id": `${canonical}#service`,
          name: landing.name.trim(),
          serviceType: landing.name.trim(),
          description: sentenceCase(serviceCopy),
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
          { name: landing.name.trim(), path: `/services/${pathSlug}` },
        ]),
      ]),
    };
  }

  if (path === "/areas") {
    const title = clip(`Service Areas in ${area.short} | ${document.site.shortName}`, 60);
    const summary = clip(
      `${document.site.shortName} provides TV mounting, electrical, handyman, and related home services in ${area.full}. See the cities we cover and request a quote.`,
      160,
    );
    const canonical = publicUrl("/areas");
    const activeLocations = document.locations.filter((item) => item.status === "active");
    return {
      ...base,
      title,
      description: summary,
      canonical,
      index: true,
      keywords: Array.from(
        new Set([
          `home services ${area.short}`,
          `TV mounting ${area.short}`,
          `handyman ${area.short}`,
          ...keywords,
        ]),
      ).slice(0, 12),
      jsonLd: graph([
        business,
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
          { name: "Service Areas", path: "/areas" },
        ]),
        ...(activeLocations.length
          ? [
              {
                "@type": "ItemList",
                name: `Areas served by ${document.site.shortName}`,
                itemListElement: activeLocations.map((location, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: location.label || location.city,
                })),
              },
            ]
          : []),
      ]),
    };
  }

  if (path === "/blog") {
    const title = clip(`Blog | ${document.site.shortName}`, 60);
    const summary = clip(
      `Guides and project notes from ${document.site.shortName}. Articles for homeowners in ${area.full} are coming soon.`,
      160,
    );
    return {
      ...hiddenPage(document, "Blog", "/blog"),
      title,
      description: summary,
      canonical: publicUrl("/blog"),
      index: false,
      follow: true,
      imageAlt: `${document.site.shortName} blog`,
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
        ? clip(
            `Privacy Policy for ${siteName}. How we collect, use, and share information for customers in ${area.full}.`,
            160,
          )
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

  if (path === "/deals") {
    const title = clip(`Deals & Offers in ${area.short} | ${document.site.shortName}`, 60);
    const summary = clip(
      `Current ${document.site.shortName} deals for TV mounting, electrical, and handyman work in ${area.full}.`,
      160,
    );
    const canonical = publicUrl("/deals");
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
          { name: "Deals", path: "/deals" },
        ]),
      ]),
    };
  }

  if (path === "/404") {
    return { ...hiddenPage(document, "Page not found", "/"), canonical: "", description: `That page is not on the ${document.site.shortName} site.` };
  }

  return hiddenPage(document, "Page not found", "/");
}
