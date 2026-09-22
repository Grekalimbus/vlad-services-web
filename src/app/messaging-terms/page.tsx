import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal";
import { PageFrame } from "@/shared/layout";
import { getLegalPage } from "@/lib/legal";

const page = getLegalPage("messaging-terms")!;

export const metadata: Metadata = {
  title: page.title,
  description: "Messaging Terms & Conditions for PrimeFix Home & Handyman Services LLC.",
};

export default function MessagingTermsPage() {
  return (
    <PageFrame eyebrow="Legal" title={page.title}>
      <LegalDocument page={page} />
    </PageFrame>
  );
}
