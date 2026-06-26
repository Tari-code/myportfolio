"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Palette,
  Zap,
  Sparkles,
  Globe,
  Shield,
  Target,
  BarChart3,
  Layers,
  Rocket,
} from "lucide-react";
import PortfolioItem, { type PortfolioItemProps } from "@/components/PortfolioItem";
import TestimonialsSection from "@/components/TestimonialsSection";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
type PortfolioCard = PortfolioItemProps & { id?: string | number };

const SERVICES = [
  {
    icon: Palette,
    title: "Product Design",
    desc: "Research-driven interfaces with pixel-perfect execution and accessible design systems.",
    href: "/services/ui-ux",
    color: "text-brand-500",
  },
  {
    icon: Code,
    title: "Engineering",
    desc: "Full-stack platforms built on modern architectures with performance at the core.",
    href: "/services/web-dev",
    color: "text-secondary-500",
  },
  {
    icon: Zap,
    title: "AI Systems",
    desc: "Intelligent automation, agents, and ML pipelines integrated into your workflow.",
    href: "/services/ai",
    color: "text-accent-orange",
  },
];

const FEATURES = [
  { title: "Edge Delivery", desc: "Global CDN with sub-50ms response times.", tag: "Infrastructure" },
  { title: "Real-Time Sync", desc: "Live collaboration with conflict-free state.", tag: "Runtime" },
  { title: "Zero-Downtime Deploys", desc: "Blue-green pipelines with instant rollback.", tag: "DevOps" },
  { title: "Design Systems", desc: "Token-based UI libraries at scale.", tag: "Design" },
  { title: "Security First", desc: "SOC2-ready auth, encryption, and audit logs.", tag: "Security" },
  { title: "Analytics", desc: "Product telemetry with actionable insights.", tag: "Data" },
];

const STATS = [
  { val: 250, suffix: "+", label: "Projects Delivered" },
  { val: 99.9, suffix: "%", label: "Uptime SLA" },
  { val: 12, suffix: "M", label: "API Requests / mo" },
  { val: 40, suffix: "+", label: "Engineers" },
];

function AnimatedStat({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  const formatted =
    target % 1 !== 0 ? display.toFixed(1) : Math.round(display).toString();

  return (
    <span ref={ref}>
      {started ? formatted : "0"}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioCard[]) => {
        setPortfolioData(Array.isArray(data) ? data : []);
      })
      .catch(() => setPortfolioData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-subtle pointer-events-none" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.35] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--brand-500) 15%, transparent) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-4 md:px-6 min-h-[90vh] flex items-center">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <ScrollReveal>
                <Badge variant="brand" className="mb-6">
                  <Sparkles size={10} className="mr-1 inline" />
                  Enterprise Technology Platform
                </Badge>
              </ScrollReveal>

              <ScrollReveal delay={1}>
                <h1 className="text-display-xl text-foreground mb-6">
                  Build products that{" "}
                  <span className="text-gradient">scale with ambition</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={2}>
                <p className="text-body-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
                  We design and engineer premium digital experiences — from
                  startup MVPs to enterprise platforms — with the polish of
                  world-class SaaS products.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={3}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/projects">
                    <Button size="lg" className="w-full sm:w-auto">
                      View Work <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explore Services
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={2} className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
                <Card variant="glass" padding="lg" className="relative space-y-4">
                  {[
                    { icon: BarChart3, label: "Performance", value: "98 Lighthouse" },
                    { icon: Layers, label: "Deployments", value: "2,400+ / month" },
                    { icon: Rocket, label: "Time to market", value: "6 weeks avg" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 p-4 rounded-xl bg-foreground/[0.03] border border-card-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section-padding px-4 md:px-6">
        <div className="container max-w-7xl mx-auto">
          <ScrollReveal className="mb-12 md:mb-16 max-w-2xl">
            <h2 className="text-display-lg text-foreground mb-4">Capabilities</h2>
            <p className="text-body-lg text-muted-foreground">
              End-to-end product development with engineering excellence and
              design precision.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.title} delay={(i + 1) as 1 | 2 | 3}>
                <Link href={service.href} className="block h-full">
                  <Card interactive padding="lg" className="h-full group">
                    <div
                      className={`w-12 h-12 rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-5 ${service.color}`}
                    >
                      <service.icon size={22} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-brand-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {service.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight size={14} />
                    </span>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section className="section-padding px-4 md:px-6 bg-foreground/[0.02]">
        <div className="container max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12 md:mb-16">
            <h2 className="text-display-lg text-foreground mb-4">
              Built for <span className="text-gradient">production</span>
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              A modern stack powering every engagement — fast, secure, and scalable.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {FEATURES.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Card padding="md" className="h-full">
                  <Badge variant="brand" className="mb-4">{feat.tag}</Badge>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground">{feat.desc}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="section-padding px-4 md:px-6">
        <div className="container max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12 md:mb-16">
            <h2 className="text-display-lg text-foreground mb-4">
              Vision & <span className="text-gradient">Values</span>
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              Engineering the foundations of the next digital era — from Nigeria to the world.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { icon: Target, title: "Mission", desc: "Bridge complex technology with human-centric design at infinite scale." },
              { icon: Zap, title: "Innovation", desc: "Push boundaries in AI, cloud, and advanced web architectures." },
              { icon: Globe, title: "Global Impact", desc: "Local talent, global infrastructure, world-class delivery." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={(i + 1) as 1 | 2 | 3}>
                <Card padding="lg" className="h-full">
                  <item.icon size={22} className="text-brand-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <ScrollReveal>
              <Card padding="lg" className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Shield size={20} className="text-brand-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Integrity & Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Highest standards of privacy, security, and ethical engineering in every line of code.
                  </p>
                </div>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <Card padding="lg" className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary-500/10 flex items-center justify-center shrink-0">
                  <Code size={20} className="text-secondary-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Precision Engineering</h4>
                  <p className="text-sm text-muted-foreground">
                    From micro-interactions to macro-architectures — tuned for velocity and stability.
                  </p>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 px-4 md:px-6 border-y border-card-border bg-foreground/[0.02]">
        <div className="container max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={(i + 1) as 1 | 2 | 3 | 4}>
              <div className="text-3xl md:text-5xl font-bold text-foreground mb-2 tabular-nums">
                <AnimatedStat target={stat.val} suffix={stat.suffix} />
              </div>
              <p className="text-caption">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section id="work" className="section-padding px-4 md:px-6">
        <div className="container max-w-7xl mx-auto">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <h2 className="text-display-lg text-foreground mb-3">Selected Work</h2>
              <p className="text-muted-foreground">
                Successful deployments and creative breakthroughs across industries.
              </p>
            </div>
            <Link href="/projects">
              <Button variant="secondary">
                View all projects <ArrowRight size={16} />
              </Button>
            </Link>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : portfolioData.slice(0, 6).map((item, idx) => (
                  <ScrollReveal key={item.id || idx} delay={((idx % 3) + 1) as 1 | 2 | 3}>
                    <PortfolioItem {...item} />
                  </ScrollReveal>
                ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA */}
      <section className="section-padding px-4 md:px-6 text-center">
        <div className="container max-w-3xl mx-auto relative">
          <div className="absolute inset-0 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
          <ScrollReveal>
            <h2 className="text-display-lg text-foreground mb-6 relative">
              Ready to build something exceptional?
            </h2>
            <p className="text-muted-foreground mb-8 relative">
              Partner with a team that ships premium products on time and at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <a href="mailto:hello@herakonlab.com">
                <Button size="lg">Start a project</Button>
              </a>
              <Link href="/faq">
                <Button variant="outline" size="lg">Talk to us</Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
