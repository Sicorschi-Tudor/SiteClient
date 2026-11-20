import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Russian is the default locale and lives at "/", English at "/en".
  async rewrites() {
    return [
      { source: "/", destination: "/ru" },
      { source: "/privacy", destination: "/ru/privacy" },
      { source: "/consent", destination: "/ru/consent" },
    ];
  },
  async redirects() {
    return [
      { source: "/ru", destination: "/", permanent: true },
      { source: "/ru/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
