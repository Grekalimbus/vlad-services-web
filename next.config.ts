import type { NextConfig } from "next";

const repo = "vlad-services-web";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const isStaticExport = isGithubPages || process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
        ...(isGithubPages
          ? {
              basePath: `/${repo}`,
              assetPrefix: `/${repo}`,
            }
          : {}),
      }
    : {}),
};

export default nextConfig;
