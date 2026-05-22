import { Code, ArrowRight, ExternalLink, Package, Layout } from "lucide-react";
import Link from "next/link";

export default function OpenSourcePage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-xl">
          <Code size={40} />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Collective <br />
          <span className="text-gradient">Intelligence</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-16 leading-relaxed font-medium">
          We believe in the power of shared knowledge. We actively contribute to and maintain open-source tools that empower developers across the digital frontier.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {[
            { 
              icon: <Layout className="text-brand-500" />, 
              title: "Herakon UI", 
              desc: "A headless, highly accessible component library for building sophisticated Next.js interfaces with speed and precision.",
              stats: "1.2k Stars"
            },
            { 
              icon: <Package className="text-purple-500" />, 
              title: "Node Sync Engine", 
              desc: "A lightweight synchronization engine for real-time data replication across distributed microservices.",
              stats: "800+ Installs"
            },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-purple-500/30 transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-[10px] label-caps border border-brand-500/20">
                  {item.stats}
                </div>
              </div>
              <h3 className="text-3xl font-display font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium mb-10">{item.desc}</p>
              <div className="flex gap-4">
                <a href="#" className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-foreground text-background font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-foreground/10">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
                  </svg>
                  Repository
                </a>
                <a href="#" className="flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground/5 text-foreground hover:bg-foreground/10 transition-all border border-card-border">
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
