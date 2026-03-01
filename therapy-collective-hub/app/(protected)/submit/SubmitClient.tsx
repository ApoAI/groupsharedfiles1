'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CATEGORIES, FORMATS } from '@/lib/config';
import { Leaf, Link as LinkIcon, Upload, Loader2 } from 'lucide-react';

export default function SubmitClient({ folders }: { folders: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingOg, setFetchingOg] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
    category: CATEGORIES[0],
    format: FORMATS[0],
    addedBy: '',
    notes: '',
    folderId: '',
  });

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, url }));
    
    if (url && url.startsWith('http')) {
      setFetchingOg(true);
      try {
        const res = await fetch('/api/og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            title: prev.title || data.title || '',
            description: prev.description || data.description || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch OG data', err);
      } finally {
        setFetchingOg(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let blobUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          blobUrl = uploadData.url;
        }
      }

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          blobUrl,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          folderId: formData.folderId || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/resource/${data.id}`);
      } else {
        alert('Failed to submit resource');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-[#4A4A4A]">Share a Resource</h1>
        <p className="text-[#8C8C8C] mt-2">Add a new tool, article, or worksheet to the collective library.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-[#E8E6E1] p-6 md:p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL & File Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Link (URL)
                {fetchingOg && <Loader2 className="w-3 h-3 animate-spin text-[#8F9F8A]" />}
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={handleUrlChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4" /> File Upload
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#F0EFEA] file:text-[#8F9F8A] hover:file:bg-[#E8E6E1]"
              />
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all resize-none"
            />
          </div>

          {/* Category, Format, Folder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Format *</label>
              <select
                required
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              >
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Folder</label>
              <select
                value={formData.folderId}
                onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              >
                <option value="">Unsorted</option>
                {folders.map(f => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
              </select>
            </div>
          </div>

          {/* Tags & Added By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. mindfulness, breathing, teens"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Added By (Optional)</label>
              <input
                type="text"
                value={formData.addedBy}
                onChange={(e) => setFormData({ ...formData, addedBy: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Private Notes (Optional)</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any context for the collective?"
              className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8F9F8A] hover:bg-[#7A8A75] text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center gap-2 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Leaf className="w-5 h-5" />}
              {loading ? 'Adding to Library...' : 'Add to Library'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
