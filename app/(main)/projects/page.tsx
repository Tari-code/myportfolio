"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortfolioItem from "@/components/PortfolioItem";
import { ArrowRight } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="mb-20 text-center lg:text-left relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground/5 border border-card-border text-foreground/60 label-caps mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          Complete Portfolio
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Selected <span className="text-gradient">Artifacts</span>
        </h1>
        <p className="text-xl text-foreground/60 max-w-2xl leading-relaxed font-medium">
          A deep dive into our most successful deployments, from enterprise AI platforms to high-performance web ecosystems.
        </p>
      </div>

      <div className="relative min-h-[400px]">
        <LoadingScreen isVisible={loading} fullScreen={false} onComplete={() => setLoading(false)} />
        
        {!loading && (
          <div className="portfolio-grid grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((item, idx) => (
              <div key={item.id || idx} className="reveal">
                <PortfolioItem {...item} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-32 p-16 md:p-24 rounded-[3rem] bg-foreground/5 border border-card-border flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full group-hover:bg-brand-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700"></div>

        <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8 relative z-10 tracking-tighter">Ready to architect <br /> the future?</h2>
        <p className="text-foreground/60 mb-12 max-w-2xl relative z-10 text-lg font-medium leading-relaxed">Let's synthesize your vision into a high-performance digital reality. Our lab is ready for the next breakthrough.</p>
        <Link href="mailto:hello@herakonlab.com" className="px-12 py-5 rounded-2xl bg-foreground text-background font-bold flex items-center gap-3 hover:scale-110 transition-all relative z-10 shadow-2xl shadow-foreground/10 active:scale-95">
          Start Project <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}

