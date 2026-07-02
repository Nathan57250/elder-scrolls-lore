# Elder Scrolls Lore

Un wiki encyclopédique dédié au lore de l'univers Elder Scrolls, disponible en français, anglais et espagnol.

**Ce site a été entièrement initié et développé par IA (Claude Opus 4.6)** — de l'architecture technique à la rédaction des articles en passant par le design.

Le site est accessible à : https://elder-scrolls-lore.vercel.app

---

## Contribuer

Vous souhaitez ajouter, corriger, modifier ou supprimer des articles ? Voici la marche à suivre :

1. **Forkez** ce dépôt
2. **Clonez** votre fork localement
3. Effectuez vos modifications (voir la documentation ci-dessous)
4. **Créez une Merge Request** (Pull Request) vers ce dépôt
5. Je passerai en revue votre contribution et l'accepterai (ou demanderai des modifications) avant de mettre le site à jour

Toute contribution est la bienvenue : corrections factuelles, nouveaux articles, traductions, améliorations de style, ajout d'images, etc.

---

## Documentation : écrire un article

### Structure des dossiers

Les articles sont organisés par **langue** puis par **ère** :

```
src/content/
├── fr/                    # Articles en français
│   ├── dawn-era/          # Ère de l'Aube
│   ├── merethic-era/      # Ère Méréthique
│   ├── first-era/         # Première Ère
│   ├── second-era/        # Deuxième Ère
│   ├── third-era/         # Troisième Ère
│   └── fourth-era/        # Quatrième Ère
├── en/                    # Articles en anglais (même structure)
└── es/                    # Articles en espagnol (même structure)
```

Un article doit exister dans les **3 langues** (fr, en, es) avec le **même slug** (nom de fichier).

### Format d'un article

Les articles sont des fichiers `.svx` (Markdown + Svelte). Chaque fichier commence par un bloc de métadonnées YAML (frontmatter), suivi du contenu en Markdown.

**Exemple** — `src/content/fr/fourth-era/titus-mede-ii.svx` :

```markdown
---
title: "Titus Mede II"
slug: "titus-mede-ii"
era: "fourth-era"
category: "personnages"
tags: ["empereur", "grande-guerre", "thalmor"]
timelineYear: 171
summary: "Description courte de l'article (1-2 phrases)."
sources: ["The Great War", "Skyrim"]
relatedArticles: ["grande-guerre", "thalmor"]
---

## Premier titre de section

Contenu de l'article en **Markdown** classique. Les noms propres importants
peuvent être mis en **gras** — ils seront automatiquement liés à leur article
s'il existe.

## Deuxième section

Continuez avec autant de sections que nécessaire.
```

### Champs du frontmatter

| Champ | Obligatoire | Description |
|-------|:-----------:|-------------|
| `title` | oui | Titre affiché de l'article |
| `slug` | oui | Identifiant unique (nom du fichier sans `.svx`) |
| `era` | oui | `dawn-era`, `merethic-era`, `first-era`, `second-era`, `third-era` ou `fourth-era` |
| `category` | oui | `personnages`, `lieux`, `evenements`, `cosmologie`, `factions`, `objets` |
| `tags` | oui | Liste de tags pour le classement et les relations |
| `summary` | oui | Résumé court (affiché dans les listes et le SEO) |
| `timelineYear` | non | Année dans l'ère (ex: `171` pour 4E 171) |
| `date` | non | Date textuelle libre (ex: "4E 171 - 4E 175") |
| `sources` | non | Liste des sources in-game |
| `relatedArticles` | non | Liste de slugs d'articles liés |
| `image` | non | Chemin vers l'image (ex: `/images/titus-mede-ii.webp`) |
| `aliases` | non | Noms alternatifs du sujet (pour la recherche) |
| `mapCoords` | non | Coordonnées sur la carte `{ x: 0.5, y: 0.3 }` |
| `province` | non | Province de Tamriel associée |

### Ajouter des images

Les images sont placées dans le dossier `static/images/` :

```
static/images/
├── titus-mede-ii.webp
├── grande-guerre.webp
└── ...
```

- Format recommandé : **WebP** (meilleure compression)
- Taille recommandée : **800×600px** maximum
- Référencez l'image dans le frontmatter : `image: "/images/mon-image.webp"`
- Pour insérer une image dans le contenu Markdown :
  ```markdown
  ![Description de l'image](/images/mon-image.webp)
  ```

### Conventions de nommage

- **Nom de fichier** : slug en kebab-case (`grande-guerre.svx`, pas `Grande Guerre.svx`)
- **Slug** : identique au nom de fichier (sans l'extension)
- **Tags** : en kebab-case minuscule (`confrérie-noire`, pas `Confrérie Noire`)
- **Le slug doit être identique** dans les 3 langues (le fichier `grande-guerre.svx` existe en fr, en et es)

### Bonnes pratiques

- Rédigez un **summary** concis et informatif (il apparaît dans les listes)
- Ajoutez des **relatedArticles** pour enrichir le graphe de relations
- Utilisez des **tags** cohérents avec ceux déjà existants
- Structurez avec des `## Titres H2` pour la table des matières
- Mettez en **gras** les noms propres référençant d'autres articles
- Citez vos **sources** in-game quand possible

---

## Développement local

```sh
# Prérequis : Node.js 20+
nvm use 20

# Installation
npm install

# Serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

---

## Stack technique

- **SvelteKit 5** avec runes (`$state`, `$derived`, `$props`)
- **MDsveX** pour les articles Markdown + Svelte
- **Tailwind CSS v4** pour le styling
- **Pagefind** pour la recherche statique
- **adapter-static** pour le déploiement Vercel
- **Canvas API** pour le graphe de relations

---

## Licence

Projet open-source. Le contenu des articles est basé sur le lore officiel de la série The Elder Scrolls (Bethesda Softworks).
