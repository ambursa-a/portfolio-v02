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
    title: "Product listings & cart",
    description:
      "Full product catalogue with search, filtering, and a persistent shopping cart powered by React Context API.",
  },
  {
    title: "JWT authentication",
    description:
      "Secure registration and login with JSON Web Tokens. Role-based access control distinguishes admin and customer flows.",
  },
  {
    title: "RESTful API",
    description:
      "Node.js / Express backend with structured REST endpoints for products, orders, and users — documented and tested via Postman.",
  },
  {
    title: "Cloud data & deployment",
    description:
      "MongoDB Atlas for scalable cloud storage, deployed to a cloud hosting platform for global availability.",
  },
];

const STACK = [
  { label: "Database", value: "MongoDB Atlas + Mongoose ODM" },
  { label: "Backend", value: "Node.js + Express.js" },
  { label: "Frontend", value: "React.js + Context API" },
  { label: "Auth", value: "JWT + Role-based access control" },
  { label: "Styling", value: "CSS3 + Tailwind CSS" },
  { label: "Tools", value: "Git, Postman, VS Code" },
];

const PRODUCTS = [
  { name: "Wireless Headphones", price: "$49.99", category: "Electronics", stock: 12 },
  { name: "Minimalist Watch", price: "$129.00", category: "Accessories", stock: 5 },
  { name: "Canvas Backpack", price: "$34.99", category: "Bags", stock: 28 },
  { name: "Desk Lamp", price: "$27.50", category: "Home", stock: 0 },
];

export default function ShopNow() {
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
            <span className="text-sm font-medium text-foreground">ShopNow</span>
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
            MERN Stack · 2025
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-[-0.04em] leading-tight text-foreground mb-6">
            ShopNow
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] leading-relaxed mb-10">
            A full-stack e-commerce platform built from scratch featuring product
            listings, a shopping cart, JWT-based authentication, role-based access
            control, and cloud-based data storage via MongoDB Atlas.
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
                ShopNow — localhost:3000
              </span>
            </div>

            {/* Top bar */}
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight text-foreground">
                ShopNow
              </span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">Products</span>
                <span className="text-xs text-muted-foreground">Orders</span>
                <span className="text-xs border border-border px-3 py-1 text-foreground font-medium">
                  Cart (2)
                </span>
              </div>
            </div>

            {/* Product grid */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                  All Products
                </p>
                <div className="flex gap-2">
                  <span className="text-xs border border-border px-2.5 py-1 text-muted-foreground">
                    Sort: New
                  </span>
                  <span className="text-xs border border-border px-2.5 py-1 text-muted-foreground">
                    Filter
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PRODUCTS.map((p) => (
                  <div key={p.name} className="border border-border">
                    <div className="h-20 bg-muted flex items-center justify-center border-b border-border">
                      <span className="text-xs text-muted-foreground font-medium">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-foreground mb-1 leading-snug">
                        {p.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-foreground">
                          {p.price}
                        </span>
                        {p.stock === 0 ? (
                          <span className="text-[10px] text-muted-foreground">
                            Out of stock
                          </span>
                        ) : (
                          <button className="text-[10px] bg-foreground text-background px-2 py-1 font-medium">
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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

        {/* Architecture note */}
        <FadeIn delay={0.35}>
          <div className="mt-12 border border-border p-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Architecture
            </p>
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 text-sm text-center">
              {["React SPA", "Express REST API", "MongoDB Atlas"].map(
                (layer, i, arr) => (
                  <div key={layer} className="flex items-center">
                    <div className="flex-1 border border-border px-4 py-3 font-medium text-foreground">
                      {layer}
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-muted-foreground px-2 text-xs hidden sm:block">
                        →
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              The React SPA communicates with the Express REST API over HTTP using
              JWT bearer tokens. The API validates requests and performs CRUD
              operations against MongoDB Atlas via Mongoose ODM. Deployed to a cloud
              platform with environment-based config management.
            </p>
          </div>
        </FadeIn>

        {/* Back */}
        <FadeIn delay={0.4}>
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
