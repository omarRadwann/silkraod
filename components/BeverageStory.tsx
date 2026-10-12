import type { Category } from "@/lib/catalog";
import { ServingImage } from "./ResponsiveImage";
const collections = [
  {
    category: "Popping boba",
    photo: "fruit-pearls",
    title: "Little pearls. Big possibilities.",
    text: "Seven fruit flavours to finish your signature tea.",
    alt: "Translucent fruit pearls in syrup with mango and strawberry",
    label: "01 / THE FRUIT COLLECTION",
  },
  {
    category: "Core ingredients",
    photo: "tiger-ritual",
    title: "The art of brown sugar.",
    text: "Tapioca pearls and syrup. Your tiger boba essentials.",
    alt: "Brown sugar milk tea with glossy tapioca pearls",
    label: "02 / THE BOBA ESSENTIALS",
  },
  {
    category: "Powders",
    photo: "matcha-ritual",
    title: "A new daily ritual.",
    text: "Matcha, taro and creamer. Made for creative menus.",
    alt: "Copper scoop of matcha beside an iced matcha latte",
    label: "03 / THE CAFÉ COLLECTION",
  },
] as const;
export function BeverageStory({
  onSelect,
}: {
  onSelect: (category: Category) => void;
}) {
  return (
    <section
      className="beverage-story"
      aria-label="Explore beverage ingredient collections"
    >
      <div className="story-top">
        <div>
          <span className="eyebrow">THE INGREDIENTS. THE POSSIBILITIES.</span>
          <h2>
            A taste of <em>what’s next.</em>
          </h2>
        </div>
        <div>
          <p>Explore the ingredients behind your next signature drink.</p>
          <span className="swipe-hint" aria-hidden="true">
            Swipe to discover the collections →
          </span>
        </div>
      </div>
      <div className="story-grid">
        {collections.map((c) => (
          <a
            key={c.category}
            className="story-tile"
            href="#collection"
            onClick={() => onSelect(c.category)}
          >
            <ServingImage
              name={c.photo}
              alt={c.alt}
              width="600"
              height="750"
              loading="lazy"
            />
            <div className="story-tile-copy">
              <span>{c.label}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <b>
                Discover collection <span>↗</span>
              </b>
            </div>
          </a>
        ))}
      </div>
      <p className="serving-disclaimer">
        Serving inspiration · Explore individual ingredients and pack
        specifications below.
      </p>
    </section>
  );
}
