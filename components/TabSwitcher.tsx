import {
  LayoutDashboard,
  LayoutGrid,
  MessageSquare,
  Users,
  Newspaper,
  Shield,
  CreditCard,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TabSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
  notifCount?: number;
}

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "notif" as const },
  { id: "playground", label: "Playground", icon: LayoutGrid },
  { id: "comms", label: "Comms", icon: MessageSquare, badge: "unread" as const },
  { id: "community", label: "Community", icon: Users },
  { id: "news", label: "News", icon: Newspaper },
  { id: "billing", label: "Plans", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export default function TabSwitcher({
  activeTab,
  setActiveTab,
  unreadCount = 0,
  notifCount = 0,
}: TabSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl glass-panel border border-card-border mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badgeCount =
          tab.badge === "unread" ? unreadCount : tab.badge === "notif" ? notifCount : 0;
        const showBadge = badgeCount > 0 && !isActive;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            )}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>

            {showBadge && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                {badgeCount > 9 ? "9+" : badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
