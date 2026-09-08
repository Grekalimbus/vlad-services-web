export const site = {
  name: "Vlad 24 Hours Daily",
  wordmark: "Vlad",
  hoursShort: "24 Hours Daily",
  tagline: "Professional television mounting, any hour of the day.",
  description:
    "Same-day TV wall mounting with concealed cables, fireplace installs, and a three-year workmanship warranty. Available 24 hours daily.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  phoneDisplay: "(213) 555-2400",
  phoneHref: "tel:+12135552400",
  email: "hello@vlad.services",
  hours: "24 hours daily",
  areaServed: "Greater Los Angeles",
} as const;

export const nav = [
  { href: "#plan", label: "Plan" },
  { href: "#tv", label: "Mounting" },
  { href: "#works", label: "Work" },
  { href: "#faq", label: "Questions" },
  { href: "#contact", label: "Contact" },
] as const;
