import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { CmsUnavailableError } from "@/lib/cms/errors";
import { loadCms } from "@/lib/cms/load";
import { pageMeta, publicOrigin } from "@/lib/seo";
import styles from "./layout.module.css";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  // Variable font stays smaller than shipping 6 static weight files, and keeps
  // next/font preload of the primary latin file.
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const technor = localFont({
  src: "../fonts/Technor-Variable.woff2",
  variable: "--font-technor",
  weight: "200 900",
  display: "swap",
  preload: true,
});

/** Hero “Pro” accent — Bespoke Stencil (Fontshare / Indian Type Foundry). */
const bespokeStencil = localFont({
  src: "../fonts/BespokeStencil-Variable.woff2",
  variable: "--font-bespoke-stencil",
  weight: "300 800",
  display: "swap",
  preload: true,
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let cms;
  try {
    cms = await loadCms();
  } catch (error) {
    if (!(error instanceof CmsUnavailableError)) throw error;
    return {
      title: "PrimeFix",
      robots: { index: false, follow: false },
    };
  }
  const meta = pageMeta("/", cms);
  return {
    metadataBase: new URL(publicOrigin()),
    title: {
      default: meta.title,
      template: `%s | ${cms.site.shortName}`,
    },
    description: meta.description,
    applicationName: cms.site.legalName,
    keywords: meta.keywords,
    authors: [{ name: cms.site.legalName }],
    category: "Home services",
    // Page-level generateMetadata / metadataFor owns canonical, robots, and OG URL.
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: meta.siteName,
      images: [
        {
          url: "/og.jpg",
          width: 1024,
          height: 576,
          alt: meta.imageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og.jpg"],
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f4f2",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${technor.variable} ${bespokeStencil.variable}`}>
      <body className={styles.body}>
        {children}
        <Script id="mcjs" strategy="lazyOnload">
          {`!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/fd729067f80f2636fa3af1284/f7e51600948470605b7f2acd3.js");`}
        </Script>
      </body>
    </html>
  );
}
