import type { Metadata } from "next";
import Brand from "@/components/Brand";
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
        title: `BODUO ${p.name} ${p.weight} Wholesale in Egypt | Silkraod`,
        description: `Enquire about BODUO ${p.name} (${p.ar}) in Egypt. ${p.weight} per pack, ${p.carton} packs per carton. Wholesale prices and availability confirmed on WhatsApp.`,
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
      <main className="product-page">
        <div className="product-page-image" style={{ background: p.color }}>
          <img
            src={`${base}/products/${p.id}.webp`}
            alt={`BODUO ${p.name} ${p.weight} pack`}
            width="500"
            height="600"
          />
        </div>
        <div className="product-page-copy">
          <span className="eyebrow">BODUO / {p.category.toUpperCase()}</span>
          <h1>{p.name}</h1>
          <p className="arabic-name" lang="ar" dir="rtl">
            {p.ar}
          </p>
          <p>
            {p.note} Part of the Silkraod wholesale ingredient collection for
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
              `Hello Silkraod! I would like a wholesale quotation for BODUO ${p.name}.\nSKU: ${p.id}\nPack: ${p.weight} × ${p.carton} pcs per carton\nCartons required:\nBusiness name:\nDelivery city:`,
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
      <footer>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SILKRAOD</span>
          <a href="tel:+201004227074">+20 100 422 7074 ↗</a>
        </div>
      </footer>
    </>
  );
}
