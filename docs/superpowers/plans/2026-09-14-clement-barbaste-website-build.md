# Site Clément Barbaste (MTC Lodève) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Before Task 1, and before writing any HTML in any task:** invoke the `frontend-design` skill (required every session by this project's CLAUDE.md). It governs craft decisions (exact spacing, hover polish, composition judgment) that this plan intentionally does not micromanage — this plan fixes facts, tokens, and structure; frontend-design governs taste.

**Goal:** Build the 3-page static marketing site for Clément Barbaste's Médecine Traditionnelle Chinoise practice in Lodève, plus its two legal pages, sitemap and robots.txt — content-accurate, on-brand with the logo's zen/organic mood, and passing the project's screenshot QA workflow.

**Architecture:** Five self-contained static HTML files (Tailwind CDN, no build step, no shared CSS/JS file), a Node sitemap generator, and a static robots.txt. Every page repeats the same `<head>` boilerplate, header, footer, mobile nav, and sticky CTA bar defined once in Task 1 — later tasks copy it byte-for-byte from `index.html` and only change what's explicitly called out (title/meta/canonical/JSON-LD `url`, active nav state).

**Tech Stack:** Plain HTML5, Tailwind CSS via CDN (`cdn.tailwindcss.com`), Google Fonts (Fraunces + Manrope), vanilla JS (inline, no framework), Node.js (`serve.mjs`, `screenshot.mjs`, `generate-sitemap.mjs` — first two already exist in the repo).

**Spec:** `docs/superpowers/specs/2026-09-14-clement-barbaste-website-design.md`

## Global Constraints

- **Content source of truth:** `business_docs/Questionnaire_Clement_Barbaste_MTC.docx.md` is the only source of facts/copy. Every fact used below is already extracted from it — do not add anything beyond what's written in this plan or that source file.
- **No FAQ section, no Avis Google/AggregateRating schema, no social links, no opening hours** anywhere on the site — none of that data exists yet (per spec §2). Omit cleanly; do not show "coming soon" placeholders to visitors.
- **Regulatory phrasing:** always say "stimulation des points d'acupuncture", never "acupuncture" alone.
- **Never use em dashes (—) in visible copy, titles, or meta descriptions** — use a comma instead. (The em dashes in this plan document itself are fine; they must not end up in the shipped HTML text.)
- **Domain constant:** `https://clement-barbaste-mtc.fr` — used identically in every canonical tag, OG tag, JSON-LD `url`, and in `generate-sitemap.mjs`. Never a second hardcoded domain, never `.vercel.app` or `localhost`.
- **Real photos only, no placeholders** where a real photo exists (mapping in Task 1). Images live at `images/<slug>.png` (already renamed to web-safe slugs).
- **Footer legal links** use relative paths (`/mentions-legales.html`, `/politique-confidentialite.html`); the `sitereferencement.com` credit link is always absolute/external.
- **Animations:** only `transform`/`opacity`, spring-style easing, never `transition-all`. Respect `prefers-reduced-motion`.
- **Every clickable element** needs hover, focus-visible, and active states.
- **Screenshot QA (per project CLAUDE.md):** for every task that produces or changes visible markup, start `node serve.mjs` if not already running (port 3001), capture with `node screenshot.mjs http://localhost:3001/<page> <label>` (desktop, default 1440×900) **and** a mobile capture using `SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/<page> <label>-mobile` (Task 1 adds this env-var support to `screenshot.mjs`, default behaviour unchanged). Read both PNGs with the Read tool, compare against the design tokens/spec, fix, re-screenshot. Minimum 2 rounds per page before marking a task done.
- **Git:** commit at the end of each task with a description of what was built. Do not push without the user's explicit go-ahead (per this project's Git Workflow rule) — stop after committing and say so.

---

### Task 1: Shared shell, design tokens, screenshot tooling, and Accueil hero

**Files:**
- Create: `index.html` (head boilerplate, header, mobile nav, sticky CTA, footer, hero section only — rest of Accueil comes in Task 2)
- Modify: `screenshot.mjs` (add optional `SCREENSHOT_WIDTH`/`SCREENSHOT_HEIGHT` env vars)

**Interfaces:**
- Produces (consumed verbatim by every later task): the exact `<head>` boilerplate below (Tailwind config, Google Fonts links, custom `<style>` block), the exact header/mobile-nav/sticky-CTA/footer markup below, and these reusable class names: `.shadow-soft`, `.shadow-floating`, `.photo-frame`, `.btn-primary`, `.reveal`/`.reveal.in`, plus Tailwind color tokens `pine-{50,100,300,500,600,700,800,900}`, `walnut-{50,100,300,500,600,700,800}`, `ecru` (+`ecru-100`,`ecru-200`), `ink` (+`ink-700`), and font families `font-display` (Fraunces) / default sans (Manrope).
- Produces: the JSON-LD `@graph` template (MedicalBusiness + WebSite) — later tasks reuse it unchanged except `canonical`/`og:url`/JSON-LD `url` fields matching that page.

- [ ] **Step 1: Add mobile-viewport support to `screenshot.mjs`**

In `screenshot.mjs`, replace:

```js
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
```

with:

```js
const width = Number(process.env.SCREENSHOT_WIDTH) || 1440;
const height = Number(process.env.SCREENSHOT_HEIGHT) || 900;
await page.setViewport({ width, height, deviceScaleFactor: 1 });
```

- [ ] **Step 2: Write `index.html` with the shared shell + hero**

Use this exact `<head>` (fill `[[TITLE]]`, `[[DESC]]`, `[[CANONICAL]]` as shown for the Accueil page):

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Médecine Traditionnelle Chinoise à Lodève | Clément Barbaste</title>
<meta name="description" content="Cabinet de Médecine Traditionnelle Chinoise à Lodève. Soulagement des douleurs chroniques, du stress et des troubles du sommeil par la méthode d'équilibre du Dr Tan. Prenez rendez-vous en ligne.">
<link rel="canonical" href="https://clement-barbaste-mtc.fr/">
<meta property="og:title" content="Médecine Traditionnelle Chinoise à Lodève | Clément Barbaste">
<meta property="og:description" content="Cabinet de Médecine Traditionnelle Chinoise à Lodève. Soulagement des douleurs chroniques, du stress et des troubles du sommeil par la méthode d'équilibre du Dr Tan.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://clement-barbaste-mtc.fr/">
<meta property="og:image" content="https://clement-barbaste-mtc.fr/images/portrait-clement.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          pine: { 50:'#EEF3EF',100:'#D8E4DA',300:'#89AD92',500:'#4C7159',600:'#3A5C46',700:'#2F4B3C',800:'#243A2E',900:'#1A2B22' },
          walnut: { 50:'#F7EFE7',100:'#EBD9C6',300:'#C99C6E',500:'#A06A3C',600:'#8B5A34',700:'#6B4226',800:'#4F3019' },
          ecru: { DEFAULT:'#FAF6EF', 100:'#F3EEE3', 200:'#E4DCC9' },
          ink: { DEFAULT:'#211D17', 700:'#3A342A' }
        },
        fontFamily: {
          display: ['Fraunces','ui-serif','Georgia','serif'],
          sans: ['Manrope','ui-sans-serif','system-ui','sans-serif']
        }
      }
    }
  }
