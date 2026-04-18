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
  githubUsername: "golba98",
  githubUrl: "https://github.com/golba98",
  resumeUrl: "/Resume.pdf",
};

const featuredRepoNames = [
  "SynchroEdit",
  "Game_Development",
  "Codexa",
  "hp-prime-ppl-python",
  "Personal-Website",
];

const repoDisplayCopy = {
  SynchroEdit: {
    description:
      "A Google-Docs-style editor where two or more people type into the same file at the same time. Built to understand how real-time sync actually holds up under concurrent edits.",
    tags: ["JavaScript", "Realtime Sync", "Collaborative Editing"],
    status: "Pinned",
  },
  Game_Development: {
    description:
      "Game prototypes and experiments — mostly to see what's possible with JavaScript before reaching for a full engine.",
    tags: ["JavaScript", "Game UI", "Prototyping"],
    status: "Interactive",
  },
  Codexa: {
    description:
      "A terminal-native skin for Codex — chatting with ChatGPT from the CLI, but with the typography, colour, and rhythm of a modern UI.",
    tags: ["TypeScript", "Terminal UI", "Developer Experience"],
    status: "Active",
  },
  "hp-prime-ppl-python": {
    description:
      "Scripting for the HP Prime and related Python utilities — base conversion, menu-driven helpers, and small calculator tools.",
    tags: ["Python", "HP Prime", "Tooling"],
    status: "Utility",
  },
  "Personal-Website": {
    description:
      "This site. Built with React, Vite, and GSAP — updated as the portfolio grows.",
    tags: ["TypeScript", "Portfolio", "React"],
    status: "Portfolio",
  },
};

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
      {/* Chrome bar */}
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

      {/* Body */}
      <div className="aw-body aw-split">
        {/* Outline sidebar */}
        <div className="aw-sidebar aw-sidebar-narrow">
          <div className="aws-section">Outline</div>
          <div className="aws-item aws-item-active">Introduction</div>
          <div className="aws-item">Problem statement</div>
          <div className="aws-item">Design decisions</div>
          <div className="aws-item">Implementation</div>
          <div className="aws-divider" />
          <div className="aws-section">Collaborators</div>
          <div className="aws-collab">
            <span className="aws-avatar aws-avatar-a">J</span>
            <div className="aws-collab-info">
              <span>Jordan</span>
              <em>editing</em>
            </div>
          </div>
          <div className="aws-collab">
            <span className="aws-avatar aws-avatar-b">M</span>
            <div className="aws-collab-info">
              <span>Mia</span>
              <em>viewing</em>
            </div>
          </div>
          <div className="aws-presence-bar" />
        </div>

        {/* Document area */}
        <div className="aw-main aw-doc">
          <div className="awd-ruler">1&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;4&nbsp;&nbsp;&nbsp;5</div>

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

          {/* Activity feed strip */}
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
        <span className="aw-title">TryPOS Suite</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-green">● Live</span>
        </div>
      </div>

      <div className="aw-body aw-split">
        {/* Sidebar */}
        <div className="aw-sidebar">
          <div className="aws-brand">TryPOS</div>
          <div className="aws-section">Navigation</div>
          <div className="aws-nav-item aws-nav-active"><span>◈</span> Dashboard</div>
          <div className="aws-nav-item"><span>◉</span> Invoices</div>
          <div className="aws-nav-item"><span>◫</span> Inventory</div>
          <div className="aws-nav-item"><span>◧</span> Contracts</div>
          <div className="aws-nav-item"><span>◌</span> Reports</div>
          <div className="aws-divider" />
          <div className="aws-section">Status</div>
          <div className="aws-stat"><span>Stock items</span><strong>84</strong></div>
          <div className="aws-stat"><span>Open invoices</span><strong>3</strong></div>
          <div className="aws-stat"><span>Contracts</span><strong>11</strong></div>
        </div>

        {/* Main content — invoice panel */}
        <div className="aw-main awp-main-col">
          {/* Mini KPI strip */}
          <div className="awp-kpi-strip">
            <div className="awp-kpi">
              <div className="awp-kpi-label">Today's sales</div>
              <div className="awp-kpi-value awp-kpi-green">R 8,420</div>
            </div>
            <div className="awp-kpi">
              <div className="awp-kpi-label">Invoices out</div>
              <div className="awp-kpi-value">3</div>
            </div>
            <div className="awp-kpi">
              <div className="awp-kpi-label">Low stock</div>
              <div className="awp-kpi-value awp-kpi-amber">4</div>
            </div>
          </div>

          {/* Invoice detail */}
          <div className="awp-doc-header">
            <div>
              <div className="awp-doc-title">Invoice #INV-00432</div>
              <div className="awp-doc-sub">Generated 18 Apr 2026 · Net 30</div>
            </div>
            <span className="aw-badge aw-badge-amber">Pending</span>
          </div>

          <div className="awp-table">
            <div className="awp-table-head">
              <span>Item</span><span>Qty</span><span>Unit</span><span>Total</span>
            </div>
            <div className="awp-row">
              <span>Ceramic mug · 6pk</span><span>2</span><span>R 270</span><span>R 540.00</span>
            </div>
            <div className="awp-row">
              <span>House blend · 250g</span><span>1</span><span>R 189</span><span>R 189.00</span>
            </div>
            <div className="awp-row">
              <span>Service contract</span><span>1</span><span>R 1 200</span><span>R 1 200.00</span>
            </div>
          </div>

          <div className="awp-totals">
            <div className="awp-total-row"><span>Subtotal</span><span>R 1 929.00</span></div>
            <div className="awp-total-row"><span>VAT 15%</span><span>R 289.35</span></div>
            <div className="awp-total-row awp-grand"><span>Total due</span><span>R 2 218.35</span></div>
          </div>

          <div className="awp-actions">
            <button className="awp-btn awp-btn-primary">Generate PDF</button>
            <button className="awp-btn">Save contract</button>
            <button className="awp-btn">Update stock</button>
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
        <span className="aw-title">Codexa</span>
        <div className="aw-chrome-right">
          <span className="awt-model">gpt-4o</span>
          <span className="aw-badge aw-badge-green">● Connected</span>
        </div>
      </div>

      <div className="aw-body aw-split">
        {/* Session history */}
        <div className="aw-sidebar aw-sidebar-narrow awt-history">
          <div className="aws-section">Sessions</div>
          <div className="awt-session awt-session-active">refactor auth</div>
          <div className="awt-session">write test suite</div>
          <div className="awt-session">explain deploy script</div>
          <div className="awt-session">review PR diff</div>
          <div className="aws-divider" />
          <div className="aws-section">Model</div>
          <div className="awt-model-tag">gpt-4o</div>
          <div className="awt-theme-row">
            <div className="awt-theme-dot" style={{ background: "#c7a46f" }} />
            <div className="awt-theme-dot" style={{ background: "#6fb9c7" }} />
            <div className="awt-theme-dot" style={{ background: "#7ab88a" }} />
          </div>
        </div>

        {/* Chat panel */}
        <div className="aw-main awt-chat">
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
}`}</pre>
          </div>

          <div className="awt-composer">
            <span className="awt-prompt-icon">❯</span>
            <span className="awt-placeholder">Ask anything<span className="awt-cursor" /></span>
          </div>
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
        <span className="aw-title">EduTool</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-green">4 / 7 passing</span>
        </div>
      </div>

      <div className="aw-body aw-split">
        {/* Modules sidebar */}
        <div className="aw-sidebar">
          <div className="aws-section">Modules</div>
          <div className="aws-nav-item">Data Structures</div>
          <div className="aws-nav-item">Algorithms</div>
          <div className="aws-nav-item aws-nav-active">Recursion</div>
          <div className="aws-nav-item">Sorting</div>
          <div className="aws-nav-item">Graphs</div>
          <div className="aws-divider" />
          <div className="aws-section">Progress</div>
          <div className="awe-progress-row"><span>DS</span><div className="awe-bar"><div style={{ width: "88%" }} /></div></div>
          <div className="awe-progress-row"><span>Algo</span><div className="awe-bar"><div style={{ width: "72%" }} /></div></div>
          <div className="awe-progress-row"><span>Rec</span><div className="awe-bar awe-bar-active"><div style={{ width: "57%" }} /></div></div>
        </div>

        {/* Exercise content */}
        <div className="aw-main awe-content">
          <div className="awe-exercise-label">Exercise 04 · Recursion</div>
          <div className="awe-task">Write a recursive factorial function in Python.</div>

          <pre className="awe-code">
{`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`}
          </pre>

          <div className="awe-tests">
            <div className="awe-test awe-pass"><span className="awe-icon">✓</span> factorial(0) == 1</div>
            <div className="awe-test awe-pass"><span className="awe-icon">✓</span> factorial(5) == 120</div>
            <div className="awe-test awe-pass"><span className="awe-icon">✓</span> factorial(1) == 1</div>
            <div className="awe-test awe-fail"><span className="awe-icon">✗</span> handles negative input</div>
          </div>

          <div className="awe-feedback">
            Feedback: add a guard for <code>n {"<"} 0</code> to handle edge cases.
          </div>
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

      <div className="aw-body aw-split">
        <div className="aw-sidebar">
          <div className="aws-brand">RugbyMate</div>
          <div className="aws-section">Views</div>
          <div className="aws-nav-item aws-nav-active"><span>◈</span> Fixtures</div>
          <div className="aws-nav-item"><span>◉</span> Bracket</div>
          <div className="aws-nav-item"><span>◫</span> Teams</div>
          <div className="aws-nav-item"><span>◧</span> Schedule</div>
          <div className="aws-divider" />
          <div className="aws-section">Today</div>
          <div className="aws-stat"><span>Matches</span><strong>8</strong></div>
          <div className="aws-stat"><span>Fields</span><strong>2</strong></div>
          <div className="aws-stat"><span>Teams</span><strong>12</strong></div>
        </div>

        <div className="aw-main awr-fixtures">
          {/* Day label */}
          <div className="awr-day-header">
            <div className="awr-day-label">Saturday · Pool Stage</div>
            <div className="awr-day-progress">
              <div className="awr-day-fill" style={{ width: "50%" }} />
            </div>
          </div>

          <div className="awr-match awr-match-live">
            <div className="awr-kick">Field A · 09:00</div>
            <div className="awr-teams">
              <span className="awr-team">Grey</span>
              <span className="awr-score awr-score-live">21 — 17</span>
              <span className="awr-team">Framesby</span>
            </div>
            <span className="awr-status awr-live">FT</span>
          </div>

          <div className="awr-match">
            <div className="awr-kick">Field B · 09:40</div>
            <div className="awr-teams">
              <span className="awr-team">Pearson</span>
              <span className="awr-score">— vs —</span>
              <span className="awr-team">Hudson Park</span>
            </div>
            <span className="awr-status">KO</span>
          </div>

          <div className="awr-match awr-match-upcoming">
            <div className="awr-kick">Field A · 10:20</div>
            <div className="awr-teams">
              <span className="awr-team">Selborne</span>
              <span className="awr-score">— vs —</span>
              <span className="awr-team">Dale</span>
            </div>
            <span className="awr-status awr-upcoming">Next</span>
          </div>

          <div className="awr-match">
            <div className="awr-kick">Field B · 11:00</div>
            <div className="awr-teams">
              <span className="awr-team">Graeme</span>
              <span className="awr-score">— vs —</span>
              <span className="awr-team">Queens</span>
            </div>
            <span className="awr-status">TBD</span>
          </div>
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
        <span className="aw-title">GameOpt</span>
        <div className="aw-chrome-right">
          <span className="aw-badge aw-badge-green">● Stable</span>
        </div>
      </div>

      <div className="aw-body aw-split">
        <div className="aw-sidebar">
          <div className="aws-section">Profiles</div>
          <div className="aws-nav-item aws-nav-active"><span>◈</span> Gaming</div>
          <div className="aws-nav-item"><span>◉</span> Desktop</div>
          <div className="aws-nav-item"><span>◫</span> Low-latency</div>
          <div className="aws-divider" />
          <div className="aws-section">System</div>
          <div className="aws-stat"><span>Kernel</span><strong>6.8 tuned</strong></div>
          <div className="aws-stat"><span>CPU gov</span><strong>performance</strong></div>
          <div className="aws-stat"><span>IRQ</span><strong>pinned</strong></div>
        </div>

        <div className="aw-main awp-lab">
          {/* Metric cards */}
          <div className="awpl-metric-row">
            <div className="awpl-metric awpl-metric-highlight">
              <div className="awpl-label">Input latency</div>
              <div className="awpl-value awpl-green">6.8 ms</div>
            </div>
            <div className="awpl-metric">
              <div className="awpl-label">FPS avg</div>
              <div className="awpl-value">214</div>
            </div>
            <div className="awpl-metric awpl-metric-warn">
              <div className="awpl-label">1% low</div>
              <div className="awpl-value awpl-amber">142</div>
            </div>
          </div>

          {/* Frame-time chart */}
          <div className="awpl-chart">
            <div className="awpl-chart-label">Frame time (ms)</div>
            <div className="awpl-bars">
              {[4.2,3.8,4.6,3.9,4.1,5.2,3.7,4.4,3.6,4.8,3.9,4.2].map((h,i)=>(
                <div key={i} className={`awpl-bar${h > 5 ? " awpl-bar-spike" : ""}`} style={{ height: `${h * 11}%` }} />
              ))}
            </div>
          </div>

          {/* Active tweaks */}
          <div className="awpl-config">
            <div className="awpl-config-label">Active tweaks</div>
            <div className="awpl-tags-row">
              <div className="awpl-tag">isolcpus=0-3</div>
              <div className="awpl-tag">rcu_nocbs</div>
              <div className="awpl-tag">mitigations=off</div>
              <div className="awpl-tag">threadirq</div>
              <div className="awpl-tag awpl-tag-accent">PREEMPT_RT</div>
            </div>
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

        {/* ── Ocean / shelf ── */}
        <rect x="0" y="0" width="320" height="240" fill="rgba(6,12,20,0.0)" />
        <path
          className="am-shelf"
          d="M0,190 C40,178 90,185 148,175 C196,166 248,148 295,156 L320,156 L320,240 L0,240 Z"
        />
        {/* Subtle ocean grid lines */}
        <line x1="0" y1="200" x2="320" y2="200" className="am-ocean-line" />
        <line x1="0" y1="215" x2="320" y2="215" className="am-ocean-line" opacity="0.5" />
        <line x1="0" y1="228" x2="320" y2="228" className="am-ocean-line" opacity="0.25" />

        {/* ── South Africa main body ── */}
        <path
          className="am-country"
          d="
            M38,72
            L54,58 L78,50 L104,46
            L130,44 L156,48 L178,56
            L200,66 L218,80 L230,100
            L232,118 L224,136
            L210,152 L193,164
            L172,172 L148,176
            L124,174 L100,168
            L80,158 L62,144
            L48,128 L40,108
            L36,88 Z
          "
        />

        {/* ── Province dividers (internal boundaries) ── */}
        <path className="am-divider" d="M104,55 L112,85 L126,115 L138,148 L152,168" />
        <path className="am-divider" d="M156,52 L168,80 L182,108 L192,140 L186,162" />
        <path className="am-divider" d="M178,60 L188,84 L196,110 L208,138" />
        <path className="am-divider" d="M60,100 L80,112 L108,126 L128,130" />
        <path className="am-divider" d="M86,140 L108,148 L124,152" />

        {/* ── Lesotho enclave ── */}
        <path
          className="am-lesotho"
          d="M158,108 L174,104 L182,116 L176,128 L162,128 L154,118 Z"
        />

        {/* ── Eastern Cape province (highlighted) ── */}
        <path
          className="am-province"
          d="
            M126,122 L148,118 L170,122
            L188,134 L200,150
            L194,166 L178,174
            L156,178 L134,174
            L112,166 L100,150
            L104,136 Z
          "
          filter="url(#map-glow)"
        />

        {/* ── Coastline accent ── */}
        <path
          className="am-coast"
          d="M62,144 L80,158 L100,168 L124,174 L148,176 L172,172 L193,164 L210,152 L224,136"
          stroke="url(#coast-grad)"
        />

        {/* ── Location pin — Gqeberha / Port Elizabeth ── */}
        {/* Dashed leader line to label area */}
        <line className="am-pin-leader" x1="152" y1="158" x2="204" y2="128" />

        {/* Pin group */}
        <g filter="url(#pin-glow)">
          {/* Outer pulse ring */}
          <circle className="am-pin-halo" cx="152" cy="158" r="11" />
          {/* Mid ring */}
          <circle className="am-pin-ring" cx="152" cy="158" r="5" />
          {/* Core dot */}
          <circle className="am-pin-core" cx="152" cy="158" r="2" />
        </g>

        {/* ── Label callout box — Gqeberha ── */}
        <rect
          className="am-callout-box"
          x="206" y="114" width="76" height="30" rx="2"
        />
        <text className="am-callout-city" x="244" y="125">GQEBERHA</text>
        <text className="am-callout-sub" x="244" y="136">Port Elizabeth · EC</text>

        {/* ── Coordinate crosshair at pin ── */}
        <line x1="152" y1="150" x2="152" y2="144" className="am-pin-cross" />
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
        <span className="am-status-loc">South Africa · Eastern Cape · Gqeberha</span>
        <span className="am-status-coord">33°58'S 25°36'E</span>
      </div>
    </div>
  );
}

function App() {
  const rootRef = useRef(null);
  const workRef = useRef(null);
  const activeProjectRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);
  const [githubRepos, setGithubRepos] = useState([]);
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

  const publicProjects = useMemo(() => {
    const reposByName = new Map(githubRepos.map((repo) => [repo.name.toLowerCase(), repo]));

    return featuredRepoNames
      .map((repoName, index) => {
        const repo = reposByName.get(repoName.toLowerCase());
        if (!repo) return null;

        const display = repoDisplayCopy[repoName] ?? {};
        const tags = display.tags?.length ? display.tags : [repo.language].filter(Boolean);

        return {
          id: String(index + 1).padStart(2, "0"),
          name: repo.name,
          url: repo.html_url,
          description:
            display.description ||
            repo.description ||
            "A public repository from the current GitHub workspace.",
          tags,
          status: display.status || "Public",
          language: repo.language,
        };
      })
      .filter(Boolean);
  }, [githubRepos]);

  useEffect(() => {
    const controller = new AbortController();

    const loadGithubRepos = async () => {
      try {
        setGithubLoading(true);
        setGithubError("");

        const response = await fetch(
          `https://api.github.com/users/${profile.githubUsername}/repos?per_page=100&sort=updated`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/vnd.github+json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`GitHub request failed with ${response.status}`);
        }

        const repos = await response.json();
        if (!controller.signal.aborted) {
          setGithubRepos(Array.isArray(repos) ? repos : []);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setGithubError("GitHub metadata is temporarily unavailable.");
          setGithubRepos([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setGithubLoading(false);
        }
      }
    };

    loadGithubRepos();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [githubLoading, githubRepos]);

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
          <a href={profile.githubUrl} target="_blank" rel="noreferrer">
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
          <p className="github-intro fade-rise">
            These cover most of the areas I've been working in — tools, games, AI
            experiments, and this site itself. All pulled directly from my GitHub profile.
          </p>
        </div>

        <div className="repo-showcase fade-rise" aria-live="polite">
          {githubLoading && <div className="repo-message">Loading public repositories...</div>}

          {!githubLoading && githubError && (
            <div className="repo-message">
              <span>{githubError}</span>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
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
                    <span className="repo-arrow" aria-hidden="true">
                      -&gt;
                    </span>
                  </div>
                </div>
              </a>
            ))}

          {!githubLoading && !githubError && publicProjects.length === 0 && (
            <div className="repo-message">
              <span>Featured repositories are syncing from GitHub.</span>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                View all on GitHub
              </a>
            </div>
          )}
        </div>

        <div className="github-footer fade-rise">
          <a className="github-profile-link" href={profile.githubUrl} target="_blank" rel="noreferrer">
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
            <a href={profile.githubUrl} target="_blank" rel="noreferrer">
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
