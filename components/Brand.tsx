import { base } from "@/lib/catalog";
export default function Brand() {
  return (
    <span className="brand">
      <img
        src={`${base}/silk-road-approved-160.webp`}
        srcSet={`${base}/silk-road-approved-160.webp 160w, ${base}/silk-road-approved-320.webp 320w`}
        fetchPriority="high"
        sizes="(max-width: 600px) 86px, 108px"
        alt="Silk Road Import & Export official logo"
        width="320"
        height="341"
      />
    </span>
  );
}
