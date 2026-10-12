"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { base } from "@/lib/catalog";
const TradeGlobe = dynamic(() => import("./TradeGlobe"), { ssr: false });

/** Always show the SVG. Upgrade visible desktop maps after the critical render. */
export default function GlobeExperience({ compact = false }: { compact?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [enhance, setEnhance] = useState(false);
  useEffect(() => {
    const preference = matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (
      connection?.saveData ||
      /(^2g$|slow-2g)/.test(connection?.effectiveType || "")
    )
      return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !preference.matches || timer) return;
        timer = setTimeout(() => {
          if (preference.matches) setEnhance(true);
        }, 700);
        observer.disconnect();
      },
      { rootMargin: "80px" },
    );
    const update = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
      observer.disconnect();
      if (!preference.matches) setEnhance(false);
      else if (host.current) observer.observe(host.current);
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      if (timer) clearTimeout(timer);
    };
  }, []);
  return (
    <div className="hero-art" ref={host}>
      <div className="instant-globe">
        <img
          src={`${base}/instant-globe.svg`}
          alt="Animated world map showing the trade route from Asia to Egypt"
          width="600"
          height="600"
          decoding="async"
        />
        <span className="map-origin">
          ASIA<span>ORIGIN</span>
        </span>
        <span className="map-destination">
          EGYPT<span>DESTINATION</span>
        </span>
      </div>
      {enhance && <TradeGlobe compact={compact} />}
      <span className="globe-footnote">
        ASIA → EGYPT · ILLUSTRATIVE TRADE CONNECTION
      </span>
    </div>
  );
}
