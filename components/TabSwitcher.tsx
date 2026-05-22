import React from 'react';
import { LayoutGrid, MessageSquare, Users, Newspaper } from 'lucide-react';

interface TabSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'playground', label: 'Playground', icon: LayoutGrid },
  { id: 'comms', label: 'Comms', icon: MessageSquare },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'news', label: 'News', icon: Newspaper },
];

export default function TabSwitcher({ activeTab, setActiveTab }: TabSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              isActive
                ? 'bg-brand-500 text-white border-brand-400 shadow-md shadow-brand-500/10'
                : 'bg-foreground/5 text-foreground/60 border-transparent hover:bg-foreground/10'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-white' : 'text-foreground/60'} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
