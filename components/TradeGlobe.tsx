"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import coords from "@/lib/globe-points.json";
export default function TradeGlobe() {
  const host = useRef<HTMLDivElement>(null),
    egypt = useRef<HTMLSpanElement>(null),
    asia = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false,
      frame = 0,
      active = true;
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
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.set(0, 0.25, 6.8);
    const group = new THREE.Group();
    group.rotation.y = -1.23;
    group.rotation.z = -0.09;
    scene.add(group);
    const owned: THREE.BufferGeometry[] = [],
      materials: THREE.Material[] = [];
    const own = <T extends THREE.BufferGeometry>(g: T) => {
      owned.push(g);
      return g;
    };
    const mat = <T extends THREE.Material>(m: T) => {
      materials.push(m);
      return m;
    };
    const point = (lat: number, lon: number, r = 2) =>
      new THREE.Vector3(
        Math.cos((lat * Math.PI) / 180) * Math.sin((lon * Math.PI) / 180) * r,
        Math.sin((lat * Math.PI) / 180) * r,
        Math.cos((lat * Math.PI) / 180) * Math.cos((lon * Math.PI) / 180) * r,
      );
    group.add(
      new THREE.Mesh(
        own(new THREE.SphereGeometry(1.995, 64, 64)),
        mat(new THREE.MeshBasicMaterial({ color: 0x101e30 })),
      ),
    );
    const glow = mat(
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader:
          "varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}",
        fragmentShader:
          "varying vec3 vNormal;varying vec3 vPosition;void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),4.0);gl_FragColor=vec4(0.67,0.76,0.9,rim*0.13);}",
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    );
    group.add(
      new THREE.Mesh(own(new THREE.SphereGeometry(2.015, 64, 64)), glow),
    );
    const gridmat = mat(
      new THREE.LineBasicMaterial({
        color: 0x355274,
        transparent: true,
        opacity: 0.38,
      }),
    );
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts = Array.from({ length: 181 }, (_, i) =>
        point(lat, i * 2, 2.007),
      );
      group.add(
        new THREE.Line(
          own(new THREE.BufferGeometry().setFromPoints(pts)),
          gridmat,
        ),
      );
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const pts = Array.from({ length: 91 }, (_, i) =>
        point(i * 2 - 90, lon, 2.007),
      );
      group.add(
        new THREE.Line(
          own(new THREE.BufferGeometry().setFromPoints(pts)),
          gridmat,
        ),
      );
    }
    const positions: number[] = [];
    for (let i = 0; i < coords.length; i += 2) {
      const p = point(coords[i], coords[i + 1], 2.021);
      positions.push(p.x, p.y, p.z);
    }
    const land = own(new THREE.BufferGeometry());
    land.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    group.add(
      new THREE.Points(
        land,
        mat(
          new THREE.PointsMaterial({
            color: 0x9caab9,
            size: 0.027,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.85,
          }),
        ),
      ),
    );
    const cairo = point(30.04, 31.24, 2.04),
      shanghai = point(31.23, 121.47, 2.04);
    const arcPoints = Array.from({ length: 101 }, (_, i) => {
      const t = i / 100;
      return shanghai
        .clone()
        .lerp(cairo, t)
        .normalize()
        .multiplyScalar(2.04 + Math.sin(t * Math.PI) * 0.54);
    });
    const curve = new THREE.CatmullRomCurve3(arcPoints);
    group.add(
      new THREE.Mesh(
        own(new THREE.TubeGeometry(curve, 100, 0.009, 6, false)),
        mat(new THREE.MeshBasicMaterial({ color: 0xd99a6c })),
      ),
    );
    const moving = Array.from({ length: 3 }, () => {
      const mesh = new THREE.Mesh(
        own(new THREE.SphereGeometry(0.025, 10, 10)),
        mat(new THREE.MeshBasicMaterial({ color: 0xf5efdc })),
      );
      group.add(mesh);
      return mesh;
    });
    [cairo, shanghai].forEach((p) => {
      const marker = new THREE.Mesh(
        own(new THREE.SphereGeometry(0.043, 16, 16)),
        mat(new THREE.MeshBasicMaterial({ color: 0xd99a6c })),
      );
      marker.position.copy(p);
      group.add(marker);
      const ring = new THREE.Mesh(
        own(new THREE.RingGeometry(0.065, 0.076, 32)),
        mat(
          new THREE.MeshBasicMaterial({
            color: 0xd99a6c,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
          }),
        ),
      );
      ring.position.copy(p);
      ring.lookAt(p.clone().multiplyScalar(2));
      group.add(ring);
    });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pointerX = 0,
      pointerY = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointerX = (e.clientX - r.left) / r.width - 0.5;
      pointerY = (e.clientY - r.top) / r.height - 0.5;
    };
    el.addEventListener("pointermove", move);
    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.position.z = Math.max(6.8, 6.55 / camera.aspect);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const visibility = new IntersectionObserver(
      ([entry]) => (active = entry.isIntersecting),
    );
    visibility.observe(el);
    const label = (node: HTMLSpanElement | null, p: THREE.Vector3) => {
      if (!node) return;
      const world = group.localToWorld(p.clone());
      const proj = world.project(camera);
      node.style.opacity = "1";
      node.style.transform = `translate(${((proj.x + 1) * el.clientWidth) / 2}px,${((-proj.y + 1) * el.clientHeight) / 2}px)`;
    };
    const tick = (time: number) => {
      if (active) {
        if (!reduced) {
          group.rotation.y +=
            (-1.23 +
              pointerX * 0.17 +
              Math.sin(time * 0.00012) * 0.045 -
              group.rotation.y) *
            0.035;
          group.rotation.x += (-pointerY * 0.09 - group.rotation.x) * 0.035;
          moving.forEach((p, i) =>
            p.position.copy(curve.getPoint((time * 0.000045 + i / 3) % 1)),
          );
        } else moving.forEach((p, i) => p.position.copy(curve.getPoint(i / 3)));
        renderer.render(scene, camera);
        el.classList.add("globe-ready");
        label(egypt.current, cairo);
        label(asia.current, shanghai);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      disposed = true;

      cancelAnimationFrame(frame);
      ro.disconnect();
      visibility.disconnect();
      el.removeEventListener("pointermove", move);
      owned.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      el.classList.remove("globe-ready");
    };
  }, []);
  return (
    <div
      className="trade-globe"
      ref={host}
      role="img"
      aria-label="An interactive globe illustrating imports from Asia to Egypt"
    >
      <div className="globe-fallback" />
      <span className="globe-pin egypt-pin" ref={egypt}>
        <i />
        <b>EGYPT · DESTINATION</b>
        <small>FOR YOUR BUSINESS IN EGYPT</small>
      </span>
      <span className="globe-pin asia-pin" ref={asia}>
        <i />
        <b>ASIA · ORIGIN</b>
        <small>ASIAN BEVERAGE INGREDIENTS</small>
      </span>
    </div>
  );
}
