import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import TaskFlow from "@/pages/taskflow";
import ShopNow from "@/pages/shopnow";
import Hosting from "@/pages/hosting";
import { GameWidget } from "@/components/GameWidget";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sun, Moon } from "lucide-react";

const queryClient = new QueryClient();

const NAV_LINKS = ["About", "Work", "Skills", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "Campus WiFi Management Platform",
    description:
      "Token-based internet access system for a university campus pilot. Handles payment processing via Paystack, token delivery over WhatsApp/SMS via Termii, and network session control through MikroTik router API.",
    tags: ["Node.js", "Express", "Prisma", "PostgreSQL", "MikroTik API", "Paystack", "Termii"],
    year: "2025",
    link: "",
  },
  {
    id: 2,
    title: "Multi-Branch Restaurant Operations Dashboard",
    description:
      "Internal operations dashboard for multi-location restaurant management — order tracking, branch performance metrics, and role-based access control.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
    year: "2025",
    link: "",
  },
  {
    id: 3,
    title: "Internal Workflow & Client Management System",
    description:
      "CRM and workflow tool for service businesses — client records, project pipelines, task management, and status tracking.",
    tags: ["Next.js", "Node.js", "Prisma", "PostgreSQL"],
    year: "2025",
    link: "",
  },
  {
    id: 4,
    title: "AI-Powered Sales Automation Pipeline",
    description:
      "Automated outreach pipeline that uses an LLM to generate personalized emails, sends via Gmail OAuth2, and routes lead signals to Telegram for real-time monitoring.",
    tags: ["Node.js", "DeepSeek API", "Gmail OAuth2", "Telegram Bot API"],
    year: "2025",
    link: "",
  },
];

const SKILLS = [
  {
    category: "Software Engineering",
    items: ["Node.js / Express", "React / Next.js", "PostgreSQL / Prisma ORM", "REST API Design", "System Architecture", "Docker"],
  },
  {
    category: "Machine Learning & AI",
    items: ["Python", "PyTorch / TensorFlow", "Scikit-learn", "Data Preprocessing & Feature Engineering", "Model Training & Evaluation", "ML Pipeline Design", "LLM API Integration"],
  },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const sx = useSpring(mx, { stiffness: 200, damping: 22, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 200, damping: 22, mass: 0.5 });
  const cx = useTransform(sx, v => v - 14);
  const cy = useTransform(sy, v => v - 14);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); setVisible(true); };
    const leave = () => setVisible(false);
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const touch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) { mx.set(t.clientX); my.set(t.clientY); setVisible(true); }
    };
    const touchEnd = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchend", touchEnd);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("touchstart", touch);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [mx, my]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-foreground"
      style={{ x: cx, y: cy, opacity: visible ? 1 : 0, mixBlendMode: "difference" }}
      animate={{ width: clicking ? 18 : 28, height: clicking ? 18 : 28 }}
      transition={{ width: { duration: 0.12 }, height: { duration: 0.12 } }}
    />
  );
}

