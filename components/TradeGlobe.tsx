"use client";
import { useEffect, useRef } from "react";
import coords from "@/lib/globe-points.json";

type Point = [number, number, number];
const point = (lat: number, lon: number): Point => {
  const a = lat * Math.PI / 180, b = lon * Math.PI / 180;
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
};
const land: Point[] = [];
for (let i = 0; i < coords.length; i += 2) land.push(point(coords[i], coords[i + 1]));
const origin = point(31.23, 121.47), destination = point(30.04, 31.24);
const route: Point[] = Array.from({ length: 65 }, (_, i) => {
  const t = i / 64, p = origin.map((v, j) => v + (destination[j] - v) * t) as Point;
  const length = Math.hypot(...p), radius = 1.025 + Math.sin(t * Math.PI) * .25;
  return p.map(v => v / length * radius) as Point;
});
const grid: Point[][] = [];
for (let lat = -60; lat <= 60; lat += 30) grid.push(Array.from({ length: 73 }, (_, i) => point(lat, i * 5)));
for (let lon = 0; lon < 360; lon += 45) grid.push(Array.from({ length: 37 }, (_, i) => point(i * 5 - 90, lon)));

/** Lightweight projected globe. Bounded rotation keeps the trade route in view; suspends offscreen. */
export default function TradeGlobe({ compact = false }: { compact?: boolean }) {
  const host = useRef<HTMLDivElement>(null), egypt = useRef<HTMLSpanElement>(null), asia = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const canvas = document.createElement("canvas"), ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    el.prepend(canvas);
    let width = 1, height = 1, frame = 0, last = 0, active = true, disposed = false;
    let x = 0, y = 0, targetX = 0, targetY = 0, frames = 0;
    let spin = 0, interactionUntil = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interaction = el.closest(".collection-hero-editorial") || el;
    let bounds = interaction.getBoundingClientRect();
    const draw = (time: number) => {
      const cy = Math.cos(-1.23 + x + Math.sin(spin) * .12), sy = Math.sin(-1.23 + x + Math.sin(spin) * .12), cx = Math.cos(y), sx = Math.sin(y);
      const cz = Math.cos(-.09), sz = Math.sin(-.09), radius = Math.min(width, height) * .425;
      const centerX = width * .5, centerY = height * .55;
      const project = (p: Point): Point => {
        const rx = p[0] * cy + p[2] * sy, rz = -p[0] * sy + p[2] * cy;
        const ry = p[1] * cx - rz * sx, depth = p[1] * sx + rz * cx;
        return [centerX + (rx * cz - ry * sz) * radius, centerY - (rx * sz + ry * cz) * radius, depth];
      };
      ctx.clearRect(0, 0, width, height);
      const shade = ctx.createRadialGradient(centerX - radius * .35, centerY - radius * .4, 0, centerX, centerY, radius);
      shade.addColorStop(0, "#172c40"); shade.addColorStop(.7, "#102134"); shade.addColorStop(1, "#0c1a2b");
      ctx.fillStyle = shade; ctx.strokeStyle = "#45617c55"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#38516b66"; ctx.lineWidth = .65;
      for (const line of grid) {
        ctx.beginPath(); let started = false;
        for (const p of line) { const q = project(p); if (q[2] > 0) { if (started) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); started = true; } else started = false; }
        ctx.stroke();
      }
      const projectedLand = land.map(project);
      // Group dots by depth to avoid thousands of fill-style changes.
      for (let band = 0; band < 4; band++) {
        ctx.fillStyle = ["#6e849548", "#8096a96e", "#a0b1be8c", "#bec9d3ab"][band]; ctx.beginPath();
        for (const q of projectedLand) { if (q[2] <= 0 || Math.min(3, Math.floor(q[2] * 4)) !== band) continue; ctx.moveTo(q[0] + .75, q[1]); ctx.arc(q[0], q[1], .65 + band * .1, 0, Math.PI * 2); }
        ctx.fill();
      }
      ctx.strokeStyle = "#dca777"; ctx.lineWidth = 1.8; ctx.beginPath();
      let routeStarted = false;
      route.forEach(p => { const q = project(p); if (q[2] < 0) { routeStarted = false; return; } if (!routeStarted) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); routeStarted = true; }); ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const index = Math.floor(((time * .00009 + i / 3) % 1) * 64), q = project(route[index]);
        if (q[2] < 0) continue;
        ctx.fillStyle = "#f6e7cd"; ctx.beginPath(); ctx.arc(q[0], q[1], 2.7, 0, Math.PI * 2); ctx.fill();
      }
      for (const [p, label] of [[destination, egypt.current], [origin, asia.current]] as const) {
        const q = project(p); if (label) label.style.opacity = q[2] > .08 ? "1" : "0"; if (q[2] < 0) continue; ctx.fillStyle = "#d9a273"; ctx.beginPath(); ctx.arc(q[0], q[1], 4.4, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#d9a27388"; ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, Math.PI * 2); ctx.stroke();
        if (label) { label.style.left = `${q[0]}px`; label.style.top = `${q[1] + 18}px`; }
      }
      el.classList.add("globe-ready"); el.dataset.frames = String(++frames);
    };
    const tick = (time: number) => {
      frame = 0;
      if (disposed || !active || document.hidden) return;
      if (time - last < 1000 / (time < interactionUntil ? 60 : 30)) { frame = requestAnimationFrame(tick); return; }
      const dt = Math.min(last ? time - last : 16, 64);
      if (!reduced) spin += dt * .000025;
      const ease = 1 - Math.exp(-dt / 220);
      last = time; x += (targetX - x) * ease; y += (targetY - y) * ease;
      draw(time);
      if (!reduced) frame = requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame && active && !disposed && !document.hidden) frame = requestAnimationFrame(tick); };
    const move = (event: Event) => {
      const e = event as PointerEvent; if (e.pointerType === "touch" || reduced) return;
      bounds = interaction.getBoundingClientRect();
      interactionUntil = performance.now() + 700;
      targetX = Math.max(-1, Math.min(1, ((e.clientX - bounds.left) / bounds.width - .5) * 2)) * .12;
      targetY = Math.max(-1, Math.min(1, ((e.clientY - bounds.top) / bounds.height - .5) * 2)) * .045;
      wake();
    };
    const enter = () => { bounds = interaction.getBoundingClientRect(); };
    const leave = () => { targetX = 0; targetY = 0; wake(); };
    const resize = () => { width = el.clientWidth; height = el.clientHeight; const dpr = Math.min(devicePixelRatio, 1.5); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); bounds = interaction.getBoundingClientRect(); wake(); };
    const visibility = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) { last = 0; wake(); } else { cancelAnimationFrame(frame); frame = 0; } });
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else { last = 0; wake(); } };
    const observer = new ResizeObserver(resize); observer.observe(el); visibility.observe(el);
    interaction.addEventListener("pointerenter", enter); interaction.addEventListener("pointermove", move, { passive: true }); interaction.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", onVisibility); resize();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect(); document.removeEventListener("visibilitychange", onVisibility); interaction.removeEventListener("pointerenter", enter); interaction.removeEventListener("pointermove", move); interaction.removeEventListener("pointerleave", leave); canvas.remove(); el.classList.remove("globe-ready"); };
  }, []);
  return <div className="trade-globe" ref={host} role="img" aria-label="Interactive globe showing imports from Asia to Egypt">
    <span className="globe-pin egypt-pin" ref={egypt}><b>{compact ? "EGYPT" : "EGYPT · DESTINATION"}</b></span>
    <span className="globe-pin asia-pin" ref={asia}><b>{compact ? "ASIA" : "ASIA · ORIGIN"}</b></span>
  </div>;
}
