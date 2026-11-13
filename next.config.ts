import type { NextConfig } from "next";

const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];
const hidden = { key: "X-Robots-Tag", value: "noindex, nofollow" };
const noStore = { key: "Cache-Control", value: "private, no-store" };

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1"],
  images: { unoptimized: true, qualities: [65, 70, 75, 80] },
  experimental: {
    staleTimes: { dynamic: 0, static: 30 },
  },
  async headers() {
    const pages = ["/", "/areas", "/deals", "/contact", "/blog", "/blog/:path*", "/privacy-policy", "/messaging-terms", "/services", "/services/:path*"];
    return [
      { source: "/:path*", headers: security },
      ...pages.map((source) => ({ source, headers: [noStore] })),
      { source: "/admin", headers: [hidden, noStore] },
      { source: "/admin/:path*", headers: [...security, hidden, noStore] },
      { source: "/api/admin/:path*", headers: [...security, hidden, noStore] },
      { source: "/api/content", headers: [...security, hidden, noStore] },
      { source: "/api/applications", headers: [...security, hidden, noStore] },
    ];
  },
};

export default nextConfig;
