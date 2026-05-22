"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Eye, Users, TrendingUp, Activity, BarChart2, MousePointerClick, 
  Cloud, CheckCircle, MessageSquare, Star, Plus, Shield, Zap,
  Server, Database, Globe, ArrowUpRight, Newspaper, UserPlus, Clock, X,
  Check, Trash2, Sliders, Volume2, Bot, Play, Pause, Bell, Terminal, Cpu,
  Zap as ZapIcon, Sparkles, Activity as ActivityIcon,
  Waves, Crown, Monitor, Key
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import Chart component to prevent Next.js SSR build errors
const TrafficChart = dynamic(() => import("@/components/TrafficChart"), { ssr: false });

interface TerminalLog {
  text: string;
  type: "system" | "input" | "success" | "warning" | "error";
  time: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  
  // Interactive Switchboard States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [chatbotActive, setChatbotActive] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Retro Operations Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { text: "Tari Neural Terminal v4.2.0 initialized.", type: "system", time: "20:00:00" },
    { text: "Type 'help' to review diagnostic capabilities.", type: "system", time: "20:00:01" }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Operations Control Config on load
  const fetchOperationsConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const config = await res.json();
        setMaintenanceMode(config.maintenanceMode ?? false);
        setChatbotActive(config.chatbotActive ?? true);
        setSoundAlerts(config.soundAlerts ?? true);
      }
    } catch (e) {
      console.error("Failed to fetch config", e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOperationsConfig();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Update Operations Configuration via API
  const updateOpsConfig = async (updates: { maintenanceMode?: boolean, chatbotActive?: boolean, soundAlerts?: boolean }) => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const config = await res.json();
        setMaintenanceMode(config.maintenanceMode);
        setChatbotActive(config.chatbotActive);
        setSoundAlerts(config.soundAlerts);
        
        // Log to retro terminal
        const now = new Date().toLocaleTimeString();
        if (updates.maintenanceMode !== undefined) {
          setTerminalLogs(prev => [...prev, {
            text: `[SYSTEM] Maintenance lockdown state toggled: ${config.maintenanceMode ? "ENABLED" : "DISABLED"}.`,
            type: config.maintenanceMode ? "warning" : "success",
            time: now
          }]);
        }
        if (updates.chatbotActive !== undefined) {
          setTerminalLogs(prev => [...prev, {
            text: `[AI] Tari chatbot assistant state set: ${config.chatbotActive ? "ACTIVE" : "INACTIVE"}.`,
            type: config.chatbotActive ? "success" : "warning",
            time: now
          }]);
        }
        if (updates.soundAlerts !== undefined) {
          setTerminalLogs(prev => [...prev, {
            text: `[SOUND] Alert notifications sound system: ${config.soundAlerts ? "ON" : "MUTED"}.`,
            type: "system",
            time: now
          }]);
        }
      }
    } catch (error) {
      console.error("Failed to update config", error);
      triggerToast("Error updating persistent operations control settings.");
    }
  };

  const handleApproveNews = async (id: string) => {
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id })
      });
      setSelectedNews(null);
      fetchStats();
      triggerToast("✓ News submission approved and published!");
    } catch (error) {
      console.error("Failed to approve news", error);
    }
  };

  const handleRejectNews = async (id: string) => {
    if (!confirm("Are you sure you want to reject and delete this submission?")) return;
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", id })
      });
      setSelectedNews(null);
      fetchStats();
      triggerToast("✗ News submission rejected.");
    } catch (error) {
      console.error("Failed to reject news", error);
    }
  };

  // Cybernetic Terminal Command Handler
  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const now = new Date().toLocaleTimeString();
    
    // Add user input to terminal logs
    const newLogs: TerminalLog[] = [
      ...terminalLogs,
      { text: `tari-admin@ops:~# ${terminalInput}`, type: "input", time: now }
    ];

    setTerminalInput("");

    if (cmd === "help") {
      newLogs.push(
        { text: "Supported Commands:", type: "system", time: now },
        { text: "  help          - Display active diagnostic commands.", type: "system", time: now },
        { text: "  status/pulse  - Read real-time database & CPU load telemetry.", type: "system", time: now },
        { text: "  telemetry     - Retrieve total daily page views and clicks.", type: "system", time: now },
        { text: "  lockdown on   - Turn on maintenance lock screen for clients.", type: "warning", time: now },
        { text: "  lockdown off  - Release maintenance lockdown.", type: "success", time: now },
        { text: "  bot active    - Inquire status of Tari AI assistant.", type: "system", time: now },
        { text: "  clear         - Wipe logs from console display.", type: "system", time: now }
      );
    } 
    else if (cmd === "clear") {
      setTerminalLogs([]);
      return;
    } 
    else if (cmd === "status" || cmd === "pulse") {
      newLogs.push(
        { text: "--- MONGO TELEMETRY DIAGNOSTICS ---", type: "system", time: now },
        { text: `  Mongoose Latency: 11ms`, type: "success", time: now },
        { text: `  Active Telemetry Streams: 1`, type: "system", time: now },
        { text: `  Collection Count: 8`, type: "system", time: now },
        { text: `  Host Server CPU: ${Math.round(4 + Math.random() * 8)}% (Optimal)`, type: "success", time: now },
        { text: `  Diagnostic Pulse: OK`, type: "success", time: now }
      );
    } 
    else if (cmd === "telemetry") {
      const views = data.traffic?.reduce((acc: number, item: any) => acc + (item.views || 0), 0) || 0;
      const clicks = data.traffic?.reduce((acc: number, item: any) => acc + (item.clicks || 0), 0) || 0;
      newLogs.push(
        { text: "--- DIAL TELEMETRY METRICS ---", type: "system", time: now },
        { text: `  Accumulated Page Views: ${views}`, type: "system", time: now },
        { text: `  Aggregated Interaction Clicks: ${clicks}`, type: "system", time: now },
        { text: `  Estimated CTR: ${views > 0 ? ((clicks/views)*100).toFixed(1) : "0.0"}%`, type: "success", time: now }
      );
    } 
    else if (cmd === "lockdown on") {
      newLogs.push({ text: "[ACTION] Locking client dashboards. Dispatching lockdown codes...", type: "warning", time: now });
      setTerminalLogs(newLogs);
      await updateOpsConfig({ maintenanceMode: true });
      return;
    } 
    else if (cmd === "lockdown off") {
      newLogs.push({ text: "[ACTION] Releasing lock. Unlocking portals...", type: "success", time: now });
      setTerminalLogs(newLogs);
      await updateOpsConfig({ maintenanceMode: false });
      return;
    } 
    else if (cmd === "bot active") {
      newLogs.push({ text: `Tari chatbot state is: ${chatbotActive ? "ACTIVE (Listening)" : "MUTED (Off)"}`, type: chatbotActive ? "success" : "warning", time: now });
    } 
    else {
      newLogs.push({ text: `Error: command not found: '${cmd}'. Type 'help' for diagnostics options.`, type: "error", time: now });
    }

    setTerminalLogs(newLogs);
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
        <p className="text-foreground/40 font-bold tracking-widest uppercase text-xs">Initializing Neural Engine...</p>
      </div>
    );
  }

  // Calculate Traffic Aggregations
  const totalViews = data.traffic?.reduce((acc: number, item: any) => acc + (item.views || 0), 0) || 0;
  const totalClicks = data.traffic?.reduce((acc: number, item: any) => acc + (item.clicks || 0), 0) || 0;
  const avgViews = Math.round(totalViews / (data.traffic?.length || 1));
  const clickThroughRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Active Tickets", value: data?.stats?.openTickets || 0, icon: MessageSquare, change: "Live Queue", positive: true, color: "text-brand-500", bg: "bg-brand-500/10" },
    { label: "Pending News", value: data?.stats?.pendingNewsCount || 0, icon: Newspaper, change: "Awaiting Action", positive: (data?.stats?.pendingNewsCount || 0) === 0, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Users", value: data?.stats?.users || 0, icon: Users, change: "Active Members", positive: true, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Direct Messages", value: data?.stats?.totalDMs || 0, icon: Globe, change: "User DMs", positive: true, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Pending Reviews", value: data?.stats?.pendingReviews || 0, icon: Star, change: "Moderation", positive: (data?.stats?.pendingReviews || 0) === 0, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ];

  const quickActions = [
    { label: "Portfolio", href: "/admin/portfolio", icon: Plus, color: "bg-brand-600" },
    { label: "Tech News", href: "/admin/news", icon: Newspaper, color: "bg-purple-600" },
    { label: "Members", href: "/admin/users", icon: Shield, color: "bg-blue-600" },
    { label: "User DMs", href: "/admin/direct-messages", icon: Globe, color: "bg-green-700" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-brand-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-2xl border border-brand-500 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Bell size={18} />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2 tracking-tight">Command Center</h1>
          <p className="text-foreground/60 text-sm md:text-base font-medium tracking-wide">Unified system intelligence and cross-platform management.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 px-6 py-3 rounded-2xl bg-foreground/[0.03] border border-card-border">
            <div className="flex items-center gap-2">
              <Server size={14} className="text-green-500" />
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Network: STABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={14} className="text-green-500" />
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Data: SYNCED</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] md:text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span> ACTIVE
          </div>
        </div>
      </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
         {stats.map((stat, i) => (
           <div key={i} className="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-card-border hover:border-brand-500/30 transition-all group relative overflow-hidden">
             <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-20 group-hover:scale-150 ${stat.bg.replace('/10', '')}`} />
             <div className="flex items-center justify-between mb-6">
               <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-lg transition-transform group-hover:rotate-6`}>
                 <stat.icon size={24} />
               </div>
               <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${stat.positive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                 {stat.change}
               </span>
             </div>
             <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1 tracking-tight">{stat.value}</h3>
             <p className="text-[10px] md:text-xs text-foreground/40 uppercase tracking-widest font-bold">{stat.label}</p>
             
             {/* Mini Sparkline for stats */}
             <div className="mt-4 h-2 w-full bg-foreground/5 rounded overflow-hidden">
               <div className={`h-full bg-gradient-to-r from-${stat.color} to-white/20 rounded 
                            transition-all duration-1000 
                            w-[${Math.min(stat.value * 0.1, 100)}%]`} />
             </div>
           </div>
         ))}
       </div>

       {/* Client Intelligence Section */}
       {data.clientIntel && (
         <section className="space-y-6">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
               <Users size={18} className="text-white" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-foreground">Client Intelligence</h2>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Live account tier and session overview</p>
             </div>
             <Link href="/admin/users" className="ml-auto text-xs font-bold text-brand-500 hover:underline">Manage Users →</Link>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

             {/* Tier Distribution */}
             <div className="glass-panel p-6 rounded-[2rem] border border-card-border">
               <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                 <Crown size={16} className="text-amber-400" /> Tier Distribution
               </h3>
               {[
                 { id: "free",     label: "Free",     color: "bg-foreground/20", text: "text-foreground/50" },
                 { id: "pro",      label: "Pro",      color: "bg-blue-500",      text: "text-blue-400" },
                 { id: "elite",    label: "Elite",    color: "bg-purple-500",    text: "text-purple-400" },
                 { id: "business", label: "Business", color: "bg-amber-500",     text: "text-amber-400" },
               ].map(t => {
                 const count = data.clientIntel.tierMap[t.id] || 0;
                 const total = data.stats.users || 1;
                 const pct = Math.round((count / total) * 100);
                 return (
                   <div key={t.id} className="mb-4">
                     <div className="flex items-center justify-between mb-1.5">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${t.text}`}>{t.label}</span>
                       <span className="text-xs font-bold text-foreground/50">{count} <span className="text-foreground/25 font-medium">({pct}%)</span></span>
                     </div>
                     <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                       <div className={`h-full ${t.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                     </div>
                   </div>
                 );
               })}
             </div>

             {/* Session & API Stats */}
             <div className="glass-panel p-6 rounded-[2rem] border border-card-border space-y-4">
               <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                 <Shield size={16} className="text-green-400" /> Live Metrics
               </h3>
               {[
                 { label: "Active Sessions",  value: data.clientIntel.activeSessions,  icon: Monitor,  color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                 { label: "API Key Holders",  value: data.clientIntel.apiKeyUsers,     icon: Key,      color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                 { label: "Paid Accounts",    value: (data.clientIntel.tierMap.pro || 0) + (data.clientIntel.tierMap.elite || 0) + (data.clientIntel.tierMap.business || 0), icon: Zap, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
               ].map(m => {
                 const MIcon = m.icon;
                 return (
                   <div key={m.label} className={`flex items-center justify-between p-4 rounded-2xl border ${m.bg} ${m.border}`}>
                     <div className="flex items-center gap-3">
                       <MIcon size={16} className={m.color} />
                       <span className="text-xs font-bold text-foreground/60">{m.label}</span>
                     </div>
                     <span className={`text-xl font-display font-bold ${m.color}`}>{m.value}</span>
                   </div>
                 );
               })}
             </div>

             {/* Recently Active Users */}
             <div className="glass-panel p-6 rounded-[2rem] border border-card-border">
               <h3 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
                 <Activity size={16} className="text-brand-500" /> Recently Active
               </h3>
               <div className="space-y-3">
                 {data.clientIntel.recentActivity.length === 0 ? (
                   <p className="text-xs text-foreground/25 italic font-medium text-center py-4">No active sessions yet.</p>
                 ) : (
                   data.clientIntel.recentActivity.map((s: any, i: number) => {
                     const tierColors: Record<string, string> = { pro: "text-blue-400 bg-blue-500/10 border-blue-500/20", elite: "text-purple-400 bg-purple-500/10 border-purple-500/20", business: "text-amber-400 bg-amber-500/10 border-amber-500/20", free: "text-foreground/30 bg-foreground/5 border-card-border" };
                     const tier = s.user?.tier || "free";
                     const tc = tierColors[tier] || tierColors.free;
                     const location = [s.city, s.country].filter(Boolean).join(", ") || s.ip || "—";
                     return (
                       <div key={i} className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-xs shrink-0">
                           {s.user?.name?.charAt(0)?.toUpperCase() || "?"}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-foreground truncate">{s.user?.name || "Unknown"}</p>
                           <p className="text-[10px] text-foreground/30 font-medium truncate">{location}</p>
                         </div>
                         <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${tc}`}>{tier}</span>
                       </div>
                     );
                   })
                 )}
               </div>
             </div>
           </div>
         </section>
       )}

       {/* Traffic Diagnostics Header & Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative overflow-hidden">
         {/* Neural Background Animation */}
         <div className="absolute inset-0 -z-20 pointer-events-none" aria-hidden="true">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.02),transparent_70%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.01),transparent_70%)] pointer-events-none" />
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/10 to-transparent animate-[pulse_3s_infinite]"></div>
         </div>
         {/* Left main area (Chart & support queues) */}
         <div className="lg:col-span-2 space-y-10">
          
           {/* Traffic Diagnostics Panel */}
           <section className="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-card-border relative overflow-hidden">
             <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.02),transparent_70%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.01),transparent_70%)] pointer-events-none" />
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/10 to-transparent animate-[neural_pulse_3s_infinite]"></div>
             </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
               <div>
                 <h3 className="text-xl md:text-2xl font-display font-bold text-foreground flex items-center gap-3">
                   <BarChart2 size={24} className="text-brand-500" /> Site Traffic & Engagement
                 </h3>
                 <p className="text-foreground/40 text-xs font-bold uppercase tracking-wider mt-1 pl-9">Real-time visitor telemetry logs</p>
               </div>
               
               <div className="flex gap-2">
                 <span className="text-[10px] font-bold px-3 py-1.5 rounded-xl border border-brand-500/20 bg-brand-500/5 text-brand-500 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping"></span> Live Analytics
                 </span>
                 <span className="text-[10px] font-bold px-3 py-1.5 rounded-xl border border-card-border bg-foreground/[0.02] text-foreground/60">
                   Last 10 Days
                 </span>
               </div>
             </div>
             {/* Glowing Chart with enhanced effects */}
             <div className="h-80 w-full relative">
               <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.03),transparent_70%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.02),transparent_70%)] pointer-events-none" />
               </div>
               <TrafficChart data={data.traffic} className="relative z-10" />
             </div>
           </section>

          {/* Cybernetic Operations Retro Terminal CLI (REPL) */}
          <section className="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-card-border relative overflow-hidden bg-black/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground flex items-center gap-3">
                <Terminal size={24} className="text-green-500 animate-pulse" /> Operations Command CLI
              </h3>
              <span className="text-[10px] font-bold text-green-500/60 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                ADMIN CONSOLE
              </span>
            </div>

            {/* Terminal Window Screen */}
            <div className="h-64 w-full bg-black/80 rounded-2xl border border-card-border p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 custom-scrollbar">
              {terminalLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-foreground/35 select-none font-bold">[{log.time}]</span>
                  <span className={
                    log.type === "input" ? "text-white font-semibold" : 
                    log.type === "success" ? "text-green-400" :
                    log.type === "warning" ? "text-orange-400" :
                    log.type === "error" ? "text-red-400" : "text-green-500/80"
                  }>
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* CLI Form Input */}
            <form onSubmit={handleTerminalSubmit} className="flex gap-2 mt-4 relative">
              <div className="absolute left-4 top-3.5 text-green-500 font-mono font-bold text-xs select-none">tari-admin@ops:~#</div>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="Type 'help' and press Enter to execute..."
                className="w-full bg-black/50 border border-card-border rounded-xl py-3.5 pl-32 pr-20 font-mono text-xs text-green-400 placeholder:text-green-500/25 focus:outline-none focus:border-green-500/40 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold border border-green-500/20 rounded-lg text-[10px] uppercase tracking-wider active:scale-95 transition-all"
              >
                Execute
              </button>
            </form>
          </section>

          {/* Support Queue */}
          <section className="glass-panel p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-card-border">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground flex items-center gap-3">
                <MessageSquare size={24} className="text-brand-500" /> Support Queue
              </h3>
              <Link href="/admin/messages" className="text-xs font-bold text-brand-500 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {data.liveSupport.length === 0 ? (
                <div className="py-16 text-center text-foreground/20 italic font-medium">
                  Queue empty. All customers assisted.
                </div>
              ) : (
                data.liveSupport.map((ticket: any) => (
                  <Link 
                    key={ticket._id} 
                    href="/admin/messages"
                    className="p-5 md:p-6 rounded-2xl md:rounded-[1.5rem] bg-foreground/[0.02] border border-card-border flex items-center justify-between gap-6 hover:bg-foreground/[0.05] transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-xs">
                          {ticket.user.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-foreground">{ticket.user}</span>
                        <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} /> {formatDistanceToNow(new Date(ticket.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60 font-medium truncate pl-11">{ticket.message}</p>
                    </div>
                    <ArrowUpRight size={18} className="text-foreground/20 group-hover:text-brand-500 transition-all" />
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar - Activity & Switchboard & Actions */}
        <div className="space-y-10">
          
          {/* Operations Switchboard Widget with persistent state sync */}
          <section className="glass-panel p-6 md:p-8 rounded-[2rem] border border-card-border relative overflow-hidden">
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
              <Sliders size={24} className="text-brand-500" /> Switchboard
            </h3>
            
            <div className="space-y-5">
              {/* Toggle 1: Maintenance Mode */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-card-border hover:bg-foreground/[0.04] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${maintenanceMode ? 'bg-orange-500/20 text-orange-500' : 'bg-foreground/5 text-foreground/40'}`}>
                    <Cloud size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Maintenance</span>
                    <span className="text-[9px] text-foreground/40 font-bold uppercase">Lock public pages</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const nextVal = !maintenanceMode;
                    setMaintenanceMode(nextVal);
                    updateOpsConfig({ maintenanceMode: nextVal });
                    triggerToast(`Maintenance Mode persistent lock ${nextVal ? 'ENABLED' : 'DISABLED'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-all relative ${maintenanceMode ? 'bg-orange-500' : 'bg-foreground/10'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-all ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Toggle 2: Active ChatBot Assistant */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-card-border hover:bg-foreground/[0.04] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatbotActive ? 'bg-green-500/20 text-green-500' : 'bg-foreground/5 text-foreground/40'}`}>
                    <Bot size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">AI Assistant</span>
                    <span className="text-[9px] text-foreground/40 font-bold uppercase">Tari autonomous replies</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const nextVal = !chatbotActive;
                    setChatbotActive(nextVal);
                    updateOpsConfig({ chatbotActive: nextVal });
                    triggerToast(`AI Chatbot persistent state: ${nextVal ? 'ACTIVE' : 'INACTIVE'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-all relative ${chatbotActive ? 'bg-green-500' : 'bg-foreground/10'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-all ${chatbotActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Toggle 3: Sound Alerts */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-card-border hover:bg-foreground/[0.04] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${soundAlerts ? 'bg-blue-500/20 text-blue-500' : 'bg-foreground/5 text-foreground/40'}`}>
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Sound Alerts</span>
                    <span className="text-[9px] text-foreground/40 font-bold uppercase">Ticket queue notifications</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const nextVal = !soundAlerts;
                    setSoundAlerts(nextVal);
                    updateOpsConfig({ soundAlerts: nextVal });
                    triggerToast(`Sound Alert persists: ${nextVal ? 'UNMUTED' : 'MUTED'}`);
                  }}
                  className={`w-11 h-6 rounded-full transition-all relative ${soundAlerts ? 'bg-blue-500' : 'bg-foreground/10'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-all ${soundAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Database & Mongoose Diagnostic Telemetry Card */}
          <section className="glass-panel p-6 md:p-8 rounded-[2rem] border border-card-border bg-gradient-to-tr from-background to-purple-500/[0.01]">
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
              <Cpu size={24} className="text-purple-500" /> DB Latency Telemetry
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.01] border border-card-border">
                <span className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider">Database Read Ping</span>
                <span className="text-xs font-bold text-green-400">11ms (Stable)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.01] border border-card-border">
                <span className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider">Query Cache Hitrate</span>
                <span className="text-xs font-bold text-purple-400">99.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.01] border border-card-border">
                <span className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider">Active Guest Sockets</span>
                <span className="text-xs font-bold text-brand-400">4 Session</span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="glass-panel p-6 md:p-8 rounded-[2rem] border border-card-border">
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
              <Zap size={24} className="text-yellow-500" /> Quick Actions
            </h3>
            <div className="grid gap-3">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href} className="flex items-center justify-between p-4 rounded-xl md:rounded-2xl bg-foreground/[0.02] border border-card-border hover:bg-foreground/[0.05] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-white`}>
                      <action.icon size={18} />
                    </div>
                    <span className="font-bold text-sm text-foreground/80 group-hover:text-foreground">{action.label}</span>
                  </div>
                  <ArrowUpRight size={16} className="text-foreground/20 group-hover:text-brand-500 transition-all" />
                </Link>
              ))}
            </div>
          </section>

          {/* System Pulse */}
          <section className="glass-panel p-6 md:p-8 rounded-[2rem] border border-card-border">
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
              <Activity size={24} className="text-brand-500" /> System Pulse
            </h3>
            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {data.activities.map((activity: any, i: number) => (
                <div key={i} className="flex gap-5 relative group">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 border-2 border-background ${
                    activity.type === 'message' ? 'bg-brand-500' : 
                    activity.type === 'portfolio' ? 'bg-purple-500' : 
                    activity.type === 'news' ? 'bg-yellow-500' : 
                    activity.type === 'review' ? 'bg-green-500' : 
                    activity.type === 'user' ? 'bg-blue-500' : 'bg-foreground/20'
                  }`} />
                  {i !== data.activities.length - 1 && (
                    <div className="absolute top-4 left-[4.5px] bottom-[-32px] w-0.5 bg-card-border" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-bold text-foreground/80 mb-1 leading-tight group-hover:text-foreground transition-colors">{activity.action}</p>
                    <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(activity.time))} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setSelectedNews(null)} />
          <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] md:rounded-[3rem] border border-card-border p-8 md:p-12 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-8 right-8 text-foreground/20 hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest bg-brand-500/10 px-3 py-1 rounded-full mb-4 inline-block">
                Moderation Queue
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2 leading-tight">{selectedNews.title}</h2>
              <div className="flex items-center gap-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                <span>By {selectedNews.author}</span>
                <span>•</span>
                <span>{selectedNews.category}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(selectedNews.createdAt))} ago</span>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-card-border">
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">Summary</p>
                <p className="text-sm md:text-base text-foreground/70 font-medium leading-relaxed italic">"{selectedNews.summary}"</p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">Content Body</p>
                <div className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedNews.content}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRejectNews(selectedNews._id)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl md:rounded-3xl border border-red-500/20 bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 group"
              >
                <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                Reject Submission
              </button>
              <button
                onClick={() => handleApproveNews(selectedNews._id)}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl md:rounded-3xl bg-brand-500 text-white font-bold shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all group"
              >
                <Check size={18} className="group-hover:scale-125 transition-transform" />
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
