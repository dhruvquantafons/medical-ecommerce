# Syncytium Health

Online pharmacy storefront, similar to PharmEasy, Netmeds and Truemeds, with customer accounts, checkout (Razorpay or cash on delivery), prescription uploads and an admin panel.

The product catalogue is **demo data** (`src/db/seed/`). Payments run in **Razorpay test mode**.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4 (theme tokens in `src/app/globals.css`) |
| Database | Postgres (Neon) via **Drizzle ORM**; migrations in `drizzle/` |
| Auth | **Better Auth**: email + password, admin plugin (roles, bans) |
| Payments | Razorpay (Checkout.js + server-side order creation and signature verification) |
| Validation | zod |
| Client state | zustand (cart and delivery pincode only, kept in localStorage) |

> **Next.js 16 note:** some APIs differ from older versions. For example, `params` and `searchParams` are Promises, and `middleware` is now `proxy`. Version-matched docs are bundled in `node_modules/next/dist/docs/` (see `AGENTS.md`).

## Getting started

Requirements: **Node 20.9+** and a Postgres database (a free [Neon](https://neon.tech) project works).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run db:migrate           # create the tables
npm run db:seed              # load demo categories and products
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

Secrets are never committed: `.env.local` is git-ignored, and only `.env.example` is tracked.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev server / production build / production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Create a SQL migration from changes in `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to `DATABASE_URL` |
| `npm run db:seed` | Insert or refresh the demo catalogue. **Resets demo products' stock and prices** to seed values. |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run auth:generate` | Regenerate `src/db/auth-schema.ts` after changing Better Auth plugins |
| `npm run make-admin -- <email>` | Give an existing user the admin role |

## Project structure

```
src/
  app/
    (store)/             Customer-facing pages (share the header/footer layout)
      page.tsx           Home
      category/[slug]    Category listing (filters and sort are in the URL)
      search/            Search and "shop by health concern"
      product/[slug]     Product detail, substitutes, related
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
      prescriptions/     Upload (POST) and download (GET, owner or admin only)
      search/suggest     Header search suggestions
  components/            UI by area: layout, product, listing, checkout, orders, admin, auth, rx, ui
  db/
    schema.ts            Store tables (products, categories, orders, …)
    auth-schema.ts       Better Auth tables (generated, don't edit)
    seed/                Demo categories and products used by db:seed
  lib/
    catalog.ts           All catalogue queries (search, filters, substitutes, …)
    pricing.ts           Pure bill/coupon/delivery calculations (shared by browser and server)
    checkout.server.ts   Server-side cart pricing and stock checks
    orders.server.ts     Order creation, payment confirmation, order reads
    admin.server.ts      Admin dashboard and list queries
    auth.ts, session.ts  Better Auth config and session helpers (requireUser, requireAdmin)
  data/
    types.ts             Shared TypeScript types
    home.ts              Banners, coupons, FAQs, concerns (still in code)
  config/site.ts         Brand name, support contacts, delivery fee settings
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
- **Prescriptions:**
  - **Upload:** validated by their real file signature (JPG, PNG, WEBP or PDF, up to 2 MB) and stored in Postgres (`bytea`).
  - **Download:** only the owner or an admin can open them, through `/api/prescriptions/[id]`.
  - **Checkout:** carts with Rx items require one.
- **Admin rules** (enforced on the server in `app/admin/actions.ts`):
  - Rx orders can't be packed, shipped or delivered until the prescription is approved. Rejecting a prescription cancels the order.
  - Cancelling returns stock. Delivered and cancelled orders are final. Paid orders must be refunded manually in the Razorpay dashboard.
  - Deleting a product that appears in past orders **deactivates** it (hidden from the store) instead of deleting it.
  - A category that still has products can't be deleted.
  - Admins can't ban themselves or other admins. Banning signs the customer out everywhere.
- **Security:**
  - Every admin page is checked by `requireAdmin()` in `app/admin/layout.tsx`, and every admin action re-checks the role, because server actions are public HTTP endpoints. Non-admins get a 404.
  - Customer data is always filtered by the signed-in user's id.
- **Rendering:** pages are rendered on each request (`dynamic = "force-dynamic"` in the root layout), so price, stock and admin changes show immediately.

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

## Deploying (e.g. Vercel)

1. Set all the environment variables above on the host. `BETTER_AUTH_URL` must be the real `https://` domain.
2. Run `npm run db:migrate` against the production database (and `db:seed` only if you want the demo catalogue).
3. Register the Razorpay webhook.
4. Before accepting real payments, complete Razorpay KYC and switch to live keys.

## Known limitations and next steps

- **No email provider yet.** Password-reset links are printed to the server log (`[auth] Password reset link …`). Add one (e.g. Resend) in `sendResetPassword` in `src/lib/auth.ts`, and consider enabling email verification.
- **Coupons, banners and FAQs** are still in `src/data/home.ts` (no admin UI).
- **Product images:** set as an image URL in the admin panel, with a drawn placeholder by default. Direct image upload would need object storage (e.g. S3, Vercel Blob or Supabase Storage).
- **Prescription files** live in Postgres. Move them to object storage if volume grows.
- **Rate limiting:** Better Auth's default limiter (about 3 sign-in attempts per 10 seconds per IP) keeps its counters in memory. On multi-instance or serverless hosting, configure database or Redis storage for it.
- **No caching:** pages render per request. If traffic grows, add caching for catalogue reads and revalidate on admin changes.
- **Policy pages** (terms, privacy, refunds, shipping) are placeholders in the footer.
- **No automated tests in the repo yet.** The flows were verified with ad-hoc browser tests. Adding Playwright tests for checkout, payments and admin rules is a good next step.
