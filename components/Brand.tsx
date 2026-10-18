import { base } from "@/lib/catalog";
export default function Brand() {
  return (
    <span className="brand">
      <img
        src={`${base}/silk-road-transparent-160.webp`}
        srcSet={`${base}/silk-road-transparent-160.webp 160w, ${base}/silk-road-transparent-288.webp 288w`}
        fetchPriority="high"
        sizes="(max-width: 600px) 86px, 108px"
        alt="Silk Road Import & Export official logo"
        width="288"
        height="310"
      />
    </span>
  );
}
