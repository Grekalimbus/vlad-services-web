export const hearAboutOptions = [
	"Friend/Family",
	"Google",
	"Instagram",
	"Facebook",
	"LinkedIn",
	"Yelp",
	"BBB",
	"Home Adviser",
	"Real Estate Agent",
	"Offer-up",
	"AI (GPT, GEMINI, others...)",
	"Other",
] as const;

export type HearAboutOption = (typeof hearAboutOptions)[number];

export type HearAboutIconId =
	| "friend"
	| "google"
	| "instagram"
	| "facebook"
	| "linkedin"
	| "yelp"
	| "bbb"
	| "home"
	| "agent"
	| "offerup"
	| "ai"
	| "other";

export const hearAboutIcons: Record<HearAboutOption, HearAboutIconId> = {
	"Friend/Family": "friend",
	Google: "google",
	Instagram: "instagram",
	Facebook: "facebook",
	LinkedIn: "linkedin",
	Yelp: "yelp",
	BBB: "bbb",
	"Home Adviser": "home",
	"Real Estate Agent": "agent",
	"Offer-up": "offerup",
	"AI (GPT, GEMINI, others...)": "ai",
	Other: "other",
};
