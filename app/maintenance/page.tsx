"use client";

import { KeyRound, AlertTriangle, Clock } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="glass-panel max-w-lg w-full rounded-[3rem] p-10 md:p-14 border border-orange-500/20 text-center relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 mx-auto mb-8 animate-pulse">
          <KeyRound size={40} />
        </div>

        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-1.5 rounded-full mb-4 inline-block border border-orange-500/20">
          SYSTEM LOCKDOWN
        </span>
        <h1 className="text-3xl font-display font-bold text-foreground mb-4 leading-tight">Operations Maintenance</h1>

        <p className="text-sm text-foreground/60 leading-relaxed font-semibold mb-8">
          The Tari Technologies Operations center has temporarily placed our systems under lock. We are upgrading database partitions and synchronizing systems.
        </p>

        <div className="p-5 rounded-2xl bg-foreground/[0.02] border border-card-border space-y-3 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-foreground/45 uppercase tracking-wider">
            <span>Maintenance Mode:</span>
            <span className="text-orange-500">ACTIVE</span>
          </div>
          <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-[loading_2s_infinite]" style={{ width: "65%" }}></div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase mt-1">
            <AlertTriangle size={12} className="text-orange-500" />
            <span>System features will unlock instantly when operations finish.</span>
          </div>
        </div>
      </div>
    </div>
  );
}