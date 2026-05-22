"use client";

import { useState, useEffect } from "react";
import { Database, Shield, Mail, Bell, CheckCircle, Loader2, AlertCircle, Eye, EyeOff, RefreshCw, Save, ExternalLink } from "lucide-react";

type EnvStatus = {
  MONGODB_URI: boolean;
  JWT_SECRET: boolean;
  EMAIL_USER: boolean;
  EMAIL_PASS: boolean;
  NEXT_PUBLIC_BASE_URL: boolean;
  VAPID_PUBLIC_KEY: boolean;
  VAPID_PRIVATE_KEY: boolean;
  VAPID_EMAIL: boolean;
};

const SECTIONS = [
  {
    id: "database",
    label: "Database",
    icon: Database,
    color: "brand",
    required: true,
    description: "MongoDB connection string for storing all app data.",
    fields: [
      { key: "MONGODB_URI", label: "MongoDB URI", placeholder: "mongodb+srv://user:pass@cluster.mongodb.net/db", sensitive: true, hint: "MongoDB Atlas → Connect → Drivers" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    color: "purple",
    required: true,
    description: "Secret key used to sign and verify user sessions.",
    fields: [
      { key: "JWT_SECRET", label: "JWT Secret", placeholder: "A long random string (min 32 chars)", sensitive: true, hint: "Any long random string — the longer the better" },
    ],
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    color: "blue",
    required: false,
    description: "Enables password reset and notification emails via Gmail.",
    fields: [
      { key: "EMAIL_USER", label: "Gmail Address", placeholder: "yourapp@gmail.com", sensitive: false, hint: "Gmail account to send emails from" },
      { key: "EMAIL_PASS", label: "Gmail App Password", placeholder: "xxxx xxxx xxxx xxxx", sensitive: true, hint: "Google Account → Security → App Passwords" },
      { key: "NEXT_PUBLIC_BASE_URL", label: "Site Base URL", placeholder: "https://yoursite.replit.app", sensitive: false, hint: "The public URL of your deployed site" },
    ],
  },
  {
    id: "push",
    label: "Push Notifications",
    icon: Bell,
    color: "green",
    required: false,
    description: "Enables browser push notifications for subscribed users.",
    fields: [
      { key: "VAPID_PUBLIC_KEY", label: "VAPID Public Key", placeholder: "BO...", sensitive: false, hint: 'npx web-push generate-vapid-keys' },
      { key: "VAPID_PRIVATE_KEY", label: "VAPID Private Key", placeholder: "...", sensitive: true, hint: 'npx web-push generate-vapid-keys' },
      { key: "VAPID_EMAIL", label: "VAPID Contact Email", placeholder: "mailto:admin@yoursite.com", sensitive: false, hint: 'Must start with mailto:' },
    ],
  },
];

const colorRingMap: Record<string, string> = {
  brand: "border-brand-500/40 ring-brand-500/10",
  purple: "border-purple-500/40 ring-purple-500/10",
  blue: "border-blue-500/40 ring-blue-500/10",
  green: "border-green-500/40 ring-green-500/10",
};
const iconBgMap: Record<string, string> = {
  brand: "bg-brand-500/10 text-brand-500",
  purple: "bg-purple-500/10 text-purple-500",
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-green-500/10 text-green-500",
};

export default function AdminSetupPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<EnvStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsRestart, setNeedsRestart] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/setup/status");
      const data = await res.json();
      setStatus(data.vars);
    } catch {}
  };

  const handleSave = async (sectionFields: { key: string }[], sectionId: string) => {
    const payload: Record<string, string> = {};
    for (const f of sectionFields) {
      if (values[f.key]?.trim()) payload[f.key] = values[f.key].trim();
    }
    if (Object.keys(payload).length === 0) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/setup/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSection(sectionId);
        setNeedsRestart(true);
        await checkStatus();
        const cleared: Record<string, string> = { ...values };
        for (const f of sectionFields) delete cleared[f.key];
        setValues(cleared);
        setTimeout(() => setSavedSection(null), 3000);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const sectionComplete = (s: typeof SECTIONS[0]) =>
    s.fields.every(f => status?.[f.key as keyof EnvStatus]);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1 tracking-tight">Environment Setup</h1>
          <p className="text-foreground/50 text-sm md:text-base font-medium">Configure your app&apos;s required secrets and API keys.</p>
        </div>

        {/* Status summary */}
        {status && (
          <div className="glass-panel p-5 rounded-2xl border border-card-border mb-8 flex flex-wrap gap-3">
            {SECTIONS.map(s => (
              <div
                key={s.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  sectionComplete(s)
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : s.required
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-foreground/5 text-foreground/40 border-card-border"
                }`}
              >
                {sectionComplete(s) ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                {s.label}
                {!s.required && !sectionComplete(s) && <span className="opacity-50">(opt)</span>}
              </div>
            ))}
          </div>
        )}

        {/* Restart banner */}
        {needsRestart && (
          <div className="mb-8 flex items-start gap-3 px-5 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
            <RefreshCw size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold">Restart required to apply changes</p>
              <p className="text-xs opacity-70 mt-0.5">Stop and restart the workflow so the new values are loaded by the server.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 flex items-start gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {SECTIONS.map(section => {
            const Icon = section.icon;
            const complete = sectionComplete(section);
            const isSaved = savedSection === section.id;
            const hasInput = section.fields.some(f => values[f.key]?.trim());

            return (
              <div
                key={section.id}
                className={`glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                  complete ? "border-green-500/20" : `border-card-border`
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBgMap[section.color]}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">{section.label}</h3>
                        {section.required ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">Required</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/30 text-[10px] font-bold uppercase tracking-wider border border-card-border">Optional</span>
                        )}
                        {complete && <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold"><CheckCircle size={11} /> Configured</span>}
                      </div>
                      <p className="text-foreground/40 text-sm">{section.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.fields.map(field => {
                    const isSet = status?.[field.key as keyof EnvStatus];
                    const show = visible[field.key];
                    return (
                      <div key={field.key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] md:text-xs font-bold text-foreground/40 uppercase tracking-widest">{field.label}</label>
                          {isSet && !values[field.key] && (
                            <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                              <CheckCircle size={11} /> Set
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type={field.sensitive && !show ? "password" : "text"}
                            value={values[field.key] || ""}
                            onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                            placeholder={isSet ? "••••••  (already set — leave blank to keep)" : field.placeholder}
                            className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3.5 px-4 pr-12 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-mono placeholder:font-sans placeholder:text-foreground/25"
                          />
                          {field.sensitive && (
                            <button
                              type="button"
                              onClick={() => setVisible({ ...visible, [field.key]: !show })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
                            >
                              {show ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-foreground/25 mt-1.5 ml-0.5">{field.hint}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSave(section.fields, section.id)}
                    disabled={saving || !hasInput}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      isSaved
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                    }`}
                  >
                    {saving ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : isSaved ? (
                      <CheckCircle size={15} />
                    ) : (
                      <Save size={15} />
                    )}
                    {isSaved ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-foreground/[0.02] border border-card-border">
          <p className="text-xs text-foreground/30 font-medium leading-relaxed">
            Values are written to <span className="font-mono text-foreground/50">.env.local</span> in the project root.
            Sensitive values are not displayed after saving. Restart the workflow after making changes for them to take effect.
          </p>
        </div>
      </div>
    </div>
  );
}
