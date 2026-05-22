"use client";

import { useState, useEffect } from "react";
import { Database, Shield, Mail, Bell, CheckCircle, ChevronRight, ChevronLeft, Loader2, AlertCircle, Eye, EyeOff, RefreshCw } from "lucide-react";

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

const STEPS = [
  {
    id: "database",
    label: "Database",
    icon: Database,
    color: "brand",
    required: true,
    description: "Connect your MongoDB database to store all app data.",
    fields: [
      { key: "MONGODB_URI", label: "MongoDB Connection String", placeholder: "mongodb+srv://user:password@cluster.mongodb.net/dbname", sensitive: true, hint: "Get this from MongoDB Atlas → Connect → Drivers" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    color: "purple",
    required: true,
    description: "A secret key used to sign and verify user sessions.",
    fields: [
      { key: "JWT_SECRET", label: "JWT Secret Key", placeholder: "A long random string (min 32 chars)", sensitive: true, hint: "Use any long random string, e.g. from a password generator" },
    ],
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    color: "blue",
    required: false,
    description: "Optional — enables password reset and notification emails.",
    fields: [
      { key: "EMAIL_USER", label: "Gmail Address", placeholder: "yourapp@gmail.com", sensitive: false, hint: "A Gmail account to send emails from" },
      { key: "EMAIL_PASS", label: "Gmail App Password", placeholder: "xxxx xxxx xxxx xxxx", sensitive: true, hint: "Generate from Google Account → Security → App Passwords" },
      { key: "NEXT_PUBLIC_BASE_URL", label: "Site Base URL", placeholder: "https://yoursite.replit.app", sensitive: false, hint: "The public URL of your deployed site" },
    ],
  },
  {
    id: "push",
    label: "Push Notifications",
    icon: Bell,
    color: "green",
    required: false,
    description: "Optional — enables browser push notifications for users.",
    fields: [
      { key: "VAPID_PUBLIC_KEY", label: "VAPID Public Key", placeholder: "BO...", sensitive: false, hint: 'Generate with: npx web-push generate-vapid-keys' },
      { key: "VAPID_PRIVATE_KEY", label: "VAPID Private Key", placeholder: "...", sensitive: true, hint: 'Generate with: npx web-push generate-vapid-keys' },
      { key: "VAPID_EMAIL", label: "VAPID Contact Email", placeholder: "mailto:admin@yoursite.com", sensitive: false, hint: 'Must start with mailto:' },
    ],
  },
];

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<EnvStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [needsRestart, setNeedsRestart] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/setup/status");
      const data = await res.json();
      setStatus(data.vars);
    } catch {
      setStatus(null);
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/setup/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setNeedsRestart(true);
        await checkStatus();
      } else {
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const currentStep = STEPS[step];
  const colorMap: Record<string, string> = {
    brand: "brand-500",
    purple: "purple-500",
    blue: "blue-500",
    green: "green-500",
  };
  const bgMap: Record<string, string> = {
    brand: "bg-brand-500/10 text-brand-500 border-brand-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  const isStepComplete = (s: typeof STEPS[0]) => {
    return s.fields.every(f => status?.[f.key as keyof EnvStatus] || values[f.key]?.trim());
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-widest mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Initial Setup
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Configure Your App</h1>
          <p className="text-foreground/50 text-sm md:text-base">Set the required environment variables to get your portfolio running.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const complete = isStepComplete(s);
            const active = i === step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  active
                    ? `bg-${colorMap[s.color]}/10 text-${colorMap[s.color]} border-${colorMap[s.color]}/30`
                    : complete
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-foreground/5 text-foreground/30 border-transparent hover:text-foreground/60"
                }`}
              >
                {complete ? <CheckCircle size={14} /> : <Icon size={14} />}
                <span className="hidden sm:inline">{s.label}</span>
                {!s.required && <span className="hidden sm:inline text-[10px] opacity-60">(opt)</span>}
              </button>
            );
          })}
        </div>

        {/* Main card */}
        <div className="bg-foreground/[0.03] border border-card-border rounded-2xl md:rounded-3xl p-6 md:p-10 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${bgMap[currentStep.color]}`}>
              <currentStep.icon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{currentStep.label}</h2>
                {!currentStep.required && (
                  <span className="px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/40 text-[10px] font-bold uppercase tracking-wider border border-card-border">
                    Optional
                  </span>
                )}
                {currentStep.required && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                    Required
                  </span>
                )}
              </div>
              <p className="text-foreground/50 text-sm mt-0.5">{currentStep.description}</p>
            </div>
          </div>

          <div className="space-y-5">
            {currentStep.fields.map(field => {
              const isSet = status?.[field.key as keyof EnvStatus];
              const show = visible[field.key];
              return (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{field.label}</label>
                    {isSet && !values[field.key] && (
                      <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                        <CheckCircle size={11} /> Already configured
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={field.sensitive && !show ? "password" : "text"}
                      value={values[field.key] || ""}
                      onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={isSet ? "••••••••  (already set — leave blank to keep)" : field.placeholder}
                      className="w-full bg-background border border-card-border rounded-xl py-3.5 px-4 pr-12 text-foreground text-sm focus:outline-none focus:border-brand-500/50 transition-all font-mono placeholder:font-sans placeholder:text-foreground/25"
                    />
                    {field.sensitive && (
                      <button
                        type="button"
                        onClick={() => setVisible({ ...visible, [field.key]: !show })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
                      >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-foreground/30 mt-1.5 ml-1">{field.hint}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Restart notice */}
        {needsRestart && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500">
            <RefreshCw size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold">Restart required</p>
              <p className="text-xs opacity-80 mt-0.5">The app needs to restart to pick up the new environment variables. Click the restart button in your Replit workflow panel.</p>
            </div>
          </div>
        )}

        {/* Error notice */}
        {error && (
          <div className="mb-6 flex items-start gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground/5 border border-card-border text-foreground/60 font-bold hover:text-foreground hover:bg-foreground/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Save
            </button>

            {step < STEPS.length - 1 && (
              <button
                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground/5 border border-card-border text-foreground font-bold hover:bg-foreground/10 transition-all"
              >
                Next <ChevronRight size={18} />
              </button>
            )}

            {step === STEPS.length - 1 && status?.MONGODB_URI && status?.JWT_SECRET && (
              <a
                href="/admin"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold hover:bg-green-500/20 transition-all"
              >
                Go to Admin <ChevronRight size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-center text-foreground/25 text-xs mt-8">
          You can revisit this page at any time via <span className="font-mono text-foreground/40">/setup</span> or from Admin → Setup
        </p>
      </div>
    </div>
  );
}
