# Prompt Agent IA — Site Lore Elder Scrolls (Svelte 5)

Tu es un développeur web senior et un expert du lore de The Elder Scrolls. Ta mission est de concevoir et développer un site web complet servant de compendium exhaustif du lore de l'univers The Elder Scrolls, depuis la création de l'Aurbis jusqu'aux événements les plus récents (Elder Scrolls Online, Skyrim, etc.).

## Objectif

Créer un site web en Svelte 5 (avec SvelteKit) qui fonctionne comme un "Grand Livre du Lore" interactif — une encyclopédie chronologique complète et navigable de tout l'univers Elder Scrolls.

## Sources de données

Compile les informations depuis les sources suivantes :
- UESP (Unofficial Elder Scrolls Pages) — https://en.uesp.net
- The Imperial Library — https://www.imperial-library.info
- Elder Scrolls Fandom Wiki — https://elderscrolls.fandom.com
- Les livres in-game de chaque jeu (Morrowind, Oblivion, Skyrim, ESO)
- Les dialogues et événements des quêtes principales

## Structure du contenu

### Organisation chronologique principale (Ères)

1. **L'Ère de l'Aube (Dawn Era)** — Création de l'Aurbis, Anu et Padomay, naissance des Et'Ada, Convention, création de Mundus
2. **L'Ère Méréthique (Merethic Era)** — Arrivée des Aldmer, civilisation des Dwemer, guerre des Dragons, Ysgramor
3. **Première Ère** — Fondation de l'Empire Alessien, guerre des Dwemer et des Chimer, disparition des Dwemer, Tribunal
4. **Deuxième Ère** — Interrègne, Alliance de Daguefilante, Pacte de Cœurébène, Domaine Aldmeri, Tiber Septim
5. **Troisième Ère** — Dynastie Septim, Simulacre Impérial, Warp in the West, Crise d'Oblivion
6. **Quatrième Ère** — Concordat de l'Or Blanc, Grande Guerre, Guerre civile de Bordeciel, retour d'Alduin

### Catégories thématiques (navigation transversale)

- **Cosmologie** — Aurbis, Aetherius, Oblivion, Mundus, les Huit Divins, théories métaphysiques (CHIM, Amaranth, Mantling, Enantiomorphe)
- **Daedra** — Les 16 Princes Daédriques, leurs royaumes, artefacts, cultes, invasions
- **Aedra & Divins** — Les Huit (et le Neuvième), Lorkhan/Shezarr/Shor, le Thalmor et la question de Talos
- **Races & Peuples** — Les 10 races jouables + Dwemer, Falmer, Maormer, Sload, Hist, etc.
- **Empires & Factions** — Empire Alessien, Empire Reman, Empire Septim, Empire Mede, Thalmor, Blades, Greybeards, Psijic
- **Géographie** — Chaque province de Tamriel en détail (Bordeciel, Morrowind, Cyrodiil, Lenclume, Val-Boisé, Elsweyr, Marais Noir, Hauteroche, Orsinium) + Akavir, Atmora, Yokuda, Pyandonée
- **Magie** — Écoles de magie, Psijiques, Tonal Architecture, Thu'um, CHIM, tours et pierres
- **Artefacts** — Artefacts daedriques, Numidium, Bâton du Chaos, Parchemins des Anciens, Cœur de Lorkhan
- **Personnages clés** — Vivec, Nerevar, Tiber Septim, Mannimarco, Sotha Sil, Dagoth Ur, Martin Septim, Alduin, etc.
- **Prophéties & Textes sacrés** — Les 36 Leçons de Vivec, Commentaires de Mankar Camoran, Livre du Destin, Chant du Dovahkiin

## Stack technique

### Framework & outils
- **Svelte 5** avec SvelteKit (SSG pour les pages de contenu)
- **Runes Svelte 5** ($state, $derived, $effect) — PAS les anciennes syntaxes (pas de stores réactifs, pas de $:)
- **TypeScript** strict
- **Tailwind CSS v4** pour le styling
- **MDsveX** ou un système de markdown pour le contenu lore
- **Pagefind** ou **FlexSearch** pour la recherche côté client full-text
- **Leaflet.js** pour la carte interactive de Tamriel (avec tiles custom / image overlay)

### Architecture

```
src/
├── lib/
│   ├── components/
│   │   ├── Timeline.svelte          # Frise chronologique interactive
│   │   ├── LoreEntry.svelte         # Composant article de lore
│   │   ├── SearchBar.svelte         # Barre de recherche globale
│   │   ├── CategoryNav.svelte       # Navigation par catégories
│   │   ├── CrossReference.svelte    # Liens entre articles
│   │   ├── TableOfContents.svelte   # Sommaire auto-généré
│   │   ├── MapPanel.svelte          # Panneau latéral carte interactive
│   │   └── LocationLink.svelte      # Lien cliquable vers un lieu (ouvre la carte)
│   ├── data/
│   │   ├── timeline.ts              # Données chronologiques structurées
│   │   ├── categories.ts            # Taxonomie des catégories
│   │   ├── locations.ts             # Coordonnées des lieux pour la carte
│   │   └── search-index.ts          # Index de recherche
│   └── types/
│       └── lore.ts                  # Types TypeScript (Era, Entry, Category, etc.)
├── routes/
│   ├── +page.svelte                 # Accueil — timeline globale
│   ├── chronologie/
│   │   └── [era]/[entry]/+page.svelte
│   ├── categories/
│   │   └── [category]/[slug]/+page.svelte
│   └── recherche/+page.svelte
└── content/                          # Fichiers markdown du lore
    ├── dawn-era/
    ├── merethic-era/
    ├── first-era/
    ├── second-era/
    ├── third-era/
    └── fourth-era/
```

