"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ShieldCheck, Lock, Eye, Server, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Link href="/" className="reveal inline-flex items-center gap-2 text-foreground/40 hover:text-brand-500 transition-colors font-bold mb-12 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Base
      </Link>

      <div className="mb-16 relative z-10">
        <h1 className="reveal text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tighter">
          Privacy <span className="text-gradient">Protocol</span>
        </h1>
        <p className="reveal text-lg text-foreground/60 font-medium leading-relaxed">
          Last Updated: May 11, 2026. This document outlines our commitment to data integrity and the cryptographic measures we take to protect user information.
        </p>
      </div>

      <div className="space-y-12 relative z-10">
        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <ShieldCheck className="text-brand-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Data Acquisition</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium mb-4">
            We only collect data that is essential for the operational efficiency of our services. This includes contact information provided during project inquiries and technical telemetry required for system stability.
          </p>
        </section>

        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Lock className="text-purple-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Security Architecture</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            All data is encrypted at rest using AES-256 and in transit via TLS 1.3. Our internal systems utilize zero-trust architectures to ensure that only authorized engineering personnel have access to sensitive data clusters.
          </p>
        </section>

        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Eye className="text-yellow-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Third-Party Interfacing</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            We do not sell data to third-party entities. We only interface with verified infrastructure providers (e.g., AWS, Vercel) that maintain compliance with global data protection standards (GDPR, CCPA).
          </p>
        </section>

        <section className="reveal">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Server className="text-blue-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Retention Policy</h2>
          </div>
          <p className="text-foreground/60 leading-relaxed font-medium">
            Data is retained only as long as necessary for its intended purpose. Upon project termination or user request, data is purged using secure deletion protocols that prevent reconstruction.
          </p>
        </section>
      </div>

      <div className="reveal mt-20 pt-10 border-t border-card-border">
        <p className="text-sm text-foreground/40 font-medium">
          For granular inquiries regarding our privacy infrastructure, contact our Data Security Officer at <a href="mailto:security@taritechnologies.com" className="text-brand-500 hover:underline">security@taritechnologies.com</a>.
        </p>
      </div>
    </div>
  );
}
