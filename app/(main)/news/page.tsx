"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news"); // Assuming this exists or I'll check
        const data = await res.json();
        setNews(data || []);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen relative">
      <div className="mb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-500 label-caps mb-8 border border-brand-500/20">
          <TrendingUp size={14} /> Insights
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-8 tracking-tighter">
          Tech <span className="text-gradient">Pulse</span>
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium">
          Chronicles of our latest engineering breakthroughs, AI research, and the evolution of the digital frontier.
        </p>
      </div>

      <div className="relative min-h-[400px]">
        <LoadingScreen isVisible={loading} fullScreen={false} onComplete={() => setLoading(false)} />
        
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
            {news.length > 0 ? (
              news.map((article: any) => (
                <NewsCard key={article._id?.toString() || article.id} article={article} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                <div className="w-20 h-20 bg-foreground/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <Calendar className="text-foreground/20" size={32} />
                </div>
                <p className="text-xl text-foreground/40 font-bold">No transmissions detected.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
