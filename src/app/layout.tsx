import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — TV wall mounting`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "TV mounting",
    "wall mount television",
    "hide TV cables",
    "TV above fireplace",
    "same day TV installation",
  ],
  authors: [{ name: site.name }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — TV wall mounting`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — TV wall mounting`,
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
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
