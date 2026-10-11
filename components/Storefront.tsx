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
  Globe,
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
const arabicCats = [
  "كل المكونات",
  "بوبـا فواكه",
  "المكونات الأساسية",
  "البودرة",
];
export default function Storefront() {
  const [ar, setAr] = useState(false),
    [category, setCategory] = useState("All ingredients"),
    [query, setQuery] = useState(""),
    [cart, setCart] = useState<Record<string, number>>({}),
    [open, setOpen] = useState(false),
    [menu, setMenu] = useState(false),
    [ready, setReady] = useState(false),
    [added, setAdded] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const cartButton = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = (en: string, arabic: string) => (ar ? arabic : en);
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
    document.documentElement.lang = ar ? "ar" : "en";
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [ar]);
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
  }, [category, query, ar]);
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
    `${ar ? "مرحباً سيلكراود، أود طلب أسعار وتأكيد توفر المنتجات التالية:" : "Hello Silkraod! I would like a wholesale quotation and availability for:"}\n\n${selected.map((p) => `${cart[p.id]} carton(s) × ${p.name} | ${p.weight} × ${p.carton} pcs | SKU ${p.id}`).join("\n")}\n\n${ar ? "اسم الشركة:\nالمدينة:\nموعد التسليم المطلوب:" : "Business name:\nDelivery city:\nPreferred delivery date:"}`,
  );
  const filtered = products.filter(
    (p) =>
      (category === "All ingredients" || p.category === category) &&
      `${p.name} ${p.ar} ${p.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip" href="#collection">
        Skip to ingredients
      </a>
      <header>
        <a href="#" className="wordmark" aria-label="Silkraod home">
          <Brand />
        </a>
        <nav
          aria-label="Main navigation"
          className={menu ? "nav mobile-open" : "nav"}
        >
          <a href="#about" onClick={() => setMenu(false)}>
            {t("The company", "عن الشركة")}
          </a>
          <a href="#collection" onClick={() => setMenu(false)}>
            {t("Our collection", "المنتجات")}
          </a>
          <a href="#sourcing" onClick={() => setMenu(false)}>
            {t("Global sourcing", "الاستيراد")}
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="lang"
            onClick={() => setAr(!ar)}
            aria-label="Switch language"
          >
            {ar ? "EN" : "عربي"}
          </button>
          <button
            ref={cartButton}
            className="bag-button"
            onClick={() => setOpen(true)}
            aria-label={`Open order, ${count} cartons`}
          >
            <ShoppingBag size={17} />
            <b>{count}</b>
          </button>
          <a
            className="header-contact"
            href={whatsapp(
              "Hello Silkraod! I would like to discuss a trade enquiry.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            {t("Let’s talk", "تواصل معنا")}
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
              {t("THE WORLD IS CLOSER THAN YOU THINK", "العالم أقرب مما تتخيل")}
            </div>
            <h1>
              {t("Opportunity,", "فرص جديدة،")}
              <br />
              {t("without", "بلا")}
              <br />
              <em>{t("borders.", "حدود.")}</em>
              <span className="heading-arrow" aria-hidden="true">
                ↗
              </span>
            </h1>
            <p>
              {t(
                "Connecting Asian markets with Egyptian ambition. Products, partnerships, and a new perspective on global trade.",
                "نربط الأسواق الآسيوية بالطموح المصري. منتجات وشراكات ورؤية جديدة للتجارة العالمية.",
              )}
            </p>
            <div className="hero-actions">
              <a className="button light" href="#collection">
                {t("Explore our collection", "اكتشف منتجاتنا")}
                <span>
                  <ArrowUpRight size={19} />
                </span>
              </a>
              <a className="hero-secondary" href="#sourcing">
                {t("Find your next opportunity", "اكتشف فرصتك القادمة")}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="hero-art">
            <TradeGlobe />
            <div className="globe-orbit-label">
              A WORLD OF POSSIBILITY
              <br />
              <span>ONE DIRECT CONNECTION.</span>
            </div>
            <div className="globe-caption">
              <span className="status-dot" />
              CHINA <i>─────────</i> EGYPT
              <span className="globe-caption-sub">
                ILLUSTRATIVE TRADE CONNECTION
              </span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>01 — IMPORT & EXPORT</span>
            <span>02 — WHOLESALE INGREDIENTS</span>
            <a href="#about">
              {t("SCROLL TO EXPLORE", "اكتشف المزيد")}
              <ArrowRight size={14} />
            </a>
          </div>
        </section>
        <section className="about section" id="about">
          <div className="about-label">
            <span className="eyebrow">
              {t("THE SILKRAOD PERSPECTIVE", "رؤية سيلكراود")}
            </span>
            <span className="about-symbol" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="about-content reveal">
            <h2>
              {t("A world of potential.", "عالم من الإمكانات.")}
              <br />
              <em>{t("A partner closer to home.", "شريك أقرب إليك.")}</em>
            </h2>
            <p>
              {t(
                "The best opportunities don’t always start nearby. Silkraod brings the possibilities of Asian markets to growing businesses in Egypt — starting with a focused collection of BODUO beverage ingredients.",
                "أفضل الفرص قد تبدأ بعيداً. سيلكراود تقرّب إمكانات الأسواق الآسيوية من المشروعات النامية في مصر، بدءاً بتشكيلة مختارة من مكونات المشروبات من بودو.",
              )}
            </p>
            <div className="about-services">
              <span>
                {t("Asian market sourcing", "توريد من الأسواق الآسيوية")}
              </span>
              <span>{t("Wholesale supply", "توريد بالجملة")}</span>
              <span>
                {t("Import & export enquiries", "استفسارات الاستيراد والتصدير")}
              </span>
            </div>
          </div>
        </section>
        <section className="collection-feature">
          <div className="feature-copy">
            <span className="eyebrow">
              {t("INTRODUCING / THE BODUO EDIT", "نقدم لكم / تشكيلة بودو")}
            </span>
            <h2>
              {t("The ingredients", "مكونات")}
              <br />
              {t("of your", "تصنع")}
              <br />
              <em>{t("next chapter.", "خطوتك القادمة.")}</em>
            </h2>
            <a className="text-link" href="#collection">
              {t("Discover the collection", "اكتشف التشكيلة")}
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="feature-products">
            <span className="feature-watermark">BODUO</span>
            <img
              className="feature-mango"
              src={`${base}/products/130600912.webp`}
              alt="BODUO mango popping boba"
              width="460"
              height="530"
            />
            <img
              className="feature-berry"
              src={`${base}/products/130600910.webp`}
              alt="BODUO strawberry popping boba"
              width="360"
              height="420"
            />
            <div className="feature-caption">
              <span>POPPING BOBA / CORE INGREDIENTS / POWDERS</span>
              <span>COLLECTION 2026</span>
            </div>
          </div>
        </section>
        <section id="collection" className="collection section">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow">
                {t("01 / THE WHOLESALE COLLECTION", "٠١ / تشكيلة الجملة")}
              </div>
              <h2>
                {t("Selected with purpose.", "منتجات مختارة بعناية.")}
                <br />
                <em>{t("Ready for your business.", "جاهزة لمشروعك.")}</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                {t(
                  "Twelve ingredients. Three collections. Explore the BODUO range and build a wholesale enquiry around your business.",
                  "اثنا عشر منتجاً في ثلاث مجموعات. اكتشف تشكيلة بودو وابدأ طلب عرض أسعار يناسب مشروعك.",
                )}
              </p>
              <a
                className="text-link"
                href={`${base}/silkraod-wholesale-2026.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                {t("Download the 2026 catalog", "تحميل كتالوج ٢٠٢٦")}
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
                  {ar ? arabicCats[i] : c}
                  {i === 0 && <small>12</small>}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Search collection", "ابحث في المنتجات")}
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
            {t("ingredients / prices on request", "منتج / الأسعار عند الطلب")}
          </div>
          <div className="product-grid">
            {filtered.map((p, i) => (
              <article
                key={p.id}
                className="product-card reveal"
                style={{ "--product-color": p.color } as React.CSSProperties}
              >
                <div className="product-visual">
                  <span className="product-index">
                    {String(products.indexOf(p) + 1).padStart(2, "0")} / BODUO
                  </span>
                  <span className="product-weight">{p.weight}</span>
                  <img
                    src={`${base}/products/${p.id}.webp`}
                    alt={`BODUO ${p.name} ${p.weight} packaging`}
                    loading="lazy"
                    width="360"
                    height="400"
                  />
                  <button
                    className={`quick-add ${added === p.id ? "is-added" : ""}`}
                    onClick={() => add(p.id)}
                    aria-label={`Add one carton of ${p.name}`}
                  >
                    {added === p.id ? <Check size={21} /> : <Plus size={21} />}
                  </button>
                </div>
                <div className="product-details">
                  <span className="product-category">
                    {ar
                      ? arabicCats[categories.indexOf(p.category)]
                      : p.category}
                  </span>
                  <h3>
                    <a href={`${base}/products/${p.id}/`}>
                      {ar ? p.ar : p.name}
                    </a>
                  </h3>
                  <p>{ar ? `${p.carton} عبوة في الكرتونة` : p.note}</p>
                  <div className="product-foot">
                    <span>
                      {p.carton} {t("pcs / carton", "عبوة / كرتونة")}
                    </span>
                    <button onClick={() => add(p.id)}>
                      {added === p.id
                        ? t("Added ✓", "تمت الإضافة ✓")
                        : t("Add to order", "أضف لطلبك")}
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-results">
              <h3>{t("No ingredients found.", "لا توجد نتائج.")}</h3>
              <p>
                {t(
                  "Try a flavour, product name or item code.",
                  "جرّب اسم النكهة أو المنتج أو كود الصنف.",
                )}
              </p>
              <button
                className="button dark"
                onClick={() => {
                  setQuery("");
                  setCategory(categories[0]);
                }}
              >
                {t("Show all ingredients", "عرض كل المكونات")}
              </button>
            </div>
          )}
          <p className="catalog-note">
            {t(
              "Wholesale enquiries only. Prices, stock and delivery arrangements are confirmed by our team on WhatsApp.",
              "طلبات الجملة فقط. يتم تأكيد الأسعار والتوفر وترتيبات التسليم مع فريقنا عبر واتساب.",
            )}
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
            <span className="eyebrow">
              {t("ASIA TO EGYPT. AND BEYOND.", "من آسيا إلى مصر. وما بعدها.")}
            </span>
            <span>THE NEXT CONNECTION / 02</span>
          </div>
          <div className="sourcing-content reveal">
            <h2>
              {t("Great business", "الأعمال الكبيرة")}
              <br />
              {t("starts with", "تبدأ")}
              <br />
              <em>{t("a connection.", "بعلاقة قوية.")}</em>
            </h2>
            <div className="sourcing-right">
              <p>
                {t(
                  "Looking beyond our current collection? Tell us what you need, your quantities, and your timeline. Let’s explore sourcing possibilities in Asian markets together.",
                  "هل تبحث عن منتجات خارج تشكيلتنا الحالية؟ أخبرنا باحتياجاتك وكمياتك وجدولك الزمني. لنستكشف معاً فرص التوريد من الأسواق الآسيوية.",
                )}
              </p>
              <a
                className="button light"
                href={whatsapp(
                  "Hello Silkraod! I have a sourcing enquiry.\nProduct:\nQuantity:\nDestination:\nTimeline:",
                )}
                target="_blank"
                rel="noreferrer"
              >
                {t("Start a sourcing enquiry", "ابدأ استفسار توريد")}
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
                {t(
                  "03 / LESS FRICTION. MORE POSSIBILITY.",
                  "٠٣ / خطوات أقل. فرص أكثر.",
                )}
              </div>
              <h2>
                {t("Simple steps.", "خطوات بسيطة.")}
                <br />
                <em>{t("A direct conversation.", "تواصل مباشر.")}</em>
              </h2>
            </div>
            <MessageCircle className="how-icon" strokeWidth={1} />
          </div>
          <div className="steps">
            {[
              {
                n: "01",
                title: t("Find your mix", "اختر تشكيلتك"),
                body: t(
                  "Explore the collection. Add your ingredients and choose how many cartons you need.",
                  "اكتشف المنتجات، أضف المكونات وحدد عدد الكراتين.",
                ),
              },
              {
                n: "02",
                title: t("Send it our way", "أرسل لنا طلبك"),
                body: t(
                  "Open your order and continue to WhatsApp. Your product list comes with you.",
                  "افتح طلبك وانتقل إلى واتساب. ستجد قائمة المنتجات جاهزة للإرسال.",
                ),
              },
              {
                n: "03",
                title: t("Let’s make it happen", "لنبدأ معاً"),
                body: t(
                  "We’ll discuss prices, availability and delivery with you before confirming your order.",
                  "نتفق معك على الأسعار والتوفر والتسليم قبل تأكيد الطلب.",
                ),
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
        <section className="contact">
          <div className="contact-top">
            <span className="eyebrow">
              {t("YOUR NEXT CHAPTER STARTS HERE", "خطوتك القادمة تبدأ هنا")}
            </span>
            <span>LET’S BUILD SOMETHING.</span>
          </div>
          <a
            className="contact-title"
            href={whatsapp(
              "Hello Silkraod! I would like to discuss a wholesale or sourcing enquiry.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            <h2>
              {t("Think bigger.", "فكّر أبعد.")}
              <br />
              <em>{t("Let’s talk.", "لنتحدث.")}</em>
            </h2>
            <span className="contact-arrow">
              <ArrowUpRight strokeWidth={1} />
            </span>
          </a>
          <div className="contact-bottom">
            <p>
              {t(
                "One conversation can open a world of possibility.",
                "محادثة واحدة قد تفتح عالماً من الفرص.",
              )}
            </p>
            <a href="tel:+201004227074" dir="ltr">
              +20 100 422 7074
            </a>
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a href="#" className="wordmark">
            <Brand />
          </a>
          <p>
            {t("Asian markets. Egyptian ambition.", "أسواق آسيوية. طموح مصري.")}
            <br />
            {t("A wider world, within reach.", "عالم أوسع، أقرب إليك.")}
          </p>
          <div className="footer-links">
            <a href="#collection">{t("Collection", "المنتجات")} ↗</a>
            <a
              href={`${base}/silkraod-wholesale-2026.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              {t("Catalog 2026", "كتالوج ٢٠٢٦")} ↗
            </a>
            <a href="#sourcing">{t("Sourcing", "التوريد")} ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SILKRAOD. ALL RIGHTS RESERVED.
          </span>
          <span>
            {t("BASED IN EGYPT. CONNECTED TO ASIA.", "من مصر، نتواصل مع آسيا.")}
          </span>
          <a href="#">{t("BACK TO TOP", "العودة للأعلى")} ↑</a>
        </div>
      </footer>
      <div className="toast" role="status" aria-live="polite">
        {added && (
          <>
            <Check size={17} />
            {t("One carton added to your order", "تمت إضافة كرتونة إلى طلبك")}
            <button onClick={() => setOpen(true)}>
              {t("View order", "عرض الطلب")} ↗
            </button>
          </>
        )}
      </div>
      <dialog
        aria-label={t("Your wholesale order", "طلب الجملة")}
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
              <div className="eyebrow">
                {t("YOUR WHOLESALE ENQUIRY", "خطوة أقرب إلى فرصتك القادمة")}
              </div>
              <h2>
                {t("Your order", "طلبك")}
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
              <h3>{t("Your collection starts here.", "تشكيلتك تبدأ هنا.")}</h3>
              <p>
                {t(
                  "Add a few ingredients to start your wholesale enquiry.",
                  "أضف بعض المنتجات لتبدأ طلب عرض أسعار الجملة.",
                )}
              </p>
              <button
                className="button dark"
                onClick={() => {
                  setOpen(false);
                  document.getElementById("collection")?.scrollIntoView();
                }}
              >
                {t("Explore ingredients", "اكتشف المنتجات")}
                <ArrowUpRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="order-items">
                {selected.map((p) => (
                  <div key={p.id} className="order-item">
                    <img
                      src={`${base}/products/${p.id}.webp`}
                      alt=""
                      style={{ background: p.color }}
                    />
                    <div>
                      <h3>{ar ? p.ar : p.name}</h3>
                      <p>
                        {p.weight} × {p.carton}{" "}
                        {t("pcs / carton", "عبوة / كرتونة")}
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
                        <small>{t("cartons", "كرتونة")}</small>
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
                  <span>{t("Total cartons", "إجمالي الكراتين")}</span>
                  <b>{count}</b>
                </div>
                <p>
                  {t(
                    "This is a quotation request. Our team will confirm prices, stock and delivery on WhatsApp.",
                    "هذا طلب عرض أسعار. سيؤكد فريقنا الأسعار والتوفر والتسليم عبر واتساب.",
                  )}
                </p>
                <a
                  className="button dark"
                  href={order}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={19} />
                  {t("Continue on WhatsApp", "متابعة عبر واتساب")}
                  <ArrowUpRight size={19} />
                </a>
                <small>
                  {t(
                    "Your enquiry opens as a message. Tap send to share it.",
                    "سيفتح طلبك كرسالة. اضغط إرسال لمشاركتها.",
                  )}
                </small>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
