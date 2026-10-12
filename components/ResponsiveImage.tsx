import type { ImgHTMLAttributes } from "react";
import { base } from "@/lib/catalog";
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">;
export function ProductImage({
  id,
  sizes = "(max-width: 560px) 58vw, (max-width: 900px) 30vw, 22vw",
  ...props
}: ImageProps & { id: string }) {
  const originalWidth = id.startsWith("130600")
    ? 625
    : id === "130500521"
      ? 599
      : 592;
  return (
    <img
      src={`${base}/products/${id}-480.webp`}
      srcSet={`${base}/products/${id}-160.webp 160w, ${base}/products/${id}-320.webp 320w, ${base}/products/${id}-480.webp 480w, ${base}/products/${id}-2026.webp ${originalWidth}w`}
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

