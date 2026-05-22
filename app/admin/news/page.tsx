"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Upload } from "lucide-react";

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ 
    title: "", slug: "", category: "", summary: "", content: "", 
    tags: "", imageUrl: "", author: "", date: "" 
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setNewItem({ ...newItem, imageUrl: data.url });
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data || []);
    } catch (error) {
      console.error("Failed to fetch news", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;

    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEditing ? "edit" : "add",
          id: isEditing,
          item: {
            ...newItem,
            tags: typeof newItem.tags === 'string' ? newItem.tags.split(",").map(t => t.trim()).filter(Boolean) : newItem.tags
          }
        })
      });
      setIsAdding(false);
      setIsEditing(null);
      setNewItem({ title: "", slug: "", category: "", summary: "", content: "", tags: "", imageUrl: "", author: "", date: "" });
      fetchNews();
    } catch (error) {
      console.error("Failed to save news article", error);
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(item._id); // Use _id for MongoDB
    setNewItem({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "",
      summary: item.summary || "",
      content: item.content || "",
      imageUrl: item.imageUrl || "",
      author: item.author || "",
      date: item.date || "",
      tags: item.tags ? item.tags.join(", ") : ""
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", id })
      });
      fetchNews();
    } catch (error) {
      console.error("Failed to remove news article", error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id })
      });
      fetchNews();
    } catch (error) {
      console.error("Failed to approve news article", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">News Manager</h1>
          <p className="text-foreground/60 font-medium">Publish, edit, or remove tech news articles.</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setIsEditing(null);
              setNewItem({ title: "", slug: "", category: "", summary: "", content: "", tags: "", imageUrl: "", author: "", date: "" });
            }
          }}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          {isAdding ? "Cancel" : <><Plus size={18} /> Add Article</>}
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-2xl border border-brand-500/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-foreground mb-4">{isEditing ? "Edit Article" : "Write New Article"}</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Article Title</label>
                <input required type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" placeholder="e.g. AI Trends in 2026" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Slug (URL)</label>
                <input required type="text" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" placeholder="e.g. ai-trends-2026" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Category</label>
                <input required type="text" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" placeholder="e.g. Artificial Intelligence" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Author</label>
                <input type="text" value={newItem.author} onChange={e => setNewItem({...newItem, author: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" placeholder="e.g. Jane Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Image URL</label>
              <div className="flex gap-2">
                <input type="text" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="flex-1 bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" placeholder="https://..." />
                <label className="flex items-center justify-center gap-2 px-4 bg-foreground/5 hover:bg-foreground/10 border border-card-border rounded-lg text-foreground font-bold cursor-pointer transition-colors whitespace-nowrap">
                  {isUploading ? "Uploading..." : <><Upload size={16} /> Upload</>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Short Summary</label>
              <textarea required value={newItem.summary} onChange={e => setNewItem({...newItem, summary: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" rows={2} placeholder="Brief article summary..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Full Content</label>
              <textarea required value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" rows={8} placeholder="Write your article here..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Tags (comma separated)</label>
              <input type="text" value={newItem.tags} onChange={e => setNewItem({...newItem, tags: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all" placeholder="AI, Web3, Innovation..." />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium">
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item._id} className="glass-panel p-6 rounded-2xl flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-1 rounded-full">
                {item.category}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-brand-100/50 hover:text-white transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleRemove(item._id)} className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-foreground/60 mb-6 flex-1 line-clamp-3 font-medium">{item.summary}</p>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-card-border">
              <div className="text-[10px] text-foreground/30 font-bold uppercase">
                 <span>{item.author}</span>
                 <span className="mx-2">•</span>
                 <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date(item.date).toLocaleDateString()}</span>
              </div>
              {!item.isApproved && (
                <button 
                  onClick={() => handleApprove(item._id)}
                  className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  Approve
                </button>
              )}
            </div>
            {item.submittedBy && (
              <div className="mt-2 text-[8px] font-bold uppercase tracking-widest text-brand-500/50">
                User Submission {item.isApproved ? '(Approved)' : '(Pending)'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
