import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import Script from "next/script";
import { Header, Providers } from "@/shared/layout";
import { CmsBoundary } from "@/lib/cms/boundary";
import { bindCms, loadCms } from "@/lib/cms/load";
import { pageMeta, publicOrigin } from "@/lib/seo";
import styles from "./layout.module.css";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cms = await loadCms();
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
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: meta.siteName,
      title: meta.title,
      description: meta.description,
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
      title: meta.title,
      description: meta.description,
      images: ["/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cms = await bindCms();
  const payload = JSON.stringify(cms).replaceAll("<", "\\u003c").replaceAll("&", "\\u0026");
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className={styles.body}>
        <script id="cms-data" dangerouslySetInnerHTML={{ __html: `window.__CMS__=${payload}` }} />
        <a
          href="#content"
          className={styles.skipLink}
        >
          Skip to content
        </a>
        <CmsBoundary document={cms}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </CmsBoundary>
        <Script id="mcjs" strategy="lazyOnload">
          {`!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/fd729067f80f2636fa3af1284/f7e51600948470605b7f2acd3.js");`}
        </Script>
      </body>
    </html>
  );
}
