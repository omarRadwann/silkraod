import { base } from "@/lib/catalog";
export default function Brand() {
  return (
    <span className="brand">
      <img
        src={`${base}/silk-road-transparent.webp`}
        alt="Silk Road Import & Export official logo"
        width="288"
        height="310"
      />
    </span>
  );
}
