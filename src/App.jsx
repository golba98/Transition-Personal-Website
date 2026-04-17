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
    title: "GeoQuest 3D",
    role: "3D game · Unity",
    outcome: "A geo-guesser style game with playable 3D scenes and real location data. Built in Unity from scratch.",
    stack: ["Unity", "Game Development", "3D Interaction"],
    tone: "cyan",
  },
  {
    id: "02",
    title: "RugbyMate",
    role: "Event-management program",
    outcome: "Software I built to run a school rugby tournament — fixtures, scheduling, and coordination all in one place.",
    stack: ["JavaScript", "Planning Tools", "School Event"],
    tone: "amber",
  },
  {
    id: "03",
    title: "TryPOS",
    role: "Point-of-sale system",
    outcome: "A working POS system for school event stalls. PHP and SQL backend, kept simple enough to actually use on the day.",
    stack: ["PHP", "SQL", "Business Logic"],
    tone: "green",
  },
  {
    id: "04",
    title: "BinCalc",
    role: "HP Prime calculator utility",
    outcome: "A binary calculator for the HP Prime with a menu-driven interface. Built to make base conversion easier to practice and check.",
    stack: ["HP Prime", "Algorithms", "Utility UI"],
    tone: "cyan",
  },
  {
    id: "05",
    title: "FileFlow",
    role: "Workflow utility tools",
    outcome: "Python scripts for sorting files, building study aids, and cutting out repetitive tasks I kept doing by hand.",
    stack: ["Python", "Automation", "Productivity"],
    tone: "amber",
  },
  {
    id: "06",
    title: "EduTool",
    role: "Educational app experiments",
    outcome: "Small interactive tools for practising math and code. The point was immediate feedback, not just showing the answer.",
    stack: ["Python", "JavaScript", "Learning Tools"],
    tone: "green",
  },
  {
    id: "07",
    title: "GameOpt",
    role: "Performance and setup optimisation",
    outcome: "Configs, notes, and experiments around squeezing performance out of a setup — input latency, Linux tweaks, hardware tradeoffs.",
    stack: ["Linux", "Hardware", "Performance"],
    tone: "green",
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
      "Real-time editing in the browser. I built it to understand how collaborative text tools actually work under the hood.",
    tags: ["JavaScript", "Realtime UI", "Editor Tools"],
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
      "A TypeScript dev tool built around AI-assisted coding workflows. Still being developed.",
    tags: ["TypeScript", "Developer Tools", "AI"],
    status: "Active",
  },
  "hp-prime-ppl-python": {
    description:
      "Scripting for the HP Prime and related Python utilities. Started alongside the BinCalc project.",
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

function ProjectVisual({ project, active }) {
  return (
    <div className={`project-visual tone-${project.tone} ${active ? "is-active" : ""}`}>
      <div className="visual-horizon" />
      <div className="visual-grid" />
      <div className="visual-orbit visual-orbit-a" />
      <div className="visual-orbit visual-orbit-b" />
      <div className="visual-orbit visual-orbit-c" />
      <div className="visual-core">
        <span>{project.id}</span>
        <div className="visual-pulse" />
      </div>
      <div className="visual-scanline" />
      <div className="visual-corner visual-corner-tl" />
      <div className="visual-corner visual-corner-tr" />
      <div className="visual-corner visual-corner-bl" />
      <div className="visual-corner visual-corner-br" />
      <div className="visual-transition-flash" />
      <div className="visual-bars">
        <i />
        <i />
        <i />
        <i />
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
          <div className="portrait-silhouette" />
          <div className="portrait-scan" />
          <div className="portrait-crosshair" />
          <div className="portrait-hud">
            <span>ID_LAYER_06</span>
            <span>Eastern Cape · ZA</span>
            <span>BSc CS · Active</span>
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow fade-rise">About</p>
          <h2 id="about-title" className="reveal-line">
            <span>I like hard problems, learning how things work, and building things that are actually useful.</span>
          </h2>
          <p className="fade-rise">
            I'm based in the Eastern Cape and studying CS through the University of
            London. Outside of coursework I build small systems — event software, calculator
            tools, file scripts, game experiments. I've also worked real jobs in hospitality
            and a property internship, which taught me more about communication and
            reliability than most courses do.
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
