"use client";
import { useRef, useEffect, type PointerEvent } from "react";
import { base } from "@/lib/catalog";

/** One sharp globe from first paint onward; no renderer swap or animation loop. */
export default function GlobeExperience({ compact = false }: { compact?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const reset = () => {
    cancelAnimationFrame(frame.current);
    host.current?.style.setProperty("--map-x", "0px");
    host.current?.style.setProperty("--map-y", "0px");
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 6;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      host.current?.style.setProperty("--map-x", `${x}px`);
      host.current?.style.setProperty("--map-y", `${y}px`);
    });
  };
  return <div className="hero-art stable-globe" ref={host} onPointerMove={move} onPointerLeave={reset}>
    <div className="instant-globe">
      <img src={`${base}/instant-globe.svg`} alt="World map showing the trade route from Asia to Egypt" width="600" height="600" decoding="async" />
    </div>
    {!compact && <span className="globe-footnote">ASIA → EGYPT · ILLUSTRATIVE TRADE CONNECTION</span>}
  </div>;
}
