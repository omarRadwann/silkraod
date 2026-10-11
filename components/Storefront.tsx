"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Minus,
  X,
  ShoppingBag,
  Search,
  Menu,
  Check,
  MessageCircle,
  Download,
} from "lucide-react";
import { products, base, whatsapp } from "@/lib/catalog";
import Brand from "./Brand";
const TradeGlobe = dynamic(() => import("./TradeGlobe"), { ssr: false });
const categories = [
  "All ingredients",
  "Popping boba",
  "Core ingredients",
  "Powders",
];
export default function Storefront() {
  const [category, setCategory] = useState("All ingredients"),
    [query, setQuery] = useState(""),
    [cart, setCart] = useState<Record<string, number>>({}),
    [open, setOpen] = useState(false),
    [menu, setMenu] = useState(false),
    [ready, setReady] = useState(false),
    [added, setAdded] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const cartButton = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("silkraod-cart") || "{}");
      const clean: Record<string, number> = {};
      products.forEach((p) => {
        if (Number.isInteger(saved[p.id]) && saved[p.id] > 0)
          clean[p.id] = Math.min(saved[p.id], 999);
      });
      setCart(clean);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("silkraod-cart", JSON.stringify(cart));
      } catch {}
    }
  }, [cart, ready]);
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);
  useEffect(() => {
    const d = dialog.current;
    if (open) {
      d?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      d?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [category, query]);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );
  const change = (id: string, delta: number) =>
    setCart((old) => {
      const next = { ...old };
      next[id] = Math.min(999, Math.max(0, (next[id] || 0) + delta));
      if (!next[id]) delete next[id];
      return next;
    });
  const add = (id: string) => {
    change(id, 1);
    setAdded(id);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setAdded(""), 1700);
  };
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const selected = products.filter((p) => cart[p.id]);
  const order = whatsapp(
    `${"Hello Silk Road! I would like a wholesale quotation and availability for:"}\n\n${selected.map((p) => `${cart[p.id]} carton(s) × ${p.name} | ${p.weight} × ${p.carton} pcs | SKU ${p.id}`).join("\n")}\n\n${"Business name:\nDelivery city:\nPreferred delivery date:"}`,
  );
  const filtered = products.filter(
    (p) =>
      (category === "All ingredients" || p.category === category) &&
      `${p.name} ${p.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip" href="#collection">
        Skip to ingredients
      </a>
      <header>
        <a href="#" className="wordmark" aria-label="Silk Road home">
          <Brand />
        </a>
        <nav
          aria-label="Main navigation"
          className={menu ? "nav mobile-open" : "nav"}
        >
          <a href="#about" onClick={() => setMenu(false)}>
            {"The company"}
          </a>
          <a href="#collection" onClick={() => setMenu(false)}>
            {"Our collection"}
          </a>
          <a href="#sourcing" onClick={() => setMenu(false)}>
            {"Global sourcing"}
          </a>
        </nav>
        <div className="header-actions">
          <button
            ref={cartButton}
            className="bag-button"
            onClick={() => setOpen(true)}
            aria-label={`Open order, ${count} cartons`}
          >
            <ShoppingBag size={17} />
            <span className="bag-label">Your enquiry</span>
            <b>{count}</b>
          </button>
          <a
            className="header-contact"
            href={whatsapp(
              "Hello Silk Road! I would like to discuss a trade enquiry.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            {"Let’s talk"}
            <ArrowUpRight size={15} />
          </a>
          <button
            className="menu-button"
            aria-label="Toggle navigation"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-coordinate">
            CAIRO, EGYPT <span>30.0444° N / 31.2357° E</span>
          </div>
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              {"YOUR DIRECT CONNECTION TO CHINA"}
            </div>
            <h1>
              From <em>China.</em>
              <br />
              To <em>Egypt.</em>
              <br />
              <span>For your business.</span>
            </h1>
            <p>
              Discover BODUO wholesale ingredients and explore sourcing
              opportunities from China. One direct connection for your next move
              in Egypt.
            </p>
            <div className="hero-actions">
              <a className="button light" href="#collection">
                {"Explore our collection"}
                <span>
                  <ArrowUpRight size={19} />
                </span>
              </a>
              <a className="hero-secondary" href="#sourcing">
                {"Find your next opportunity"}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="hero-art">
            <TradeGlobe />
            <div className="globe-orbit-label">
              CHINA TO EGYPT
              <br />
              <span>ONE CLEAR DIRECTION.</span>
            </div>
            <div className="globe-caption">
              <span className="status-dot" />
              CHINA <i>⟶</i> EGYPT
              <span className="globe-caption-sub">
                ORIGIN → DESTINATION / ILLUSTRATIVE ROUTE
              </span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>01 — CHINA → EGYPT</span>
            <span>02 — WHOLESALE & SOURCING</span>
            <a href="#about">
              {"SCROLL TO EXPLORE"}
              <ArrowRight size={14} />
            </a>
          </div>
        </section>
        <section className="about section" id="about">
          <div className="about-label">
            <span className="eyebrow">{"THE SILK ROAD CONNECTION"}</span>
            <span className="about-symbol" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="about-content reveal">
            <h2>
              {"Global possibilities."}
              <br />
              <em>{"Local ambition."}</em>
            </h2>
            <p>
              {
                "Silk Road connects businesses in Egypt with products and sourcing opportunities from China. Explore our current BODUO beverage ingredient range, or talk to us about what your business needs next."
              }
            </p>
            <div className="about-services">
              {[
                {
                  n: "01",
                  title: "Discover",
                  copy: "A focused BODUO collection for your next menu.",
                  href: "#collection",
                },
                {
                  n: "02",
                  title: "Source",
                  copy: "Explore Asian markets with your business in mind.",
                  href: "#sourcing",
                },
                {
                  n: "03",
                  title: "Connect",
                  copy: "Discuss the details directly with our team.",
                  href: "#how-it-works",
                },
              ].map((service) => (
                <a className="service-link" key={service.n} href={service.href}>
                  <span>
                    {service.n}
                    <ArrowUpRight size={18} />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="collection-feature">
          <span className="edition-mark" aria-hidden="true">
            THE BODUO EDIT — VOL. 01 / 2026
          </span>
          <div className="feature-copy">
            <span className="eyebrow">{"INTRODUCING / THE BODUO EDIT"}</span>
            <h2>
              Better ingredients.
              <br />
              <em>Bigger possibilities.</em>
            </h2>
            <p className="feature-description">
              From the first pour to the final topping. Build your next menu
              with BODUO popping boba, powders and core ingredients.
            </p>
            <a className="text-link" href="#collection">
              {"Discover the collection"}
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="feature-products">
            <span className="feature-watermark" aria-hidden="true">
              THE BODUO COLLECTION
            </span>
            <img
              className="feature-mango"
              src={`${base}/products/130600912-source.webp`}
              alt="BODUO mango popping boba"
              width="460"
              height="530"
            />
            <img
              className="feature-berry"
              src={`${base}/products/130600910-source.webp`}
              alt="BODUO strawberry popping boba"
              width="360"
              height="420"
            />
            <div className="feature-caption">
              <span>
                MANGO POPPING BOBA <b>1.2 kg</b>
              </span>
              <span>
                STRAWBERRY POPPING BOBA <b>1.2 kg</b>
              </span>
            </div>
          </div>
        </section>
        <section id="collection" className="collection section">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow">{"01 / THE WHOLESALE COLLECTION"}</div>
              <h2>
                {"Selected with purpose."}
                <br />
                <em>{"Ready for your business."}</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                {
                  "Twelve ingredients. Three collections. Explore the BODUO range and build a wholesale enquiry around your business."
                }
              </p>
              <a
                className="text-link"
                href={`${base}/silkraod-wholesale-2026.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                {"Download the 2026 catalog"}
                <Download size={16} />
              </a>
            </div>
          </div>
          <div className="catalog-toolbar">
            <div
              className="filters"
              role="group"
              aria-label="Filter ingredients"
            >
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
            {filtered.length === 1 ? "ingredient" : "ingredients"} / prices on
            request
          </div>
          <div className="product-grid">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="product-card reveal"
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
                  <img
                    src={`${base}/products/${p.id}-source.webp`}
                    alt={`BODUO ${p.name} ${p.weight} packaging`}
                    loading="lazy"
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
                    {cart[p.id] > 0 && (
                      <span className="product-selected">
                        <Check size={12} />
                        {cart[p.id]} in order
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
                      <dt>Per carton</dt>
                      <dd>{p.carton} packs</dd>
                    </div>
                  </dl>
                  <button
                    className={`product-order ${added === p.id ? "is-added" : ""}`}
                    onClick={() => add(p.id)}
                    aria-label={`Add one carton of ${p.name}`}
                  >
                    <span>
                      {added === p.id ? (
                        <Check size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                      {added === p.id ? "Added to your order" : "Add a carton"}
                    </span>
                    <span className="product-order-caption">
                      Enquire for price <ArrowUpRight size={14} />
                    </span>
                  </button>
                </div>
              </article>
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
              "Wholesale enquiries only. Prices, stock and delivery arrangements are confirmed by our team on WhatsApp."
            }
          </p>
        </section>
        <section id="sourcing" className="sourcing">
          <img
            className="port-image"
            src={`${base}/port.jpg`}
            alt="Aerial view of a shipping container terminal"
            loading="lazy"
          />
          <div className="port-overlay" />
          <div className="sourcing-top">
            <span className="eyebrow">{"FROM CHINA. TO EGYPT."}</span>
            <span>THE NEXT CONNECTION / 02</span>
          </div>
          <div className="sourcing-content reveal">
            <h2>
              {"Great business"}
              <br />
              {"starts with"}
              <br />
              <em>{"a connection."}</em>
            </h2>
            <div className="sourcing-right">
              <p>
                {
                  "Your next opportunity might start in China. Tell us the product, quantity and timeline you have in mind. We’ll discuss sourcing possibilities for your business in Egypt."
                }
              </p>
              <a
                className="button light"
                href={whatsapp(
                  "Hello Silk Road! I have a sourcing enquiry.\nProduct:\nQuantity:\nDestination:\nTimeline:",
                )}
                target="_blank"
                rel="noreferrer"
              >
                {"Start a sourcing enquiry"}
                <span>
                  <ArrowUpRight size={19} />
                </span>
              </a>
            </div>
          </div>
          <div className="sourcing-footer">
            <span>SOURCING / IMPORT / EXPORT</span>
            <span>YOUR AMBITION. OUR NEXT CONVERSATION.</span>
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
                body: "Explore the collection. Add your ingredients and choose how many cartons you need.",
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
              Everything starts with a conversation. Here are the details to
              help you take the first step.
            </p>
          </div>
          <div className="questions-list">
            {[
              [
                "How do I get wholesale pricing?",
                "Choose your ingredients and carton quantities, then open your enquiry and continue to WhatsApp. Our team will discuss current prices and availability before you confirm anything.",
              ],
              [
                "Can I enquire about several products together?",
                "Yes. Add different ingredients to your enquiry and choose the number of cartons for each. Your complete product list is included in the WhatsApp message.",
              ],
              [
                "Can you help source other products from Asia?",
                "We welcome sourcing enquiries beyond the current collection. Share the product, quantities, destination and preferred timeline so we can discuss the possibilities.",
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
      </main>
      <footer>
        <div className="footer-word" aria-hidden="true">
          SILKRAOD<span>↗</span>
        </div>
        <div className="footer-top">
          <a href="#" className="wordmark">
            <Brand />
          </a>
          <p>
            {"From China to Egypt."}
            <br />
            {"A wider world, within reach."}
          </p>
          <div className="footer-links">
            <a href="#collection">{"Collection"} ↗</a>
            <a
              href={`${base}/silkraod-wholesale-2026.pdf`}
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
          <span>{"CHINA → EGYPT. DIRECT CONNECTION."}</span>
          <a href="#">{"BACK TO TOP"} ↑</a>
        </div>
      </footer>
      {count > 0 && !open && (
        <button
          className="enquiry-tray"
          onClick={() => setOpen(true)}
          aria-label={`Review enquiry with ${count} cartons`}
        >
          <span className="tray-icon">
            <ShoppingBag size={18} />
            <b>{count}</b>
          </span>
          <span>
            {" "}
            Your collection is taking shape
            <small>
              {selected.length}{" "}
              {selected.length === 1 ? "ingredient" : "ingredients"} · {count}{" "}
              {count === 1 ? "carton" : "cartons"}
            </small>
          </span>
          <span className="tray-action">
            Review enquiry <ArrowUpRight size={18} />
          </span>
        </button>
      )}
      <div className="toast" role="status" aria-live="polite">
        {added && (
          <>
            <Check size={17} />
            {"One carton added to your order"}
            <button onClick={() => setOpen(true)}>{"View order"} ↗</button>
          </>
        )}
      </div>
      <dialog
        aria-label={"Your wholesale order"}
        ref={dialog}
        className="order-dialog"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="order-panel">
          <div className="order-header">
            <div>
              <div className="eyebrow">{"YOUR WHOLESALE ENQUIRY"}</div>
              <h2>
                {"Your order"}
                <em> ({count})</em>
              </h2>
            </div>
            <button
              className="close"
              onClick={() => setOpen(false)}
              aria-label="Close order"
            >
              <X />
            </button>
          </div>
          {selected.length === 0 ? (
            <div className="empty-order">
              <ShoppingBag size={45} strokeWidth={1} />
              <h3>{"Your collection starts here."}</h3>
              <p>{"Add a few ingredients to start your wholesale enquiry."}</p>
              <button
                className="button dark"
                onClick={() => {
                  setOpen(false);
                  document.getElementById("collection")?.scrollIntoView();
                }}
              >
                {"Explore ingredients"}
                <ArrowUpRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="order-items">
                {selected.map((p) => (
                  <div key={p.id} className="order-item">
                    <img
                      src={`${base}/products/${p.id}-source.webp`}
                      alt=""
                      style={{ background: p.color }}
                    />
                    <div>
                      <h3>{p.name}</h3>
                      <p>
                        {p.weight} × {p.carton} {"pcs / carton"}
                      </p>
                      <span className="quantity">
                        <button
                          onClick={() => change(p.id, -1)}
                          aria-label={`Remove one carton of ${p.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <b>{cart[p.id]}</b>
                        <button
                          disabled={cart[p.id] >= 999}
                          onClick={() => change(p.id, 1)}
                          aria-label={`Add one carton of ${p.name}`}
                        >
                          <Plus size={14} />
                        </button>
                        <small>{"cartons"}</small>
                      </span>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() =>
                        setCart((old) => {
                          const next = { ...old };
                          delete next[p.id];
                          return next;
                        })
                      }
                      aria-label={`Remove ${p.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <div>
                  <span>{"Total cartons"}</span>
                  <b>{count}</b>
                </div>
                <p>
                  {
                    "This is a quotation request. Our team will confirm prices, stock and delivery on WhatsApp."
                  }
                </p>
                <a
                  className="button dark"
                  href={order}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={19} />
                  {"Continue on WhatsApp"}
                  <ArrowUpRight size={19} />
                </a>
                <small>
                  {"Your enquiry opens as a message. Tap send to share it."}
                </small>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
