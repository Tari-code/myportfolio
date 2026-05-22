"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FileText, Code2, Scale, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen relative">
      <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Link href="/" className="reveal inline-flex items-center gap-2 text-foreground/40 hover:text-brand-500 transition-colors font-bold mb-12 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> System Exit
      </Link>

      <div className="mb-16 relative z-10">
        <h1 className="reveal text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tighter">
          Terms of <span className="text-gradient">Operations</span>
        </h1>
        <p className="reveal text-lg text-foreground/60 font-medium leading-relaxed">
          Last Revision: May 11, 2026. These terms govern the engagement between Tari Tech and its partners, clients, and users of our digital infrastructure.
        </p>
      </div>

      <div className="space-y-12 relative z-10">
        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Scale className="text-brand-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">1. Engagement Framework</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            By accessing our systems or engaging in our services, you agree to be bound by these operational protocols. All engineering engagements are subject to a separate Service Level Agreement (SLA) that defines specific performance benchmarks.
          </p>
        </section>

        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Code2 className="text-purple-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">2. Intellectual Property</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            Unless otherwise specified in a project contract, all proprietary architectures, lab models, and custom codebases developed by Tari Tech remain the intellectual property of the lab until full project divestment.
          </p>
        </section>

        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Zap className="text-yellow-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">3. System Usage</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            Users are prohibited from attempting to decompile, reverse engineer, or execute malicious payloads against our public or private endpoints. Any breach of system integrity will result in immediate termination of access and legal escalation.
          </p>
        </section>

        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="text-blue-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">4. Liability Limitation</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            Tari Tech provides high-performance infrastructure but is not liable for system downtime caused by third-party upstream providers or unauthorized user modifications to deployed architectures.
          </p>
        </section>
      </div>

      <div className="reveal mt-20 pt-10 border-t border-card-border">
        <p className="text-sm text-foreground/40 font-medium">
          For full legal documentation or SLA inquiries, please contact our Legal Engineering department at <a href="mailto:legal@taritechnologies.com" className="text-brand-500 hover:underline">legal@taritechnologies.com</a>.
        </p>
      </div>
    </div>
  );
}
