import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Inline the (small, Tailwind) stylesheet into <head> so it isn't a render-blocking request.
    inlineCss: true,
  },
  cacheComponents: true,
  images: {
    // Sanity images are served by Sanity's CDN directly; see lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Object form without `search`: Sanity image URLs always carry query params (?w=…&auto=format).
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  partialPrefetching: true,
  turbopack: {
    // Drop Next's legacy polyfills for modern browsers (Lighthouse "Legacy JavaScript"); see lib/polyfills.js.
    resolveAlias: {
      "../build/polyfills/polyfill-module": { browser: "./lib/polyfills.js" },
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
