export const assetPath = (path: string) =>
	`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path.startsWith("/") ? path : `/${path}`}`;

export const routes = {
	home: "/",
	services: "/services",
	service: (slug: string) => `/services/${slug}`,
	portfolio: "/portfolio",
	portfolioCategory: (slug: string) => `/portfolio/${slug}`,
	contact: "/contact",
	privacy: "/privacy-policy",
	messagingTerms: "/messaging-terms",
	terms: "/terms",
} as const;

/**
 * Public company identity only.
 * Do not add the registered business address to this object or to any
 * public-facing component. That address is private and must stay off the site.
 */
export const site = {
	name: "PrimeFix Home & Handyman Services LLC",
	shortName: "PrimeFix",
	wordmark: "PrimeFix",
	legalName: "PrimeFix Home & Handyman Services LLC",
	tagline: "TV mounting, electrical, and handyman services across Southern California.",
	description:
		"PrimeFix Home & Handyman Services LLC provides TV mounting, electrical, and general handyman work across Southern California.",
	url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
	websiteHost: "primefixpros.com",
	locale: "en_US",
	phoneDisplay: "(619) 736-3016",
	phoneHref: "tel:+16197363016",
	email: "info@primefixhandyman.com",
	logo: "/brand/primefix-mark.webp",
	availability: "Available 24 hours.",
	guarantee: "2-Year Workmanship Guarantee",
	insured: "Insured business",
	areaServed: "California",
	areaServedShort: "California",
} as const;

export const ctas = {
	quote: "Get Quote",
	call: site.phoneDisplay,
	book: "BOOK A SERVICE",
} as const;

export const nav = [
	{ href: routes.home, label: "Home" },
	{ href: routes.services, label: "Services" },
	{ href: "/#reviews", label: "Reviews" },
	{ href: routes.contact, label: "Contact" },
] as const;

export const footerNav = [
	{ href: routes.home, label: "Home" },
	{ href: routes.services, label: "Services" },
	{ href: routes.service("tv-mounting"), label: "TV Mounting" },
	{ href: routes.service("electrical"), label: "Electrical" },
	{ href: routes.service("handyman"), label: "Handyman" },
	{ href: routes.portfolio, label: "Projects" },
	{ href: routes.contact, label: "Get Quote" },
] as const;

export const legalNav = [
	{ href: routes.privacy, label: "Privacy Policy" },
	{ href: routes.messagingTerms, label: "Messaging Terms & Conditions" },
	{ href: routes.terms, label: "Terms & Conditions" },
] as const;
