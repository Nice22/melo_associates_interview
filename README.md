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
```

* **Format des clés corrigé :** Remplacement des mentions de clés `sk-ant-...` (Anthropic) par des exemples cohérents avec OpenRouter (`sk-or-...`).
Ton dépôt est maintenant propre, professionnel et prêt à être livré !
```
