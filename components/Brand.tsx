import { base } from "@/lib/catalog";
export default function Brand() {
  return (
    <span className="brand">
      <img
        src={`${base}/silk-road-logo.webp`}
        alt="Silk Road Import & Export official logo"
        width="1254"
        height="1254"
      />
      <span>
        SILK ROAD<small>IMPORT & EXPORT</small>
      </span>
    </span>
  );
}
