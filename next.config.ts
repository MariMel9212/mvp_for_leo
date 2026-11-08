import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "1";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

if (pages) process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(pages
    ? {
        output: "export",
        distDir: ".next-pages",
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
