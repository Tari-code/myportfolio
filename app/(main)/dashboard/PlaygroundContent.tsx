"use client";

import React from "react";
import { Cpu, RefreshCw, Globe, LayoutGrid, FileText, Server, Zap, Database, HardDrive, Sliders, DollarSign, Loader2, CheckCircle2, Shield } from "lucide-react";

interface PlaygroundContentProps {
  techStack: any;
  setTechStack: (stack: any) => void;
  telemetrySyncing: boolean;
  triggerTelemetrySync: () => void;
  metrics: { latency: number; load: number; tier: string };
  estimator: any;
  setEstimator: (est: any) => void;
  calculateEstimate: () => number;
  handleEstimateDeploy: () => void;
  isSubmittingEstimate: boolean;
  estimateStatus: { type: 'success' | 'error', message: string } | null;
}

export default function PlaygroundContent({
  techStack,
  setTechStack,
  telemetrySyncing,
  triggerTelemetrySync,
  metrics,
  estimator,
  setEstimator,
  calculateEstimate,
  handleEstimateDeploy,
  isSubmittingEstimate,
  estimateStatus,
}: PlaygroundContentProps) {
  return (
    <div className="space-y-12">
      {/* Interactive Cybernetic Tech Stack Configurator Node */}
      <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-purple-500/10 bg-gradient-to-br from-background via-purple-500/[0.01] to-brand-500/[0.01]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Cpu size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Cybernetic Stack Playground</h2>
              <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Visualize neural platform blueprints</p>
            </div>
          </div>

          <button
            onClick={triggerTelemetrySync}
            disabled={telemetrySyncing}
            className="px-4 py-2 bg-foreground/5 hover:bg-purple-500/10 border border-card-border text-purple-500 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <RefreshCw size={12} className={telemetrySyncing ? 'animate-spin' : ''} />
            {telemetrySyncing ? 'Recalculating...' : 'Sync Telemetry'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Frontend Select */}
          <div className="space-y-2 p-4 bg-foreground/[0.01] border border-card-border rounded-2xl">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">Frontend Layer</span>
            {[
              { value: "nextjs", label: "Next.js (Edge-Render)", icon: Globe },
              { value: "react", label: "React (Client Spa)", icon: LayoutGrid },
              { value: "vanilla", label: "Vanilla HTML/JS", icon: FileText }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setTechStack({ ...techStack, frontend: f.value })}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all ${techStack.frontend === f.value ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'text-foreground/50 border border-transparent hover:bg-foreground/5'
                  }`}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </div>

          {/* Backend Engine */}
          <div className="space-y-2 p-4 bg-foreground/[0.01] border border-card-border rounded-2xl">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">Backend Engine</span>
            {[
              { value: "nodejs", label: "Node.js (Turbo-event)", icon: Cpu },
              { value: "python", label: "Python (ML Native)", icon: Server },
              { value: "go", label: "Go (High Concurrent)", icon: Zap }
            ].map((b) => (
              <button
                key={b.value}
                onClick={() => setTechStack({ ...techStack, backend: b.value })}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all ${techStack.backend === b.value ? 'bg-brand-500/10 text-brand-500 border-brand-500/20' : 'text-foreground/50 border border-transparent hover:bg-foreground/5'
                  }`}
              >
                <b.icon size={14} />
                {b.label}
              </button>
            ))}
          </div>

          {/* Storage Segment */}
          <div className="space-y-2 p-4 bg-foreground/[0.01] border border-card-border rounded-2xl">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-1">Storage Segment</span>
            {[
              { value: "mongodb", label: "MongoDB (Mongoose NoSQL)", icon: Database },
              { value: "postgresql", label: "PostgreSQL (SQL Relational)", icon: HardDrive },
              { value: "redis", label: "Redis (In-Memory Key)", icon: Zap }
            ].map((db) => (
              <button
                key={db.value}
                onClick={() => setTechStack({ ...techStack, database: db.value })}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-left transition-all ${techStack.database === db.value ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'text-foreground/50 border border-transparent hover:bg-foreground/5'
                  }`}
              >
                <db.icon size={14} />
                {db.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cache Configurations Toggles */}
        <div className="flex gap-4 p-4 bg-foreground/[0.01] border border-card-border rounded-2xl mb-8">
          <button
            onClick={() => setTechStack({ ...techStack, caching: !techStack.caching })}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition-all border ${techStack.caching ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-foreground/5 text-foreground/40 border-transparent'
              }`}
          >
            Redis Caching Layer: {techStack.caching ? 'ENABLED (-60% Latency)' : 'DISABLED'}
          </button>
          <button
            onClick={() => setTechStack({ ...techStack, cdn: !techStack.cdn })}
            className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition-all border ${techStack.cdn ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-foreground/5 text-foreground/40 border-transparent'
              }`}
          >
            Vercel Edge CDN: {techStack.cdn ? 'ENABLED (-15% Latency)' : 'DISABLED'}
          </button>
        </div>

        {/* Dynamic Live Systems Diagnostics Panel */}
        <div className="p-6 rounded-[1.8rem] bg-foreground/[0.02] border border-card-border grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
          <div className="space-y-1">
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider block">Expected Platform Latency</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-display text-green-400">{metrics.latency} ms</span>
              <span className="text-[9px] text-foreground/35 font-bold uppercase">(Real-Time round trip)</span>
            </div>
            <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(metrics.latency, 100)}%` }}></div>
            </div>
          </div>

          <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-card-border py-4 sm:py-0 sm:px-6">
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider block">Simulated Server Memory Load</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-display text-brand-400">{metrics.load}%</span>
              <span className="text-[9px] text-foreground/35 font-bold uppercase">(CPU telemetry)</span>
            </div>
            <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-400 rounded-full transition-all duration-500" style={{ width: `${metrics.load}%` }}></div>
            </div>
          </div>

          <div className="space-y-1 sm:pl-4">
            <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider block">System Classification</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-purple-400">{metrics.tier}</span>
            </div>
            <p className="text-[9px] text-foreground/45 font-bold uppercase mt-1">Synced to main nodes</p>
          </div>
        </div>
      </section>

      {/* Interactive Project Quote Estimator Widget */}
      <section className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-brand-500/10 relative overflow-hidden bg-gradient-to-br from-background via-brand-500/[0.01] to-purple-500/[0.01]">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
            <Sliders size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Interactive Project Planner</h2>
            <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Real-time budget & timeline configurations</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider block block ml-1">Project Classification</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "web-dev", label: "Web Dev" },
                { value: "mobile-app", label: "Mobile App" },
                { value: "ui-ux", label: "UI/UX Design" },
                { value: "full-stack", label: "Full Stack" }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setEstimator({ ...estimator, category: item.value })}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${estimator.category === item.value
                    ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/10'
                    : 'bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider block ml-1">Complexity Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "starter", title: "Starter System", desc: "Sleek landing or MVP" },
                { value: "professional", title: "Professional Platform", desc: "Standard business scale" },
                { value: "enterprise", title: "Enterprise Grade", desc: "Deep custom mechanics & AI" }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setEstimator({ ...estimator, complexity: item.value })}
                  className={`p-4 rounded-2xl text-left transition-all border ${estimator.complexity === item.value
                    ? 'bg-brand-500/5 text-brand-500 border-brand-500/30'
                    : 'bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10'
                    }`}
                >
                  <span className="font-bold text-sm block mb-1">{item.title}</span>
                  <span className="text-[10px] opacity-75 font-semibold leading-tight block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Target Timeline Weeks</label>
              <span className="text-xs font-bold text-brand-500">{estimator.timelineWeeks} Weeks</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={estimator.timelineWeeks}
              onChange={(e) => setEstimator({ ...estimator, timelineWeeks: Number(e.target.value) })}
              className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-foreground/30 font-bold uppercase mt-1">
              <span>4 Weeks (Rapid)</span>
              <span>24 Weeks (Expansive)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-wider block ml-1">Desired Technologies</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: "auth", label: "Secure Auth" },
                { key: "ai", label: "AI Integration" },
                { key: "payments", label: "Stripe/Checkout" },
                { key: "analytics", label: "Telemetry panel" },
                { key: "seo", label: "SEO Config" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setEstimator({
                    ...estimator,
                    features: {
                      ...estimator.features,
                      [item.key]: !estimator.features[item.key as keyof typeof estimator.features]
                    }
                  })}
                  className={`py-2 px-3 rounded-xl text-[10px] font-bold transition-all border ${estimator.features[item.key as keyof typeof estimator.features]
                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-sm'
                    : 'bg-foreground/5 text-foreground/50 border-transparent hover:bg-foreground/10'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-foreground/[0.02] border border-card-border flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider block mb-1">Algorithmic Project Estimate</span>
              <div className="flex items-center gap-1">
                <DollarSign className="text-green-500 shrink-0" size={24} />
                <span className="text-3xl font-display font-bold text-foreground">{calculateEstimate().toLocaleString()}</span>
                <span className="text-xs text-foreground/40 font-bold uppercase ml-2 tracking-wide">• ~{estimator.timelineWeeks} Weeks</span>
              </div>
            </div>

            <button
              onClick={handleEstimateDeploy}
              disabled={isSubmittingEstimate}
              className="w-full sm:w-auto px-6 py-4 bg-brand-500 text-white font-bold rounded-2xl text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingEstimate ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
              Lock-In specs & Open support Ticket
            </button>
          </div>

          {estimateStatus && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in ${estimateStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
              {estimateStatus.type === 'success' ? <CheckCircle2 size={16} /> : <Shield size={16} />}
              <span className="text-xs font-bold">{estimateStatus.message}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
