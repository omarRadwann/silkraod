# Silkraod

Next.js App Router storefront for wholesale BODUO ingredients and Asia–Egypt sourcing. Static export: no backend, accounts or payment processing. Orders are quotation enquiries sent to WhatsApp +20 100 422 7074.

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
- Twelve products, category filters and name / SKU search
- Carton quantities with a persistent local browser order
- WhatsApp quotation handoff; availability and delivery confirmed in conversation
- Original catalog download and direct sourcing enquiry
- Lazy loaded geographic Three.js globe with an animated China–Egypt connection, WebGL fallback and reduced motion support
- Static rendered content, metadata and Open Graph information
- Twelve individual product pages with structured product data
- Sitemap and robots.txt generated from the deployment URL
- Responsive design, keyboard focus, modal focus management and live cart feedback

The ingredient photos are extracted from the supplied catalog. Google Fonts loads Inter and Instrument Serif with system fallbacks. The globe uses Natural Earth public-domain land geometry through world-atlas; its connection is an illustration, not a promised shipping itinerary. The [port photograph](https://images.unsplash.com/photo-1494412519320-aa613dfb7738) is stock imagery from Unsplash and does not depict a claimed Silkraod facility. The site does not claim certification, exclusive distribution or delivery guarantees. Instagram is omitted until a verified account is supplied.
