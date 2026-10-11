"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
export default function Pearls() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 9;
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(-3, 5, 5);
    scene.add(light);
    const geo = new THREE.SphereGeometry(0.24, 24, 24);
    const mats = [0x59261c, 0xffb12e, 0xd95737].map(
      (color) =>
        new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.15,
          metalness: 0.1,
          clearcoat: 1,
        }),
    );
    const pearls = Array.from({ length: 15 }, (_, i) => {
      const mesh = new THREE.Mesh(geo, mats[i % 3]);
      const a = (i / 15) * Math.PI * 2;
      mesh.position.set(Math.cos(a) * 2.4, Math.sin(a) * 2.65, (i % 3) * 0.3);
      const scale = 0.6 + (i % 4) * 0.25;
      mesh.scale.setScalar(scale);
      scene.add(mesh);
      return { mesh, y: mesh.position.y };
    });
    const resize = () => {
      const w = host.clientWidth,
        h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    let frame = 0;
    let active = true;
    let pointer = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer = {
        x: (e.clientX - r.left) / r.width - 0.5,
        y: (e.clientY - r.top) / r.height - 0.5,
      };
    };
    window.addEventListener("pointermove", move);
    const tick = (t: number) => {
      if (active) {
        pearls.forEach(({ mesh, y }, i) => {
          mesh.position.y = y + Math.sin(t * 0.0007 + i) * 0.13;
        });
        scene.rotation.y += (pointer.x * 0.18 - scene.rotation.y) * 0.025;
        scene.rotation.x += (-pointer.y * 0.1 - scene.rotation.x) * 0.025;
        renderer.render(scene, camera);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const visibility = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });
    visibility.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", move);
      geo.dispose();
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={ref} className="pearls" aria-hidden="true" />;
}
