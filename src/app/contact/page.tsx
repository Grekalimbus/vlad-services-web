import type { Metadata } from "next";
import { RedirectHash } from "@/shared/layout/redirect-hash";

export const metadata: Metadata = {
  title: "Contact",
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return <RedirectHash hash="footer" label="Contact" />;
}
