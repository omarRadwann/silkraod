import { ArrowUpRight, ArrowRight, Download } from "lucide-react";
import { base } from "@/lib/catalog";
import GlobeExperience from "./GlobeExperience";
import "./collection-hero.css";

export default function CollectionHero() {
  return (
    <section className="collection-hero" aria-labelledby="collection-hero-title">
      <div className="collection-hero-copy">
        <div className="collection-hero-origin"><span>ASIA</span><ArrowRight size={22} /><span>EGYPT</span><i />SILK ROAD IMPORT & EXPORT</div>
        <h1 id="collection-hero-title">Asian markets.<br /><em>Your next possibility.</em></h1>
        <p>From beverage ingredients to products chosen for your business. We connect businesses in Egypt with sourcing opportunities across Asia.</p>
        <div className="collection-hero-actions">
          <a href="#collection" className="collection-hero-button">Explore our products<ArrowUpRight size={20} /></a>
          <a href="#services" className="collection-hero-source">Request custom sourcing<ArrowUpRight size={18} /></a>
        </div>
        <div className="collection-hero-services"><span>Beverage ingredients</span><span>Custom orders</span><span>Asia → Egypt</span></div>
      </div>
      <div className="collection-hero-editorial">
        <span className="collection-hero-route-caption">YOUR CONNECTION TO ASIA</span>
        <div className="collection-hero-globe"><GlobeExperience compact /></div>
      </div>
      <div className="collection-hero-footer"><span>Choose individual products. Or tell us what you need sourced.</span><a href={`${base}/silk-road-asia-collection-2026.pdf`} target="_blank" rel="noreferrer">Explore the 2026 catalog<Download size={16} /></a></div>
    </section>
  );
}
