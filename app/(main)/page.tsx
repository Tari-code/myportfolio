"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Code, Palette, Zap, CheckCircle2, Sparkles, Globe, Cpu, Target, Shield } from "lucide-react";
import Link from "next/link";
import PortfolioItem, { type PortfolioItemProps } from "@/components/PortfolioItem";

type PortfolioCard = PortfolioItemProps & { id?: string | number };
import TestimonialsSection from "@/components/TestimonialsSection";
import ParticleField from "@/components/ParticleField";
import ThreeDreamscape from "@/components/ThreeDreamscape";
import TiltCard from "@/components/TiltCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioCard[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then((data: PortfolioCard[]) => {
        setPortfolioData(data);
        setTimeout(() => ScrollTrigger.refresh(), 100);
      })
      .catch(err => console.error("Failed to load portfolio", err));

    const ctx = gsap.context(() => {
      // 3D Tilt Effect for Service Cards
      const cards = document.querySelectorAll<HTMLElement>(".service-card");
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out"
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        });
      });

      // Hero Parallax
      gsap.to(".hero-bg-element", {
        y: (i, target) => -target.dataset.speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Floating Animation for Hero Elements
      gsap.to(".floating", {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.2
      });

      // Reveal Animations
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((elem) => {
        gsap.from(elem, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        });
      });

      // Stats Count-up Animation
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((elem) => {
        const target = Number(elem.dataset.target ?? 0);
        gsap.to(elem, {
          innerText: target,
          duration: 2,
          snap: { innerText: target % 1 === 0 ? 1 : 0.1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 90%",
          }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen relative selection:bg-brand-500/30 overflow-x-hidden">
      {/* Particle + 3D Layers */}
      <ParticleField />
      <ThreeDreamscape />

      {/* Background Gradients & Grid */}
      <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--brand-500) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-48 pb-32 px-6 min-h-screen flex items-center justify-center">
        <div className="container max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div ref={heroTextRef} className="relative z-10 text-center lg:text-left">
            <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold mb-8 backdrop-blur-xl shadow-lg">
              <Sparkles size={14} className="animate-spin-slow" /> 
              Living World • Interactive Tech Ecosystem
            </div>
            <h1 className="reveal text-6xl md:text-8xl font-display font-bold leading-[0.95] tracking-tighter mb-8 text-foreground">
              A Dreamscape of <br />
              <span className="text-gradient">Digital Exploration</span>
            </h1>
            <p className="reveal text-lg md:text-xl text-foreground/80 max-w-xl mb-12 leading-relaxed mx-auto lg:mx-0 font-medium">
              We sculpt immersive, living interfaces where motion, depth, and intelligent systems blend into a world you can feel as you scroll through it.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/projects" className="group relative px-10 py-5 rounded-2xl bg-brand-600 text-white font-bold transition-all hover:scale-105 shadow-2xl shadow-brand-600/20 active:scale-95 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">View Case Studies <ArrowRight size={20} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
              </Link>
              <Link href="#services" className="px-10 py-5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold border border-foreground/10 transition-all backdrop-blur-xl">
                Our Services
              </Link>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="relative hidden lg:block h-[600px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-brand-500/20 rounded-full animate-spin-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-purple-500/10 rounded-full animate-reverse-spin" />
            
            {/* Floating Tech Cards */}
            <div className="floating absolute top-0 right-10 p-6 glass-panel rounded-3xl shadow-2xl" data-speed="0.2">
              <Cpu className="text-brand-500 mb-4" size={40} />
              <div className="h-2 w-12 bg-brand-500 rounded-full mb-2" />
              <div className="h-2 w-8 bg-white/10 rounded-full" />
            </div>
            <div className="floating absolute bottom-20 left-0 p-6 glass-panel rounded-3xl shadow-2xl" data-speed="0.5">
              <Globe className="text-purple-500 mb-4" size={40} />
              <div className="h-2 w-16 bg-purple-500 rounded-full mb-2" />
              <div className="h-2 w-10 bg-white/10 rounded-full" />
            </div>
            <div className="floating absolute top-1/2 right-1/4 p-8 glass-panel rounded-[2.5rem] shadow-[0_0_50px_rgba(var(--brand-500-rgb),0.2)]" data-speed="0.8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center"><CheckCircle2 className="text-brand-500" /></div>
                <div><div className="h-2 w-20 bg-white rounded-full mb-1" /><div className="h-2 w-12 bg-white/20 rounded-full" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto">
          <div className="reveal mb-12 md:mb-20 text-center lg:text-left">
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-4 md:mb-6 tracking-tighter">Capabilities</h2>
            <p className="text-foreground/80 max-w-2xl text-base md:text-lg leading-relaxed font-medium">
              We combine deep technical expertise with radical creativity to deliver solutions that are not just built, but engineered for impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <Palette className="text-brand-500" />, title: "Immersive UI/UX", desc: "Sensory-driven designs that transcend the screen and create emotional connections." },
              { icon: <Code className="text-purple-500" />, title: "Full-Stack Velocity", desc: "High-performance architectures built with the speed of thought and the stability of steel." },
              { icon: <Zap className="text-yellow-500" />, title: "AI Intelligence", desc: "Integrating cognitive computing to automate complexity and unlock hidden potential." },
            ].map((service, i) => (
              <TiltCard key={i} tiltMax={8} className="reveal h-full w-full">
                <div className="glass-panel p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] group cursor-default hover:-translate-y-2 transition-all duration-500 hover:border-brand-500/40 h-full flex flex-col">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-500/5 flex items-center justify-center mb-8 md:mb-10 group-hover:bg-brand-500/10 transition-all duration-500 group-hover:rotate-6 shadow-inner">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-foreground group-hover:text-brand-500 transition-colors duration-300">{service.title}</h3>
                  <p className="text-foreground/80 leading-relaxed text-base md:text-lg font-medium flex-1">{service.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-brand-500 font-bold group-hover:gap-4 transition-all opacity-0 group-hover:opacity-100">
                    Explore <ArrowRight size={18} />
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
          </div>
      
      </section>

      {/* Bento Feature Grid */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden" id="features">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-foreground/[0.01] to-background pointer-events-none" />
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="reveal mb-16 md:mb-24 text-center">
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tighter">
              Built <span className="text-gradient">Different</span>
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto text-base md:text-xl leading-relaxed font-medium">
              A living stack of next-generation capabilities powering every deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                title: "Neural Compute",
                desc: "GPU-cluster edge inference — sub-10ms latency on any model.",
                tag: "AI infra",
                span: "col-span-2 row-span-2",
                accent: "from-brand-500/20 to-brand-600/5",
              },
              {
                title: "Real-Time Sync",
                desc: "CRDT-backed state — eventual consistency, zero conflicts.",
                tag: "Runtime",
                span: "col-span-1 row-span-1",
                accent: "from-purple-500/10 to-purple-600/5",
              },
              {
                title: "Zero-Touch CI/CD",
                desc: "Deterministic deploys. Hash-locked. Reproducible.",
                tag: "DevOps",
                span: "col-span-1 row-span-1",
                accent: "from-pink-500/10 to-pink-600/5",
              },
              {
                title: "Magnetic UX",
                desc: "Cursor-following micro-interactions grounded in physics.",
                tag: "Frontend",
                span: "col-span-1 row-span-1",
                accent: "from-indigo-500/10 to-indigo-600/5",
              },
              {
                title: "Edge Presence",
                desc: "120 edge nodes. 15ms p95 TTFB worldwide.",
                tag: "Network",
                span: "col-span-1 row-span-1",
                accent: "from-yellow-500/10 to-yellow-600/5",
              },
              {
                title: "Composability",
                desc: "207+ pre-flighted integrations — no boilerplate.",
                tag: "Ecosystem",
                span: "col-span-2 row-span-1",
                accent: "from-cyan-500/10 to-cyan-600/5",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className={`reveal glass-panel p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] group hover:-translate-y-1 transition-all duration-500 border border-card-border hover:border-brand-500/30 bg-gradient-to-br ${feat.accent} ${feat.span}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] label-caps !text-brand-500 bg-brand-500/10 px-3 py-1.5 rounded-full">
                    {feat.tag}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500/30 group-hover:bg-brand-500 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.6)] transition-all duration-500" />
                </div>
                <h3 className="text-xl md:text-3xl font-display font-bold mb-3 text-foreground group-hover:text-brand-500 transition-colors duration-300">
                  {feat.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed font-medium text-sm md:text-base">{feat.desc}</p>

                {/* animated grid lines */}
                <div className="mt-8 h-px w-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-brand-500/20 to-transparent group-hover:via-brand-500/50 transition-all duration-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Values Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden bg-foreground/[0.01]">
        <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="container max-w-7xl mx-auto">
          <div className="reveal text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tighter">Our Vision & <span className="text-gradient">Values</span></h2>
            <p className="text-foreground/80 max-w-3xl mx-auto text-base md:text-xl leading-relaxed font-medium">
              We don&apos;t just build software; we engineer the foundations of the next digital era. Our vision is to empower global businesses through radical innovation and precision engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-32">
            {[
              { icon: <Target className="text-brand-500" />, title: "Our Mission", desc: "To bridge the gap between complex technology and human-centric design, delivering solutions that scale infinitely.", color: "brand" },
              { icon: <Zap className="text-purple-500" />, title: "Radical Innovation", desc: "Constantly pushing the boundaries of what's possible with AI, cloud computing, and advanced web architectures.", color: "purple" },
              { icon: <Globe className="text-yellow-500" />, title: "Global Impact", desc: "Built in Nigeria, engineered for the world. We take local talent and deploy global-scale infrastructure.", color: "yellow" },
            ].map((item, i) => (
              <div key={i} className="reveal glass-panel p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] group hover:-translate-y-2 transition-all duration-500 hover:border-brand-500/40">
                <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-foreground/80 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="reveal glass-panel p-10 md:p-12 rounded-[3rem] md:rounded-[3.5rem] relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/5 blur-3xl rounded-full" />
              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                  <Shield className="text-brand-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Uncompromising Integrity</h4>
                  <p className="text-foreground/80 leading-relaxed font-medium">
                    Trust is our primary currency. We maintain the highest standards of security, privacy, and ethical engineering in every line of code we write.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal glass-panel p-10 md:p-12 rounded-[3rem] md:rounded-[3.5rem] relative overflow-hidden group">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full" />
              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Cpu className="text-purple-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Precision Engineering</h4>
                  <p className="text-foreground/80 leading-relaxed font-medium">
                    We obsess over performance. From micro-interactions to macro-architectures, every detail is tuned for velocity and stability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section ref={statsRef} className="py-20 md:py-32 px-4 md:px-6 bg-foreground/[0.01]">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: 250, suffix: "+", label: "Architectures Delivered" },
              { val: 99.9, suffix: "%", label: "Deployment Uptime" },
              { val: 12, suffix: "M", label: "Monthly API Calls" },
              { val: 40, suffix: "+", label: "Proprietary Models" },
            ].map((stat, i) => (
              <div key={i} className="reveal group">
                <div className="text-5xl md:text-7xl font-display font-bold text-foreground mb-4 group-hover:text-brand-500 transition-all duration-500 group-hover:scale-110 flex items-center justify-center">
                  <span className="stat-number" data-target={stat.val}>0</span>
                  <span>{stat.suffix}</span>
                </div>
                <div className="label-caps">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Artifacts */}
      <section id="work" ref={portfolioRef} className="py-20 md:py-32 px-4 md:px-6 bg-foreground/[0.03] rounded-[2.5rem] md:rounded-[4rem] mx-4 md:mx-10 my-10 md:my-20 border border-card-border overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container max-w-7xl mx-auto">
          <div className="reveal mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-7xl font-display font-bold mb-4 md:mb-6 tracking-tighter">Selected Artifacts</h2>
              <p className="text-foreground/80 text-base md:text-lg font-medium leading-relaxed">A chronicle of our successful deployments and creative breakthroughs in the digital realm.</p>
            </div>
            <Link href="/projects" className="group px-8 py-4 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-xl shadow-foreground/10">
              View Directory <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="portfolio-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {portfolioData.slice(0, 6).map((item, idx) => (
              <div key={item.id || idx} className="reveal h-full w-full">
                <PortfolioItem {...item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Modern Contact Banner */}
      <section className="py-24 md:py-32 px-4 md:px-6 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-64 bg-brand-500/10 blur-[120px] rounded-full" />
        <div className="container max-w-4xl mx-auto relative z-10">
          <h2 className="reveal text-4xl md:text-8xl font-display font-bold mb-8 md:mb-10 tracking-tighter">Ready to Build <br className="hidden md:block" /> the Future?</h2>
          <div className="reveal flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
             <a href="mailto:hello@herakonlab.com" className="px-10 py-5 rounded-2xl bg-brand-500 text-white font-bold text-lg md:text-xl hover:scale-110 transition-all shadow-2xl shadow-brand-500/40">
               Launch Project
             </a>
             <button className="px-10 py-5 rounded-2xl bg-foreground/5 border border-card-border text-foreground font-bold text-lg md:text-xl hover:bg-foreground/10 transition-all backdrop-blur-xl">
               Consulting
             </button>
          </div>
        </div>
      </section>
    </main>
  );
}