</script>
<style>
  :root { color-scheme: light; }
  body { background:#FAF6EF; color:#211D17; }
  h1,h2,h3,.font-display { letter-spacing:-0.02em; }
  .shadow-soft { box-shadow: 0 1px 2px rgba(33,29,23,.05), 0 10px 30px -8px rgba(47,75,60,.18), 0 4px 10px -4px rgba(139,90,52,.12); }
  .shadow-floating { box-shadow: 0 2px 4px rgba(33,29,23,.06), 0 20px 45px -12px rgba(47,75,60,.25), 0 8px 16px -6px rgba(139,90,52,.15); }
  .photo-frame { position:relative; overflow:hidden; }
  .photo-frame img { display:block; width:100%; height:100%; object-fit:cover; }
  .photo-frame::after { content:""; position:absolute; inset:0; background:
      linear-gradient(to top, rgba(26,43,34,.55), rgba(26,43,34,0) 55%),
      linear-gradient(155deg, rgba(47,75,60,.35), rgba(139,90,52,.25));
      mix-blend-mode: multiply; pointer-events:none; }
  .btn-primary { transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease, background-color .2s ease; }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:focus-visible { outline: 3px solid #89AD92; outline-offset: 2px; }
  .reveal { opacity:0; transform: translateY(16px); transition: opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1); }
  .reveal.in { opacity:1; transform:none; }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity:1; transform:none; transition:none; }
    .btn-primary { transition:none; }
  }
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "@id": "https://clement-barbaste-mtc.fr/#business",
      "name": "Clément Barbaste, Médecine Traditionnelle Chinoise",
      "image": "https://clement-barbaste-mtc.fr/images/portrait-clement.png",
      "url": "https://clement-barbaste-mtc.fr/",
      "telephone": "+33675155627",
      "email": "clementbarbaste.mtc@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "9 place Alsace Lorraine",
        "postalCode": "34700",
        "addressLocality": "Lodève",
        "addressCountry": "FR"
      },
      "areaServed": "Lodève et environs",
      "priceRange": "25€-55€",
      "makesOffer": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "1ère séance MTC (bilan énergétique)" }, "price": "55", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Séance de suivi" }, "price": "45", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Massage Amma sur chaise" }, "price": "25", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Massage Tuina" }, "price": "50", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Massage Foot Thaï" }, "price": "50", "priceCurrency": "EUR" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://clement-barbaste-mtc.fr/#website",
      "url": "https://clement-barbaste-mtc.fr/",
      "name": "Clément Barbaste, Médecine Traditionnelle Chinoise",
      "publisher": { "@id": "https://clement-barbaste-mtc.fr/#business" }
    }
  ]
}
</script>
</head>
```

Body shell — header, mobile nav, sticky CTA (use exactly, `index.html` nav link gets `aria-current="page"` and a `text-pine-700 font-semibold` treatment; other pages give that treatment to their own link instead):

```html
<body class="font-sans text-ink bg-ecru pb-24 md:pb-0">
<header class="sticky top-0 z-50 bg-ecru/90 backdrop-blur border-b border-ecru-200">
  <div class="mx-auto max-w-6xl px-5 md:px-8 flex items-center justify-between h-20">
    <a href="index.html" class="flex items-center gap-3">
      <img src="images/logo-clement.png" alt="Clément Barbaste, Médecine Traditionnelle Chinoise" class="h-12 w-12 object-contain">
      <span class="leading-tight">
        <span class="block font-display text-lg text-pine-800">Clément Barbaste</span>
        <span class="block text-xs text-walnut-700 tracking-wide">Médecine Traditionnelle Chinoise</span>
      </span>
    </a>
    <nav class="hidden md:flex items-center gap-8">
      <a href="index.html" aria-current="page" class="text-pine-700 font-semibold">Accueil</a>
      <a href="soins-tarifs.html" class="hover:text-pine-700 transition-colors">Soins &amp; Tarifs</a>
      <a href="contact.html" class="hover:text-pine-700 transition-colors">Contact</a>
      <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center rounded-full bg-pine-700 text-ecru px-5 py-2.5 shadow-soft hover:bg-pine-600 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Prendre rendez-vous</a>
    </nav>
    <button id="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" class="md:hidden p-2 rounded-lg hover:bg-ecru-200 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">
      <svg id="nav-icon-open" class="h-6 w-6 text-pine-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
      <svg id="nav-icon-close" class="hidden h-6 w-6 text-pine-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  <nav id="nav-mobile" class="hidden flex-col gap-1 px-5 pb-5 bg-ecru border-t border-ecru-200">
    <a href="index.html" class="block py-3 text-pine-700 font-semibold">Accueil</a>
    <a href="soins-tarifs.html" class="block py-3">Soins &amp; Tarifs</a>
    <a href="contact.html" class="block py-3">Contact</a>
    <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary block text-center rounded-full bg-pine-700 text-ecru px-5 py-3 mt-2 shadow-soft">Prendre rendez-vous</a>
  </nav>
</header>

<!-- page content goes here -->

<footer class="bg-pine-800 text-ecru-100">
  <div class="mx-auto max-w-6xl px-5 md:px-8 py-12 grid gap-8 md:grid-cols-3">
    <div>
      <p class="font-display text-lg text-ecru">Clément Barbaste</p>
      <p class="text-sm text-ecru-200 mt-1">Médecine Traditionnelle Chinoise, Lodève</p>
      <p class="text-sm text-ecru-200 mt-4">9 place Alsace Lorraine, 34700 Lodève</p>
      <p class="text-sm text-ecru-200"><a href="tel:+33675155627" class="hover:text-ecru transition-colors">06 75 15 56 27</a></p>
      <p class="text-sm text-ecru-200"><a href="mailto:clementbarbaste.mtc@gmail.com" class="hover:text-ecru transition-colors">clementbarbaste.mtc@gmail.com</a></p>
    </div>
    <div>
      <p class="font-sans font-semibold text-ecru mb-2">Navigation</p>
      <ul class="space-y-1 text-sm text-ecru-200">
        <li><a href="index.html" class="hover:text-ecru transition-colors">Accueil</a></li>
        <li><a href="soins-tarifs.html" class="hover:text-ecru transition-colors">Soins &amp; Tarifs</a></li>
        <li><a href="contact.html" class="hover:text-ecru transition-colors">Contact</a></li>
      </ul>
    </div>
    <div>
      <p class="font-sans font-semibold text-ecru mb-2">Informations légales</p>
      <ul class="space-y-1 text-sm text-ecru-200">
        <li><a href="/mentions-legales.html" class="hover:text-ecru transition-colors">Mentions légales</a></li>
        <li><a href="/politique-confidentialite.html" class="hover:text-ecru transition-colors">Politique de confidentialité</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-pine-700/60 py-5 text-center text-xs text-ecru-200">
    <a href="https://sitereferencement.com/" class="hover:text-ecru transition-colors">Site créé par sitereferencement.com</a>
  </div>
