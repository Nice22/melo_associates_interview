# 🎯 Interview Question Generator

> Un outil propulsé par l'IA qui génère instantanément 3 questions d'entretien
> calibrées selon le rôle et le niveau d'expérience du candidat.



---

## C'est quoi ce projet ?

Application web qui permet de générer en quelques secondes des questions d'entretien
pertinentes pour n'importe quel poste tech.

Sélectionne un intitulé de poste, un niveau d'expérience et une langue —
l'IA produit 3 questions ciblées : comportementale, technique et situationnelle.

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

## Lancer le projet en local

### Prérequis
- [Node.js LTS](https://nodejs.org) installé sur ta machine
- VS Code (ou n'importe quel éditeur)

### En 3 commandes

```bash
# 1. Cloner le repo
git clone https://github.com/Nice22/melo_associates_interview.git
cd melo_associates_interview

# 2. Installer les dépendances
npm install

# 3. Lancer
npm run dev
```

Ouvre **http://localhost:5173** dans ton navigateur. ✅

> ⚠️ L'appel API retournera une erreur 401 en local sans clé API.
> Voir la section "Note sur la clé API" ci-dessous.

---

## Structure du projet

```
melo_associates_interview/
├── index.html          → Point d'entrée HTML
├── package.json        → Dépendances et scripts
├── vite.config.js      → Configuration Vite
├── README.md           → Ce fichier
└── src/
    ├── main.jsx        → Montage React
    └── App.jsx         → Composant principal (toute la logique)
```

---

## Comment ça fonctionne

```
Utilisateur
    │
    ▼
Choisit un rôle + niveau + langue
    │
    ▼
L'app envoie une demande à l'API Claude (Anthropic)
avec un prompt calibré selon le niveau de séniorité
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

## Note sur la clé API

| Environnement | Statut |
|---|---|
| **Claude.ai (artifact)** | Clé gérée automatiquement ✅ |
| **Production Vercel** | Clé nécessaire ⚠️ |
| **Local** | Clé nécessaire ⚠️ |

Pour utiliser **Gemini gratuitement** (sans carte bancaire) en local ou en production :

1. Crée une clé sur [ai.google.dev](https://ai.google.dev)
2. Dans `src/App.jsx`, remplace le fetch Anthropic par :

```js
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

---

## Commandes utiles

| Commande | Action |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance en local (http://localhost:5173) |
| `npm run build` | Compile pour la production → dossier `dist/` |
| `npm run preview` | Prévisualise le build de production |
| `Ctrl+C` | Arrête le serveur |

---

## À propos

Projet réalisé dans le cadre d'un test technique — Melo Associates.

Construit par **Nicétas HOUESSOU** — Full-Stack Developer & AI Enthusiast.

*"Créer c'est avant tout innover — et si ça passe par un sourire, c'est encore mieux."*

---

## Licence

© 2026 Nicétas HOUESSOU — Tous droits réservés.
Projet réalisé dans le cadre d'un test technique. Non autorisé à la redistribution.
