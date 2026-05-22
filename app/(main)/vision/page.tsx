import { Target, Zap, Globe, Shield, Cpu, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VisionPage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold backdrop-blur-xl shadow-lg">
          <Sparkles size={14} /> The Digital Frontier
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Our <br />
          <span className="text-gradient">Vision</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-4xl mb-24 leading-relaxed font-medium">
          We don&apos;t just build software; we engineer the foundations of the next digital era. Our vision is to empower global businesses through radical innovation, precision engineering, and human-centric design.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {[
            { 
              icon: <Target className="text-brand-500" />, 
              title: "Our Mission", 
              desc: "To bridge the gap between complex technology and human intuition, delivering solutions that scale infinitely without losing their soul." 
            },
            { 
              icon: <Zap className="text-purple-500" />, 
              title: "Radical Innovation", 
              desc: "Constantly pushing the boundaries of what's possible with AI, cloud computing, and advanced web architectures to redefine reality." 
            },
            { 
              icon: <Globe className="text-yellow-500" />, 
              title: "Global Impact", 
              desc: "Built in Nigeria, engineered for the world. We take local talent and deploy global-scale infrastructure that changes lives." 
            },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-brand-500/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-3xl font-display font-bold text-foreground mb-6">{item.title}</h3>
              <p className="text-foreground/70 text-lg leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="glass-panel p-12 rounded-[4rem] border border-card-border relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500/5 blur-3xl rounded-full" />
            <div className="flex flex-col sm:flex-row items-start gap-8 relative z-10">
              <div className="w-16 h-16 shrink-0 rounded-[2rem] bg-brand-500/10 flex items-center justify-center">
                <Shield size={32} className="text-brand-500" />
              </div>
              <div>
                <h4 className="text-3xl font-display font-bold text-foreground mb-4">Uncompromising Integrity</h4>
                <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                  Trust is our primary currency. We maintain the highest standards of security, privacy, and ethical engineering in every line of code we write.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-12 rounded-[4rem] border border-card-border relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full" />
            <div className="flex flex-col sm:flex-row items-start gap-8 relative z-10">
              <div className="w-16 h-16 shrink-0 rounded-[2rem] bg-purple-500/10 flex items-center justify-center">
                <Cpu size={32} className="text-purple-500" />
              </div>
              <div>
                <h4 className="text-3xl font-display font-bold text-foreground mb-4">Precision Engineering</h4>
                <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                  We obsess over performance. From micro-interactions to macro-architectures, every detail is tuned for velocity, stability, and future growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-12 tracking-tighter">Ready to join the <span className="text-gradient">Evolution?</span></h2>
          <Link href="/contact" className="inline-flex items-center gap-3 px-12 py-6 rounded-3xl bg-foreground text-background font-bold text-xl hover:scale-110 transition-all shadow-2xl shadow-foreground/10 active:scale-95">
            Start a Project <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}
