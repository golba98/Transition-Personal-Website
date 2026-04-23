import { useEffect, useMemo, useRef, useState, Fragment } from "react";
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
    role: "Unity 3D • Game Engineering",
    outcome:
      "A 3D location-guessing game built around exploration, precision, and competitive reveal. Built in Unity, GeoQuest 3D takes players through a full round loop — explore, lock in a guess, score the result, and reveal the true location. I built the core gameplay flow and shaped the HUD/result presentation to keep every round clear, tense, and satisfying.",
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
          <div className="pvh-geo-cinematic">
            <div className="pvh-geo-bg-env">
              <div className="pvh-geo-sun" />
              <div className="pvh-geo-mountain-silhouette" />
            </div>
            <div className="pvh-geo-scanner" />
            <div className="pvh-geo-crosshair-large">
              <div className="pvh-ch-ring-1" />
              <div className="pvh-ch-ring-2" />
              <div className="pvh-ch-marks" />
            </div>
            <div className="pvh-geo-data-overlay">
              <div className="pvh-geo-stat-box">
                <span className="pvh-label">ELEVATION</span>
                <span className="pvh-value">1,420M</span>
              </div>
              <div className="pvh-geo-stat-box">
                <span className="pvh-label">VISIBILITY</span>
                <span className="pvh-value">HIGH</span>
              </div>
            </div>
          </div>
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
    <div className="aw app-editor" aria-hidden="true">
      {/* Header — chromeless, canvas-first */}
      <div className="ed-header">
        <div className="ed-header-left">
          <nav className="ed-breadcrumb">
            <span className="ed-bc-crumb">Workspace</span>
            <span className="ed-bc-sep">/</span>
            <span className="ed-bc-crumb ed-bc-active">Q2 Brief</span>
          </nav>
          <span className="ed-saved">Saved 2s ago</span>
        </div>
        <div className="ed-header-right">
          <span className="ed-cmdk" aria-hidden="true">
            <kbd>⌘</kbd><kbd>K</kbd>
          </span>
          <div className="ed-avatars">
            <span className="ed-avatar ed-avatar-j" title="Jordan">J</span>
            <span className="ed-avatar ed-avatar-m" title="Mia">M</span>
          </div>
        </div>
      </div>

      {/* Body: tiny left rail + paper canvas + margin thread */}
      <div className="ed-body">
        <aside className="ed-rail" aria-hidden="true">
          <span className="ed-rail-dot" />
          <span className="ed-rail-dot" />
          <span className="ed-rail-dot" />
        </aside>

        <article className="ed-canvas">
          <h1 className="ed-title">Q2 Product Brief — Presence & Collaboration</h1>
          <p className="ed-subtitle">Draft · Jordan Vorster & Mia Okafor · last touched 14:07</p>

          <p className="ed-p">
            The strongest signal from Q1 research is that teams want a writing surface that does
            less, not more. Presence should feel like a quiet companion — not a dashboard glued to
            the margin of the page.
          </p>

          <p className="ed-p">
            Our near-term focus is to collapse the collaboration stack into a single, calm live
            session model. Cursors carry identity; selections carry intent; comments live in the
            margin, anchored to the prose they cite.
          </p>

          <p className="ed-p ed-p-live">
            The next milestone proves this: two authors drafting a launch memo in the same paragraph,
            with zero visible UI churn and{" "}
            <span className="ed-hl">sub-40&nbsp;ms presence latency</span>
            <span className="ed-caret ed-caret-b">
              <span className="ed-caret-label">Mia</span>
            </span>
            .
          </p>

          <p className="ed-p ed-p-muted">
            Everything else — slash menus, inline suggestions, block-level transforms — sits behind
            the palette. The canvas never raises its voice.
          </p>

          {/* Margin comment thread, anchored to the highlighted phrase */}
          <aside className="ed-margin">
            <span className="ed-margin-leader" aria-hidden="true" />
            <div className="ed-thread">
              <header className="ed-thread-head">
                <span className="ed-thread-avatar ed-avatar-j">J</span>
                <span className="ed-thread-name">Jordan</span>
                <span className="ed-thread-time">1m</span>
              </header>
              <p className="ed-thread-body">
                Can we tighten this to one sentence? Feels like the hinge of the whole section.
              </p>
              <footer className="ed-thread-foot">
                <span className="ed-typing">
                  <i /><i /><i />
                </span>
                <span className="ed-typing-label">Mia is typing…</span>
              </footer>
            </div>
          </aside>
        </article>
      </div>
    </div>
  );
}