</footer>

<div class="fixed inset-x-0 bottom-0 z-40 md:hidden bg-ecru/95 backdrop-blur border-t border-ecru-200 p-3 shadow-floating">
  <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary block text-center rounded-full bg-pine-700 text-ecru px-5 py-3 font-sans font-semibold shadow-soft">Prendre rendez-vous</a>
</div>

<script>
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const iconOpen = document.getElementById('nav-icon-open');
  const iconClose = document.getElementById('nav-icon-close');
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.contains('flex');
    navMobile.classList.toggle('hidden', isOpen);
    navMobile.classList.toggle('flex', !isOpen);
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });
</script>
</body>
</html>
```

Hero section (goes in the `<!-- page content goes here -->` slot for `index.html` only), built from the client's own verbatim lines (questionnaire lines 15-19, 23-35):

```html
<section class="relative overflow-hidden">
  <div class="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
    <div class="reveal">
      <h1 class="font-display text-4xl md:text-5xl text-pine-800 leading-tight">Retrouvez l'équilibre, à l'écoute de ce que vous traversez</h1>
      <p class="mt-6 text-lg text-ink-700 leading-relaxed">« Chaque personne est unique, et on oublie souvent qu'elle est la mieux placée pour parler de ce qui se passe en elle. Chaque mot, chaque expression compte. » Cabinet de Médecine Traditionnelle Chinoise à Lodève, spécialisé dans le soulagement des douleurs chroniques ou persistantes (fibromyalgie, endométriose, migraines, douleurs articulaires et digestives), du stress, de l'anxiété et des troubles du sommeil.</p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center rounded-full bg-pine-700 text-ecru px-6 py-3 font-semibold shadow-soft hover:bg-pine-600 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Prendre rendez-vous</a>
        <a href="soins-tarifs.html" class="btn-primary inline-flex items-center rounded-full border border-pine-700 text-pine-700 px-6 py-3 font-semibold hover:bg-pine-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Découvrir mes soins</a>
      </div>
    </div>
    <div class="photo-frame reveal rounded-3xl shadow-floating aspect-[4/5] md:aspect-square">
      <img src="images/clement-en-soin.png" alt="Clément Barbaste en séance de soin" loading="eager">
    </div>
  </div>
</section>
```

- [ ] **Step 3: Serve and screenshot (desktop + mobile)**

Start the server in the background if not already running:

```bash
node serve.mjs
```

Then:

```bash
node screenshot.mjs http://localhost:3001/index.html hero-desktop
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/index.html hero-mobile
```

Read both PNGs from `temporary screenshots/`. Check: header stays sticky and legible, hero image gets the green/brown gradient tint from `.photo-frame::after`, mobile hamburger opens/closes the mobile nav, sticky CTA bar appears only below `md`, no default Tailwind blue/indigo anywhere, no `shadow-md` anywhere. Fix any mismatch, re-screenshot. Minimum 2 rounds.

- [ ] **Step 4: Commit**

```bash
git add index.html screenshot.mjs
git commit -m "feat: add shared site shell, design tokens, and Accueil hero"
```

Stop after committing — do not push without asking.

---

### Task 2: Complete Accueil (`index.html`)

**Files:**
- Modify: `index.html` (insert remaining sections between hero and footer)

**Interfaces:**
- Consumes: shell/tokens from Task 1 (`.shadow-soft`, `.photo-frame`, `.reveal`, `pine-*`/`walnut-*`/`ecru-*` tokens, `btn-primary`).
- Produces: anchor ids `#qui-suis-je`, `#ma-methode`, `#pourquoi-consulter` used by Task 3's internal link back to Accueil.

- [ ] **Step 1: "Qui suis-je" section**

Verbatim/near-verbatim from questionnaire lines 88-116:

```html
<section id="qui-suis-je" class="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-start">
  <div class="photo-frame reveal rounded-3xl shadow-soft aspect-[4/5] order-2 md:order-1">
    <img src="images/portrait-clement.png" alt="Portrait de Clément Barbaste" loading="lazy">
  </div>
  <div class="reveal order-1 md:order-2">
    <h2 class="font-display text-3xl text-pine-800">Qui suis-je</h2>
    <p class="mt-6 text-ink-700 leading-relaxed">Depuis l'enfance, j'ai toujours eu cette sensibilité qui m'appelait à aider, écouter, soulager mon prochain. Les livres, l'histoire et la philosophie chinoise, la théorie du yin et du yang, des cinq éléments, m'ont toujours attiré : elles proposent un autre regard sur la manière dont nous abordons le monde et la santé. Corps, esprit et état émotionnel sont pour moi les faces d'une même pièce, et la santé dépend de l'harmonie entre les deux.</p>
    <p class="mt-4 text-ink-700 leading-relaxed">Après plusieurs expériences professionnelles et personnelles, le chemin vers la Médecine Traditionnelle Chinoise s'est imposé naturellement : une pratique millénaire qui, par la diversité de ses outils, propose aujourd'hui encore une alternative intéressante et un complément certain au bien-être de chacun.</p>
    <p class="mt-4 text-ink-700 leading-relaxed">Je me forme à la méthode d'équilibre du docteur Tan auprès de « Si Yuan ». Ma pratique se distingue par une place importante donnée au massage (Tuina, Amma, Foot Thaï) : le soin par le toucher est central pour moi, et je combine souvent les deux approches. Je souhaite particulièrement accentuer ma pratique sur les douleurs chroniques (fibromyalgie, endométriose) ainsi que développer une offre de bien-être au travail.</p>
    <h3 class="mt-8 font-display text-xl text-pine-800">Formation</h3>
    <ul class="mt-3 space-y-2 text-ink-700">
      <li class="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-walnut-600">Diplôme de thérapeute en Médecine Chinoise (cursus de 5 ans), école Ming Tao de Montpellier, obtenu en juin 2025</li>
      <li class="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-walnut-600">Formation Acupuncture 1-2-3, méthode d'équilibre du docteur Tan (octobre 2023, avec Aimee Centivany)</li>
      <li class="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-walnut-600">Formation massage Amma assis (novembre 2022, avec Temana)</li>
      <li class="pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-walnut-600">Formation massage Foot Thaï (juillet 2022, avec Temana)</li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: "Ma méthode" section (with the real 3-phase `<table>`)**

From questionnaire lines 127-155:

```html
<section id="ma-methode" class="bg-ecru-100">
  <div class="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-start">
    <div class="reveal">
      <h2 class="font-display text-3xl text-pine-800">Ma méthode</h2>
      <p class="mt-6 text-ink-700 leading-relaxed">C'est une méthode basée sur l'écoute, l'observation et la palpation. Le but est d'avoir un résultat rapide en trouvant un protocole adapté à la personne, puis de pérenniser les résultats. J'utilise des points de stimulation situés à distance de la douleur ou de la gêne, ce qui permet de mobiliser la zone concernée et de voir en temps réel une amélioration.</p>
      <p class="mt-4 text-ink-700 leading-relaxed">Je m'appuie essentiellement sur le protocole du docteur Tan, que ce soit pour les douleurs ou pour les problèmes internes, et j'affine mon diagnostic par la palpation des méridiens, en m'inspirant du Dr Wang Ju-Yi.</p>
      <div class="mt-8 overflow-x-auto rounded-2xl shadow-soft bg-white">
        <table class="w-full text-left text-sm">
          <thead class="bg-pine-700 text-ecru">
            <tr>
              <th class="px-4 py-3 font-semibold">Phase</th>
              <th class="px-4 py-3 font-semibold">Fréquence</th>
              <th class="px-4 py-3 font-semibold">Durée</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ecru-200">
            <tr>
              <td class="px-4 py-3 font-semibold text-pine-800">Intensive</td>
              <td class="px-4 py-3 text-ink-700">2 à 3 séances par semaine</td>
              <td class="px-4 py-3 text-ink-700">1 à 4 semaines selon la pathologie et l'ancienneté du problème</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-pine-800">Stabilisation</td>
              <td class="px-4 py-3 text-ink-700">1 séance par semaine</td>
              <td class="px-4 py-3 text-ink-700">Selon les résultats</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-pine-800">Maintien (si besoin)</td>
              <td class="px-4 py-3 text-ink-700">1 séance par mois à 1 par trimestre</td>
              <td class="px-4 py-3 text-ink-700">Selon les résultats</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="photo-frame reveal rounded-3xl shadow-soft aspect-[4/5]">
      <img src="images/prise-pouls-diagnostic.png" alt="Prise des pouls et observation de la langue, étape de diagnostic" loading="lazy">
    </div>
  </div>
