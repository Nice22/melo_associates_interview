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

## 🔭 Roadmap & Known Improvements

These improvements were identified at the end of the project's delivery and are being tracked in separate branches. The goal is to keep the main branch clean and stable while integrating new features.

### `feature/job-title-filter` ← *In progress*
**Problem identified:** The app currently accepts any free-text input as a job title — including inappropriate, offensive, or non-professional entries (e.g. "robber", "hitman", "drug dealer"). The AI may generate questions for these inputs, which is not acceptable in a professional recruiting tool.

**Planned solution — two-layer protection:**

Layer 1 — Client-side filter (instant, before API call):
```js
const BLOCKED_TERMS = [
  "braqueur", "assassin", "dealer", "voleur",
  "robber", "thief", "killer", "drug", "terrorist", "hitman"
];

function isValidJobTitle(title) {
  const lower = title.toLowerCase();
  return !BLOCKED_TERMS.some(term => lower.includes(term));
}
```
If the title contains a blocked term → display a bilingual error message and abort the API call immediately.

Layer 2 — Prompt-level instruction (safety net): add an explicit instruction asking the model to refuse generation and return a structured error if the submitted role is not a legitimate professional position.

**Why a branch and not in the current version:** The blocklist requires careful curation to avoid false positives. It deserves its own PR with proper test cases rather than a rushed implementation.


### `feature/persistent-history`
Persist the generation history in `localStorage` so it survives page refreshes. Currently the history lives in React state only and is lost on reload.

### `feature/question-count-selector`
Let the user choose between 3, 5, or 10 questions per generation via a simple slider or toggle.

### `feature/export-pdf`
Allow users to export generated questions as a clean, formatted PDF — ready to use in actual interviews without any extra formatting work.


## About
Project developed as part of a technical assessment for — **Melo Associates**.
Built with passion by **Nicétas HOUESSOU** — *Full-Stack Developer & AI Enthusiast*.
> *"Creating is first and foremost about innovating — and if it brings a smile, that's even better."*
> 
## License
© 2026 Nicétas HOUESSOU — All rights reserved.
*Project developed for a technical test. Unauthorized redistribution is prohibited.*


