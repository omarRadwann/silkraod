"use client";
import { ArrowUpRight } from "lucide-react";
import { base } from "@/lib/catalog";
import { ProductImage } from "./ResponsiveImage";
import { usePointerTilt } from "@/hooks/usePointerTilt";
const featured = [
  {
    id: "130600908",
    name: "Blueberry popping boba",
    alt: "BODUO blueberry popping boba",
  },
  {
    id: "130401971",
    name: "Non-dairy creamer",
    alt: "BODUO non-dairy creamer C92",
  },
  { id: "130201335", name: "Taro powder", alt: "BODUO taro flavored powder" },
];
function FeaturedPack({ product }: { product: (typeof featured)[number] }) {
  const tilt = usePointerTilt<HTMLAnchorElement>();
  return (
    <a href={`${base}/products/${product.id}/`} {...tilt}>
      <ProductImage
        id={product.id}
        sizes="(max-width: 600px) 23vw, 135px"
        alt={product.alt}
        loading="eager"
      />
      <span>
        {product.name}
        <ArrowUpRight size={13} />
      </span>
    </a>
  );
}
export default function FeaturedProducts() {
  return (
    <div
      className="gateway-products"
      aria-label="Featured ingredient collection"
    >
      {featured.map((product) => (
        <FeaturedPack key={product.id} product={product} />
      ))}
    </div>
  );
}
