import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/lib/theme";

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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  {
    title: "Task creation & prioritisation",
    description:
      "Users can create tasks, assign priority levels, and set due dates with real-time reminders.",
  },
  {
    title: "Offline / Online sync",
    description:
      "Local persistence via Core Data keeps tasks available offline; a RESTful backend syncs state when connectivity resumes.",
  },
  {
    title: "MVVM architecture",
    description:
      "Business logic is cleanly separated from the UI using the MVVM pattern, resulting in maintainable, testable code.",
  },
  {
    title: "Apple HIG compliance",
    description:
      "Polished, accessible UI following Apple Human Interface Guidelines with full light and dark mode support.",
  },
];

const STACK = [
  { label: "Language", value: "Swift" },
  { label: "UI Framework", value: "SwiftUI" },
  { label: "Local Storage", value: "Core Data" },
  { label: "Networking", value: "REST API" },
  { label: "Architecture", value: "MVVM" },
  { label: "IDE", value: "Xcode" },
];

export default function TaskFlow() {
  const [, navigate] = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-sm text-border">|</span>
            <span className="text-sm font-medium text-foreground">TaskFlow</span>
          </div>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-8 pt-28 pb-32">
        {/* Header */}
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            iOS App · 2025
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.04em] leading-tight text-foreground mb-6">
            TaskFlow
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed mb-10">
            A native iOS productivity app enabling users to create, prioritise, and
            track daily goals with real-time reminders and seamless offline / online
            synchronisation.
          </p>
          <a
            href="https://github.com/ambursa-a"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-foreground text-foreground text-sm font-medium px-5 py-2.5 hover:bg-foreground hover:text-background transition-all"
          >
            View on GitHub <ArrowUpRight className="w-4 h-4" />
          </a>
        </FadeIn>

        {/* Visual mockup */}
        <FadeIn delay={0.15}>
          <div className="mt-16 mb-16 border border-border bg-card overflow-hidden">
            <div className="bg-muted px-6 py-3 border-b border-border flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-border" />
              <span className="w-3 h-3 rounded-full border border-border" />
              <span className="w-3 h-3 rounded-full border border-border" />
              <span className="text-xs text-muted-foreground ml-2 font-medium">
                TaskFlow — iPhone 16 Pro
              </span>
            </div>
            <div className="flex gap-0 min-h-[340px]">
              {/* Screen 1 — Today */}
              <div className="flex-1 border-r border-border p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Today
                </p>
                {[
                  { label: "Design system audit", done: true, priority: "High" },
                  { label: "Review pull requests", done: true, priority: "High" },
                  { label: "Write unit tests", done: false, priority: "Medium" },
                  { label: "Update README", done: false, priority: "Low" },
                  { label: "Team standup notes", done: false, priority: "Medium" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center ${
                        t.done
                          ? "bg-foreground border-foreground"
                          : "border-border"
                      }`}
                    >
                      {t.done && (
                        <svg
                          className="w-2.5 h-2.5 text-background"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`text-sm flex-1 ${
                        t.done
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5">
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
              {/* Screen 2 — Stats */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  Weekly Overview
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Completed", value: "24" },
                    { label: "In Progress", value: "7" },
                    { label: "Overdue", value: "2" },
                    { label: "Streak", value: "5d" },
                  ].map((s) => (
                    <div key={s.label} className="border border-border p-4">
                      <p className="text-2xl font-bold text-foreground mb-1">
                        {s.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Completion rate
                  </p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full"
                      style={{ width: "77%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">77%</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Features */}
        <FadeIn delay={0.2}>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                className="border border-border p-6"
              >
                <p className="text-sm font-semibold text-foreground mb-2">
                  {f.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Stack */}
        <FadeIn delay={0.3}>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-8">
            Tech Stack
          </h2>
          <div className="border border-border divide-y divide-border">
            {STACK.map(({ label, value }) => (
              <div key={label} className="flex px-6 py-4 gap-6">
                <span className="text-sm text-muted-foreground font-medium w-32 flex-shrink-0">
                  {label}
                </span>
                <span className="text-sm text-foreground font-medium">{value}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Back */}
        <FadeIn delay={0.35}>
          <div className="mt-20 pt-10 border-t border-border">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to portfolio
            </button>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
