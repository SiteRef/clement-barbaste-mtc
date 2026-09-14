# Site Clément Barbaste — Cabinet MTC Lodève — Design

Date : 2026-09-14
Client : Clément Barbaste, Médecine Traditionnelle Chinoise, Lodève (34)
Agence : SiteREF

## 1. Contexte

Site vitrine 3 pages pour un cabinet de Médecine Traditionnelle Chinoise (MTC).
Aucun code existant dans ce dossier — build complet.

Sources de vérité :
- `business_docs/Questionnaire_Clement_Barbaste_MTC.docx.md` — **seule source de
  faits et de texte**. Tout le contenu rédactionnel (accroche, bio, méthode,
  descriptions de prestations, tarifs, FAQ) doit en être extrait ou en être une
  reformulation fidèle. Rien qui ne s'y trouve n'est inventé.
- `business_docs/Structure_Site_Clement_Barbaste_MTC.md` — synthèse de structure
  déjà validée (arborescence, balises SEO cibles, schema JSON-LD), sert de plan
  mais le texte source reste le questionnaire.
- `images/Logo clement.png` — référence de style (mood), pas de layout : yin-yang
  formé par un bonsaï (feuillage vert, tronc/racines bois brun, fond blanc,
  point noir). Direction : zen, épuré, organique, ancré, équilibré.
- `images/*.png` — 12 photos réelles du praticien, du cabinet et des soins.
  Aucun placeholder là où une vraie photo existe (voir mapping §5).

## 2. Décisions verrouillées (issues du brainstorming)

- **Stack :** HTML statique multi-pages, Tailwind CDN, sans build step.
- **Domaine canonique :** `https://clement-barbaste-mtc.fr` (choix du client),
  utilisé identiquement dans canonical, OG, JSON-LD et le sitemap. Redirection
  www/non-www à vérifier une fois le domaine réellement en ligne (non bloquant
  pour le build).
- **Contact :** formulaire réel via Formspree (ou service équivalent) +
  tap-to-call + mailto. Le client doit créer un compte Formspree gratuit et
  fournir l'ID de formulaire — en attendant, le formulaire est construit avec un
  endpoint placeholder clairement signalé dans le résumé de livraison.
- **Pages légales :** construites maintenant avec la structure correcte ;
  SIRET, statut juridique (EI/auto-entrepreneur) et hébergeur marqués
  `[À COMPLÉTER]` — jamais inventés.
- **FAQ / Avis Google / réseaux sociaux / horaires :** aucune section
  "à venir" affichée — ces blocs sont simplement omis du HTML tant que les
  données réelles ne sont pas fournies, pour ne pas donner une impression de
  site inachevé. Ajoutés dans une itération ultérieure.
- **GMB :** fiche désormais en ligne, embed iframe fourni dans `/gmb/`. Intégré
  tel quel (src jamais modifié) sur la page Contact, avec un style cohérent
  (coins arrondis, ombre du système de design). Aucun avis n'existe encore sur
  la fiche → toujours pas de schema `AggregateRating`/`Review` tant que des
  avis réels ne sont pas récoltés.

## 3. Arborescence des fichiers

```
/index.html                     (Accueil)
/soins-tarifs.html
/contact.html
/mentions-legales.html
/politique-confidentialite.html
/sitemap.xml                    (généré par script, jamais écrit à la main)
/robots.txt
/generate-sitemap.mjs           (parcourt les .html à la racine, écrit sitemap.xml)
/images/                        (photos existantes, utilisées telles quelles)
/serve.mjs, /screenshot.mjs     (déjà présents, ne pas modifier)
```

Chaque page HTML est autonome : Tailwind CDN + `<style>` inline (fonts,
ombres personnalisées) + `<script>` inline pour le nav mobile, l'accordéon et
la barre CTA sticky. Pas de fichier CSS/JS partagé — cohérent avec la règle
du template "un seul fichier, tout inline" étendue à un site multi-pages.

## 4. Système de design (dérivé du logo)

