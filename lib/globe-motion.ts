/** Pointer coordinates use the rendered sphere, not the surrounding editorial panel. */
export function globePointer(clientX: number, clientY: number, bounds: { left: number; top: number; width: number; height: number }) {
  const radius = Math.min(bounds.width, bounds.height) * .425;
  if (radius <= 0) return { x: 0, y: 0, inside: false };
  const x = (clientX - bounds.left - bounds.width * .5) / radius;
  const y = (clientY - bounds.top - bounds.height * .55) / radius;
  return { x: Math.max(-1, Math.min(1, x)) * .28, y: Math.max(-1, Math.min(1, y)) * .16, inside: Math.hypot(x, y) <= 1.1 };
}
/** Exponential damping has the same response at 60, 120 and 144 Hz. */
export function followGlobe(current: number, target: number, milliseconds: number) {
  return current + (target - current) * -Math.expm1(-Math.max(0, milliseconds) / 135);
}
