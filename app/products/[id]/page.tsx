import type { Metadata } from "next";
import { ProductImage } from "@/components/ResponsiveImage";
import Brand from "@/components/Brand";
import IngredientMotion from "@/components/IngredientMotion";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { products, base, whatsapp } from "@/lib/catalog";
import { formatPrice } from "@/lib/order";
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = products.find((p) => p.id === id);
  return p
    ? {
        title: `BODUO ${p.name} ${p.weight} Wholesale in Egypt | Silk Road`,
        alternates: { canonical: `/products/${p.id}/` },
        description: `BODUO ${p.name} for ${formatPrice(p.priceEGP)} per ${p.weight} item in Egypt. Sold individually. Order through Silk Road on WhatsApp. Delivery and availability confirmed before ordering.`,
      }
    : {};
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = products.find((p) => p.id === id);
  if (!p) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `BODUO ${p.name}`,
    description: `${p.category}. ${p.weight} per item. Sold individually. Wholesale enquiries in Egypt.`,
    sku: p.id,
    brand: { "@type": "Brand", name: "BODUO" },
    weight: p.weight,
    offers: {
      "@type": "Offer",
      price: p.priceEGP,
      priceCurrency: "EGP",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://silkroadeg.net"}/products/${p.id}/`,
      seller: { "@type": "Organization", name: "Silk Road" },
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <header>
        <a href={`${base}/`} className="wordmark">
          <Brand />
        </a>
        <a className="text-link" href={`${base}/#collection`}>
          <ArrowLeft size={16} />
          Back to collection
        </a>
      </header>
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <a href={`${base}/`}>Silk Road</a>
        <span>/</span>
        <a href={`${base}/#collection`}>The collection</a>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <main className="product-page">
        <div
          className="product-page-image"
          data-category={p.category}
          style={{ "--product-color": p.color } as React.CSSProperties}
        >
          <span className="detail-edition">BODUO / COLLECTION 2026</span>
          <span className="detail-orbit" aria-hidden="true" />
          <IngredientMotion product={p} />
          <ProductImage
            id={p.id}
            sizes="(max-width: 800px) 65vw, 30vw"
            loading="eager"
            fetchPriority="high"
            alt={`BODUO ${p.name} ${p.weight} pack`}
            width="500"
            height="600"
          />
        </div>
        <div className="product-page-copy">
          <span className="eyebrow">BODUO / {p.category.toUpperCase()}</span>
          <h1>{p.name}</h1>
          <p>
            {p.note} Part of the Silk Road wholesale ingredient collection for
            beverage businesses in Egypt.
          </p>
          <div className="product-price product-page-price">
            <strong>{formatPrice(p.priceEGP)}</strong>
            <span>per {p.weight} item</span>
          </div>
          <dl>
            <div>
              <dt>Pack size</dt>
              <dd>{p.weight}</dd>
            </div>
            <div>
              <dt>Order unit</dt>
              <dd>1 individual item</dd>
            </div>
            <div>
              <dt>Product code</dt>
              <dd>{p.id}</dd>
            </div>
          </dl>
          <a
            className="button dark"
            href={whatsapp(
              `Hello Silk Road! I would like to order BODUO ${p.name}.\nSKU: ${p.id}\nPack: ${p.weight} each\nUnit price: ${formatPrice(p.priceEGP)}\nItems required:\nBusiness name:\nDelivery city:\nPlease confirm availability and delivery charges.`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Order on WhatsApp
            <ArrowUpRight size={18} />
          </a>
          <small>
            Sold individually. Delivery is additional; charges and availability
            are confirmed before your order is placed.
          </small>
          <a className="text-link" href={`${base}/#collection`}>
            Build a mixed-product order
            <ArrowUpRight size={16} />
          </a>
        </div>
      </main>
      <section className="related section">
        <div className="related-top">
          <div>
            <span className="eyebrow">EXPLORE A LITTLE FURTHER</span>
            <h2>
              More for your <em>menu.</em>
            </h2>
          </div>
          <a className="text-link" href={`${base}/#collection`}>
            The complete collection <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="related-grid">
          {products
            .filter((item) => item.id !== p.id)
            .sort(
              (a, b) =>
                Number(b.category === p.category) -
                Number(a.category === p.category),
            )
            .slice(0, 3)
            .map((item) => (
              <a
                className="related-card"
                data-category={item.category}
                key={item.id}
                href={`${base}/products/${item.id}/`}
              >
                <div style={{ background: item.color }}>
                  <ProductImage
                    id={item.id}
                    alt={`BODUO ${item.name}`}
                    loading="lazy"
                    width="300"
                    height="340"
                  />
                  <ArrowUpRight size={20} />
                </div>
                <span>{item.category}</span>
                <h3>{item.name}</h3>
                <p>
                  {item.weight} per item · {formatPrice(item.priceEGP)}
                </p>
              </a>
            ))}
        </div>
      </section>
      <footer>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SILK ROAD</span>
          <a href="tel:+201097477503">+20 109 747 7503 ↗</a>
        </div>
      </footer>
    </>
  );
}
