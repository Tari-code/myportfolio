"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          window.location.href = "/customer/login";
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminName(data.user.name);
        } else {
          window.location.href = "/customer/login";
        }
      } catch (error) {
        console.error("Failed to fetch session", error);
        window.location.href = "/customer/login";
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/customer/login";
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/messages", label: "Messages" },
    { href: "/admin/direct-messages", label: "Direct Messages" },
    { href: "/admin/portfolio", label: "Portfolio" },
    { href: "/admin/news", label: "News" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/setup", label: "Setup" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-card-border px-6 py-4 flex items-center justify-between">
        <div className="font-display font-bold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center">
            <span className="text-white text-[10px]">H</span>
          </div>
          Admin
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-lg bg-foreground/5 border border-card-border flex items-center justify-center text-foreground"
          >
            {isMobileMenuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-0 z-[50] md:static md:translate-x-0 transition-transform duration-300 ease-in-out
        w-full md:w-64 border-r border-card-border bg-background p-6 flex flex-col gap-8
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex flex-col gap-4 mb-4">
          <div className="font-display text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span className="text-white text-xs">H</span>
            </div>
            Admin Panel
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl font-bold transition-all border ${
                pathname === link.href 
                  ? 'bg-brand-500/10 text-brand-500 border-brand-500/20 shadow-lg shadow-brand-500/5' 
                  : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground border-transparent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto flex flex-col gap-4">
          <Link href="/" className="text-sm text-foreground/40 hover:text-brand-500 transition-colors flex items-center gap-2 ml-4 font-bold">
            ← Back to Site
          </Link>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/10 font-bold group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>
      
      {/* Admin Content */}
      <main className="flex-1 min-w-0 bg-foreground/[0.02]">
        {/* Static Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-card-border px-6 md:px-12 py-5 flex items-center justify-between hidden md:flex">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">Welcome back, {adminName}</h2>
            <p className="text-sm text-foreground/40 font-medium">Authorized System Administrator</p>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
              {adminName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-10 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="glass-panel p-8 rounded-[2.5rem] border border-card-border max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-foreground mb-2">Confirm Logout</h3>
            <p className="text-foreground/60 mb-8 font-medium">Are you sure you want to end your administrative session?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-foreground/5 border border-card-border text-foreground font-bold hover:bg-foreground/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
