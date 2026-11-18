# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The two audiences carry equal weight. Each has its own surface.

- **Consumers in India** buy Syncytium Health's own-brand supplements, and some medicines, through the store (`src/app/(store)`). They browse, check what a product contains, and check out with Razorpay or cash on delivery. Prescription items ask them to upload a prescription at checkout.
- **Partners** (pharmacies, doctors, distributors) evaluate the company and its range on the company pages (`src/app/(portfolio)`: Home, About, Catalog, Salt Inspector, Team) and get in touch through the partner and enquiry form on Home.
- **Medicine Folders** (`/mr`) are product material for medical representatives visiting doctors. Doctors can browse them directly, and staff use them internally.
- **Staff and admins** run products, the catalog, orders, prescriptions, customers, employees and the MR folders in `/admin`.

## Product Purpose

Syncytium Health is a pharmaceutical and nutraceutical company that makes its own formulations, from prescription medicines to daily supplements. It sells part of the range direct across India. The site sells the consumer range, presents the full formulary to partners, and gives reps and staff the tools they work with.

## Positioning

The company makes its own formulations and publishes exactly what is in them. Every salt, its amount and its CAS number are shown openly (Salt Inspector, composition tables), so anyone can inspect a formulation before they buy or prescribe it.

## Operating Context

- Indian market: prices in INR, pincode-based delivery checks, Shiprocket shipping, Razorpay (currently in test mode) or cash on delivery.
- Partners judge the range by its composition and category (Prescription or Over the counter) before they make contact.
- Reps open the Medicine Folders during visits to doctors.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router), React 19, Tailwind 4, Drizzle on Neon Postgres, Better Auth, Razorpay, Shiprocket. The project will be handed to another developer, so everything must be reproducible from the repo.
- Two data sources: store `products` (about 6 own-brand products) and the larger `catalog_items` formulary shown on the company pages.
- Known data issues that are worked around in the frontend and must not be "fixed" in the UI by inventing data:
  - The "SYNCTIUM" misspelling in `catalog_items.brand` is hidden on display by `displayBrand()`.
  - `priceEstimate` holds placeholders and is not shown.
  - Some catalog descriptions don't match their salts, so card descriptions are hidden.
- Store MRP, prices, stock and LYCOTIUM's pack count are placeholders until the owner sets them in admin.
- Open owner items: business address, phone and contact email; Privacy and Terms pages.

## Brand Commitments

- Name: **Syncytium Health**. "Catalog" is spelled the American way throughout.
- Voice: plain and factual, with standard label advice ("Read the label before use, and ask your doctor or pharmacist…"). Wording is centralised in `src/components/portfolio/copy.ts`.
- The logo and product photography are in the repo (`public/`, `src/db/seed/photos/`).

## Evidence on Hand

- Real product photos and real formulations (salts, amounts, CAS numbers) in the database and seed data.
- No verified statistics, customer counts, partner names, testimonials or certifications. Earlier fake stats and partner claims were removed. Do not add any without a source.
- Team profiles are placeholders. The owner chose to keep them visible.

## Product Principles

1. **Show the formulation.** Composition is the proof. Lead with what is actually in the product rather than claims about it.
2. **Never invent facts.** Unknown company or product facts become `TODO(owner)` markers, not plausible copy.
3. **Two audiences, one truth.** Consumers and partners see the same data, framed for their task.
4. **Handover-safe.** Every change stays reproducible and documented in the repo.

## Accessibility & Inclusion

No product-specific requirement has been set yet. The audience includes older consumers reading dosage and composition details, so readable amounts and labels matter.
