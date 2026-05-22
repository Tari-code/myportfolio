"use client";

import { useEffect, useState, useRef } from "react";
import { 
  User, Mail, Phone, Lock, Save, Loader2, CheckCircle2, Shield, 
  Edit3, X, Eye, EyeOff, Camera, Upload
} from "lucide-react";

export default function CustomerSettings() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    skills: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Mode States
  const [editProfile, setEditProfile] = useState(false);
  const [editSecurity, setEditSecurity] = useState(false);
  const [editBioSkills, setEditBioSkills] = useState(false);
  
  // Visibility States
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setFormData(prev => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            skills: Array.isArray(data.user.skills) ? data.user.skills.join(", ") : ""
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: "Passwords do not match" });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      const skillsArray = formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: "Settings updated successfully" });
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
        setEditProfile(false);
        setEditSecurity(false);
        setEditBioSkills(false);
        setUser({ 
          ...user, 
          name: formData.name, 
          phone: formData.phone,
          bio: formData.bio,
          skills: skillsArray
        });
        // Trigger global sync
        window.dispatchEvent(new Event('user-updated'));
      } else {
        setStatus({ type: 'error', message: data.error || "Update failed" });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);

    try {
      const response = await fetch(`/api/auth/upload?filename=${file.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (response.ok) {
        const blob = await response.json();
        setUser({ ...user, avatar: blob.url });
        setStatus({ type: 'success', message: "Avatar updated successfully" });
        // Trigger global sync
        window.dispatchEvent(new Event('user-updated'));
      } else {
        setStatus({ type: 'error', message: "Upload failed" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus({ type: 'error', message: "Error uploading image" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-40 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="max-w-[280px] md:max-w-none">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1 tracking-tight">Account Settings</h1>
            <p className="text-foreground/60 text-sm md:text-base font-medium tracking-wide">Manage your digital identity and security.</p>
          </div>
          {status && (
            <div className={`w-full md:w-auto px-4 py-3 rounded-xl md:rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 ${
              status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <Shield size={18} />}
              <span className="text-sm font-bold tracking-wide">{status.message}</span>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:gap-10">
          {/* Profile Overview Card */}
          <div className="glass-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-card-border flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-48 md:w-64 h-48 md:h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 md:w-24 h-20 md:h-24 rounded-[1.5rem] md:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl shadow-brand-500/20 ring-4 ring-background overflow-hidden cursor-pointer active:scale-95 transition-transform"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="text-center md:text-left z-10">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">{user.name}</h2>
              <p className="text-foreground/40 text-sm md:text-base font-medium mb-4">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-2 md:px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-wider border border-brand-500/20">
                  {user.role}
                </span>
                <span className="px-2 md:px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid gap-6 md:gap-10">
            {/* Profile Information Section */}
            <div className={`glass-panel p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-300 min-h-[200px] ${editProfile ? 'border-brand-500/50 ring-4 ring-brand-500/5' : 'border-card-border'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${editProfile ? 'bg-brand-500 text-white' : 'bg-brand-500/10 text-brand-500'}`}>
                    <User size={20} />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">Personal Details</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditProfile(!editProfile)}
                  className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${editProfile ? 'bg-red-500/10 text-red-500' : 'bg-foreground/5 text-foreground/40 hover:text-brand-500 hover:bg-brand-500/10'}`}
                >
                  {editProfile ? <X size={18} /> : <Edit3 size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                      disabled={!editProfile}
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-4 text-foreground text-sm md:text-base focus:outline-none focus:border-brand-500/50 transition-all font-medium disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                      disabled={!editProfile}
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-4 text-foreground text-sm md:text-base focus:outline-none focus:border-brand-500/50 transition-all font-medium disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio & Skills Section */}
            <div className={`glass-panel p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-300 min-h-[200px] ${editBioSkills ? 'border-brand-500/50 ring-4 ring-brand-500/5' : 'border-card-border'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${editBioSkills ? 'bg-brand-500 text-white' : 'bg-brand-500/10 text-brand-500'}`}>
                    <Edit3 size={20} />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">Biography & Skills</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditBioSkills(!editBioSkills)}
                  className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${editBioSkills ? 'bg-red-500/10 text-red-500' : 'bg-foreground/5 text-foreground/40 hover:text-brand-500 hover:bg-brand-500/10'}`}
                >
                  {editBioSkills ? <X size={18} /> : <Edit3 size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">Biography</label>
                  <textarea
                    disabled={!editBioSkills}
                    rows={4}
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself, your role, and what you are building..."
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-xl md:rounded-2xl py-3.5 md:py-4 px-4 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-medium disabled:opacity-50 resize-none"
                  />
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">Engineering Skills (comma separated)</label>
                  <input
                    disabled={!editBioSkills}
                    type="text"
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. React, Next.js, Node.js, AI, TypeScript"
                    className="w-full bg-foreground/[0.03] border border-card-border rounded-xl md:rounded-2xl py-3.5 md:py-4 px-4 text-foreground text-sm md:text-base focus:outline-none focus:border-brand-500/50 transition-all font-medium disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className={`glass-panel p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all duration-300 min-h-[200px] ${editSecurity ? 'border-purple-500/50 ring-4 ring-purple-500/5' : 'border-card-border'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${editSecurity ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-500'}`}>
                    <Lock size={20} />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold">Security & Keys</h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditSecurity(!editSecurity)}
                  className={`p-2.5 md:p-3 rounded-lg md:rounded-xl transition-all ${editSecurity ? 'bg-red-500/10 text-red-500' : 'bg-foreground/5 text-foreground/40 hover:text-purple-500 hover:bg-purple-500/10'}`}
                >
                  {editSecurity ? <X size={18} /> : <Edit3 size={18} />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                      disabled={!editSecurity}
                      type={showPass ? "text" : "password"}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-12 text-foreground text-sm md:text-base focus:outline-none focus:border-brand-500/50 transition-all font-medium disabled:opacity-50"
                      placeholder={editSecurity ? "New Password" : "••••••••"}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-foreground transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest ml-1">Confirm Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                      disabled={!editSecurity}
                      type={showConfirmPass ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-12 pr-12 text-foreground text-sm md:text-base focus:outline-none focus:border-brand-500/50 transition-all font-medium disabled:opacity-50"
                      placeholder={editSecurity ? "Confirm Password" : "••••••••"}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-foreground transition-colors"
                    >
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {(editProfile || editSecurity || editBioSkills) && (
              <div className="flex justify-end pt-4 animate-in slide-in-from-bottom-4 fade-in">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-10 md:px-12 py-4 md:py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl md:rounded-3xl flex items-center justify-center gap-3 transition-all font-bold shadow-2xl shadow-brand-500/40 active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save All Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
