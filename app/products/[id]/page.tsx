import type { Metadata } from "next";
import Brand from "@/components/Brand";
import IngredientMotion from "@/components/IngredientMotion";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { products, base, whatsapp } from "@/lib/catalog";
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
        description: `Enquire about BODUO ${p.name} in Egypt. ${p.weight} per pack, ${p.carton} packs per carton. Wholesale prices and availability confirmed on WhatsApp.`,
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
    description: `${p.category}. ${p.weight} per pack, ${p.carton} packs per carton. Wholesale enquiries in Egypt.`,
    sku: p.id,
    brand: { "@type": "Brand", name: "BODUO" },
    weight: p.weight,
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
          <img
            src={`${base}/products/${p.id}-2026.webp`}
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
          <dl>
            <div>
              <dt>Pack size</dt>
              <dd>{p.weight}</dd>
            </div>
            <div>
              <dt>Carton quantity</dt>
              <dd>{p.carton} packs</dd>
            </div>
            <div>
              <dt>Product code</dt>
              <dd>{p.id}</dd>
            </div>
            <div>
              <dt>Trade price</dt>
              <dd>On request</dd>
            </div>
          </dl>
          <a
            className="button dark"
            href={whatsapp(
              `Hello Silk Road! I would like a wholesale quotation for BODUO ${p.name}.\nSKU: ${p.id}\nPack: ${p.weight} × ${p.carton} pcs per carton\nCartons required:\nBusiness name:\nDelivery city:`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            Request a wholesale price
            <ArrowUpRight size={18} />
          </a>
          <small>
            Prices, availability and delivery are confirmed before your order is
            placed.
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
                  <img
                    src={`${base}/products/${item.id}-2026.webp`}
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
                  {item.weight} / {item.carton} packs per carton
                </p>
              </a>
            ))}
        </div>
      </section>
      <footer>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SILK ROAD</span>
          <a href="tel:+201004227074">+20 100 422 7074 ↗</a>
        </div>
      </footer>
    </>
  );
}
