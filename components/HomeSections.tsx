import {
  ArrowUpRight,
  ArrowRight,
  MessageCircle,
  Plus,
} from "lucide-react";
import { base, whatsapp } from "@/lib/catalog";
import Brand from "./Brand";
import CollectionHero from "./CollectionHero";
import { ProductImage } from "./ResponsiveImage";
export function Introduction() {
  return (
    <>
      <CollectionHero />
      <section className="about section visual-about" id="about">
        <div className="about-photograph">
          <img
            src={`${base}/beverage-editorial.webp`}
            alt="Fruit tea, matcha latte and brown sugar bubble tea serving ideas"
            width="1000"
            height="700"
            loading="lazy"
          />
          <span className="photo-caption">
            YOUR NEXT SIGNATURE STARTS HERE · SERVING IDEAS
          </span>
          <div className="photo-badge">
            <b>Asia → Egypt</b>
            <span>Ingredients. Ideas. Possibilities.</span>
          </div>
        </div>
        <div className="about-content">
          <span className="eyebrow">THE SILK ROAD CONNECTION</span>
          <h2>
            Asian ingredients.
            <br />
            <em>Made for your menu.</em>
          </h2>
          <p>
            From colourful fruit teas to tiger boba and creamy café favourites.
            We connect businesses in Egypt with Asian beverage ingredients—and
            the possibilities they bring.
          </p>
          <div className="about-mini-products">
            <ProductImage
              id="130600910"
              sizes="65px"
              alt="Strawberry popping boba"
              width="110"
              height="130"
              loading="lazy"
            />
            <ProductImage
              id="132100600"
              sizes="65px"
              alt="Brown sugar syrup"
              width="100"
              height="130"
              loading="lazy"
            />
            <ProductImage
              id="130201335"
              sizes="65px"
              alt="Taro powder"
              width="100"
              height="130"
              loading="lazy"
            />
            <span>
              12 ingredients.
              <br />
              <b>Your next creation.</b>
            </span>
          </div>
          <a className="text-link" href="#collection">
            Find your flavour <ArrowUpRight size={20} />
          </a>
        </div>
      </section>
    </>
  );
}
export function ClosingSections() {
  return (
    <>
      <section className="services section" id="services">
        <div className="section-top">
          <div>
            <span className="eyebrow">SOURCED AROUND YOUR BUSINESS</span>
            <h2>
              Your brief.
              <br />
              <em>Our next connection.</em>
            </h2>
          </div>
          <p className="services-intro">
            Our collection is just the beginning. We source and import products
            across Asian markets to match your specific business needs.
          </p>
        </div>
        <div className="service-grid">
          {[
            {
              number: "01",
              title: "Wholesale ingredients",
              body: "Build your beverage menu with our current BODUO range. Choose flavours, pack sizes and item quantities.",
              label: "Browse the collection",
              href: "#collection",
            },
            {
              number: "02",
              title: "Custom product orders",
              body: "Need something specific? Share the product, specifications, quantity and timeline. We’ll help source a solution for your business.",
              label: "Discuss your requirements",
              href: whatsapp(
                "Hello Silk Road! I need a custom order.\nProduct or ingredient:\nSpecifications / reference:\nQuantity:\nDelivery city:\nPreferred timeline:",
              ),
            },
            {
              number: "03",
              title: "Sourcing across Asia",
              body: "Beyond beverages: explore products from Asian markets for your business in Egypt. Tell us what you’re looking for and we’ll discuss sourcing and import arrangements.",
              label: "Start a sourcing enquiry",
              href: whatsapp(
                "Hello Silk Road! Please help me source a product from Asia.\nProduct:\nSpecifications / reference:\nQuantity:\nDestination:\nTimeline:",
              ),
            },
          ].map((service) => (
            <article key={service.number} className="service-card">
              <span>
                {service.number}
                <ArrowUpRight size={20} />
              </span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <a
                className="text-link"
                href={service.href}
                target={service.href.startsWith("https") ? "_blank" : undefined}
                rel={
                  service.href.startsWith("https") ? "noreferrer" : undefined
                }
              >
                {service.label}
                <ArrowRight size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section id="sourcing" className="sourcing">
        <img
          className="port-image"
          src={`${base}/port-optimized.webp`}
          alt="Aerial view of a shipping container terminal"
          width="1600"
          height="1067"
          loading="lazy"
          decoding="async"
        />
        <div className="port-overlay" />
        <div className="sourcing-top">
          <span className="eyebrow">FROM ASIA. TO EGYPT.</span>
          <span>MADE FOR YOUR BUSINESS / 02</span>
        </div>
        <div className="sourcing-content">
          <h2>
            Have something
            <br />
            specific in mind?
            <br />
            <em>Let’s source it.</em>
          </h2>
          <div className="sourcing-right">
            <p>
              A different ingredient, a custom specification, or a product
              beyond our catalog. Share your requirements and we’ll discuss
              options from Asian markets, quantities and delivery to Egypt.
            </p>
            <a
              className="button light"
              href={whatsapp(
                "Hello Silk Road! I have a custom sourcing request.\nProduct:\nSpecifications / reference:\nQuantity:\nDestination in Egypt:\nTimeline:",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Request custom sourcing <ArrowUpRight size={19} />
            </a>
          </div>
        </div>
        <div className="sourcing-footer">
          <span>SOURCING / CUSTOM ORDERS / IMPORT / EXPORT</span>
          <span>YOUR IDEA. OUR NEXT CONVERSATION.</span>
        </div>
      </section>
      <section id="how-it-works" className="how section">
        <div className="section-top reveal">
          <div>
            <div className="eyebrow">
              {"03 / LESS FRICTION. MORE POSSIBILITY."}
            </div>
            <h2>
              {"Simple steps."}
              <br />
              <em>{"A direct conversation."}</em>
            </h2>
          </div>
          <MessageCircle className="how-icon" strokeWidth={1} />
        </div>
        <div className="steps">
          {[
            {
              n: "01",
              title: "Find your mix",
              body: "Explore the collection. Add your ingredients and choose how many items you need.",
            },
            {
              n: "02",
              title: "Send it our way",
              body: "Open your order and continue to WhatsApp. Your product list comes with you.",
            },
            {
              n: "03",
              title: "Let’s make it happen",
              body: "We’ll discuss prices, availability and delivery with you before confirming your order.",
            },
          ].map((s) => (
            <div key={s.n} className="step reveal">
              <span>
                {s.n}
                <ArrowRight size={20} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="questions section" id="questions">
        <div className="questions-intro">
          <span className="eyebrow">A FEW THINGS, ANSWERED</span>
          <h2>
            Good questions.
            <br />
            <em>Clear answers.</em>
          </h2>
          <p>
            Everything starts with a conversation. Here are the details to help
            you take the first step.
          </p>
        </div>
        <div className="questions-list">
          {[
            [
              "How do I get wholesale pricing?",
              "Choose your ingredients and item quantities, then open your enquiry and continue to WhatsApp. Our team will discuss current prices and availability before you confirm anything.",
            ],
            [
              "Can I enquire about several products together?",
              "Yes. Add different ingredients to your enquiry and choose the number of items for each. Your complete product list is included in the WhatsApp message.",
            ],
            [
              "Can you help source other products from Asia?",
              "Yes. We source across Asian markets beyond our beverage collection. Share the product, specifications or reference, quantities, destination and preferred timeline. We’ll discuss sourcing options and import arrangements for your business.",
            ],
            [
              "How are delivery and payment arranged?",
              "Delivery options, timing, payment terms and any applicable charges are discussed directly with our team. Sending an enquiry does not place or pay for an order.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={18} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="contact">
        <div className="contact-top">
          <span className="eyebrow">{"YOUR NEXT CHAPTER STARTS HERE"}</span>
          <span>LET’S BUILD SOMETHING.</span>
        </div>
        <a
          className="contact-title"
          href={whatsapp(
            "Hello Silk Road! I would like to discuss a wholesale or sourcing enquiry.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          <h2>
            {"Think bigger."}
            <br />
            <em>{"Let’s talk."}</em>
          </h2>
          <span className="contact-arrow">
            <ArrowUpRight strokeWidth={1} />
          </span>
        </a>
        <div className="contact-bottom">
          <p>{"One conversation can open a world of possibility."}</p>
          <a href="tel:+201004227074" dir="ltr">
            +20 100 422 7074
          </a>
        </div>
      </section>
    </>
  );
}
export function SiteFooter() {
  return (
    <>
      {" "}
      <footer>
        <div className="footer-word" aria-hidden="true">
          SILKRAOD<span>↗</span>
        </div>
        <div className="footer-top">
          <a href="#" className="wordmark">
            <Brand />
          </a>
          <p>
            {"From Asia to Egypt."}
            <br />
            {"A wider world, within reach."}
          </p>
          <div className="footer-links">
            <a href="#collection">{"Collection"} ↗</a>
            <a
              href={`${base}/silk-road-asia-collection-2026.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              {"Catalog 2026"} ↗
            </a>
            <a href="#sourcing">{"Sourcing"} ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SILK ROAD. ALL RIGHTS RESERVED.
          </span>
          <span>{"ASIA → EGYPT. DIRECT CONNECTION."}</span>
          <a href="#">{"BACK TO TOP"} ↑</a>
        </div>
      </footer>
    </>
  );
}
