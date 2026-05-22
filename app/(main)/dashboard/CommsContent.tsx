import React, { useState, useEffect } from 'react';
import DirectDMs from '@/components/DirectDMs';
import SupportTickets from '@/components/SupportTickets';
import { MessageSquare, Shield, Zap } from 'lucide-react';

interface CommsContentProps {
  subCommsTab: string;
  setSubCommsTab: (tab: string) => void;
  dmConversations: any[];
  activeDMUser: any | null;
  setActiveDMUser: (user: any | null) => void;
  dmMessages: any[];
  dmInput: string;
  setDmInput: (val: string) => void;
  dmSending: boolean;
  dmLoading: boolean;
  handleSendDM: (e: React.FormEvent) => void;
  tickets: any[];
  activeTicket: any | null;
  setActiveTicket: (ticket: any | null) => void;
  replyText: string;
  setReplyText: (val: string) => void;
  sendingReply: boolean;
  handleSendUserReply: (e: React.FormEvent) => void;
  currentUserEmail?: string;
  currentUser?: any;
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
  currentUserEmail,
  currentUser,
}: CommsContentProps) {
  const [activeTab, setActiveTab] = useState(subCommsTab);

  useEffect(() => { setActiveTab(subCommsTab); }, [subCommsTab]);

  const handleTabChange = (tab: string) => {
    setSubCommsTab(tab);
    setActiveTab(tab);
  };

  const unreadDMs = dmConversations.filter((c: any) => c.unread).length;
  const unreadTickets = tickets.filter((t: any) => {
    if (!currentUserEmail) return false;
    const hasAdminReply = (t.replies || []).some((r: any) => r.sender === "admin");
    const userRead = (t.readBy || []).includes(currentUserEmail);
    return hasAdminReply && !userRead;
  }).length;

  return (
    <section className="mb-12 relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.03),transparent_70%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.02),transparent_70%)] pointer-events-none" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-[1.5rem] bg-gradient-to-br from-brand-500/10 to-purple-500/10 flex items-center justify-center text-brand-500">
          <MessageSquare size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Neural Communications</h3>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">Real-time secure channels</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-5 bg-foreground/[0.03] rounded-2xl p-1 border border-card-border">
        <button
          onClick={() => handleTabChange('dm')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all relative ${
            activeTab === 'dm'
              ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/20'
              : 'text-foreground/50 hover:text-foreground/80'
          }`}
        >
          <Zap size={15} className={activeTab === 'dm' ? 'text-white' : 'text-brand-500'} />
          <span className="text-xs font-bold">Direct Messages</span>
          {unreadDMs > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">{unreadDMs}</span>
          )}
        </button>
        <button
          onClick={() => handleTabChange('support')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all relative ${
            activeTab === 'support'
              ? 'bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg shadow-brand-500/20'
              : 'text-foreground/50 hover:text-foreground/80'
          }`}
        >
          <Shield size={15} className={activeTab === 'support' ? 'text-white' : 'text-brand-500'} />
          <span className="text-xs font-bold">Support Tickets</span>
          {unreadTickets > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-black text-white">{unreadTickets}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            currentUser={currentUser}
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
            currentUserEmail={currentUserEmail}
          />
        )}
      </div>
    </section>
  );
}