</section>
```

- [ ] **Step 3: "Pourquoi consulter" accordion (8 categories, verbatim from structure doc)**

```html
<section id="pourquoi-consulter" class="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
  <h2 class="font-display text-3xl text-pine-800 text-center reveal">Pourquoi consulter</h2>
  <div class="mt-10 max-w-3xl mx-auto space-y-3" id="accordion">
    <!-- repeat this block for each of the 8 items, changing data-index, the title, and the description -->
    <div class="reveal rounded-2xl bg-white shadow-soft overflow-hidden">
      <button class="accordion-trigger w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg text-pine-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300" aria-expanded="false" data-index="0">
        <span>Douleurs et tensions</span>
        <svg class="accordion-icon h-5 w-5 shrink-0 text-walnut-600 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div class="accordion-panel hidden px-6 pb-5 text-ink-700">Dos, cervicales, épaules, articulations, douleurs musculaires ou persistantes.</div>
    </div>
  </div>
</section>
```

The 8 items, in this exact order (title, description):
1. Douleurs et tensions, Dos, cervicales, épaules, articulations, douleurs musculaires ou persistantes.
2. Mobilité et confort corporel, Raideurs, sensations de blocage ou diminution de la mobilité.
3. Stress et équilibre émotionnel, Tensions, nervosité, surcharge mentale ou difficulté à relâcher.
4. Fatigue et vitalité, Baisse d'énergie, fatigue passagère ou besoin de retrouver plus de dynamisme.
5. Sommeil et récupération, Difficultés d'endormissement, sommeil perturbé ou récupération insuffisante.
6. Digestion et confort intestinal, Ballonnements, digestion difficile et inconfort digestif.
7. Équilibre féminin, Inconforts liés au cycle, règles douloureuses, syndrome prémenstruel ou endométriose.
8. Douleurs chroniques, Fibromyalgie et autres douleurs persistantes, dans une démarche d'accompagnement complémentaire.

Add this script right before `</body>` (after the nav-toggle script from Task 1):

```html
<script>
  document.querySelectorAll('.accordion-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.classList.toggle('hidden', isOpen);
      btn.querySelector('.accordion-icon').style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  });
</script>
```

- [ ] **Step 4: CTA final section**

```html
<section class="bg-pine-700">
  <div class="mx-auto max-w-3xl px-5 md:px-8 py-16 text-center reveal">
    <h2 class="font-display text-3xl text-ecru">Chaque cas est une énigme possible à résoudre</h2>
    <p class="mt-4 text-ecru-100">Prenez rendez-vous pour un bilan énergétique et un accompagnement adapté à votre situation.</p>
    <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary mt-8 inline-flex items-center rounded-full bg-ecru text-pine-800 px-6 py-3 font-semibold shadow-soft hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-ecru">Prendre rendez-vous</a>
  </div>
</section>
```

- [ ] **Step 5: Add a small IntersectionObserver for `.reveal` (once, in `index.html` only — copy verbatim into every other page's own `<script>` block in later tasks)**

```html
<script>
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
</script>
```

- [ ] **Step 6: Serve, screenshot desktop + mobile, compare, fix, re-screenshot (2 rounds minimum)**

```bash
node screenshot.mjs http://localhost:3001/index.html full-desktop
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/index.html full-mobile
```

Check specifically: accordion opens/closes with rotating chevron, table is a real `<table>` (not divs), reveal animations fire on scroll, all 8 accordion items present in the exact order/wording above, no invented facts beyond this plan and the questionnaire.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat: complete Accueil page (qui suis-je, methode, pourquoi consulter, cta)"
```

Stop after committing — do not push without asking.

---

### Task 3: Soins & Tarifs (`soins-tarifs.html`)

**Files:**
- Create: `soins-tarifs.html`

**Interfaces:**
- Consumes: exact shell from Task 1 (copy `<head>` structure but change title/meta/canonical/OG/JSON-LD `url` as shown below; copy header/footer/sticky-CTA/mobile-nav-script verbatim, moving the `aria-current="page"`/`text-pine-700 font-semibold` treatment to the "Soins & Tarifs" link instead of "Accueil"), `.shadow-soft`, `.photo-frame`, `.reveal` + IntersectionObserver script from Task 2 Step 5.
- Produces: internal link target for Task 2 (already satisfied, since Task 2 links to `soins-tarifs.html` directly, not an anchor).

- [ ] **Step 1: Head — change these values only from Task 1's template**

```html
<title>Prestations et Tarifs, Acupuncture, Massage Tuina, Amma | Lodève</title>
<meta name="description" content="Découvrez les prestations et tarifs du cabinet, consultations MTC, massage Tuina, massage Amma assis, massage Foot Thaï. Cabinet à Lodève, réservation en ligne.">
<link rel="canonical" href="https://clement-barbaste-mtc.fr/soins-tarifs.html">
<meta property="og:title" content="Prestations et Tarifs, Acupuncture, Massage Tuina, Amma | Lodève">
<meta property="og:description" content="Découvrez les prestations et tarifs du cabinet, consultations MTC, massage Tuina, massage Amma assis, massage Foot Thaï. Cabinet à Lodève, réservation en ligne.">
<meta property="og:url" content="https://clement-barbaste-mtc.fr/soins-tarifs.html">
```