- **Palette (premier jet, à valider par le client)** : vert pin/forêt profond
  (feuillage) en primaire, brun noyer/terracotta chaud (tronc/racines) en
  secondaire, encre noire chaude pour le texte, fond blanc écru. Aucune
  couleur Tailwind par défaut (indigo/blue).
- **Typographie :** empilement serif (titres, ton apaisé/traditionnel MTC) +
  sans-serif humaniste (corps de texte). Tracking resserré sur les grands
  titres, line-height 1.7 sur le corps.
- **Traitement des photos :** overlay dégradé + calque de teinte
  vert/brun en `mix-blend-multiply` sur chaque photo réelle, pour unifier les
  12 photos en un ensemble cohérent avec la marque plutôt que des clichés bruts.
- **Ombres/profondeur :** ombres superposées et teintées (jamais `shadow-md`
  plat), système base → surélevé → flottant pour les cartes (prestations,
  accordéon, grille tarifaire).
- **Animation :** uniquement `transform`/`opacity`, easing type spring, jamais
  `transition-all`. États hover/focus-visible/active sur tout élément cliquable.

## 5. Mapping photos → sections (aucun placeholder si une vraie photo existe)

| Photo | Section |
|---|---|
| `Photo portrait professionnel de Clément.png` | Accueil → Qui suis-je |
| `Photo de clement en situation de soin.png` | Accueil → Hero |
| `Photo prise de pouls  observation de la langue (étape diagnostic).png` | Accueil → Ma méthode |
| `Photo des mains du praticien en action.png` | Accueil → Ma méthode (secondaire) |
| `Photo Massage Amma assis (sur chaise).png` | Soins & Tarifs → Massage Amma + section dédiée massage sur chaise |
| `Photo Massage Tuina.png` | Soins & Tarifs → Massage Tuina |
| `Photo Massage Foot Thaï.png` | Soins & Tarifs → Massage Foot Thaï |
| `Photo d'une séance de stimulation des points (aiguilles).png` | Soins & Tarifs → 1ère séance / séance de suivi |
| `Photo du matériel (aiguilles stériles emballées, huiles de massage...).png` | Soins & Tarifs → déroulement/hygiène |
| `Photo de la salle de consultation  de soin.png` | Contact (ambiance cabinet) |
| `Photo extérieure du bâtiment  entrée (9 place Alsace Lorraine).png` | Contact → accès |
| `Photo de l'accès (escalier, palier du 1er étage).png` | Contact → accès |
| `Logo clement.png` | Header + footer (toutes les pages) |

## 6. Pages

### 6.1 Accueil (`index.html`)
Header (logo + nav + CTA "Prendre RDV") → Hero (accroche construite autour de
l'écoute/bienveillance/soulagement, reprenant les verbatims client : *"chaque
personne est unique... chaque mot ou expression est important"*, *"chaque cas
est une énigme possible à résoudre"*) → Qui suis-je (parcours/formations
listées, histoire personnelle, différenciation, texte fidèle au questionnaire)
→ Ma méthode (description + tableau réel des 3 phases : intensive /
stabilisation / maintien) → Pourquoi consulter (accordéon des 8 catégories
exactes du questionnaire) → CTA final Zen Agenda → Footer.

Pas de section FAQ, pas de section Avis Google (cf. §2).

### 6.2 Soins & Tarifs (`soins-tarifs.html`)
Chaque prestation (1ère séance, séance de suivi, Amma, Tuina, Foot Thaï) avec
sa photo réelle + description textuelle issue du questionnaire → grille
tarifaire en vraie balise `<table>` + forfaits → conditions d'annulation →
déroulement d'une consultation avec le disclaimer verbatim ("je ne suis pas un
professionnel de santé...") → section dédiée massage sur chaise → lien interne
retour vers Accueil (Qui suis-je / méthode) → CTA.

### 6.3 Contact (`contact.html`)
Tap-to-call `tel:0675155627` + formulaire Formspree (endpoint placeholder
signalé) + adresse/accès (9 place Alsace Lorraine, 34700 Lodève, parking du
parc et de la sous-préfecture, cabinet au 1er étage) + photos extérieur/accès
+ carte GMB embarquée (iframe fourni, src non modifié, style coins
arrondis/ombre) + CTA Zen Agenda.

