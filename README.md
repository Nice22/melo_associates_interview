# 🎯 Interview Question Generator

Un outil propulsé par l'IA qui génère instantanément 3 questions d'entretien calibrées selon le rôle et le niveau d'expérience du candidat.

🔗 Live demo → melo-associates-interview.vercel.app


## C'est quoi ce projet ?

Application web qui permet de générer en quelques secondes des questions d'entretien pertinentes pour n'importe quel poste tech.

Sélectionne un intitulé de poste, un niveau d'expérience et une langue — l'IA produit 3 questions ciblées : comportementale, technique et situationnelle.

## Fonctionnalités

| Fonctionnalité | Description |
| --- | --- |
| 🤖 **Génération IA** | Questions créées par Openrouter (NVIDIA) en temps réel |
| 🎯 **Calibrage par séniorité** | Junior / Mid / Senior / Principal — les questions s'adaptent |
| 🌍 **Bilingue FR/EN** | L'interface et les questions switchent en un clic |
| 📋 **Copie rapide** | Copie une question ou toutes en un clic |
| 🕐 **Historique** | Les 6 dernières générations sont mémorisées |
| 🔁 **Régénération** | Nouvelle variation sans rechoisir le rôle |
| ⚡ **Skeleton loading** | Feedback visuel pendant la génération |
| 📊 **Badge de difficulté** | Chaque question est évaluée Easy / Medium / Hard |

## Stack technique

* **React 18** → Interface utilisateur
* **Vite** → Outil de développement et compilation
* **NVIDIA API** → Modèle IA 
* **CSS-in-JS inline** → Styles sans dépendance externe

*Pas de backend. Pas de base de données. Pas de framework CSS. Un seul fichier composant React auto-suffisant.*

---

## 🔑 Guide Complet : Création et Activation de la Clé API

Pour des raisons de sécurité et de lutte contre les abus, Anthropic n'offre plus de crédits gratuits par défaut à la création d'un compte de développement. Une clé API fraîchement générée sur un compte à 0.00$ renverra systématiquement une erreur de type `credit balance too low`.

### Étape 1 : Activer le compte Anthropic (Obligatoire)

1. Rendez-vous sur la **[Anthropic Console](https://console.anthropic.com/)**.
2. Connectez-vous avec votre compte ou créez-en un nouveau.
3. Accédez à l'onglet **Settings** puis **Plans & Billing** (Plans et facturation) dans le menu latéral.
4. Cliquez sur le bouton **Add Funds** (ou *Upgrade to Build*) pour basculer votre compte en **Tier 1**.
5. Renseignez vos informations professionnelles/personnelles et associez une carte bancaire (les cartes prépayées ou de débit locales fonctionnent parfaitement).
6. Effectuez un achat de crédits initial (le montant minimum requis est de 5 $ou 10$). Votre compte est désormais actif.

### Étape 2 : Générer la clé API

1. Une fois les fonds ajoutés, allez sur l'onglet **API Keys** dans le menu supérieur ou latéral.
2. Cliquez sur le bouton **Create Key** (Créer une clé).
3. Nommez votre clé pour la retrouver facilement (ex: *Melo Assessment*).
4. **Copiez immédiatement la clé générée** (elle commence par `sk-ant-...`). *Attention : elle ne s'affichera plus jamais par la suite.*

---

## 💻 Intégration dans l'Environnement de Développement

Le projet utilise **Vite** comme outil de build. Pour des raisons de sécurité, Vite exige que les variables d'environnement accessibles côté client soient préfixées par `VITE_`. La variable attendue par l'application s'appelle impérativement **`VITE_NVIDIA_API_KEY`**.

### 1. Configuration en Local (Développement)

Dans l'environnement de développement, la clé doit être stockée dans un fichier local qui ne sera jamais envoyé sur GitHub.

1. À la racine du projet, créez un fichier nommé `.env.local` :
```bash
touch .env.local

```


2. Ouvrez le fichier et ajoutez-y votre clé API sous cette forme exacte :
```env
VITE_NVIDIA_API_KEY=votre_cle_sk-ant-..._ici

```


3. Sauvegardez le fichier. Le projet est configuré.

### 2. Configuration sur Vercel (Production)

Puisque le fichier `.env.local` est ignoré par Git, il faut configurer la variable directement sur le tableau de bord de Vercel.

1. Allez sur votre tableau de bord **Vercel** et sélectionnez votre projet.
2. Allez dans l'onglet **Settings** ➔ **Environment Variables**.
3. Dans le champ **Key**, inscrivez : `VITE_NVIDIA_API_KEY`
4. Dans le champ **Value**, collez votre clé NVIDIA complète (`sk-ant-...`).
5. Cliquez sur **Add**.
6. Pour appliquer le changement, allez dans l'onglet **Deployments**, cliquez sur les trois petits points de votre dernier build et sélectionnez **Redeploy**.

---

## 🚀 Lancer le projet en local

### Prérequis

* Node.js LTS installé (v18+)
* Votre clé `VITE_NVIDIA_API_KEY` configurée dans le fichier `.env.local`.

### Procédure d'exécution

```bash
# 1. Cloner le dépôt
git clone https://github.com/Nice22/melo_associates_interview.git
cd melo_associates_interview

# 2. Installer les dépendances Node
npm install

# 3. Lancer le serveur de développement local
npm run dev

```

Ouvrez votre navigateur sur **http://localhost:5173** ✅

---

## Structure du projet

```text
melo_associates_interview/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    └── App.jsx     → Toute la logique, l'UI et les appels API (composant unique)

```

## Sécurité des clés

| Environnement | Fichier de Configuration | Statut de Sécurité |
| --- | --- | --- |
| **Local** | `.env.local` | Sécurisé (Inclus d'office dans `.gitignore`) |
| **Production (Vercel)** | Dashboard Environment Variables | Chiffré et masqué côté serveur |

> ⚠️ **Rappel de sécurité critique :** Ne poussez jamais votre fichier `.env.local` ou vos clés brutes sur un dépôt public GitHub sous peine de voir votre compte Anthropic suspendu ou vidé de ses crédits en quelques minutes par des bots de scraping.

---

## À propos

Projet réalisé dans le cadre d'un test technique — **Melo Associates**.

Construit par **Nicétas HOUESSOU** — *Full-Stack Developer & AI Enthusiast*.

> *"Créer c'est avant tout innover — et si ça passe par un sourire, c'est encore mieux."*

## Licence

© 2026 Nicétas HOUESSOU — Tous droits réservés.
*Projet réalisé dans le cadre d'un test technique. Non autorisé à la redistribution.*