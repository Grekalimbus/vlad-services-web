import { live, readCms } from "@/lib/cms/read";

export type LegalSection = {
  id: string;
  heading: string;
  body: string;
};

export type LegalPage = {
  slug: string;
  href: string;
  title: string;
  status: string;
  intro: string;
  sections: LegalSection[];
};

export const legalPages = live(() => readCms().legalPages as LegalPage[]);

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