### 6.4 Pages légales
`mentions-legales.html` et `politique-confidentialite.html` avec structure
complète ; SIRET, statut juridique et hébergeur en `[À COMPLÉTER]`.

Footer (toutes les pages) : liens légaux + crédit `sitereferencement.com`
(lien externe absolu) selon la règle du CLAUDE.md projet.

## 7. SEO / Schema

Balises `<title>`/meta exactement celles spécifiées dans
`Structure_Site_Clement_Barbaste_MTC.md` §"Balises par page". Un seul bloc
`@graph` JSON-LD par page dans le `<head>` :
- `MedicalBusiness` sur les 3 pages de contenu (Accueil, Soins & Tarifs,
  Contact) — les pages légales n'en ont pas besoin, meilleure pratique SEO.
  Champs confirmés uniquement : nom,
  adresse, email, téléphone (06 75 15 56 27), prestations. Horaires/réseaux
  sociaux ajoutés dès qu'ils sont fournis.
- `WebSite` — identité globale.
- Pas de `FAQPage` (pas de contenu FAQ réel), pas de
  `Review`/`AggregateRating` (pas de fiche GMB ni d'avis).

Maillage interne conforme à la synthèse : Accueil ↔ Soins & Tarifs, Accueil ↔
Contact, CTA Zen Agenda répété sur chaque page (hero, milieu de page, footer).

Contenu formulé pour la citabilité GEO : les 8 catégories "Pourquoi
consulter" et le tableau des 3 phases restent en blocs courts (pas de
dilution en prose), comme prescrit dans la synthèse.

## 8. Sitemap & robots.txt

`generate-sitemap.mjs` parcourt les `.html` à la racine et génère
`sitemap.xml` — jamais de liste écrite à la main. Priorités : accueil `1.0`,
soins-tarifs `0.9`, contact `0.7`, pages légales `0.2`. `robots.txt` inclut la
ligne `Sitemap:` vers l'URL absolue du domaine canonique et n'exclut pas
GPTBot/ClaudeBot/PerplexityBot/Google-Extended.

## 9. QA / Workflow de vérification visuelle

Conformément au CLAUDE.md projet : serveur local via `serve.mjs`, captures
via `screenshot.mjs` sur desktop et mobile, au moins 2 rounds de comparaison
avant de considérer une page terminée. Le critère n'est pas de cloner le
logo (ce n'est pas une référence de layout) mais de produire un rendu épuré,
cohérent avec sa palette et son ambiance zen/organique. Vérifier à chaque
round : espacements, tailles/poids de police, couleurs exactes (hex),
alignement, rayons de bordure, ombres, dimensionnement des images.

## 10. Éléments explicitement hors scope pour ce build

- Blog / CMS headless (refusé par le client)
- Astrologie chinoise / Ba Zi (refusé par le client)
- Carte GMB (fiche pas encore créée)
- FAQ, avis clients, liens réseaux sociaux, horaires (données non fournies)

## 11. Points à compléter avant mise en ligne (checklist livraison)

- [ ] SIRET + statut juridique (pages légales)
- [ ] Hébergeur (pages légales)
- [x] ID de formulaire Formspree réel — configuré (`meaqyjwo`)
- [ ] Horaires d'ouverture
- [x] Liens Facebook / Instagram — confirmés et intégrés (footer + JSON-LD `sameAs`)
- [ ] Réponses FAQ (puis ajout section + schema `FAQPage`)
- [ ] Avis clients réels sur la fiche GMB (avant d'envisager `AggregateRating`)
- [ ] Formulaire de première visite (PDF téléchargeable) — mentionné dans le
      texte de Soins & Tarifs mais pas encore créé/uploadé
- [ ] Photos (portrait + cabinet) : confirmer avec le client qu'il s'agit bien
      de vraies photos de Clément et du cabinet, pas de photos génériques —
      le questionnaire d'origine dit "pas encore" pour les deux, à vérifier
      avant mise en ligne puisque l'alt text et le schema JSON-LD affirment
      une identité réelle
- [ ] Vérification redirection www/non-www une fois le domaine en ligne
