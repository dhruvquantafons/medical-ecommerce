# changeui.md — Syncytium Health UI audit and redesign prompts

Audit of https://www.syncytiumhealth.com/ carried out on 2026-11-16 against the live site: every reachable route was fetched, its HTML and CSS inspected, and screenshots taken at 1440px desktop and 390px mobile, including the modals and menus that open on click.

The source code was not available for this audit. Prompts therefore quote the exact strings, class names and inline styles seen in the rendered page so the implementing Claude can find the code with a search.

## How to use this file

1. Answer the questions in **Owner inputs** first. Several problems are about invented facts, and no prompt can supply the real ones.
2. Run **Prompt 00** once. It saves the design rules into the repo's `CLAUDE.md`, so every later session starts with them.
3. Run the remaining prompts in order, one prompt per Claude session and one commit each. Parts 1 and 2 matter most; the landing page cannot look professional until Part 1 is done.
4. Each block has the same shape: **Observed** (the problem, with evidence) followed by **Prompt** (paste as is).

## Routes audited

| Route | What it is | Status |
|---|---|---|
| `/` | Landing page | Audited |
| `/portfolio` | Byte-for-byte duplicate of `/` | Audited |
| `/portfolio/about` | About page | Audited |
| `/portfolio/team` | Team page | Audited |
| `/portfolio/catalog` | Medicine catalog and detail modal | Audited |
| `/store` | Store home | Audited |
| `/shop` | All products (`/collections` redirects here) | Audited |
| `/collections/[slug]` | gut-health, liver-care, bone-joint, heart-omega | Audited |
| `/product/[slug]` | Six product pages | Audited |
| `/cart` | Cart | Empty state only |
| `/search` | Search | Audited |
| `/login`, `/signup`, `/forgot-password` | Auth | Audited |
| `/account/orders`, `/account/addresses`, `/checkout` | Behind login | Not visible; covered by Prompt 30 |
| Any unknown URL | 404 page | Audited |

`/robots.txt`, `/sitemap.xml`, `/contact`, `/about`, `/privacy`, `/terms` and `/faq` all return 404.

## Why the site reads as AI-generated

1. **Two unrelated sites under one logo.** The company pages (`/`, `/portfolio/*`) use inline styles, Space Grotesk and Plus Jakarta Sans, a white header and a one-line footer. The store pages use Tailwind, Nunito Sans, a floating purple header and a full purple footer. Clicking "Get Started" changes the header, fonts, colours and footer all at once.
2. **Three different stories about the company.** The browser title says "Science-backed daily supplements". The meta description says "Order medicines, healthcare products and wellness essentials online". The hero says "Intelligent Digital Medicine Platform" that helps pharmacies "digitize medicine catalogs". The contact section sells a "3D digital showcase indexed on Google".
3. **The standard AI decoration kit, repeated on every section.** A sparkle-icon pill above every heading, a purple-to-pink gradient on the last words of every heading, gradient pill buttons with coloured glow shadows, emoji stars, and a floating 3D object beside the text.
4. **Invented proof.** "Trusted by 12,000+", three real pharmacy chains named as customers, a Boston headquarters, a 555 phone number, six team members whose photos come from a placeholder-avatar service, sample reviews for products the store does not sell.
5. **Buzzword copy.** "Empowering Healthcare Through Digital Precision", "Spectrometry-Verified Bio-Equivalence & Absorption", "Precision Formulations for Cardiovascular Resilience".
6. **No system underneath.** Three font families, about fourteen different corner radii, five purples plus pink and cyan, and 230 inline `style` attributes on the landing page alone.
7. **Developer features shown to visitors.** A "View Google JSON-LD" button prints raw JSON in the page, while the site ships no real structured data.
8. **Product data that contradicts itself.** Details are in Problem 18.

## Owner inputs needed before starting

These are facts about the business. Every prompt below tells Claude to leave a visible `TODO(owner)` marker rather than invent them.

| # | Question | Default the prompts assume |
|---|---|---|
| 1 | What is Syncytium Health in one sentence? | A pharmaceutical and nutraceutical company that makes its own branded formulations and sells part of the range direct through its store. The "digital medicine platform" and "partner portal" story is dropped. |
| 2 | Real registered address, phone, support email | None shown until supplied |
| 3 | Licences and certifications that can be named (drug licence number, FSSAI number, WHO-GMP, ISO) | None shown until supplied |
| 4 | Real team names, roles, photos | Team page removed from navigation until supplied |
| 5 | Any real customer reviews, partner logos, or numbers such as years in business and number of products | Sections that depend on them are removed |
| 6 | Which products are prescription-only, and may they be listed with "Add to cart"? | Prescription items show "Prescription required" and no cart button |
| 7 | Correct composition for every product (see Problem 18) | Flagged, not guessed |
| 8 | Logo source file (SVG or a tightly cropped PNG, plus a white version) | Claude crops the existing PNG |

## Component shortlist

The four libraries you named are useful, but their flashiest pieces are what produce the AI look. The rule for this project: a component is added only where it replaces something that exists today, and it is restyled to the project tokens.

Component names below were checked against the live library sites on 2026-11-16. Magic UI installs with `npx shadcn@latest add @magicui/<slug>` (confirmed). For Aceternity UI, React Bits and 21st.dev, copy the install command from the component's own page, because their formats change; for React Bits pick the TypeScript + Tailwind variant.

| Job | Use | Library | Where |
|---|---|---|---|
| Section entrance animation | Blur Fade | Magic UI | Every page, one per section |
| Headline entrance | Text Animate (alt: Split Text, React Bits) | Magic UI | Landing and store hero only |
| Real numbers | Number Ticker (alt: Count Up, React Bits) | Magic UI | Landing proof row, About |
| Certification or partner logo strip | Marquee (alt: Logo Loop, React Bits) | Magic UI | Landing, store |
| Quiet hero texture | Dot Pattern or Grid Pattern | Magic UI | Landing hero |
| Feature grid | Bento Grid | Magic UI or Aceternity UI | Landing "what we make", store "why us" |
| Header | Resizable Navbar | Aceternity UI | All pages |
| Site-wide search | shadcn `command` dialog; Placeholders And Vanish Input on `/search` | shadcn, Aceternity UI | Header, `/search` |
| Process story | Sticky Scroll Reveal | Aceternity UI | About: quality process |
| Company history | Timeline | Aceternity UI | About, only with real dates |
| Team portraits | Focus Cards | Aceternity UI | Team |
| Ingredient explanations | Tooltip Card | Aceternity UI | Catalog, product page |
| Product quick view | Expandable Card | Aceternity UI | Catalog |
| Product image zoom | Lens | Magic UI or Aceternity UI | Product page |
| Reviews | Animated Testimonials or Infinite Moving Cards | Aceternity UI | Store, only with real reviews |
| Add-to-cart and submit feedback | Stateful Button | Aceternity UI | Cards, product page, forms |
| Quantity control | Counter | React Bits | Product page, cart |
| Checkout and long forms | Stepper | React Bits | Checkout |
| Delivery announcement | Sticky Banner | Aceternity UI | Store |
| Carousel edges | Progressive Blur | Magic UI | Product carousels |
| Mobile menu | Staggered Menu (alt: shadcn `sheet`) | React Bits | All pages |
| Whole blocks: footer, empty states, auth layout, 404 | Search 21st.dev for "footer", "empty state", "sign in", "404" and pick a shadcn-based block | 21st.dev | As named in prompts |

**Do not use on this site:** Sparkles, Sparkles Text, Meteors, Aurora Background, Aurora Text, Animated Gradient Text, Rainbow Button, Shimmer Button, Neon Gradient Card, Border Beam, Background Beams, Lamp, Vortex, Glowing Stars, Shooting Stars, Splash Cursor, Blob Cursor, Click Spark, Galaxy, Hyperspeed, Magic Bento, Chroma Grid, Fluid Glass, 3D Card Effect, Evervault Card. These are the effects that created the problem.

---

# Part 1 — Foundation (applies to every route)

## Prompt 00 — Save the design rules into the repo

**Observed:** There is no shared design language, so each page was styled on its own. Later prompts depend on these rules being present in every session.

**Prompt:**

