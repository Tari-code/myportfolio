"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Heart, MessageSquare, Share2, Check, Loader2, Send, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Reply {
  _id?: string;
  userId?: string;
  userName: string;
  text: string;
  createdAt?: string;
}

interface Comment {
  _id?: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt?: string;
  likes?: string[];
  replies?: Reply[];
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [commentLikes, setCommentLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchPost();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) setCurrentUser(data.user);
      }
    } catch {}
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        setLikeCount((data.likes || []).length);
        await fetchComments();
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/news/comment?postId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {}
    setLoadingComments(false);
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    try {
      const res = await fetch("/api/news/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likes);
      }
    } catch {}
    setLiking(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post?.title, text: post?.summary, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/news/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, text: commentInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => [...prev, data.comment]);
        setCommentInput("");
      }
    } catch {}
    setSubmitting(false);
  };

  const handleCommentLike = async (commentId: string) => {
    const prev = commentLikes[commentId] || { count: 0, liked: false };
    setCommentLikes(cl => ({ ...cl, [commentId]: { count: prev.count + (prev.liked ? -1 : 1), liked: !prev.liked } }));
    try {
      const res = await fetch("/api/news/comment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, commentId, action: "like" }),
      });
      if (res.ok) {
        const data = await res.json();
        setCommentLikes(cl => ({ ...cl, [commentId]: { count: data.likes, liked: data.liked } }));
      }
    } catch {
      setCommentLikes(cl => ({ ...cl, [commentId]: prev }));
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyInput.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch("/api/news/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id, commentId, text: replyInput.trim(), action: "reply" }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, replies: data.replies } : c));
        setReplyInput("");
        setReplyingTo(null);
      }
    } catch {}
    setSubmittingReply(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={32} />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
        <p className="text-4xl font-black text-foreground/10">404</p>
        <p className="font-bold text-foreground/40">Post not found</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-500 font-bold text-sm">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-24">
      {/* Sticky header */}
      <div className="sticky top-16 md:top-24 z-40 bg-background/80 backdrop-blur-xl border-b border-card-border px-4 md:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all -ml-1"
        >
          <ArrowLeft size={20} />
        </button>
        <button onClick={handleShare} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-all">
          {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Post body */}
        <div className="glass-panel rounded-[1.5rem] md:rounded-[2rem] border border-card-border overflow-hidden">
          <div className="p-5 md:p-8">
            {/* Category & meta */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-widest border border-brand-500/20">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-foreground/30 font-bold">
                <Clock size={10} />
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + " ago" : ""}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-4">{post.title}</h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-card-border">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-brand-500 shrink-0">
                {(post.author || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{post.author || "Anonymous"}</p>
                {post.readTime && <p className="text-[10px] text-foreground/30 font-bold">{post.readTime}</p>}
              </div>
            </div>

            {/* Summary */}
            {post.summary && (
              <p className="text-base text-foreground/70 font-medium leading-relaxed italic border-l-2 border-brand-500/30 pl-4 mb-5">
                &ldquo;{post.summary}&rdquo;
              </p>
            )}

            {/* Content */}
            <div className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>

            {/* Like & share row */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-card-border">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className={`flex items-center gap-2 font-bold text-sm transition-all active:scale-95 ${liked ? "text-pink-500" : "text-foreground/40 hover:text-pink-500"}`}
                >
                  <Heart size={20} className={liked ? "fill-pink-500" : ""} />
                  {likeCount > 0 && <span>{likeCount}</span>}
                  <span>Like</span>
                </button>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground/40">
                  <MessageSquare size={20} />
                  <span>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-foreground transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                <span>{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="glass-panel rounded-[1.5rem] md:rounded-[2rem] border border-card-border overflow-hidden">
          <div className="p-5 md:p-8">
            <h2 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-5">
              Comments ({comments.length})
            </h2>

            {loadingComments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-brand-500" size={24} />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-10 opacity-40">
                <MessageSquare size={32} className="mx-auto mb-3" />
                <p className="text-sm font-bold">No comments yet — be the first!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((comment, idx) => {
                  const cid = comment._id || String(idx);
                  const cLike = commentLikes[cid] || { count: (comment.likes || []).length, liked: false };
                  const replies = comment.replies || [];
                  const showReplies = expandedReplies.has(cid);

                  return (
                    <div key={cid} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-brand-500 shrink-0 mt-0.5">
                        {(comment.userName || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-foreground/[0.05] border border-card-border rounded-2xl rounded-tl-md px-4 py-3">
                          <p className="text-xs font-bold text-foreground mb-1">{comment.userName}</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 px-1">
                          <span className="text-[10px] text-foreground/25 font-semibold">
                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) + " ago" : "just now"}
                          </span>
                          <button
                            onClick={() => comment._id && handleCommentLike(comment._id)}
                            className={`text-[11px] font-bold flex items-center gap-1 transition-colors ${cLike.liked ? "text-pink-500" : "text-foreground/35 hover:text-pink-400"}`}
                          >
                            <Heart size={11} className={cLike.liked ? "fill-pink-500" : ""} />
                            {cLike.count > 0 ? cLike.count : ""} Like
                          </button>
                          <button
                            onClick={() => setReplyingTo(replyingTo === cid ? null : cid)}
                            className="text-[11px] font-bold text-foreground/35 hover:text-brand-500 transition-colors"
                          >
                            Reply
                          </button>
                          {replies.length > 0 && (
                            <button
                              onClick={() => setExpandedReplies(prev => {
                                const s = new Set(prev);
                                s.has(cid) ? s.delete(cid) : s.add(cid);
                                return s;
                              })}
                              className="flex items-center gap-1 text-[11px] font-bold text-brand-500/70 hover:text-brand-500 transition-colors"
                            >
                              {showReplies ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                            </button>
                          )}
                        </div>

                        {showReplies && replies.length > 0 && (
                          <div className="mt-2 ml-4 space-y-2 border-l-2 border-brand-500/15 pl-3">
                            {replies.map((reply, ri) => (
                              <div key={reply._id || ri} className="flex gap-2">
                                <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0">
                                  {(reply.userName || "?")[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="bg-foreground/[0.04] border border-card-border rounded-xl rounded-tl-sm px-3 py-2">
                                    <p className="text-[11px] font-bold text-foreground mb-0.5">{reply.userName}</p>
                                    <p className="text-xs text-foreground/70 leading-relaxed">{reply.text}</p>
                                  </div>
                                  <p className="text-[9px] text-foreground/25 font-semibold mt-0.5 px-1">
                                    {reply.createdAt ? formatDistanceToNow(new Date(reply.createdAt)) + " ago" : "just now"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {replyingTo === cid && (
                          <div className="mt-2 ml-1 flex gap-2 items-center">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-[10px] font-bold text-brand-500 shrink-0">
                              {(currentUser?.name || "?")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 bg-foreground/[0.05] border border-brand-500/30 rounded-[1.5rem] px-3 py-2 focus-within:border-brand-500/60 transition-all flex items-center gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={replyInput}
                                onChange={e => setReplyInput(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && comment._id) { e.preventDefault(); handleSubmitReply(comment._id); } }}
                                placeholder={`Reply to ${comment.userName}…`}
                                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-foreground/25 focus:outline-none font-medium"
                              />
                              <button
                                onClick={() => comment._id && handleSubmitReply(comment._id)}
                                disabled={!replyInput.trim() || submittingReply}
                                className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white disabled:opacity-30 transition-all shrink-0"
                              >
                                {submittingReply ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} className="ml-0.5" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add comment */}
            <form onSubmit={handleSubmitComment} className="flex gap-2 items-center mt-6 pt-5 border-t border-card-border">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-brand-500 shrink-0">
                {(currentUser?.name || "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 bg-foreground/[0.05] border border-card-border rounded-[2rem] px-4 py-2.5 focus-within:border-brand-500/50 transition-all">
                <input
                  type="text"
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder="Write a comment…"
                  disabled={submitting}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/25 focus:outline-none font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={!commentInput.trim() || submitting}
                className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-400 flex items-center justify-center text-white disabled:opacity-40 transition-all active:scale-95 shrink-0"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
