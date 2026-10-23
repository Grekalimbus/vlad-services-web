import type { NextConfig } from "next";
import document from "./src/lib/cms/default-document.json";
import { redirectRules } from "./src/lib/seo";
import type { CmsDocument } from "./src/lib/cms/types";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const permanentRedirects = redirectRules(document as CmsDocument);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    if (isStaticExport) return [];
    return permanentRedirects.map((redirect) => ({ ...redirect, permanent: true }));
  },
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
          minimumCacheTTL: 60 * 60 * 24 * 30,
        },
        async headers() {
          const security = [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "X-Frame-Options", value: "SAMEORIGIN" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
            { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          ];
          const hidden = { key: "X-Robots-Tag", value: "noindex, nofollow" };
          return [
            { source: "/admin/:path*", headers: [...security, hidden] },
            { source: "/api/:path*", headers: [...security, hidden] },
            { source: "/:path*", headers: security },
          ];
        },
      }),
};

export default nextConfig;
