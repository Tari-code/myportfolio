import { Briefcase, Code, ArrowRight, Zap, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

export default function WorkPage() {
  const categories = [
    {
      icon: <Briefcase className="text-brand-500" />,
      title: "Case Studies",
      href: "/work/case-studies",
      desc: "Deep dives into our most complex challenges and the innovative solutions we engineered.",
      count: "12 Artifacts"
    },
    {
      icon: <Code className="text-purple-500" />,
      title: "Open Source",
      href: "/work/open-source",
      desc: "Tools and libraries we maintain to empower the global developer community.",
      count: "8 Repositories"
    }
  ];

  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold backdrop-blur-xl shadow-lg">
          <Sparkles size={14} /> The Archive
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Our <br />
          <span className="text-gradient">Portfolio</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-24 leading-relaxed font-medium">
          A chronicle of our successful deployments, creative breakthroughs, and community contributions in the digital realm.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={cat.href} 
              className="glass-panel p-10 md:p-12 rounded-[3.5rem] border border-card-border hover:border-purple-500/30 transition-all group flex flex-col h-full hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="w-20 h-20 rounded-[2rem] bg-foreground/5 flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner">
                  {cat.icon}
                </div>
                <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-500 text-[10px] label-caps border border-purple-500/20">
                  {cat.count}
                </div>
              </div>
              
              <h3 className="text-4xl font-display font-bold text-foreground mb-6 group-hover:text-purple-500 transition-colors">
                {cat.title}
              </h3>
              <p className="text-foreground/70 text-lg leading-relaxed font-medium mb-12 flex-1">
                {cat.desc}
              </p>
              
              <div className="flex items-center gap-2 text-purple-500 font-bold uppercase text-xs tracking-[0.2em] group-hover:gap-4 transition-all">
                Access Node <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Link to Projects */}
        <div className="mt-20 pt-20 border-t border-card-border flex flex-col items-center text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">Looking for our full directory?</h2>
          <Link href="/projects" className="px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-foreground/10 active:scale-95">
            View All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