JSON-LD `@graph`: identical to Task 1's, only `"url": "https://clement-barbaste-mtc.fr/"` inside `MedicalBusiness`/`WebSite` stays as the canonical business URL (it's the business's URL, not the page's — leave unchanged).

- [ ] **Step 2: Page intro + service cards with real photos (questionnaire lines 163-181, 91-98 for prices)**

```html
<section class="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-20">
  <h1 class="font-display text-4xl text-pine-800 text-center reveal">Soins &amp; Tarifs</h1>
  <p class="mt-4 max-w-2xl mx-auto text-center text-ink-700 reveal">Consultations de Médecine Traditionnelle Chinoise et massages, à Lodève.</p>

  <div class="mt-14 grid md:grid-cols-2 gap-8">
    <article class="reveal rounded-3xl bg-white shadow-soft overflow-hidden">
      <div class="photo-frame aspect-[16/10]"><img src="images/seance-aiguilles.png" alt="Séance de stimulation des points d'acupuncture" loading="lazy"></div>
      <div class="p-6">
        <h2 class="font-display text-xl text-pine-800">1ère séance MTC (bilan énergétique)</h2>
        <p class="mt-2 text-sm text-walnut-700 font-semibold">1h15 — 55€</p>
        <p class="mt-3 text-ink-700 leading-relaxed">Rencontre avec le patient, discussion sur le motif de consultation, questions diverses sur son quotidien et ses antécédents. Prise des pouls et observation de la langue. Diagnostic et proposition de traitement adapté au besoin.</p>
      </div>
    </article>

    <article class="reveal rounded-3xl bg-white shadow-soft overflow-hidden">
      <div class="photo-frame aspect-[16/10]"><img src="images/mains-praticien.png" alt="Mains du praticien en action" loading="lazy"></div>
      <div class="p-6">
        <h2 class="font-display text-xl text-pine-800">Séance de suivi</h2>
        <p class="mt-2 text-sm text-walnut-700 font-semibold">45 min à 1h — 45€</p>
        <p class="mt-3 text-ink-700 leading-relaxed">Continuité du traitement en prenant en compte les résultats de la première séance. Poursuite ou adaptation du traitement.</p>
      </div>
    </article>

    <article class="reveal rounded-3xl bg-white shadow-soft overflow-hidden">
      <div class="photo-frame aspect-[16/10]"><img src="images/massage-amma-chaise.png" alt="Massage Amma sur chaise" loading="lazy"></div>
      <div class="p-6">
        <h2 class="font-display text-xl text-pine-800">Massage Amma sur chaise</h2>
        <p class="mt-2 text-sm text-walnut-700 font-semibold">20 min — 25€</p>
        <p class="mt-3 text-ink-700 leading-relaxed">Technique japonaise de relaxation basée sur des pressions, des mobilisations et des mouvements rythmiques. Favorise la détente musculaire, la diminution des tensions et l'apaisement du stress, tout en procurant une agréable sensation de légèreté et de vitalité.</p>
      </div>
    </article>

    <article class="reveal rounded-3xl bg-white shadow-soft overflow-hidden">
      <div class="photo-frame aspect-[16/10]"><img src="images/massage-tuina.png" alt="Massage Tuina" loading="lazy"></div>
      <div class="p-6">
        <h2 class="font-display text-xl text-pine-800">Massage Tuina</h2>
        <p class="mt-2 text-sm text-walnut-700 font-semibold">45 min — 50€</p>
        <p class="mt-3 text-ink-700 leading-relaxed">Massage traditionnel chinois utilisant pressions, pétrissages et mobilisations pour détendre les tensions, favoriser la circulation et rééquilibrer l'énergie. L'un des piliers de la médecine traditionnelle chinoise, à part entière.</p>
      </div>
    </article>

    <article class="reveal rounded-3xl bg-white shadow-soft overflow-hidden md:col-span-2">
      <div class="photo-frame aspect-[21/9]"><img src="images/massage-foot-thai.png" alt="Massage Foot Thaï" loading="lazy"></div>
      <div class="p-6">
        <h2 class="font-display text-xl text-pine-800">Massage Foot Thaï</h2>
        <p class="mt-2 text-sm text-walnut-700 font-semibold">45 min — 50€</p>
        <p class="mt-3 text-ink-700 leading-relaxed">Technique traditionnelle associant pressions, mobilisations et massage des pieds et des jambes. Favorise la détente profonde, stimule la circulation et aide à relâcher les tensions. Bienfaits : relaxation, sensation de jambes légères, amélioration de la circulation, diminution des tensions musculaires.</p>
      </div>
    </article>
  </div>
</section>
```

- [ ] **Step 3: Pricing table + forfaits (real `<table>`, questionnaire lines 199-211)**

```html
<section class="bg-ecru-100">
  <div class="mx-auto max-w-4xl px-5 md:px-8 py-16">
    <h2 class="font-display text-3xl text-pine-800 text-center reveal">Grille tarifaire</h2>
    <div class="mt-10 overflow-x-auto rounded-2xl shadow-soft bg-white reveal">
      <table class="w-full text-left text-sm">
        <thead class="bg-pine-700 text-ecru">
          <tr><th class="px-4 py-3 font-semibold">Prestation</th><th class="px-4 py-3 font-semibold">Durée</th><th class="px-4 py-3 font-semibold">Tarif</th></tr>
        </thead>
        <tbody class="divide-y divide-ecru-200">
          <tr><td class="px-4 py-3 text-ink-700">1ère séance MTC</td><td class="px-4 py-3 text-ink-700">1h15</td><td class="px-4 py-3 font-semibold text-pine-800">55€</td></tr>
          <tr><td class="px-4 py-3 text-ink-700">Séance de suivi</td><td class="px-4 py-3 text-ink-700">45 min à 1h</td><td class="px-4 py-3 font-semibold text-pine-800">45€</td></tr>
          <tr><td class="px-4 py-3 text-ink-700">Massage sur chaise (Amma)</td><td class="px-4 py-3 text-ink-700">20 min</td><td class="px-4 py-3 font-semibold text-pine-800">25€</td></tr>
          <tr><td class="px-4 py-3 text-ink-700">Massage Tuina</td><td class="px-4 py-3 text-ink-700">45 min</td><td class="px-4 py-3 font-semibold text-pine-800">50€</td></tr>
          <tr><td class="px-4 py-3 text-ink-700">Massage Foot Thaï</td><td class="px-4 py-3 text-ink-700">45 min</td><td class="px-4 py-3 font-semibold text-pine-800">50€</td></tr>
        </tbody>
      </table>
    </div>
    <div class="mt-8 grid sm:grid-cols-2 gap-4 reveal">
      <div class="rounded-2xl bg-white shadow-soft p-5">
        <p class="font-semibold text-pine-800">Forfait 2 séances sur 7 jours</p>
        <p class="text-ink-700 mt-1">80€ (après 1ère séance, obligatoire)</p>
      </div>
      <div class="rounded-2xl bg-white shadow-soft p-5">
        <p class="font-semibold text-pine-800">Forfait 3 séances sur 10 jours</p>
        <p class="text-ink-700 mt-1">100€ (après 1ère séance, obligatoire)</p>
      </div>
    </div>
    <p class="mt-8 text-sm text-ink-700 reveal">Une séance peut être annulée jusqu'à 48h à l'avance. En cas d'urgence indépendante de votre volonté, vous pouvez me contacter directement. Toute absence non justifiée sera facturée.</p>
  </div>
</section>
```

