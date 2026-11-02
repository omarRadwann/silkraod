import type { ImgHTMLAttributes } from "react";
import { base, productImageId } from "@/lib/catalog";
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">;
export function ProductImage({
  id,
  sizes = "(max-width: 560px) 58vw, (max-width: 900px) 30vw, 22vw",
  ...props
}: ImageProps & { id: string }) {
  const imageId = productImageId(id);
  return (
    <img
      src={`${base}/products/${imageId}-480.webp`}
      srcSet={[160, 320, 480, 960, 1600, 2400].map((width) =>
        `${base}/products/${imageId}-${width === 2400 ? "2026" : width}.webp ${width}w`,
      ).join(", ")}
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

