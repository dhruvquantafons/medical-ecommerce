import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old pharmacy-era URLs → the current collection pages.
  async redirects() {
    return [
      { source: "/category/:slug", destination: "/collections/:slug", permanent: true },
      { source: "/categories", destination: "/shop", permanent: true },
      { source: "/collections", destination: "/shop", permanent: false },
    ];
  },
};

export default nextConfig;
