import { base, type Product } from "@/lib/catalog";
/** Serving photography remains separate from the original supplier pack. */
export default function IngredientMotion({ product }: { product: Product }) {
  const scene =
    product.category === "Popping boba"
      ? "fruit-pearls"
      : product.id === "130201334"
        ? "matcha-ritual"
        : product.id === "130201335"
          ? "taro-ritual"
          : product.id === "130401971"
            ? "creamer-ritual"
            : "tiger-ritual";
  return (
    <span className="ingredient-motion" aria-hidden="true">
      <img
        src={`${base}/visuals/${scene}.webp`}
        alt=""
        width="400"
        height="500"
        loading="lazy"
      />
      <span>Serving inspiration</span>
    </span>
  );
}