- [ ] **Step 4: Déroulement d'une consultation + disclaimer (questionnaire lines 233-255, verbatim disclaimer)**

```html
<section class="mx-auto max-w-4xl px-5 md:px-8 py-16">
  <h2 class="font-display text-3xl text-pine-800 reveal">Déroulement d'une consultation</h2>
  <div class="mt-8 grid sm:grid-cols-2 gap-6 reveal">
    <div class="rounded-2xl bg-white shadow-soft p-6">
      <p class="font-semibold text-pine-800">1ère séance</p>
      <p class="mt-2 text-ink-700">Environ 1h15. Échange, prise des pouls et observation de la langue, diagnostic, stimulation des points d'acupuncture.</p>
    </div>
    <div class="rounded-2xl bg-white shadow-soft p-6">
      <p class="font-semibold text-pine-800">Séances suivantes</p>
      <p class="mt-2 text-ink-700">Entre 45 et 60 minutes suivant le besoin.</p>
    </div>
  </div>
  <p class="mt-6 text-ink-700 leading-relaxed reveal">Je privilégie le massage ; la moxibustion et les ventouses peuvent également être proposées en complément selon les besoins. Prévoyez une tenue souple permettant un accès facile aux bras et aux jambes jusqu'aux genoux. Un formulaire de première visite vous sera également proposé en téléchargement.</p>
  <div class="mt-6 rounded-2xl border border-walnut-300 bg-walnut-50 p-6 reveal">
    <p class="text-ink-700 leading-relaxed">Je ne suis pas un professionnel de santé. Je ne vous demanderai jamais d'arrêter un traitement en cours : ma pratique est un complément vers un mieux-être, en complément d'un suivi médical si besoin.</p>
  </div>
</section>
```

- [ ] **Step 5: Massage sur chaise dedicated section (questionnaire lines 359-409, verbatim)**

```html
<section class="bg-ecru-100">
  <div class="mx-auto max-w-6xl px-5 md:px-8 py-16 grid md:grid-cols-2 gap-12 items-start">
    <div class="photo-frame reveal rounded-3xl shadow-soft aspect-[4/5]">
      <img src="images/massage-amma-chaise.png" alt="Massage Amma sur chaise, zoom" loading="lazy">
    </div>
    <div class="reveal">
      <h2 class="font-display text-3xl text-pine-800">Le massage sur chaise (Amma)</h2>
      <p class="mt-6 text-ink-700 leading-relaxed">Massage habillé, réalisé sur une chaise ergonomique, sans huile. Il s'appuie sur des pressions, pétrissages, étirements et percussions, principalement sur le haut du corps.</p>
      <p class="mt-4 font-semibold text-pine-800">Zones travaillées</p>
      <p class="mt-1 text-ink-700">Nuque et cervicales, épaules et trapèzes, dos et haut du dos, bras et avant-bras, mains, tête et visage selon la séance.</p>
      <p class="mt-4 font-semibold text-pine-800">Bienfaits</p>
      <p class="mt-1 text-ink-700">Dénoue les tensions musculaires, soulage les raideurs du cou et des épaules, favorise la détente et la récupération, stimule la circulation, réduit les sensations de fatigue et de stress, procure une sensation de légèreté et de bien-être.</p>
      <p class="mt-4 text-ink-700 leading-relaxed">Une séance dure généralement 15 à 30 minutes. Elle peut être réalisée facilement pendant une pause, sans avoir besoin de se déshabiller ni de s'allonger, idéal pour une pause bien-être rapide en cas de tensions liées au travail, aux écrans ou aux postures prolongées.</p>
      <p class="mt-4 text-ink-700 leading-relaxed">Généralement proposé seul, ce massage peut aussi convenir aux patients ayant des difficultés à rester allongés sur une table de massage en raison de leur pathologie. Réservable via Zen Agenda comme les autres prestations.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Internal link back to Accueil + final CTA**

```html
<section class="mx-auto max-w-3xl px-5 md:px-8 py-16 text-center reveal">
  <p class="text-ink-700">Envie d'en savoir plus sur mon parcours et ma méthode ? <a href="index.html#qui-suis-je" class="text-pine-700 font-semibold underline hover:text-pine-600">Découvrez qui je suis</a>.</p>
  <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary mt-8 inline-flex items-center rounded-full bg-pine-700 text-ecru px-6 py-3 font-semibold shadow-soft hover:bg-pine-600 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Prendre rendez-vous</a>