function PosPreview() {
  const NavIcon = ({ path, active }) => (
    <span className={`pos-navicon${active ? " pos-navicon-active" : ""}`}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </span>
  );

  // Single polyline sparkline
  const Sparkline = ({ points, tint }) => (
    <svg className="pos-spark" viewBox="0 0 64 18" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={tint} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="aw app-pos" aria-hidden="true">
      <div className="pos-shell">
        {/* Persistent left sidebar */}
        <aside className="pos-sidebar">
          <div className="pos-logo">
            <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true">
              <path d="M3 4 L9 2 L15 4 L15 14 L9 16 L3 14 Z" fill="none" stroke="#7c5cff" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M9 2 L9 16" stroke="#7c5cff" strokeWidth="1.1" opacity="0.55" />
            </svg>
          </div>
          <nav className="pos-nav-items">
            <NavIcon path="M3 12 L12 4 L21 12 M5 10 V20 H19 V10" />
            <span className="pos-nav-active-wrap">
              <NavIcon active path="M6 3 H16 L18 5 V21 H6 Z M9 8 H15 M9 12 H15 M9 16 H13" />
            </span>
            <NavIcon path="M3 7 H21 V19 H3 Z M3 7 L7 3 H17 L21 7" />
            <NavIcon path="M8 4 H16 V20 H8 Z M5 7 H8 M5 12 H8 M5 17 H8" />
            <NavIcon path="M12 12 a4 4 0 1 0 0 -8 a4 4 0 0 0 0 8 Z M4 21 c0 -4 3.6 -7 8 -7 s8 3 8 7" />
            <NavIcon path="M4 20 V10 M10 20 V4 M16 20 V14 M22 20 V7" />
            <NavIcon path="M12 3 v3 M12 18 v3 M3 12 h3 M18 12 h3 M5.6 5.6 l2.1 2.1 M16.3 16.3 l2.1 2.1 M5.6 18.4 l2.1 -2.1 M16.3 7.7 l2.1 -2.1 M12 8 a4 4 0 1 0 0 8 a4 4 0 0 0 0 -8" />
          </nav>
          <div className="pos-sidebar-avatar">KB</div>
        </aside>

        {/* Main column */}
        <div className="pos-main">
          {/* Top bar */}
          <div className="pos-topbar">
            <h3 className="pos-page-title">Invoices</h3>
            <div className="pos-tabs">
              <span className="pos-tabline">All</span>
              <span className="pos-tabline">Paid</span>
              <span className="pos-tabline pos-tabline-active">Pending</span>
              <span className="pos-tabline">Overdue</span>
            </div>
            <div className="pos-topbar-right">
              <span className="pos-search">
                <svg viewBox="0 0 16 16" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="M11 11 L14 14" />
                </svg>
                <span>Search invoices</span>
              </span>
              <button className="pos-new-btn">
                <span className="pos-new-plus">+</span> New invoice
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div className="pos-kpis">
            <div className="pos-kpi-card">
              <span className="pos-kpi-label">Outstanding</span>
              <div className="pos-kpi-row">
                <span className="pos-kpi-num">R 184,320</span>
                <span className="pos-kpi-delta pos-delta-up">+4.2%</span>
              </div>
              <Sparkline points="0,12 8,10 16,11 24,7 32,8 40,5 48,7 56,3 64,4" tint="#7c5cff" />
            </div>
            <div className="pos-kpi-card">
              <span className="pos-kpi-label">Paid this month</span>
              <div className="pos-kpi-row">
                <span className="pos-kpi-num">R 612,940</span>
                <span className="pos-kpi-delta pos-delta-up pos-delta-mint">+11.8%</span>
              </div>
              <Sparkline points="0,14 8,13 16,11 24,10 32,8 40,6 48,5 56,3 64,2" tint="#3ee0a4" />
            </div>
            <div className="pos-kpi-card">
              <span className="pos-kpi-label">Avg days to pay</span>
              <div className="pos-kpi-row">
                <span className="pos-kpi-num">23.4</span>
                <span className="pos-kpi-delta pos-delta-down">−1.9</span>
              </div>
              <Sparkline points="0,6 8,8 16,7 24,9 32,8 40,11 48,10 56,13 64,12" tint="#8a92a6" />
            </div>
          </div>

          {/* Row 2: table + payout card */}
          <div className="pos-row2">
            <div className="pos-table-wrap">
              <div className="pos-thead">
                <span>Invoice</span>
                <span>Customer</span>
                <span className="pos-th-right">Amount</span>
                <span>Status</span>
                <span className="pos-th-issued">
                  Issued
                  <svg viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">
                    <path d="M2 4 L5 7 L8 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Due</span>
              </div>
              {[
                { id: "INV-2041", cust: "Keegan Botha",      initials: "KB", aTint: "#7c5cff", amount: "R 12,480.00", status: "Paid",    pill: "mint",   issued: "02 Apr", due: "16 Apr" },
                { id: "INV-2042", cust: "Lerato Moeng",      initials: "LM", aTint: "#3ee0a4", amount: "R 4,900.00",  status: "Pending", pill: "violet", issued: "05 Apr", due: "19 Apr" },
                { id: "INV-2043", cust: "BlueCoral Studios", initials: "BC", aTint: "#f26a6a", amount: "R 28,200.00", status: "Overdue", pill: "coral",  issued: "14 Mar", due: "28 Mar" },
                { id: "INV-2044", cust: "Thandi Dube",       initials: "TD", aTint: "#f7a23f", amount: "R 7,650.00",  status: "Paid",    pill: "mint",   issued: "10 Apr", due: "24 Apr" },
                { id: "INV-2045", cust: "Axis Freight",      initials: "AF", aTint: "#8a92a6", amount: "R 19,000.00", status: "Pending", pill: "violet", issued: "11 Apr", due: "25 Apr" },
              ].map((row) => (
                <div className="pos-trow" key={row.id}>
                  <span className="pos-inv-id">{row.id}</span>
                  <span className="pos-cust">
                    <span className="pos-ava" style={{ background: row.aTint }}>{row.initials}</span>
                    {row.cust}
                  </span>
                  <span className="pos-amount">{row.amount}</span>
                  <span><span className={`pos-pill pos-pill-${row.pill}`}>{row.status}</span></span>
                  <span className="pos-cell-dim">{row.issued}</span>
                  <span className="pos-cell-dim">{row.due}</span>
                </div>
              ))}
            </div>

            <div className="pos-payout">
              <span className="pos-payout-label">Next payout</span>
              <div className="pos-payout-ring-wrap">
                <svg viewBox="0 0 56 56" className="pos-payout-ring" aria-hidden="true">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="url(#payoutGrad)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="150.8" strokeDashoffset="48.3" transform="rotate(-90 28 28)" />
                  <defs>
                    <linearGradient id="payoutGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c5cff" />
                      <stop offset="100%" stopColor="#b59bff" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="pos-payout-amt">R 84,200</div>
              </div>
              <div className="pos-payout-meta">Arrives <strong>Fri 26 Apr</strong></div>
              <button className="pos-payout-cta">Review payout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="aw app-term" aria-hidden="true">
      {/* tab bar */}
      <div className="term-tabbar">
        <div className="term-tabs">
          <span className="term-tab term-tab-active">synchroedit</span>
          <span className="term-tab">pos</span>
          <span className="term-tab">~</span>
        </div>
        <div className="term-tabbar-right">
          <span className="term-model-pill">gpt-4o · codex</span>
          <span className="term-status-dot" />
        </div>
      </div>

      {/* main terminal body */}
      <div className="term-body">
        <div className="term-session-header">codex ✦ session #42 · started 14:02</div>

        <div className="term-prompt-line">
          <span className="term-prompt-path">jordan@node-02 ~/synchroedit (main)</span>
          <span className="term-prompt-mark">✦</span>
          <span className="term-prompt-text">refactor the presence sync to use a single channel</span>
        </div>

        <div className="term-plan">
          <div className="term-plan-head">Codex · plan</div>
          <ol className="term-plan-list">
            <li><span className="term-plan-num">1</span>Collapse <em>presenceChannel</em> and <em>cursorChannel</em> into one multiplexed channel.</li>
            <li><span className="term-plan-num">2</span>Introduce <em>kind</em> discriminator on messages.</li>
            <li><span className="term-plan-num">3</span>Update <em>useCollabSession</em> to route by <em>kind</em>.</li>
          </ol>
        </div>

        <div className="term-tool">
          <span className="term-tool-glyph">⌁</span>
          <span className="term-tool-verb">edit</span>
          <span className="term-tool-path">src/collab/channel.ts</span>
          <span className="term-tool-counts">
            <span className="term-diff-plus">+48</span>
            <span className="term-diff-minus">−12</span>
          </span>
        </div>

        <div className="term-diff">
          <div className="term-diff-row">
            <span className="term-diff-gutter">12</span>
            <span className="term-diff-sign term-diff-sign-minus">−</span>
            <span className="term-diff-line term-diff-line-minus">{"const presenceChannel = supa.channel(`presence:${roomId}`)"}</span>
          </div>
          <div className="term-diff-row">
            <span className="term-diff-gutter">13</span>
            <span className="term-diff-sign term-diff-sign-minus">−</span>
            <span className="term-diff-line term-diff-line-minus">{"const cursorChannel = supa.channel(`cursor:${roomId}`)"}</span>
          </div>
          <div className="term-diff-row">
            <span className="term-diff-gutter">12</span>
            <span className="term-diff-sign term-diff-sign-plus">+</span>
            <span className="term-diff-line term-diff-line-plus">{"const channel = supa.channel(`collab:${roomId}`)"}</span>
          </div>
          <div className="term-diff-row">
            <span className="term-diff-gutter">13</span>
            <span className="term-diff-sign term-diff-sign-plus">+</span>
            <span className="term-diff-line term-diff-line-plus">{"channel.on('broadcast', { event: 'sync' }, route)"}</span>
          </div>
          <div className="term-diff-row">
            <span className="term-diff-gutter">14</span>
            <span className="term-diff-sign term-diff-sign-plus">+</span>
            <span className="term-diff-line term-diff-line-plus">{"const route = (m) => handlers[m.kind]?.(m.payload)"}</span>
          </div>
        </div>

        <div className="term-done">
          <span className="term-done-check">✓</span>
          <span>done in 2.4s · 14/14 tests passed</span>
        </div>

        <div className="term-live">
          <span className="term-prompt-path">jordan@node-02 ~/synchroedit (main)</span>
          <span className="term-prompt-mark">✦</span>
          <span className="term-caret-block" />
        </div>
      </div>

      {/* tmux-style status line */}
      <div className="term-status">
        <span className="term-status-zone term-status-left">main · clean</span>
        <span className="term-status-zone term-status-mid">⏻ gpt-4o · codex</span>
        <span className="term-status-zone term-status-right">14:07 · focus</span>
      </div>
    </div>
  );
}

