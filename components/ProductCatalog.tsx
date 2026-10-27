"use client";
import { useState } from "react";
import { Search, X, Download } from "lucide-react";
import { base, categories, products, type Category } from "@/lib/catalog";
import { BeverageStory } from "./BeverageStory";
import ProductCard from "./ProductCard";
type Props = {
  cart: Record<string, number>;
  added: string;
  onAdd: (id: string) => void;
};
export default function ProductCatalog({ cart, added, onAdd }: Props) {
  const [category, setCategory] = useState<Category>("All ingredients");
  const [query, setQuery] = useState("");
  const filtered = products.filter(
    (p) =>
      (category === "All ingredients" || p.category === category) &&
      `${p.name} ${p.id}`.toLowerCase().includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <BeverageStory onSelect={setCategory} />
      <section id="collection" className="collection section">
        <div className="section-top reveal">
          <div>
            <div className="eyebrow">{"01 / THE WHOLESALE COLLECTION"}</div>
            <h2>
              {"The ingredient collection."}
              <br />
              <em>{"Make it your own."}</em>
            </h2>
          </div>
          <div className="section-intro">
            <p>
              {
                "Explore 12 beverage ingredients with prices in Egyptian pounds. Choose individual tubs, bags or bottles and order on WhatsApp."
              }
            </p>
            <a
              className="text-link"
              href={`${base}/silk-road-collection-2026.pdf?v=prices-2026-10-27`}
              target="_blank"
              rel="noreferrer"
            >
              {"Download the 2026 catalog"}
              <Download size={16} />
            </a>
          </div>
        </div>
        <div className="catalog-toolbar">
          <div className="filters" role="group" aria-label="Filter ingredients">
            {categories.map((c, i) => (
              <button
                key={c}
                className={c === category ? "active" : ""}
                onClick={() => setCategory(c)}
                aria-pressed={c === category}
              >
                {c}
                <small>
                  {i === 0
                    ? products.length
                    : products.filter((p) => p.category === c).length}
                </small>
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={"Search collection"}
              aria-label="Search ingredients"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        <div className="results-count" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "ingredient" : "ingredients"} / EGP per item
        </div>
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={cart[p.id] || 0}
              added={added === p.id}
              onAdd={onAdd}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-results">
            <h3>{"No ingredients found."}</h3>
            <p>{"Try a flavour, product name or item code."}</p>
            <button
              className="button dark"
              onClick={() => {
                setQuery("");
                setCategory(categories[0]);
              }}
            >
              {"Show all ingredients"}
            </button>
          </div>
        )}
        <p className="catalog-note">
          {
            "All prices are in EGP for one individual item at the listed pack size. Delivery is additional and confirmed with availability on WhatsApp before your order is placed."
          }
        </p>
      </section>
    </>
  );
}