</section>
```

Add the same IntersectionObserver script from Task 2 Step 5 before `</body>`.

- [ ] **Step 7: Serve, screenshot desktop + mobile, compare against Task 1's tokens, fix, re-screenshot (2 rounds minimum)**

```bash
node screenshot.mjs http://localhost:3001/soins-tarifs.html full-desktop
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/soins-tarifs.html full-mobile
```

Check: pricing table is a real `<table>`, disclaimer box is visually distinct but not alarming, every photo matches its real prestation (no swapped images), nav highlights "Soins & Tarifs" not "Accueil".

- [ ] **Step 8: Commit**

```bash
git add soins-tarifs.html
git commit -m "feat: add Soins & Tarifs page"
```

Stop after committing — do not push without asking.

---

### Task 4: Contact (`contact.html`)

**Files:**
- Create: `contact.html`

**Interfaces:**
- Consumes: shell from Task 1 (same rules as Task 3, "Contact" gets the active-nav treatment), GMB iframe from `gmb/iframe src=httpswww.google.commapse.txt` (copy the `src` value character-for-character, never edit it).

- [ ] **Step 1: Head — change these values only from Task 1's template**

```html
<title>Contact et Accès, Cabinet MTC Lodève | Clément Barbaste</title>
<meta name="description" content="Adresse, accès et contact du cabinet de Clément Barbaste, Médecine Traditionnelle Chinoise à Lodève (9 place Alsace Lorraine). Prenez rendez-vous en ligne.">
<link rel="canonical" href="https://clement-barbaste-mtc.fr/contact.html">
<meta property="og:title" content="Contact et Accès, Cabinet MTC Lodève | Clément Barbaste">
<meta property="og:description" content="Adresse, accès et contact du cabinet de Clément Barbaste, Médecine Traditionnelle Chinoise à Lodève (9 place Alsace Lorraine). Prenez rendez-vous en ligne.">
<meta property="og:url" content="https://clement-barbaste-mtc.fr/contact.html">
```

- [ ] **Step 2: Contact info + tap-to-call + form**

Read the real iframe `src` first:

```bash
cat "gmb/iframe src=httpswww.google.commapse.txt"
```

Then build the page (Formspree endpoint is a placeholder — flagged in an HTML comment, and in the delivery summary — until the client creates a Formspree account):

```html
<section class="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12">
  <div class="reveal">
    <h1 class="font-display text-4xl text-pine-800">Contact</h1>
    <p class="mt-4 text-ink-700 leading-relaxed">9 place Alsace Lorraine, 34700 Lodève.</p>
    <p class="mt-2 text-ink-700 leading-relaxed">Parking du parc et de la sous-préfecture à proximité. Le cabinet se trouve au 1er étage, à gauche en haut des escaliers.</p>

    <div class="mt-8 flex flex-col gap-3">
      <a href="tel:+33675155627" class="btn-primary inline-flex items-center justify-center rounded-full bg-pine-700 text-ecru px-6 py-3 font-semibold shadow-soft hover:bg-pine-600 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Appeler le 06 75 15 56 27</a>
      <a href="mailto:clementbarbaste.mtc@gmail.com" class="btn-primary inline-flex items-center justify-center rounded-full border border-pine-700 text-pine-700 px-6 py-3 font-semibold hover:bg-pine-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">clementbarbaste.mtc@gmail.com</a>
      <a href="https://booking.zen-agenda.com/book/clement-barbaste-mtc" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center justify-center rounded-full border border-pine-700 text-pine-700 px-6 py-3 font-semibold hover:bg-pine-50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Prendre rendez-vous en ligne</a>
    </div>

    <!-- TODO SiteREF: remplacer REPLACE_WITH_REAL_ID par l'ID Formspree réel du client avant mise en ligne -->
    <form action="https://formspree.io/f/REPLACE_WITH_REAL_ID" method="POST" class="mt-10 space-y-4">
      <div>
        <label for="name" class="block text-sm font-semibold text-pine-800">Nom</label>
        <input id="name" name="name" type="text" required class="mt-1 w-full rounded-xl border border-ecru-200 bg-white px-4 py-2.5 text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">
      </div>
      <div>
        <label for="email" class="block text-sm font-semibold text-pine-800">Email</label>
        <input id="email" name="email" type="email" required class="mt-1 w-full rounded-xl border border-ecru-200 bg-white px-4 py-2.5 text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">
      </div>
      <div>
        <label for="message" class="block text-sm font-semibold text-pine-800">Message</label>
        <textarea id="message" name="message" rows="4" required class="mt-1 w-full rounded-xl border border-ecru-200 bg-white px-4 py-2.5 text-ink focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300"></textarea>
      </div>
      <button type="submit" class="btn-primary inline-flex items-center rounded-full bg-pine-700 text-ecru px-6 py-3 font-semibold shadow-soft hover:bg-pine-600 focus-visible:outline focus-visible:outline-3 focus-visible:outline-pine-300">Envoyer</button>
    </form>
  </div>

  <div class="reveal space-y-6">
    <div class="photo-frame rounded-3xl shadow-soft aspect-[4/3]">
      <img src="images/exterieur-batiment.png" alt="Façade du cabinet, 9 place Alsace Lorraine" loading="lazy">
    </div>
    <div class="photo-frame rounded-3xl shadow-soft aspect-[4/3]">
      <img src="images/acces-escalier.png" alt="Accès au cabinet, escalier du 1er étage" loading="lazy">
    </div>
    <div class="rounded-3xl shadow-soft overflow-hidden aspect-[4/3]">
      <!-- GMB embed: src copied exactly from gmb/iframe src=httpswww.google.commapse.txt, never modified -->
      <iframe src="PASTE_EXACT_SRC_FROM_GMB_FILE_HERE" class="w-full h-full border-0" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
  </div>
</section>
```

Replace `PASTE_EXACT_SRC_FROM_GMB_FILE_HERE` with the literal `src` value read in this step, character for character.

Add the same IntersectionObserver script from Task 2 Step 5 before `</body>`.

- [ ] **Step 3: Serve, screenshot desktop + mobile, compare, fix, re-screenshot (2 rounds minimum)**

```bash
node screenshot.mjs http://localhost:3001/contact.html full-desktop
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/contact.html full-mobile
```

Check: map loads and renders (verify the iframe `src` was pasted exactly, not paraphrased), form fields have visible focus states, tap-to-call link uses `tel:+33675155627`, both real photos appear correctly oriented and cropped.

- [ ] **Step 4: Commit**

```bash
git add contact.html
git commit -m "feat: add Contact page with GMB embed and Formspree form (placeholder endpoint)"
```

Stop after committing — do not push without asking.

---

### Task 5: Legal pages

**Files:**
- Create: `mentions-legales.html`
- Create: `politique-confidentialite.html`

**Interfaces:**
- Consumes: shell from Task 1 (header/footer/mobile-nav-script; sticky CTA bar can be omitted on these two pages since they're not conversion pages, but keep header/footer identical).

- [ ] **Step 1: `mentions-legales.html`**

```html
<title>Mentions légales | Clément Barbaste</title>
<meta name="description" content="Mentions légales du site de Clément Barbaste, Médecine Traditionnelle Chinoise à Lodève.">
<link rel="canonical" href="https://clement-barbaste-mtc.fr/mentions-legales.html">
```

Body content (flagged fields left exactly as `[À COMPLÉTER]`, never invented):

```html
<section class="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24 prose-content">
  <h1 class="font-display text-4xl text-pine-800">Mentions légales</h1>
  <div class="mt-8 space-y-6 text-ink-700 leading-relaxed">
    <div>
      <h2 class="font-display text-xl text-pine-800">Éditeur du site</h2>
      <p class="mt-2">Clément Barbaste, Médecine Traditionnelle Chinoise<br>9 place Alsace Lorraine, 34700 Lodève<br>Email : clementbarbaste.mtc@gmail.com<br>Téléphone : 06 75 15 56 27<br>SIRET : [À COMPLÉTER]<br>Statut : [À COMPLÉTER]</p>
    </div>
    <div>
      <h2 class="font-display text-xl text-pine-800">Hébergement</h2>
      <p class="mt-2">Hébergeur : [À COMPLÉTER]</p>
    </div>
    <div>
      <h2 class="font-display text-xl text-pine-800">Propriété intellectuelle</h2>
      <p class="mt-2">L'ensemble des contenus présents sur ce site (textes, photographies, logo) est la propriété de Clément Barbaste, sauf mention contraire, et ne peut être reproduit sans autorisation.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: `politique-confidentialite.html`**

