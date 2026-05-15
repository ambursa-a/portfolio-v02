import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sun, Moon, Check, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { motion } from "framer-motion";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const HOSTING_PLANS = [
  {
    name: "Starter",
    price: "3.49",
    period: "/mo",
    tagline: "Perfect for personal sites & blogs",
    features: [
      "1 Website",
      "10 GB SSD Storage",
      "Free SSL Certificate",
      "5 Email Accounts",
      "99.9% Uptime Guarantee",
      "1-Click WordPress Install",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Business",
    price: "7.99",
    period: "/mo",
    tagline: "Ideal for growing businesses",
    features: [
      "Unlimited Websites",
      "50 GB SSD Storage",
      "Free SSL Certificate",
      "Unlimited Email Accounts",
      "99.9% Uptime Guarantee",
      "1-Click WordPress Install",
      "Daily Backups",
      "Priority Support",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Pro",
    price: "14.99",
    period: "/mo",
    tagline: "For high-traffic & demanding apps",
    features: [
      "Unlimited Websites",
      "150 GB NVMe Storage",
      "Free SSL Certificate",
      "Unlimited Email Accounts",
      "99.9% Uptime Guarantee",
      "1-Click WordPress Install",
      "Daily Backups",
      "Priority Support",
      "Dedicated IP Address",
      "Advanced Caching",
    ],
    cta: "Get Started",
    highlight: false,
  },
];

const DOMAIN_PRICES = [
  { tld: ".com", reg: "$12.99", renew: "$14.99", transfer: "$12.99" },
  { tld: ".net", reg: "$12.99", renew: "$14.99", transfer: "$12.99" },
  { tld: ".org", reg: "$13.99", renew: "$15.99", transfer: "$13.99" },
  { tld: ".ng",  reg: "$34.99", renew: "$39.99", transfer: "$34.99" },
  { tld: ".com.ng", reg: "$14.99", renew: "$16.99", transfer: "$14.99" },
  { tld: ".io",  reg: "$39.99", renew: "$44.99", transfer: "$39.99" },
  { tld: ".co",  reg: "$24.99", renew: "$29.99", transfer: "$24.99" },
  { tld: ".dev", reg: "$15.99", renew: "$17.99", transfer: "$15.99" },
  { tld: ".store", reg: "$4.99", renew: "$39.99", transfer: "$4.99" },
  { tld: ".online", reg: "$3.99", renew: "$34.99", transfer: "$3.99" },
];

const GUARANTEES = [
  { label: "99.9% Uptime", desc: "Your site stays live. We monitor 24/7 and guarantee near-perfect availability." },
  { label: "Free SSL", desc: "Every plan includes a free SSL certificate for HTTPS security, no extra charge." },
  { label: "24/7 Support", desc: "Reach me via email or WhatsApp anytime. Fast responses, real help." },
  { label: "Easy Migration", desc: "Already hosted elsewhere? I'll migrate your site for free, no downtime." },
];

export default function Hosting() {
  const [, navigate] = useLocation();
  const { theme, toggle } = useTheme();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const CONTACT = "mailto:ambursa.faisal@gmail.com";

  const displayPrice = (base: string) => {
    if (billingCycle === "yearly") {
      return (parseFloat(base) * 0.75).toFixed(2);
    }
    return base;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="text-muted-foreground text-sm hidden sm:inline">|</span>
            <span className="text-sm font-semibold text-foreground tracking-tight">FA Hosting</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={CONTACT}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold border border-foreground text-foreground px-4 py-1.5 hover:bg-foreground hover:text-background transition-all"
            >
              Get in touch <ArrowUpRight className="w-3 h-3" />
            </a>
            <button onClick={toggle} aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-5 sm:px-8 pt-28 pb-32">

        {/* Hero */}
        <FadeIn>
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
            Hosting & Domains
          </p>
          <h1 className="text-[clamp(2.2rem,6vw,4rem)] font-bold tracking-[-0.04em] leading-tight text-foreground mb-5">
            Simple hosting.<br />Real support.
          </h1>
          <p className="text-base text-muted-foreground max-w-[520px] leading-relaxed mb-10">
            Fast, reliable web hosting and domain registration — backed by personal
            support. No hidden fees, no corporate runaround. Just your site, live.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center border border-border text-sm font-medium">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 transition-colors ${billingCycle === "monthly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 transition-colors relative ${billingCycle === "yearly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
              <span className="absolute -top-2.5 -right-2 text-[9px] font-bold bg-foreground text-background px-1 py-0.5 tracking-wide">
                -25%
              </span>
            </button>
          </div>
        </FadeIn>

        {/* Hosting Plans */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
          {HOSTING_PLANS.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.08}>
              <div
                className={`relative flex flex-col h-full p-7 sm:p-8 border-b sm:border-b-0 sm:border-r border-border last:border-0 ${
                  plan.highlight ? "bg-foreground text-background" : ""
                }`}
              >
                {plan.highlight && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold tracking-widest uppercase bg-foreground text-background border border-background px-3 py-1">
                    Most Popular
                  </span>
                )}

                <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${plan.highlight ? "text-background/70" : "text-muted-foreground"}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[2.5rem] font-bold tracking-tight leading-none">
                    ${displayPrice(plan.price)}
                  </span>
                  <span className={`text-sm ${plan.highlight ? "text-background/60" : "text-muted-foreground"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-xs mb-7 ${plan.highlight ? "text-background/60" : "text-muted-foreground"}`}>
                  {billingCycle === "yearly" ? "Billed annually" : "Billed monthly"} · {plan.tagline}
                </p>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-background" : "text-foreground"}`} />
                      <span className={plan.highlight ? "text-background/90" : "text-foreground"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={CONTACT}
                  className={`block text-center text-sm font-semibold py-3 transition-all ${
                    plan.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "border border-foreground text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Guarantees */}
        <FadeIn delay={0.1} className="mt-20">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-10">
            What's included
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GUARANTEES.map((g, i) => (
              <FadeIn key={g.label} delay={i * 0.07}>
                <div className="border border-border p-6">
                  <p className="text-sm font-semibold text-foreground mb-2">{g.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Domain Prices */}
        <FadeIn delay={0.1} className="mt-20">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
            Domain Registration
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            All prices in USD · Annual registration
          </p>

          <div className="border border-border">
            {/* Header */}
            <div className="grid grid-cols-4 px-5 py-3 border-b border-border bg-muted">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                Extension
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground text-right">
                Register
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground text-right">
                Renew
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground text-right">
                Transfer
              </span>
            </div>

            {DOMAIN_PRICES.map((d, i) => (
              <motion.div
                key={d.tld}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-4 px-5 py-4 border-b border-border last:border-0 items-center hover:bg-muted/40 transition-colors"
              >
                <span className="text-sm font-semibold text-foreground">{d.tld}</span>
                <span className="text-sm text-foreground text-right">{d.reg}</span>
                <span className="text-sm text-muted-foreground text-right">{d.renew}</span>
                <span className="text-sm text-muted-foreground text-right">{d.transfer}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            * Prices may vary. Contact me for bulk orders, Nigerian (NG) registry requirements, or custom TLDs.
          </p>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.1} className="mt-20">
          <div className="border border-border p-8 sm:p-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Ready to launch?
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Let's get your site online.
            </h2>
            <p className="text-sm text-muted-foreground max-w-[400px] mb-8 leading-relaxed">
              Drop me an email with what you need — hosting plan, domain name, or both.
              I'll set everything up and have you live within 24 hours.
            </p>
            <a
              href={CONTACT}
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              ambursa.faisal@gmail.com
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </FadeIn>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-5 sm:px-8">
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs font-semibold tracking-tight text-foreground">FA Hosting</span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} · Faisal Ambursa · Nigeria
          </span>
        </div>
      </footer>
    </div>
  );
}
