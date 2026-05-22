"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Upload } from "lucide-react";

export default function AdminPortfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ 
    title: "", slug: "", category: "", description: "", fullDescription: "", 
    tags: "", imageUrl: "", projectUrl: "", client: "", duration: "" 
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

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setPortfolio(data || []);
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;

    try {
      await fetch("/api/portfolio", {
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
      setNewItem({ title: "", slug: "", category: "", description: "", fullDescription: "", tags: "", imageUrl: "", projectUrl: "", client: "", duration: "" });
      fetchPortfolio();
    } catch (error) {
      console.error("Failed to save portfolio item", error);
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(item._id); // Use _id for MongoDB
    setNewItem({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "",
      description: item.description || "",
      fullDescription: item.fullDescription || "",
      imageUrl: item.imageUrl || "",
      projectUrl: item.projectUrl || "",
      client: item.client || "",
      duration: item.duration || "",
      tags: item.tags ? item.tags.join(", ") : ""
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", id })
      });
      fetchPortfolio();
    } catch (error) {
      console.error("Failed to remove portfolio item", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Portfolio Manager</h1>
          <p className="text-foreground/60 font-medium">Add, edit, or remove projects shown on your website.</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) {
              setIsEditing(null);
              setNewItem({ title: "", slug: "", category: "", description: "", fullDescription: "", tags: "", imageUrl: "", projectUrl: "", client: "", duration: "" });
            }
          }}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          {isAdding ? "Cancel" : <><Plus size={18} /> Add Project</>}
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-2xl border border-brand-500/30 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-foreground mb-4">{isEditing ? "Edit Project" : "Add New Project"}</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Project Title</label>
                <input required type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="e.g. FinTech Dashboard" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Slug (URL)</label>
                <input required type="text" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="e.g. fintech-dashboard" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Category</label>
                <input required type="text" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="e.g. Web Application" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Project URL</label>
                <input type="url" value={newItem.projectUrl} onChange={e => setNewItem({...newItem, projectUrl: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="https://..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Client</label>
                <input type="text" value={newItem.client} onChange={e => setNewItem({...newItem, client: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Duration</label>
                <input type="text" value={newItem.duration} onChange={e => setNewItem({...newItem, duration: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="e.g. 3 months" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Image URL</label>
              <div className="flex gap-2">
                <input type="text" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="flex-1 bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="https://..." />
                <label className="flex items-center justify-center gap-2 px-4 bg-foreground/5 hover:bg-foreground/10 border border-card-border rounded-lg text-foreground font-bold cursor-pointer transition-colors whitespace-nowrap">
                  {isUploading ? "Uploading..." : <><Upload size={16} /> Upload</>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Short Description</label>
              <textarea required value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" rows={2} placeholder="Brief summary..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Full Description</label>
              <textarea value={newItem.fullDescription} onChange={e => setNewItem({...newItem, fullDescription: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" rows={4} placeholder="In-depth case study..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground/40 mb-1 uppercase tracking-wider">Tags (comma separated)</label>
              <input type="text" value={newItem.tags} onChange={e => setNewItem({...newItem, tags: e.target.value})} className="w-full bg-foreground/[0.03] border border-card-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-brand-500 transition-all font-medium" placeholder="React, Next.js, Tailwind..." />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium">
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
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
            <p className="text-sm text-foreground/60 mb-6 flex-1 font-medium">{item.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {item.tags?.map((tag: string, i: number) => (
                <span key={i} className="text-[10px] font-bold text-foreground/50 bg-foreground/5 px-2 py-1 rounded border border-card-border uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
