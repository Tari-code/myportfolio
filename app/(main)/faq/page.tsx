"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Plus, Minus, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const faqs = [
    {
      q: "What technologies do you specialize in?",
      a: "We specialize in the modern stack: React/Next.js, TypeScript, and Node.js for performance-first applications. For AI, we leverage OpenAI and custom Python models. Our cloud infrastructure is primarily built on AWS and Vercel."
    },
    {
      q: "How long does a typical project take?",
      a: "A standard enterprise-grade MVP usually takes 6-10 weeks. Complex systems involving AI integration or custom architectures may take 3-5 months. We prioritize velocity without sacrificing precision."
    },
    {
      q: "Do you offer post-deployment support?",
      a: "Absolutely. We offer various tiered support protocols, including 24/7 uptime monitoring, security patching, and incremental feature updates to ensure your architecture stays ahead of the curve."
    },
    {
      q: "Can you integrate AI into my existing platform?",
      a: "Yes, we specialize in 'Cognitive Layering'—integrating LLMs and automation agents into existing legacy or modern systems to unlock hidden efficiencies and automate complex workflows."
    },
    {
      q: "Where is Tari Tech based?",
      a: "We are headquartered in Nasarawa State, Nigeria, operating at the intersection of local talent and global technological standards. We serve clients across Africa, Europe, and North America."
    }
  ];

  return (
    <div ref={containerRef} className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-20 relative z-10">
        <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold mb-6 backdrop-blur-xl">
          <HelpCircle size={14} /> Knowledge Base
        </div>
        <h1 className="reveal text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tighter">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h1>
        <p className="reveal text-xl text-foreground/80 max-w-2xl mx-auto font-medium">
          Everything you need to know about our engineering protocols, timelines, and technological capabilities.
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className={`reveal glass-panel rounded-3xl overflow-hidden transition-all duration-500 ${openIndex === i ? 'border-brand-500/40 bg-foreground/[0.03]' : 'hover:border-foreground/20'}`}
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-8 py-8 flex items-center justify-between text-left group"
            >
              <span className={`text-xl font-bold transition-colors ${openIndex === i ? 'text-brand-500' : 'text-foreground/80'}`}>
                {faq.q}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${openIndex === i ? 'bg-brand-500 text-white rotate-180' : 'bg-foreground/5 text-foreground/60 group-hover:bg-foreground/10'}`}>
                {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
              </div>
            </button>
            <div className={`px-8 transition-all duration-500 ease-in-out ${openIndex === i ? 'pb-8 opacity-100 max-h-96' : 'pb-0 opacity-0 max-h-0'}`}>
              <p className="text-foreground/80 leading-relaxed text-lg font-medium border-t border-foreground/5 pt-6">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="reveal mt-24 glass-panel p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <MessageSquare className="text-brand-500" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">Still have inquiries?</h2>
          <p className="text-foreground/80 text-lg mb-10 max-w-xl mx-auto font-medium">
            Our engineering team is ready to provide granular technical insights for your specific project requirements.
          </p>
          <Link href="mailto:contact@herakonlab.com" className="px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-105 transition-all inline-flex items-center gap-3 shadow-2xl shadow-foreground/10">
            Open a Transmission <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