function EduPreview() {
  const RingIcon = ({ pct, tint }) => (
    <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true" className="edu-ring-svg">
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3.5" />
      <circle cx="18" cy="18" r="14" fill="none" stroke={tint} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * 87.96} 87.96`} transform="rotate(-90 18 18)" />
    </svg>
  );

  const TabIcon = ({ path, active }) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={active ? "#ff7a59" : "none"} stroke={active ? "#ff7a59" : "#8b8397"} strokeWidth={active ? "0" : "1.6"} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );

  return (
    <div className="aw app-edu" aria-hidden="true">
      {/* iOS status bar */}
      <div className="edu-statusbar">
        <span className="edu-time">9:41</span>
        <div className="edu-sysicons">
          <svg viewBox="0 0 18 12" width="11" height="8" aria-hidden="true"><path d="M1 11 L1 9 M4 11 L4 7 M7 11 L7 5 M10 11 L10 3 M13 11 L13 1" stroke="#1a1333" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <svg viewBox="0 0 16 12" width="10" height="8" aria-hidden="true"><path d="M8 3 a6 6 0 0 1 6 6 M8 6 a3 3 0 0 1 3 3 M8 9 a0.5 0.5 0 0 1 0 0.1" fill="none" stroke="#1a1333" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <span className="edu-battery"><span /></span>
        </div>
      </div>

      {/* Greeting header */}
      <div className="edu-greet">
        <div className="edu-greet-text">
          <h4 className="edu-hello">Morning, Jordan ☀️</h4>
          <p className="edu-sub">Day 14 streak — let's keep it going</p>
        </div>
        <div className="edu-greet-chips">
          <span className="edu-chip edu-chip-streak">🔥 14</span>
          <span className="edu-chip edu-chip-xp">✦ 2,480 XP</span>
        </div>
      </div>

      {/* Daily Quest hero card */}
      <div className="edu-hero">
        <div className="edu-hero-mascot" aria-hidden="true">
          <svg viewBox="0 0 40 40" width="36" height="36">
            <circle cx="20" cy="20" r="16" fill="rgba(255,255,255,0.22)" />
            <circle cx="14" cy="17" r="2.2" fill="#fff" />
            <circle cx="26" cy="17" r="2.2" fill="#fff" />
            <path d="M14 25 Q20 29 26 25" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="edu-hero-body">
          <span className="edu-hero-label">Today's Quest</span>
          <h4 className="edu-hero-title">Master Recursion</h4>
          <span className="edu-hero-sub">Lesson 4 of 8</span>
          <div className="edu-hero-bar">
            <span className="edu-hero-fill" />
          </div>
          <button className="edu-hero-cta">
            Continue
            <svg viewBox="0 0 14 14" width="9" height="9" aria-hidden="true"><path d="M5 3 L9 7 L5 11" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* Course rail — horizontal scroll */}
      <div className="edu-rail-wrap">
        <div className="edu-rail-head">
          <h5 className="edu-rail-title">Your courses</h5>
          <span className="edu-rail-more">See all</span>
        </div>
        <div className="edu-rail">
          <div className="edu-tile edu-tile-mint">
            <div className="edu-tile-icon">{"{ }"}</div>
            <span className="edu-tile-name">Python</span>
            <RingIcon pct={72} tint="#24a47b" />
          </div>
          <div className="edu-tile edu-tile-lav">
            <div className="edu-tile-icon">JS</div>
            <span className="edu-tile-name">JavaScript</span>
            <RingIcon pct={46} tint="#6b55db" />
          </div>
          <div className="edu-tile edu-tile-sky">
            <div className="edu-tile-icon">⌘</div>
            <span className="edu-tile-name">Data Structures</span>
            <RingIcon pct={85} tint="#3b82c9" />
          </div>
          <div className="edu-tile edu-tile-butter">
            <div className="edu-tile-icon">∑</div>
            <span className="edu-tile-name">Algorithms</span>
            <RingIcon pct={18} tint="#d49619" />
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="edu-tabbar">
        <div className="edu-tab edu-tab-active">
          <TabIcon active path="M3 12 L12 4 L21 12 M5 10 V20 H19 V10" />
          <span>Home</span>
        </div>
        <div className="edu-tab">
          <TabIcon path="M4 12 a8 8 0 1 0 16 0 a8 8 0 0 0 -16 0 M12 4 V12 L17 15" />
          <span>Practice</span>
        </div>
        <div className="edu-tab">
          <TabIcon path="M12 3 L3 8 L12 13 L21 8 Z M3 13 L12 18 L21 13 M3 18 L12 23 L21 18" />
          <span>Quests</span>
        </div>
        <div className="edu-tab">
          <TabIcon path="M5 21 V9 M12 21 V4 M19 21 V14" />
          <span>Leaders</span>
        </div>
        <div className="edu-tab">
          <TabIcon path="M12 12 a4 4 0 1 0 0 -8 a4 4 0 0 0 0 8 M4 21 c0 -4 3.6 -7 8 -7 s8 3 8 7" />
          <span>You</span>
        </div>
      </div>
    </div>
  );
}

function GeoQuestPreview() {
  const bearing = 34;
  const guessPin = { x: 76, y: 136 };
  const actualTarget = { x: 145, y: 104 };
  const mapMidpoint = {
    x: (guessPin.x + actualTarget.x) / 2,
    y: (guessPin.y + actualTarget.y) / 2,
  };
  // Compass needle: 34° bearing. SVG 0° = east, so north = -90°.
  const needleRad = ((bearing - 90) * Math.PI) / 180;
  const needleX = 50 + Math.cos(needleRad) * 28;
  const needleY = 50 + Math.sin(needleRad) * 28;

  return (
    <div className="aw app-geo" aria-hidden="true">
      <div className="geo-scene">
        {/* ── Environment & Backdrop ── */}
        <div className="geo-sky" />
        <div className="geo-horizon-glow" />
        <div className="geo-haze geo-haze-distant" />

        {/* Far Ridge: High Escarpment */}
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="geo-ridge geo-ridge-far">
          <defs>
            <linearGradient id="grf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8294B8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1C2240" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path fill="url(#grf)" d="M0,90 C60,72 110,88 170,65 S260,55 330,68 S420,62 400,120 L0,120 Z" />
        </svg>

        {/* Mid Ridge: Karoo Plateau */}
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="geo-ridge geo-ridge-mid">
          <defs>
            <linearGradient id="grm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A2A5C" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0B0916" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#grm)" d="M0,88 C40,70 100,82 140,50 S220,25 270,45 S350,60 400,50 L400,120 L0,120 Z" />
        </svg>

        {/* Atmospheric Haze */}
        <div className="geo-haze geo-haze-mid" />

        {/* Near Ridge: Foreground Escarpment */}
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="geo-ridge geo-ridge-near">
          <defs>
            <linearGradient id="grn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E0D16" stopOpacity="1" />
              <stop offset="100%" stopColor="#040408" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path fill="url(#grn)" d="M0,85 C35,80 75,60 125,70 S200,80 250,58 S330,45 400,62 L400,120 L0,120 Z" />
        </svg>

        <div className="geo-ground" />
        <div className="geo-scan-overlay" />
        <div className="geo-vignette" />
        <div className="geo-grain" />

        {/* ── Central Reticle ── */}
        <div className="geo-target-reticle">
          <div className="geo-reticle-ring geo-reticle-ring-outer" />
          <div className="geo-reticle-ring geo-reticle-ring-inner" />
          <div className="geo-reticle-cross geo-reticle-cross-h" />
          <div className="geo-reticle-cross geo-reticle-cross-v" />
        </div>

        {/* ── Compass ── */}
        <div className="geo-compass">
          <svg viewBox="0 0 100 100" className="geo-compass-svg">
            <circle cx="50" cy="50" r="45" className="geo-compass-arc" />
            {[0, 90, 180, 270].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="10"
                x2="50"
                y2="18"
                className="geo-compass-tick"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            <text x="50" y="28" className="geo-compass-label" textAnchor="middle">N</text>
            <g className="geo-needle-group" transform={`rotate(${bearing} 50 50)`}>
              <line x1="50" y1="50" x2={needleX} y2={needleY} className="geo-compass-needle" />
              <circle cx="50" cy="50" r="3" className="geo-compass-hub" />
            </g>
          </svg>
          <span className="geo-bearing">{bearing}° NE</span>
        </div>

        {/* ── Central Reticle & Compass ── */}
        <div className="geo-target-reticle">
          <span className="geo-reticle-ring geo-reticle-ring-outer" />
          <span className="geo-reticle-ring geo-reticle-ring-inner" />
          <span className="geo-reticle-cross geo-reticle-cross-h" />
          <span className="geo-reticle-cross geo-reticle-cross-v" />
        </div>

        <div className="geo-compass">
          <svg viewBox="0 0 100 100" className="geo-compass-svg">
            <circle cx="50" cy="50" r="42" className="geo-compass-arc" strokeDasharray="197.9 65.97" transform="rotate(135 50 50)" />
            <line x1="50" y1="5" x2="50" y2="12" className="geo-compass-tick" />
            <line x1="95" y1="50" x2="88" y2="50" className="geo-compass-tick" />
            <line x1="50" y1="95" x2="50" y2="88" className="geo-compass-tick" />
            <line x1="5" y1="50" x2="12" y2="50" className="geo-compass-tick" />
            <text x="50" y="20" textAnchor="middle" className="geo-compass-label">N</text>
            <text x="84" y="54" textAnchor="middle" className="geo-compass-label">E</text>
            <text x="50" y="91" textAnchor="middle" className="geo-compass-label">S</text>
            <text x="16" y="54" textAnchor="middle" className="geo-compass-label">W</text>
            <g className="geo-needle-group">
              <line x1="50" y1="50" x2={needleX} y2={needleY} className="geo-compass-needle" />
              <circle cx="50" cy="50" r="2" className="geo-compass-hub" />
            </g>
          </svg>
          <div className="geo-bearing">Bearing {bearing}° NE</div>
        </div>

        {/* ── Left Telemetry Console ── */}
        <div className="geo-side-panel geo-side-panel-left">
          <div className="geo-side-head">
            <span className="geo-side-kicker">Terrain Telemetry</span>
            <span className="geo-side-status">ACTIVE</span>
          </div>
          <div className="geo-side-reading">
            <span className="geo-side-reading-value">842m</span>
            <span className="geo-side-reading-label">Elevation</span>
          </div>
          <div className="geo-side-metrics">
            <div className="geo-side-metric">
              <span>Azimuth</span>
              <strong>284° W</strong>
            </div>
            <div className="geo-side-metric">
              <span>Biome</span>
              <strong>Scrub</strong>
            </div>
            <div className="geo-side-metric">
              <span>Surface</span>
              <strong>Red Soil</strong>
            </div>
          </div>
          <div className="geo-side-visual">
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="geo-topo-wave">
              <path d="M0,20 Q10,15 20,25 T40,20 T60,25 T80,18 T100,22 L100,40 L0,40 Z" fill="rgba(93, 233, 255, 0.1)" stroke="var(--cyan)" strokeWidth="0.5" />
              <path d="M0,22 Q15,28 30,22 T60,28 T90,22" fill="none" stroke="var(--cyan)" strokeWidth="0.2" opacity="0.4" />
            </svg>
            <div className="geo-side-visual-label">Topographic Signal</div>
          </div>
        </div>

        {/* ── Right Intel Console ── */}
        <div className="geo-side-panel geo-side-panel-right">
          <div className="geo-side-head">
            <span className="geo-side-kicker">Challenge Protocol</span>
            <span className="geo-side-status geo-side-status-cyan">RANKED</span>
          </div>
          <ul className="geo-side-list">
            <li>Fixed-position scouting</li>
            <li>Minimap alignment active</li>
            <li>No external tools allowed</li>
          </ul>
          <div className="geo-intel-footer">
            <div className="geo-intel-bits">
              <span /> <span /> <span /> <span />
            </div>
            SECURE LINK
          </div>
        </div>

        {/* ── Bottom Command Console ── */}
        <div className="geo-game-ui">
          <div className="geo-bottom-row">
            <div className="geo-location">
              <div className="geo-location-topline">
                <span className="geo-location-tag">Environment Analysis</span>
                <span className="geo-location-lock">S-ID // 04-ALPHA</span>
              </div>
              <div className="geo-location-head">Eastern Cape Highlands</div>
              <div className="geo-location-sub">Region: South Africa · Sector: Karoo Ridge</div>
              
              <div className="geo-location-grid">
                <div className="geo-grid-cell">
                  <span className="geo-grid-label">Wind Velocity</span>
                  <strong className="geo-grid-value">12.4 kn</strong>
                </div>
                <div className="geo-grid-cell">
                  <span className="geo-grid-label">Luminosity</span>
                  <strong className="geo-grid-value">Dusk / 18:42</strong>
                </div>
                <div className="geo-grid-cell">
                  <span className="geo-grid-label">Horizon Profile</span>
                  <strong className="geo-grid-value">Layered</strong>
                </div>
                <div className="geo-grid-cell">
                  <span className="geo-grid-label">Vegetation</span>
                  <strong className="geo-grid-value">Arid Scrub</strong>
                </div>
              </div>
            </div>

            <div className="geo-mapbox">
              <div className="geo-map-frame">
                <svg viewBox="0 0 200 200" className="geo-map-svg">
                  <defs>
                    <linearGradient id="geoMapTerrain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B1320" />
                      <stop offset="100%" stopColor="#040914" />
                    </linearGradient>
                    <filter id="geoMapGuessGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                    <clipPath id="geoMapClip">
                      <rect x="0" y="0" width="200" height="200" rx="4" />
                    </clipPath>
                  </defs>
                  <rect x="0" y="0" width="200" height="200" fill="url(#geoMapTerrain)" />

                  <g clipPath="url(#geoMapClip)">
                    <g className="geo-map-graticule">
                      {[40, 80, 120, 160].map((v) => (
                        <Fragment key={v}>
                          <line x1="0" y1={v} x2="200" y2={v} />
                          <line x1={v} y1="0" x2={v} y2="200" />
                        </Fragment>
                      ))}
                    </g>

                    <g className="geo-map-contours">
                      <path className="geo-map-contour-fill" d="M34,-8 Q82,38 164,22 T208,52 L208,-8 Z" />
                      <path d="M58,-6 Q88,30 154,16 T208,34" />
                      <path d="M76,-6 Q106,22 144,4 T196,-6" />
                      <path d="M-10,144 Q34,130 76,154 T208,126" />
                      <path d="M-10,166 Q28,160 70,180 T208,152" />
                    </g>

                    <path className="geo-map-road" d="M-10,86 Q40,92 88,74 T152,112 T210,128" />
                    
                    <line x1={guessPin.x} y1={guessPin.y} x2={actualTarget.x} y2={actualTarget.y} className="geo-map-line" />

                    <g transform={`translate(${actualTarget.x}, ${actualTarget.y})`}>
                      <circle cx="0" cy="0" r="14" className="geo-map-target-radar" />
                      <circle cx="0" cy="0" r="2.5" className="geo-map-target-dot" />
                    </g>

                    <g transform={`translate(${guessPin.x}, ${guessPin.y})`}>
                      <circle cx="0" cy="0" r="16" className="geo-map-pin-halo" filter="url(#geoMapGuessGlow)" />
                      <circle cx="0" cy="0" r="4" className="geo-map-pin-core" />
                      <path d="M0,-14 L-8,2 L8,2 Z" className="geo-map-pin-pointer" />
                    </g>

                    <g transform={`translate(${mapMidpoint.x}, ${mapMidpoint.y})`}>
                      <rect x="-19" y="-6" width="38" height="12" rx="2" className="geo-map-dist-bg" />
                      <text x="0" y="3" className="geo-map-dist-text">14.2KM</text>
                    </g>
                  </g>
                </svg>

                <div className="geo-map-label-overlay">TACTICAL MINIMAP</div>
                <div className="geo-map-zoom-pill">4.2x</div>
              </div>
              <div className="geo-map-footer">
                <span>COORD LOCK: 32.1°S / 24.3°E</span>
              </div>
            </div>
          </div>

          <div className="geo-action-row">
            <div className="geo-action-meta">
              <span className="geo-action-kicker">Deployment Status</span>
              <span className="geo-action-copy">Marker initialized. Prepare to lock coordinates.</span>
            </div>
            <div className="geo-cta">
              <svg viewBox="0 0 12 12" className="geo-cta-glyph" aria-hidden="true">
                <path d="M6 1.2 C3.9 1.2 2.2 2.9 2.2 5 c0 2.8 3.8 5.8 3.8 5.8 S9.8 7.8 9.8 5 C9.8 2.9 8.1 1.2 6 1.2Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="6" cy="5" r="1.35" fill="currentColor" />
              </svg>
              <span>CONFIRM GUESS</span>
              <div className="geo-cta-glow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RugbyPreview() {
  return (
    <div className="aw app-rugby" aria-hidden="true">
      <div className="rug-ticker">
        <span className="rug-live-dot" />
        <span className="rug-ticker-text">LIVE · DAY 1 · POOL STAGE · URC</span>
      </div>

      <div className="rug-hero">
        <div className="rug-hero-row">
          <div className="rug-team rug-team-left">
            <div className="rug-team-name">SHARKS</div>
            <div className="rug-team-meta">DURBAN · HOME</div>
          </div>
          <div className="rug-score">21 — 17</div>
          <div className="rug-team rug-team-right">
            <div className="rug-team-name">STORMERS</div>
            <div className="rug-team-meta">CAPE TOWN · AWAY</div>
          </div>
        </div>
        <div className="rug-hero-meta">HT 14 — 10 · 73' · KINGS PARK · REF J.PEYPER</div>
      </div>

      <div className="rug-section">
        <div className="rug-section-rule" />
        <div className="rug-section-label">UP NEXT</div>
      </div>

      <div className="rug-upnext">
        <div className="rug-upnext-row">
          <span className="rug-upnext-team">BULLS</span>
          <span className="rug-upnext-vs">VS</span>
          <span className="rug-upnext-team">LIONS</span>
          <span className="rug-upnext-time">19:00</span>
        </div>
        <div className="rug-upnext-row">
          <span className="rug-upnext-team">CHEETAHS</span>
          <span className="rug-upnext-vs">VS</span>
          <span className="rug-upnext-team">PUMAS</span>
          <span className="rug-upnext-time">21:15</span>
        </div>
      </div>

      <div className="rug-nav">
        <span className="rug-nav-item rug-nav-active">MATCHES</span>
        <span className="rug-nav-item">STANDINGS</span>
        <span className="rug-nav-item">NEWS</span>
        <span className="rug-nav-item">TEAMS</span>
      </div>
    </div>
  );
}

function PerfGauge({ label, value, unit, arcClass, percent, warn }) {
  // 270° arc, radius 40, center 50,50; full circumference for 270deg arc
  const r = 40;
  const circ = 2 * Math.PI * r;
  const arcLen = (270 / 360) * circ;
  const filled = arcLen * percent;
  const startRot = 135; // start at lower-left
  return (
    <div className={`perf-gauge${warn ? " perf-gauge-warn" : ""}`}>
      <div className="perf-gauge-label">{label}</div>
      <div className="perf-gauge-face">
        <svg viewBox="0 0 100 100" className="perf-gauge-svg">
          {/* background arc */}
          <circle
            cx="50" cy="50" r={r}
            className="perf-gauge-bg"
            strokeDasharray={`${arcLen} ${circ}`}
            transform={`rotate(${startRot} 50 50)`}
          />
          {/* filled arc */}
          <circle
            cx="50" cy="50" r={r}
            className={`perf-gauge-arc ${arcClass}`}
            strokeDasharray={`${filled} ${circ}`}
            transform={`rotate(${startRot} 50 50)`}
          />
          {/* tick marks every 30deg along the 270 arc */}
          {Array.from({ length: 10 }).map((_, i) => {
            const deg = startRot + (i * 30);
            const rad = (deg * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 44;
            const y1 = 50 + Math.sin(rad) * 44;
            const x2 = 50 + Math.cos(rad) * 48;
            const y2 = 50 + Math.sin(rad) * 48;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="perf-gauge-tick" />;
          })}
          {/* needle */}
          <line
            x1="50" y1="50"
            x2={50 + Math.cos(((startRot + percent * 270) * Math.PI) / 180) * 34}
            y2={50 + Math.sin(((startRot + percent * 270) * Math.PI) / 180) * 34}
            className="perf-gauge-needle"
          />
          <circle cx="50" cy="50" r="2.2" className="perf-gauge-hub" />
        </svg>
        <div className="perf-gauge-readout">
          <span className="perf-gauge-val">{value}</span>
          <span className="perf-gauge-unit">{unit}</span>
        </div>
      </div>
      <div className="perf-gauge-trail">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}

function PerfToggle({ name, on }) {
  return (
    <div className={`perf-toggle${on ? " perf-toggle-on" : ""}`}>
      <span className="perf-toggle-track">
        <span className="perf-toggle-puck" />
      </span>
      <span className="perf-toggle-label">{name}</span>
    </div>
  );
}

function PerfPreview() {
  return (
    <div className="aw app-perf" aria-hidden="true">
      <div className="perf-profiles">
        <div className="perf-profile-group">
          <div className="perf-profile perf-profile-active">ESPORTS</div>
          <div className="perf-profile">BALANCED</div>
          <div className="perf-profile">BATTERY</div>
        </div>
        <div className="perf-sys-id">KERNEL 6.8 · PREEMPT_RT · NODE-02</div>
      </div>

      <div className="perf-gauges">
        <PerfGauge label="INPUT LATENCY" value="6.8" unit="ms" arcClass="perf-arc-teal" percent={0.32} />
        <PerfGauge label="AVG FPS" value="214" unit="fps" arcClass="perf-arc-teal" percent={0.72} />
        <PerfGauge label="1% LOW" value="142" unit="fps" arcClass="perf-arc-warn" percent={0.48} warn />
      </div>

      <div className="perf-scope">
        <div className="perf-scope-head">
          <span>FRAME TIME</span>
          <span className="perf-scope-annot">SPIKE 21.4 ms @ 14:03</span>
        </div>
        <div className="perf-scope-body">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="perf-scope-svg">
            {/* dashed 16.67ms reference line */}
            <line x1="0" y1="36" x2="200" y2="36" className="perf-scope-ref" />
            {/* waveform */}
            <polyline
              className="perf-scope-wave"
              points="0,38 10,36 18,37 26,34 34,38 42,35 50,37 58,33 66,36 74,38 82,35 90,37 98,34 106,8 114,36 122,38 130,35 138,37 146,34 154,36 162,38 170,35 178,37 186,34 194,36 200,38"
            />
            {/* spike marker */}
            <circle cx="106" cy="8" r="2" className="perf-scope-spike" />
          </svg>
        </div>
      </div>

      <div className="perf-tweaks">
        <PerfToggle name="isolcpus" on />
        <PerfToggle name="rcu_nocbs" on />
        <PerfToggle name="mitigations=off" on />
        <PerfToggle name="threadirq" on={false} />
        <PerfToggle name="PREEMPT_RT" on={false} />
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
        const elements = scene.querySelectorAll(".reveal-line span, .fade-rise");
        if (elements.length > 0) {
          gsap.from(elements, {
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
        }
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

      gsap.from(".am-pin-cross", {
        scale: 1.6,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-scene", start: "top 62%" },
      });

      gsap.from(".am-status-bar, .am-hud-top-left, .am-hud-province", {
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
