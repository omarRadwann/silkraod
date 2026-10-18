"use client";
import { memo } from "react";
import { ArrowUpRight, Plus, Check } from "lucide-react";
import { base, type Product } from "@/lib/catalog";
import IngredientMotion from "./IngredientMotion";
import { ProductImage } from "./ResponsiveImage";
type Props = {
  product: Product;
  quantity: number;
  added: boolean;
  onAdd: (id: string) => void;
};
export default memo(function ProductCard({
  product: p,
  quantity,
  added,
  onAdd,
}: Props) {
  return (
    <article
      className="product-card reveal"
      data-id={p.id}
      data-category={p.category}
      style={{ "--product-color": p.color } as React.CSSProperties}
    >
      <a
        className="product-visual"
        href={`${base}/products/${p.id}/`}
        aria-label={`View BODUO ${p.name} details`}
      >
        <div className="product-stage-top">
          <span className="product-maker">
            BODUO<span>THE INGREDIENT COLLECTION</span>
          </span>
          <span className="product-type">{p.category}</span>
        </div>
        <span className="product-halo" aria-hidden="true" />
        <span className="package-contact-shadow" aria-hidden="true" />
        <IngredientMotion product={p} compact />
        <ProductImage
          id={p.id}
          alt={`BODUO ${p.name} ${p.weight} packaging`}
          loading="lazy"
          decoding="async"
          width="360"
          height="400"
        />
        <span className="product-view">
          Explore ingredient <ArrowUpRight size={16} />
        </span>
      </a>
      <div className="product-details">
        <div className="product-title-row">
          <h3>
            <a href={`${base}/products/${p.id}/`}>{p.name}</a>
          </h3>
          {quantity > 0 && (
            <span className="product-selected">
              <Check size={12} />
              {quantity} in order
            </span>
          )}
        </div>
        <p>{p.note}</p>
        <dl className="product-specs">
          <div>
            <dt>Pack size</dt>
            <dd>{p.weight}</dd>
          </div>
          <div>
            <dt>Order unit</dt>
            <dd>1 individual item</dd>
          </div>
        </dl>
        <button
          className={`product-order ${added ? "is-added" : ""}`}
          onClick={() => onAdd(p.id)}
          aria-label={`Add one item of ${p.name}`}
        >
          <span>
            {added ? <Check size={18} /> : <Plus size={18} />}
            {added ? "Added to your order" : "Add to order"}
          </span>
          <span className="product-order-caption">
            Enquire for price <ArrowUpRight size={14} />
          </span>
        </button>
      </div>
    </article>
  );
});
