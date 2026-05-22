"use client";

import { useEffect, useRef, useState } from "react";
import { User, Settings, LayoutGrid, Clock, CheckCircle2, ArrowRight, Plus, MessageSquare, Newspaper, Zap, Globe, Shield, X, Loader2, FileText, TrendingUp, Activity, Star, Sliders, DollarSign, Send, Check, Cpu, Server, Database, HardDrive, RefreshCw, AlertTriangle, KeyRound, Users, UserCheck, UserPlus, UserMinus, ArrowLeft, Info, ChevronRight } from "lucide-react";
import TabSwitcher from "@/components/TabSwitcher";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Sub-components for tabs
import PushPermission from "@/components/PushPermission";
import PlaygroundContent from "./PlaygroundContent";
import CommsContent from "./CommsContent";
import CommunityContent from "./CommunityContent";
import NewsContent from "./NewsContent";
import SecurityContent from "./SecurityContent";
import OverviewContent from "./OverviewContent";
import BillingContent from "./BillingContent";
import NotificationsContent from "./NotificationsContent";

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userNews, setUserNews] = useState<any[]>([]);

  // Operations Control Config
  const [maintenanceLock, setMaintenanceLock] = useState(false);

  // News Submission Modal
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Technology",
    imageUrl: ""
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Direct Support Modal State
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportStatus, setSupportStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Testimonial Form State
  const [reviewForm, setReviewForm] = useState({
    content: "",
    role: "",
    rating: 5
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Interactive Quote Estimator State
  const [estimator, setEstimator] = useState({
    category: "web-dev",
    complexity: "professional",
    timelineWeeks: 8,
    features: {
      auth: true,
      ai: false,
      payments: true,
      analytics: false,
      seo: true
    }
  });
  const [isSubmittingEstimate, setIsSubmittingEstimate] = useState(false);
  const [estimateStatus, setEstimateStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Next-Gen Interactive Tech Stack Configurator State
  const [techStack, setTechStack] = useState({
    frontend: "nextjs", // nextjs | react | vanilla
    backend: "nodejs", // nodejs | python | go
    database: "mongodb", // mongodb | postgresql | redis
    caching: true,
    cdn: true
  });
  const [telemetrySyncing, setTelemetrySyncing] = useState(false);

  // Verification OTP state
  const [verificationOtp, setVerificationOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Messages & Tickets support state
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Notifications badge count
  const [notifCount, setNotifCount] = useState(0);

  // Next-Gen social & community messaging hub states
  const [activeTab, setActiveTab] = useState("overview");
  const [subCommsTab, setSubCommsTab] = useState("dm");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [dmConversations, setDmConversations] = useState<any[]>([]);
  const [activeDMUser, setActiveDMUser] = useState<any | null>(null);
  const [dmMessages, setDmMessages] = useState<any[]>([]);
  const [dmInput, setDmInput] = useState("");
  const [dmSending, setDmSending] = useState(false);
  const [dmLoading, setDmLoading] = useState(false);
  const [communitySearch, setCommunitySearch] = useState("");
  const [viewingProfile, setViewingProfile] = useState<any | null>(null);
  const dmEndRef = useRef<HTMLDivElement>(null);

  // Helper: ticket is unread when there are admin replies the user hasn't seen
  const isTicketUnread = (ticket: any) => {
    if (!ticket || !user?.email) return false;
    const hasAdminReply = (ticket.replies || []).some((r: any) => r.sender === "admin");
    const userRead = (ticket.readBy || []).includes(user.email);
    return hasAdminReply && !userRead;
  };

  // Open ticket + mark read optimistically
  const handleOpenTicket = (ticket: any) => {
    setActiveTicket(ticket);
    if (isTicketUnread(ticket) && user?.email) {
      setTickets(prev => prev.map(t =>
        t._id === ticket._id ? { ...t, readBy: [...(t.readBy || []), user.email] } : t
      ));
      fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markRead", id: ticket._id, email: user.email })
      }).catch(() => { });
    }
  };

  // Auto-scroll to latest message whenever active thread changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?._id, activeTicket?.replies?.length]);

  const fetchNotifCount = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifCount(data.unreadCount || 0);
      }
    } catch { }
  };

  useEffect(() => {
    fetchDashboardData();
    checkOperationsConfig();
    fetchNotifCount();
    const configInterval = setInterval(checkOperationsConfig, 4000);
    const notifInterval = setInterval(fetchNotifCount, 20000);
    return () => { clearInterval(configInterval); clearInterval(notifInterval); };
  }, []);

  const checkOperationsConfig = async () => {
    try {
      const res = await fetch("/api/admin/config");
      if (res.ok) {
        const config = await res.json();
        setMaintenanceLock(config.maintenanceMode ?? false);
      }
    } catch (e) { }
  };

  const fetchUserTickets = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/tickets?user=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
        if (activeTicket) {
          const updated = data.find((t: any) => t._id === activeTicket._id);
          if (updated) setActiveTicket(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  const handleVerifyEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationOtp.length !== 6 || !user) return;
    setVerifying(true);
    setVerifyStatus(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp: verificationOtp })
      });
      const data = await res.json();
      if (res.ok) {
        setVerifyStatus({ type: 'success', message: "✓ Email verified successfully!" });
        setUser({ ...user, emailVerified: true });
      } else {
        setVerifyStatus({ type: 'error', message: data.error || "Verification failed." });
      }
    } catch (err) {
      setVerifyStatus({ type: 'error', message: "Network connection error." });
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!user) return;
    setResending(true);
    setVerifyStatus(null);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (res.ok) {
        setVerifyStatus({ type: 'success', message: "✓ A new OTP has been sent to your email!" });
      } else {
        setVerifyStatus({ type: 'error', message: data.error || "Failed to resend OTP." });
      }
    } catch (err) {
      setVerifyStatus({ type: 'error', message: "Network connection error." });
    } finally {
      setResending(false);
    }
  };

  const handleSendUserReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          id: activeTicket._id,
          message: replyText,
          sender: "user"
        })
      });
      if (res.ok) {
        setReplyText("");
        await fetchUserTickets();
      }
    } catch (err) {
      console.error("Error sending user reply:", err);
    } finally {
      setSendingReply(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserTickets();
      const ticketInterval = setInterval(fetchUserTickets, 10000);
      return () => clearInterval(ticketInterval);
    }
  }, [user]);

  // Social & direct messaging polling
  useEffect(() => {
    let dmInterval: any;
    if (user && activeDMUser) {
      fetchDMs(activeDMUser._id);
      dmInterval = setInterval(() => {
        fetchDMs(activeDMUser._id);
      }, 2000);
    }
    return () => clearInterval(dmInterval);
  }, [user, activeDMUser?._id]);

  const fetchConvs = async () => {
    try {
      const res = await fetch("/api/messages?conversations=true");
      if (res.ok) {
        const data = await res.json();
        setDmConversations(data);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  useEffect(() => {
    let convInterval: any;
    if (user) {
      convInterval = setInterval(fetchConvs, 5000);
    }
    return () => clearInterval(convInterval);
  }, [user]);

  // Auto-scroll to latest DM message
  useEffect(() => {
    dmEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeDMUser?._id, dmMessages?.length]);

  const fetchDMs = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?chatWith=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDmMessages(data);
      }
    } catch (err) {
      console.error("Error fetching direct messages:", err);
    }
  };

  const handleSendDM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim() || !activeDMUser) return;
    setDmSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: activeDMUser._id, text: dmInput })
      });
      if (res.ok) {
        setDmInput("");
        await fetchDMs(activeDMUser._id);
        const convsRes = await fetch("/api/messages?conversations=true");
        if (convsRes.ok) {
          const convData = await convsRes.json();
          setDmConversations(convData);
        }
      }
    } catch (err) {
      console.error("Error sending direct message:", err);
    } finally {
      setDmSending(false);
    }
  };

  const handleFollowToggle = async (targetUserId: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "follow", targetUserId })
      });
      if (res.ok) {
        const data = await res.json();
        // Update current user's following list immediately so isFollowing is accurate
        setUser((prev: any) => prev ? { ...prev, following: data.following } : prev);
        // Refresh member list
        const usersRes = await fetch("/api/users");
        if (usersRes.ok) setAllUsers(await usersRes.json());
        // Refresh profile modal if open on this user
        if (viewingProfile && viewingProfile._id === targetUserId) {
          const singleRes = await fetch(`/api/users?id=${targetUserId}`);
          if (singleRes.ok) setViewingProfile(await singleRes.json());
        }
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch User
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const data = await userRes.json();
        setUser(data.user);
      }

      // Fetch User's News
      const newsRes = await fetch("/api/news/submit");
      if (newsRes.ok) {
        const data = await newsRes.json();
        setUserNews(data.news || []);
      }

      // Fetch All Users (Community)
      const membersRes = await fetch("/api/users");
      if (membersRes.ok) {
        const data = await membersRes.json();
        setAllUsers(data);
      }

      // Fetch DM conversations
      const convsRes = await fetch("/api/messages?conversations=true");
      if (convsRes.ok) {
        const data = await convsRes.json();
        setDmConversations(data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/news/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsForm)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: "News submitted! Waiting for admin approval." });
        setNewsForm({ title: "", summary: "", content: "", category: "Technology", imageUrl: "" });
        setTimeout(() => {
          setShowNewsModal(false);
          fetchDashboardData();
        }, 2000);
      } else {
        setStatus({ type: 'error', message: data.error || "Submission failed" });
      }
    } catch (err) {
      setStatus({ type: 'error', message: "Connection error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Support Ticket Submission Handler
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSubmittingSupport(true);
    setSupportStatus(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          user: user.name,
          email: user.email,
          message: supportMessage
        })
      });

      if (res.ok) {
        setSupportStatus({ type: 'success', message: "✓ Support ticket created successfully! Admin will reply shortly." });
        setSupportMessage("");
        fetchUserTickets();
        setTimeout(() => {
          setShowSupportModal(false);
          setSupportStatus(null);
        }, 2500);
      } else {
        const data = await res.json();
        setSupportStatus({ type: 'error', message: data.error || "Failed to create support ticket." });
      }
    } catch (err) {
      setSupportStatus({ type: 'error', message: "Network connection error." });
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  // Testimonial Submission Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.content.trim()) return;
    setIsSubmittingReview(true);
    setReviewStatus(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          role: reviewForm.role || "Partner",
          content: reviewForm.content,
          rating: reviewForm.rating
        })
      });

      if (res.ok) {
        setReviewStatus({ type: 'success', message: "✓ Testimonial submitted! Pending moderator approval." });
        setReviewForm({ content: "", role: "", rating: 5 });
        setTimeout(() => setReviewStatus(null), 4000);
      } else {
        const data = await res.json();
        setReviewStatus({ type: 'error', message: data.error || "Failed to submit testimonial." });
      }
    } catch (err) {
      setReviewStatus({ type: 'error', message: "Network connection error." });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Interactive Quote Calculator logic
  const calculateEstimate = () => {
    let basePrice = 1200;
    if (estimator.category === "mobile-app") basePrice = 1800;
    if (estimator.category === "ui-ux") basePrice = 800;
    if (estimator.category === "full-stack") basePrice = 2500;

    let multiplier = 1.0;
    if (estimator.complexity === "professional") multiplier = 2.0;
    if (estimator.complexity === "enterprise") multiplier = 4.0;

    let featuresCost = 0;
    if (estimator.features.auth) featuresCost += 300;
    if (estimator.features.ai) featuresCost += 800;
    if (estimator.features.payments) featuresCost += 400;
    if (estimator.features.analytics) featuresCost += 350;
    if (estimator.features.seo) featuresCost += 200;

    const price = (basePrice * multiplier) + featuresCost;
    return price;
  };

  // Estimate Submission Handler
  const handleEstimateDeploy = async () => {
    setIsSubmittingEstimate(true);
    setEstimateStatus(null);

    const price = calculateEstimate();
    const timeline = estimator.timelineWeeks;
    const catLabel =
      estimator.category === "web-dev" ? "Web Architecture" :
        estimator.category === "mobile-app" ? "Mobile Application" :
          estimator.category === "ui-ux" ? "UI/UX System Design" : "Full Stack Solution";

    const activeFeatures = Object.entries(estimator.features)
      .filter(([_, active]) => active)
      .map(([name]) => name.toUpperCase())
      .join(", ");

    const formattedMessage = `[AUTOMATED QUOTE SYSTEM]
Requesting: ${catLabel} (${estimator.complexity.toUpperCase()} Tier)
Timeline Target: ${timeline} Weeks
Estimated Quote: $${price}
Selected Features: ${activeFeatures || "None"}
Please get in touch to confirm specifications and begin engineering.`;

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          user: user.name,
          email: user.email,
          message: formattedMessage
        })
      });

      if (res.ok) {
        setEstimateStatus({ type: 'success', message: `✓ Project specs locked in! Ticket created. Estimated budget: $${price}.` });
        fetchUserTickets();
        setTimeout(() => setEstimateStatus(null), 5000);
      } else {
        const data = await res.json();
        setEstimateStatus({ type: 'error', message: data.error || "Failed to submit estimate ticket." });
      }
    } catch (err) {
      setEstimateStatus({ type: 'error', message: "Network connection error." });
    } finally {
      setIsSubmittingEstimate(false);
    }
  };

  // Dynamic calculations for Cybernetic Tech Stack Configurator
  const calculateStackMetrics = () => {
    let latency = 25; // in ms
    let load = 12; // in %
    let tier = "Micro Architecture";

    if (techStack.frontend === "react") { latency += 15; load += 5; }
    if (techStack.frontend === "vanilla") { latency -= 10; load -= 3; }

    if (techStack.backend === "python") { latency += 30; load += 15; tier = "Dynamic Hybrid System"; }
    if (techStack.backend === "go") { latency -= 8; load -= 5; tier = "Hyper-Speed Engine"; }
    if (techStack.backend === "nodejs") { tier = "Standard Full-Stack Web"; }

    if (techStack.database === "postgresql") { latency += 5; load += 10; }
    if (techStack.database === "redis") { latency -= 12; load -= 4; }

    if (techStack.caching) { latency = Math.round(latency * 0.4); load -= 2; }
    if (techStack.cdn) { latency = Math.round(latency * 0.85); }

    // boundary rules
    latency = Math.max(latency, 2);
    load = Math.max(load, 2);

    return { latency, load, tier };
  };

  const triggerTelemetrySync = () => {
    setTelemetrySyncing(true);
    setTimeout(() => setTelemetrySyncing(false), 1500);
  };

  const metrics = calculateStackMetrics();
  const unreadCount = tickets.filter(isTicketUnread).length;

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard.</h1>
        <Link href="/customer/login" className="text-brand-500 font-bold hover:underline">Log In</Link>
      </div>
    );
  }

  // Real-Time Maintenance Lockdown Blocker
  if (maintenanceLock) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        {/* Glowing Matrix Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="glass-panel max-w-lg w-full rounded-[3rem] p-10 md:p-14 border border-orange-500/20 text-center relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 mx-auto mb-8 animate-pulse">
            <KeyRound size={40} />
          </div>

          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-1.5 rounded-full mb-4 inline-block border border-orange-500/20">
            SYSTEM LOCKDOWN
          </span>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4 leading-tight">Operations Maintenance</h1>

          <p className="text-sm text-foreground/60 leading-relaxed font-semibold mb-8">
            The Tari Technologies Operations center has temporarily placed client dashboard systems under lock. We are upgrading database partitions and synchronizing systems.
          </p>

          <div className="p-5 rounded-2xl bg-foreground/[0.02] border border-card-border space-y-3 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-foreground/45 uppercase tracking-wider">
              <span>Maintenance Mode:</span>
              <span className="text-orange-500">ACTIVE</span>
            </div>
            <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full animate-[loading_2s_infinite]" style={{ width: "65%" }}></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-bold uppercase mt-1">
              <AlertTriangle size={12} className="text-orange-500" />
              <span>System features will unlock instantly when operations finish.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-36 pb-20 px-4 md:px-6 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-12">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-2xl shadow-brand-500/30 ring-4 ring-background overflow-hidden transition-transform duration-500 group-hover:scale-105">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center animate-pulse">
              <Zap size={14} className="text-white fill-white" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-3 tracking-tight">
              Hello, <span className="text-brand-500">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-foreground/60 text-base md:text-lg font-medium tracking-wide max-w-2xl">
              Welcome to your digital command center. Monitor your projects, configure cybernetic blueprints, and manage your account.
            </p>
          </div>
        </div>

        <PushPermission />
        <TabSwitcher activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); if (tab === "notifications") setTimeout(fetchNotifCount, 1000); }} unreadCount={unreadCount} notifCount={notifCount} />

        {/* Verification Alert */}
        {!user.emailVerified && (
          <div className="mt-8 glass-panel p-6 rounded-[2rem] border border-orange-500/20 bg-orange-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-start gap-4 z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                <AlertTriangle size={24} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-sm tracking-tight">Identity Verification Required</h4>
                <p className="text-xs text-foreground/60 leading-relaxed font-semibold max-w-xl mt-1">
                  Your email is unverified. Please input the 6-digit OTP code sent to your inbox to activate full support queues.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto z-10">
              <form onSubmit={handleVerifyEmailSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verificationOtp}
                  onChange={(e) => setVerificationOtp(e.target.value)}
                  placeholder="OTP Code"
                  className="w-full sm:w-36 bg-foreground/5 border border-card-border rounded-xl py-3 px-4 text-xs font-bold text-center tracking-[0.2em] focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:tracking-normal placeholder:font-semibold"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={verifying || verificationOtp.length !== 6}
                    className="px-5 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
                  >
                    {verifying ? <Loader2 className="animate-spin" size={14} /> : "Verify"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="px-4 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground/60 border border-card-border font-bold rounded-xl text-xs active:scale-95 transition-all shrink-0 flex items-center justify-center gap-2"
                  >
                    {resending ? <Loader2 className="animate-spin" size={14} /> : "Resend OTP"}
                  </button>
                </div>
              </form>
              {verifyStatus && (
                <div className={`p-3 rounded-xl text-[10px] font-bold flex items-center gap-2 mt-2 ${verifyStatus.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {verifyStatus.type === 'success' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span>{verifyStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Tab Content */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <OverviewContent
              user={user}
              tickets={tickets}
              userNews={userNews}
              onSwitchTab={setActiveTab}
            />
          )}
          {activeTab === "notifications" && (
            <NotificationsContent />
          )}
          {activeTab === "billing" && (
            <BillingContent
              user={user}
              onUpgradeRequest={(tier) => {
                fetchUserTickets();
              }}
            />
          )}
          {activeTab === "playground" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <PlaygroundContent
                  techStack={techStack}
                  setTechStack={setTechStack}
                  telemetrySyncing={telemetrySyncing}
                  triggerTelemetrySync={triggerTelemetrySync}
                  metrics={metrics}
                  estimator={estimator}
                  setEstimator={setEstimator}
                  calculateEstimate={calculateEstimate}
                  handleEstimateDeploy={handleEstimateDeploy}
                  isSubmittingEstimate={isSubmittingEstimate}
                  estimateStatus={estimateStatus}
                />
              </div>
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6 px-4">Command Center</h2>
                  <div className="grid gap-4">
                    <Link href="/settings" className="glass-panel p-6 rounded-[2rem] border border-card-border flex items-center justify-between hover:border-brand-500 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                          <Settings size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold">Identity Portal</h4>
                          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Update Profile</p>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-foreground/20 group-hover:text-brand-500 transition-all group-hover:translate-x-1" />
                    </Link>
                    <Link href="/services" className="glass-panel p-6 rounded-[2rem] border border-card-border flex items-center justify-between hover:border-purple-500 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <Plus size={22} />
                        </div>
                        <div>
                          <h4 className="font-bold">New Project</h4>
                          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Initiate Tech</p>
                        </div>
                      </div>
                      <ArrowRight size={20} className="text-foreground/20 group-hover:text-purple-500 transition-all group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-card-border bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-2xl shadow-brand-500/20">
                  <Shield size={40} className="mb-6 opacity-40 animate-pulse" />
                  <h3 className="text-2xl font-bold mb-2">Priority Support</h3>
                  <p className="text-white/80 text-sm font-medium mb-6 leading-relaxed">
                    As a verified member, you have access to our direct engineering support line.
                  </p>
                  <button onClick={() => setShowSupportModal(true)} className="w-full py-4 bg-white text-brand-600 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl text-xs">
                    Open Support Ticket
                  </button>
                </div>

                <section className="glass-panel p-8 rounded-[2.5rem] border border-card-border relative overflow-hidden bg-gradient-to-br from-background to-purple-500/[0.01]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Star size={20} className="fill-purple-500/25" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">Share Feedback</h3>
                      <p className="text-[9px] text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Submit client testimonial</p>
                    </div>
                  </div>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <input
                      type="text"
                      required
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      placeholder="e.g. CEO, Acme Corp"
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-purple-500 transition-all font-semibold"
                    />
                    <textarea
                      required
                      rows={3}
                      value={reviewForm.content}
                      onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                      placeholder="Describe your engineering experience..."
                      className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-3 px-4 text-xs focus:outline-none focus:border-purple-500 transition-all font-semibold resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className={`transition-all ${reviewForm.rating >= star ? 'text-yellow-500' : 'text-foreground/10'}`}>
                            <Star size={14} fill={reviewForm.rating >= star ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <button type="submit" disabled={isSubmittingReview} className="py-2 px-4 bg-purple-600 text-white rounded-xl text-[10px] font-bold">
                        {isSubmittingReview ? "..." : "Submit"}
                      </button>
                    </div>
                    {reviewStatus && <div className="text-[10px] font-bold text-brand-500 mt-2">{reviewStatus.message}</div>}
                  </form>
                </section>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "comms" && (
                <CommsContent
                  subCommsTab={subCommsTab}
                  setSubCommsTab={setSubCommsTab}
                  dmConversations={dmConversations}
                  activeDMUser={activeDMUser}
                  setActiveDMUser={setActiveDMUser}
                  dmMessages={dmMessages}
                  dmInput={dmInput}
                  setDmInput={setDmInput}
                  dmSending={dmSending}
                  dmLoading={dmLoading}
                  handleSendDM={handleSendDM}
                  tickets={tickets}
                  activeTicket={activeTicket}
                  setActiveTicket={handleOpenTicket}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  sendingReply={sendingReply}
                  handleSendUserReply={handleSendUserReply}
                  currentUserEmail={user?.email}
                  currentUser={user}
                />
              )}
              {activeTab === "community" && (
                <CommunityContent
                  members={allUsers}
                  currentUser={user}
                  onFollow={handleFollowToggle}
                  onMessage={(member) => {
                    setActiveDMUser(member);
                    setSubCommsTab("dm");
                    setActiveTab("comms");
                  }}
                />
              )}
              {activeTab === "news" && (
                <NewsContent
                  news={userNews}
                  onSubmitNews={() => setShowNewsModal(true)}
                />
              )}
              {activeTab === "security" && (
                <SecurityContent user={user} />
              )}
            </div>
          )}
        </div>


        {/* Modals */}
        {showSupportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowSupportModal(false)} />
            <div className="glass-panel w-full max-w-lg rounded-[2.5rem] border border-card-border p-8 relative z-10 shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-foreground/20 hover:text-foreground"><X size={20} /></button>
              <h2 className="text-2xl font-bold mb-6">New Support Ticket</h2>
              <form onSubmit={handleSupportSubmit} className="space-y-5">
                <textarea
                  required
                  rows={5}
                  value={supportMessage}
                  onChange={e => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue..."
                  className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-5 text-xs text-foreground focus:outline-none transition-all font-semibold resize-none"
                />
                <button type="submit" disabled={isSubmittingSupport} className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                  {isSubmittingSupport ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Transmit Ticket
                </button>
                {supportStatus && <div className="text-xs font-bold text-center mt-2">{supportStatus.message}</div>}
              </form>
            </div>
          </div>
        )}

        {showNewsModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowNewsModal(false)} />
            <div className="glass-panel w-full max-w-2xl rounded-[3rem] border border-card-border p-8 md:p-12 relative z-10 shadow-2xl animate-in zoom-in-95">
              <button onClick={() => setShowNewsModal(false)} className="absolute top-8 right-8 text-foreground/20 hover:text-foreground"><X size={24} /></button>
              <h2 className="text-3xl font-bold mb-8">Submit Tech News</h2>
              <form onSubmit={handleNewsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required type="text" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Headline..." className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 text-xs" />
                  <select value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 text-xs">
                    <option value="Technology">Technology</option>
                    <option value="AI">AI</option>
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                <input required type="text" value={newsForm.summary} onChange={e => setNewsForm({ ...newsForm, summary: e.target.value })} placeholder="Brief description..." className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 text-xs" />
                <textarea required rows={4} value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Full article..." className="w-full bg-foreground/[0.03] border border-card-border rounded-2xl py-4 px-6 text-xs resize-none" />
                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-600 text-white rounded-[2rem] font-bold">
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
                  Transmit News
                </button>
                {status && <div className="text-sm font-bold text-center mt-2">{status.message}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
