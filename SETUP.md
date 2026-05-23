# 🚀 GUIDE DE LANCEMENT LOCAL — Interview Question Generator

## Ce dont tu as besoin (à installer une seule fois)

### 1. Node.js
Télécharge et installe Node.js depuis : https://nodejs.org
→ Prends la version **LTS** (le bouton vert à gauche)
→ Vérifie l'installation : ouvre un terminal et tape `node --version`
   Tu dois voir quelque chose comme `v20.x.x` ✅

### 2. VS Code (si pas déjà installé)
https://code.visualstudio.com

---

## Créer le projet (une seule commande)

Ouvre un terminal et tape :

```bash
npm create vite@latest interview-generator -- --template react
```

Cette commande crée automatiquement **toute la structure du projet** :

```
interview-generator/
├── index.html          ← généré automatiquement
├── package.json        ← généré automatiquement
├── vite.config.js      ← généré automatiquement
└── src/
    ├── main.jsx        ← généré automatiquement
    ├── App.jsx         ← à remplacer par ton code
    ├── App.css         ← à supprimer
    └── index.css       ← à supprimer
```

Tu n'as **rien à créer à la main**.

---

## Ajouter le code du projet

### Étape 1 — Remplacer App.jsx

Ouvre `src/App.jsx` et **remplace tout son contenu** par le code du fichier
`interview-question-generator.jsx` (le fichier livré avec ce projet).

### Étape 2 — Nettoyer main.jsx

Ouvre `src/main.jsx`. Tu verras cette ligne :

```jsx
import './index.css'
```

**Supprime-la.** Sans ça, les styles par défaut de Vite écrasent le design.

Le fichier doit ressembler à ça après nettoyage :

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Étape 3 — Supprimer les fichiers CSS inutiles

Tu peux supprimer `src/App.css` et `src/index.css` — ils ne sont plus utilisés.

---

## Lancer le projet

```bash
# Aller dans le dossier du projet
cd interview-generator

# Installer les dépendances (une seule fois)
npm install

# Lancer le serveur de développement
npm run dev
```

Le terminal affichera :

```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Ouvre **http://localhost:5173** dans ton navigateur. C'est tout. ✅

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

## Déploiement en ligne (pour partager avec le recruteur)

### Vercel (le plus simple — gratuit)

```bash
# Installer la CLI Vercel
npm install -g vercel

# Déployer depuis le dossier du projet
vercel
```

Suis les 3 questions dans le terminal (tout accepter par défaut).
Ton app est en ligne en moins de 60 secondes avec une URL publique. ✅

### Netlify (alternative sans CLI)

```bash
# Compiler le projet
npm run build
```

Va sur https://netlify.com → "Deploy manually" → glisse-dépose le dossier `dist/`.
URL générée automatiquement. ✅

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

**Page blanche après `npm run dev`**
→ Tu as probablement oublié de supprimer `import './index.css'` dans `main.jsx`.
→ Sinon : ouvre la console du navigateur (F12 → Console) et copie l'erreur.

**Les styles sont cassés / fond blanc**
→ Même cause : `import './index.css'` encore présent dans `main.jsx`. Supprime-le.
