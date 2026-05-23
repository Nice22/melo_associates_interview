import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:            "#090b10",
  surface:       "rgba(255,255,255,0.03)",
  surfaceHover:  "rgba(255,255,255,0.05)",
  border:        "rgba(255,255,255,0.08)",
  borderHover:   "rgba(255,255,255,0.18)",
  borderFocus:   "rgba(110,231,183,0.5)",
  mint:          "#6ee7b7",
  blue:          "#93c5fd",
  rose:          "#f9a8d4",
  amber:         "#fcd34d",
  red:           "#fca5a5",
  textPrimary:   "rgba(255,255,255,0.88)",
  textSecondary: "rgba(255,255,255,0.42)",
  textMuted:     "rgba(255,255,255,0.2)",
};

// ─── Static data ──────────────────────────────────────────────────────────────
const Q_TYPES = [
  { label: { en: "Behavioral",  fr: "Comportementale" }, color: C.mint, bg: "rgba(110,231,183,0.08)" },
  { label: { en: "Technical",   fr: "Technique"        }, color: C.blue, bg: "rgba(147,197,253,0.08)" },
  { label: { en: "Situational", fr: "Situationnelle"   }, color: C.rose, bg: "rgba(249,168,212,0.08)" },
];

const ROLES = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "DevOps Engineer", "Technical Co-Founder", "Full-Stack Developer",
  "Backend Engineer", "Frontend Engineer", "Engineering Manager",
  "AI/ML Engineer", "Scrum Master", "QA Engineer", "Security Engineer",
  "Solutions Architect", "Developer Advocate",
];

const SENIORITY_LEVELS = [
  { value: "junior",    label: { en: "Junior",    fr: "Junior"    }, years: "0–2 yrs" },
  { value: "mid",       label: { en: "Mid-level", fr: "Confirmé"  }, years: "2–5 yrs" },
  { value: "senior",    label: { en: "Senior",    fr: "Senior"    }, years: "5–10 yrs" },
  { value: "principal", label: { en: "Principal", fr: "Principal" }, years: "10+ yrs" },
];

const MAX_HISTORY = 6;

const i18n = {
  en: {
    badge:         "AI · Live",
    title1:        "Interview Question",
    title2:        "Generator",
    subtitle:      "Select a role, seniority level, and language — get 3 sharp questions instantly.",
    jobLabel:      "Job Title",
    seniorLabel:   "Seniority Level",
    placeholder:   "e.g. AI Research Engineer, Growth Lead…",
    generate:      "Generate Questions",
    generating:    "Generating…",
    craftingFor:   (r, s) => `Crafting ${s} questions for ${r}…`,
    copyAll:       "Copy all",
    copiedAll:     "✓ All copied",
    regenerate:    "↺ Regenerate",
    copy:          "Copy",
    copied:        "✓ Copied",
    tip:           'Tip: Add stack or context for sharper results — try "Senior Backend · Node.js & PostgreSQL".',
    recentLabel:   "Recent",
    restore:       "Restore →",
    errTitle:      "Generation failed",
    emptyTitle:    "Ready to generate",
    emptyBody:     "Select a role and seniority level to generate 3 tailored interview questions.",
    diffEasy:      "Easy",
    diffMed:       "Medium",
    diffHard:      "Hard",
    customRole:    "✏️  Custom role…",
    selectRole:    "Select a role…",
  },
  fr: {
    badge:         "IA · Live",
    title1:        "Générateur de",
    title2:        "Questions d'entretien",
    subtitle:      "Sélectionne un rôle, un niveau et une langue — 3 questions précises en secondes.",
    jobLabel:      "Intitulé du poste",
    seniorLabel:   "Niveau d'expérience",
    placeholder:   "ex. Ingénieur IA, Lead Growth, Architecte Cloud…",
    generate:      "Générer les questions",
    generating:    "Génération…",
    craftingFor:   (r, s) => `Génération des questions ${s} pour ${r}…`,
    copyAll:       "Tout copier",
    copiedAll:     "✓ Copié",
    regenerate:    "↺ Régénérer",
    copy:          "Copier",
    copied:        "✓ Copié",
    tip:           'Conseil : Ajoute la stack ou le contexte — ex. "Backend Senior · Node.js & PostgreSQL".',
    recentLabel:   "Récents",
    restore:       "Restaurer →",
    errTitle:      "Échec de génération",
    emptyTitle:    "Prêt à générer",
    emptyBody:     "Sélectionne un rôle et un niveau d'expérience pour obtenir 3 questions sur mesure.",
    diffEasy:      "Facile",
    diffMed:       "Moyen",
    diffHard:      "Difficile",
    customRole:    "✏️  Rôle personnalisé…",
    selectRole:    "Sélectionne un rôle…",
  },
};

