import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old pharmacy-era URLs → the current collection pages.
  async redirects() {
    return [
      { source: "/category/:slug", destination: "/collections/:slug", permanent: true },
      { source: "/categories", destination: "/shop", permanent: true },
      { source: "/collections", destination: "/shop", permanent: false },
      // Company pages moved out of /portfolio (changeui.md, Problem 04).
      { source: "/portfolio", destination: "/", permanent: true },
      { source: "/portfolio/about", destination: "/about", permanent: true },
      { source: "/portfolio/catalog", destination: "/products", permanent: true },
      { source: "/portfolio/team", destination: "/team", permanent: true },
    ];
  },
};

export default nextConfig;
