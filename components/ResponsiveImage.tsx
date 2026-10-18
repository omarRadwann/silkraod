import type { ImgHTMLAttributes } from "react";
import { base } from "@/lib/catalog";
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">;
export function ProductImage({
  id,
  sizes = "(max-width: 560px) 58vw, (max-width: 900px) 30vw, 22vw",
  ...props
}: ImageProps & { id: string }) {
  const revision = id === "132100600" ? "?v=clean-label-2" : "";
  const originalWidth = id.startsWith("130600")
    ? 625
    : id === "130500521"
      ? 599
      : 592;
  return (
    <img
      src={`${base}/products/${id}-480.webp${revision}`}
      srcSet={`${base}/products/${id}-160.webp${revision} 160w, ${base}/products/${id}-320.webp${revision} 320w, ${base}/products/${id}-480.webp${revision} 480w, ${base}/products/${id}-2026.webp${revision} ${originalWidth}w`}
      sizes={sizes}
      width="360"
      height="400"
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
export function ServingImage({
  name,
  sizes = "(max-width: 560px) 88vw, 30vw",
  ...props
}: ImageProps & { name: string }) {
  return (
    <img
      src={`${base}/visuals/${name}-640.webp`}
      srcSet={`${base}/visuals/${name}-380.webp 380w, ${base}/visuals/${name}-640.webp 640w, ${base}/visuals/${name}.webp 1000w`}
      sizes={sizes}
      width="1000"
      height="1250"
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}

