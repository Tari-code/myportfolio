import React from 'react';
import { LayoutDashboard, LayoutGrid, MessageSquare, Users, Newspaper, Shield, CreditCard, Bell, UserCircle } from 'lucide-react';

interface TabSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
  notifCount?: number;
}

const tabs = [
  { id: 'overview',       label: 'Overview',       icon: LayoutDashboard },
  { id: 'profile',        label: 'My Profile',     icon: UserCircle },
  { id: 'notifications',  label: 'Notifications',  icon: Bell, badge: 'notif' },
  { id: 'playground',     label: 'Playground',     icon: LayoutGrid },
  { id: 'comms',          label: 'Comms',          icon: MessageSquare, badge: 'unread' },
  { id: 'community',      label: 'Community',      icon: Users },
  { id: 'news',           label: 'News',           icon: Newspaper },
  { id: 'billing',        label: 'Plans',          icon: CreditCard },
  { id: 'security',       label: 'Security & Pro', icon: Shield },
];

export default function TabSwitcher({ activeTab, setActiveTab, unreadCount = 0, notifCount = 0 }: TabSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badgeCount = tab.badge === 'unread' ? unreadCount : tab.badge === 'notif' ? notifCount : 0;
        const showBadge = badgeCount > 0 && !isActive;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              isActive
                ? tab.id === 'security'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : tab.id === 'billing'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                  : tab.id === 'notifications'
                  ? 'bg-gradient-to-r from-brand-600 to-purple-500 text-white border-brand-400 shadow-md shadow-brand-500/20'
                  : tab.id === 'overview'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-400 text-white border-brand-400 shadow-md shadow-brand-500/20'
                  : 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/10'
                : showBadge
                  ? 'bg-foreground/5 text-foreground/80 border-red-500/30 hover:bg-foreground/10'
                  : 'bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-white' : showBadge ? 'text-foreground/80' : 'text-foreground/60'} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.id === 'notifications' ? 'Notifs' : tab.id === 'security' ? 'Security' : tab.label}</span>

            {/* Pulsing badge */}
            {showBadge && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                {/* Outer pulse ring */}
                <span className="absolute w-4 h-4 rounded-full bg-red-500/40 animate-ping" />
                {/* Inner solid badge */}
                <span className="relative w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg shadow-red-500/50">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
