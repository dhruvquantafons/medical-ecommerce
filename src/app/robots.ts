import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Public pages are crawlable; carts, checkout, accounts, auth, admin and internal routes are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/product-images/"],
      disallow: [
        "/cart",
        "/checkout",
        "/account",
        "/order-success",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/search",
        "/admin",
        "/mr",
        "/api",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
