import type { Metadata } from "next";
import { Contact } from "@/components/contact";
import { PageFrame } from "@/components/page-frame";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Quote",
  description: `Request a quote from ${site.legalName} for TV mounting, electrical, or handyman work across Southern California.`,
};

export default function ContactPage() {
  return (
    <PageFrame
      eyebrow="Contact"
      title="Get Quote"
      description="Share the project, ZIP code, and photos. PrimeFix will follow up with availability and pricing."
    >
      <Contact heading="Tell us about the work" />
    </PageFrame>
  );
}
