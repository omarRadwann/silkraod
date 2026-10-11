import { base } from "@/lib/catalog";
export function HeroIngredients() {
  return (
    <div className="hero-ingredients">
      <span className="hero-ingredient-label">ASIAN BEVERAGE INGREDIENTS</span>
      <div className="hero-cargo">
        <img
          src={`${base}/products/130600912-2026.webp`}
          alt="Mango popping boba"
          width="150"
          height="180"
          fetchPriority="high"
        />
        <img
          className="hero-drink"
          src={`${base}/products/tiger-boba-2026.webp`}
          alt="Brown sugar bubble tea serving idea"
          width="150"
          height="220"
          fetchPriority="high"
        />
        <img
          src={`${base}/products/130201334-2026.webp`}
          alt="Signature matcha powder"
          width="145"
          height="180"
          fetchPriority="high"
        />
      </div>
      <div className="hero-ingredient-tags">
        <span>Popping boba</span>
        <span>Tapioca & syrup</span>
        <span>Professional powders</span>
      </div>
      <span className="hero-serving">
        Ingredients for your next signature drink · serving suggestion
      </span>
    </div>
  );
}
export function BeverageStory({
  onSelect,
}: {
  onSelect: (category: string) => void;
}) {
  return (
    <section
      className="beverage-story"
      aria-label="Explore beverage ingredient collections"
    >
      <div className="story-top">
        <span className="eyebrow">FROM INGREDIENT TO SIGNATURE DRINK</span>
        <h2>
          Three collections.
          <br />
          <em>Endless combinations.</em>
        </h2>
        <p>
          Fruit-forward teas, tiger boba and café favourites. Find the
          ingredients behind your next menu.
        </p>
      </div>
      <div className="story-grid">
        <a
          href="#collection"
          className="story-tile story-fruit"
          onClick={() => onSelect("Popping boba")}
        >
          <div className="story-art">
            <img
              src={`${base}/products/130600912-2026.webp`}
              alt="BODUO mango popping boba"
              width="230"
              height="280"
              loading="lazy"
            />
            <img
              src={`${base}/products/130600910-2026.webp`}
              alt="BODUO strawberry popping boba"
              width="210"
              height="250"
              loading="lazy"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <i
                className="story-pearl"
                key={i}
                style={{ "--i": i } as React.CSSProperties}
              />
            ))}
          </div>
          <span>01 / POPPING BOBA</span>
          <h3>A burst of bright.</h3>
          <p>Seven flavours. A colourful finishing touch.</p>
          <b>Explore popping boba ↗</b>
        </a>
        <a
          href="#collection"
          className="story-tile story-tiger"
          onClick={() => onSelect("Core ingredients")}
        >
          <div className="story-art">
            <img
              className="story-tiger-drink"
              src={`${base}/products/tiger-boba-2026.webp`}
              alt="Tiger brown sugar bubble tea serving suggestion"
              width="220"
              height="310"
              loading="lazy"
            />
          </div>
          <span>02 / TAPIOCA + BROWN SUGAR</span>
          <h3>The tiger boba duo.</h3>
          <p>Black tapioca pearls meet brown sugar syrup.</p>
          <b>Explore core ingredients ↗</b>
          <small>Serving suggestion</small>
        </a>
        <a
          href="#collection"
          className="story-tile story-powder"
          onClick={() => onSelect("Powders")}
        >
          <div className="story-art">
            <img
              src={`${base}/products/130201334-2026.webp`}
              alt="BODUO signature matcha powder"
              width="230"
              height="280"
              loading="lazy"
            />
            <img
              className="story-scoop"
              src={`${base}/products/matcha-scoop-2026.webp`}
              alt="Matcha powder serving visual"
              width="200"
              height="170"
              loading="lazy"
            />
          </div>
          <span>03 / PROFESSIONAL POWDERS</span>
          <h3>Scoop. Mix. Create.</h3>
          <p>Matcha, taro and creamer for your drink menu.</p>
          <b>Explore powders ↗</b>
        </a>
      </div>
    </section>
  );
}
