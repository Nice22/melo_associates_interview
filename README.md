### 
English
###

# 🎯 Interview Question Generator
An AI-powered tool that instantly generates 3 tailored interview questions based on the candidate's target role and seniority level.
🔗 Live demo → [melo-associates-interview.vercel.app](https://melo-associates-interview.vercel.app)
## What is this project?
A web application designed to generate relevant interview questions for any tech position in seconds.
Simply select a job title, seniority level, and language — the AI will produce 3 specific and highly targeted questions: behavioral, technical, and situational.
## Features

| Feature | Description |
| :--- | :--- |
| 🤖 **AI Generation** | Real-time question generation powered by OpenRouter |
| 🎯 **Seniority Calibration** | Junior / Mid / Senior / Principal — questions adapt dynamically |
| 🌍 **Bilingual FR/EN** | One-click language toggle for both the interface and the questions |
| 📋 **Quick Copy** | Copy a single question or all of them at once with a single click |
| 🕐 **History Panel** | The last 6 generations are automatically saved and stored |
| 🔁 **Regeneration** | Generate a new variation without having to reselect the role |
| ⚡ **Skeleton Loading** | Smooth visual feedback during AI generation |
| 📊 **Difficulty Badges** | Each question is heuristically evaluated as Easy / Medium / Hard |

## Tech Stack
* **React 18** → User Interface
* **Vite** → Build tool and development server
* **OpenRouter API** → Routing and LLM access (Claude 3.5 Haiku)
* **Inline CSS-in-JS** → Zero external styling dependencies
*No backend. No database. No CSS framework. A single, self-contained React component file.*
---
## 🔑 Complete Guide: API Key Creation and Configuration
The application utilizes the **OpenRouter** gateway to query artificial intelligence models in a standardized and seamless manner.
### Step 1: Obtain an OpenRouter API Key
1. Go to **[OpenRouter.ai](https://openrouter.ai/)**.
2. Sign in or create an account (via GitHub, Google, or email).
3. Access your dashboard and navigate to the **Keys** tab.
4. Click **Create Key**, give it a name (e.g., `Melo Generator`), and set an optional credit limit if desired.
5. **Copy the generated key immediately** (it usually starts with `sk-or-...`). *Note: It will never be displayed again.*
6. Ensure your account balance has sufficient funds (or use a free model identifier of your choice within the code if needed).
---
## 💻 Environment Variables Integration
The project is built with **Vite**. For security reasons, Vite requires client-accessible environment variables to be prefixed with `VITE_`. The application explicitly expects the variable to be named **`VITE_NVIDIA_API_KEY`**.
### 1. Local Configuration (Development)
In your local development environment, the API key must be stored in a local environment file that is ignored by Git.
1. In the root directory of the project, create a file named `.env.local`:
```bash
touch .env.local
```
 2. Open the file and add your OpenRouter API key exactly as follows:
```env
VITE_NVIDIA_API_KEY=your_sk-or-v1-..._key_here
```
 3. Save the file. Your local project is now configured.
### 2. Vercel Configuration (Production)
Since the .env.local file is never pushed to GitHub, you need to configure the variable directly on the Vercel dashboard.
 1. Go to your **Vercel** dashboard and select your project.
 2. Navigate to **Settings** ➔ **Environment Variables**.
 3. In the **Key** field, enter: VITE_NVIDIA_API_KEY
 4. In the **Value** field, paste your full OpenRouter key (sk-or-...).
 5. Click **Add**.
 6. To apply this change, go to the **Deployments** tab, click the three small dots next to your latest build, and select **Redeploy**.
## 🚀 Running the Project Locally
### Prerequisites
 * Node.js LTS installed (v18+)
 * Your VITE_NVIDIA_API_KEY configured in the .env.local file.
### Execution Steps
```bash
# 1. Clone the repository
git clone [https://github.com/Nice22/melo_associates_interview.git](https://github.com/Nice22/melo_associates_interview.git)
cd melo_associates_interview
# 2. Install Node dependencies
npm install
# 3. Start the local development server
npm run dev
```
Open your browser and navigate to **http://localhost:5173** ✅
## Project Structure
```text
melo_associates_interview/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    └── App.jsx     → Entire logic, UI, and API calls (single component)
```
## Key Security

| Environment | Configuration File | Security Status |
| :--- | :--- | :--- |
| **Local** | .env.local | Secured (Automatically included in .gitignore) |
| **Production (Vercel)** | Dashboard Environment Variables | Encrypted and masked |

> ⚠️ **Critical Security Reminder:** Never push your .env.local file or raw API keys to a public GitHub repository. Doing so will expose your balance to automated scraping scripts that can drain your account funds within minutes.
> 
## About
Project developed as part of a technical assessment for — **Melo Associates**.
Built with passion by **Nicétas HOUESSOU** — *Full-Stack Developer & AI Enthusiast*.
> *"Creating is first and foremost about innovating — and if it brings a smile, that's even better."*
> 
## License
© 2026 Nicétas HOUESSOU — All rights reserved.
*Project developed for a technical test. Unauthorized redistribution is prohibited.*


### 
French
###


# 🎯 Interview Question Generator
Un outil propulsé par l'IA qui génère instantanément 3 questions d'entretien calibrées selon le rôle et le niveau d'expérience du candidat.
🔗 Live demo → [melo-associates-interview.vercel.app](https://melo-associates-interview.vercel.app)
## C'est quoi ce projet ?
Application web qui permet de générer en quelques secondes des questions d'entretien pertinentes pour n'importe quel poste tech.
Sélectionne un intitulé de poste, un niveau d'expérience et une langue — l'IA produit 3 questions ciblées : comportementale, technique et situationnelle.
## Fonctionnalités

| Fonctionnalité | Description |
| :--- | :--- |
| 🤖 **Génération IA** | Questions créées par l'intermédiaire d'OpenRouter en temps réel |
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
* **OpenRouter API** → Routage et accès aux modèles LLM (Claude 3.5 Haiku)
* **CSS-in-JS inline** → Styles sans dépendance externe
*Pas de backend. Pas de base de données. Pas de framework CSS. Un seul fichier composant React auto-suffisant.*
---
## 🔑 Guide Complet : Création et Configuration de la Clé API
L'application s'appuie sur la passerelle **OpenRouter** pour interroger les modèles d'intelligence artificielle de manière standardisée et fluide.
### Étape 1 : Obtenir une clé OpenRouter
1. Rendez-vous sur **[OpenRouter.ai](https://openrouter.ai/)**.
2. Connectez-vous ou créez un compte (via GitHub, Google ou email).
3. Accédez à votre tableau de bord dans l'onglet **Keys** (Clés d'API).
4. Cliquez sur **Create Key** (Créer une clé), attribuez-lui un nom (ex: `Melo Generator`) et définissez une limite optionnelle de budget.
5. **Copiez immédiatement la clé générée** (elle commence généralement par `sk-or-...`). *Attention : elle ne s'affichera plus jamais par la suite.*
6. Assurez-vous que votre compte dispose de crédits suffisants (ou utilisez le modèle gratuit de votre choix dans le code si nécessaire).
---
## 💻 Intégration dans l'Environnement de Développement
Le projet utilise **Vite**. Pour des raisons de sécurité, Vite exige que les variables d'environnement accessibles côté client soient préfixées par `VITE_`. La variable attendue par l'application s'appelle impérativement **`VITE_NVIDIA_API_KEY`**.
### 1. Configuration en Local (Développement)
Dans l'environnement de développement, la clé doit être stockée dans un fichier local qui est ignoré par Git.
1. À la racine du projet, créez un fichier nommé `.env.local` :
```bash
touch .env.local
```
 2. Ouvrez le fichier et ajoutez-y votre clé d'API OpenRouter sous cette forme exacte :
```env
VITE_NVIDIA_API_KEY=votre_cle_sk-or-v1-..._ici
```
 3. Sauvegardez le fichier. Le projet est configuré.
### 2. Configuration sur Vercel (Production)
Puisque le fichier .env.local n'est pas envoyé sur GitHub, il faut configurer la variable directement sur le tableau de bord de Vercel.
 1. Allez sur votre tableau de bord **Vercel** et sélectionnez votre projet.
 2. Accédez à l'onglet **Settings** ➔ **Environment Variables**.
 3. Dans le champ **Key**, inscrivez : VITE_NVIDIA_API_KEY
 4. Dans le champ **Value**, collez votre clé OpenRouter complète (sk-or-...).
 5. Cliquez sur **Add**.
 6. Pour appliquer le changement, allez dans l'onglet **Deployments**, cliquez sur les trois petits points de votre dernier build et sélectionnez **Redeploy**.
## 🚀 Lancer le projet en local
### Prérequis
 * Node.js LTS installé (v18+)
 * Votre clé VITE_NVIDIA_API_KEY configurée dans le fichier .env.local.
### Procédure d'exécution
```bash
# 1. Cloner le dépôt
git clone [https://github.com/Nice22/melo_associates_interview.git](https://github.com/Nice22/melo_associates_interview.git)
cd melo_associates_interview
# 2. Installer les dépendances Node
npm install
# 3. Lancer le serveur de développement local
npm run dev
```
Ouvrez votre navigateur sur **http://localhost:5173** ✅
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
| :--- | :--- | :--- |
| **Local** | .env.local | Sécurisé (Inclus d'office dans .gitignore) |
| **Production (Vercel)** | Dashboard Environment Variables | Chiffré et masqué |

> ⚠️ **Rappel de sécurité critique :** Ne poussez jamais votre fichier .env.local ou vos clés privées sur un dépôt public GitHub sous peine de voir votre solde consommé en quelques minutes par des scripts de scraping automatisés.
> 
## À propos
Projet réalisé dans le cadre d'un test technique — **Melo Associates**.
Construit avec passion par **Nicétas HOUESSOU** — *Full-Stack Developer & AI Enthusiast*.
> *"Créer c'est avant tout innover — et si ça passe par un sourire, c'est encore mieux."*
> 
## Licence
© 2026 Nicétas HOUESSOU — Tous droits réservés.
*Projet réalisé dans le cadre d'un test technique. Non autorisé à la redistribution.*