```text
Create or update CLAUDE.md at the repo root and add the section below under the heading "Design rules". Do not change any other code in this session. If CLAUDE.md already has design guidance that conflicts, replace it and tell me what you removed.

## Design rules

Syncytium Health is a pharmaceutical and nutraceutical company with a company site and a direct store. The site must read as calm, clinical and credible. It was previously built with heavy AI-template decoration; removing that is the purpose of the current work.

Colour
- One brand colour: the deep violet of the logo. Sample it from public/brand/logo.png and store it as --brand; the existing --color-brand-800 (#3d2e86) is the expected neighbourhood. Hover is one step darker. A 5% tint of the brand is the only tinted surface.
- Neutrals: background #FFFFFF, surface #F7F6F3, border #E6E3EC, ink #17151F, muted ink #5A5766, subtle ink #6E6B7B. Subtle ink is the lightest text colour allowed; it passes 4.5:1 on white.
- Semantic colours carry meaning only: success #1F7A4D, warning #A15C07, danger #B42318.
- No gradients on text, buttons, headers or footers. No coloured glow shadows. No glass or backdrop-blur panels.

Type
- Headings on marketing pages: Newsreader, weight 500, letter-spacing -0.02em. Everything else: Geist. Formulas, CAS numbers and IDs: Geist Mono. Load all three with next/font and remove Space Grotesk, Plus Jakarta Sans and Nunito Sans. If the logo wordmark turns out not to be a serif, tell me before applying Newsreader.
- Scale: 14, 16, 18, 20, 24, 32, 44, 60px. Body 16 to 18px with line-height 1.6 and lines no longer than 65 characters. One h1 per page.
- A heading is one colour. Never colour or gradient part of a heading for emphasis.

Shape and depth
- Radius: 8px for buttons and inputs, 14px for cards and images, fully round only for chips and avatars.
- Borders do the separating. Shadows: none by default, one soft shadow for raised items, one larger shadow for overlays.
- Layout: 1200px container, 12 columns, section padding 96px desktop and 64px mobile.

Components
- Buttons: solid brand primary, outline secondary, text-only ghost. 44px tall. An arrow icon only where the button leaves the page.
- Section headings: optional small uppercase eyebrow in muted ink (plain text, no pill, no icon), then the heading, then one sentence.
- Use shadcn/ui primitives. Components from Magic UI, Aceternity UI, React Bits or 21st.dev are allowed only when a task names them, and must be restyled to these tokens.

Motion
- One entrance animation per section: fade with an 8px rise, 200ms, once. No floating, pulsing or looping decoration. Honour prefers-reduced-motion everywhere.

Content
- Never invent facts: no made-up customers, numbers, addresses, phone numbers, people, reviews, certifications or regulatory claims. Where a fact is missing, render nothing and leave a `TODO(owner): ...` comment in code, then list it in your summary.
- Plain, specific wording. Do not write "empowering", "precision", "seamless", "intelligent", "next-generation", "spectrometry-verified" or "digital" as praise.
- The brand is spelled "Syncytium Health". "SYNCTIUM" is a typo wherever it appears.

Imagery
- Real product photography on a consistent neutral background. No stock portraits, no placeholder avatars, no decorative 3D objects.
```

## Problem 01 — Two design systems, three fonts, no tokens

