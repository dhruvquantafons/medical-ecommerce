# Syncytium Health

Direct-to-consumer store for Syncytium Health's **own-brand supplements** (a small range of about 5–10 products), with customer accounts, checkout (Razorpay or cash on delivery) and an admin panel. The design is a clean pharmacy look: Nunito Sans type, a soft-violet palette built on `#8B5CF6`, `#7C6BF0` and `#EDE9FE`. Colours are tokens in `src/app/globals.css` (`brand-*`, `accent`), so a retheme starts there.

- **Catalogue:** 6 real products in 4 collections, with photos (`src/db/seed/`, photos in `src/db/seed/photos/`). **MRP, prices and stock are placeholders**, and so is LYCOTIUM's pack count. Set the real values in the admin panel. Calcitium-D3 is marked "Prescription required", so customers upload a prescription at checkout.
- **Images:** each product can have up to 8 photos, uploaded in the admin panel. Products without photos, and the hero images, show drawn placeholders (see [Images](#images)).
- **Payments:** run in **Razorpay test mode**.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4. Design tokens (colours, fonts) live in `src/app/globals.css`. Fonts: Instrument Serif (headings, `display` class) and Instrument Sans (text) via `next/font` |
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
    (store)/             Customer-facing pages (share the header/footer layout)
      page.tsx           Home: hero slider, product tabs, collections, spotlight, reviews, FAQ
      shop/              All products (collection tabs, sort)
      collections/[slug] One collection (the `categories` table)
      search/            Search results
      product/[slug]     Product detail, accordions, related
      cart/, checkout/   Cart (guest) and checkout (login required)
      order-success/[id] Order confirmation
      account/           My orders, saved addresses
      login/, signup/, forgot-password/, reset-password/
    admin/               Admin panel (layout checks the admin role)
      actions.ts         All admin mutations (server actions)
    actions/             Customer server actions (addresses, COD orders, cart products)
    api/
      auth/[...all]      Better Auth handler
      payments/          create-order, verify, webhook (Razorpay)
      shipping/          serviceability (pincode check), webhook (Shiprocket tracking)
      prescriptions/     Upload (POST) and download (GET, owner or admin only)
      admin/product-images  Product photo upload (POST, admin only)
      product-images/[id]   Serves an uploaded product photo (public, cached)
      search/suggest     Header search suggestions
  components/            UI by area: layout, home, product, listing, checkout, orders, admin, auth, rx, ui
  db/
    schema.ts            Store tables (products, categories, orders, …)
    auth-schema.ts       Better Auth tables (generated, don't edit)
    seed/                Collections, products and product photos used by db:seed
  lib/
    catalog.ts           All catalogue queries (search, sort, best sellers, new arrivals, related)
    pricing.ts           Pure bill/coupon/delivery calculations (shared by browser and server)
    checkout.server.ts   Server-side cart pricing and stock checks
    orders.server.ts     Order creation, payment confirmation, order reads
    shiprocket.server.ts Shiprocket API client (token cache, orders, AWB, pickup, label, tracking)
    shipments.server.ts  Order shipping flow and courier-status → order-status mapping
    admin.server.ts      Admin dashboard and list queries
    auth.ts, session.ts  Better Auth config and session helpers (requireUser, requireAdmin)
  data/
    types.ts             Shared TypeScript types
    home.ts              Hero slides, collection art, reviews, promises, FAQs, discount codes (in code)
  config/site.ts         Brand name and wordmark, tagline, support contacts, delivery fee settings
public/images/placeholders/  Placeholder hero and collection artwork (SVG)
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
- **Badges:** "Sale" appears when MRP is higher than the price. "Best seller" marks the top 3 products by review count.
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

## Images

All imagery is placeholder until real photography is ready:

- **Product images:** add photos in the admin product form under **Photos** (see [How it works](#how-it-works)). Square photos on a plain light background look best. A product with no photos shows a drawn placeholder from `src/components/product/ProductImage.tsx`: a branded jar, canister, dropper bottle, pouch or tube, based on its "Pack type".
- **Hero slides and collection cards:** SVG files in `public/images/placeholders/`, referenced from `src/data/home.ts` (`heroSlides[].image` and `collectionImages`). To replace them, put your photos in `public/images/` (e.g. `hero-gut.jpg`, ideally 2400×1350 for heroes and 1200×1500 for collections) and update the paths. They're rendered with `next/image`, so JPG/WebP photos are optimised automatically.

## Changing the database

All schema changes go through code, so every developer and environment can reproduce them:

1. Edit `src/db/schema.ts`.
2. Run `npm run db:generate` and review the new SQL file in `drizzle/`.
3. Run `npm run db:migrate`.
4. Commit both the schema change and the migration files.

Don't change tables by hand in the Neon console, or the migrations will drift. To experiment safely, create a Neon **branch** (an instant copy of the database) and point your `.env.local` at it.

For Better Auth tables, change the plugins in both `src/lib/auth.ts` and `scripts/auth-schema.config.ts` (via `src/lib/auth-plugins.ts`). Then run `npm run auth:generate`, followed by the steps above.

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
- **Home page content** (hero slides, reviews, promises, FAQs) and **discount codes** are in `src/data/home.ts` (no admin UI). **The reviews are samples:** replace them with real customer reviews before launch.
- **Product photos** live in Postgres, which is fine for a small catalogue because responses are cached. With many products or very large photos, move them to object storage (e.g. S3, Vercel Blob or Supabase Storage); only `/api/admin/product-images` and `/api/product-images/[id]` would change.
- **Prescription files** live in Postgres. Move them to object storage if volume grows.
- **Rate limiting:** Better Auth's default limiter (about 3 sign-in attempts per 10 seconds per IP) keeps its counters in memory. On multi-instance or serverless hosting, configure database or Redis storage for it.
- **No caching:** pages render per request. If traffic grows, add caching for catalogue reads and revalidate on admin changes.
- **Policy pages** (terms, privacy, refunds, shipping) are placeholders in the footer.
- **No automated tests in the repo yet.** The flows were verified with ad-hoc browser tests. Adding Playwright tests for checkout, payments and admin rules is a good next step.
