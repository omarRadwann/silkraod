# Silk Road

Next.js App Router storefront for wholesale BODUO ingredients and Asia-to-Egypt sourcing. Static export: no backend, accounts or payment processing. Orders are quotation enquiries sent to WhatsApp +20 100 422 7074.

## Develop

Node.js 22+.

```sh
npm ci
npm run dev
```

## Verify and build

```sh
npm run typecheck
npm run build
```

Deploy the generated `out/` directory to any static host. Product data lives in `lib/catalog.ts`; product imagery and the original downloadable PDF live in `public/`. Catalog prices are on request. No unverified pricing or stock claims are shown.

## GitHub Pages

Create `omarradwann/silkraod`, push the main branch, and select **GitHub Actions** in Settings → Pages. The supplied workflow builds with `/silkraod` as its base path and deploys the static export.

For a custom domain later, remove `NEXT_PUBLIC_BASE_PATH: /silkraod` from the workflow, change `NEXT_PUBLIC_SITE_URL` to the new domain, set the custom domain in Pages, and configure DNS. Sitemap and robots URLs follow `NEXT_PUBLIC_SITE_URL` automatically. No canonical domain is guessed in this build.

## Features

- English-only storefront with readable product specifications and carton ordering
- Official Silk Road logo, ivory/charcoal/gold palette and clean white product studios
- Twelve products, category filters and name / SKU search
- Floating enquiry review, ordering FAQ and related ingredient discovery
- Carton quantities with a persistent local browser order
- WhatsApp quotation handoff; availability and delivery confirmed in conversation
- Original catalog download and direct sourcing enquiry
- Lazy loaded geographic Three.js globe with a directional Asia-to-Egypt animation, WebGL fallback and reduced motion support
- Static rendered content, metadata and Open Graph information
- Twelve individual product pages with structured product data
- Sitemap and robots.txt generated from the deployment URL
- Responsive design, keyboard focus, modal focus management and live cart feedback

The product images and official logo use the original embedded artwork and transparency masks from the supplied catalog. Source images are encoded as WebP for delivery; labels and packaging are preserved. Google Fonts loads Inter with system fallbacks. The globe uses Natural Earth public-domain land geometry through world-atlas; its connection is an illustration, not a promised shipping itinerary. The [port photograph](https://images.unsplash.com/photo-1494412519320-aa613dfb7738) is stock imagery from Unsplash and does not depict a claimed Silk Road facility. The site does not claim certification, exclusive distribution or delivery guarantees. Instagram is omitted until a verified account is supplied.

The 2026 Asia menu is available as `public/silk-road-asia-collection-2026.pdf`. All twelve package images and the tiger-boba / powder serving visuals are extracted directly from that menu, with optimized WebP delivery. The logo retains the embedded original artwork and alpha mask. An animated SVG world-map preview is rendered in the initial HTML, with an optional Three.js enhancement; land coordinates ship in the deferred chunk without a separate fetch. Product hover and keyboard-focus treatments use flavor-colored pearls, scoops and dust, or a syrup ribbon; reduced motion is respected.

`public/beverage-editorial.webp` is an AI-generated serving illustration (built-in image generation). Prompt: Premium beverage editorial photograph, warm ivory studio, tiger brown-sugar milk tea with tapioca, iced matcha latte, strawberry fruit tea with popping boba, mango and strawberry, matcha in a black scoop; no people, logos, labels or text. Actual package artwork is not generated.
