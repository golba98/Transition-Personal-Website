import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["Work", "#work"],
  ["GitHub", "#github"],
  ["Systems", "#systems"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

const projects = [
  {
    id: "01",
    title: "SynchroEdit",
    role: "Google-Docs-style collaborative editor",
    outcome:
      "A shared editor where multiple people type in the same document at the same time. Edits, cursors, and selections stay synced live, so the document state remains consistent even under concurrent typing.",
    stack: ["WebSockets", "Realtime Sync", "React", "Node.js"],
    tone: "cyan",
    preview: "editor",
  },
  {
    id: "02",
    title: "TryPOS Suite",
    role: "Business POS with invoicing, contracts, and stock control",
    outcome:
      "A point-of-sale system built for real day-to-day operations: invoice generation, contract generation, checkout flow, and inventory management in one place. Sales update stock levels automatically and every transaction leaves a clean business record.",
    stack: ["PHP", "SQL", "POS Workflows", "Inventory"],
    tone: "green",
    preview: "pos",
  },
  {
    id: "03",
    title: "Codexa",
    role: "Terminal-native ChatGPT experience for Codex CLI",
    outcome:
      "A developer product focused on CLI UX: a polished Codex interface for chatting with ChatGPT in the terminal. It is built around readable output hierarchy, cleaner interaction flow, and a modern terminal feel without breaking keyboard-first workflows.",
    stack: ["TypeScript", "Terminal UI", "ANSI", "DX"],
    tone: "amber",
    preview: "terminal",
  },
  {
    id: "04",
    title: "EduTool",
    role: "Interactive learning tools",
    outcome:
      "Interactive learning utilities for math and coding practice, built around immediate feedback loops. The focus is helping users understand mistakes while they work, not only showing final answers.",
    stack: ["Python", "JavaScript", "Learning Tools"],
    tone: "green",
    preview: "edu",
  },
  {
    id: "05",
    title: "GeoQuest 3D",
    role: "Unity geolocation game system",
    outcome:
      "A location-guessing game with explorable 3D scenes, round scoring, and location reveal flow. I built the gameplay loop in Unity and tuned the HUD so each round feels competitive and clear.",
    stack: ["Unity", "C#", "3D Interaction"],
    tone: "cyan",
    preview: "geoquest",
  },
  {
    id: "06",
    title: "RugbyMate",
    role: "Tournament operations tool",
    outcome:
      "Software I built to run a school rugby tournament across multiple teams. It handles fixtures, kickoff slots, and bracket updates so staff can coordinate the day from one dashboard.",
    stack: ["JavaScript", "Scheduling", "Operations"],
    tone: "amber",
    preview: "rugby",
  },
  {
    id: "07",
    title: "GameOpt",
    role: "Performance & setup tuning",
    outcome:
      "A practical performance lab for reducing input latency and improving frame stability. I used it to track Linux tuning experiments, hardware tradeoffs, and repeatable setup profiles.",
    stack: ["Linux", "Hardware", "Performance"],
    tone: "green",
    preview: "perf",
  },
];

const processSteps = [
  {
    title: "University of London BSc Computer Science",
    detail: "Enrolled full-time. Covers data structures, algorithms, web development, discrete math, and more.",
  },
  {
    title: "CS50 and Coursera courses",
    detail: "Completed CS50x. Also finished Coursera courses in cloud computing, calculus, and algorithms.",
  },
  {
    title: "Pam Golding Properties internship",
    detail: "Helped with listings, photography, documentation, and keeping day-to-day operations running.",
  },
  {
    title: "Programming team co-leader",
    detail: "Co-led the school programming team — ran sessions, helped debug, and kept the group moving through competition problems.",
  },
  {
    title: "Hospitality and summer crew work",
    detail: "Worked as a waiter and on a summer crew. Good for learning to stay calm, communicate clearly, and get on with it.",
  },
];

const capabilities = [
  "Python",
  "Java",
  "JavaScript",
  "PHP",
  "SQL",
  "React",
  "Node.js",
  "HTML",
  "CSS",
  "Git",
  "GitHub",
  "Docker",
  "Linux",
  "VS Code",
  "Unity",
  "Unreal Engine",
  "Database design",
  "Cybersecurity basics",
  "Game development",
  "AI / LLM experimentation",
  "Ollama",
  "LM Studio",
  "Algorithmic thinking",
  "PC building",
];

const profile = {
  name: "Jordan L Vorster",
  initials: "JV",
  location: "South Africa, Eastern Cape",
  role: "Computer Science student / developer",
  availability: "Seeking internship opportunities",
  education: "University of London BSc Computer Science",
  email: "jordanvorster404@gmail.com",
  resumeUrl: "/Resume.pdf",
};

const DEFAULT_GITHUB_USERNAME = "golba98";
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME?.trim() || DEFAULT_GITHUB_USERNAME;
const GITHUB_PROFILE_FALLBACK = `https://github.com/${GITHUB_USERNAME}`;
const REPO_CARD_LIMIT = 6;

function formatCount(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatRepoDate(value) {
  if (!value) return "Recently updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently updated";

  return `Updated ${new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

function normalizeGithubProfile(user) {
  return {
    login: user.login || GITHUB_USERNAME,
    name: user.name || "",
    bio: user.bio || "",
    url: user.html_url || user.url || GITHUB_PROFILE_FALLBACK,
    avatarUrl: user.avatar_url || user.avatarUrl || "",
    publicRepos: user.public_repos ?? user.publicRepos ?? 0,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    location: user.location || "",
  };
}

function normalizeGithubRepo(repo, isPinned = false) {
  return {
    name: repo.name,
    url: repo.html_url || repo.url,
    description: repo.description || "",
    language: repo.language || "",
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    stars: repo.stargazers_count ?? repo.stars ?? 0,
    forks: repo.forks_count ?? repo.forks ?? 0,
    watchers: repo.watchers_count ?? repo.watchers ?? 0,
    updatedAt: repo.updated_at || repo.updatedAt || "",
    pushedAt: repo.pushed_at || repo.pushedAt || "",
    homepage: repo.homepage || "",
    archived: Boolean(repo.archived),
    fork: Boolean(repo.fork),
    isPinned: Boolean(repo.isPinned || isPinned),
  };
}

async function fetchGithubRestFallback(signal) {
  const [profileResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      signal,
      headers: { Accept: "application/vnd.github+json" },
    }),
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`, {
      signal,
      headers: { Accept: "application/vnd.github+json" },
    }),
  ]);

  if (!profileResponse.ok || !reposResponse.ok) {
    throw new Error("GitHub REST fallback failed");
  }

  const [profileData, repoData] = await Promise.all([profileResponse.json(), reposResponse.json()]);

  return {
    profile: normalizeGithubProfile(profileData),
    repos: Array.isArray(repoData)
      ? repoData.filter((repo) => !repo.fork).slice(0, REPO_CARD_LIMIT).map((repo) => normalizeGithubRepo(repo))
      : [],
    source: "client-rest",
  };
}

function MagneticLink({ href, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const move = (event) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.22;
      gsap.to(node, { x, y, duration: 0.28, ease: "power3.out" });
    };

    const leave = () => gsap.to(node, { x: 0, y: 0, duration: 0.42, ease: "power3.out" });

    node.addEventListener("mousemove", move);
    node.addEventListener("mouseleave", leave);

    return () => {
      node.removeEventListener("mousemove", move);
      node.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className="magnetic-link">
      {children}
    </a>
  );
}