```html
<title>Politique de confidentialité | Clément Barbaste</title>
<meta name="description" content="Politique de confidentialité du site de Clément Barbaste, Médecine Traditionnelle Chinoise à Lodève.">
<link rel="canonical" href="https://clement-barbaste-mtc.fr/politique-confidentialite.html">
```

```html
<section class="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24">
  <h1 class="font-display text-4xl text-pine-800">Politique de confidentialité</h1>
  <div class="mt-8 space-y-6 text-ink-700 leading-relaxed">
    <div>
      <h2 class="font-display text-xl text-pine-800">Données collectées</h2>
      <p class="mt-2">Le formulaire de contact de ce site collecte votre nom, votre adresse email et le contenu de votre message, uniquement dans le but de vous répondre. Aucune donnée n'est vendue ni transmise à des tiers à des fins commerciales.</p>
    </div>
    <div>
      <h2 class="font-display text-xl text-pine-800">Hébergement des données</h2>
      <p class="mt-2">Le formulaire de contact est traité par le service Formspree. Le site est hébergé par [À COMPLÉTER].</p>
    </div>
    <div>
      <h2 class="font-display text-xl text-pine-800">Vos droits</h2>
      <p class="mt-2">Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez clementbarbaste.mtc@gmail.com.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Serve, screenshot both pages, compare, fix, re-screenshot (2 rounds minimum)**

```bash
node screenshot.mjs http://localhost:3001/mentions-legales.html legal-desktop
node screenshot.mjs http://localhost:3001/politique-confidentialite.html privacy-desktop
```

Check: both `[À COMPLÉTER]` fields render visibly (not silently dropped), typography matches the rest of the site.

- [ ] **Step 4: Commit**

```bash
git add mentions-legales.html politique-confidentialite.html
git commit -m "feat: add legal pages (mentions legales, politique de confidentialite)"
```

Stop after committing — do not push without asking.

---

### Task 6: Sitemap generator + robots.txt

**Files:**
- Create: `generate-sitemap.mjs`
- Create: `robots.txt`
- Create (generated, not hand-edited after this): `sitemap.xml`

**Interfaces:**
- Consumes: the five `.html` files created in Tasks 1-5.
- Produces: `sitemap.xml`, re-run any time a page is added or removed.

- [ ] **Step 1: Write `generate-sitemap.mjs`**

```js
import { readdirSync, writeFileSync } from "fs";

const DOMAIN = "https://clement-barbaste-mtc.fr";

const PRIORITIES = {
  "index.html": 1.0,
  "soins-tarifs.html": 0.9,
  "contact.html": 0.7,
  "mentions-legales.html": 0.2,
  "politique-confidentialite.html": 0.2,
};

const files = readdirSync(process.cwd())
  .filter((f) => f.endsWith(".html"))
  .sort();

const urls = files
  .map((file) => {
    const loc = file === "index.html" ? `${DOMAIN}/` : `${DOMAIN}/${file}`;
    const priority = PRIORITIES[file] ?? 0.5;
    return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync("sitemap.xml", xml);
console.log(`sitemap.xml written with ${files.length} URLs`);
```

- [ ] **Step 2: Write `robots.txt`**

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://clement-barbaste-mtc.fr/sitemap.xml
```

- [ ] **Step 3: Run the generator and verify**

```bash
node generate-sitemap.mjs
cat sitemap.xml
```

Expected: exactly 5 `<url>` entries, one per `.html` file created in Tasks 1-5, with `index.html` mapped to `https://clement-barbaste-mtc.fr/` (not `/index.html`), and priorities matching `PRIORITIES` above.

- [ ] **Step 4: Commit**

```bash
git add generate-sitemap.mjs robots.txt sitemap.xml
git commit -m "feat: add sitemap generator and robots.txt"
```

Stop after committing — do not push without asking.

---

### Task 7: Full-site QA pass

**Files:**
- Modify: any of the 5 HTML files, as needed to fix issues found below.

- [ ] **Step 1: Cross-page navigation check**

Open each of the 5 pages via `node screenshot.mjs http://localhost:3001/<page> qa-final` and verify by reading the HTML source (not just the screenshot):
- Every page's header nav links to the other 2 content pages + itself, with the correct page showing the active-state styling.
- Every page's footer links to `/mentions-legales.html`, `/politique-confidentialite.html` (relative), and `https://sitereferencement.com/` (absolute, external).
- Every "Prendre rendez-vous" CTA points to `https://booking.zen-agenda.com/book/clement-barbaste-mtc` with `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 2: JSON-LD validation**

For each of `index.html`, `soins-tarifs.html`, `contact.html`, extract the `<script type="application/ld+json">` block and confirm it parses as valid JSON:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); const m=html.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/); JSON.parse(m[1]); console.log('valid JSON-LD')"
```

Repeat for `soins-tarifs.html` and `contact.html`. Fix any syntax error found.

- [ ] **Step 3: Content-accuracy self-check against the questionnaire**

Re-open `business_docs/Questionnaire_Clement_Barbaste_MTC.docx.md` and confirm every fact on the live pages traces back to it: prices, durations, formation dates/names, address, phone, the "not a health professional" disclaimer wording, and the "stimulation des points d'acupuncture" phrasing (never "acupuncture" alone). Flag and fix anything that drifted during writing.

- [ ] **Step 4: Mobile pass on all 5 pages**

```bash
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/index.html qa-mobile
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/soins-tarifs.html qa-mobile
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/contact.html qa-mobile
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/mentions-legales.html qa-mobile
SCREENSHOT_WIDTH=390 SCREENSHOT_HEIGHT=844 node screenshot.mjs http://localhost:3001/politique-confidentialite.html qa-mobile
```

Read all 5 PNGs. Confirm: no horizontal scroll, sticky CTA bar doesn't overlap footer content, text stays legible at 390px, images don't overflow their frames.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: full-site QA pass, nav/schema/content/mobile fixes"
```

Stop after committing. Summarize for the user: what was built, and the outstanding checklist items from spec §11 (SIRET, hosting provider, Formspree ID, opening hours, FB/IG links, FAQ answers). Ask whether to push.

---

## Self-Review Notes

- **Spec coverage:** every spec section (§3 file structure, §4 design system, §5 photo mapping, §6 all 5 pages, §7 SEO/schema, §8 sitemap/robots, §9 QA workflow, §11 checklist) maps to a task above.
- **Placeholder scan:** the only intentional placeholders are `[À COMPLÉTER]` (legal fields, matches spec §11, never silently invented) and the Formspree `REPLACE_WITH_REAL_ID` (flagged with an HTML comment and in Task 4/7's summary) — both are approved deferred-data markers, not vague plan instructions.
- **Type/name consistency:** class names (`shadow-soft`, `shadow-floating`, `photo-frame`, `btn-primary`, `reveal`/`reveal.in`) and Tailwind color tokens (`pine-*`, `walnut-*`, `ecru*`, `ink*`) are defined once in Task 1 and reused identically in Tasks 2-6; anchor id `#qui-suis-je` defined in Task 2 matches the link used in Task 3.
