"use client";

import { useState, useEffect } from "react";
import { Quote, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { Card } from "@/components/ui/Card";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, []);

  const placeholders = [
    { name: "Sarah Chen", role: "Product Manager", rating: 5, content: "Tari Tech transformed our digital infrastructure with unmatched speed and precision." },
    { name: "Marcus Thorne", role: "CEO, Thorne Labs", rating: 5, content: "They don't just deliver code — they deliver strategic innovation." },
    { name: "Elena Rodriguez", role: "Tech Lead", rating: 5, content: "Engineering excellence and a vision for the next digital era." },
  ];

  const displayReviews = reviews.length > 0 ? reviews : placeholders;

  return (
    <section className="section-padding px-4 md:px-6 bg-foreground/[0.02]">
      <div className="container max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-display-lg text-foreground mb-4">
            Client <span className="text-gradient">Testimonials</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from partners we help empower through engineering.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {displayReviews.map((rev, i) => (
            <ScrollReveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Card padding="lg" className="h-full flex flex-col group">
                <Quote className="text-brand-500/20 group-hover:text-brand-500/40 transition-colors mb-4" size={32} />

                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= (rev.rating ?? 5) ? "text-amber-400" : "text-foreground/10"}
                      fill={s <= (rev.rating ?? 5) ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <p className="text-foreground/90 text-sm leading-relaxed mb-6 flex-1 italic">
                  &ldquo;{rev.content}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-card-border">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-semibold text-sm">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{rev.name}</p>
                    <p className="text-xs text-muted-foreground">{rev.role || "Partner"}</p>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
