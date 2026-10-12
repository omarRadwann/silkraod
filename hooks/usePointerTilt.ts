"use client";
import { useEffect, useRef, type PointerEvent } from "react";
/** Pointer-only perspective; one queued DOM update per frame and no React rerenders. */
export function usePointerTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef(0);
  const allowed = useRef(false);
  useEffect(() => {
    const media = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => {
      allowed.current = media.matches;
      if (!media.matches) reset();
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      cancelAnimationFrame(frame.current);
    };
  }, []);
  function reset() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    ref.current?.style.removeProperty("--tilt-x");
    ref.current?.style.removeProperty("--tilt-y");
  }
  function onPointerMove(e: PointerEvent<T>) {
    if (!allowed.current || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(
      -1,
      Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1),
    );
    const y = Math.max(
      -1,
      Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1),
    );
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      ref.current?.style.setProperty("--tilt-x", `${-y * 8}deg`);
      ref.current?.style.setProperty("--tilt-y", `${x * 13}deg`);
    });
  }
  return { ref, onPointerMove, onPointerLeave: reset, onBlur: reset };
}
