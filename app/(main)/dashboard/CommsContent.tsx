import React, { useState, useEffect } from 'react';
import DirectDMs from '@/components/DirectDMs';
import SupportTickets from '@/components/SupportTickets';
import { MessageSquare, Shield, Zap, Users, Activity, Mail } from 'lucide-react';

interface CommsContentProps {
  subCommsTab: string;
  setSubCommsTab: (tab: string) => void;
  // Direct Messages props
  dmConversations: any[];
  activeDMUser: any | null;
  setActiveDMUser: (user: any | null) => void;
  dmMessages: any[];
  dmInput: string;
  setDmInput: (val: string) => void;
  dmSending: boolean;
  dmLoading: boolean;
  handleSendDM: (e: React.FormEvent) => void;
  // Support tickets props
  tickets: any[];
  activeTicket: any | null;
  setActiveTicket: (ticket: any | null) => void;
  replyText: string;
  setReplyText: (val: string) => void;
  sendingReply: boolean;
  handleSendUserReply: (e: React.FormEvent) => void;
}

export default function CommsContent({
  subCommsTab,
  setSubCommsTab,
  dmConversations,
  activeDMUser,
  setActiveDMUser,
  dmMessages,
  dmInput,
  setDmInput,
  dmSending,
  dmLoading,
  handleSendDM,
  tickets,
  activeTicket,
  setActiveTicket,
  replyText,
  setReplyText,
  sendingReply,
  handleSendUserReply,
}: CommsContentProps) {
  // Enhanced state for next-gen features
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeTab, setActiveTab] = useState(subCommsTab); // Sync with prop but allow local state for transitions
  const [isExpanding, setIsExpanding] = useState(false);
  const [quickStats, setQuickStats] = useState({
    unreadMessages: 0,
    pendingTickets: 0,
    activeConversations: 0
  });

  // Calculate quick stats
  useEffect(() => {
    const unreadMsgs = dmConversations.filter((conv: any) => conv.unread).length;
    const pendingTkts = tickets.filter((t: any) => t.status === "open").length;
    const activeConvs = dmConversations.length;
    
    setQuickStats({
      unreadMessages: unreadMsgs,
      pendingTickets: pendingTkts,
      activeConversations: activeConvs
    });
    
    // Total notifications
    setNotificationCount(unreadMsgs + pendingTkts);
  }, [dmConversations, tickets]);

  // Sync tab prop with local state for smooth transitions
  useEffect(() => {
    setActiveTab(subCommsTab);
  }, [subCommsTab]);

  const handleTabChange = (tab: string) => {
    setIsExpanding(true);
    setTimeout(() => {
      setSubCommsTab(tab);
      setActiveTab(tab);
      setIsExpanding(false);
    }, 300);
  };

  return (
    <section className="glass-panel p-6 rounded-[2rem] border border-card-border mb-12 position-relative overflow-hidden">
      {/* Neural Background Animation */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.03),transparent_70%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.02),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent animate-[pulse_2s_infinite]"></div>
      </div>

      {/* Enhanced Header with Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-card-border/50 relative">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-[2rem] bg-gradient-to-br from-brand-500/10 to-purple-500/10 flex items-center justify-center text-brand-500">
            <MessageSquare size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Neural Communications Hub</h3>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
              Real-time secure channels for team collaboration
            </p>
          </div>
        </div>
        
        {/* Quick Stats Dashboard */}
        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[1.5rem] bg-foreground/[0.03] border border-card-border">
            <Activity size={16} className="text-brand-500" />
            <span className="text-[9px] font-bold text-foreground/60">{quickStats.activeConversations}</span>
            <span className="text-xs text-foreground/30">Active Chats</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-[1.5rem] bg-foreground/[0.03] border border-card-border">
            <MessageSquare size={16} className="text-brand-500" />
            <span className="text-[9px] font-bold text-foreground/60">{notificationCount}</span>
            <span className="text-xs text-foreground/30">Notifications</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-[1.5rem] bg-foreground/[0.03] border border-card-border">
            <Shield size={16} className="text-brand-500" />
            <span className="text-[9px] font-bold text-foreground/60">{quickStats.pendingTickets}</span>
            <span className="text-xs text-foreground/30">Priority Tickets</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleTabChange('dm')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[2rem] transition-all ${
            activeTab === 'dm' 
              ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/20 hover:scale-[1.02]'
              : 'bg-foreground/[0.02] border border-card-border text-foreground/60 hover:bg-foreground/[0.05] hover:border-foreground/[0.1]'
          }`}
        >
           <div className="flex items-center gap-2">
             <Zap size={18} className={activeTab === 'dm' ? 'text-white' : 'text-brand-500'} />
             <span className="text-[10px] font-bold">{activeTab === 'dm' ? 'Direct Neural Link' : 'Direct Messages'}</span>
           </div>
        </button>
        <button
          onClick={() => handleTabChange('support')}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[2rem] transition-all ${
            activeTab === 'support' 
              ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/20 hover:scale-[1.02]'
              : 'bg-foreground/[0.02] border border-card-border text-foreground/60 hover:bg-foreground/[0.05] hover:border-foreground/[0.1]'
          }`}
        >
           <div className="flex items-center gap-2">
             <Shield size={18} className={activeTab === 'support' ? 'text-white' : 'text-brand-500'} />
             <span className="text-[10px] font-bold">{activeTab === 'support' ? 'Secure Support Grid' : 'Support Tickets'}</span>
           </div>
        </button>
      </div>

      {/* Animated Tab Content */}
      <div className={`animate-in fade-in slide-in-from-bottom-2 ${isExpanding ? 'animate-scale' : ''} duration-500`}>
        {activeTab === 'dm' ? (
          <DirectDMs
            conversations={dmConversations}
            activeUser={activeDMUser}
            setActiveUser={setActiveDMUser}
            messages={dmMessages}
            input={dmInput}
            setInput={setDmInput}
            loading={dmLoading}
            sending={dmSending}
            onSend={handleSendDM}
          />
        ) : (
          <SupportTickets
            tickets={tickets}
            activeTicket={activeTicket}
            setActiveTicket={setActiveTicket}
            replyText={replyText}
            setReplyText={setReplyText}
            sending={sendingReply}
            onSendReply={handleSendUserReply}
          />
        )}
      </div>

      {/* Floating Action Button for Quick Actions */}
      <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3">
        <button
          onClick={() => {
            // Quick compose new message
            if (dmConversations.length > 0) {
              setActiveDMUser(dmConversations[0].user);
              setSubCommsTab('dm');
              setActiveTab('dm');
            }
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white shadow-2xl shadow-brand-500/30 hover:scale-110 transition-all duration-300"
        >
          <MessageSquare size={20} className="ml-1" />
        </button>
        
        <button
          onClick={() => {
            // Quick create support ticket
            setSubCommsTab('support');
            setActiveTab('support');
          }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white shadow-2xl shadow-brand-500/30 hover:scale-110 transition-all duration-300"
        >
          <Shield size={20} className="ml-1" />
        </button>
      </div>
    </section>
  );
}