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
const Pearls = dynamic(() => import("./Pearls"), { ssr: false });
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
      <div className="announcement">
        {t("FROM ASIA, WITH POSSIBILITY.", "من آسيا، إلى فرص جديدة.")}
        <span>{t("WHOLESALE COLLECTION / 2026", "تشكيلة الجملة / ٢٠٢٦")}</span>
        <a
          href={whatsapp(
            "Hello Silkraod! I would like to discuss a wholesale enquiry.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          {t("Let’s talk trade", "لنتحدث عن تجارتك")} ↗
        </a>
      </div>
      <header>
        <a href="#" className="wordmark" aria-label="Silkraod home">
          silkraod<span>®</span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menu ? "nav mobile-open" : "nav"}
        >
          <a href="#collection" onClick={() => setMenu(false)}>
            {t("The collection", "المنتجات")}
          </a>
          <a href="#sourcing" onClick={() => setMenu(false)}>
            {t("Beyond borders", "عبر الحدود")}
          </a>
          <a href="#how-it-works" onClick={() => setMenu(false)}>
            {t("How to order", "كيف تطلب")}
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="lang"
            onClick={() => setAr(!ar)}
            aria-label="Switch language"
          >
            <Globe size={15} />
            {ar ? "EN" : "عربي"}
          </button>
          <button
            ref={cartButton}
            className="bag-button"
            onClick={() => setOpen(true)}
            aria-label={`Open order, ${count} cartons`}
          >
            <ShoppingBag size={18} />
            <span>{t("Your order", "طلبك")}</span>
            <b>{count}</b>
          </button>
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
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              {t("A NEW ROUTE TO SOMETHING GOOD", "طريق جديد لأفكار تستحق")}
            </div>
            <h1>
              {t("Small pearls.", "حبات صغيرة.")}
              <br />
              <em>{t("Big possibilities.", "فرص كبيرة.")}</em>
            </h1>
            <p>
              {t(
                "Your next signature drink starts here. Discover bubble tea ingredients from Asia, brought closer to your business in Egypt.",
                "مشروبك المميز يبدأ هنا. اكتشف مكونات البابل تي من آسيا، أقرب إلى مشروعك في مصر.",
              )}
            </p>
            <a className="button dark" href="#collection">
              {t("Explore the ingredients", "اكتشف المكونات")}
              <ArrowUpRight size={19} />
            </a>
            <div className="hero-bottom">
              <span className="mini-route">
                CN <span>· · · · ✳ · · · ·</span> EG
              </span>
              <span>
                {t("Sourced in Asia.", "من أسواق آسيا.")}
                <br />
                {t("Made for your next chapter.", "لفصل جديد في مشروعك.")}
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-ring ring-one" />
            <div className="art-ring ring-two" />
            <span className="art-note">
              A LITTLE POP.
              <br />A WHOLE LOT OF POTENTIAL.
            </span>
            <div className="hero-circle" />
            <Pearls />
            <img
              className="hero-cup"
              src={`${base}/products/cup.webp`}
              alt="Brown sugar bubble tea serving inspiration"
              fetchPriority="high"
            />
            <div className="art-sticker">
              sip.
              <br />
              smile.
              <br />
              <i>repeat.</i>
              <span>↗</span>
            </div>
            <div className="hero-caption">
              <span>THE BUBBLE TEA EDIT</span>
              <span>01 — 12</span>
            </div>
            <span className="star star-one">✳</span>
            <span className="star star-two">✳</span>
          </div>
        </section>
        <div className="ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                POPPING WITH POSSIBILITY <b>✳</b> FROM CHINA TO EGYPT <b>✳</b>{" "}
                YOUR NEXT SIGNATURE SIP <b>✳</b>{" "}
              </span>
            ))}
          </div>
        </div>
        <section id="collection" className="collection section">
          <div className="section-top reveal">
            <div>
              <div className="eyebrow">
                {t("01 / THE WHOLESALE COLLECTION", "٠١ / تشكيلة الجملة")}
              </div>
              <h2>
                {t("Good things.", "مكونات مميزة.")}
                <br />
                <em>{t("By the carton.", "بالكرتونة.")}</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                {t(
                  "From the first pop to the final swirl. Meet the ingredients behind a menu they’ll come back for.",
                  "من أول حبة بوبا إلى آخر لمسة. تعرّف على المكونات التي تصنع مشروبات يعود لها عملاؤك.",
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
                placeholder={t("Find your flavour", "ابحث عن نكهتك")}
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
          <div
            className="route-art"
            aria-label="Trade route from China to Egypt"
          >
            <div className="route-grid" />
            <span className="route-label top">
              EVERY GOOD IDEA
              <br />
              DESERVES A WAY FORWARD.
            </span>
            <svg
              viewBox="0 0 600 450"
              role="img"
              aria-label="An illustrated route connecting Egypt and China"
            >
              <path
                d="M80 320 Q220 40 490 155"
                stroke="#ee6b3e"
                strokeWidth="2"
                strokeDasharray="5 7"
                fill="none"
              />
              <circle cx="80" cy="320" r="9" fill="#f9edce" />
              <circle cx="80" cy="320" r="23" fill="none" stroke="#c7b68e" />
              <circle cx="490" cy="155" r="9" fill="#ee6b3e" />
              <circle cx="490" cy="155" r="23" fill="none" stroke="#ee6b3e" />
              <text x="58" y="368" fill="#f9edce" fontSize="26">
                EGYPT
              </text>
              <text x="450" y="112" fill="#f9edce" fontSize="26">
                CHINA
              </text>
              <text x="252" y="160" fill="#ee6b3e" fontSize="48">
                ↙
              </text>
            </svg>
            <span className="route-label bottom">
              31°12′ E — 121°28′ E<span>CONNECTED BY POSSIBILITY.</span>
            </span>
          </div>
          <div className="sourcing-copy reveal">
            <div className="eyebrow">
              {t("02 / BEYOND THE INGREDIENTS", "٠٢ / أبعد من المكونات")}
            </div>
            <h2>
              {t("Your ambition.", "طموحك.")}
              <br />
              <em>{t("Our next route.", "وجهتنا القادمة.")}</em>
            </h2>
            <p>
              {t(
                "Silkraod connects opportunity in Asian markets with growing businesses in Egypt. Our current collection is just the beginning.",
                "سيلكراود تربط فرص الأسواق الآسيوية بالمشروعات الطموحة في مصر. وتشكيلتنا الحالية ليست سوى البداية.",
              )}
            </p>
            <p>
              {t(
                "Have a product in mind? Tell us what you’re looking for, your quantities and your timeline. Let’s explore the possibilities together.",
                "هل تبحث عن منتج معين؟ أخبرنا عن المنتج والكميات والجدول الزمني، ولنستكشف الفرص معاً.",
              )}
            </p>
            <a
              className="button cream"
              href={whatsapp(
                "Hello Silkraod! I have a sourcing enquiry.\nProduct:\nQuantity:\nDestination:\nTimeline:",
              )}
              target="_blank"
              rel="noreferrer"
            >
              {t("Let’s talk sourcing", "تحدث معنا عن الاستيراد")}
              <ArrowUpRight size={20} />
            </a>
            <div className="sourcing-tags">
              <span>IMPORT & EXPORT</span>
              <span>ASIA ↔ EGYPT</span>
            </div>
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
                {t("Your next order,", "طلبك القادم،")}
                <br />
                <em>{t("a conversation away.", "يبدأ بمحادثة.")}</em>
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
          <span className="eyebrow">
            {t("THE NEXT BIG THING STARTS SMALL.", "كل فرصة كبيرة تبدأ بخطوة.")}
          </span>
          <h2>
            {t("Let’s make", "لنصنع")}
            <br />
            <em>{t("something pop.", "شيئاً مميزاً.")}</em>
          </h2>
          <a
            className="button dark"
            href={whatsapp(
              "Hello Silkraod! I would like to learn more about your wholesale ingredients.",
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={19} />
            {t("Say hello on WhatsApp", "تواصل معنا عبر واتساب")}
            <ArrowUpRight size={19} />
          </a>
          <span className="contact-flower" aria-hidden="true">
            ✳
          </span>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a href="#" className="wordmark">
            silkraod<span>®</span>
          </a>
          <p>
            {t("From Asia, with possibility.", "من آسيا، إلى فرص جديدة.")}
            <br />
            {t("Import. Export. Grow.", "استيراد. تصدير. نمو.")}
          </p>
          <a href="tel:+201004227074" dir="ltr">
            +20 100 422 7074 ↗
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SILKRAOD</span>
          <span>
            {t("BASED IN EGYPT. CONNECTED TO ASIA.", "من مصر، نتواصل مع آسيا.")}
          </span>
          <a
            href={`${base}/silkraod-wholesale-2026.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            {t("Wholesale catalog", "كتالوج الجملة")} ↗
          </a>
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
                {t(
                  "A LITTLE CLOSER TO YOUR NEXT BIG THING",
                  "خطوة أقرب إلى فرصتك القادمة",
                )}
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
              <h3>{t("Room for possibility.", "مساحة لفرص جديدة.")}</h3>
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
