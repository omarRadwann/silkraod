"use client";
import dynamic from "next/dynamic";
import { base } from "@/lib/catalog";
const TradeGlobe = dynamic(() => import("./TradeGlobe"), { ssr: false });
export default function GlobeExperience({ compact = false }: { compact?: boolean }) {
  return <div className="hero-art rotating-globe">
    <div className="instant-globe"><img src={`${base}/globe-first-frame.svg`} alt="Trade connection from Asia to Egypt" width="600" height="600" /></div>
    <TradeGlobe compact={compact} />
  </div>;
}
