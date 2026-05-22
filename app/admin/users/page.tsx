"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, Trash2, Search, Filter, MoreVertical, CheckCircle2, XCircle } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setStatus({ type: 'error', message: data.error || "Failed to load users" });
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setStatus({ type: 'error', message: "Database connection failed. Please check your network." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        setStatus({ type: 'success', message: "User deleted successfully" });
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.error || "Delete failed" });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "An unexpected error occurred" });
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        setStatus({ type: 'success', message: `User promoted to ${newRole}` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Failed to update role" });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 tracking-tight">User Management</h1>
          <p className="text-foreground/60 font-medium tracking-wide">Manage system access and user permissions.</p>
        </div>
        {status && (
          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-right-4 ${
            status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span className="text-sm font-bold">{status.message}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 pl-12 pr-4 text-foreground focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={16} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-foreground/[0.03] border border-card-border rounded-xl py-3 pl-12 pr-8 text-foreground focus:outline-none focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="customer">Customers</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2rem] border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.02] border-b border-card-border">
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-foreground/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-foreground/40 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-foreground/20'}`}></div>
                      <span className="text-sm font-medium text-foreground/60">
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground/60 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleRoleChange(user._id, user.role)}
                        title="Toggle Role"
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-brand-500/10 text-foreground/40 hover:text-brand-500 transition-all"
                      >
                        <Shield size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                        className="p-2 rounded-lg bg-foreground/5 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-foreground/40 font-medium italic">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronDown({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
