"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, User, Settings, LogOut, LayoutGrid, Shield } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        // Only log if it's a real network error, not a 401
      }
    };
    fetchUser();

    window.addEventListener("user-updated", fetchUser);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("user-updated", fetchUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setIsUserDropdownOpen(false);
      router.push("/customer/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "/services", label: "Services", dropdown: [
        { href: "/services/ui-ux", label: "UI/UX Design", desc: "Crafting stunning interfaces" },
        { href: "/services/web-dev", label: "Web Dev", desc: "High-performance apps" },
        { href: "/services/ai", label: "AI Agents", desc: "Intelligent automation" },
        { href: "/services/cloud", label: "Cloud Infra", desc: "Scalable architecture" },
      ]
    },
    { href: "/projects", label: "Projects" },
    {
      href: "/work", label: "Work", dropdown: [
        { href: "/work/case-studies", label: "Case Studies", desc: "In-depth project reviews" },
        { href: "/work/open-source", label: "Open Source", desc: "Community contributions" },
      ]
    },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-4' : 'py-4 md:py-8'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className={`flex items-center justify-between p-2 rounded-2xl md:rounded-[2rem] transition-all duration-500 ${isScrolled
          ? 'bg-background/60 backdrop-blur-2xl border border-foreground/5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] px-4 md:px-8'
          : 'bg-transparent px-2 md:px-4'
          }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <span className="font-display font-bold text-lg md:text-2xl">T</span>
            </div>
            <span className="font-display font-bold text-lg md:text-2xl tracking-tighter text-foreground">Tari Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group px-1 xl:px-2 py-4">
                <Link
                  href={link.href}
                  className={`px-3 xl:px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                    }`}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                </Link>

                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="w-64 p-3 rounded-3xl glass-panel shadow-2xl bg-background/95 backdrop-blur-xl border border-card-border">
                      {link.dropdown.map((sub) => (
                        <Link key={sub.href} href={sub.href} className="flex flex-col p-3 rounded-2xl hover:bg-foreground/5 transition-all group/sub">
                          <span className="text-sm font-bold text-foreground group-hover/sub:text-brand-500 transition-colors">{sub.label}</span>
                          <span className="text-[10px] label-caps text-foreground/60 mt-0.5">{sub.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="scale-90 md:scale-100">
              <ThemeToggle />
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 md:p-1.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all border border-card-border"
                >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                  <span className="hidden sm:block text-sm font-bold pr-2">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`hidden sm:block transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 p-3 rounded-[2rem] glass-panel shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-card-border">
                    <div className="px-4 py-3 border-b border-card-border mb-2">
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      href={user.role === 'admin' ? '/admin' : '/dashboard'} 
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-500/10 hover:text-brand-500 transition-all group"
                    >
                      <LayoutGrid size={18} className="text-foreground/40 group-hover:text-brand-500" />
                      <span className="text-sm font-bold">Dashboard</span>
                    </Link>

                    <Link 
                      href="/settings" 
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-500/10 hover:text-brand-500 transition-all group"
                    >
                      <Settings size={18} className="text-foreground/40 group-hover:text-brand-500" />
                      <span className="text-sm font-bold">Settings</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link 
                        href="/admin/login" 
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-500/10 hover:text-brand-500 transition-all group"
                      >
                        <Shield size={18} className="text-foreground/40 group-hover:text-brand-500" />
                        <span className="text-sm font-bold">Admin Console</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-500/10 text-red-500/80 hover:text-red-500 transition-all group mt-2"
                    >
                      <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-bold">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/customer/login"
                  className="hidden md:block px-4 py-2 rounded-xl text-sm font-bold text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/customer/signup"
                  className="hidden sm:flex px-4 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-2xl bg-foreground text-background font-bold text-xs md:text-sm hover:scale-105 transition-all active:scale-95 shadow-xl shadow-foreground/10 border border-card-border"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-foreground/5 flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-foreground/10"
              aria-label="Toggle Menu"
            >
              <div className={`w-5 md:w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 md:w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 md:w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[-1] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 w-[85%] sm:w-[70%] h-full bg-background border-l border-card-border p-8 md:p-12 flex flex-col gap-6 md:gap-8 transition-transform duration-500 ease-expo ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col gap-4 md:gap-6 pt-12 overflow-y-auto">
            {user && (
              <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-foreground/5 border border-card-border mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">{user.name}</span>
                  <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">{user.role}</span>
                </div>
              </div>
            )}
            {navLinks.map((link) => (
              <div key={link.label} className="flex flex-col gap-2">
                <Link
                  href={link.href}
                  onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                  className="text-2xl md:text-3xl font-display font-bold text-foreground"
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="flex flex-col gap-3 md:gap-4 pl-4 border-l border-brand-500/20 py-1">
                    {link.dropdown.map((sub) => (
                      <Link key={sub.href} href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="text-base md:text-lg text-foreground/80 font-medium">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            {user ? (
              <button onClick={handleLogout} className="w-full py-4 md:py-5 rounded-2xl bg-red-500 text-white text-center font-bold text-lg md:text-xl shadow-xl shadow-red-500/20">
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/customer/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 md:py-5 rounded-2xl border border-card-border text-foreground text-center font-bold text-lg md:text-xl">
                  Sign In
                </Link>
                <Link href="/customer/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 md:py-5 rounded-2xl bg-foreground text-background text-center font-bold text-lg md:text-xl shadow-xl shadow-foreground/5">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