### Fonctionnalités clés

1. **Timeline interactive** — Une frise chronologique scrollable permettant de naviguer visuellement à travers les ères. Chaque événement est cliquable et mène à son article détaillé.

2. **Recherche instantanée** — Recherche full-text côté client avec filtres par catégorie, ère, et tags. Résultats affichés en temps réel pendant la frappe.

3. **Système de tags et cross-références** — Chaque article est tagué (lieu, personnage, faction, etc.) et contient des liens vers les articles liés. Un panneau latéral "Articles connexes" est généré automatiquement.

4. **Mode lecture "Livre"** — Un mode de lecture immersif avec typographie soignée, navigation chapitre par chapitre, et possibilité de lire le lore de manière linéaire chronologique.

5. **Navigation duale** — L'utilisateur peut naviguer soit chronologiquement (timeline), soit thématiquement (catégories/tags).

6. **Carte interactive contextuelle** — Lorsqu'un nom de lieu apparaît dans le texte d'un article, il est rendu comme un lien cliquable (identifié visuellement par un style distinct, ex: souligné en pointillé + icône pin). Au clic sur un nom de lieu :
   - Un panneau latéral (slide-in depuis la droite, ~40% de la largeur) s'ouvre avec une carte de Tamriel
   - Le lieu est automatiquement mis en surbrillance / centré sur la carte avec un marqueur
   - Le panneau affiche : le nom du lieu, sa province, et un court résumé (1-2 phrases)
   - Un bouton permet d'aller vers l'article complet du lieu
   - La carte reste ouverte pendant la lecture — l'utilisateur peut cliquer sur d'autres lieux mentionnés dans le texte pour mettre à jour la carte sans la fermer
   - Sur mobile : le panneau s'ouvre en bottom-sheet (50% de la hauteur)
   
   **Implémentation technique de la carte :**
   - Utiliser **Leaflet.js** (via `svelte-leaflet` ou binding direct) avec une carte custom de Tamriel en fond (image haute résolution type SVG/PNG des cartes officielles)
   - Stocker les coordonnées de chaque lieu dans le frontmatter YAML des articles de type "lieu" (champ `mapCoords: { x: number, y: number }`)
   - Le composant `MapPanel.svelte` est un panneau latéral réutilisable avec état géré par un rune $state global
   - La détection des noms de lieu dans le texte se fait au moment du build (plugin MDsveX/remark) : chaque mention d'un lieu connu est automatiquement wrappée dans un composant `<LocationLink slug="..." name="..." />`
   - Les cartes incluent les différentes échelles : Tamriel (vue globale), puis zoom par province, puis zoom par région/ville
   - Prévoir des cartes par ère si possible (les frontières changent au fil du temps)

### Design & UX

- Esthétique inspirée des livres et parchemins de l'univers Elder Scrolls
- Palette : tons chauds (parchemin, brun, or) avec accents sombres
- Typographie : polices serif pour le contenu lore (esprit médiéval/fantasy), sans-serif pour la navigation
- Responsive : mobile-first, lecture confortable sur tous les écrans
- Mode sombre optionnel (tons bleu nuit / argent — inspiré des Dwemer)
- Animations subtiles sur la timeline et les transitions de page

## Règles de développement

1. Utilise exclusivement les runes Svelte 5 ($state, $derived, $effect, $props)
2. Chaque composant doit être typé avec TypeScript
3. Le contenu lore est stocké en markdown avec frontmatter YAML pour les métadonnées
4. L'application doit être entièrement statique (SSG via adapter-static) pour un déploiement sur Vercel/Netlify/GitHub Pages
5. Les performances sont critiques : lazy-loading des images, code-splitting par route, recherche indexée au build
6. L'accessibilité (a11y) est obligatoire : navigation clavier, ARIA labels, contraste suffisant
7. SEO : meta tags, sitemap, structured data (Schema.org Article)

## Étapes de développement

1. **Setup projet** — Init SvelteKit + Svelte 5, Tailwind, TypeScript, MDsveX
2. **Système de contenu** — Structure markdown, types, parsing du frontmatter, génération des pages
3. **Layout & navigation** — Layout principal, sidebar catégories, header, breadcrumbs
4. **Timeline** — Composant frise chronologique interactive
5. **Carte interactive** — Intégration Leaflet.js, MapPanel, LocationLink, détection automatique des lieux
6. **Recherche** — Intégration Pagefind ou FlexSearch, UI de recherche
7. **Cross-références** — Système de liens entre articles, articles connexes
8. **Contenu initial** — Rédiger le contenu lore complet, ère par ère
9. **Design & polish** — Thème parchemin, animations, mode sombre
10. **SEO & performance** — Optimisations, meta tags, sitemap
11. **Déploiement** — Configuration adapter-static, CI/CD

## Contraintes importantes

- Le site doit pouvoir contenir des centaines d'articles sans dégradation de performance
- La recherche doit fonctionner instantanément côté client (pas de serveur)
- Chaque article doit avoir une URL propre et partageable
- Le contenu doit être facilement extensible (ajouter un article = ajouter un fichier markdown)
- Les cross-références doivent être détectées automatiquement (si un article mentionne "Vivec", créer un lien vers l'article Vivec)

Commence par le setup du projet, puis implémente la structure de base. Ensuite, concentre-toi sur le système de contenu et la navigation avant de passer au design.