/* ─── Scene visual hero strip (upper ~38% of lens) ─── */
function ProjectVisual({ project, active }) {
  return (
    <div className={`project-visual tone-${project.tone} ${active ? "is-active" : ""}`}>
      <div className="pv-bg" />
      <div className="pv-grid" />
      <div className={`pv-hero pv-hero-${project.preview}`}>
        {project.preview === "editor" && (
          <>
            <div className="pvh-editor-lanes">
              <div className="pvh-lane pvh-lane-a" />
              <div className="pvh-lane pvh-lane-b" />
              <div className="pvh-lane pvh-lane-c" />
            </div>
            <div className="pvh-collab-dots">
              <span className="pvh-dot pvh-dot-cyan">J</span>
              <span className="pvh-dot pvh-dot-amber">M</span>
              <span className="pvh-connector" />
            </div>
            <div className="pvh-sync-ring" />
          </>
        )}
        {project.preview === "pos" && (
          <>
            <div className="pvh-pos-stack">
              <div className="pvh-pos-card pvh-pos-invoice">INV-432</div>
              <div className="pvh-pos-card pvh-pos-contract">CONTRACT</div>
              <div className="pvh-pos-card pvh-pos-stock">STOCK</div>
            </div>
            <div className="pvh-pos-signal" />
          </>
        )}
        {project.preview === "terminal" && (
          <>
            <div className="pvh-term-lines">
              <div className="pvh-tline pvh-tline-prompt">❯ refactor auth module</div>
              <div className="pvh-tline pvh-tline-ai">codexa  ›  pulling retry into withRetry(fn)</div>
              <div className="pvh-tline pvh-tline-code">  async function withRetry(fn, opts) …</div>
              <div className="pvh-tline pvh-tline-dim">  // intent preserved, backoff isolated</div>
            </div>
            <div className="pvh-term-cursor" />
          </>
        )}
        {project.preview === "edu" && (
          <>
            <div className="pvh-edu-bars">
              <div className="pvh-edu-bar" style={{ width: "88%", opacity: 0.9 }} />
              <div className="pvh-edu-bar" style={{ width: "72%", opacity: 0.75 }} />
              <div className="pvh-edu-bar pvh-edu-bar-active" style={{ width: "57%" }} />
            </div>
            <div className="pvh-edu-pass-fail">
              <span className="pvh-pass">✓</span>
              <span className="pvh-pass">✓</span>
              <span className="pvh-pass">✓</span>
              <span className="pvh-fail">✗</span>
            </div>
          </>
        )}
        {project.preview === "geoquest" && (
          <>
            <div className="pvh-geo-horizon" />
            <div className="pvh-geo-crosshair">
              <span /><span /><span />
            </div>
            <div className="pvh-geo-hud">
              <div className="pvh-geo-pill">Round 4/5</div>
              <div className="pvh-geo-pill pvh-geo-pill-score">2,450 pts</div>
            </div>
          </>
        )}
        {project.preview === "rugby" && (
          <>
            <div className="pvh-rugby-bracket">
              <div className="pvh-rb-match pvh-rb-live">Grey 21–17 Framesby</div>
              <div className="pvh-rb-match">Pearson — vs — Hudson Park</div>
              <div className="pvh-rb-match pvh-rb-next">Selborne — vs — Dale</div>
            </div>
          </>
        )}
        {project.preview === "perf" && (
          <>
            <div className="pvh-perf-bars">
              {[42, 38, 46, 39, 41, 52, 37, 44, 36, 48, 39, 42].map((h, i) => (
                <div key={i} className="pvh-perf-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="pvh-perf-stat">
              <span className="pvh-perf-val pvh-green">6.8ms</span>
              <span className="pvh-perf-label">input latency</span>
            </div>
          </>
        )}
      </div>
      <div className="pv-corner pv-corner-tl" />
      <div className="pv-corner pv-corner-tr" />
      <div className="pv-corner pv-corner-bl" />
      <div className="pv-corner pv-corner-br" />
      <div className="pv-scanline" />
      <div className="pv-flash" />
    </div>
  );
}

/* ─── Project preview panels ─── */

function EditorPreview() {
  return (
    <div className="aw aw-editor" aria-hidden="true">
      {/* Chrome bar — collab presence lives here */}
      <div className="aw-chrome">
        <div className="aw-dots"><i /><i /><i /></div>
        <div className="aw-tab">
          <span className="aw-tab-dot aw-tab-dot-a" />
          project-notes.md
        </div>
        <div className="aw-tab">
          <span className="aw-tab-dot aw-tab-dot-b" />
          design-brief.md
        </div>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-cyan">● Jordan</span>
          <span className="aw-badge aw-badge-amber">● Mia</span>
          <span className="aw-meta">2 live</span>
        </div>
      </div>

      {/* Full-width document canvas — no sidebar */}
      <div className="aw-body awd-canvas">
        <div className="awd-ruler">1&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;4&nbsp;&nbsp;&nbsp;5&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;&nbsp;7</div>
        <div className="awd-h1">Introduction<span className="awd-caret awd-caret-a" /></div>
        <div className="awd-p">This document outlines the real-time collaboration</div>
        <div className="awd-p">approach used in SynchroEdit. Two or more users can</div>
        <div className="awd-p">type in the same file simultaneously — edits are merged</div>
        <div className="awd-p awd-selected">on every keystroke using operational transforms.<span className="awd-caret awd-caret-b" /></div>
        <div className="awd-br" />
        <div className="awd-h2">Problem statement</div>
        <div className="awd-p awd-muted">Classic conflict: two users change the same line at</div>
        <div className="awd-p awd-muted">the same time. Who wins? OT resolves this by tracking</div>
        <div className="awd-p awd-muted">intent, not just position.</div>
        <div className="awd-br" />
        <div className="awd-h2">Design decisions</div>
        <div className="awd-p awd-muted">Operational transforms preserve each user's intent</div>
        <div className="awd-p awd-muted">even under concurrent edits at the same offset.</div>
        <div className="awd-activity">
          <div className="awd-activity-item">
            <span className="awd-act-dot awd-act-dot-cyan" />
            Jordan inserted 3 chars at L14
          </div>
          <div className="awd-activity-item">
            <span className="awd-act-dot awd-act-dot-amber" />
            Mia selected paragraph 2
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="aw-statusbar">
        <span>Ln 14, Col 38</span>
        <span>UTF-8</span>
        <span className="aws-sync">⟳ Synced</span>
        <span className="aws-dot-sep" />
        <span className="aws-users-live">2 users connected</span>
        <span className="aws-latency">12ms</span>
      </div>
    </div>
  );
}

function PosPreview() {
  return (
    <div className="aw aw-pos" aria-hidden="true">
      <div className="aw-chrome">
        <div className="aw-dots"><i /><i /><i /></div>
        <span className="aw-title">TryPOS Suite — INV-00432</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-amber">Pending</span>
          <span className="aw-badge aw-badge-green">● Live</span>
        </div>
      </div>

      {/* KPI bar — full-width, no sidebar */}
      <div className="awpos-kpi-bar">
        <div className="awpos-kpi-item">
          <span className="awpos-kpi-label">Today's sales</span>
          <span className="awpos-kpi-value awpos-green">R 8,420</span>
        </div>
        <div className="awpos-kpi-divider" />
        <div className="awpos-kpi-item">
          <span className="awpos-kpi-label">Invoices out</span>
          <span className="awpos-kpi-value">3</span>
        </div>
        <div className="awpos-kpi-divider" />
        <div className="awpos-kpi-item">
          <span className="awpos-kpi-label">Low stock alerts</span>
          <span className="awpos-kpi-value awpos-amber">4</span>
        </div>
        <div className="awpos-kpi-divider" />
        <div className="awpos-kpi-item">
          <span className="awpos-kpi-label">Stock items</span>
          <span className="awpos-kpi-value">84</span>
        </div>
      </div>

      {/* POS terminal: cart left, totals right */}
      <div className="aw-body awpos-terminal">
        <div className="awpos-cart">
          <div className="awpos-cart-head">
            <span>Item</span>
            <span>Qty</span>
            <span>Total</span>
          </div>
          <div className="awpos-cart-item">
            <span>Ceramic mug · 6pk</span>
            <span>× 2</span>
            <span>R 540.00</span>
          </div>
          <div className="awpos-cart-item">
            <span>House blend · 250g</span>
            <span>× 1</span>
            <span>R 189.00</span>
          </div>
          <div className="awpos-cart-item awpos-cart-item-highlight">
            <span>Service contract</span>
            <span>× 1</span>
            <span>R 1 200.00</span>
          </div>
          <div className="awpos-cart-spacer" />
          <div className="awpos-sub-row">
            <span>Subtotal</span>
            <span>R 1 929.00</span>
          </div>
          <div className="awpos-sub-row">
            <span>VAT 15%</span>
            <span>R 289.35</span>
          </div>
        </div>

        <div className="awpos-totals-panel">
          <div className="awpos-total-label">Total due</div>
          <div className="awpos-total-hero">R 2 218.35</div>
          <div className="awpos-total-meta">Generated 18 Apr 2026 · Net 30</div>
          <div className="awpos-actions">
            <button className="awpos-btn awpos-btn-primary">Generate PDF</button>
            <button className="awpos-btn">Save contract</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="aw aw-terminal" aria-hidden="true">
      <div className="aw-chrome aw-chrome-dark">
        <div className="aw-dots"><i className="aw-dot-red"/><i className="aw-dot-yellow"/><i className="aw-dot-green"/></div>
        <span className="aw-title">codexa — ~/projects/auth-service</span>
        <div className="aw-chrome-right">
          <span className="awt-model">gpt-4o</span>
          <span className="aw-badge aw-badge-green">● Connected</span>
        </div>
      </div>

      {/* Full-width chat — no sidebar */}
      <div className="aw-body awt-full-term">
        <div className="awt-msg awt-user">
          <span className="awt-role">you</span>
          <div className="awt-bubble awt-bubble-user">
            refactor this so the retry logic is in its own helper
          </div>
        </div>

        <div className="awt-msg awt-ai">
          <span className="awt-role awt-role-ai">codexa</span>
          <div className="awt-bubble awt-bubble-ai">
            <div>Pull the retry into <code>withRetry(fn, opts)</code> and call it from the handler — keeps the call site focused on intent, not on backoff logic.</div>
          </div>
        </div>

        <div className="awt-code-block">
          <div className="awt-code-head">
            <span className="awt-code-lang">ts</span>
            <span>suggestion.ts</span>
            <span className="awt-code-copy">copy</span>
          </div>
          <pre>{`async function withRetry(fn, { max = 3 }) {
  for (let i = 0; i < max; i++) {
    try { return await fn(); }
    catch (e) { if (i === max-1) throw e; }
  }
}

// handler is now clean:
export async function fetchUser(id: string) {
  return withRetry(() => db.users.findById(id));
}`}</pre>
        </div>

        <div className="awt-composer">
          <span className="awt-prompt-icon">❯</span>
          <span className="awt-placeholder">Ask anything<span className="awt-cursor" /></span>
        </div>
      </div>
    </div>
  );
}

function EduPreview() {
  return (
    <div className="aw aw-edu" aria-hidden="true">
      <div className="aw-chrome">
        <div className="aw-dots"><i /><i /><i /></div>
        <span className="aw-title">EduTool · Recursion</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-green">4 / 7 passing</span>
        </div>
      </div>

      {/* Full-width challenge card — no sidebar */}
      <div className="aw-body awedu-challenge">
        {/* Inline progress strip */}
        <div className="awedu-progress-strip">
          <div className="awedu-prog-item">
            <span className="awedu-prog-label">DS</span>
            <div className="awedu-prog-bar"><div style={{ width: "88%" }} /></div>
          </div>
          <div className="awedu-prog-item">
            <span className="awedu-prog-label">Algo</span>
            <div className="awedu-prog-bar"><div style={{ width: "72%" }} /></div>
          </div>
          <div className="awedu-prog-item awedu-prog-active">
            <span className="awedu-prog-label">Rec</span>
            <div className="awedu-prog-bar awedu-prog-bar-active"><div style={{ width: "57%" }} /></div>
          </div>
          <div className="awedu-prog-item">
            <span className="awedu-prog-label">Sort</span>
            <div className="awedu-prog-bar"><div style={{ width: "0%" }} /></div>
          </div>
          <div className="awedu-prog-item">
            <span className="awedu-prog-label">Graph</span>
            <div className="awedu-prog-bar"><div style={{ width: "0%" }} /></div>
          </div>
        </div>

        <div className="awedu-exercise-label">Exercise 04 · Recursion</div>
        <div className="awedu-task">Write a recursive factorial function in Python.</div>

        <pre className="awedu-code">
{`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`}
        </pre>

        {/* Horizontal test row */}
        <div className="awedu-tests-row">
          <div className="awedu-test awedu-pass">
            <span className="awedu-icon">✓</span>
            <span>f(0)==1</span>
          </div>
          <div className="awedu-test awedu-pass">
            <span className="awedu-icon">✓</span>
            <span>f(5)==120</span>
          </div>
          <div className="awedu-test awedu-pass">
            <span className="awedu-icon">✓</span>
            <span>f(1)==1</span>
          </div>
          <div className="awedu-test awedu-fail">
            <span className="awedu-icon">✗</span>
            <span>negative</span>
          </div>
        </div>

        <div className="awedu-feedback">
          add a guard for <code>n {"<"} 0</code> to handle edge cases.
        </div>
      </div>
    </div>
  );
}

function GeoQuestPreview() {
  return (
    <div className="aw aw-geo" aria-hidden="true">
      <div className="aw-geo-scene">
        <div className="awg-sky" />
        <div className="awg-horizon" />
        <div className="awg-ground" />

        {/* Atmospheric depth layers */}
        <div className="awg-depth-a" />
        <div className="awg-depth-b" />

        {/* HUD top */}
        <div className="awg-hud-top">
          <div className="awg-hud-pill">
            <span className="awg-label">Round</span>
            <strong>4 / 5</strong>
          </div>
          <div className="awg-hud-pill awg-score">
            <span className="awg-label">Score</span>
            <strong>2,450 pts</strong>
          </div>
          <div className="awg-hud-pill">
            <span className="awg-label">Timer</span>
            <strong>0:42</strong>
          </div>
        </div>

        {/* Crosshair */}
        <div className="awg-crosshair">
          <span className="awg-ch-h" /><span className="awg-ch-v" />
          <span className="awg-ch-ring" />
          <span className="awg-ch-dot" />
        </div>

        {/* Bearing label */}
        <div className="awg-bearing">N 34° E · 142m</div>

        {/* Location tag */}
        <div className="awg-location-tag">Coastline · Eastern Cape</div>

        {/* Minimap */}
        <div className="awg-minimap">
          <div className="awg-minimap-label">Map</div>
          <div className="awg-pin" />
        </div>
      </div>

      {/* Result card */}
      <div className="awg-result-card">
        <div className="awg-result-header">
          <span>Guess placed</span>
          <span className="awg-result-dist">62 km off</span>
        </div>
        <div className="awg-result-body">
          <div className="awg-result-row">
            <span>Your guess</span>
            <strong>Port Alfred</strong>
          </div>
          <div className="awg-result-row">
            <span>Actual location</span>
            <strong>Kenton-on-Sea</strong>
          </div>
          <div className="awg-result-row">
            <span>Points awarded</span>
            <strong className="awg-pts">+820 pts</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function RugbyPreview() {
  return (
    <div className="aw aw-rugby" aria-hidden="true">
      <div className="aw-chrome">
        <div className="aw-dots"><i /><i /><i /></div>
        <span className="aw-title">RugbyMate</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-amber">● Day 1 Live</span>
        </div>
      </div>

      {/* Tournament header — full-width, no sidebar */}
      <div className="awrug-header">
        <div className="awrug-header-main">
          <span className="awrug-title">Saturday · Pool Stage</span>
          <div className="awrug-stats-row">
            <span>8 matches</span>
            <span className="awrug-sep">·</span>
            <span>2 fields</span>
            <span className="awrug-sep">·</span>
            <span>12 teams</span>
          </div>
        </div>
        <div className="awrug-progress">
          <div className="awrug-progress-fill" style={{ width: "50%" }} />
        </div>
      </div>

      {/* Full-width scoreboard rows */}
      <div className="aw-body awrug-board">
        <div className="awrug-match awrug-match-live">
          <div className="awrug-live-stripe" />
          <div className="awrug-match-inner">
            <div className="awrug-field">Field A · 09:00</div>
            <div className="awrug-teams">
              <span className="awrug-team">Grey</span>
              <span className="awrug-score awrug-score-live">21 — 17</span>
              <span className="awrug-team">Framesby</span>
            </div>
          </div>
          <span className="awrug-status awrug-ft">FT</span>
        </div>

        <div className="awrug-match">
          <div className="awrug-match-inner">
            <div className="awrug-field">Field B · 09:40</div>
            <div className="awrug-teams">
              <span className="awrug-team">Pearson</span>
              <span className="awrug-score">— vs —</span>
              <span className="awrug-team">Hudson Park</span>
            </div>
          </div>
          <span className="awrug-status">KO</span>
        </div>

        <div className="awrug-match awrug-match-next">
          <div className="awrug-match-inner">
            <div className="awrug-field">Field A · 10:20</div>
            <div className="awrug-teams">
              <span className="awrug-team">Selborne</span>
              <span className="awrug-score">— vs —</span>
              <span className="awrug-team">Dale</span>
            </div>
          </div>
          <span className="awrug-status awrug-next-badge">Next</span>
        </div>

        <div className="awrug-match">
          <div className="awrug-match-inner">
            <div className="awrug-field">Field B · 11:00</div>
            <div className="awrug-teams">
              <span className="awrug-team">Graeme</span>
              <span className="awrug-score">— vs —</span>
              <span className="awrug-team">Queens</span>
            </div>
          </div>
          <span className="awrug-status">TBD</span>
        </div>
      </div>
    </div>
  );
}

function PerfPreview() {
  return (
    <div className="aw aw-perf" aria-hidden="true">
      <div className="aw-chrome">
        <div className="aw-dots"><i /><i /><i /></div>
        <span className="aw-title">GameOpt · Gaming profile</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-green">● Stable</span>
        </div>
      </div>

      {/* Metrics strip — full-width, no sidebar */}
      <div className="awperf-metrics-strip">
        <div className="awperf-metric awperf-highlight">
          <span className="awperf-label">Input latency</span>
          <span className="awperf-value awperf-green">6.8 ms</span>
        </div>
        <div className="awperf-metric-divider" />
        <div className="awperf-metric">
          <span className="awperf-label">FPS avg</span>
          <span className="awperf-value">214</span>
        </div>
        <div className="awperf-metric-divider" />
        <div className="awperf-metric awperf-warn">
          <span className="awperf-label">1% low</span>
          <span className="awperf-value awperf-amber">142</span>
        </div>
        <div className="awperf-metric-divider" />
        <div className="awperf-metric">
          <span className="awperf-label">CPU gov</span>
          <span className="awperf-value awperf-small">performance</span>
        </div>
      </div>

      {/* Hero chart body */}
      <div className="aw-body awperf-body">
        <div className="awperf-chart-area">
          <div className="awperf-chart-label">Frame time (ms)</div>
          <div className="awperf-bars">
            {[4.2,3.8,4.6,3.9,4.1,5.2,3.7,4.4,3.6,4.8,3.9,4.2,3.8,4.5,3.7,4.1].map((h,i)=>(
              <div key={i} className={`awperf-bar${h > 5 ? " awperf-bar-spike" : ""}`} style={{ height: `${h * 13}%` }} />
            ))}
          </div>
        </div>

        <div className="awperf-config-row">
          <span className="awperf-config-label">Active tweaks</span>
          <div className="awperf-tags">
            <span className="awperf-tag">isolcpus=0-3</span>
            <span className="awperf-tag">rcu_nocbs</span>
            <span className="awperf-tag">mitigations=off</span>
            <span className="awperf-tag">threadirq</span>
            <span className="awperf-tag awperf-tag-accent">PREEMPT_RT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectPreview({ project, active }) {
  const kinds = {
    editor: EditorPreview,
    pos: PosPreview,
    terminal: TerminalPreview,
    edu: EduPreview,
    geoquest: GeoQuestPreview,
    rugby: RugbyPreview,
    perf: PerfPreview,
  };
  const Component = kinds[project.preview];
  if (!Component) return null;
  return (
    <div
      className={`project-preview tone-${project.tone} preview-kind-${project.preview} ${active ? "is-active" : ""}`}
    >
      <Component />
    </div>
  );
}

/* ─── About / Human layer map ─── */
function AboutMap() {
  return (
    <div className="about-map" aria-hidden="true">
      {/* Deep background tint */}
      <div className="am-backdrop" />
      {/* Graticule grid */}
      <div className="am-graticule" />

      <svg
        className="about-map-svg"
        viewBox="0 0 320 240"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter for highlighted province */}
          <filter id="map-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Pin glow */}
          <filter id="pin-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Country gradient fill */}
          <linearGradient id="sa-fill" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.018)" />
          </linearGradient>
          {/* EC province glow fill */}
          <radialGradient id="ec-fill" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(95,147,111,0.38)" />
            <stop offset="100%" stopColor="rgba(95,147,111,0.12)" />
          </radialGradient>
          {/* Continuous ocean line */}
          <linearGradient id="coast-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(111,185,199,0.35)" />
            <stop offset="50%" stopColor="rgba(111,185,199,0.15)" />
            <stop offset="100%" stopColor="rgba(111,185,199,0.08)" />
          </linearGradient>
        </defs>

        {/* ── Ocean / background ── */}
        <rect x="0" y="0" width="320" height="240" fill="rgba(6,12,20,0.0)" />
        {/* ── South Africa main body ── */}
        <path
          className="am-country"
          d="M128.0,201.2 L140.6,202.0 L143.5,205.8 L138.9,207.8 L144.0,209.0 L143.1,210.9 L162.7,214.8 L165.7,210.8 L177.1,211.7 L175.8,209.0 L179.4,206.6 L191.2,207.1 L200.3,203.4 L224.1,187.6 L238.5,173.1 L248.6,166.1 L251.2,163.0 L250.5,160.4 L244.9,156.7 L233.8,155.1 L236.5,150.4 L233.8,149.4 L231.8,145.2 L218.9,149.4 L216.9,156.3 L210.7,155.1 L206.0,150.3 L204.2,150.6 L203.4,153.6 L198.6,154.0 L196.2,156.4 L192.3,156.6 L184.6,153.1 L180.1,154.1 L178.1,156.5 L173.1,155.4 L174.5,158.2 L171.8,165.2 L158.7,168.2 L157.4,173.3 L151.6,173.9 L150.6,176.6 L152.6,177.4 L150.6,180.9 L147.1,182.4 L145.0,181.1 L143.4,183.9 L136.0,185.2 L138.6,191.8 L133.9,191.4 L128.0,201.2 Z M154.6,139.4 L170.5,154.6 L178.0,156.5 L180.1,154.1 L184.6,153.1 L192.3,156.6 L197.5,156.1 L198.5,154.0 L203.4,153.6 L205.1,151.6 L205.2,147.5 L198.8,138.8 L204.4,136.6 L210.9,126.9 L215.5,126.6 L218.0,123.5 L225.8,121.5 L229.4,124.8 L231.1,121.6 L234.8,121.1 L241.8,116.1 L244.1,102.9 L241.7,103.9 L238.6,99.7 L233.4,98.4 L232.3,95.6 L229.7,96.5 L225.7,94.8 L223.8,96.7 L222.9,94.7 L217.0,93.7 L214.5,90.1 L211.2,92.2 L207.9,91.4 L205.3,94.3 L203.5,93.1 L201.9,95.2 L197.5,93.4 L197.2,95.1 L195.2,94.4 L189.0,98.1 L190.4,102.1 L185.9,102.7 L182.5,107.7 L179.1,104.9 L167.6,110.8 L163.3,116.5 L163.8,122.8 L154.6,139.4 Z M201.1,87.7 L211.2,92.2 L214.6,90.1 L218.8,94.3 L223.7,87.3 L227.6,87.6 L229.2,85.6 L223.8,82.8 L223.3,80.1 L229.3,79.1 L232.8,70.7 L230.6,72.4 L228.2,71.4 L228.8,73.9 L226.1,73.5 L225.3,68.0 L228.0,66.3 L227.3,64.3 L225.2,65.0 L225.4,67.1 L214.5,68.5 L215.9,71.4 L214.3,76.0 L206.1,76.8 L201.1,87.7 Z M229.4,124.8 L236.7,129.9 L239.0,134.2 L234.2,139.9 L234.3,143.7 L231.8,145.2 L233.8,149.4 L236.5,150.4 L233.4,154.7 L244.9,156.7 L249.6,159.4 L251.2,163.0 L270.2,134.9 L287.6,120.9 L295.8,93.2 L281.3,92.4 L280.7,100.8 L269.1,99.6 L267.3,101.6 L263.6,101.6 L254.1,100.0 L250.4,102.4 L245.4,101.8 L243.1,103.3 L244.5,105.4 L242.6,106.3 L243.6,108.9 L241.8,116.1 L234.8,121.1 L231.1,121.6 L229.4,124.8 Z M188.7,56.7 L189.5,59.3 L194.4,60.6 L198.9,57.9 L202.2,63.6 L217.0,62.2 L219.3,63.3 L216.4,64.2 L217.2,65.9 L221.3,67.8 L226.2,66.1 L225.7,64.4 L221.3,65.1 L230.3,60.9 L230.0,62.6 L233.6,64.4 L232.0,66.7 L234.3,67.5 L233.7,69.0 L244.2,69.1 L248.1,68.1 L247.7,64.0 L250.4,64.6 L251.2,60.1 L257.6,61.1 L260.6,53.6 L263.9,55.6 L268.3,55.2 L267.9,51.0 L265.5,51.3 L265.8,47.4 L276.2,47.0 L279.1,45.2 L273.8,37.4 L273.9,32.7 L269.0,19.0 L252.8,18.8 L242.4,15.0 L235.1,15.9 L231.8,16.7 L230.2,20.6 L219.6,23.1 L210.7,33.3 L208.4,33.0 L207.2,35.8 L200.7,38.1 L198.0,41.1 L196.3,50.1 L188.7,56.7 Z M219.0,93.5 L223.8,96.7 L225.7,94.8 L229.7,96.5 L232.4,95.7 L233.4,98.4 L238.6,99.7 L241.7,103.9 L254.1,100.0 L267.3,101.6 L269.1,99.6 L264.3,96.2 L262.8,92.0 L261.5,93.0 L261.3,86.7 L269.8,74.8 L278.9,79.0 L280.7,78.2 L281.2,53.5 L279.2,45.7 L265.8,47.4 L265.5,51.3 L267.9,51.0 L268.3,55.2 L263.9,55.6 L260.6,53.6 L257.6,61.1 L251.2,60.1 L250.4,64.6 L247.7,64.0 L248.1,68.1 L233.7,69.0 L234.3,67.5 L232.0,66.7 L233.6,64.4 L230.0,62.6 L230.3,60.9 L221.3,65.1 L227.3,64.3 L228.0,66.3 L225.3,68.0 L226.3,73.7 L229.0,73.8 L229.1,70.8 L230.6,72.4 L233.1,71.4 L229.3,79.1 L223.3,80.1 L223.8,82.8 L229.2,85.6 L227.6,87.6 L223.7,87.3 L219.0,93.5 Z M126.2,80.7 L129.1,86.5 L133.8,78.7 L138.8,79.1 L135.9,80.9 L137.5,81.4 L136.8,87.0 L142.0,89.2 L140.4,91.3 L148.4,93.8 L149.5,96.4 L147.2,99.7 L150.3,101.4 L150.7,107.8 L156.3,107.2 L154.9,110.6 L157.7,113.6 L160.3,106.2 L166.0,107.0 L162.6,110.9 L164.6,113.9 L170.0,108.7 L179.1,104.9 L183.0,107.4 L185.9,102.7 L190.4,102.1 L188.9,98.3 L192.2,95.6 L197.1,95.1 L197.5,93.4 L201.8,95.2 L203.5,93.1 L206.3,93.6 L208.4,90.5 L204.5,88.5 L202.5,89.5 L201.6,85.3 L203.9,83.7 L203.3,81.4 L205.4,81.0 L206.1,76.8 L214.3,76.0 L215.9,71.4 L214.1,69.2 L219.9,68.1 L216.4,64.2 L219.3,63.3 L214.7,61.8 L208.9,62.1 L207.4,64.1 L202.2,63.6 L198.9,57.9 L194.4,60.6 L189.5,59.3 L188.4,56.5 L179.4,58.5 L180.0,61.1 L175.0,73.1 L171.1,75.2 L155.1,75.1 L151.5,72.6 L147.3,72.9 L140.1,67.1 L133.3,67.3 L129.8,70.6 L126.2,80.7 Z M24.2,122.4 L30.2,130.1 L37.7,150.6 L45.6,164.0 L47.0,164.6 L49.9,158.2 L54.1,158.6 L56.0,152.7 L58.4,155.1 L59.2,152.2 L65.5,157.4 L64.2,159.8 L66.0,160.8 L64.7,162.3 L67.7,170.4 L66.7,176.1 L69.8,177.3 L71.1,175.9 L70.9,177.8 L74.7,179.6 L73.0,183.0 L75.0,189.3 L77.1,185.4 L85.8,181.2 L87.0,183.3 L84.1,184.7 L84.7,187.6 L90.1,193.7 L94.9,193.8 L96.8,189.1 L101.9,188.6 L104.3,184.4 L108.4,183.6 L108.2,182.0 L113.8,182.7 L117.3,180.6 L117.2,175.8 L118.6,176.4 L120.4,171.4 L134.0,177.8 L139.3,172.8 L144.2,172.3 L147.1,175.5 L149.7,173.3 L150.1,175.0 L157.4,173.3 L158.7,168.2 L168.9,164.8 L171.3,165.5 L173.7,161.8 L173.1,155.4 L168.6,153.4 L162.0,145.1 L154.7,140.2 L163.8,122.8 L163.3,116.5 L165.9,113.3 L164.6,113.9 L162.6,110.9 L166.2,107.1 L160.3,106.2 L157.7,113.6 L154.9,110.6 L156.3,107.2 L150.7,107.8 L150.3,101.4 L147.2,99.7 L149.5,96.4 L148.4,93.8 L140.4,91.3 L142.0,89.2 L136.8,87.0 L137.5,81.4 L135.9,80.9 L138.2,80.5 L137.7,78.9 L133.8,78.7 L129.1,86.5 L127.6,85.8 L127.5,81.0 L122.8,82.7 L116.7,89.5 L112.1,90.4 L110.8,93.2 L97.6,92.2 L94.1,94.0 L92.8,87.5 L97.1,81.2 L96.2,76.9 L89.2,63.1 L82.8,58.6 L82.8,119.1 L75.6,120.8 L68.8,128.0 L61.8,125.8 L52.9,127.2 L48.4,124.7 L40.1,124.0 L39.5,117.0 L36.8,116.2 L34.5,112.6 L31.3,113.5 L28.8,120.2 L24.2,122.4 Z M45.7,164.2 L54.4,176.5 L54.8,187.9 L52.1,190.9 L49.2,189.7 L47.2,191.8 L48.0,195.4 L50.3,195.1 L51.8,197.9 L49.3,197.0 L57.0,206.1 L57.8,209.4 L54.8,211.9 L57.6,217.1 L57.0,213.4 L62.6,212.6 L64.1,213.8 L63.4,217.6 L70.8,218.0 L72.5,220.2 L71.2,221.7 L82.9,225.0 L90.7,219.4 L96.8,219.1 L97.7,217.4 L113.1,217.4 L118.5,214.3 L118.5,212.6 L125.2,211.2 L139.1,213.1 L144.0,209.0 L138.9,207.8 L143.5,205.8 L142.4,202.9 L137.3,201.1 L128.6,201.6 L128.1,200.0 L133.9,191.4 L138.6,191.8 L136.0,185.2 L151.1,180.3 L152.6,177.4 L149.7,173.3 L147.1,175.5 L144.2,172.3 L139.3,172.8 L134.0,177.8 L120.4,171.4 L118.6,176.4 L117.2,175.8 L117.3,180.6 L113.8,182.7 L108.2,182.0 L108.4,183.6 L104.3,184.4 L101.9,188.6 L96.8,189.1 L94.9,193.8 L90.1,193.7 L84.7,187.6 L84.1,184.7 L87.0,183.3 L85.8,181.2 L77.1,185.4 L75.0,189.3 L73.0,183.0 L74.7,179.6 L70.9,177.8 L71.1,175.9 L69.8,177.3 L66.7,176.1 L67.7,170.4 L64.7,162.3 L66.0,160.8 L64.2,159.8 L65.5,157.4 L59.2,152.2 L58.4,155.1 L56.0,152.7 L53.9,158.8 L49.9,158.2 L47.0,164.6 L45.7,164.2 Z M48.5,195.6 L48.5,195.6 Z M48.9,196.0 L48.9,196.0 Z M49.4,197.2 L49.4,197.2 Z M49.6,197.1 L49.6,197.1 Z M49.8,196.1 L49.8,196.1 Z M50.0,196.2 L50.0,196.2 Z M50.9,201.5 L50.9,201.5 Z M55.1,212.2 L55.1,212.2 Z M55.7,207.9 L55.7,207.9 Z M57.0,216.8 L57.0,216.8 Z M59.4,213.5 L59.4,213.5 Z M73.1,222.6 L73.1,222.6 Z M73.1,222.5 L73.1,222.5 Z"
        />

        {/* ── Eastern Cape province (highlighted) ── */}
        <path
          className="am-province"
          d="M128.0,201.2 L140.6,202.0 L143.5,205.8 L138.9,207.8 L144.0,209.0 L143.1,210.9 L162.7,214.8 L165.7,210.8 L177.1,211.7 L175.8,209.0 L179.4,206.6 L191.2,207.1 L200.3,203.4 L224.1,187.6 L238.5,173.1 L248.6,166.1 L251.2,163.0 L250.5,160.4 L244.9,156.7 L233.8,155.1 L236.5,150.4 L233.8,149.4 L231.8,145.2 L218.9,149.4 L216.9,156.3 L210.7,155.1 L206.0,150.3 L204.2,150.6 L203.4,153.6 L198.6,154.0 L196.2,156.4 L192.3,156.6 L184.6,153.1 L180.1,154.1 L178.1,156.5 L173.1,155.4 L174.5,158.2 L171.8,165.2 L158.7,168.2 L157.4,173.3 L151.6,173.9 L150.6,176.6 L152.6,177.4 L150.6,180.9 L147.1,182.4 L145.0,181.1 L143.4,183.9 L136.0,185.2 L138.6,191.8 L133.9,191.4 L128.0,201.2 Z"
          filter="url(#map-glow)"
        />

        {/* ── Location pin — Humansdorp ── */}
        {/* Dashed leader line to label area */}
        <line className="am-pin-leader" x1="161.6" y1="211.8" x2="204" y2="168" />

        {/* Pin group */}
        <g filter="url(#pin-glow)">
          {/* Outer pulse ring */}
          <circle className="am-pin-halo" cx="161.6" cy="211.8" r="11" />
          {/* Mid ring */}
          <circle className="am-pin-ring" cx="161.6" cy="211.8" r="5" />
          {/* Core dot */}
          <circle className="am-pin-core" cx="161.6" cy="211.8" r="2" />
        </g>

        {/* ── Label callout box — Humansdorp ── */}
        <rect
          className="am-callout-box"
          x="206" y="154" width="86" height="30" rx="2"
        />
        <text className="am-callout-city" x="249" y="165">HUMANSDORP</text>
        <text className="am-callout-sub" x="249" y="176">Eastern Cape</text>

        {/* ── Coordinate crosshair at pin ── */}
        <line x1="161.6" y1="203.8" x2="161.6" y2="197.8" className="am-pin-cross" />
        <line x1="153.6" y1="211.8" x2="147.6" y2="211.8" className="am-pin-cross" />
        <line x1="169.6" y1="211.8" x2="175.6" y2="211.8" className="am-pin-cross" />
        <line x1="144" y1="158" x2="138" y2="158" className="am-pin-cross" />
        <line x1="160" y1="158" x2="166" y2="158" className="am-pin-cross" />
      </svg>

      {/* Floating HUD labels */}
      <div className="am-hud-top-left">
        <div className="am-hud-label">SOUTH AFRICA</div>
      </div>
      <div className="am-hud-province">
        <div className="am-hud-ec">EASTERN CAPE</div>
      </div>

      {/* Bottom status bar */}
      <div className="am-status-bar">
        <span className="am-status-id">ID_LAYER_06</span>
        <span className="am-status-loc">South Africa · Eastern Cape · Humansdorp</span>
        <span className="am-status-coord">34°02'S 24°46'E</span>
      </div>
    </div>
  );
}

function App() {
  const rootRef = useRef(null);
  const workRef = useRef(null);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [githubData, setGithubData] = useState({
    profile: null,
    repos: [],
    source: "",
  });
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState("");

  const progressLabels = useMemo(
    () => [
      ["00", "Prelude"],
      ["01", "Work"],
      ["02", "Public"],
      ["03", "System"],
      ["04", "Human"],
      ["05", "Signal"],
    ],
    [],
  );

  const githubProfile = githubData.profile ?? {
    login: GITHUB_USERNAME,
    name: "",
    bio: "",
    url: GITHUB_PROFILE_FALLBACK,
    publicRepos: 0,
    followers: 0,
    following: 0,
  };
  const githubProfileUrl = githubProfile.url || GITHUB_PROFILE_FALLBACK;
  const githubSourceLabel =
    githubData.source === "graphql-pinned" ? "Pinned repositories" : "Recent public repositories";
  const githubIntro =
    githubData.source === "graphql-pinned"
      ? `Showing the repositories pinned on @${githubProfile.login}'s GitHub profile.`
      : `Showing recently updated public repositories from @${githubProfile.login}.`;

  const publicProjects = useMemo(
    () =>
      githubData.repos.slice(0, REPO_CARD_LIMIT).map((repo, index) => {
        const tags = [...new Set([...(repo.topics || []), repo.language].filter(Boolean))].slice(0, 3);
        const description =
          repo.description ||
          (repo.homepage
            ? `Public repository connected to ${repo.homepage}.`
            : `${repo.language || "Public"} repository synced from GitHub.`);
        const status = repo.archived ? "Archived" : repo.fork ? "Fork" : repo.isPinned ? "Pinned" : "Updated";

        return {
          id: String(index + 1).padStart(2, "0"),
          name: repo.name,
          url: repo.url,
          description,
          tags: tags.length ? tags : ["GitHub"],
          status,
          language: repo.language,
          stats: `${formatCount(repo.stars)} stars / ${formatCount(repo.forks)} forks`,
          updated: formatRepoDate(repo.pushedAt || repo.updatedAt),
        };
      }),
    [githubData.repos],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadGithubData = async () => {
      try {
        setGithubLoading(true);
        setGithubError("");

        const response = await fetch(
          `/api/github?username=${encodeURIComponent(GITHUB_USERNAME)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Portfolio GitHub endpoint failed with ${response.status}`);
        }

        const payload = await response.json();
        if (!controller.signal.aborted) {
          setGithubData({
            profile: payload.profile ? normalizeGithubProfile(payload.profile) : null,
            repos: Array.isArray(payload.repos) ? payload.repos.map((repo) => normalizeGithubRepo(repo)) : [],
            source: payload.source || "server",
          });
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        try {
          const fallback = await fetchGithubRestFallback(controller.signal);
          if (!controller.signal.aborted) {
            setGithubData(fallback);
          }
        } catch (fallbackError) {
          if (fallbackError.name !== "AbortError") {
            setGithubError("GitHub metadata is temporarily unavailable.");
            setGithubData({ profile: null, repos: [], source: "" });
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setGithubLoading(false);
        }
      }
    };

    loadGithubData();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [githubLoading, githubData.repos]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cursorMove = (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", cursorMove, { passive: true });

    if (reduceMotion) {
      root.classList.add("reduced-motion");
      return () => window.removeEventListener("pointermove", cursorMove);
    }

    const ctx = gsap.context(() => {
      gsap.from(".intro-mark", {
        y: 18,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-line span", {
        yPercent: 105,
        duration: 1.15,
        stagger: 0.12,
        delay: 0.12,
        ease: "power4.out",
      });

      gsap.from(".hero-meta, .hero-facts, .hero-actions, .command-nav, .scroll-cue", {
        y: 22,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.09,
        delay: 0.55,
        ease: "power3.out",
      });

      gsap.to(".progress-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
        },
      });

      gsap.to(".hero-title", {
        yPercent: -34,
        scale: 0.64,
        transformOrigin: "left top",
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-scene",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(".brand-lock", {
        autoAlpha: 1,
        y: 0,
        scrollTrigger: {
          trigger: ".identity-scene",
          start: "top 72%",
          end: "top 30%",
          scrub: true,
        },
      });

      gsap.to(".ambient-plane", {
        yPercent: -18,
        rotate: 0.001,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      gsap.utils.toArray(".scene").forEach((scene) => {
        gsap.from(scene.querySelectorAll(".reveal-line span, .fade-rise"), {
          y: 32,
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scene,
            start: "top 66%",
          },
        });
      });

      gsap.from(".phrase-chip", {
        y: 26,
        autoAlpha: 0,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".identity-scene",
          start: "center 65%",
        },
      });

      ScrollTrigger.create({
        trigger: workRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const next = Math.min(projects.length - 1, Math.floor(self.progress * projects.length));
          if (next !== activeProjectRef.current) {
            activeProjectRef.current = next;
            setActiveProject(next);
          }
        },
      });

      gsap.to(".blueprint-frame", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: ".process-scene",
          start: "top 70%",
          end: "center 45%",
          scrub: true,
        },
      });

      gsap.from(".capability-token", {
        y: 22,
        autoAlpha: 0,
        stagger: 0.035,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".systems-scene",
          start: "top 62%",
        },
      });

      gsap.to(".portrait-light", {
        scale: 1.08,
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-scene",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".portrait-crosshair", {
        scale: 1.6,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-scene", start: "top 62%" },
      });

      gsap.from(".portrait-hud", {
        autoAlpha: 0,
        y: 6,
        duration: 0.7,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-scene", start: "top 62%" },
      });
    }, root);

    return () => {
      window.removeEventListener("pointermove", cursorMove);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={rootRef} className="experience-shell">
      <div className="cursor-light" aria-hidden="true" />
      <div className="ambient-stage" aria-hidden="true">
        <div className="ambient-plane" />
        <div className="ambient-noise" />
      </div>

      <header className="site-chrome" aria-label="Primary navigation">
        <a className="brand-lock" href="#top" aria-label="Back to top">
          <span>{profile.initials}</span>
          <small>CS Student</small>
        </a>
        <nav className="top-nav">
          {navItems.map(([label, href]) => (
            <MagneticLink href={href} key={label}>
              {label}
            </MagneticLink>
          ))}
        </nav>
      </header>

      <aside className="progress-rail" aria-label="Page progress">
        <div className="progress-track">
          <div className="progress-fill" />
        </div>
        <div className="progress-labels">
          {progressLabels.map(([index, label]) => (
            <span key={label}>
              <b>{index}</b>
              {label}
            </span>
          ))}
        </div>
      </aside>

      <section id="top" className="hero-scene scene" aria-labelledby="hero-title">
        <div className="intro-mark">
          {profile.name} / {profile.role} / {profile.location}
        </div>
        <div className="hero-title" id="hero-title">
          <h1>
            <span className="hero-line">
              <span>Jordan L</span>
            </span>
            <span className="hero-line">
              <span>Vorster</span>
            </span>
            <span className="hero-line accent-line">
              <span>builds tools.</span>
            </span>
          </h1>
        </div>
        <div className="hero-meta">
          <p>
            I'm studying CS through the University of London and building things on the
            side — web apps, tools, games, and whatever I'm curious about at the time.
            Looking for an internship where I can work on real problems with a real team.
          </p>
        </div>
        <div className="hero-facts" aria-label="Profile highlights">
          <span>{profile.education}</span>
          <span>{profile.availability}</span>
          <span>{profile.location}</span>
        </div>
        <div className="hero-actions" aria-label="Primary portfolio actions">
          <a href={profile.resumeUrl} download>
            Download CV
          </a>
          <a href={`mailto:${profile.email}`}>Contact Jordan</a>
          <a href={githubProfileUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <nav className="command-nav" aria-label="Section shortcuts">
          {navItems.map(([label, href], index) => (
            <a href={href} key={label}>
              <span>0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="scroll-cue" aria-hidden="true">
          <span />
          Scroll as camera
        </div>
      </section>

      <section className="identity-scene scene" aria-labelledby="identity-title">
        <div className="scene-index">01 / Overview</div>
        <div className="identity-grid">
          <h2 id="identity-title" className="reveal-line">
            <span>I study CS, but most of what I've learned came from building things outside of class.</span>
          </h2>
          <p className="fade-rise">
            I've done CS50, a few Coursera courses, and built things across web, tools,
            games, and AI experiments. The projects on this site are real — things I
            actually finished and used. I'm looking for an internship where the work
            is real and there's room to get better at it.
          </p>
        </div>
        <div className="phrase-field" aria-hidden="true">
          {["Computer Science", "Practical projects", "AI / LLM curiosity", "Internship ready"].map(
            (phrase) => (
              <span className="phrase-chip" key={phrase}>
                {phrase}
              </span>
            ),
          )}
        </div>
      </section>

      <section id="work" ref={workRef} className="work-scene" aria-labelledby="work-title">
        <div className="work-sticky">
          <div className="scene-index">02 / Resume projects</div>
          <div className="work-copy">
            <p className="eyebrow">What I've built</p>
            <h2 id="work-title">{projects[activeProject].title}</h2>
            <p>{projects[activeProject].outcome}</p>
            <div className="project-meta">
              <span>{projects[activeProject].role}</span>
              <span>{projects[activeProject].stack.join(" / ")}</span>
            </div>
          </div>

          <div className="project-lens" aria-live="polite">
            <div className="lens-chrome">
              <span>Scene {projects[activeProject].id}</span>
              <span>{projects[activeProject].title}</span>
            </div>
            {projects.map((project, index) => (
              <ProjectVisual key={project.title} project={project} active={activeProject === index} />
            ))}
            {projects.map((project, index) => (
              <ProjectPreview
                key={`preview-${project.title}`}
                project={project}
                active={activeProject === index}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="github" className="github-scene scene" aria-labelledby="github-title">
        <div className="scene-index">03 / Public code</div>
        <div className="github-header">
          <div>
            <p className="eyebrow fade-rise">GitHub projects</p>
            <h2 id="github-title" className="reveal-line">
              <span>Some of my public work, pulled live from GitHub.</span>
            </h2>
          </div>
          <div className="github-profile-panel fade-rise">
            <p className="github-intro">
              <span className="github-profile-line">
                {githubLoading ? "Syncing GitHub profile" : `${githubProfile.name || githubProfile.login} / @${githubProfile.login}`}
              </span>
              <span>{githubProfile.bio || githubIntro}</span>
            </p>
            <div className="github-stats" aria-label="GitHub profile stats">
              <span>{formatCount(githubProfile.publicRepos)} repos</span>
              <span>{formatCount(githubProfile.followers)} followers</span>
              <span>{githubSourceLabel}</span>
            </div>
          </div>
        </div>

        <div className="repo-showcase fade-rise" aria-live="polite">
          {githubLoading &&
            Array.from({ length: 3 }, (_, index) => (
              <div className="repo-card repo-card-skeleton" key={`repo-skeleton-${index}`} aria-hidden="true">
                <div className="repo-card-header">
                  <span />
                  <span />
                </div>
                <div className="repo-card-body">
                  <span />
                  <span />
                </div>
                <div>
                  <div className="repo-tags">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="repo-card-footer">
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            ))}

          {!githubLoading && githubError && (
            <div className="repo-message">
              <span>{githubError}</span>
              <a href={githubProfileUrl} target="_blank" rel="noreferrer">
                View all on GitHub
              </a>
            </div>
          )}

          {!githubLoading &&
            !githubError &&
            publicProjects.map((repo) => (
              <a
                className="repo-card"
                href={repo.url}
                key={repo.name}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${repo.name} repository on GitHub`}
              >
                <div className="repo-card-header">
                  <span className="repo-index">{repo.id}</span>
                  <span className="repo-status">{repo.status}</span>
                </div>
                <div className="repo-card-body">
                  <h3>{repo.name}</h3>
                  <p>{repo.description}</p>
                </div>
                <div>
                  <div className="repo-tags" aria-label={`${repo.name} stack`}>
                    {repo.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="repo-card-footer">
                    <span>{repo.language || "Repository"}</span>
                    <span>{repo.stats}</span>
                    <span>{repo.updated}</span>
                    <span className="repo-arrow" aria-hidden="true">
                      -&gt;
                    </span>
                  </div>
                </div>
              </a>
            ))}

          {!githubLoading && !githubError && publicProjects.length === 0 && (
            <div className="repo-message">
              <span>No public repositories are available from GitHub right now.</span>
              <a href={githubProfileUrl} target="_blank" rel="noreferrer">
                View all on GitHub
              </a>
            </div>
          )}
        </div>

        <div className="github-footer fade-rise">
          <a className="github-profile-link" href={githubProfileUrl} target="_blank" rel="noreferrer">
            View all on GitHub
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </section>

      <section className="process-scene scene" aria-labelledby="process-title">
        <div className="scene-index">04 / Background</div>
        <div className="process-layout">
          <div>
            <p className="eyebrow fade-rise">Background</p>
            <h2 id="process-title" className="reveal-line">
              <span>Where the experience behind the portfolio actually came from.</span>
            </h2>
          </div>
          <div className="blueprint-frame" aria-label="Education, experience, and involvement">
            {processSteps.map((step, index) => (
              <div className="process-step" key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.detail}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="systems" className="systems-scene scene" aria-labelledby="systems-title">
        <div className="scene-index">05 / Systems</div>
        <div className="systems-header">
          <h2 id="systems-title" className="reveal-line">
            <span>What I work with — built up through projects, courses, and experimentation.</span>
          </h2>
          <p className="fade-rise">
            Python, JavaScript, PHP, SQL, and React come up most often. I also run
            Linux, use Docker, and have been running local LLMs through Ollama and
            LM Studio for a while now. Most of what's in this list has come up in
            an actual project at some point.
          </p>
        </div>
        <div className="capability-constellation">
          {capabilities.map((capability) => (
            <span className="capability-token" key={capability}>
              {capability}
            </span>
          ))}
        </div>
      </section>

      <section id="about" className="about-scene scene" aria-labelledby="about-title">
        <div className="scene-index">06 / Human layer</div>
        <div className="about-visual" aria-hidden="true">
          <div className="portrait-light" />
          <div className="portrait-grid" />
          <div className="portrait-scan" />
          <AboutMap />
        </div>
        <div className="about-copy">
          <p className="eyebrow fade-rise">About</p>
          <h2 id="about-title" className="reveal-line">
            <span>I like hard problems, learning how things work, and building things that are actually useful.</span>
          </h2>
          <p className="fade-rise">
            I'm based in the Eastern Cape and studying CS through the University of
            London. Outside of coursework I build practical products: collaborative editors,
            business software, developer tooling, and interactive systems. I have also worked
            in hospitality and a property internship, which taught me how to communicate
            clearly and stay reliable when things get busy.
          </p>
        </div>
      </section>

      <section id="contact" className="contact-scene scene" aria-labelledby="contact-title">
        <div className="contact-inner">
          <p className="eyebrow fade-rise">{profile.availability}</p>
          <h2 id="contact-title" className="reveal-line">
            <span>If any of this looks like a fit, reach out.</span>
          </h2>
          <p className="fade-rise">
            I'm looking for an internship or junior role where the work is real and
            there's room to learn. Happy to talk through what that could look like.
          </p>
          <div className="contact-actions fade-rise">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={githubProfileUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={profile.resumeUrl} download>
              Resume
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
