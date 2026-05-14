import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const queryClient = new QueryClient();

const NAV_LINKS = ["About", "Work", "Skills", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "TaskFlow",
    description:
      "Native iOS task-management app enabling users to create, prioritise, and track daily goals with real-time reminders. Built with MVVM architecture and local Core Data persistence synced to a RESTful backend for seamless offline/online functionality.",
    tags: ["Swift", "SwiftUI", "Core Data", "REST API"],
    year: "2025",
    link: "#",
  },
  {
    id: 2,
    title: "ShopNow",
    description:
      "Full-stack e-commerce platform featuring product listings, shopping cart, JWT-based authentication, and role-based access control for admin and customers. Built from scratch with a secure Node.js/Express API and a dynamic React frontend.",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js"],
    year: "2025",
    link: "#",
  },
];

const SKILLS = [
  {
    category: "iOS Development",
    items: ["Swift", "SwiftUI", "UIKit", "Xcode", "Core Data", "REST API"],
  },
  {
    category: "Frontend",
    items: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend & Database",
    items: ["Node.js", "Express.js", "MongoDB", "Mongoose ODM"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Postman", "Agile / Scrum"],
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

function Portfolio() {
  const [activeSection, setActiveSection] = useState("About");

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-8 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-tight text-foreground">
            MA
          </span>
          <div className="flex gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                data-testid={`nav-${link.toLowerCase()}`}
                className="text-sm font-medium transition-colors"
                style={{
                  color:
                    activeSection === link
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
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
              Muhammad<br />Abubakar
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-base text-muted-foreground mb-2 font-medium">
              Junior Software Engineer
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] text-muted-foreground max-w-[520px] leading-[1.75] mb-12">
              Passionate about building high-quality iOS applications and full-stack
              web solutions. Currently pursuing a B.Sc. in Software Engineering at
              Miva Open University and eager to contribute to collaborative
              engineering teams.
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
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                data-testid="link-linkedin"
                className="text-xs text-muted-foreground font-medium hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                LinkedIn
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
              <a
                href={project.link}
                data-testid={`card-project-${project.id}`}
                className="group block border-t border-border py-10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-[72px_1fr_auto] gap-x-10 items-start hover:bg-muted/40 transition-colors"
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
              </a>
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
                B.Sc. Software Engineering (In Progress)
              </p>
              <p className="text-xs text-muted-foreground">
                Expected Graduation: 2027 · Nigeria
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="border border-border p-6">
              <p className="text-xs font-semibold text-foreground tracking-widest uppercase mb-4">
                Certification
              </p>
              <p className="text-sm font-medium text-foreground mb-1">
                Software Engineering Certificate
              </p>
              <p className="text-sm text-muted-foreground mb-1">Coursera · Issued 2026</p>
              <p className="text-xs text-muted-foreground">
                Software design, data structures, algorithms, OOP
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-[1000px] mx-auto px-8 py-28 pb-40">
        <FadeIn>
          <div className="border border-border p-12 sm:p-20">
            <p className="text-xs font-semibold text-foreground tracking-widest uppercase mb-6">
              Get in touch
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-foreground mb-6 leading-tight">
              Open to internships,<br />graduate roles &amp; freelance.
            </h2>
            <p className="text-sm text-muted-foreground max-w-[420px] mb-10 leading-relaxed">
              Based in Nigeria. Currently studying Software Engineering full-time
              while building real projects. If you have an opportunity or just
              want to talk, reach out.
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
            Muhammad Abubakar
          </span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} · Nigeria
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