// ─── Bilingual difficulty heuristic ──────────────────────────────────────────
const DIFF_KEYWORDS = {
  hard: ["architect", "trade-off", "tradeoff", "scale", "production", "failure",
         "critical", "ambiguous", "conflict", "strategy", "vision", "stakeholder",
         "architecturer", "arbitrage", "scalabilité", "production", "échec",
         "critique", "ambigu", "conflit", "stratégie", "parties prenantes"],
  easy: ["describe", "tell me", "what is", "have you", "do you", "example of",
         "décris", "parle-moi", "qu'est-ce", "avez-vous", "as-tu", "exemple de"],
};

function getDifficulty(question, lang) {
  const q = question.toLowerCase();
  const hardScore = DIFF_KEYWORDS.hard.filter(w => q.includes(w)).length;
  const easyScore = DIFF_KEYWORDS.easy.filter(w => q.includes(w)).length;
  const t = i18n[lang];
  if (hardScore >= 2 || question.length > 200) return { label: t.diffHard, color: C.rose };
  if (easyScore >= 2 || question.length < 90)  return { label: t.diffEasy, color: C.mint };
  return { label: t.diffMed, color: C.amber };
}

// ─── JSON extractor (3-pass, robust) ─────────────────────────────────────────
function extractJsonArray(raw) {
  const candidates = [
    raw,
    raw.replace(/```(?:json)?[\s\S]*?```/g, "").trim(),
    (raw.match(/\[[\s\S]*?\]/) || [])[0],
  ];
  for (const s of candidates) {
    if (!s) continue;
    try {
      const p = JSON.parse(s);
      if (Array.isArray(p) && p.length > 0) return p;
    } catch { /* intentionally empty — try next candidate */ } // eslint-disable-line no-empty
  }
  throw new Error("Could not parse the API response. Please try again.");
}

// ─── API call with AbortController (Gemini) ──────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // ← ✏️ remplace par ta clé Google AI Studio

async function fetchQuestions(jobTitle, lang, seniority, signal) {
  const seniorityNote = {
    junior:    { en: "Entry-level candidate (0-2 years). Focus on fundamentals, learning mindset, and potential.", fr: "Candidat junior (0-2 ans). Focus sur les fondamentaux, la curiosité et le potentiel." },
    mid:       { en: "Mid-level candidate (2-5 years). Expect ownership of tasks and some cross-team collaboration.", fr: "Candidat confirmé (2-5 ans). Attendu : autonomie sur les tâches et quelques collaborations transverses." },
    senior:    { en: "Senior candidate (5-10 years). Expect deep technical expertise, mentoring ability, and systems thinking.", fr: "Candidat senior (5-10 ans). Attendu : expertise technique profonde, capacité de mentorat et vision système." },
    principal: { en: "Principal/Staff level (10+ years). Expect org-wide impact, technical vision, and executive communication.", fr: "Niveau Principal/Staff (10+ ans). Attendu : impact organisationnel, vision technique et communication exécutive." },
  };

  const note = seniorityNote[seniority][lang];
  const isEn = lang === "en";

  const prompt = isEn
    ? `You are a senior technical recruiter with 15+ years of experience.

Role: "${jobTitle}"
Candidate level: ${seniority.toUpperCase()} — ${note}

Generate exactly 3 interview questions:
Q1 → Behavioral: past experience — how they handled a real situation relevant to this role
Q2 → Technical: depth of knowledge or problem-solving directly tied to "${jobTitle}"
Q3 → Situational: a hypothetical challenge calibrated to the ${seniority} level

Rules:
- Calibrate complexity precisely to the ${seniority} level — not too easy, not impossible
- Each question must be specific and non-trivial
- No clichés. Nothing generic.
- Questions must feel like they come from an expert interviewer who deeply knows this role

Reply ONLY with a valid JSON array of exactly 3 strings. Zero preamble. Zero markdown.
["Q1?", "Q2?", "Q3?"]`
    : `Tu es un recruteur technique senior avec 15+ ans d'expérience.

Poste : "${jobTitle}"
Niveau candidat : ${seniority.toUpperCase()} — ${note}

Génère exactement 3 questions d'entretien :
Q1 → Comportementale : expérience passée — comment le candidat a géré une vraie situation liée à ce rôle
Q2 → Technique : profondeur de connaissance ou résolution de problème directement liée à "${jobTitle}"
Q3 → Situationnelle : un défi hypothétique calibré au niveau ${seniority}

Règles :
- Calibre la complexité précisément au niveau ${seniority} — ni trop facile, ni impossible
- Chaque question doit être spécifique et non triviale
- Aucun cliché. Rien de générique.
- Les questions doivent sembler venir d'un intervieweur expert qui connaît profondément ce rôle

Réponds UNIQUEMENT avec un tableau JSON valide de 3 chaînes. Zéro préambule. Zéro markdown.
["Q1 ?", "Q2 ?", "Q3 ?"]`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 900 },
      }),
    }
  );

  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try { const e = await res.json(); msg = e?.error?.message || msg; } catch { /* use default msg */ } // eslint-disable-line no-empty
    throw new Error(msg);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  if (!raw) throw new Error("Empty response from API.");

  const questions = extractJsonArray(raw);
  if (questions.length < 3) throw new Error("API returned fewer than 3 questions. Please retry.");
  return questions.slice(0, 3).map(String);
}

