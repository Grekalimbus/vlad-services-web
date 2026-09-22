import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal";
import { PageFrame } from "@/shared/layout";
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
