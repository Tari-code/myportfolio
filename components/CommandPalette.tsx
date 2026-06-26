"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  LayoutGrid,
  Settings,
  Newspaper,
  FolderKanban,
  Users,
  HelpCircle,
  Command,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  group: string;
}

const NAV_ITEMS: CommandItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home, group: "Navigation" },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban, group: "Navigation" },
  { id: "services", label: "Services", href: "/services", icon: LayoutGrid, group: "Navigation" },
  { id: "news", label: "News", href: "/news", icon: Newspaper, group: "Navigation" },
  { id: "about", label: "About", href: "/about", icon: Users, group: "Navigation" },
  { id: "faq", label: "FAQ", href: "/faq", icon: HelpCircle, group: "Navigation" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutGrid, group: "Account" },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings, group: "Account" },
];

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useKeyboardShortcut("k", toggle);

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandPaletteDialog open={open} setOpen={setOpen} />
    </CommandPaletteContext.Provider>
  );
}

function CommandPaletteDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return NAV_ITEMS;
    return NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        router.push(filtered[activeIndex].href);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, activeIndex, router, setOpen]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.group) || [];
      list.push(item);
      map.set(item.group, list);
    });
    return map;
  }, [filtered]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md animate-fade-in"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl glass-panel rounded-2xl border border-card-border shadow-2xl overflow-hidden animate-scale-in"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-card-border">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-foreground/5 border border-card-border text-[10px] font-medium text-muted-foreground">
            <Command size={10} />K
          </kbd>
        </div>

        <div className="max-h-[min(50vh,400px)] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            Array.from(groups.entries()).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {group}
                </p>
                {items.map((item) => {
                  flatIndex += 1;
                  const idx = flatIndex;
                  const Icon = item.icon;
                  const isActive = idx === activeIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push(item.href);
                        setOpen(false);
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                        isActive
                          ? "bg-brand-500/10 text-brand-500"
                          : "text-foreground hover:bg-foreground/5"
                      )}
                    >
                      <Icon size={16} className="shrink-0 opacity-70" />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <ArrowRight
                        size={14}
                        className={cn(
                          "opacity-0 transition-opacity",
                          isActive && "opacity-60"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPaletteProvider;
