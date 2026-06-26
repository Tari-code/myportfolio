"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  UserCircle,
  Settings,
  LogOut,
  LayoutGrid,
  Shield,
  Search,
  Command,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setOpen: openCommandPalette } = useCommandPalette();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        /* unauthenticated */
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
      href: "/services",
      label: "Services",
      dropdown: [
        { href: "/services/ui-ux", label: "UI/UX Design", desc: "Design systems & interfaces" },
        { href: "/services/web-dev", label: "Web Development", desc: "High-performance apps" },
        { href: "/services/ai", label: "AI Systems", desc: "Intelligent automation" },
        { href: "/services/cloud", label: "Cloud Infrastructure", desc: "Scalable architecture" },
      ],
    },
    { href: "/projects", label: "Projects" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-[100] transition-all duration-300",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl transition-all duration-300",
            isScrolled
              ? "glass-panel px-4 md:px-6 py-2 shadow-card"
              : "px-2 py-1"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105">
              <span className="font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-base md:text-lg tracking-tight text-foreground">
              Tari Tech
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group px-1 py-2">
                <Link
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1",
                    isActive(link.href)
                      ? "text-brand-500 bg-brand-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      size={14}
                      className="opacity-60 group-hover:rotate-180 transition-transform duration-200"
                    />
                  )}
                </Link>

                {link.dropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="w-60 p-2 rounded-xl glass-panel shadow-card">
                      {link.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex flex-col p-3 rounded-lg hover:bg-foreground/5 transition-colors group/sub"
                        >
                          <span className="text-sm font-medium text-foreground group-hover/sub:text-brand-500">
                            {sub.label}
                          </span>
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {sub.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => openCommandPalette(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent hover:border-card-border transition-all focus-ring"
              aria-label="Open command palette"
            >
              <Search size={15} />
              <span className="hidden xl:inline">Search</span>
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-foreground/5 border border-card-border text-[10px] font-medium">
                <Command size={10} />K
              </kbd>
            </button>

            <ThemeToggle />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-card-border transition-colors focus-ring"
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium pr-1 max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "hidden sm:block transition-transform text-muted-foreground",
                      isUserDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 p-2 rounded-xl glass-panel shadow-card animate-scale-in border border-card-border">
                    <div className="px-3 py-2 border-b border-card-border mb-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>

                    {[
                      { href: user.role === "admin" ? "/admin" : "/dashboard", icon: LayoutGrid, label: "Dashboard" },
                      { href: "/dashboard?tab=profile", icon: UserCircle, label: "Profile" },
                      { href: "/settings", icon: Settings, label: "Settings" },
                      ...(user.role === "admin"
                        ? [{ href: "/admin/login", icon: Shield, label: "Admin Console" }]
                        : []),
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-brand-500/10 hover:text-brand-500 transition-colors text-sm font-medium"
                      >
                        <item.icon size={16} className="opacity-60" />
                        {item.label}
                      </Link>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors text-sm font-medium mt-1"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/customer/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/customer/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-foreground/5 flex flex-col items-center justify-center gap-1.5 hover:bg-foreground/10 transition-colors focus-ring"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span
                className={cn(
                  "w-5 h-0.5 bg-foreground transition-all duration-200",
                  isMobileMenuOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-foreground transition-all duration-200",
                  isMobileMenuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "w-5 h-0.5 bg-foreground transition-all duration-200",
                  isMobileMenuOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-[90] transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 w-[min(85%,320px)] h-full glass-panel border-l border-card-border p-6 flex flex-col transition-transform duration-300 ease-expo",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col gap-1 flex-1 overflow-y-auto pt-4">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => !link.dropdown && setIsMobileMenuOpen(false)}
                  className="block py-3 text-lg font-semibold text-foreground"
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="pl-3 border-l-2 border-brand-500/20 space-y-2 mb-2">
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-1.5 text-sm text-muted-foreground"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-card-border space-y-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCommandPalette(true);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-foreground/5 text-sm font-medium"
            >
              <Search size={16} /> Search <Command size={12} className="ml-auto opacity-50" />
            </button>
            {!user && (
              <>
                <Link href="/customer/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Sign in
                  </Button>
                </Link>
                <Link href="/customer/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button fullWidth>Get started</Button>
                </Link>
              </>
            )}
            {user && (
              <Button variant="danger" fullWidth onClick={handleLogout}>
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
