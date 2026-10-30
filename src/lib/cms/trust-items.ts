import { ensureElectricalLanding } from "./electrical-landing";
import type { CmsDocument } from "./types";

const businessYears = {
  id: "business",
  value: 4,
  suffix: " years",
  label: "in Business",
} as const;

const defaultKicker = "HIRE a PRO";
const previousKicker = "HIRE YOUR PRO";

const defaultBadges = [
  { id: "bbb", src: "/hero/badges/bbb.svg", alt: "BBB" },
  { id: "google", src: "/hero/badges/google.svg", alt: "Google" },
  { id: "yelp", src: "/hero/badges/yelp.svg", alt: "Yelp" },
];

const defaultAngiListing = {
  name: "Primefix Home & Handyman Services, LLC",
  rating: 4.8,
  reviewCount: 21,
  profileUrl:
    "https://www.angi.com/companylist/us/ca/sacramento/primefix-home-handyman-services-llc-unlicensed-contractor-reviews-1.htm",
  writeReviewUrl:
    "https://www.angi.com/companylist/us/ca/sacramento/primefix-home-handyman-services-llc-unlicensed-contractor-reviews-1.htm",
};

export function ensureTrustItems(document: CmsDocument): CmsDocument {
  let next = document;
  if (Array.isArray(document.trustItems) && !document.trustItems.some((item) => item.id === businessYears.id)) {
    next = structuredClone(next);
    next.trustItems.push({ ...businessYears });
  }
  return ensureElectricalLanding(ensureHeroAndReviews(next));
}

function ensureHeroAndReviews(document: CmsDocument): CmsDocument {
  const hero = document.copy?.home?.hero;
  if (!hero) return document;

  const needsKicker = !hero.kicker || hero.kicker === previousKicker;
  const needsBadges = !Array.isArray(hero.badges) || hero.badges.length === 0;
  const needsAngi = document.angiListing == null;
  if (!needsKicker && !needsBadges && !needsAngi) return document;

  const next = structuredClone(document);
  if (!next.copy.home.hero.kicker || next.copy.home.hero.kicker === previousKicker) {
    next.copy.home.hero.kicker = defaultKicker;
  }
  if (!Array.isArray(next.copy.home.hero.badges) || next.copy.home.hero.badges.length === 0) {
    next.copy.home.hero.badges = defaultBadges.map((item) => ({ ...item }));
  }
  if (next.angiListing == null) next.angiListing = { ...defaultAngiListing };
  return next;
}
