"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowRight, Download } from "lucide-react";
import { base } from "@/lib/catalog";
import { signatures } from "@/lib/signatures";
import { ProductImage, ServingImage } from "./ResponsiveImage";
import GlobeExperience from "./GlobeExperience";
import "./collection-hero.css";

export default function CollectionHero() {
  const [selected, setSelected] = useState(0);
  const signature = signatures[selected];

  return (
    <section className="collection-hero" aria-labelledby="collection-hero-title">
      <div className="collection-hero-copy">
        <div className="collection-hero-origin"><span>ASIA</span><ArrowRight size={24} /><span>EGYPT</span><i />WHOLESALE & CUSTOM SOURCING</div>
        <h1 id="collection-hero-title">A world of flavour.<br /><em>Within your reach.</em></h1>
        <p>Bring something exceptional to your menu. Discover Asian beverage ingredients for cafés, tea shops and businesses in Egypt.</p>
        <div className="collection-hero-choice-label">EXPLORE YOUR NEXT MENU</div>
        <div className="collection-hero-selector" role="group" aria-label="Explore beverage inspiration">
          {signatures.map((item, index) => <button key={item.name} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>0{index + 1}</span>{item.name}<ArrowUpRight size={16} /></button>)}
        </div>
        <div className="collection-hero-actions">
          <a href="#collection" className="collection-hero-button">Explore the collection<ArrowUpRight size={20} /></a>
          <a href="#services" className="collection-hero-source">Looking for something specific?<br /><span>Explore custom sourcing <ArrowUpRight size={15} /></span></a>
        </div>
        <div className="collection-hero-ingredients">
          <div className="collection-hero-ingredients-heading"><span>START WITH THE INGREDIENTS</span><span>0{selected + 1} / 03</span></div>
          <div className="collection-hero-products" aria-live="polite">
            {signature.products.map(product => <a key={product.id} href={`${base}/products/${product.id}/`}>
              <div className="collection-hero-pack"><ProductImage id={product.id} alt={`BODUO ${product.name}`} sizes="85px" width="85" height="108" loading="eager" /></div>
              <span><b>{product.name}</b><small>{product.detail}</small></span><ArrowUpRight size={17} />
            </a>)}
          </div>
        </div>
      </div>
      <div className="collection-hero-editorial">
        <span className="collection-hero-route-caption">A DIRECT CONNECTION. A WORLD OF FLAVOUR.</span>
        <div className="collection-hero-globe"><GlobeExperience compact /></div>
        {signatures.map((item, index) => <div key={item.name} className="hero-scene" data-active={selected === index} aria-hidden={selected !== index}>
        <div className="collection-hero-photo">
          <ServingImage name={item.photo} alt={`${item.name} beverage serving inspiration`} sizes="(max-width: 760px) 30vw, 225px" loading="eager" fetchPriority={index === 0 ? "high" : "low"} />

          <div className="collection-hero-caption"><span>SERVING INSPIRATION</span><h2>{item.name}</h2></div>
        </div>
        <a className="hero-featured-pack" tabIndex={selected === index ? 0 : -1} href={`${base}/products/${item.products[0].id}/`}>
          <span className="hero-pack-floor" aria-hidden="true" />
          <ProductImage id={item.products[0].id} alt={`Explore ${item.products[0].name}`} sizes="(max-width: 760px) 90px, 140px" loading="eager" />
          <span className="hero-pack-label"><span><small>FROM ORIGIN TO YOUR MENU</small>{item.products[0].name}</span><ArrowUpRight size={14} /></span>
        </a>
        </div>)}

      </div>
      <div className="collection-hero-footer"><span>Original BODUO ingredients.<i />Possibilities beyond the catalog.</span><a href={`${base}/silk-road-asia-collection-2026.pdf`} target="_blank" rel="noreferrer">2026 wholesale catalog<Download size={16} /></a></div>
    </section>
  );
}
