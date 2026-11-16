@AGENTS.md

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
