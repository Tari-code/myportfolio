import { Code, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WebDevPage() {
  return (
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-xl">
          <Code size={40} />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Full-Stack <br />
          <span className="text-gradient">Velocity</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mb-16 leading-relaxed font-medium">
          We architect high-performance digital ecosystems built with the speed of thought and the stability of steel. Our engineering team leverages cutting-edge stacks to deliver scalable, secure, and future-proof applications.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {[
            { title: "Next.js Excellence", desc: "Server-side rendering and static generation for lightning-fast load times and perfect SEO." },
            { title: "API Architectures", desc: "Highly secure and scalable RESTful and GraphQL APIs built for maximum throughput." },
            { title: "Database Engineering", desc: "Robust data modeling with SQL and NoSQL systems, optimized for integrity and speed." },
            { title: "Performance Tuning", desc: "Deep optimization of assets, code-splitting, and caching strategies for sub-second responses." },
          ].map((item, i) => (
            <div key={i} className="glass-panel p-10 rounded-[3rem] border border-card-border hover:border-purple-500/30 transition-all">
              <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-purple-600/20 active:scale-95">
          Start Engineering <ArrowRight size={22} />
        </Link>
      </div>
    </div>
  );
}
