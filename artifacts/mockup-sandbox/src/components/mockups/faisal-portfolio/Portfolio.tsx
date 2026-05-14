import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Work", "Skills", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "FinTrack",
    description: "A real-time personal finance dashboard with ML-powered spending insights and predictive budgeting.",
    tags: ["React", "Node.js", "PostgreSQL", "TensorFlow"],
    year: "2024",
    link: "#",
  },
  {
    id: 2,
    title: "Collab",
    description: "Real-time collaborative document editor with operational transform conflict resolution at scale.",
    tags: ["TypeScript", "WebSockets", "Redis", "AWS"],
    year: "2024",
    link: "#",
  },
  {
    id: 3,
    title: "PulseAPI",
    description: "High-performance API gateway handling 2M+ daily requests with intelligent rate limiting and analytics.",
    tags: ["Go", "Kubernetes", "Prometheus", "gRPC"],
    year: "2023",
    link: "#",
  },
  {
    id: 4,
    title: "Lyric",
    description: "AI-assisted music discovery app that learns listener taste through implicit feedback loops.",
    tags: ["Swift", "Python", "Spotify API", "CoreML"],
    year: "2023",
    link: "#",
  },
];

const SKILLS = [
  { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Go", "Python", "GraphQL", "REST APIs"] },
  { category: "Data & Cloud", items: ["PostgreSQL", "Redis", "AWS", "Kubernetes", "Docker"] },
  { category: "Tools", items: ["Git", "CI/CD", "Jest", "Figma", "Vim"] },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function Portfolio() {
  const [activeSection, setActiveSection] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((n) => document.getElementById(n.toLowerCase()));
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s && s.offsetTop <= scrollY) {
          setActiveSection(NAV_LINKS[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white font-['Inter'] selection:bg-[#6366f1] selection:text-white"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .project-card:hover .arrow-icon { transform: translate(3px, -3px); }
        .arrow-icon { transition: transform 0.25s ease; }
        .nav-link::after { content: ''; display: block; height: 1px; background: #6366f1; transform: scaleX(0); transition: transform 0.3s ease; transform-origin: left; }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
        .skill-chip { transition: all 0.2s ease; }
        .skill-chip:hover { background: #6366f1; color: white; transform: translateY(-2px); }
        .glow { box-shadow: 0 0 80px 20px rgba(99,102,241,0.08); }
      `}</style>

      {/* Custom cursor */}
      <div
        style={{
          position: "fixed",
          left: cursorPos.x - 20,
          top: cursorPos.y - 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(99,102,241,0.5)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "opacity 0.3s, transform 0.15s",
          opacity: hovering ? 1 : 0,
          transform: "scale(1)",
          mixBlendMode: "screen" as const,
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          background: "rgba(10,10,10,0.85)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.03em", color: "#fff" }}>
            FA<span style={{ color: "#6366f1" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: 36 }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`nav-link ${activeSection === link ? "active" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeSection === link ? "#fff" : "#666",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  padding: "4px 0",
                  transition: "color 0.2s",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="about"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 80,
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 32px 0",
          position: "relative",
        }}
      >
        {/* BG glow */}
        <div className="glow" style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", paddingTop: 80 }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Available for opportunities
            </span>
            <span style={{ marginLeft: 12, display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", verticalAlign: "middle" }} />
          </div>

          <h1
            style={{
              fontSize: "clamp(52px, 7vw, 88px)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              marginBottom: 32,
              color: "#fff",
            }}
          >
            Faisal<br />
            <span style={{ color: "#6366f1" }}>Ambursa</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#888",
              maxWidth: 560,
              lineHeight: 1.7,
              marginBottom: 48,
              fontWeight: 400,
            }}
          >
            Software engineer building fast, reliable, and beautifully crafted digital products.
            I care about clean code, great UX, and systems that scale.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => scrollTo("Work")}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "background 0.2s, transform 0.2s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "#4f46e5"; (e.target as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "#6366f1"; (e.target as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              View Work
            </button>
            <button
              onClick={() => scrollTo("Contact")}
              style={{
                background: "transparent",
                color: "#888",
                border: "1px solid #222",
                borderRadius: 8,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "border-color 0.2s, color 0.2s, transform 0.2s",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = "#6366f1"; (e.target as HTMLButtonElement).style.color = "#fff"; (e.target as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = "#222"; (e.target as HTMLButtonElement).style.color = "#888"; (e.target as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              Get in touch
            </button>
          </div>

          {/* Social */}
          <div style={{ display: "flex", gap: 20, marginTop: 64 }}>
            {[
              { label: "GitHub", href: "https://github.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "Twitter", href: "https://twitter.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 13,
                  color: "#555",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#6366f1")}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#555")}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" style={{ maxWidth: 1100, margin: "0 auto", padding: "160px 32px 80px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 64 }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff" }}>
              Selected Work
            </h2>
            <span style={{ fontSize: 13, color: "#444", fontWeight: 500 }}>0{PROJECTS.length} projects</span>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.id} delay={i * 80}>
              <div
                className="project-card"
                style={{
                  borderTop: "1px solid #141414",
                  padding: "36px 0",
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: "0 40px",
                  alignItems: "start",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.015)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
              >
                <span style={{ fontSize: 13, color: "#444", fontWeight: 500, paddingTop: 4 }}>{project.year}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "#fff" }}>{project.title}</h3>
                  </div>
                  <p style={{ fontSize: 15, color: "#666", lineHeight: 1.65, maxWidth: 560, marginBottom: 20 }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 12,
                          color: "#555",
                          background: "#111",
                          border: "1px solid #1e1e1e",
                          borderRadius: 4,
                          padding: "3px 10px",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="arrow-icon"
                  style={{
                    fontSize: 18,
                    color: "#333",
                    paddingTop: 4,
                  }}
                >
                  ↗
                </div>
              </div>
            </FadeIn>
          ))}
          <div style={{ borderTop: "1px solid #141414" }} />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
        <FadeIn>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", marginBottom: 64 }}>
            Skills
          </h2>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 40 }}>
          {SKILLS.map((group, i) => (
            <FadeIn key={group.category} delay={i * 60}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
                  {group.category}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="skill-chip"
                      style={{
                        fontSize: 13,
                        color: "#888",
                        background: "#111",
                        border: "1px solid #1e1e1e",
                        borderRadius: 6,
                        padding: "6px 14px",
                        fontWeight: 500,
                        cursor: "default",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px 140px" }}>
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            borderRadius: 20,
            padding: "80px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
          <FadeIn>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#6366f1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              Get in touch
            </p>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#fff",
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              Let&apos;s build something<br />
              <span style={{ color: "#6366f1" }}>great together.</span>
            </h2>
            <p style={{ fontSize: 16, color: "#666", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.65 }}>
              I&apos;m open to full-time roles, freelance projects, and interesting collaborations.
            </p>
            <a
              href="mailto:faisal@ambursa.dev"
              style={{
                display: "inline-block",
                background: "#6366f1",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 8,
                padding: "16px 36px",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                transition: "background 0.2s, transform 0.2s",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.background = "#4f46e5"; (e.target as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.background = "#6366f1"; (e.target as HTMLAnchorElement).style.transform = "translateY(0)"; }}
            >
              Say hello ↗
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #141414",
          padding: "32px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#333", fontWeight: 600, letterSpacing: "-0.02em" }}>
          FA<span style={{ color: "#6366f1" }}>.</span>
        </span>
        <span style={{ fontSize: 12, color: "#333" }}>
          © 2025 Faisal Ambursa. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
