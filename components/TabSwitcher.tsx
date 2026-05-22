import React from 'react';
import { LayoutDashboard, LayoutGrid, MessageSquare, Users, Newspaper, Shield, CreditCard } from 'lucide-react';

interface TabSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

const tabs = [
  { id: 'overview',   label: 'Overview',      icon: LayoutDashboard },
  { id: 'playground', label: 'Playground',    icon: LayoutGrid },
  { id: 'comms',      label: 'Comms',         icon: MessageSquare, badge: true },
  { id: 'community',  label: 'Community',     icon: Users },
  { id: 'news',       label: 'News',          icon: Newspaper },
  { id: 'billing',    label: 'Plans',         icon: CreditCard },
  { id: 'security',   label: 'Security & Pro',icon: Shield },
];

export default function TabSwitcher({ activeTab, setActiveTab, unreadCount = 0 }: TabSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-6 justify-center md:justify-start">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const showBadge = tab.badge && unreadCount > 0;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              isActive
                ? tab.id === 'security'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : tab.id === 'billing'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                  : tab.id === 'overview'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-400 text-white border-brand-400 shadow-md shadow-brand-500/20'
                  : 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/10'
                : 'bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10'
            }`}
          >
            <Icon size={15} className={isActive ? 'text-white' : 'text-foreground/60'} />
            {tab.label}
            {showBadge && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
