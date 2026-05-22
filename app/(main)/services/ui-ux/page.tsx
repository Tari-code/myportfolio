import { Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UIUXPage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand-500/10 text-brand-500 border border-brand-500/20 shadow-xl">
          <Palette size={40} />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Immersive <br />
          <span className="text-gradient">UI/UX Design</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-16 leading-relaxed font-medium">
          We engineer sensory-driven digital interfaces that transcend the screen. Our philosophy blends mathematical precision with radical creativity to forge deep emotional connections between brands and users.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { title: "User Research", desc: "Data-driven insights that uncover the deep psychological needs of your audience." },
            { title: "Visual Strategy", desc: "Crafting a unique aesthetic language that speaks volumes about your brand's future." },
            { title: "Prototyping", desc: "High-fidelity, interactive blueprints that bring your vision to life before a single line of code." },
            { title: "Accessibility", desc: "Ensuring your digital experiences are inclusive, empowering every user regardless of ability." },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-brand-500/30 transition-all">
              <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-brand-500 text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-brand-500/20 active:scale-95">
          Launch Your Vision <ArrowRight size={22} />
        </Link>
      </div>
    </div>
  );
}
