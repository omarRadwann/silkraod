"use client";
import { useState } from "react";
import { base, type Product } from "@/lib/catalog";
/** Serving photography remains separate from the original supplier pack. */
import { ServingImage } from "./ResponsiveImage";
const fruitScenes: Record<string, string> = {
  "130600913": "boba-green-apple",
  "130600914": "boba-lychee",
  "130600910": "boba-strawberry",
  "130600911": "boba-passion-fruit",
  "130600912": "boba-mango",
  "130600908": "boba-blueberry",
  "130600915": "boba-peach",
};
export default function IngredientMotion({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [ready, setReady] = useState(false);
  const scene =
    product.category === "Popping boba"
      ? fruitScenes[product.id]
      : product.id === "130201334"
        ? "matcha-ritual"
        : product.id === "130201335"
          ? "taro-ritual"
          : product.id === "130401971"
            ? "creamer-ritual"
            : "tiger-ritual";
  return (
    <span className={`ingredient-motion ${ready ? "is-ready" : ""}`} aria-hidden="true">
      {compact ? <img src={`${base}/visuals/${scene}-preview.webp`} alt="" width="240" height="320" loading="eager" decoding="async" onLoad={() => setReady(true)} /> : <ServingImage
        name={scene}
        onLoad={() => setReady(true)}
        sizes="(max-width: 560px) 26vw, 12vw"
        alt=""
        style={{ objectPosition: product.category === "Popping boba" ? "72% center" : "center" }}
        width="400"
        height="500"
        loading="lazy"
      />}
      <span>Serving inspiration</span>
    </span>
  );
}
