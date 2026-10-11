import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return [];
  return [
    { url: `${url}/`, changeFrequency: "monthly", priority: 1 },
    ...products.map((p) => ({
      url: `${url}/products/${p.id}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
