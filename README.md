# Syncytium Health

Company site and direct-to-consumer store for Syncytium Health, a pharmaceutical and nutraceutical company. It has company pages (home, about, product catalogue, contact, help and legal pages), a store for the **own-brand supplements** (a small range of about 5–10 products), customer accounts, checkout (Razorpay or cash on delivery) and an admin panel.

The UI follows the **Design rules in `CLAUDE.md`**: one deep-violet brand colour sampled from the logo, neutral surfaces, Newsreader headings with Geist text, no gradients, glass or decorative motion. The redesign is being done step by step from `changeui.md` (see [UI redesign status](#ui-redesign-status)).

- **Catalogue:** 6 real products in 4 collections, with photos (`src/db/seed/`, photos in `src/db/seed/photos/`). **MRP, prices and stock are placeholders**, and so is LYCOTIUM's pack count. Set the real values in the admin panel. Calcitium-D3 is marked "Prescription required", so customers upload a prescription at checkout.
- **Images:** each product can have up to 8 photos, uploaded in the admin panel. Products without photos show a drawn placeholder (see [Images](#images)).
- **Company facts** (legal name, address, phone, email, licences, team) live in `src/content/site.ts`. Unknown facts are `null` and the site shows nothing for them; never fill them with made-up values.
- **Payments:** run in **Razorpay test mode**.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui primitives (`src/components/ui`). Design tokens (colours, radius, shadows, type scale) live in `src/app/globals.css`. Fonts via `next/font`: Newsreader (marketing headings), Geist (text), Geist Mono (formulas, CAS numbers, IDs) |
| Motion | `motion` (Magic UI Blur Fade as the one section entrance, via `components/site/Reveal.tsx`); honours `prefers-reduced-motion` |
| Database | Postgres (Neon) via **Drizzle ORM**; migrations in `drizzle/` |
| Auth | **Better Auth**: email + password, admin plugin (roles, bans) |
| Payments | Razorpay (Checkout.js + server-side order creation and signature verification) |
| Shipping | Shiprocket (REST API: shipments, courier/AWB, pickup, labels, tracking webhook, pincode serviceability) |
| Validation | zod |
| Client state | zustand (cart and delivery pincode only, kept in localStorage) |

> **Next.js 16 note:** some APIs differ from older versions. For example, `params` and `searchParams` are Promises, and `middleware` is now `proxy`. Version-matched docs are bundled in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Getting started

Requirements: **Node 20.9+** and a Postgres database (a free [Neon](https://neon.tech) project works).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run db:migrate           # create the tables
npm run db:seed              # load the collections, products and photos
npm run dev                  # http://localhost:3000
```

**Create an admin:** sign up on the site, then run the command below and open `/admin`.

```bash
npm run make-admin -- you@example.com
```

### Environment variables (`.env.local`)

| Variable | Required | What it is |
|---|---|---|
| `DATABASE_URL` | yes | Direct Postgres connection string. Used by migrations and scripts. |
| `DATABASE_URL_POOLED` | no | Pooled connection (Neon `-pooler` host). Used by the app at runtime if set. |
| `BETTER_AUTH_SECRET` | yes | Random secret (`openssl rand -base64 32`). Changing it signs everyone out. |
| `BETTER_AUTH_URL` | yes | Public base URL, e.g. `http://localhost:3000` or `https://your-domain`. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | yes | Razorpay API keys (`rzp_test_…` for test mode). |
| `RAZORPAY_WEBHOOK_SECRET` | no | Only needed for `/api/payments/webhook`. |
| `SHIPROCKET_API_EMAIL` / `SHIPROCKET_API_PASSWORD` | yes (to ship) | Shiprocket **API user** (Settings → API → Configure), not your main login. |
| `SHIPROCKET_PICKUP_LOCATION` | no | Pickup address nickname in Shiprocket. Defaults to `Primary`. |
| `SHIPROCKET_WEBHOOK_TOKEN` | no | Only needed for `/api/shipping/webhook`. |
| `NEXT_PUBLIC_SITE_URL` | no | Public origin used for canonical URLs, share tags, sitemap and JSON-LD. Defaults to `https://www.syncytiumhealth.com`. |

Secrets are never committed: `.env.local` is git-ignored, and only `.env.example` is tracked.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev server / production build / production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Create a SQL migration from changes in `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to `DATABASE_URL` |
| `npm run db:seed` | Insert or refresh the catalogue from `src/db/seed/`. **Resets the seeded products' details, prices and stock** to the seed values, so after the first run, edit products in the admin panel instead. Photos are only added to products that have none. Also removes the older demo data (deactivating anything that's in past orders). Never touches products or collections created in the admin panel. |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run auth:generate` | Regenerate `src/db/auth-schema.ts` after changing Better Auth plugins |
| `npm run make-admin -- <email>` | Give an existing user the admin role |

## Project structure

```
src/
  app/
    (site)/              Every public page; shares one header and footer (layout.tsx)
      page.tsx           Home: hero, What we make, Shop direct, composition explorer, contact band
      about/             About the company
      products/          Product catalogue (catalog_items table), details open in a dialog (?item=<id>)
      team/              Team page (404 until content/site.ts says a real team exists)
      contact/           Contact form (react-hook-form + zod; ?product=NAME prefills the message)
      faq/, shipping-returns/, privacy/, terms/   Help and legal pages (legal text is a draft)
      store/             Store home: hero, product tabs, collections, spotlight, FAQ
      shop/              All store products (collection tabs, sort)
      collections/[slug] One collection (the `categories` table)
      search/            Search results
      product/[slug]     Store product detail, accordions, related
      cart/, checkout/   Cart (guest) and checkout (login required)
      order-success/[id] Order confirmation
      account/           My orders, saved addresses
      login/, signup/, forgot-password/, reset-password/
    admin/               Admin panel (layout checks the admin role)
      actions.ts         All admin mutations (server actions)
    mr/                  MR visual-aid folders (tablet viewer, not indexed)
    actions/             Customer server actions (addresses, COD orders, cart products)
    portfolio/actions.ts Contact form server action (emails the inquiry)
    api/
      auth/[...all]      Better Auth handler
      payments/          create-order, verify, webhook (Razorpay)
      shipping/          serviceability (pincode check), webhook (Shiprocket tracking)
      prescriptions/     Upload (POST) and download (GET, owner or admin only)
      admin/product-images  Product photo upload (POST, admin only)
      product-images/[id]   Serves an uploaded product photo (public, cached)
      search/suggest     Search suggestions for the /search page
    robots.ts, sitemap.ts  robots.txt and sitemap.xml (public routes, collections, products)
    icon.png, apple-icon.png, favicon.ico   App icons (cropped logo mark)
  components/
    site/                Shared building blocks: ProductCard (the one card for store and catalogue products), Container, Section, SectionHeading, Logo, Price, Chip, ProsePage, JsonLd, Reveal
    ui/                  shadcn/ui primitives (button, dialog, sheet, command, tabs, table, field…) + restyled Magic UI (Blur Fade, Text Animate, Number Ticker, Dot Pattern, Bento Grid) and Aceternity UI (Resizable Navbar, Stateful Button, Tooltip Card)
    layout/              Header (nav, Shop menu, ⌘K search, account, cart, mobile sheet) and Footer
    portfolio/           Company page sections (hero, range, shop direct, composition explorer, contact form) and pages
    home/, product/, listing/, checkout/, orders/, admin/, auth/, rx/, mr/   Store and admin UI by area
  content/
    site.ts              Company facts (name, description, contact details, licences, hasTeam). Unknown = null
    product-copy.ts      Reviewed one-line product summaries shown instead of the raw pack copy
    landing.ts           Landing copy: the three hero headline options (heroHeadlineIndex picks one; ?headline=2 previews in dev)
  db/
    schema.ts            Store tables (products, categories, orders, …)
    auth-schema.ts       Better Auth tables (generated, don't edit)
    seed/                Collections, products and product photos used by db:seed
  lib/
    catalog.ts           All catalogue queries (search, sort, best sellers, new arrivals, related)
    catalog-items.ts     Company product catalogue queries (catalog_items)
    seo.ts               Page metadata helper (canonical, Open Graph, Twitter) and JSON-LD builders
    pricing.ts           Pure bill/coupon/delivery calculations (shared by browser and server)
    checkout.server.ts   Server-side cart pricing and stock checks
    orders.server.ts     Order creation, payment confirmation, order reads
    shiprocket.server.ts Shiprocket API client (token cache, orders, AWB, pickup, label, tracking)
    shipments.server.ts  Order shipping flow and courier-status → order-status mapping
    admin.server.ts      Admin dashboard and list queries
    auth.ts, session.ts  Better Auth config and session helpers (requireUser, requireAdmin)
  data/
    types.ts             Shared TypeScript types
    home.ts              Store hero slides, collection art, promises, FAQs, discount codes (in code)
  config/site.ts         Store settings: delivery fee, free-delivery threshold, parcel size, server email fallback
public/brand/            logo.png (horizontal lockup), logo-stacked.png, mark.png, share.png (default share image)
public/portfolio/assets/ Product pack photographs used on company and store pages
public/images/placeholders/  Placeholder collection artwork (SVG)
scripts/                 seed, make-admin, auth schema config
drizzle/                 Generated SQL migrations (commit these)
```

## How it works

- **Money** is stored in the database as integer **paise**. `lib/catalog.ts` converts it to rupees for the UI.
- **Prices are never trusted from the browser.** The browser sends only product ids and quantities, and `priceCart()` (`lib/checkout.server.ts`) recomputes the bill from the database, including coupons and the delivery fee.
- **Order lifecycle** (`lib/orders.server.ts`):
  - **Cash on delivery:** the order is inserted and stock is deducted in one transaction. It fails if stock is short.
  - **Online:**
    1. `create-order` prices the cart and creates a Razorpay order, then stores our order as `payment_status = pending`.
    2. After payment, `verify` checks Razorpay's signature and calls `markOrderPaid()`, which sets `paid` and deducts stock.
    3. `markOrderPaid()` is **idempotent**. The webhook calls it too, as a backup for customers who close the tab.
  - **Hidden orders:** unpaid online orders are hidden from customers but visible to admins.
- **Product photos** (`product_images` table, up to 8 per product, in display order; the first is the main photo):
  - In the admin product form, **Photos** accepts JPG, PNG or WEBP files (pick or drag-and-drop) and https:// image URLs. Drag a photo, or use its arrows or **Main** button, to reorder. Changes apply when you click **Save**.
  - Photos over 1 MB are downscaled in the browser (longest edge 2000 px) before upload. Each upload is one request of at most 3 MB, which keeps it under Vercel's 4.5 MB request limit. The server checks the real file signature.
  - An upload is stored in Postgres (`bytea`) with no product (staged) and is attached when the product is saved. Staged photos that are never saved are deleted after a day. Removing a photo and saving deletes it.
  - Photos are served by `/api/product-images/[id]` with a one-year immutable cache header. A replaced photo gets a new id, so caches never show stale images.
  - The product page shows a gallery (thumbnails, arrows, swipe). Product cards fade to the second photo on hover.
- **Collections:** the store only shows collections that have at least one visible product, so a new collection appears once you add a product to it.
- **Product cards:** one card (`components/site/ProductCard.tsx`) for store products and catalogue items. Prescription and catalogue-only products show "Prescription required" and no price or Add button on cards; the store product page still sells them with a prescription upload.
- **Badges:** MRP is shown struck through when it is higher than the price. The "Sale" badge additionally needs `onSale` on the product, which is `false` for every product until a database column is added (`toProduct()` in `lib/catalog.ts`). "Best seller" marks the top 3 products by review count. Star ratings only show when a product has real ratings.
- **Discount codes:** stored in `src/data/home.ts` (`coupons`) and entered at the cart's "Have a discount code?". They aren't advertised on the site.
- **Prescriptions (dormant):** kept from the original pharmacy build in case prescription products are ever added (tick "Prescription required" on a product).
  - With no Rx products, the checkout Rx step never appears, and the admin "Prescriptions" page shows only when something is pending.
  - Uploads are validated by their real file signature (JPG, PNG, WEBP or PDF, up to 2 MB) and stored in Postgres (`bytea`).
  - Files are served only to their owner or an admin, through `/api/prescriptions/[id]`.
- **Admin rules** (enforced on the server in `app/admin/actions.ts`):
  - Rx orders can't be packed, shipped or delivered until the prescription is approved. Rejecting a prescription cancels the order.
  - Cancelling returns stock. Delivered and cancelled orders are final. Paid orders must be refunded manually in the Razorpay dashboard.
  - Deleting a product that appears in past orders **deactivates** it (hidden from the store) instead of deleting it.
  - A collection that still has products can't be deleted.
  - Admins can't ban themselves or other admins. Banning signs the customer out everywhere.
- **Security:**
  - Every admin page is checked by `requireAdmin()` in `app/admin/layout.tsx`, and every admin action re-checks the role, because server actions are public HTTP endpoints. Non-admins get a 404.
  - Customer data is always filtered by the signed-in user's id.
- **Rendering:** pages are rendered on each request (`dynamic = "force-dynamic"` in the root layout), so price, stock and admin changes show immediately.
- **Site search:** the header search (click the icon or press Ctrl/⌘ K) matches store products and catalogue items by name or ingredient. Store results open the product page; catalogue results open `/products?item=<id>`. "Search the store" goes to `/search`.
- **SEO:** every public page sets its own title, description, canonical URL and share tags through `pageMetadata()` in `lib/seo.ts` (title template `%s | Syncytium Health`, origin from `NEXT_PUBLIC_SITE_URL` or `https://www.syncytiumhealth.com`). JSON-LD: Organization on the home page (only known fields), Product + Offer and BreadcrumbList on product pages, BreadcrumbList on collections. No ratings are emitted.
- **Old URLs:** `/portfolio`, `/portfolio/about`, `/portfolio/catalog` and `/portfolio/team` redirect permanently to `/`, `/about`, `/products` and `/team` (`next.config.ts`).

## Images

- **Product images:** add photos in the admin product form under **Photos** (see [How it works](#how-it-works)). Square photos on a plain light background look best. A product with no photos shows a drawn placeholder from `src/components/product/ProductImage.tsx`, based on its "Pack type".
- **Company pages and store hero:** real pack photographs from `public/portfolio/assets/`, referenced in the section components and in `src/data/home.ts` (`heroSlides`). No 3D models, stock portraits or placeholder avatars.
- **Catalogue items:** each item's `imageUrl` is set in the admin catalogue form.
- **Logo:** `public/brand/logo.png` is a horizontal lockup cropped from the original artwork; use the `Logo` component (`components/site/Logo.tsx`), which renders it 28px tall in the header and 32px in the footer. The source artwork is small; replace it with an SVG and add a white version when the owner supplies them.

## Changing the database

All schema changes go through code, so every developer and environment can reproduce them:

1. Edit `src/db/schema.ts`.
2. Run `npm run db:generate` and review the new SQL file in `drizzle/`.
3. Run `npm run db:migrate`.
4. Commit both the schema change and the migration files.

Don't change tables by hand in the Neon console, or the migrations will drift. To experiment safely, create a Neon **branch** (an instant copy of the database) and point your `.env.local` at it.

For Better Auth tables, change the plugins in both `src/lib/auth.ts` and `scripts/auth-schema.config.ts` (via `src/lib/auth-plugins.ts`). Then run `npm run auth:generate`, followed by the steps above.

## UI redesign status

The redesign follows `changeui.md`, one problem at a time, with the rules in `CLAUDE.md`. In scope: Parts 1–3 (foundation, landing page, company pages). Done: Prompt 00 and Problems 01–15. Part 1 (design tokens and fonts, decoration removed, invented content removed, one header and footer, help and legal pages, logo, 3D and motion removed, accessibility, metadata) and Part 2, the landing page (hero with data-counted facts, What we make grid, Shop direct, one shared product card, composition explorer, contact page). Next: Part 3, Problems 16–19 (About, Team, catalogue list and product pages). Backend code (database, API routes, server actions, emails) is not part of the redesign.

## Razorpay (test mode)

- **Test payments:** UPI `success@razorpay` or `failure@razorpay`, or any test card from Razorpay's docs (any future expiry and CVV). Netbanking has a Success/Failure choice.
- **Where to check:** test payments appear under Dashboard → Transactions with Test Mode on. Orders carry the notes `app: syncytium-health` and `orderId`.
- **Webhook (optional locally, recommended in production):**
  - URL: `https://<domain>/api/payments/webhook`.
  - Events: `payment.captured`, `payment.failed`, `order.paid`.
  - Put the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
  - For local testing, expose port 3000 with a tunnel such as ngrok.

## Shiprocket (shipping)

- **Setup:**
  1. In Shiprocket, go to Settings → API → Configure and create an API user. Use a different email from your main login. Put its email and password in `SHIPROCKET_API_EMAIL` / `SHIPROCKET_API_PASSWORD`.
  2. Under Settings → Pickup Addresses, add your warehouse address and verify its phone number. Put its nickname in `SHIPROCKET_PICKUP_LOCATION`.
  3. Recharge the Shiprocket wallet. Courier charges are deducted from it when an AWB is assigned.
  4. Optional: set courier priority (Settings → Courier Priority). "Ship with Shiprocket" uses Shiprocket's recommended courier.
- **Shipping an order** (admin → order page → "Shipping (Shiprocket)" card):
  1. Check the package weight and size, then click **Ship with Shiprocket**. This creates the Shiprocket order (our order id is the channel order id), assigns a courier (AWB) and schedules pickup. The order moves to **Packed**.
  2. Each step is saved as soon as it succeeds. If one fails (e.g. low wallet balance), fix the cause and click **Retry**.
  3. Use **Generate label** / **Print label** to get the shipping label PDF.
  - The same rules as manual status changes apply: online orders must be paid, and Rx orders need an approved prescription.
- **Tracking:**
  - The webhook moves the order to **Shipped** (picked up, in transit, out for delivery) and **Delivered**. It never moves an order backwards, and RTO/undelivered statuses are only recorded, not acted on.
  - Customers see the courier, AWB and a "Track package" link on their order page.
  - Without the webhook, use **Refresh** on the admin order page.
- **Webhook:**
  - URL: `https://<domain>/api/shipping/webhook`. Shiprocket rejects URLs containing "shiprocket", "kartrocket", "sr" or "kr".
  - Set it under Settings → API → Webhooks, with a token you choose, and put the same token in `SHIPROCKET_WEBHOOK_TOKEN`.
- **Cancelling:** cancelling an order in the admin panel also cancels its Shiprocket order. If that fails, the message says so and you must cancel it in Shiprocket.
- **Pincode check:** the product page's "Check delivery" uses live courier serviceability and ETD from the pickup pincode. If Shiprocket is unreachable, it shows a generic message.
- **Default package size:** set in `src/config/site.ts` (`parcel`).

## Deploying (e.g. Vercel)

1. Set all the environment variables above on the host. `BETTER_AUTH_URL` must be the real `https://` domain.
2. Run `npm run db:migrate` against the production database and `npm run db:seed` once to load the catalogue.
3. Register the Razorpay webhook and the Shiprocket webhook.
4. Before accepting real payments, complete Razorpay KYC and switch to live keys.

## Known limitations and next steps

- **No email provider yet.** Password-reset links are printed to the server log (`[auth] Password reset link …`). Add one (e.g. Resend) in `sendResetPassword` in `src/lib/auth.ts`, and consider enabling email verification.
- **Store home content** (hero slides, promises, FAQs) and **discount codes** are in `src/data/home.ts` (no admin UI). There are no customer reviews, and the "Why Syncytium" claims are empty until they can be verified, so those blocks don't render.
- **Missing company facts:** search the code for `TODO(owner)` to see everything the owner still has to supply (address, phone, email, licences, team, About story, legal details, product data corrections).
- **Catalogue data:** some catalogue items still spell the brand "SYNCTIUM" in the database (corrected on display by `displayBrand()`), and a few compositions need checking by the owner.
- **Product photos** live in Postgres, which is fine for a small catalogue because responses are cached. With many products or very large photos, move them to object storage (e.g. S3, Vercel Blob or Supabase Storage); only `/api/admin/product-images` and `/api/product-images/[id]` would change.
- **Prescription files** live in Postgres. Move them to object storage if volume grows.
- **Rate limiting:** Better Auth's default limiter (about 3 sign-in attempts per 10 seconds per IP) keeps its counters in memory. On multi-instance or serverless hosting, configure database or Redis storage for it.
- **No caching:** pages render per request. If traffic grows, add caching for catalogue reads and revalidate on admin changes.
- **Policy pages** (`/privacy`, `/terms`, `/shipping-returns`) are drafts marked "Draft for legal review" and need legal sign-off.
- **Server email fallback:** `site.supportEmail` in `src/config/site.ts` is a placeholder; set `EMAIL_ADMIN` or replace it with the real inbox.
- **No automated tests in the repo yet.** The flows were verified with ad-hoc browser tests. Adding Playwright tests for checkout, payments and admin rules is a good next step.
