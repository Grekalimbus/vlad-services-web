import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header, Providers } from "@/shared/layout";
import { site } from "@/lib/site";
import styles from "./layout.module.css";
import "./globals.css";

const sans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} — TV mounting, electrical & handyman in Southern California`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.legalName,
  keywords: [
    "TV mounting Southern California",
    "electrical Southern California",
    "handyman Southern California",
    "hide TV cables",
    "PrimeFix",
    "home services Southern California",
  ],
  authors: [{ name: site.legalName }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.legalName,
    title: `${site.shortName} — TV mounting, electrical & handyman in Southern California`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.shortName} — TV mounting, electrical & handyman in Southern California`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f4f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={sans.variable}>
      <body className={styles.body}>
        <a
          href="#content"
          className={styles.skipLink}
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