// ─── useCopy (memory-leak-safe) ───────────────────────────────────────────────
function useCopy(getText) {
  const [copied, setCopied] = useState(false);
  const timerRef  = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const text = typeof getText === "function" ? getText() : getText;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
    if (!mountedRef.current) return;
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) setCopied(false);
    }, 2200);
  }, [getText]);

  return { copied, copy };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "20px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)", animation: "shimmer 1.4s infinite" }} />
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <div style={{ width: "80px", height: "20px", borderRadius: "20px", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ width: "50px", height: "20px", borderRadius: "20px", background: "rgba(255,255,255,0.04)" }} />
      </div>
      {[100, 88, 64].map((w, i) => (
        <div key={i} style={{ height: "13px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", width: `${w}%`, marginBottom: i < 2 ? "8px" : 0 }} />
      ))}
    </div>
  );
}

function QuestionCard({ index, question, visible, lang }) {
  const type = Q_TYPES[index];
  const diff = getDifficulty(question, lang);
  const { copied, copy } = useCopy(question);
  const t = i18n[lang];

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.4s ease ${index * 0.13}s, transform 0.4s ease ${index * 0.13}s`,
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "14px", padding: "20px 22px", position: "relative",
    }}>
      <div style={{ position: "absolute", left: 0, top: "14px", bottom: "14px", width: "3px", background: type.color, borderRadius: "0 3px 3px 0" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {[{ label: type.label[lang], color: type.color, bg: type.bg }, { label: diff.label, color: diff.color, bg: `${diff.color}14` }].map(({ label, color, bg }) => (
            <span key={label} style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color, background: bg, padding: "3px 9px", borderRadius: "20px" }}>{label}</span>
          ))}
          <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: "monospace" }}>Q{index + 1}</span>
        </div>
        <button onClick={copy} style={{ background: copied ? "rgba(110,231,183,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${copied ? "rgba(110,231,183,0.25)" : C.border}`, borderRadius: "6px", color: copied ? C.mint : C.textSecondary, fontSize: "11px", padding: "3px 9px", cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap", flexShrink: 0 }}>
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <p style={{ margin: 0, fontSize: "14.5px", lineHeight: "1.72", color: C.textPrimary }}>{question}</p>
    </div>
  );
}

