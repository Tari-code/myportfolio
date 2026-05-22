import { Briefcase, ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function CaseStudiesPage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand-500/10 text-brand-500 border border-brand-500/20 shadow-xl">
          <Briefcase size={40} />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          The <br />
          <span className="text-gradient">Case Studies</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-16 leading-relaxed font-medium">
          A chronicle of our most complex engineering challenges and the radical solutions we deployed to solve them. Each artifact represents a milestone in the digital frontier.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {[
            { 
              icon: <TrendingUp className="text-brand-500" />, 
              title: "FinTech Velocity", 
              desc: "Engineering a high-throughput transaction engine capable of processing 100,000 requests per minute with millisecond latency.",
              link: "/projects/fintech-velocity"
            },
            { 
              icon: <ShieldCheck className="text-purple-500" />, 
              title: "Secure Health Node", 
              desc: "Architecting a HIPAA-compliant healthcare telemetry system with zero-trust security and real-time patient monitoring.",
              link: "/projects/secure-health"
            },
            { 
              icon: <Zap className="text-yellow-500" />, 
              title: "AI Automation Hub", 
              desc: "Integrating autonomous agents into a legacy enterprise workflow, resulting in a 400% increase in operational efficiency.",
              link: "/projects/ai-automation"
            },
            { 
              icon: <Briefcase className="text-blue-500" />, 
              title: "Global Supply Chain", 
              desc: "Building a blockchain-backed logistics platform to synchronize real-time data across 12 countries and 500+ nodes.",
              link: "/projects/supply-chain"
            },
          ].map((item, i) => (
            <Link key={i} href={item.link} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-brand-500/30 transition-all group flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-3xl font-display font-bold text-foreground mb-4 group-hover:text-brand-500 transition-colors">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium mb-10 flex-1">{item.desc}</p>
              <div className="flex items-center gap-2 text-brand-500 font-bold uppercase text-xs tracking-[0.2em] group-hover:gap-4 transition-all">
                Analyze Artifact <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
