import type { NextConfig } from "next";

const repo = "vlad-services-web";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
        basePath: `/${repo}`,
        assetPrefix: `/${repo}`,
      }
    : {}),
};

export default nextConfig;
