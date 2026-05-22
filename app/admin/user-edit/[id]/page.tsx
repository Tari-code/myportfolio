"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Loader2, CheckCircle2, AlertTriangle,
  User, Mail, MapPin, Globe, AtSign, Link2, Edit3, Camera, X
} from "lucide-react";

export default function AdminUserEdit() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          const found = data.users?.find((u: any) => u._id === userId);
          if (found) {
            setFormData({
              name: found.name || "",
              bio: found.bio || "",
              skills: Array.isArray(found.skills) ? found.skills.join(", ") : "",
              location: found.location || "",
              website: found.website || "",
              github: found.github || "",
              twitter: found.twitter || "",
              avatar: found.avatar || "",
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name: formData.name,
          bio: formData.bio,
          skills: skillsArray,
          location: formData.location,
          website: formData.website,
          github: formData.github,
          twitter: formData.twitter,
          avatar: formData.avatar,
        }),
      });
      if (res.ok) {
        setStatus({ type: "success", message: "Profile updated successfully." });
      } else {
        const d = await res.json();
        setStatus({ type: "error", message: d.error || "Failed to update profile." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <button
            onClick={() => router.push(`/admin/user-view/${userId}`)}
            className="flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors text-sm font-bold"
          >
            <ArrowLeft size={16} />
            Back to User
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Edit3 size={15} />
            </div>
            <h1 className="text-lg font-black text-foreground">Edit Profile</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Avatar */}
          <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                <Camera size={18} />
              </div>
              <h2 className="font-bold text-sm">Avatar URL</h2>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0">
                {formData.avatar
                  ? <img src={formData.avatar} alt="avatar" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : formData.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-wider mt-1.5">Paste a direct image URL</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <User size={18} />
              </div>
              <h2 className="font-bold text-sm">Basic Info</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about this user..."
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-medium resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={e => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. React, Next.js, Node.js"
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Lagos, Nigeria"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-panel p-7 rounded-[2.5rem] border border-card-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Globe size={18} />
              </div>
              <h2 className="font-bold text-sm">Links & Social</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">Website</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yoursite.com"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">GitHub Username</label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    type="text"
                    value={formData.github}
                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                    placeholder="yourusername"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5 block ml-1">Twitter / X Handle</label>
                <div className="relative">
                  <AtSign size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/25" />
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="yourtwitterhandle"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 pl-11 pr-4 text-foreground text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status + Submit */}
          {status && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-bold ${
              status.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-400 text-white font-black rounded-2xl hover:scale-[1.01] transition-all active:scale-[0.99] shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Profile Changes
          </button>

        </form>
      </div>
    </div>
  );
}
