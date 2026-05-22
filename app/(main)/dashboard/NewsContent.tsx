"use client";

import React from "react";
import { Newspaper, FileText, Globe, Plus, CheckCircle2, Clock } from "lucide-react";

interface NewsContentProps {
  news: any[];
  onSubmitNews: () => void;
}

export default function NewsContent({ news, onSubmitNews }: NewsContentProps) {
  return (
    <section className="glass-panel p-6 md:p-8 rounded-[2rem] border border-card-border mb-12 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Newspaper size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">My Tech Contributions</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
              {news.length} submission{news.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={onSubmitNews}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-500/20"
        >
          <Plus size={14} /> Submit News
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {news.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-card-border rounded-[1.5rem] bg-foreground/[0.01]">
            <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center text-foreground/20 mb-4">
              <Newspaper size={28} />
            </div>
            <h3 className="font-bold text-sm text-foreground/50 mb-1">No news submitted yet</h3>
            <p className="text-xs text-foreground/30 max-w-xs font-medium leading-relaxed">
              Have interesting tech news? Share it with the community and get reviewed by our team.
            </p>
            <button
              onClick={onSubmitNews}
              className="mt-6 px-5 py-2.5 bg-brand-500/10 hover:bg-brand-500 border border-brand-500/20 hover:border-brand-500 text-brand-500 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              Submit Your First Article
            </button>
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item._id}
              className="glass-panel p-5 rounded-[1.5rem] border border-card-border flex items-center gap-5 group hover:border-brand-500/20 transition-all"
            >
              {/* Icon */}
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-foreground/[0.03] border border-card-border items-center justify-center text-foreground/20 shrink-0 group-hover:bg-purple-500/5 group-hover:border-purple-500/10 transition-all">
                <FileText size={22} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-foreground mb-1 leading-tight group-hover:text-brand-500 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                {item.summary && (
                  <p className="text-[11px] text-foreground/40 font-medium line-clamp-1 mb-2">
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-lg border border-brand-500/20">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-bold text-foreground/30 flex items-center gap-1">
                    <Clock size={9} />
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] font-bold text-foreground/30 hover:text-brand-500 flex items-center gap-1 transition-colors"
                    >
                      <Globe size={9} /> Source
                    </a>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <div className="shrink-0">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider ${
                    item.isApproved
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  }`}
                >
                  {item.isApproved ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <Clock size={10} className="animate-pulse" />
                  )}
                  {item.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