function PaperPlane({ onOpen }: { onOpen?: () => void }) {
  const [vw, setVw] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  const [showTip, setShowTip] = useState(false);
  const [trailX, setTrailX] = useState(24);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll();
  const PAD = 24;
  const PLANE_W = 36;
  const travelEnd = vw - PLANE_W - PAD;

  const xRaw = useTransform(scrollYProgress, [0, 1], [PAD, travelEnd]);
  const x = useSpring(xRaw, { stiffness: 50, damping: 20, mass: 1 });

  // Tilt based on horizontal position — nose dips slightly at edges
  const tiltDeg = useTransform(x, [PAD, travelEnd * 0.5, travelEnd], [-8, 0, 8]);

  // Update trail endpoint to follow plane
  useEffect(() => {
    return x.on("change", (v) => setTrailX(v + PLANE_W / 2));
  }, [x]);

  return (
    <>
      {/* Dashed trail line behind the plane */}
      <svg
        className="fixed bottom-[28px] left-0 z-39 pointer-events-none hidden sm:block"
        style={{ width: vw, height: 2, overflow: "visible" }}
      >
        <motion.line
          x1={PAD + PLANE_W / 2}
          y1={1}
          x2={trailX}
          y2={1}
          stroke="hsl(var(--border))"
          strokeWidth={1}
          strokeDasharray="4 5"
        />
      </svg>

      {/* Plane */}
      <motion.button
        onClick={() => onOpen?.()}
        onHoverStart={() => setShowTip(true)}
        onHoverEnd={() => setShowTip(false)}
        className="fixed bottom-4 z-40 select-none"
        style={{ x }}
        aria-label="Play game"
      >
        <AnimatePresence>
          {showTip && (
            <motion.span
              key="tip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold tracking-widest uppercase text-muted-foreground border border-border bg-background px-2 py-0.5"
            >
              Play Game
            </motion.span>
          )}
        </AnimatePresence>

        {/* Gentle float animation */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.svg
            width={PLANE_W}
            height={22}
            viewBox="0 0 36 22"
            fill="none"
            style={{ rotate: tiltDeg }}
          >
            {/* Upper wing — tip top-left, nose right-centre */}
            <path
              d="M2 2 L34 11 L10 11 Z"
              className="fill-foreground"
            />
            {/* Lower wing — tip bottom-left, nose right-centre */}
            <path
              d="M2 20 L34 11 L10 11 Z"
              className="fill-foreground"
              opacity="0.45"
            />
            {/* Fuselage crease from tail to nose */}
            <line
              x1="2" y1="11" x2="34" y2="11"
              className="stroke-background"
              strokeWidth="0.8"
              opacity="0.6"
            />
            {/* Wing fold shadow */}
            <line
              x1="10" y1="11" x2="16" y2="17"
              className="stroke-background"
              strokeWidth="0.6"
              opacity="0.4"
            />
          </motion.svg>
        </motion.div>
      </motion.button>
    </>
  );
}

function Portfolio() {
  const [activeSection, setActiveSection] = useState("About");
  const [, navigate] = useLocation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((n) =>
        document.getElementById(n.toLowerCase())
      );
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <CustomCursor />
      <PaperPlane onOpen={() => setWidgetOpen(true)} />
      <GameWidget externalOpen={widgetOpen} onExternalOpen={setWidgetOpen} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-tight text-foreground">FA</span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                data-testid={`nav-${link.toLowerCase()}`}
                className="text-sm font-medium transition-colors"
                style={{ color: activeSection === link ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => navigate("/hosting")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1"
            >
              Hosting
            </button>
            <button onClick={toggle} aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggle} aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] text-foreground"
            >
              <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-foreground transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
            >
              <div className="flex flex-col px-5 py-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link}
                    onClick={() => { scrollTo(link); setMenuOpen(false); }}
                    className="text-left py-3 text-base font-medium border-b border-border transition-colors"
                    style={{ color: activeSection === link ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))" }}
                  >
                    {link}
                  </button>
                ))}
                <button
                  onClick={() => { navigate("/hosting"); setMenuOpen(false); }}
                  className="text-left py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hosting
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section
        id="about"
        className="min-h-[100dvh] flex items-center max-w-[1000px] mx-auto px-8 pt-14"
      >
        <div className="w-full py-24">
          <FadeIn>
            <div className="flex items-center gap-2.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                Available for opportunities
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[1.0] tracking-[-0.04em] mb-8 text-foreground">
              Faisal<br />Ambursa
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-base text-muted-foreground mb-2 font-medium">
              Software & Machine Learning Engineer
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] text-muted-foreground max-w-[520px] leading-[1.75] mb-12">
              I build production systems and intelligent applications.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="flex gap-3 flex-wrap mb-16">
              <button
                onClick={() => scrollTo("Work")}
                data-testid="button-view-work"
                className="bg-foreground text-background px-6 py-2.5 text-sm font-medium transition-all hover:opacity-80"
              >
                View Work
              </button>
              <a
                href="mailto:ambursa.faisal@gmail.com"
                data-testid="link-contact-email"
                className="border border-border text-foreground px-6 py-2.5 text-sm font-medium transition-all hover:bg-muted"
              >
                Get in touch
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex gap-6">
              <a
                href="https://github.com/ambursa-a"
                target="_blank"
                rel="noreferrer"
                data-testid="link-github"
                className="text-xs text-muted-foreground font-medium hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                GitHub
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="max-w-[1000px] mx-auto px-8 py-28">
        <FadeIn>
          <div className="flex items-baseline gap-4 mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Selected Work
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              0{PROJECTS.length} projects
            </span>
          </div>
        </FadeIn>

        <div className="flex flex-col">
          {PROJECTS.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.1}>
              <button
                onClick={() => project.link && navigate(project.link)}
                data-testid={`card-project-${project.id}`}
                className="group w-full text-left border-t border-border py-10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-[72px_1fr_auto] gap-x-10 items-start hover:bg-muted/40 transition-colors"
              >
                <span className="text-xs text-muted-foreground font-medium pt-1 hidden sm:block">
                  {project.year}
                </span>
                <div>
                  <div className="flex items-center justify-between sm:justify-start gap-4 mb-3">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <span className="text-xs text-muted-foreground sm:hidden">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[560px] mb-5">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground border border-border px-2.5 py-1 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:block pt-1">
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
            </FadeIn>
          ))}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="max-w-[1000px] mx-auto px-8 py-28">
        <FadeIn>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-14">
            Skills
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {SKILLS.map((group, i) => (
            <FadeIn key={group.category} delay={i * 0.08}>
              <div>
                <p className="text-xs font-semibold text-foreground tracking-widest uppercase mb-5 border-b border-border pb-3">
                  {group.category}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-muted-foreground font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Education & Certification */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FadeIn delay={0.1}>
            <div className="border border-border p-6">
              <p className="text-xs font-semibold text-foreground tracking-widest uppercase mb-4">
                Education
              </p>
              <p className="text-sm font-medium text-foreground mb-1">
                Miva Open University
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                BSc Software Engineering — In Progress
              </p>
              <p className="text-xs text-muted-foreground">
                Expected Graduation: 2027 · Nigeria
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="border border-border p-6">
              <p className="text-xs font-semibold text-foreground tracking-widest uppercase mb-4">
                ML Engineering Track
              </p>
              <p className="text-sm font-medium text-foreground mb-1">
                Self-Directed Study
              </p>
              <p className="text-sm text-muted-foreground mb-1">Ongoing · 2024 – Present</p>
              <p className="text-xs text-muted-foreground">
                PyTorch, model training, deployment pipelines
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-[1000px] mx-auto px-8 py-28 pb-40">
        <FadeIn>
          <div className="border border-border p-6 sm:p-12 md:p-20">
            <p className="text-xs font-semibold text-foreground tracking-widest uppercase mb-6">
              Get in touch
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-foreground mb-6 leading-tight">
              Let's work<br />together.
            </h2>
            <p className="text-sm text-muted-foreground max-w-[420px] mb-10 leading-relaxed">
              Open to software engineering and ML engineering roles, contracts,
              and technical collaborations.
            </p>
            <a
              href="mailto:ambursa.faisal@gmail.com"
              data-testid="link-email-cta"
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-semibold transition-all hover:opacity-80"
            >
              ambursa.faisal@gmail.com
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8">
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs font-semibold tracking-tight text-foreground">
            Faisal Ambursa
          </span>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/hosting")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Hosting & Domains
            </button>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} · Nigeria
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/taskflow" component={TaskFlow} />
      <Route path="/shopnow" component={ShopNow} />
      <Route path="/hosting" component={Hosting} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
