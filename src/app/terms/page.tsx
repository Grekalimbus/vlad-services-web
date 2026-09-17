import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { PageFrame } from "@/components/page-frame";
import { getLegalPage } from "@/lib/legal";

const page = getLegalPage("terms")!;

export const metadata: Metadata = {
  title: page.title,
  description: "Terms & Conditions for PrimeFix Home & Handyman Services LLC.",
};

export default function TermsPage() {
  return (
    <PageFrame eyebrow="Legal" title={page.title}>
      <LegalDocument page={page} />
    </PageFrame>
  );
}