**Observed:**
- Company pages are styled almost entirely with inline `style` attributes: 230 on `/`, 258 on `/portfolio/catalog`, 100 on `/portfolio/about`. Class names there are prefixed `pf-` and `glass-`.
- Store pages use Tailwind v4 utilities and a `--color-brand-*` scale.
- Fonts in use: Nunito Sans (store and `<body>`), Plus Jakarta Sans (company body text), Space Grotesk (company headings).
- Colours competing as "the purple": `#7c3aed`, `#6366f1`, `#a855f7`, `#8b5cf6`, `#7c6bf0`, plus pink `#ec4899` and cyan `#06b6d4`.
- About fourteen radius values on the landing page: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28px, 50% and 9999px.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: give the whole app one design system so the company pages (/, /portfolio/*) and the store pages (/store, /shop, /collections/*, /product/*, /cart, /search, auth) share fonts, colours, radius, spacing and base components. Today they are two separately styled sites.

What exists now: the company pages are built with inline style attributes and custom classes prefixed pf- and glass- (search for "pf-hero-section", "glass-button", "glass-pill", "gradient-text"). The store pages use Tailwind v4 with a --color-brand-50..900 scale. Three font families are loaded.

Do this:
1. Confirm Tailwind v4 is the styling system, initialise shadcn/ui if it is not already present (npx shadcn@latest init), and add the `motion` package.
2. Define the tokens from CLAUDE.md once in the global stylesheet using Tailwind's @theme, and map shadcn's variables (--background, --foreground, --primary, --border, --radius and so on) to them.
3. Replace the three font families with Newsreader, Geist and Geist Mono through next/font, exposed as --font-display, --font-sans and --font-mono.
4. Add these shadcn primitives and style them to the tokens: button, badge, card, input, textarea, label, select, tabs, accordion, dialog, sheet, command, carousel, tooltip, table, skeleton, sonner.
5. Create shared building blocks in components/site: Container, Section, SectionHeading (eyebrow, title, lead), ProductCard, Price, Chip.
6. Remove the old CSS variables --primary-accent, --secondary-accent, --tertiary-accent, --primary-glow and the keyframes pf-floatSlow and pf-pulseGlow once nothing references them.

Do not restyle individual pages yet beyond what breaks; later tasks do that page by page. Finish by listing every file that still contains an inline style attribute so the following tasks can clear them.

Done when: one font stack and one colour scale are loaded on every route, the header and body text look the same on / and /store, and the build passes.
```

## Problem 02 — The repeated decoration kit

**Observed:**
- Every section opens with a pill containing a sparkle icon and a label: "Intelligent Digital Medicine Platform", "Better Together • SYNCYTIUM Health", "Therapeutic Store • Official Supply", "Interactive Molecular Salt Inspector", "Connect & Partner Portal", "Dedicated Team & Employ Showcase", "Dedicated Digital Medicine Registry", "Bio-Equivalence Spectrometry Certified", "Official About Us Page".
- Every heading ends in gradient-coloured words (classes `gradient-text` and `gradient-accent-text`). The store does the same with a flat purple word: "All **supplements**", "Loved by our **community**", "Questions, **answered**", "Start your **daily ritual.**"
- Primary buttons are fully rounded gradient pills with a purple glow (`.glass-button`, for example `box-shadow: 0 10px 25px rgba(124,58,237,0.22)`), nearly all with a trailing arrow.
- Star ratings in the hero are emoji: "⭐ ⭐ ⭐ ⭐ ⭐".
- Catalog cards each have a different rainbow gradient line along the top edge.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: remove the decoration that makes every section of this site look like the same AI template, and replace it with the shared primitives.

Find and replace across the whole app:
1. Sparkle pills above headings (class glass-pill, usually with a lucide Sparkles icon). Replace each with the SectionHeading eyebrow: plain uppercase muted text, no pill, no icon. Delete eyebrows that say nothing, such as "Official About Us Page" and "Dedicated Team & Employ Showcase".
2. Gradient or purple-coloured words inside headings (classes gradient-text and gradient-accent-text, and the purple span the store puts on the last word of headings). Headings become a single ink colour.
3. Gradient pill buttons with glow shadows (classes glass-button and glass-button-secondary, and inline linear-gradient backgrounds on buttons). Replace with the shadcn Button in primary, outline or ghost. Keep a trailing arrow only on buttons that navigate to another page.
4. Emoji used as interface: the star emoji in the hero and any others. Use lucide icons, or remove.
5. The per-card rainbow top borders on the catalog cards. Remove.
6. Glass effects: translucent white backgrounds with backdrop-filter on cards, header and chips. Use solid surfaces with a 1px border.

Then delete the now-unused classes from the stylesheet.

Do not rewrite copy or rearrange layout in this task; the result should be the same pages with the decoration gone. Send me before and after screenshots of /, /portfolio/about and /store.
```

## Problem 03 — Invented and contradictory content

**Observed on the company pages:**
- "Trusted by 12,000+ pharmacy & health teams", with three avatar photos from Unsplash; one of them fails to load and shows broken alt text in the hero.
- "Trusted by innovative pharmacy networks": Apollo Pharmacy, MedPlus, Netmeds. The About page repeats them as collaborators. These are real companies.
- "SYNCYTIUM Health Bio-Tech Tower, 450 Genomics Way, Suite 1200, Boston MA 02115", "+1 (800) 555-SYNCYTIUM", "partners@syncytium-health.com" (a different domain from the site).
- Form placeholders "Dr. Sarah Connor", "Apex Care Pharmacy LLC".
- About page statistics: "99.98% API Salt Purity", "500+ Certified Formulations" (the catalog lists 10), "< 0.01% Trace Impurity Rate", "100% FDA / WHO Standard". "FDA" claims appear throughout; the US FDA does not regulate an Indian company's domestic products.
- Brand spelled three ways: "SYNCYTIUM", "Syncytium", and "SYNCTIUM Healthcare / SYNCTIUM Pharma Labs / SYNCTIUM Urology".
- Navigation label "Team & Employ".

**Observed on the store:**
- "Sample reviews for demonstration." printed under reviews of "Daily Synbiotic", "Magnesium Glycinate Night" and "Marine Collagen Glow", none of which the store sells.
- FAQ answers mention gummies and Marine Collagen, which are not in the range.
- Footer: "Product information and prices on this site are demo content.", phone "1800-000-0000", and "Contact us" links to `mailto:care@syncytiumhealth.example`.
- "Shipping & returns" and "Privacy policy" in the footer are not links.
- Every product carries a "Sale" badge.
- Product descriptions are unedited pack copy: "Trust the Trustworthy SYN-GUT Bacillus Clausii Spores 2 billion spores SuspensionThe Probiotics Power For Restoration of Health."
- Login page: "Log in to order medicines, track orders and manage prescriptions", on a store that describes its products as food supplements.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first, especially the Content section.

Goal: make every statement on the site either true or absent. The site currently contains invented customers, numbers, addresses, people and reviews, which is the fastest way for a health company to lose a visitor's trust.

1. Create content/site.ts as the single source for company facts: legal name, tagline, address, phone, support email, licence numbers, social links. Fill only what you can confirm from the repo. Every unknown is null with a TODO(owner) comment. Components render nothing when a value is null.
2. Remove outright: the "Trusted by 12,000+" line and its avatars; the Apollo Pharmacy, MedPlus and Netmeds chips and the sentence naming them on the About page; the Boston address, the 555 phone number and the partners@syncytium-health.com address; the four statistics on the About page; all "FDA" and "WHO" compliance wording; the three sample reviews and the line "Sample reviews for demonstration."; the sentence "Product information and prices on this site are demo content."; the phone 1800-000-0000; the mailto to care@syncytiumhealth.example.
3. Fix: spell the brand "Syncytium Health" everywhere, including product manufacturer fields that say SYNCTIUM; rename "Team & Employ" to "Team"; replace form placeholders with neutral examples such as "Your full name"; rewrite the FAQ so it only mentions products that exist in the catalog data; show a Sale badge only when a product has a compare-at price and a flag set in data, and add that flag as false by default.
4. Rewrite product short descriptions so each is one plain sentence saying what the product is and who it is for. Keep the claims that are already there; do not add health claims. Fix the missing space in "SuspensionThe".
5. Align the page titles, meta description and login copy with one description of the company: a pharmaceutical and nutraceutical company that makes its own formulations and sells part of the range direct. If the repo or the owner's notes say otherwise, stop and ask me.

End with a list titled "Owner must supply" containing every TODO(owner) you left, grouped by page.
```

## Problem 04 — Navigation and site structure

**Observed:**
- `/` and `/portfolio` return identical pages. The "Home" link in the header points to `/portfolio`, the logo points to `/`.
- Company header: Home, About Us, Digital Catalog, Team & Employ, Salt Inspector (a button that scrolls), "Search Salts" (opens a modal), "Get Started" (goes to `/store`, which is not what "Get Started" suggests).
- Store header: Shop, Collections, Our science, FAQ, a ghost text "What are you looking for?", and three icons. There is no link from the store back to the company pages except the logo.
- Each company sub-page has a "Back to Home" pill under the header, duplicating the navigation.
- Many navigation actions are `<button>` elements with click handlers instead of links ("Explore Medicine Directory", "Discover Our Full Story", "Shop Now", "View Full Catalog"), so they cannot be opened in a new tab or crawled.
- On mobile the company header is about 100px tall and the menu opens as a floating card of bordered rows ending in a gradient button.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: one header and one clear site structure for the whole site, so the company pages and the store feel like the same place.

Structure to implement:
- / is the landing page. /portfolio redirects permanently to /. Move /portfolio/about to /about, /portfolio/catalog to /products, /portfolio/team to /team, each with a permanent redirect from the old path. Add /contact as its own page (its content comes from a later task; create the route with the existing contact section for now).
- Store routes stay as they are.

Header, shared by every route through the root layout:
- Left: logo, linking to /.
- Centre: Products, Shop, About, Contact. "Shop" opens a small menu with the four collections and "All products". Add Team only if content/site.ts says a real team exists.
- Right: search, account, cart with item count. Search opens a command dialog (shadcn command) that searches products by name and ingredient and replaces both the "Search Salts" modal and the store's ghost search text.
- Build it on Aceternity UI's Resizable Navbar: solid white with a bottom border, 64px tall, shrinking slightly after scroll. Restyle it to the tokens; no blur, no gradient, no floating purple bar.
- Mobile: a full-height sheet with large plain links (React Bits Staggered Menu, or shadcn sheet if simpler). Header height 56px.

Also:
- Remove the "Back to Home" pills and the "Salt Inspector" header button.
- Turn every button that only navigates into a real link (next/link). Search for onClick handlers that call router.push or scrollIntoView on the company pages.
- Mark the current page in the header with aria-current.

Done when: the same header renders on /, /about, /products, /store and /product/[slug]; every old URL redirects; and keyboard users can reach and operate the menu, search and cart.
```

## Problem 05 — Footer and missing legal pages

**Observed:**
- Landing footer is one row: logo, "© 2026 All Rights Reserved." and three links, "Privacy Policy", "Terms of Service", "FDA Disclaimer", which all point to `#hero-3d` (the top of the page).
- `/portfolio/about`, `/portfolio/team` and `/portfolio/catalog` have no footer; the page simply ends.
- The store footer is a full-width purple gradient slab with a headline ("Health that starts from within."), a second call to action, payment methods written as text pills, and the dark logo on purple where it is hard to read.
- The developer credit block (logo, address, email) is larger and more detailed than the company's own contact details.
- No privacy, terms, shipping, returns or contact page exists.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: one footer on every route, and the legal and help pages a store that takes payments is expected to have.

Footer, in the root layout:
- Light surface background (--surface) with a top border. No gradient, no headline, no call-to-action button.
- Four columns on desktop, stacked accordion-free list on mobile: Company (About, Products, Team if present, Contact), Shop (four collections, All products), Help (FAQ, Shipping and returns, Privacy policy, Terms), Account (Orders, Addresses, Cart).
- Below: company name, address, phone, email and licence numbers from content/site.ts, each omitted when null; payment method marks as small monochrome icons; the supplement disclaimer in subtle ink at 14px; copyright.
- The developer credit becomes a single line of subtle text at the very bottom: "Site by BluMargins Technologies" linking to their site. Remove their address and email from the client's footer.
- For structure you may start from a shadcn-based footer block on 21st.dev (search "footer") and restyle it.

Pages to create, each using a shared prose layout with a 65-character measure: /privacy, /terms, /shipping-returns, /faq. Move the existing FAQ content to /faq and keep a short version on the store home. For the legal text, write clearly labelled draft copy headed "Draft for legal review" and add TODO(owner) for anything that depends on company facts.

Fix every footer link so it goes to a real route. Remove the "FDA Disclaimer" link.

Done when: all routes including /about, /team and /products show the same footer and no link in it is dead.
```

## Problem 06 — Logo

**Observed:**
- The logo is a raster PNG with large transparent padding. To compensate, the header renders it at `height:105px` with `margin: -22px 0`, and the footer at `height:150px` with `margin: -30px 0`. The visible mark ends up about 40px wide and the wordmark is unreadable in the header.
- On the store, the dark purple logo sits on a purple gradient bar and on the purple footer, with low contrast.
- The browser preloads a 750px-wide logo image on every page.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: a logo that is legible at header size and correct on light and dark surfaces.

1. Inspect public/brand/logo.png. If an SVG source exists in the repo, use it. Otherwise crop the PNG tightly to the artwork (no transparent padding) and save it as logo.png at 2x the largest display size. Create a horizontal lockup (mark left, wordmark right) if the current asset is stacked, by composing the existing artwork; do not redraw or alter the mark. Add TODO(owner) asking for the vector file and a white version.
2. Build a Logo component with a fixed height (28px in the header, 32px in the footer), width auto, an accessible name of "Syncytium Health", and priority loading only in the header.
3. Remove the negative-margin and oversized-height hacks (search for "pf-navbar-logo" and for margin-top:-22px and margin-top:-30px).
4. The header and footer are now light surfaces, so the dark logo is correct everywhere. If any dark surface remains, use the white version there or leave a TODO(owner) rather than placing the dark logo on colour.
5. Check the favicon and apple-touch icon use the cropped mark.

Send me a screenshot of the header at 1440px and at 390px.
```

## Problem 07 — 3D objects, motion and loading weight

**Observed:**
- Four WebGL scenes: a spinning purple capsule in the landing hero, a DNA helix with particles in the "about" section and again on the About page, a ball-and-stick "3D Salt Molecule Mesh" on a grey panel, and a knee joint on a pedestal in the store hero.
- None shows a Syncytium product. The helix has no connection to the content beside it. The "molecule" is the same generic shape for every product. The knee joint stays on screen while the slide text reads "Keep your heart in rhythm."
- The landing hero is `min-height:100vh`, so the first screen is the capsule and nothing about the company's products.
- The store hero cross-fades two headlines on top of each other; mid-transition both are legible at once ("Keep your heart in rhythm." over "…easy movement.").
- The store hero also floats four fake instrument chips: "Heart rhythm 72 bpm", "Omega-3 EPA + DHA", "Circulation", "Heart health".
- The stylesheet contains one `prefers-reduced-motion` rule in total.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: remove decorative 3D and looping motion, and replace it with real product imagery and one consistent entrance animation. The 3D scenes are generic, unrelated to the products, and are the heaviest thing each page loads.

1. Remove the WebGL scenes: the capsule in the landing hero (container class pf-pill-canvas-container), the DNA helix (pf-about-dna-col, and the copy of it on the About page), the "3D Salt Molecule Mesh", and the knee joint model in the store hero. Remove the fake instrument chips in the store hero ("Heart rhythm 72 bpm", "EPA + DHA", "Circulation", "Heart health"). Then uninstall three, @react-three/fiber, @react-three/drei and any related packages if nothing else imports them.
2. Where a scene sat, use product photography from the existing assets (public/portfolio/assets and the store product images) through next/image with correct sizes. Later tasks specify the layout for each hero; in this task a single well-cropped product image in the same slot is enough.
3. Remove every infinite animation used as decoration (keyframes pf-floatSlow, pf-pulseGlow, hero-float, hero-spin, hero-bar, hero-draw) unless it is a loading indicator.
4. Add Magic UI's Blur Fade and wrap each page section's content in it, configured for a 200ms fade with an 8px rise that runs once when the section enters view. This is the only entrance animation on the site.
5. Add a global rule so that with prefers-reduced-motion: reduce, all animations and transitions are effectively off and Blur Fade renders its children immediately.
6. Remove the min-height:100vh from the landing hero.

Report the JavaScript size of / and /store before and after.
```

## Problem 08 — Accessibility

**Observed:**
- Subtle text uses `#94a3b8` on white (about 2.6:1), including the "Trusted by…" caption, "Clinical Function" lines and CAS numbers. WCAG AA needs 4.5:1.
- White body text sits on the lighter end of the store's purple gradient in the footer and "Why Syncytium" block.
- The four labels in the landing contact form are not associated with their inputs (no `for`/`id`).
- `/store` has two `<h1>` elements. `/cart` has none.
- Only one `:focus-visible` rule exists; custom buttons on the company pages show no focus ring.
- The catalog modal's footer is cut off at 900px viewport height (the "Close" button is half hidden), and it is not clear that focus is trapped inside it.
- Product images on the catalog use tiny pack shots with alt text equal to the product name only.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: bring every route to WCAG 2.2 AA. Treat this as an audit followed by fixes.

Fix the known issues:
1. Replace every text use of #94a3b8 and similar light greys with the subtle ink token. Check all text on tinted or coloured surfaces for 4.5:1 (3:1 for text 24px and larger).
2. Associate every form label with its control. The landing contact form's four labels currently have no for attribute.
3. Exactly one h1 per route: /store has two and /cart has none. Check heading levels do not skip.
4. A visible focus ring on every interactive element, using :focus-visible with a 2px brand outline and 2px offset. Remove outline:none wherever it has no replacement.
5. Dialogs, sheets and menus must trap focus, close on Escape, return focus to the trigger and fit small viewports with internal scrolling. The catalog detail modal currently overflows at 900px height.
6. Icon-only links and buttons (search, account, cart, close, carousel arrows, password visibility) need accessible names.
7. Touch targets at least 44 by 44px on mobile.
8. Carousels: previous and next buttons with names, no auto-advance, or a visible pause control if any auto-advance remains.

Then audit: run an automated check (axe via Playwright, or Lighthouse accessibility) on /, /about, /products, /store, /shop, one /product page, /cart, /search and /login, fix what it reports, and give me the before and after scores with any items you chose not to fix and why.
```

## Problem 09 — Metadata and structured data

**Observed:**
- `/`, `/store`, `/portfolio/about`, `/portfolio/team` and `/portfolio/catalog` all share the title "Syncytium Health: Science-backed daily supplements".
- Nearly every route shares the description "Order medicines, healthcare products and wellness essentials online with fast home delivery."
- No Open Graph tags, no canonical links and no JSON-LD on any route. The landing page instead shows visitors a "View Google JSON-LD" button that prints a JSON snippet in the page.
- `/robots.txt` and `/sitemap.xml` return 404. `/` and `/portfolio` are duplicates with no canonical.

**Prompt:**

```text
Goal: correct, distinct metadata on every route, and real structured data in place of the JSON that is currently displayed to visitors.

1. Using the Next.js Metadata API, give every route its own title and description based on its actual content, with a shared title template "%s | Syncytium Health". Set metadataBase, canonical URLs, Open Graph and Twitter card data, and a default share image.
2. Add app/robots.ts and app/sitemap.ts covering all public routes, including every product and collection. Exclude /cart, /checkout, /account/* and the auth pages from indexing.
3. Add JSON-LD as script tags: Organization on the landing page (only fields that are non-null in content/site.ts), BreadcrumbList on product and collection pages, and Product with Offer on each store product page (name, image, description, price, currency INR, availability). Do not emit ratings or reviews, because there are none.
4. Remove the "View Google JSON-LD" and "Google Schema" buttons and the code panel they reveal from the landing page and the catalog modal.

Verify by fetching the rendered HTML of /, /shop and one product page and showing me the head tags and the JSON-LD.
```

---

# Part 2 — Landing page (`/`)

## Problem 10 — Hero

**Observed:**
- Eyebrow pill "Intelligent Digital Medicine Platform" with a sparkle icon.
- Headline "Empowering Healthcare Through Digital Precision" at 67px, weight 800, second line in a purple-to-pink gradient. It names no product and no audience.
- Paragraph describes a B2B software service ("empowers pharmaceutical leaders and retail pharmacies to digitize medicine catalogs"), which is not what the rest of the site offers.
- Two buttons, "Explore Medicine Directory" and "Contact Partner Portal". Both are scroll buttons.
- Proof row with a broken avatar image, emoji stars and "Trusted by 12,000+".
- A row of three real pharmacy brand names presented as customers.
- A 3D capsule fills the right half. The hero is a full viewport tall. On a 390px screen the capsule overlaps the right edge of the headline.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first. Prompts 01 to 07 are assumed done.

Goal: a landing hero that tells a first-time visitor, within five seconds, what Syncytium Health makes and what they can do here. The current hero has a generic slogan, a description of a software platform the company does not sell, invented social proof and a decorative 3D capsule.

Build it as a two-column section (stacked on mobile, text first), about 560 to 640px tall on desktop, not full-viewport:

Left column
- Eyebrow: "Pharmaceuticals and nutraceuticals".
- h1 in Newsreader, one colour, two lines at most. Write three options for me to choose from that state plainly what the company makes, for example "Medicines and daily supplements, made to be trusted." Do not use the banned words in CLAUDE.md.
- One sentence, 18px, naming the real therapeutic areas in the catalog data (gut health, liver care, bone and joint, heart).
- Primary button "Shop the range" linking to /shop. Secondary button "View all products" linking to /products.
- No avatars, no star rating, no customer count, no brand chips.

Right column
- A composed still of real product packs from the existing assets: one large image in a 14px-radius frame on the surface colour, with two smaller pack shots offset below it. No rotation, no floating animation.

Below the columns
- A proof row of three or four facts, each a number or short label with a caption, separated by hairlines. Use only facts from content/site.ts or countable from product data (for example the number of products and of therapeutic areas). Animate numbers once with Magic UI Number Ticker. If fewer than three real facts exist, omit the row and add TODO(owner).
- If content/site.ts lists certifications, show their marks in a single quiet row. Use Magic UI Marquee only if there are more than six.

Background: white, with Magic UI Dot Pattern in the border colour masked to fade out by the middle of the section. Headline entrance with Magic UI Text Animate (blur in by word, once).

Send me screenshots at 1440, 768 and 390px with each of the three headline options.
```

## Problem 11 — "Precision Pharmaceutical Excellence" section

**Observed:**
- Sparkle pill "Better Together • SYNCYTIUM Health", gradient heading, one paragraph of abstract claims, and three ticked lines: "100% Certified Active Pharmaceutical Ingredients (APIs)", "Spectrometry-Verified Bio-Equivalence & Absorption", "Transparent Formulations Trusted by Clinicians & Patients".
- The right half is the DNA helix, which fades in from `opacity:0` and leaves a blank area until it does.
- The section says nothing a visitor could check or act on.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: replace the landing section headed "Precision Pharmaceutical Excellence" (section id "about") with one that shows what the company makes. The current section is abstract claims beside a DNA animation.

New section, "What we make":
- SectionHeading with eyebrow "Range", a title of your choice in plain words, and one sentence.
- A bento grid (Magic UI Bento Grid, or Aceternity UI's) of the therapeutic areas found in the product data: Gut health, Liver care, Bone and joint, Heart and omega-3, plus one wider tile for prescription formulations if the catalog contains them. Each tile: a real product photo, the area name, one line saying what is in it, the product count, and the whole tile links to the matching collection or to /products filtered by that area.
- Tiles use the surface colour with a border; on hover the border darkens and the image scales to 1.03. No spotlight, glow or tilt effects.
- Under the grid, a single text link "About the company" to /about.

Delete the three ticked claims unless content/site.ts can back them; do not rephrase them into new claims.
```

## Problem 12 — Store promotion card

**Observed:**
- A large rounded card: pill "Therapeutic Store • Official Supply", heading "Shop From Us for Spectrometry-Certified Medicines" with a purple-to-cyan gradient (a third gradient scheme on one page), three icon claims ("100% Lab Verified Salts", "CAS Indexed & Registered", "Rapid Express Dispatch"), and a gradient "Shop Now" button with two icons.
- On the right, three small product cards are fanned at angles and overlap each other. A blurred purple circle sits behind them.
- Immediately below, "Featured Formulations" shows three more products, so the page promotes the store twice in a row with two different card designs.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: merge the landing page's store promotion card (class pf-banner-card, heading "Shop From Us for Spectrometry-Certified Medicines") and the "Featured Formulations" grid below it into one section, because they currently do the same job twice with two different card designs.

New section, "Shop direct":
- SectionHeading on the left with a "Shop all products" text link aligned right on the same row.
- One row of four ProductCard components (the shared card used by the store) showing the store's best sellers from data. On mobile this becomes a horizontally scrolling row with snap, two cards visible.
- Under the row, three short service facts in a single line with small lucide icons, using only what the store already states elsewhere: free delivery above ₹499, ships within 24 hours, 7-day returns.

Remove the fanned and rotated preview cards, the blurred purple circle, the three "Lab Verified / CAS Indexed / Rapid Express" claims and the gradient button.
```

## Problem 13 — Featured product cards on the landing page

**Observed:**
- Each card gives the product photo a 4:3 box capped at 160px with `object-fit: contain`, so a pack shot about 90px wide floats in a white rectangle.
- Each card shows a dark "Prescription (Rx)" pill, a star rating (4.9, 4.85, 4.9), a manufacturer line with the brand misspelled, and a gradient "View Details" button that opens a modal rather than a page.
- Star ratings on prescription medicines look promotional and have no visible source.
- These cards are a different design from the store's product cards.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: one product card design for the whole site. The landing page, the catalog and the store currently each have their own.

Make the shared ProductCard cover both kinds of product:
- Image: square, 14px radius, on the surface colour, object-fit contain with 12% padding so pack shots of different shapes look consistent. If source images are small, note which ones in your summary so the owner can supply larger files.
- Category in small uppercase muted text, then product name at 18px, then one line of description clamped to two lines.
- Up to three composition chips in Geist Mono at 13px.
- Store products: price with compare-at price where set, and an "Add" button. Use Aceternity UI Stateful Button for the adding and added states.
- Catalog-only and prescription products: no price and no cart button; a "Prescription required" badge in neutral ink where it applies, and the whole card links to the product's page.
- No star ratings or review counts anywhere until real reviews exist.
- The whole card is one link; the Add button is a separate control that does not navigate.

Replace the landing page's featured cards, the catalog cards and the store cards with this component, and delete the three old implementations.
```

## Problem 14 — "Interactive Molecular Salt Inspector"

**Observed:**
- Pill "Interactive Molecular Salt Inspector", heading "Deep-Dive into Active Salt Formulations".
- Left panel "3D Salt Molecule Mesh": a generic ball-and-stick shape on a flat grey rectangle, under a formula string joined with plus signs ("C20H39NO2 + C11H22N2O6S2 + C5H11NO2").
- Two progress bars: "Bioavailability Index 89.6%" and "Metabolic Half-Life 3.8 - 5.5 Hours", shown as a bar filled to 75%. Neither has a source.
- Right panel lists ingredients with a percentage beside the dose: "200 mg (45%)", "100 mg (25%)", "150 mg (30%)". The percentages do not follow from the milligrams.
- The "View Google JSON-LD" button swaps the ingredient list for a black code panel.
- The intro text tells visitors they can analyse "search schema tags".

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: turn the landing section with id "salt-inspector" into a clear, honest "What's inside" explorer. The idea, letting visitors see exactly what each formulation contains, is the most distinctive thing on the page and worth keeping. The execution is a fake 3D molecule, unsourced metrics and a developer JSON view.

Rebuild as:
- SectionHeading: eyebrow "Composition", title along the lines of "See exactly what's in each formulation", one sentence.
- Tabs for a handful of products (shadcn tabs, or Aceternity UI Tabs restyled). On mobile the tab list scrolls horizontally.
- Tab content in two columns. Left: the product photo, name, form (tablet, capsule and so on), pack size, and a link to the product page. Right: a table with columns Ingredient, Amount per unit, Role. Ingredient names are plain text; amounts and CAS numbers in Geist Mono. Each ingredient name has an info affordance that opens Aceternity UI Tooltip Card with a two-sentence plain explanation.
- Under the table, one line in subtle ink: the standard advice to read the label and consult a doctor.

Remove: the 3D mesh panel, the "Bioavailability Index" and "Metabolic Half-Life" bars, the percentage figures in brackets, the formula string joined with plus signs, and the JSON-LD toggle and code panel. If the product data has no source for an ingredient's role, leave that cell empty and list the product under TODO(owner).

Do not write new pharmacological claims; reuse the wording already in the data.
```

## Problem 15 — Contact section

**Observed:**
- Pill "Connect & Partner Portal", heading "Digitize Your Pharmacy with SYNCYTIUM Health", and the line "Ready to convert your physical medicine inventory into a 3D digital showcase indexed on Google? Reach out to our digital pharmacy architects."
- Form fields: Your Name, Work Email, Pharmacy / Brand Name, "Integration Requirements" (placeholder asks for "number of medicine SKUs"). Submit is a full-width gradient pill.
- Right column: the invented Boston address, email and phone, then a large empty gap, then a card "Google Schema & FDA Compliant Data".
- There is no dedicated contact page and no visible success or error state.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: a contact page at /contact and a short contact band on the landing page, for the audiences a pharmaceutical company actually hears from. The current section sells a software service the company does not offer and lists an invented address.

/contact page:
- h1 "Contact us" and one sentence.
- Left: a form built with shadcn form, react-hook-form and zod. Fields: Full name, Email, Phone (optional), "I am a" select (Customer, Doctor or pharmacist, Distributor, Other), Message. Inline validation messages, a disabled and loading state on submit (Aceternity UI Stateful Button), a success message that replaces the form, and an error message that keeps the entered values. Wire it to the existing submit handler; if there is none, create a server action that validates and logs, with TODO(owner) for the destination inbox.
- Right: contact details from content/site.ts as a simple list with lucide icons, hours if provided, and a short note on where order questions go (the account's orders page). Render only what is non-null. No map unless a real address exists.

Landing page: replace the section with id "contact" by a slim band on the surface colour: one line of text, and a button to /contact.

Remove the "Digitize Your Pharmacy" heading and paragraph, the "Integration Requirements" field, the "Google Schema & FDA Compliant Data" card and the invented address, email and phone.
```

---

# Part 3 — Company pages

## Problem 16 — About (`/portfolio/about`)

**Observed:**
- Two pills at the top, "Bio-Equivalence Spectrometry Certified" and "Official About Us Page", plus a "Back to Home" button.
- Heading "Precision Formulations for Cardiovascular Resilience". The catalog is mostly gut, liver, bone and antibiotic products.
- Four statistic cards with unsourced figures (see Problem 03) and the DNA helix on the right.
- Three tab buttons: "Company Mission & Vision", "Clinical Verification Schema", "Salt Purity & Safety Standards".
- A card "Dedicated to Clinical Quality & Chemical Integrity" naming three pharmacy chains as collaborators.
- "Pharmaceutical Standards": four cards (R&D, Quality, Science, Distribution) whose icons are white on pale pastel squares and nearly invisible, each ending in a "Verified Standard ↗" link that goes nowhere.
- The page ends there, with no footer and no next step.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: an About page that explains who the company is, how it makes its products and why that can be trusted, using only real information. The current page is abstract claims, unsourced statistics, a DNA animation and links that lead nowhere.

Rebuild /about with these sections, each using SectionHeading:
1. Intro: h1 "About Syncytium Health", two short paragraphs in plain language (who the company is, where it is based, what it makes). Beside it, one real photograph: facility, team or product range. If none exists, use a product range image and add TODO(owner).
2. What we make: a compact version of the therapeutic-area grid from the landing page, linking to /products.
3. How we make it: the quality process as four or five steps, for example sourcing, manufacturing, testing, release. Use Aceternity UI Sticky Scroll Reveal on desktop, with the step text scrolling past a fixed image or simple diagram; on mobile render a plain numbered list. Write each step as two sentences describing what happens, with TODO(owner) wherever you would need a fact you do not have.
4. Licences and certifications: a simple bordered list from content/site.ts with licence numbers. Omit the section if empty.
5. Milestones: Aceternity UI Timeline, only if the owner has supplied real dates. Otherwise omit.
6. Closing band: links to /products and /contact.

Remove: both pills, the "Cardiovascular Resilience" heading, the four statistic cards, the three tabs and their panels, the sentence naming Apollo Pharmacy, MedPlus and Netmeds, and the four "Verified Standard" cards.

Give me the copy you wrote as a separate list so the owner can correct it.
```

## Problem 17 — Team (`/portfolio/team`)

**Observed:**
- Pill "Dedicated Team & Employ Showcase", heading "Meet the Pharmacists & Research Scientists".
- Six cards: Dr. Sarah Jenkins, Marcus Chen, Elena Rodriguez, David Kim, Dr. Michael Chen, Sophia Patel. The photos load from `i.pravatar.cc/150`, a placeholder avatar service: 150px images stretched to about 390px, so they are blurred, and they include people in sunglasses and a hooded coat.
- Each card has a "Contact" button with no destination. No biographies or qualifications. No footer.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: a Team page that shows real people or does not exist. The current page shows six invented names with photos from a placeholder avatar service (i.pravatar.cc). On a pharmaceutical company's site this is the single most damaging thing a visitor could discover.

1. Create content/team.ts with a typed, empty array and a TODO(owner) describing what is needed for each person: name, role, qualification, a two-sentence biography, a portrait at least 800px square on a plain background, and an optional LinkedIn URL.
2. Remove the six invented people and every reference to pravatar.cc.
3. Make the route and its navigation link conditional: while the array is empty, /team returns notFound() and "Team" does not appear in the header or footer.
4. Build the page for when data exists: h1 "Our team", one sentence, then a grid using Aceternity UI Focus Cards restyled to the tokens (3 columns desktop, 2 tablet, 1 mobile; 4:5 portraits; name and role below the image, not overlaid). Selecting a person opens a shadcn dialog with qualification and biography. A person without a photo shows a monogram on the surface colour.
5. No "Contact" button per person; one "Contact us" link at the end of the page.

Show me the page rendered with three clearly labelled sample entries in a development-only preview, then confirm the samples are not in the production data.
```

## Problem 18 — Catalog list (`/portfolio/catalog`)

**Observed (design):**
- Pill "Dedicated Digital Medicine Registry", heading "Complete Pharmaceutical Medicine Catalog" for a list of 10 products.
- Two wide count cards, "Prescription (Rx) 8" and "Over-The-Counter (OTC) 2", each captioned "Click to view formulations".
- A search field inside its own wide card, with "Showing 10 products" on the far side.
- Cards have a different gradient top border each, a small "Certified" tick, a pack shot floating in empty space, uneven heights, a star rating with a review count, and a "Bio: 89.6%" figure.

**Observed (data, please verify with the owner):**
- Star ratings and review counts appear on prescription medicines, for example "4.9 (384)" and "4.85 (1204)".
- "Syntil-CV" shows its composition in the manufacturer line: "By Cefuroxime Axetil 500 mg + Potassium Clavulanate 125 mg Tablets".
- "Diptor 10" is credited to "Synokem Pharma" and lists Levothyroxine and Acacia Gum, while its pack photo appears to read "Rosuvastatin Tablets".
- "Diptor 20" sits under Over-The-Counter and lists probiotic strains, while its pack photo also appears to read "Rosuvastatin Tablets".
- "Synspas+" lists OEA, Pantethine and L-Valine, which is the composition the store gives for HEP-OB, and at different doses; its pack photo appears to name different ingredients.
- "AXONERGIC-AT" lists oral ingredients with "Bio: ~100% (Topical)".

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: rebuild the product catalog as a clean, filterable index at /products, and surface the data errors so the owner can correct them. Accuracy matters more than appearance on this page: it lists medicines.

Part A, data audit. Before any design work, read the catalog data source and produce a table for the owner listing, per product: name, manufacturer field, listed ingredients, Rx or OTC classification, and anything that looks wrong. Known suspects: Syntil-CV has its composition in the manufacturer field; Diptor 10 and Diptor 20 list ingredients that do not match a rosuvastatin product, and Diptor 20 is classed OTC; Synspas+ carries what looks like HEP-OB's composition; AXONERGIC-AT is described as topical. Do not correct compositions yourself. Fix only the manufacturer-field mix-up and the "SYNCTIUM" spelling, and mark the rest TODO(owner) in the data file.

Part B, page:
- h1 "Products", one sentence stating how many products there are.
- A single toolbar row: search input, a segmented control (All, Prescription, Over the counter) with counts, a therapeutic-area select and a form select (tablet, capsule, liquid, injectable, topical). Filters update the URL query so views can be shared. On mobile the selects move into a filter sheet.
- Result count in muted text, then a grid of the shared ProductCard (4 columns desktop, 2 mobile), all cards the same height.
- An empty state for no matches with a "Clear filters" button.
- Each card links to /products/[slug].

Remove: the pill, the two large count cards, the card around the search field, the "Certified" ticks, the star ratings and review counts, the "Bio:" figures and the coloured top borders.
```

## Problem 19 — Catalog detail modal

**Observed:**
- "View Details" opens a modal instead of a page, so a product has no URL that can be shared or indexed. Store products do have pages, at `/product/[slug]`.
- Modal contents: "Prescription (Rx)" and "Verified Salt Formula" badges, "Digital ID: SNC-PTH-88301-V", a small pack shot centred in a large empty frame, a one-line description in a bordered box, "Active Chemical Salts Breakdown" with dose and percentage, and a "Google Schema" button.
- At 900px viewport height the bottom of the modal, including "Close", is cut off.
- The site-wide "Search Salts" modal lists the same products with "Inspect ➔" links and a placeholder that is cut off mid-word.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: every catalog product gets a real page at /products/[slug], replacing the "View Details" modal, so products can be linked, shared and indexed.

Page layout, two columns on desktop:
- Left: product image in a square surface-coloured frame with Lens zoom (Magic UI or Aceternity UI) on desktop.
- Right: category eyebrow, h1 product name, form and pack size, a "Prescription required" badge where it applies, and a two or three sentence description. If the same product is sold in the store, show its price and a primary button linking to its store page. Otherwise show a secondary button "Ask about this product" linking to /contact with the product name prefilled.
- Below, full width: a Composition table (Ingredient, Amount, Role, CAS number in Geist Mono), then shadcn accordion sections for Indications, How to use, Safety information and Storage, rendering only the sections that have content.
- At the end, "Related products" using ProductCard from the same therapeutic area.
- generateStaticParams and per-product metadata.

Optional quick view on the catalog grid: Aceternity UI Expandable Card showing the image, description and composition table with a link to the full page. Add it only if it stays accessible (focus trap, Escape, scroll inside the card).

Remove: the modal, the "Digital ID" line, the "Verified Salt Formula" badge, the bracketed percentages and the "Google Schema" button. Remove the "Search Salts" modal as well, since the header command search replaces it.
```

---

# Part 4 — Store

## Problem 20 — Store hero (`/store`)

**Observed:**
- The first screen is a full-height purple gradient with a two-slide carousel: "Strong bones, easy movement." and "Keep your heart in rhythm."
- The right side is the 3D knee joint with orbit rings and floating chips described in Problem 07.
- Slide headlines overlap during the cross-fade.
- The header is a floating purple gradient bar with the dark logo in its centre.
- On mobile the hero is the whole first screen: headline, button and the knee joint, with no product visible.
- A shopper must scroll a full screen before seeing anything for sale.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: a store home that shows products on the first screen. The current hero is a full-height purple slideshow with a 3D knee joint and no product in view.

Replace the hero with:
- A slim announcement at the very top using Aceternity UI Sticky Banner restyled to the surface colour: "Free delivery above ₹499 · Ships within 24 hours". Dismissible.
- A hero about 480px tall on desktop on the surface colour, two columns. Left: eyebrow with the collection name, h1 in Newsreader, one sentence, one primary button to the collection. Right: a large real product photograph for that collection in a 14px-radius frame.
- If more than one campaign is needed, use shadcn carousel with two or three slides, manual controls only (arrows and dots with accessible names, no auto-advance), and slide content that moves as one unit so headlines never overlap. If there is only one campaign, do not use a carousel.
- Directly below the hero, without a gap, the four collection tiles in a single row (2 by 2 on mobile) so categories are reachable on the first screen at 1440 by 900.

On mobile the hero is the image at 4:3, then the heading and button; total height under 520px so the first collection tiles are visible.

Remove the purple gradient background, the orbit rings, the floating metric chips and the slide counter.
```

## Problem 21 — Store product cards and carousel

**Observed:**
- "Find your supplement" carousel: the fourth card is cut by the container edge, with no fade, and a short progress line bottom-left with arrows bottom-right.
- Every card has a red "Sale" pill. Vitamin D3 60,000 IU is also tagged "Prescription (Rx)" and still has "Add to cart".
- Card content: purple uppercase category, form label, name, two lines of raw description, ingredient chips, a "Price" label above the price, and a gradient "Add to cart" pill.
- Cards have a border and their images have a second inner frame, a box inside a box.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: the store's product rows use the shared ProductCard and read cleanly. Today every card is on "Sale", cards are boxes inside boxes, and the carousel cuts its last card in half.

1. Replace the store's card with the shared ProductCard (see the earlier card task). Drop the outer card border so the image frame is the only box; text sits directly beneath it. Remove the "Price" label; the price is self-evident.
2. Sale badge only when the data flag is set. Prescription products show "Prescription required" and no cart button; if the owner confirms a product is not prescription-only, correct the data instead.
3. Carousel: shadcn carousel with snap, four cards visible on desktop, 2.2 on mobile so the next card peeks deliberately. Add Magic UI Progressive Blur on the trailing edge on desktop. Arrows sit top-right beside the heading; remove the progress line.
4. The "Best sellers" and "New arrivals" switch becomes shadcn tabs; if the two lists are identical in data, remove the switch.
5. Adding to cart shows the Stateful Button's success state and opens the cart sheet (built in the cart task) rather than navigating.
```

## Problem 22 — Collection tiles and bestseller feature

**Observed:**
- "Science-backed formulations": four image tiles, each with a purple gradient caption bar across the bottom containing the name, a description truncated with an ellipsis ("Probiotics and fibre for a happi…") and a white circular arrow button.
- "Our bestseller" (HEP-OB Tablets): a large grey image block, a ticked benefit list, price, a gradient "Add to cart" and an outline "Learn more". This block works and needs only restyling.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: restyle the store home's collection tiles and bestseller feature to the design rules.

Collection tiles (section headed "Science-backed formulations"; these move directly under the hero per the hero task):
- Image at 4:5 in a 14px-radius frame; below it, outside the image, the collection name at 18px and one full line of description that is not truncated. Rewrite descriptions to fit in about 45 characters.
- No caption bar over the image, no arrow button. The whole tile is a link; on hover the image scales to 1.03.
- Rename the section heading to "Shop by need".

Bestseller feature:
- Keep the two-column layout. Image in a square surface-coloured frame. Right column: eyebrow "Best seller", h2 product name, one sentence, the benefit list with small check icons in ink (not purple), price row, a primary "Add to cart" and a ghost "View details".
- Choose the featured product from a data flag, not a hard-coded name.
```

## Problem 23 — "Why Syncytium" block

**Observed:**
- A purple gradient panel with white text: "Made with care, backed by science."
- Four columns where a word is styled like a statistic: "100%" Clean ingredients, "3rd-party" Tested for purity, "Doctor" Formulated, "FSSAI" Made in India.
- White icon discs on purple. Body text in white on the paler corner of the gradient.
- The claims have no supporting detail: which lab, which licence number.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: turn the store's "Why Syncytium" panel into a trust section that gives evidence. Four slogans on a purple gradient do not persuade anyone; a licence number and a named process do.

Rebuild as a white section with a top border:
- SectionHeading: eyebrow "Quality", a plain title, one sentence.
- A four-item grid (Magic UI Bento Grid restyled, or a simple bordered grid). Each item: a lucide icon in ink, a short title in normal heading style (not a giant word), and two sentences saying what is done and how a customer can check it. For example the FSSAI item shows the licence number from content/site.ts, and the testing item says what is tested per batch.
- Any item whose evidence is missing from content/site.ts is omitted and listed as TODO(owner). If fewer than three remain, reduce the section to a single line of text links to /about.
- A text link "How we make our products" to the quality section of /about.

Remove the purple panel, the oversized "100%", "3rd-party", "Doctor" and "FSSAI" words and the white icon discs.
```

## Problem 24 — Reviews, FAQ and closing band

**Observed:**
- "Loved by our community": three grey cards with purple stars and quotes about products that are not sold here, captioned "Sample reviews for demonstration."
- "Questions, answered": a two-column FAQ accordion, sound in structure, with "+" icons inside faint circles.
- "Start your daily ritual.": a pale purple band with a gradient button, immediately followed by the footer's own "Health that starts from within." and "Shop the range" button. Three consecutive calls to action.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: finish the store home honestly and without repeating the call to action three times.

Reviews:
- Create content/reviews.ts, typed and empty, with TODO(owner) describing what a real review needs: reviewer first name and city, product slug, rating, text, date, and confirmation that it is a verified purchase.
- When the array has at least three entries, render them with Aceternity UI Animated Testimonials restyled to the tokens (or Infinite Moving Cards if there are more than eight), each linked to its product. When it has fewer, render nothing. Remove the three sample reviews and the caption.

FAQ:
- Keep the two-column layout: heading and a link to /faq on the left, shadcn accordion on the right with a plain chevron. Show five questions; the full list lives on /faq. Answers must match the real catalog and the real policies.

Closing band:
- Remove the "Start your daily ritual." band entirely. The footer no longer carries a headline or button, so the page ends after the FAQ.
```

## Problem 25 — Shop and collection listings (`/shop`, `/collections/[slug]`)

**Observed:**
- Heading "All **supplements**" with the second word in purple; eyebrow "SHOP".
- Category filter pills on the left and a native `<select>` for sort on the right. No product count. No filters other than category.
- All six products show "Sale".
- A collection can contain a single row of three products, with nothing else on the page: no introduction and no related content.
- `/collections` redirects to `/shop`, so there is no collections overview.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: listing pages that help a shopper choose, and that do not look empty when a collection holds three products.

/shop and /collections/[slug] share one layout:
- Breadcrumb, h1 in a single colour ("All products", or the collection name), one sentence, and the product count.
- Toolbar: collection chips as links (they already map to routes), a "Form" filter (tablet, capsule, liquid, topical) and sort using shadcn select. Selected filters appear as removable chips. Filter and sort state lives in the URL.
- Grid of the shared ProductCard: 4 columns desktop, 3 at 1024px, 2 on mobile, equal heights. Skeleton cards while loading.
- Empty state with a "Clear filters" button.

Collection pages additionally get:
- A header band on the surface colour with the collection image on the right and, on the left, a short paragraph on what the collection is for and what to look for when choosing. Use existing copy; write no new health claims.
- After the grid, when the collection has fewer than five products, a row "Also consider" with products from other collections.
- The FAQ entries relevant to that collection, if any are tagged in data.

Keep the /collections to /shop redirect.
```

## Problem 26 — Product page (`/product/[slug]`)

**Observed:**
- A single image with no thumbnails and no zoom. A red "Sale" pill on the image.
- Price row "₹315 ~~₹349~~ Save 10%", "Strip of 10 tablets · Inclusive of all taxes".
- Four benefit chips, then a gradient "Add to cart" pill. No quantity selector and no pack-size choice.
- Trust row: "Free delivery above ₹499", "Third-party tested", "7-day easy returns".
- "Check delivery" box with the pincode prefilled as 400001.
- Details accordion: "Description" is open with a down chevron; the closed sections show right chevrons.
- The description states pharmacological effects ("can be recommended for weight loss", "lowers elevated blood sugar levels"), while "Safety information" on the same page says "Not intended to diagnose, treat, cure or prevent any disease". "How to use" says only "Use as directed by your physician."
- "You may also like" carousel is cut at the container edge.
- On mobile there is no persistent add-to-cart; the button scrolls away.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: a product page that lets someone understand the product and buy it without hunting, on desktop and on a phone.

Above the fold, two columns on desktop:
- Gallery: main image in a square surface-coloured frame with Lens zoom on desktop (Magic UI or Aceternity UI) and swipe on mobile, thumbnails below when a product has more than one image. No badge over the image.
- Buy box: breadcrumb, category eyebrow, h1, price with compare-at price and saving when set, pack size and tax note, one or two sentence summary, benefits as a short check list rather than chips, quantity control (React Bits Counter), primary "Add to cart" (Stateful Button, opens the cart sheet), then the three service facts in one muted line. The pincode checker starts empty with the placeholder "Enter pincode", validates six digits, and shows its result inline.
- The buy box is sticky on desktop while the left column scrolls.

Below:
- Composition table (Ingredient, Amount per unit) with Tooltip Card explanations.
- shadcn accordion, multiple sections allowed open, the same chevron for every row rotating on open: About this product, How to use, Safety information, Storage.
- "You may also like" using the shared carousel.

Mobile: a bottom bar that appears once the main button scrolls out of view, showing price and "Add to cart", sitting above the safe area.

Content: the description currently makes treatment claims that contradict the page's own disclaimer. Do not rewrite medical content yourself. Move the ingredient-effect bullets under "About this product", keep the wording, and list every sentence that reads as a treatment claim under "Owner must review" in your summary. Flag "Use as directed by your physician" as needing a real dosage instruction or a prescription-required status.

Keep the route at /product/[slug].
```

## Problem 27 — Cart (`/cart`)

**Observed:**
- Only the empty state could be seen: a bag icon in a grey disc, "Your cart is empty", "Find the right supplement for your daily ritual.", a gradient button, then a large blank area above the footer.
- The page has no `<h1>`.
- Adding to cart elsewhere gives no visible confirmation and no mini cart.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: a cart that confirms additions immediately and makes the path to checkout obvious. I could only review the empty state on the live site, so start by reading the cart code and describing the filled state to me before changing it.

Cart sheet (new): a shadcn sheet from the right, opened by the header cart icon and after any add-to-cart. Line items with image, name, pack size, quantity control (React Bits Counter), line price and remove; a progress line toward free delivery at ₹499 using shadcn progress with the remaining amount in words; subtotal; primary "Checkout" and a text link "View cart".

/cart page:
- h1 "Your cart".
- Filled: two columns. Left, line items as rows separated by hairlines. Right, a sticky order summary card with subtotal, delivery, total, the free-delivery progress, primary "Checkout" and accepted payment marks. On mobile the summary follows the items and a bottom bar repeats total and "Checkout".
- Empty: a short message, a primary "Shop all products", and a row of four best sellers using ProductCard so the page is not blank. A 21st.dev "empty state" block is a fine starting point.
- Quantity changes update totals without a full reload and announce the change to screen readers.
```

## Problem 28 — Search (`/search`)

**Observed:**
- Two search inputs on one page: the ghost text in the header and a pill input below it.
- Eyebrow "SEARCH" above the heading "Search".
- "0 products" is displayed before anything has been typed.
- A wide grey panel repeats "What are you looking for?" and suggests trying "magnesium" or "sleep", neither of which matches anything in the catalog.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: search that helps before, during and after typing. The page currently shows two inputs, a zero count before any query, and suggestions for products the store does not carry.

Header search (from the navigation task): shadcn command dialog opened by the search icon or the "/" key. It shows recent searches, then live results grouped as Products, Collections and Ingredients, each with a thumbnail. Enter goes to /search?q=.

/search page:
- One input at the top of the content, prefilled from the query. Use Aceternity UI Placeholders And Vanish Input with rotating examples taken from real product and ingredient names in the data, restyled to an 8px radius and the tokens.
- Before a query: no count. Show "Popular searches" as chips generated from the real catalog (ingredient names and collection names) and a row of best sellers.
- With results: h1 'Results for "query"', the count, and the same grid and filters as /shop.
- No results: say so plainly, suggest checking spelling, offer the popular chips and a link to /contact.
- Remove the "SEARCH" eyebrow, the grey panel and the "magnesium" and "sleep" examples.
- Search should match product names, ingredients and collection names, and tolerate case and minor typos if the current search makes that practical; tell me how the current search works before changing it.
```

## Problem 29 — Auth pages (`/login`, `/signup`, `/forgot-password`)

**Observed:**
- A grey rounded card centred on a white page, a large empty band beneath it, then the full store footer. The form occupies under a third of the screen width.
- Inputs here are fully rounded pills, a different shape from inputs elsewhere on the site. The focused input shows a doubled outline.
- Login copy: "Log in to order medicines, track orders and manage prescriptions."
- Under the form: "Your data is kept private and secure with Syncytium Health. Home", where "Home" is an unexplained link.
- Email and password only. Signup has no terms or privacy consent line.
- Requesting `/account/addresses` or `/account` while logged out redirects to `/login?next=/account/orders`, so after login the visitor lands on Orders, not the page they asked for.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: auth pages that look like part of the same site and return people to where they were going.

Layout shared by /login, /signup and /forgot-password:
- Split screen on desktop. Left half: the form, max width 400px, vertically centred, with the logo above it linking to /. Right half: a calm surface-coloured panel with one real product photograph and one sentence about what an account gives you (order tracking, saved addresses, faster checkout). On mobile, the form only.
- These pages use a minimal header (logo only) and a one-line footer with links to Privacy and Terms, not the full site header and footer. A 21st.dev "sign in" block is a fine structural starting point.
- Form controls are the standard shadcn input, label and button with the 8px radius and the single focus ring. Password fields keep the show and hide toggle with an accessible name. Signup shows the password rule as helper text and adds "By creating an account you agree to the Terms and Privacy policy" with links.
- Inline validation, a loading state on submit, and server errors shown above the form in a danger-toned alert that screen readers announce.
- Copy: login subtitle becomes "Log in to track orders and manage your addresses." Remove the stray "Home" link.

Bug: the logged-out redirect loses the requested path. /account/addresses and /account both redirect to /login?next=/account/orders. Find the auth guard, make `next` carry the originally requested path, validate it is a same-site relative path, and return the user there after login or signup.

Optional, ask me first because it needs backend work: phone number sign-in with a one-time code, which is common for stores in India, using shadcn input-otp.
```

## Problem 30 — Account and checkout (not visible in the audit)

**Observed:** `/account/orders`, `/account/addresses` and `/checkout` redirect to login, so their design could not be reviewed. Given the rest of the store, they most likely share the old purple gradient styling and pill inputs.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: bring the logged-in pages in line with the rest of the redesign. I could not see these pages on the live site, so begin by running the app, logging in with a test account and sending me a screenshot and a short list of problems for each of /account/orders, /account/addresses, /checkout and the order confirmation page. Wait for my go-ahead before changing checkout.

Then apply:
- Account: a two-column layout with a left navigation list (Orders, Addresses, Profile, Log out) that becomes tabs on mobile. Orders as rows with order number, date, status badge, total and a "View" link, plus an order detail page with a status timeline. Addresses as cards with edit, delete and "Set as default", and the add and edit form in a shadcn dialog. Empty states with one action each.
- Checkout: a single page with clear numbered sections (Contact, Delivery address, Payment, Review) or the React Bits Stepper if the existing flow is multi-step. Minimal header with logo and a "Back to cart" link, no site navigation. A sticky order summary on desktop and a collapsible summary on mobile. Field-level validation, correct input types and autocomplete attributes, and a pincode field that validates six digits. The pay button states the amount.
- Order confirmation: order number, what happens next, delivery estimate and a link to the order.
- Loading and error states for every network action.

Do not change payment logic, prices, tax or order creation. If a visual change needs any of those touched, stop and tell me.
```

## Problem 31 — 404, loading and error states

**Observed:**
- The 404 page has no header or footer: a small logo, a grey magnifier icon, "Page not found", "The page you are looking for doesn't exist." and a gradient "Back to home" pill, alone on a blank page.
- The landing page's lower sections start at `opacity:0` and appear only after script runs, so slow connections see blank bands.
- No skeleton or loading states were visible on listing pages.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: the states between and around pages should look designed, not default.

1. 404 (app/not-found.tsx): render inside the normal site header and footer. Centred content: h1 "We can't find that page", one sentence, the search input, and three links (Shop all products, Products, Contact). Small text shows the requested path. No large "404" numerals and no illustration. A 21st.dev "404" block may be used for structure.
2. Error boundary (app/error.tsx): the same layout with "Something went wrong", a "Try again" button that calls reset, and a link home. Do not show error details to visitors.
3. Loading: add loading.tsx with shadcn skeletons matching the real layout for /shop, /collections/[slug], /product/[slug], /products and /search.
4. Nothing may depend on JavaScript to become visible. Check that no section is rendered with opacity 0 in the server HTML; the Blur Fade wrapper must render visible content when scripts have not run or motion is reduced.
5. Add a route-change progress indicator only if navigations are noticeably slow after this work; tell me what you measured.
```

---

# Part 5 — Finish

## Problem 32 — Mobile

**Observed at 390px:**
- Company header is about 100px tall because of the logo padding. The menu is a floating card of bordered rows ending in a gradient button.
- Landing hero: the 3D capsule overlaps the right side of the headline; the paragraph runs to eight lines; the two buttons stack full-width.
- The landing page is about 6,650px long and the store home about 8,850px.
- Store hero fills the first screen with no product visible.
- Product page: no persistent add-to-cart.
- No horizontal overflow was detected on any tested route, which is good and should stay true.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first. All earlier tasks are assumed done.

Goal: a deliberate mobile pass. Most visitors to an Indian health store are on phones, and the earlier tasks were specified desktop-first.

Review every route at 360, 390 and 430px wide and fix:
- Header 56px tall; the menu sheet has large tap targets and the cart count is visible.
- Type: h1 no larger than 36px, body 16px, no paragraph longer than five lines above the fold on / and /store.
- The first screen of / shows the headline, one sentence and the primary button without scrolling. The first screen of /store shows at least the top of the collection tiles.
- Section padding 64px or less; no two sections in a row with the same background and no content between them.
- Grids: product grids at two columns with 12px gaps; anything that scrolls horizontally uses scroll snap and shows a partial next item.
- Tables (composition) stay readable: two columns, or a stacked definition list under 400px.
- Sticky elements (product page bottom bar, cart bottom bar, announcement) never cover content or each other, and respect the safe-area inset.
- Forms use the right keyboard for each field (email, tel, numeric for pincode) and do not zoom on focus (16px minimum input text).
- No horizontal scroll on any route.

Report the scroll height of / and /store before and after, and send screenshots of the first screen of every route at 390px.
```

## Problem 33 — Final review

**Observed:** The work above spans many sessions, and small inconsistencies will have crept back in.

**Prompt:**

```text
Read the Design rules in CLAUDE.md first.

Goal: an independent consistency review of the finished redesign. Do not fix anything in this session; report only.

Run the app and capture every public route at 1440, 768 and 390px, plus the open states of the mobile menu, search dialog, cart sheet and any dialog. Then check the whole site against CLAUDE.md and report violations with the route, a screenshot reference and the file responsible:

1. Search the codebase for leftovers: "linear-gradient", "backdrop-filter", "glass", "gradient-text", "Sparkles", inline style attributes, "pravatar", "unsplash", "Apollo", "MedPlus", "Netmeds", "Boston", "555", "FDA", "SYNCTIUM", "demo content", "Sample reviews", ".example", "12,000".
2. Fonts: confirm only Newsreader, Geist and Geist Mono load.
3. Colour: list every colour value used outside the tokens.
4. Radius: list every radius value used other than 8px, 14px and fully round.
5. Headings: one h1 per route, no coloured words in headings.
6. Buttons: list any button that is not one of the three variants.
7. Links: crawl every internal link and list any that 404 or point to "#".
8. Every TODO(owner) in the code, as one consolidated list for the client.
9. Lighthouse scores for performance, accessibility, best practices and SEO on /, /store, /shop and one product page, on mobile settings.

End with the ten most visible remaining issues, most important first.
```

---

## Suggested order and effort

| Order | Prompts | Outcome |
|---|---|---|
| 1 | 00, 01, 02 | One design system; the AI decoration is gone |
| 2 | 03 | Nothing on the site is invented |
| 3 | 04, 05, 06 | One header, one footer, a readable logo |
| 4 | 07, 10 to 15 | The landing page is rebuilt |
| 5 | 16 to 19 | Company pages |
| 6 | 20 to 31 | Store |
| 7 | 08, 09, 32, 33 | Accessibility, metadata, mobile, final review |

Prompts 03, 17, 18 and 26 produce lists of questions for the client. Send those to the client early, since their answers decide which optional sections appear.
