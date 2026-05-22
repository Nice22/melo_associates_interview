# 🎯 Interview Question Generator

> Un outil propulsé par l'IA qui génère instantanément 3 questions d'entretien
> calibrées selon le rôle et le niveau d'expérience du candidat.

---

## C'est quoi ce projet ?

C'est une application web qui permet à un recruteur (ou une startup) de générer
en quelques secondes des questions d'entretien pertinentes pour n'importe quel
poste tech — sans avoir à réfléchir ou chercher des templates génériques.

Tu sélectionnes un intitulé de poste, un niveau d'expérience, une langue,
et l'IA produit 3 questions ciblées : une comportementale, une technique,
et une situationnelle.

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🤖 Génération IA | Questions créées par Claude (Anthropic) en temps réel |
| 🎯 Calibrage par séniorité | Junior / Mid / Senior / Principal — les questions s'adaptent |
| 🌍 Bilingue FR/EN | L'interface et les questions switchent en un clic |
| 📋 Copie rapide | Copie une question ou toutes en un clic |
| 🕐 Historique | Les 6 dernières générations sont mémorisées |
| 🔁 Régénération | Nouvelle variation sans rechoisir le rôle |
| ⚡ Skeleton loading | Feedback visuel pendant la génération |
| 📊 Badge de difficulté | Chaque question est évaluée Easy / Medium / Hard |

---

## Stack technique

```
React 18          → Interface utilisateur
Vite              → Outil de développement et compilation
Anthropic API     → Modèle IA (claude-sonnet-4)
CSS-in-JS inline  → Styles sans dépendance externe
```

Pas de backend. Pas de base de données. Pas de framework CSS.
Un seul fichier composant React auto-suffisant.

---

## Lancer le projet

### Prérequis
- [Node.js LTS](https://nodejs.org) installé sur ta machine
- VS Code (ou n'importe quel éditeur)

### En 4 étapes

```bash
# 1. Créer le projet Vite automatiquement
npm create vite@latest interview-generator -- --template react

# 2. Aller dans le dossier
cd interview-generator

# 3. Installer les dépendances
npm install

# 4. Lancer
npm run dev
```

---

## Structure du projet

```
interview-generator/
├── index.html          → Point d'entrée HTML (généré par Vite)
├── package.json        → Dépendances et scripts (généré par Vite)
├── vite.config.js      → Configuration Vite (généré par Vite)
├── README.md           → Ce fichier
├── SETUP.md            → Guide de lancement détaillé
└── src/
    ├── main.jsx        → Montage React (généré par Vite)
    └── App.jsx         → Composant principal (toute la logique)
```

---

## Comment ça fonctionne (pour les non-développeurs)

```
Utilisateur
    │
    ▼
Choisit un rôle + niveau + langue
    │
    ▼
L'app envoie une demande à l'IA Claude (Anthropic)
avec un prompt précis qui décrit le contexte
    │
    ▼
Claude génère 3 questions en JSON
    │
    ▼
L'app affiche les questions avec leur type et leur difficulté
```

Tout se passe dans le navigateur. Aucune donnée n'est stockée sur un serveur.
L'historique vit en mémoire — il disparaît si tu fermes l'onglet.

---

## Déployer en ligne

```bash
# Avec Vercel (recommandé — gratuit)
npm install -g vercel
vercel

# Avec Netlify (alternative)
npm run build
# puis glisse-dépose le dossier dist/ sur netlify.com
```

---

## ⚠️ Point important sur la clé API

Ce projet utilise l'API Claude (Anthropic). Dans l'artifact Claude.ai, la clé est
gérée automatiquement. En local, l'appel API retournera une erreur **401**.

**Pour le faire fonctionner en local**, tu as deux options :

### Option A — Gemini (gratuit, sans carte bancaire) ✅ Recommandé

1. Va sur https://ai.google.dev et crée une clé API gratuite
2. Dans `src/App.jsx`, remplace la fonction `fetchQuestions` à partir du fetch :

```js
// AVANT (Anthropic)
const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  signal,
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 900,
    messages: [{ role: "user", content: prompt }],
  }),
})
const data = await res.json()
const raw = data.content?.find(b => b.type === "text")?.text?.trim() ?? ""

// APRÈS (Gemini)
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=TA_CLE_ICI`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  }
)
const data = await res.json()
const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
```

### Option B — OpenRouter (free tier disponible)
https://openrouter.ai — crée un compte, génère une clé, compatible OpenAI.

---

## Note sur la clé API

Ce projet utilise l'API Anthropic (Claude). Selon l'environnement :

- **Dans Claude.ai (artifact)** → la clé est gérée automatiquement ✅
- **En local ou en production** → une clé API est nécessaire

---

## Commandes utiles

| Commande | Action |
|---|---|
| `npm create vite@latest nom -- --template react` | Crée un nouveau projet Vite + React |
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance en local (http://localhost:5173) |
| `npm run build` | Compile pour la production → dossier `dist/` |
| `npm run preview` | Prévisualise le build de production |
| `Ctrl+C` | Arrête le serveur |

---

## En cas de problème

**"npm : command not found"**
→ Node.js n'est pas installé. Retourne à l'étape 1.

**"Port 5173 already in use"**
→ Un autre projet tourne déjà. Tape : `npm run dev -- --port 3000`

**Erreur 401 sur l'API**
→ Normal en local avec l'API Anthropic. Voir section "Point important sur la clé API".


----
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

----

## À propos

Projet réalisé dans le cadre d'un test technique — Melo Associates.

Construit avec soin par **Nicétas** — Full-Stack Developer & AI Enthusiast.

*"Créer c'est avant tout innover — et si ça passe par un sourire, c'est encore mieux."*

---

## Licence
© 2026 Nicétas HOUESSOU — Tous droits réservés.
Projet réalisé dans le cadre d'un test technique. Non autorisé à la redistribution.