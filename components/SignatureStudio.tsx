"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight, ArrowUpRight, Download, Layers3, RotateCcw } from "lucide-react";
import { base } from "@/lib/catalog";
import { signatures } from "@/lib/signatures";
import { ProductImage, ServingImage } from "./ResponsiveImage";
import "./signature-studio.css";

const SignatureScene = dynamic(() => import("./SignatureScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** The complete editorial experience is server rendered; WebGL only enhances the illustration. */
export default function SignatureStudio() {
  const [selected, setSelected] = useState(0);
  const [separation, setSeparation] = useState(0);
  const [enhance, setEnhance] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const signature = signatures[selected];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 760px) and (prefers-reduced-motion: no-preference)");
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (connection?.saveData || /(^2g$|slow-2g)/.test(connection?.effectiveType || "")) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    const update = () => {
      if (timer) clearTimeout(timer);
      if (!media.matches) {
        setEnhance(false);
        setReady(false);
      } else if (visible) {
        timer = setTimeout(() => setEnhance(true), 450);
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { rootMargin: "100px" });
    if (root.current) observer.observe(root.current);
    media.addEventListener("change", update);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <section className="signature-hero" ref={root} aria-labelledby="signature-title">
      <div className="signature-masthead">
        <span>ASIAN ORIGINS. EGYPTIAN POSSIBILITIES.</span>
        <span>THE SILK ROAD COLLECTION <i>2026</i></span>
      </div>
      <div className="signature-layout">
        <div className="signature-copy">
          <span className="signature-eyebrow"><i /> INGREDIENTS FOR WHAT’S NEXT</span>
          <h1 id="signature-title">A world{" "}<br />of flavour.<br /><em>Within your reach.</em></h1>
          <p>Exceptional beverage ingredients, sourced from Asia for businesses in Egypt. Your next signature starts here.</p>
          <a className="signature-cta" href="#collection">Discover the collection <ArrowUpRight size={19} /></a>
          <a className="signature-secondary" href="#services">Something else in mind? <span>We source it. <ArrowUpRight size={14} /></span></a>
        </div>

        <div className="signature-experience" aria-label="Interactive signature drink studio">
          <div className="signature-scene-heading">
            <span><b>THE SIGNATURE STUDIO</b><small>One glass. A world of possibilities.</small></span>
            <span className="signature-edition" aria-hidden="true">0{selected + 1}<small>/ 03</small></span>
          </div>
          <div className={`signature-stage${ready ? " is-ready" : ""}${separation > 0.4 ? " is-separated" : ""}`}>
            <div className="signature-watermark" aria-hidden="true">{signature.name}</div>
            <div className="signature-illustration" aria-hidden="true">
              <ServingImage name={signature.photo} alt="" sizes="(max-width: 759px) 78vw, 380px" loading="eager" fetchPriority="high" />
            </div>
            {enhance && !failed && <SceneBoundary onFailure={() => { setFailed(true); setReady(false); }}><SignatureScene selected={selected} separation={separation} paused={paused} onReady={() => setReady(true)} onFailure={() => { setFailed(true); setReady(false); }} /></SceneBoundary>}
            <div className="signature-annotations" aria-hidden="true">
              <span className="annotation-top"><i />A cool finish</span>
              <span className="annotation-middle"><i />{signature.layer}</span>
              <span className="annotation-bottom"><i />A little texture</span>
            </div>
            <span className="signature-stage-note">SERVING CONCEPT / {ready ? "EXPLORE IN 3D" : "INGREDIENT INSPIRATION"}</span>
            {ready && <button className="signature-motion" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume gentle rotation" : "Pause gentle rotation"}>{paused ? "Play motion" : "Pause motion"}</button>}
          </div>
          <div className="signature-controls">
            <div className="signature-choices" role="group" aria-label="Choose a signature drink">
              {signatures.map((item, index) => <button key={item.name} aria-pressed={selected === index} onClick={() => setSelected(index)}><i style={{ background: item.color }} /><span>{item.name}</span></button>)}
            </div>
            {ready && <div className="signature-layer-control">
              <Layers3 size={17} aria-hidden="true" />
              <label htmlFor="signature-layers">Separate the layers</label>
              <input id="signature-layers" type="range" min="0" max="100" step="1" value={Math.round(separation * 100)} onChange={(event) => setSeparation(Number(event.target.value) / 100)} aria-valuetext={separation === 0 ? "Assembled drink" : separation === 1 ? "Fully separated layers" : `${Math.round(separation * 100)} percent separated`} />
              <button onClick={() => setSeparation(separation > 0.5 ? 0 : 1)} aria-label={separation > 0.5 ? "Assemble the drink" : "Separate all layers"}>{separation > 0.5 ? <RotateCcw size={16} /> : <ArrowUpRight size={16} />}</button>
            </div>}
          </div>
        </div>
      </div>

      <div className="signature-shelf">
        <div className="signature-shelf-intro" aria-live="polite" aria-atomic="true"><span>BEHIND THE SIGNATURE</span><h2>{signature.subtitle}</h2><p>{signature.note}</p></div>
        <div className="signature-products">
          {signature.products.map((product) => <a href={`${base}/products/${product.id}/`} key={product.id}>
            <ProductImage id={product.id} alt={`BODUO ${product.name}`} sizes="70px" width="70" height="90" loading="eager" />
            <span><small>BODUO COLLECTION</small><b>{product.name}</b><span>{product.detail}</span></span><ArrowUpRight size={19} />
          </a>)}
        </div>
      </div>
      <div className="signature-bottom"><span>FROM ASIA <ArrowRight size={19} /> TO YOUR NEXT CREATION</span><a href="#about">The Silk Road connection <ArrowDown size={14} /></a><a href={`${base}/silk-road-asia-collection-2026.pdf`} target="_blank" rel="noreferrer">2026 wholesale catalog <Download size={15} /></a></div>
    </section>
  );
}
