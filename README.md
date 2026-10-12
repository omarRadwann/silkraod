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
npm test
npm run typecheck
npm run build
```

Deploy the generated `out/` directory to any static host. Product data lives in `lib/catalog.ts`; product imagery and the original downloadable PDF live in `public/`. Catalog prices are on request. No unverified pricing or stock claims are shown.

## GitHub Pages

Push the main branch to `omarradwann/silkraod` and select **GitHub Actions** in Settings → Pages. The supplied workflow builds with `/silkraod` as its base path and deploys the static export.

For a custom domain later, remove `NEXT_PUBLIC_BASE_PATH: /silkraod` from the workflow, change `NEXT_PUBLIC_SITE_URL` to the new domain, set the custom domain in Pages, and configure DNS. Sitemap and robots URLs follow `NEXT_PUBLIC_SITE_URL` automatically. No canonical domain is guessed in this build.

## Features

- English-only storefront with readable product specifications and carton ordering
- Official Silk Road logo, official navy and copper palette, editorial beverage photography and clean product studios
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

The product images and official logo use the original embedded artwork and transparency masks from the supplied catalog. Source images are encoded as WebP for delivery; labels and packaging are preserved. Inter is self-hosted through next/font/local with a system fallback. The globe uses Natural Earth public-domain land geometry through world-atlas; its connection is an illustration, not a promised shipping itinerary. The [port photograph](https://images.unsplash.com/photo-1494412519320-aa613dfb7738) is stock imagery from Unsplash and does not depict a claimed Silk Road facility. The site does not claim certification, exclusive distribution or delivery guarantees. Instagram is omitted until a verified account is supplied.

The 2026 Asia menu is available as `public/silk-road-asia-collection-2026.pdf`. All twelve package images and the tiger-boba / powder serving visuals are extracted directly from that menu, with optimized WebP delivery. The logo retains the embedded original artwork and alpha mask. An animated SVG world-map preview is rendered in the initial HTML, with an optional Three.js enhancement; land coordinates ship in the deferred chunk without a separate fetch. Product hover and keyboard-focus treatments gently lift the original pack and reveal a photographic serving panel. Artificial pearls, powder streams and syrup drawings have been removed. Mobile shows the image panel without requiring hover; reduced motion is respected.

`public/beverage-editorial.webp` is an AI-generated serving illustration (built-in image generation). Prompt: Premium beverage editorial photograph, warm ivory studio, tiger brown-sugar milk tea with tapioca, iced matcha latte, strawberry fruit tea with popping boba, mango and strawberry, matcha in a black scoop; no people, logos, labels or text. Actual package artwork is not generated.

## Navy / copper visual revision

Five serving photographs were generated with the built-in image-generation tool (not the supplier packaging). Final assets live in `public/visuals/`: `tiger-ritual.webp`, `fruit-pearls.webp`, `matcha-ritual.webp`, `taro-ritual.webp`, `creamer-ritual.webp`. The fruit photograph illustrates the collection; it does not claim to depict every individual SKU. Serving photography is captioned separately from actual package artwork.

Prompt set: photorealistic luxury beverage and ingredient photography, vertical 4:5, midnight navy stone/tabletop, warm copper side lighting, real food textures, no text, labels, invented packaging, floating objects or CGI. Subjects: (1) iced brown sugar milk tea with translucent amber marbling and real tapioca pearls; (2) translucent mango and strawberry popping pearls in syrup in a navy bowl and copper spoon; (3) copper scoop of finely milled matcha with iced matcha latte; (4) copper scoop of pale lavender taro powder with taro latte; (5) copper scoop of ivory non-dairy creamer with milk tea. No falling powder or decorative particles. Photos were resized and WebP encoded for the site.

## Responsive architecture and performance

`app/page.tsx` renders marketing and service sections on the server through `HomeSections`. The client storefront coordinates a focused catalog, header and persistent wholesale-order hook. The order dialog loads on demand; pure cart validation and WhatsApp formatting live in `lib/order.ts` and have Node unit tests. Shared styles are in `app/globals.css`; the Signature Studio has its own component stylesheet.

The globe has an immediate animated SVG with an optional Three.js enhancement for visible desktop maps with fine pointers. Phones, reduced-motion preferences and slow connections keep the lightweight map. The 3D renderer caps pixel density and frame rate, suspends work offscreen or in background tabs, and disposes resources.

Product packages have native responsive WebP sources at 160, 320, 480 and original widths; serving photographs have 380, 640 and 1000px sources. Images retain their original proportions and transparency. Local fonts avoid an external font request. Hero photography is eager; collection imagery is lazy. The catalog PDF downloads only when requested.

Mobile includes swipeable collection photography and category filters, touch-friendly controls, safe-area spacing, a full-height enquiry dialog and readable search fields. Custom orders and sourcing beyond beverages have direct WhatsApp briefs for specifications, quantities, destination and timing.

Verified at 320, 390, 430, 768, 1024 and 1440px widths plus 844×390 landscape: no horizontal page overflow. Production build, TypeScript, order unit tests and all twelve product routes pass. Asset byte comparisons measure delivered files, not a real-device Core Web Vitals score.

## Signature Studio

The opening is an interactive ingredient study built in Three.js: choose Brown Sugar, Matcha or Taro, then separate the ice, poured drink and tapioca layers. `components/SignatureStudio.tsx` renders the complete editorial layout, controls and exact BODUO product links; `components/SignatureScene.tsx` owns the procedural glass, liquid shader, instanced pearls and condensation, lighting and resource lifecycle. Signature content and product references live in `lib/signatures.ts`; the isolated visual system is in `components/signature-studio.css`.

The scene is illustrative serving inspiration, not a recipe, nutrition claim or representation of a finished product for sale. Supplier packaging remains the original artwork. Existing AI serving photography supplies the initial view and the complete phone, reduced-motion, slow-connection and WebGL-failure experience. Flavor selection and product links work in these modes; the layer control appears only when the 3D view is ready.

Three.js loads only for a visible studio at 760px and above, with reduced motion disabled and without Save Data / slow 2G. Rendering is capped at 30fps and DPR 1.5, pauses offscreen and in background tabs, and stops when the user pauses motion once an interaction has settled. Resizing into the phone breakpoint removes the renderer. Geometries, materials, environment textures and the WebGL context are disposed on unmount. No external models or textures are fetched for the scene.

The Asia-to-Egypt globe now accompanies the custom-sourcing section and remains deferred until that section approaches the viewport. Product cards retain the shared pointer-tilt treatment and exact packaging. The enquiry cart, WhatsApp handoff and downloadable original PDF are unchanged.