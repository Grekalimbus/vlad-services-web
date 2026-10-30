"use client";

import { FaqSection } from "@/features/faq/faq-section";
import { useCms } from "@/lib/cms/use-cms";

export function Faq() {
  const cms = useCms();
  const heading = cms.copy.home.faq;
  return (
    <FaqSection
      headingLead={heading.headingLead}
      headingAccent={heading.headingAccent}
      items={cms.faqs}
      paths={{
        headingLead: "copy.home.faq.headingLead",
        headingAccent: "copy.home.faq.headingAccent",
        item: (index, field) => `faqs.${index}.${field}`,
      }}
    />
  );
}
