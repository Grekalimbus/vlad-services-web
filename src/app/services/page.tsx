import type { Metadata } from "next";
import { RedirectHash } from "@/shared/layout/redirect-hash";

export const metadata: Metadata = {
  title: "Services",
  robots: { index: false, follow: true },
};

export default function ServicesPage() {
  return <RedirectHash hash="services" label="Services" />;
}
