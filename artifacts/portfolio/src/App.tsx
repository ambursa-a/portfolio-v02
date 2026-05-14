import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const queryClient = new QueryClient();

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

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Portfolio() {
  const [activeSection, setActiveSection] = useState("About");
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [hovering, setHovering] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((n) => document.getElementById(n.toLowerCase()));
      const currentScroll = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s && s.offsetTop <= currentScroll) {
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
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border border-primary/50 mix-blend-screen"
        animate={{
          x: cursorPos.x - 20,
          y: cursorPos.y - 20,
          opacity: hovering ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 2 }}
        style={{ width: 40, height: 40 }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1100px] mx-auto px-8 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            FA<span className="text-primary">.</span>
          </span>
          <div className="flex gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="relative text-sm font-medium transition-colors hover:text-foreground"
                style={{ color: activeSection === link ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {link}
                {activeSection === link && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="min-h-[100dvh] flex items-center max-w-[1100px] mx-auto px-8 pt-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.07] blur-[100px] pointer-events-none" />
        
        <motion.div className="w-full pt-20 relative z-10" style={{ opacity: heroOpacity, y: heroY }}>
          <FadeIn>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-xs font-semibold text-primary tracking-[0.12em] uppercase">
                Available for opportunities
              </span>
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-[clamp(3.25rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.04em] mb-8 text-foreground">
              Faisal<br />
              <span className="text-primary">Ambursa</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-[clamp(1rem,2vw,1.25rem)] text-muted-foreground max-w-[560px] leading-[1.7] mb-12">
              Software engineer building fast, reliable, and beautifully crafted digital products.
              I care about clean code, great UX, and systems that scale.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => scrollTo("Work")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/20"
              >
                View Work
              </button>
              <button
                onClick={() => scrollTo("Contact")}
                className="bg-transparent hover:bg-border/50 text-foreground border border-border px-7 py-3.5 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Get in touch
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex gap-6 mt-16">
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
                  className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors flex items-center gap-1 group"
                >
                  {label}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>
          </FadeIn>
        </motion.div>
      </section>

      {/* Work */}
      <section id="work" className="max-w-[1100px] mx-auto px-8 py-32">
        <FadeIn>
          <div className="flex items-baseline gap-4 mb-16">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-foreground">
              Selected Work
            </h2>
            <span className="text-sm text-muted-foreground font-medium">0{PROJECTS.length} projects</span>
          </div>
        </FadeIn>

        <div className="flex flex-col">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.1}>
              <a
                href={project.link}
                className="group block border-t border-border py-10 hover:bg-white/[0.02] transition-colors -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-[80px_1fr_auto] gap-x-10 items-start"
              >
                <span className="text-sm text-muted-foreground font-medium pt-1 hidden sm:block">{project.year}</span>
                <div>
                  <div className="flex items-center justify-between sm:justify-start gap-4 mb-3">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                    <span className="text-sm text-muted-foreground font-medium sm:hidden">{project.year}</span>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-[560px] mb-6">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground bg-card border border-border rounded px-2.5 py-1 font-medium tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:block pt-1">
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
              </a>
            </FadeIn>
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="max-w-[1100px] mx-auto px-8 py-32">
        <FadeIn>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-foreground mb-16">
            Skills
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {SKILLS.map((group, i) => (
            <FadeIn key={group.category} delay={i * 0.1}>
              <div>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-5">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="text-sm text-muted-foreground bg-card border border-border rounded-md px-3.5 py-1.5 font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hover:-translate-y-0.5 cursor-default"
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
      <section id="contact" className="max-w-[1100px] mx-auto px-8 py-32 pb-48">
        <div className="bg-card border border-border rounded-2xl p-12 sm:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(99,102,241,0.1)_0%,transparent_60%)] pointer-events-none" />
          
          <FadeIn>
            <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-5 relative z-10">
              Get in touch
            </p>
            <h2 className="text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-tight text-foreground mb-6 leading-tight relative z-10">
              Let&apos;s build something<br />
              <span className="text-primary">great together.</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-[440px] mx-auto mb-10 leading-relaxed relative z-10">
              I&apos;m open to full-time roles, freelance projects, and interesting collaborations.
            </p>
            <a
              href="mailto:faisal@ambursa.dev"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/20 relative z-10"
            >
              Say hello <ArrowUpRight className="w-4 h-4" />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-bold text-sm tracking-tight text-foreground">
            FA<span className="text-primary">.</span>
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            © {new Date().getFullYear()} Faisal Ambursa. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
