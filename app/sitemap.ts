import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl;
  // Update only when the catalog or page content changes, not on every build.
  const lastModified = "2026-10-27";
  return [
    { url: `${url}/`, lastModified: "2026-11-01", changeFrequency: "monthly", priority: 1 },
    ...products.map((p) => ({
      url: `${url}/products/${p.id}/`,
      lastModified: p.category === "Powders" ? "2026-11-01" : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