function Dropdown({ value, onChange, disabled, placeholder, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const selectedLabel = items.find(i => i.value === value)?.label ?? placeholder;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        aria-haspopup="listbox" aria-expanded={open}
        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${open ? C.borderFocus : C.border}`, borderRadius: "10px", color: value ? C.textPrimary : C.textSecondary, fontSize: "15px", padding: "12px 40px 12px 14px", textAlign: "left", cursor: disabled ? "not-allowed" : "pointer", transition: "border-color 0.18s", position: "relative" }}
      >
        {selectedLabel}
        <span style={{ position: "absolute", right: "14px", top: "50%", transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: "transform 0.2s", color: C.textSecondary, fontSize: "9px", pointerEvents: "none" }}>▼</span>
      </button>
      {open && (
        <ul role="listbox" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 300, background: "#161920", border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden auto", boxShadow: "0 20px 52px rgba(0,0,0,0.65)", maxHeight: "260px", margin: 0, padding: 0, listStyle: "none" }}>
          {items.map(item => (
            <li key={item.value} role="option" aria-selected={item.value === value}>
              <button
                onClick={() => { onChange(item.value); setOpen(false); }}
                style={{ width: "100%", background: item.value === value ? "rgba(110,231,183,0.07)" : "transparent", border: "none", borderBottom: `1px solid rgba(255,255,255,0.04)`, color: item.accent ? C.mint : C.textPrimary, fontSize: "14px", padding: "11px 16px", textAlign: "left", cursor: "pointer" }}
                onMouseEnter={e => { if (item.value !== value) e.currentTarget.style.background = C.surfaceHover; }}
                onMouseLeave={e => { if (item.value !== value) e.currentTarget.style.background = "transparent"; }}
              >
                {item.label}
                {item.sub && <span style={{ marginLeft: "8px", fontSize: "11px", color: C.textMuted }}>{item.sub}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LangToggle({ lang, onChange }) {
  return (
    <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "3px", gap: "2px" }}>
      {["en", "fr"].map(l => (
        <button key={l} onClick={() => onChange(l)} style={{ padding: "4px 10px", borderRadius: "6px", border: "none", background: lang === l ? "rgba(110,231,183,0.15)" : "transparent", color: lang === l ? C.mint : C.textSecondary, fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.18s", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</button>
      ))}
    </div>
  );
}

function HistoryPanel({ history, onRestore, lang }) {
  const t = i18n[lang];
  if (history.length === 0) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "18px 20px", marginBottom: "20px" }}>
      <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 600, color: C.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>
        {t.recentLabel} · {history.length}/{MAX_HISTORY}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {history.map(entry => (
          <button
            key={entry.id}
            onClick={() => onRestore(entry)}
            style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: "8px", padding: "9px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.surfaceHover; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: C.textPrimary }}>{entry.role}</span>
              <span style={{ fontSize: "10px", color: entry.seniority === "junior" ? C.mint : entry.seniority === "principal" ? C.rose : C.amber, background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "0.07em" }}>{entry.seniority}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: "monospace" }}>{entry.lang.toUpperCase()}</span>
              <span style={{ fontSize: "11px", color: C.textMuted }}>{new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              <span style={{ fontSize: "11px", color: C.mint }}>{t.restore}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ lang }) {
  const t = i18n[lang];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: "14px", textAlign: "center" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(110,231,183,0.06)", border: `1px solid rgba(110,231,183,0.14)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🎯</div>
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: C.textSecondary }}>{t.emptyTitle}</p>
      <p style={{ margin: 0, fontSize: "13px", color: C.textMuted, lineHeight: 1.65, maxWidth: "280px" }}>{t.emptyBody}</p>
      <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", justifyContent: "center", marginTop: "4px" }}>
        {Q_TYPES.map(qt => (
          <span key={qt.label.en} style={{ fontSize: "11px", color: qt.color, background: qt.bg, padding: "3px 10px", borderRadius: "20px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>{qt.label[lang]}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [jobTitle,      setJobTitle]      = useState("");
  const [customTitle,   setCustomTitle]   = useState("");
  const [lang,          setLang]          = useState("en");
  const [seniority,     setSeniority]     = useState("mid");
  const [questions,     setQuestions]     = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [showCards,     setShowCards]     = useState(false);
  const [generatedFor,  setGeneratedFor]  = useState({ role: "", seniority: "", lang: "" });
  const [history,       setHistory]       = useState([]);

  const customRef  = useRef(null);
  const abortRef   = useRef(null);  // AbortController ref — prevents race conditions

  const activeTitle = (jobTitle === "__custom__" ? customTitle : jobTitle).trim();
  const canSubmit   = activeTitle.length > 0 && !loading;
  const t           = i18n[lang];

  // Dropdown items — memoized to avoid recreating on every render
  const roleItems = useMemo(() => [
    ...ROLES.map(r => ({ value: r, label: r })),
    { value: "__custom__", label: t.customRole, accent: true },
  ], [t.customRole]);

  // Auto-focus custom input when it appears
  useEffect(() => {
    if (jobTitle === "__custom__") customRef.current?.focus();
  }, [jobTitle]);

  // Animate cards via rAF (not setTimeout)
  useEffect(() => {
    if (questions.length === 3) {
      const id = requestAnimationFrame(() => setShowCards(true));
      return () => cancelAnimationFrame(id);
    }
  }, [questions]);

  // Cancel any in-flight request on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleGenerate = useCallback(async () => {
    if (!canSubmit) return;

    // Cancel previous in-flight request (race condition fix)
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const title = activeTitle;
    setLoading(true);
    setError("");
    setShowCards(false);
    setQuestions([]);
    setGeneratedFor({ role: title, seniority, lang });

    try {
      const qs = await fetchQuestions(title, lang, seniority, abortRef.current.signal);
      setQuestions(qs);
      setHistory(prev => {
        const entry = { id: Date.now(), role: title, lang, seniority, questions: qs, ts: Date.now() };
        const deduped = prev.filter(h => !(h.role === title && h.lang === lang && h.seniority === seniority));
        return [entry, ...deduped].slice(0, MAX_HISTORY);
      });
    } catch (err) {
      if (err.name === "AbortError") return; // silently ignore cancelled requests
      setError(err.message || "Something went wrong. Please try again.");
      setGeneratedFor({ role: "", seniority: "", lang: "" });
    } finally {
      setLoading(false);
    }
  }, [canSubmit, activeTitle, lang, seniority]);

  const handleRestore = useCallback(entry => {
    const inList = ROLES.includes(entry.role);
    setJobTitle(inList ? entry.role : "__custom__");
    if (!inList) setCustomTitle(entry.role);
    setLang(entry.lang);
    setSeniority(entry.seniority);
    setQuestions(entry.questions);
    setGeneratedFor({ role: entry.role, seniority: entry.seniority, lang: entry.lang });
    setError("");
    setShowCards(false);
    requestAnimationFrame(() => setShowCards(true));
  }, []);

  // Stable getText ref for copyAll — avoids unstable useCallback dependency
  const copyAllTextRef = useRef("");
  useEffect(() => {
    copyAllTextRef.current =
      `Interview Questions — ${generatedFor.role} [${generatedFor.lang.toUpperCase()}] · ${generatedFor.seniority}\n\n` +
      questions.map((q, i) => `${Q_TYPES[i].label[generatedFor.lang || "en"]} (Q${i + 1}):\n${q}`).join("\n\n");
  }, [questions, generatedFor]);

  const { copied: copiedAll, copy: copyAll } = useCopy(useCallback(() => copyAllTextRef.current, []));

  const hasResults  = questions.length === 3 && !loading;
  const isFirstLoad = questions.length === 0 && !loading && !error;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "48px 16px 100px", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
        html, body, #root { margin: 0; padding: 0; width: 100%; }
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        button:focus-visible { outline: 2px solid #6ee7b7; outline-offset: 3px; border-radius: 4px; }
        input:focus { outline: none; }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>

      <div style={{ width: "100%", maxWidth: "620px" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(110,231,183,0.07)", border: "1px solid rgba(110,231,183,0.16)", borderRadius: "20px", padding: "5px 13px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.mint, display: "inline-block", boxShadow: "0 0 8px rgba(110,231,183,0.8)", animation: "pulse 2.5s ease-in-out infinite" }} />
              <span style={{ fontSize: "10px", color: C.mint, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono',monospace" }}>{t.badge}</span>
            </div>
            <LangToggle lang={lang} onChange={l => { setLang(l); setError(""); }} />
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "30px", fontWeight: 700, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.028em" }}>
            {t.title1}<br />
            <span style={{ color: "rgba(255,255,255,0.28)", fontWeight: 300 }}>{t.title2}</span>
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: C.textSecondary, lineHeight: 1.65, maxWidth: "380px" }}>{t.subtitle}</p>
        </div>

        {/* History */}
        <HistoryPanel history={history} onRestore={handleRestore} lang={lang} />

        {/* Form */}
        <div style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${C.border}`, borderRadius: "18px", padding: "24px", marginBottom: "24px" }}>
          {/* Job title */}
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: C.textSecondary, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "10px" }}>{t.jobLabel}</label>
          <Dropdown value={jobTitle} onChange={v => { setJobTitle(v); setError(""); }} disabled={loading} placeholder={t.selectRole} items={roleItems} />
          {jobTitle === "__custom__" && (
            <input
              ref={customRef} type="text" placeholder={t.placeholder}
              value={customTitle} maxLength={80}
              onChange={e => { setCustomTitle(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && canSubmit && handleGenerate()}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid rgba(110,231,183,0.28)`, borderRadius: "10px", color: "#fff", fontSize: "15px", padding: "12px 14px", marginTop: "10px", transition: "border-color 0.18s" }}
              onFocus={e => e.target.style.borderColor = C.borderFocus}
              onBlur={e => e.target.style.borderColor = "rgba(110,231,183,0.28)"}
            />
          )}

          {/* Seniority */}
          <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: C.textSecondary, letterSpacing: "0.09em", textTransform: "uppercase", margin: "16px 0 10px" }}>{t.seniorLabel}</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
            {SENIORITY_LEVELS.map(s => {
              const active = seniority === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => { setSeniority(s.value); setError(""); }}
                  disabled={loading}
                  style={{ padding: "9px 6px", border: `1px solid ${active ? C.mint : C.border}`, borderRadius: "10px", background: active ? "rgba(110,231,183,0.08)" : "transparent", color: active ? C.mint : C.textSecondary, fontSize: "12px", fontWeight: active ? 600 : 400, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.18s", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}
                  onMouseEnter={e => { if (!active && !loading) e.currentTarget.style.borderColor = C.borderHover; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border; }}
                >
                  <span>{s.label[lang]}</span>
                  <span style={{ fontSize: "10px", color: C.textMuted, fontFamily: "monospace" }}>{s.years}</span>
                </button>
              );
            })}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate} disabled={!canSubmit}
            style={{ width: "100%", padding: "13px", marginTop: "16px", background: canSubmit ? "linear-gradient(135deg,#6ee7b7,#3b82f6)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: canSubmit ? "#090b10" : "rgba(255,255,255,0.18)", fontSize: "15px", fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", transition: "opacity 0.18s, transform 0.1s", letterSpacing: "0.01em" }}
            onMouseDown={e => canSubmit && (e.currentTarget.style.transform = "scale(0.984)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >{loading ? t.generating : t.generate}</button>
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ textAlign: "center", marginBottom: "2px", fontSize: "13px", color: C.textSecondary }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "12px", height: "12px", border: `2px solid rgba(255,255,255,0.07)`, borderTop: `2px solid ${C.mint}`, borderRadius: "50%", display: "inline-block", animation: "spin 0.72s linear infinite" }} />
                {t.craftingFor(activeTitle, seniority)}
              </span>
            </div>
            {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.16)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: C.red, fontSize: "13px", lineHeight: 1.6, display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ flexShrink: 0, marginTop: "1px" }}>⚠</span>
            <div><strong style={{ display: "block", marginBottom: "3px" }}>{t.errTitle}</strong>{error}</div>
          </div>
        )}

        {/* Empty state */}
        {isFirstLoad && <EmptyState lang={lang} />}

        {/* Results */}
        {hasResults && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, fontFamily: "monospace" }}>
                {generatedFor.role} · {generatedFor.seniority} · {generatedFor.lang.toUpperCase()} · 3q
              </p>
              <div style={{ display: "flex", gap: "7px" }}>
                <button onClick={copyAll} style={{ background: copiedAll ? "rgba(110,231,183,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${copiedAll ? "rgba(110,231,183,0.25)" : C.border}`, borderRadius: "8px", color: copiedAll ? C.mint : C.textSecondary, fontSize: "12px", padding: "5px 12px", cursor: "pointer", transition: "all 0.18s" }}>
                  {copiedAll ? t.copiedAll : t.copyAll}
                </button>
                <button onClick={handleGenerate} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.textSecondary, fontSize: "12px", padding: "5px 12px", cursor: "pointer", transition: "all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textPrimary; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSecondary; }}
                >{t.regenerate}</button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {questions.map((q, i) => (
                <QuestionCard key={`${generatedFor.role}-${generatedFor.seniority}-${generatedFor.lang}-${i}`} index={i} question={q} visible={showCards} lang={generatedFor.lang} />
              ))}
            </div>

            <div style={{ marginTop: "20px", paddingTop: "18px", borderTop: `1px solid ${C.border}`, display: "flex", gap: "9px", alignItems: "flex-start" }}>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: C.mint, marginTop: "7px", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "11px", color: C.textMuted, lineHeight: 1.65 }}>{t.tip}</p>
            </div>
          </>
        )}

        <p style={{ marginTop: "56px", textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.1)", fontFamily: "'DM Mono',monospace", letterSpacing: "0.05em" }}>
          Powered by Claude AI · Melo Associates Technical Assessment
        </p>
      </div>
    </div>
  );
}