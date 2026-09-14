# SiteREF-webdesign-template_CLAUDE.md — Frontend Website Rules (Template Client)

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Read every file in `business_docs/`** before writing any content (not just design). These contain the verified facts, structure, and FAQ for this client — treat them as the single source of truth.

## Reference Images
- If a reference image is provided in `/reference/`: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.
- Any reference image provided is a **style inspiration only** unless explicitly stated otherwise — colors, mood, decorative motifs. It is NOT a layout to clone unless the business is genuinely similar in structure (same number of services, same audience type). Always adapt structure to this client's actual content, not the reference's section count or order.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Git Workflow
- **Never `git commit` or `git push` without explicit user approval.** After making a change, serve it on localhost (and screenshot if relevant) so the user can review it themselves. Wait for them to explicitly say to commit/push — do not treat a "looks good" in passing conversation as approval to push.

## Screenshot Workflow
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- Before first use, verify where Puppeteer and its Chrome cache are installed on this machine (paths vary by user/OS) — do not assume a hardcoded path.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT` — only when a real image isn't available in `/images/`
- Mobile-first responsive
- **Never use em dashes (—) in site copy, titles, or meta descriptions — use a comma instead.** Em dashes read as AI-generated. Applies to visible text, `<title>`/meta tags, and JSON-LD content that mirrors visible text.

## Brand Assets
- Always check the `/images/` folder before designing. It contains real photos to use for this project.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.
- If no logo or color palette has been provided, design a custom palette appropriate to the business's tone and audience (avoid default Tailwind blue/indigo) — treat it as a first draft pending client approval, and say so explicitly in your summary.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not grounded in `business_docs/`
- Do not "improve" a reference design's layout — match its mood only, per the Reference Images rule above
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Content Integrity (critical, do not skip)
This project's verified facts live in `business_docs/`. When in doubt, those files are the source of truth — never guess, infer, or improvise a fact not present there.

- **Never invent testimonials, reviews, star ratings, or student/client counts.** If no real review data has been provided, omit the reviews section entirely or use a clearly neutral placeholder (e.g. "Avis à venir") — never a fabricated quote or name.
- **Never invent a list of nearby towns/communes/service areas** unless a confirmed list is present in `business_docs/`. If unconfirmed, use a safe general phrasing (e.g. "[Ville] et ses environs") rather than guessing specific towns.
- **Never state a legal, tax, or financial benefit** (crédit d'impôt, CESU, subventions, etc.) unless explicitly confirmed in `business_docs/`.
- **Never display a private address** if `business_docs/` indicates the business operates as a service-area business or the address is marked private. Use the city/zone only.
- **Any biographical or credential claim** (past employers, certifications, years of experience) must come verbatim or near-verbatim from `business_docs/`. If a claim's public visibility is marked as "pending approval" in the source docs, include it in this draft but flag it explicitly in your summary as needing client sign-off before going live.
- **No content type the client has said they're uncomfortable with** (e.g. video, photos of real customers/children without consent) should be designed into the site, even as a placeholder implying it exists.
- If any other fact is needed and not covered in `business_docs/`, stop and ask rather than inventing a plausible-sounding answer.

## Google Business Profile Embed
- If a `/gmb/` folder is present, it contains the client's GMB embed code (a Google Maps iframe snippet).
- Embed this iframe in the "Contact" or "Zone d'intervention" section of the homepage (whichever fits the site structure), styled to match the surrounding section (rounded corners, shadow consistent with the rest of the design system).
- Do not modify the `src` URL inside the iframe — use it exactly as provided.
- If no `/gmb/` folder or embed code is present, skip this — do not invent a placeholder map.

## Footer Requirements (every project, no exceptions)
Every page must include this in the footer, using relative paths (not `localhost` — must work identically in local dev and in production):
```html
<a href="/mentions-legales.html">Mentions légales</a>
<a href="/politique-confidentialite.html">Politique de confidentialité</a>
<a href="https://sitereferencement.com/">Site créé par sitereferencement.com</a>
```
- **Create both `mentions-legales.html` and `politique-confidentialite.html` as real pages** (not dead links) using the business's actual legal info from `business_docs/` (SIRET, business name, hosting provider, etc.). If any required legal field is missing from `business_docs/`, flag it in your summary rather than inventing a SIRET or legal name.
- The `sitereferencement.com` credit link should always point externally and never be a relative path.

## Schema Markup
Implement as a single `@graph` JSON-LD block in the `<head>`, adapted to the business type found in `business_docs/`:
- `LocalBusiness` (or a more specific subtype like `EducationalOrganization`, `HomeAndConstructionBusiness`, etc. as appropriate) — identity, service area, contact
- `Person` — for solo-practitioner businesses where the owner's credentials are a differentiator
- `Service`/`Course`/`Product` — one entity per offering, as appropriate to the business
- `FAQPage` — if FAQ content exists in `business_docs/`
- `WebSite` — global site identity
- `Review`/`AggregateRating` — only if real review data exists in `business_docs/`. Never include this schema type with placeholder or estimated data.

## Technical Foundations
- Content (services, FAQ, key info) must be present in the served HTML, not injected only via client-side JS after load.
- Mobile-first — most local searches happen on mobile.
- Any pricing table must be a real HTML `<table>`, not an image.

## Sitemap & robots.txt (every project, no exceptions)

`sitemap.xml` and `robots.txt` ship with every site, and the sitemap is
**generated from the actual pages, never hand-written** — a manual list silently
goes stale the first time a page is added.

- For a multi-page static build, add a small Node script to the build that walks
  the output directory for `.html` files and writes `sitemap.xml`. Never a
  hardcoded URL list.
- For a genuine single-page site, a minimal static `sitemap.xml` listing the
  homepage plus the legal pages is acceptable — but the moment a second content
  page or a blog exists, switch to generation.
- **Single domain source.** The domain in every `<loc>` comes from one constant,
  the same one feeding canonical tags and Open Graph URLs. Never a second
  hardcoded domain string. Never a `.vercel.app` or `localhost` URL.
- **www consistency.** Check the live site's actual redirect — don't infer it from
  the domain name. The sitemap host must match the canonical host exactly.
- **Priorities:** homepage `1.0`, service pages `0.8-0.9`, contact `0.7`,
  blog/case studies `0.6`, legal pages `0.2`.
- **`robots.txt` must include a `Sitemap:` line** pointing at the live absolute
  URL, on the same host as everything else, and must not block AI crawlers
  (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) unless the client
  has asked otherwise.
- **Verify before launch:** the sitemap's URL count matches the number of real
  pages, and every entry returns 200 on the live domain.