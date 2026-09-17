import { routes } from "@/lib/site";

export type LegalSection = {
  id: string;
  heading: string;
  body: string;
};

export type LegalPage = {
  slug: string;
  href: string;
  title: string;
  status: "placeholder";
  intro: string;
  sections: LegalSection[];
};

const placeholderNote =
  "The client will provide the final text for this page. Placeholder headings are kept so the copy can be dropped in without changing the route or layout.";

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    href: routes.privacy,
    title: "Privacy Policy",
    status: "placeholder",
    intro: placeholderNote,
    sections: [
      { id: "overview", heading: "Overview", body: "Final privacy policy text will appear in this section." },
      { id: "information", heading: "Information we collect", body: "Final text will appear in this section." },
      { id: "use", heading: "How we use information", body: "Final text will appear in this section." },
      { id: "sms", heading: "Text messaging", body: "Final text will appear in this section." },
      { id: "contact", heading: "Contact", body: "Final text will appear in this section." },
    ],
  },
  {
    slug: "messaging-terms",
    href: routes.messagingTerms,
    title: "Messaging Terms & Conditions",
    status: "placeholder",
    intro: placeholderNote,
    sections: [
      { id: "program", heading: "Program description", body: "Final messaging terms will appear in this section." },
      { id: "consent", heading: "Consent", body: "Final text will appear in this section." },
      { id: "opt-out", heading: "Opt-out and help", body: "Final text will appear in this section." },
      { id: "rates", heading: "Message and data rates", body: "Final text will appear in this section." },
    ],
  },
  {
    slug: "terms",
    href: routes.terms,
    title: "Terms & Conditions",
    status: "placeholder",
    intro: placeholderNote,
    sections: [
      { id: "use", heading: "Use of the website", body: "Final terms of service will appear in this section." },
      { id: "services", heading: "Services", body: "Final text will appear in this section." },
      { id: "quotes", heading: "Quotes and bookings", body: "Final text will appear in this section." },
      { id: "liability", heading: "Limitation of liability", body: "Final text will appear in this section." },
    ],
  },
];

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
