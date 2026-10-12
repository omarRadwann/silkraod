"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { signatures } from "@/lib/signatures";

type Props = { selected: number; separation: number; paused: boolean; onReady: () => void; onFailure: () => void };

/** One bounded, demand-driven scene. There are no remote textures or model requests. */
export default function SignatureScene(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(props);
  const wake = useRef<(() => void) | null>(null);
  latest.current = props;

  useEffect(() => { wake.current?.(); }, [props.selected, props.separation, props.paused]);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      latest.current.onFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0d1c2e, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.environmentIntensity = 0.55;
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 1.55, 8.8);
    camera.lookAt(0, 0.05, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.035);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();

    scene.add(new THREE.AmbientLight(0xd7e7fb, 0.5));
    const key = new THREE.DirectionalLight(0xffead3, 2.5);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const edge = new THREE.DirectionalLight(0xe3f0ff, 1.8);
    edge.position.set(3, 2, -2);
    scene.add(edge);
    const model = new THREE.Group();
    model.rotation.z = -0.075;
    scene.add(model);

    const copper = new THREE.MeshStandardMaterial({ color: 0xb77e50, metalness: 0.8, roughness: 0.3 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x091a2c, metalness: 0, roughness: 0.75, envMapIntensity: 0 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.5, 0.16, 80), darkMetal);
    pedestal.position.y = -1.86;
    scene.add(pedestal);
    for (const radius of [1.38, 1.43]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 6, 96), copper);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.775;
      scene.add(ring);
    }

    // A continuous, thick-walled lathed glass; its interior is modeled separately.
    const glassPoints = [
      [0.001, -1.54], [0.58, -1.54], [0.64, -1.50], [0.67, -1.42],
      [0.87, 1.26], [0.871, 1.31], [0.842, 1.32], [0.834, 1.26],
      [0.634, -1.38], [0.59, -1.42], [0.001, -1.42],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd9e9e8, metalness: 0, roughness: 0.09, transmission: 0.96,
      thickness: 0.13, ior: 1.46, transparent: true, opacity: 0.4,
      clearcoat: 1, envMapIntensity: 1.65, depthWrite: false,
    });
    const glass = new THREE.Mesh(new THREE.LatheGeometry(glassPoints, 96), glassMaterial);
    glass.renderOrder = 5;
    model.add(glass);
    const rimMaterial = new THREE.MeshPhysicalMaterial({ color: 0xdbe9df, roughness: 0.12, metalness: 0.15, transparent: true, opacity: 0.55, depthWrite: false });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.853, 0.018, 8, 96), rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.30;
    model.add(rim);

    const milkGroup = new THREE.Group();
    model.add(milkGroup);
    const palette = { cream: new THREE.Color(signatures[0].liquid), ribbon: new THREE.Color(signatures[0].ribbon) };
    const liquidMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.32, metalness: 0, clearcoat: 0.75, clearcoatRoughness: 0.2, envMapIntensity: 0.65 });
    // Long irregular ribbons run up the walls, resembling a poured drink rather than stacked discs.
    liquidMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.creamColor = { value: palette.cream };
      shader.uniforms.ribbonColor = { value: palette.ribbon };
      shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vDrinkPosition;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvDrinkPosition = position;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vDrinkPosition;\nuniform vec3 creamColor;\nuniform vec3 ribbonColor;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
        float angle = atan(vDrinkPosition.z, vDrinkPosition.x);
        float h = (vDrinkPosition.y + 0.91) / 1.82;
        float flow = sin(angle * 7.0 + sin(h * 5.0 + angle * 2.0) * 0.7);
        float narrow = smoothstep(-0.15, 0.84, flow);
        float lengthVariation = 0.60 + 0.3 * sin(angle * 3.0 + 1.3);
        float trails = narrow * (1.0 - smoothstep(lengthVariation, lengthVariation + 0.30, h));
        float base = (1.0 - smoothstep(0.0, 0.28, h)) * 0.65;
        float marble = sin(angle * 12.0 + h * 13.0) * 0.024;
        diffuseColor.rgb = mix(creamColor, ribbonColor, clamp(trails * 0.82 + base + marble, 0.0, 0.95));`);
    };
    const drink = new THREE.Mesh(new THREE.CylinderGeometry(0.80, 0.662, 1.82, 96, 24), liquidMaterial);
    drink.position.y = 0.12;
    milkGroup.add(drink);
    const liquidTopMaterial = new THREE.MeshPhysicalMaterial({ color: signatures[0].liquid, roughness: 0.24, clearcoat: 1 });
    const surface = new THREE.Mesh(new THREE.CylinderGeometry(0.798, 0.798, 0.022, 96), liquidTopMaterial);
    surface.position.y = 1.038;
    milkGroup.add(surface);

    const pearlGroup = new THREE.Group();
    model.add(pearlGroup);
    const pearlMaterial = new THREE.MeshPhysicalMaterial({ color: 0x160a04, roughness: 0.27, clearcoat: 0.25, clearcoatRoughness: 0.18, specularIntensity: 0.3, metalness: 0, envMapIntensity: 0.2 });
    const pearls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.108, 18, 14), pearlMaterial, 58);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 58; i++) {
      const layer = Math.floor(i / 20);
      const n = i % 20;
      const angle = n * 2.39996 + layer * 0.8;
      const radius = Math.sqrt((n + 0.5) / 20) * (0.50 + layer * 0.025);
      dummy.position.set(Math.cos(angle) * radius, -1.31 + layer * 0.19 + Math.sin(i * 3) * 0.022, Math.sin(angle) * radius);
      dummy.scale.setScalar(0.93 + Math.sin(i * 7.9) * 0.1);
      dummy.updateMatrix();
      pearls.setMatrixAt(i, dummy.matrix);
    }
    pearls.instanceMatrix.needsUpdate = true;
    pearlGroup.add(pearls);
    const syrupMaterial = new THREE.MeshPhysicalMaterial({ color: 0x744323, transparent: true, opacity: 0.32, roughness: 0.15, depthWrite: false });
    const syrup = new THREE.Mesh(new THREE.CylinderGeometry(0.661, 0.621, 0.57, 64), syrupMaterial);
    syrup.position.y = -1.09;
    pearlGroup.add(syrup);

    const iceGroup = new THREE.Group();
    model.add(iceGroup);
    const iceGeometry = new RoundedBoxGeometry(0.39, 0.34, 0.38, 3, 0.06);
    const iceMaterial = new THREE.MeshPhysicalMaterial({ color: 0xe5eee3, roughness: 0.17, transmission: 0.65, thickness: 0.5, ior: 1.31, transparent: true, opacity: 0.82, clearcoat: 1, envMapIntensity: 1.5 });
    for (let i = 0; i < 8; i++) {
      const ice = new THREE.Mesh(iceGeometry, iceMaterial);
      const angle = i * 2.39996;
      const radius = i === 7 ? 0 : 0.28 + (i % 2) * 0.17;
      ice.position.set(Math.cos(angle) * radius, 1.09 + (i % 3) * 0.06, Math.sin(angle) * radius);
      ice.rotation.set(i * 0.22, angle, i * 0.11);
      iceGroup.add(ice);
    }
    // Hollow copper-toned straw: a subtle connection to the Silk Road mark.
    const strawGroup = new THREE.Group();
    strawGroup.position.set(0.39, 1.32, -0.19);
    strawGroup.rotation.z = -0.17;
    const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.053, 0.053, 1.35, 24, 1, true), copper);
    strawGroup.add(straw);
    const strawRim = new THREE.Mesh(new THREE.TorusGeometry(0.047, 0.006, 6, 24), copper);
    strawRim.rotation.x = Math.PI / 2;
    strawRim.position.y = 0.675;
    strawGroup.add(strawRim);
    iceGroup.add(strawGroup);

    const condensation = new THREE.InstancedMesh(new THREE.SphereGeometry(0.017, 8, 6), new THREE.MeshPhysicalMaterial({ color: 0xe3ece5, transmission: 0.3, transparent: true, opacity: 0.42, roughness: 0.1, depthWrite: false }), 65);
    for (let i = 0; i < 65; i++) {
      const angle = i * 2.39996;
      const y = -0.8 + ((i * 37) % 65) / 65 * 1.95;
      const radius = 0.67 + (y + 1.42) / 2.68 * 0.2;
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      const size = 0.5 + ((i * 13) % 7) / 7;
      dummy.scale.set(size, size * 1.35, size);
      dummy.updateMatrix();
      condensation.setMatrixAt(i, dummy.matrix);
    }
    condensation.instanceMatrix.needsUpdate = true;
    model.add(condensation);

    let inView = true;
    let frame = 0;
    let lastTime = 0;
    let clock = 0;
    let spread = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let disposed = false;
    let announced = false;
    let framesRendered = 0;
    let activeSignature = -1;
    const targetCream = new THREE.Color();
    const targetRibbon = new THREE.Color();

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      wake.current?.();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = mount.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.32;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.1;
    };
    const onLeave = () => { pointerX = 0; pointerY = 0; };
    mount.addEventListener("pointermove", onPointer);
    mount.addEventListener("pointerleave", onLeave);
    const contextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      latest.current.onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);

    const render = (time: number) => {
      if (disposed || !inView || document.hidden) { frame = 0; return; }
      frame = requestAnimationFrame(render);
      if (time - lastTime < 1000 / 30) return;
      const dt = Math.min((time - lastTime) / 1000, 0.06);
      lastTime = time;
      const { selected, separation, paused } = latest.current;
      if (!paused) clock += dt;
      const ease = 1 - Math.exp(-dt * 7);
      spread += (separation - spread) * ease;
      camera.position.set(0, 1.35 + spread * 0.25, (camera.aspect < 0.9 ? 8.4 : 7.5) + spread * 1.35);
      camera.lookAt(0, -0.20 + spread * 0.64, 0);
      currentX += ((paused ? 0 : pointerX) - currentX) * ease;
      currentY += ((paused ? 0 : pointerY) - currentY) * ease;
      model.rotation.y = -0.22 + Math.sin(clock * 0.27) * 0.12 + currentX;
      model.rotation.x = currentY;
      model.rotation.z = -0.075 * (1 - spread);
      model.position.y = Math.sin(clock * 0.6) * 0.018 - spread * 0.16;
      model.scale.setScalar(1 - spread * 0.12);
      milkGroup.position.y = spread * 0.34;
      pearlGroup.position.y = -spread * 0.22;
      iceGroup.position.y = spread * 1.18;
      glassMaterial.opacity = 0.4 * (1 - spread * 0.9);
      rimMaterial.opacity = 0.55 * (1 - spread * 0.9);
      condensation.visible = spread < 0.1;
      if (activeSignature !== selected) {
        activeSignature = selected;
        targetCream.set(signatures[selected].liquid);
        targetRibbon.set(signatures[selected].ribbon);
      }
      palette.cream.lerp(targetCream, ease);
      palette.ribbon.lerp(targetRibbon, ease);
      liquidTopMaterial.color.copy(palette.cream);
      renderer.render(scene, camera);
      framesRendered++;
      if (!announced) {
        announced = true;
        mount.dataset.rendered = "true";
        latest.current.onReady();
      }
      // Exposes bounded counters on the scene element for read-only browser QA.
      if (framesRendered % 30 === 0) {
        mount.dataset.frames = String(framesRendered);
        mount.dataset.drawCalls = String(renderer.info.render.calls);
      }
      const colorSettled = Math.abs(palette.cream.r - targetCream.r) + Math.abs(palette.cream.g - targetCream.g) + Math.abs(palette.cream.b - targetCream.b) < 0.001;
      if (paused && colorSettled && Math.abs(spread - separation) < 0.001 && Math.abs(currentX) + Math.abs(currentY) < 0.001) {
        cancelAnimationFrame(frame);
        frame = 0;
        mount.dataset.frames = String(framesRendered);
      }
    };
    const resume = () => {
      if (inView && !document.hidden && !frame && !disposed) { lastTime = performance.now(); frame = requestAnimationFrame(render); }
      if (!inView || document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    };
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; resume(); }, { threshold: 0.01 });
    visibility.observe(mount);
    document.addEventListener("visibilitychange", resume);
    wake.current = resume;
    resume();

    return () => {
      disposed = true;
      wake.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", resume);
      mount.removeEventListener("pointermove", onPointer);
      mount.removeEventListener("pointerleave", onLeave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object instanceof THREE.InstancedMesh) object.dispose();
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="signature-canvas" ref={host} aria-hidden="true" />;
}
