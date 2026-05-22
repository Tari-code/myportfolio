"use client";

import { useEffect, useState } from "react";
import {
  User, Mail, Shield, Trash2, Search, Filter, CheckCircle2, XCircle,
  Crown, Zap, Star, Globe, ChevronDown, Key, Monitor, Building2
} from "lucide-react";

const TIERS = [
  { id: "free",     label: "Free",     color: "text-foreground/50", bg: "bg-foreground/5",      border: "border-card-border",       icon: Globe },
  { id: "pro",      label: "Pro",      color: "text-blue-400",      bg: "bg-blue-500/10",       border: "border-blue-500/20",       icon: Zap },
  { id: "elite",    label: "Elite",    color: "text-purple-400",    bg: "bg-purple-500/10",     border: "border-purple-500/20",     icon: Star },
  { id: "business", label: "Business", color: "text-amber-400",     bg: "bg-amber-500/10",      border: "border-amber-500/20",      icon: Crown },
];

function TierBadge({ tier }: { tier: string }) {
  const t = TIERS.find(x => x.id === tier) || TIERS[0];
  const Icon = t.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.bg} ${t.color} border ${t.border}`}>
      <Icon size={10} /> {t.label}
    </span>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updatingTier, setUpdatingTier] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => {
    if (status) { const t = setTimeout(() => setStatus(null), 3500); return () => clearTimeout(t); }
  }, [status]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else setStatus({ type: "error", message: data.error || "Failed to load users" });
    } catch { setStatus({ type: "error", message: "Database connection failed." }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== id));
        setStatus({ type: "success", message: "User deleted successfully" });
      } else {
        const d = await res.json();
        setStatus({ type: "error", message: d.error || "Delete failed" });
      }
    } catch { setStatus({ type: "error", message: "An unexpected error occurred" }); }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
        setStatus({ type: "success", message: `Role updated to ${newRole}` });
      }
    } catch { setStatus({ type: "error", message: "Failed to update role" }); }
  };

  const handleTierChange = async (id: string, newTier: string) => {
    setUpdatingTier(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, tier: newTier }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, tier: newTier } : u));
        setStatus({ type: "success", message: `Tier set to ${newTier}` });
      }
    } catch { setStatus({ type: "error", message: "Failed to update tier" }); }
    finally { setUpdatingTier(null); }
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchTier = filterTier === "all" || (u.tier || "free") === filterTier;
    return matchSearch && matchRole && matchTier;
  });

  // Tier distribution counts
  const tierStats = TIERS.map(t => ({
    ...t,
    count: users.filter(u => (u.tier || "free") === t.id).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1 tracking-tight">User Management</h1>
          <p className="text-foreground/50 font-medium text-sm">Manage system access, roles, and subscription tiers.</p>
        </div>
        {status && (
          <div className={`px-4 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-right-4 text-sm font-bold ${
            status.type === "success"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}>
            {status.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {status.message}
          </div>
        )}
      </div>

      {/* Tier Distribution */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tierStats.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setFilterTier(filterTier === t.id ? "all" : t.id)}
              className={`glass-panel p-4 rounded-2xl border transition-all text-left ${
                filterTier === t.id ? `${t.border} ${t.bg}` : "border-card-border hover:bg-foreground/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={t.color} />
                <span className={`text-xl font-bold ${t.color}`}>{t.count}</span>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${filterTier === t.id ? t.color : "text-foreground/40"}`}>
                {t.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-sm"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={15} />
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="bg-foreground/[0.03] border border-card-border rounded-xl py-3 pl-10 pr-8 text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium appearance-none cursor-pointer text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="customer">Customers</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 pointer-events-none" size={13} />
          </div>
          <div className="relative group">
            <Crown className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={15} />
            <select
              value={filterTier}
              onChange={e => setFilterTier(e.target.value)}
              className="bg-foreground/[0.03] border border-card-border rounded-xl py-3 pl-10 pr-8 text-foreground focus:outline-none focus:border-brand-500/50 transition-all font-medium appearance-none cursor-pointer text-sm"
            >
              <option value="all">All Tiers</option>
              {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 pointer-events-none" size={13} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-[2rem] border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-card-border">
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Tier</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest hidden lg:table-cell">Extras</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-foreground/[0.015] transition-colors group">

                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-sm shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{user.name}</p>
                        <p className="text-xs text-foreground/40 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === "admin"
                        ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                        : "bg-brand-500/10 text-brand-500 border border-brand-500/20"
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Tier — inline dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        value={user.tier || "free"}
                        onChange={e => handleTierChange(user._id, e.target.value)}
                        disabled={updatingTier === user._id}
                        className={`appearance-none cursor-pointer text-[10px] font-bold uppercase tracking-wider pl-2.5 pr-6 py-1.5 rounded-full border transition-all focus:outline-none disabled:opacity-50 ${(() => {
                          const t = TIERS.find(x => x.id === (user.tier || "free")) || TIERS[0];
                          return `${t.bg} ${t.color} ${t.border}`;
                        })()}`}
                      >
                        {TIERS.map(t => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                      <ChevronDown
                        size={10}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                          (TIERS.find(x => x.id === (user.tier || "free")) || TIERS[0]).color
                        }`}
                      />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.emailVerified ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" : "bg-foreground/20"}`} />
                      <span className="text-xs font-medium text-foreground/60">
                        {user.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </td>

                  {/* Extras */}
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      {user.apiKey && (
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Key size={9} /> API
                        </span>
                      )}
                      {user.company && (
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Building2 size={9} /> Biz
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4">
                    <p className="text-xs text-foreground/50 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        title={user.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-purple-500/10 text-foreground/40 hover:text-purple-500 transition-all"
                      >
                        <Shield size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center text-foreground/30 font-medium italic text-sm">
            No users match your current filters.
          </div>
        )}
        <div className="px-6 py-3 border-t border-card-border bg-foreground/[0.01] flex items-center justify-between">
          <p className="text-xs text-foreground/30 font-bold uppercase tracking-wider">
            {filteredUsers.length} of {users.length} users
          </p>
          <p className="text-xs text-foreground/20 font-medium">Click tier badge to change plan instantly</p>
        </div>
      </div>
    </div>
  );
}

