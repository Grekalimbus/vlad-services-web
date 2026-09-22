import type { Metadata } from "next";
import { LegalDocument } from "@/features/legal";
import { PageFrame } from "@/shared/layout";
import { getLegalPage } from "@/lib/legal";

const page = getLegalPage("privacy-policy")!;

export const metadata: Metadata = {
  title: page.title,
  description: "Privacy Policy for PrimeFix Home & Handyman Services LLC.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageFrame eyebrow="Legal" title={page.title}>
      <LegalDocument page={page} />
    </PageFrame>
  );
}
