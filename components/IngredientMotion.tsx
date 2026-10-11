import type { CSSProperties } from "react";
import { base, type Product } from "@/lib/catalog";
const tones: Record<string, string> = {
  "130600913": "#83ad32",
  "130600914": "#e6a9b4",
  "130600910": "#dc384a",
  "130600911": "#e8b927",
  "130600912": "#f4a51e",
  "130600908": "#514077",
  "130600915": "#ec906b",
  "130500521": "#493028",
  "132100600": "#984717",
  "130401971": "#d6cba9",
  "130201334": "#799231",
  "130201335": "#a184bb",
};
export default function IngredientMotion({ product: p }: { product: Product }) {
  const powder = p.category === "Powders",
    syrup = p.id === "132100600";
  const scoop =
    p.id === "130401971" ? "creamer" : p.id === "130201334" ? "matcha" : "taro";
  return (
    <span
      className={`ingredient-motion ${powder ? "is-powder" : syrup ? "is-syrup" : "is-boba"}`}
      style={{ "--flavor": tones[p.id] } as CSSProperties}
      aria-hidden="true"
    >
      {powder ? (
        <>
          <img
            className="powder-scoop"
            src={`${base}/products/${scoop}-scoop-2026.webp`}
            alt=""
            width="180"
            height="150"
            loading="lazy"
          />
          {Array.from({ length: 12 }, (_, i) => (
            <i
              className="powder-grain"
              key={i}
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </>
      ) : syrup ? (
        <>
          <svg className="syrup-ribbon" viewBox="0 0 140 240">
            <path d="M90 5C20 70 140 90 65 150S10 210 95 230" />
            <path
              className="ribbon-shine"
              d="M90 5C20 70 140 90 65 150S10 210 95 230"
            />
          </svg>
          <i className="syrup-ripple" />
        </>
      ) : (
        Array.from({ length: 7 }, (_, i) => (
          <i
            className="boba-pearl"
            key={i}
            style={{ "--i": i } as CSSProperties}
          />
        ))
      )}
    </span>
  );
}
