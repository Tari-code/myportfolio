"use client";

import { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, []);

  const placeholders = [
    { name: "Sarah Chen", role: "Product Manager", rating: 5, content: "Tari Tech transformed our digital infrastructure with unmatched speed and precision. Their AI integration is next-level." },
    { name: "Marcus Thorne", role: "CEO, Thorne Labs", rating: 5, content: "Working with Paul and his team was a revelation. They don't just deliver code; they deliver strategic innovation." },
    { name: "Elena Rodriguez", role: "Tech Lead", rating: 5, content: "The level of engineering excellence at Tari Tech is rare. Their vision for the next digital era is truly inspiring." },
  ];

  const displayReviews = reviews.length > 0 ? reviews : placeholders;

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden bg-foreground/[0.02]">
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto">
        <div className="reveal mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tighter">
            User <span className="text-gradient">Sentiments</span>
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto text-base md:text-xl leading-relaxed font-medium">
            Real feedback from the visionaries and partners we help empower through engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {displayReviews.map((rev, i) => (
            <div 
              key={i} 
              className="reveal glass-panel p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-card-border hover:border-brand-500/20 hover:scale-[1.02] bg-gradient-to-br from-brand-500/5 to-purple-500/5 transition-all flex flex-col group"
            >
              <Quote className="text-brand-500/20 group-hover:text-brand-500/40 transition-colors mb-6" size={48} />
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star 
                    key={s} 
                    size={16}
                    className={s <= (rev.rating ?? 5) ? 'text-yellow-400' : 'text-foreground/10'}
                    fill={s <= (rev.rating ?? 5) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>

              <p className="text-foreground/90 font-medium text-lg italic mb-10 flex-1 leading-relaxed">
                &quot;{rev.content}&quot;
              </p>

              <div className="flex items-center gap-4 pt-8 border-t border-card-border">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-xl shadow-inner group-hover:bg-brand-500/20 transition-colors">
                  {rev.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">{rev.name}</h4>
                  <p className="text-xs font-bold text-foreground/50 uppercase tracking-[0.2em]">{rev.role || 'Partner'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
