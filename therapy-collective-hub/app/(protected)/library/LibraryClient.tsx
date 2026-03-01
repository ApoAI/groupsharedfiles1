'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowDownUp, FileText, Video, Headphones, BookOpen, Link as LinkIcon, Image as ImageIcon, File, Heart, MessageCircle, Leaf, Plus, X } from 'lucide-react';
import { CATEGORIES, FORMATS } from '@/lib/config';
import { formatDistanceToNow } from 'date-fns';

const getFormatIcon = (format: string) => {
  switch (format) {
    case 'Article': return FileText;
    case 'Video': return Video;
    case 'Audio/Meditation': return Headphones;
    case 'Book Recommendation': return BookOpen;
    case 'Website/Tool': return LinkIcon;
    case 'Image/Infographic': return ImageIcon;
    case 'Worksheet': return File;
    default: return File;
  }
};

export default function LibraryClient({ initialResources, folders }: { initialResources: any[], folders: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [allCategories, setAllCategories] = useState<string[]>(CATEGORIES);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setAllCategories).catch(() => { });
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        setAllCategories(prev => [...new Set([...prev, newCategoryName.trim()])].sort());
        setNewCategoryName('');
        setShowAddCategory(false);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCategory = async (name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
      if (res.ok) {
        setAllCategories(prev => prev.filter(c => c !== name));
        if (selectedCategory === name) setSelectedCategory(null);
      }
    } catch (err) { console.error(err); }
  };

  const filteredResources = useMemo(() => {
    let result = [...initialResources];

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(lowerSearch) ||
        r.description?.toLowerCase().includes(lowerSearch) ||
        r.tags?.some((t: string) => t.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedCategory) {
      result = result.filter(r => r.category === selectedCategory);
    }

    if (selectedFormat) {
      result = result.filter(r => r.format === selectedFormat);
    }

    if (selectedFolder) {
      if (selectedFolder === 'unsorted') {
        result = result.filter(r => !r.folderId);
      } else {
        result = result.filter(r => r.folderId === selectedFolder);
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [initialResources, search, selectedCategory, selectedFormat, selectedFolder, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-serif text-[#4A4A4A]">Resource Library</h1>
          <p className="text-[#8C8C8C] mt-1">A curated collection of tools and insights.</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8C8C]" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8E6E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-[#E8E6E1] bg-white text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!selectedCategory ? 'bg-[#8F9F8A] text-white' : 'bg-white border border-[#E8E6E1] text-[#6B6B6B] hover:bg-[#F0EFEA]'}`}
        >
          All Categories
        </button>
        {allCategories.map(cat => (
          <div key={cat} className="group/cat relative inline-flex">
            <button
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${cat === selectedCategory ? 'bg-[#8F9F8A] text-white' : 'bg-white border border-[#E8E6E1] text-[#6B6B6B] hover:bg-[#F0EFEA]'}`}
            >
              {cat}
            </button>
            {!CATEGORIES.includes(cat) && (
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity"
                title="Delete category"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
        {showAddCategory ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="New category..."
              className="px-3 py-1 rounded-full text-xs border border-[#8F9F8A] bg-white focus:outline-none focus:ring-1 focus:ring-[#8F9F8A] w-36"
              autoFocus
            />
            <button onClick={handleAddCategory} className="p-1 text-[#8F9F8A] hover:text-[#7A8A75]">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }} className="p-1 text-[#8C8C8C] hover:text-[#4A4A4A]">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategory(true)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-[#8F9F8A] text-[#8F9F8A] hover:bg-[#F0EFEA] transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredResources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-3xl border border-[#E8E6E1]"
        >
          <div className="w-16 h-16 bg-[#F0EFEA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-[#8F9F8A]" />
          </div>
          <h3 className="text-xl font-serif text-[#4A4A4A] mb-2">No resources found</h3>
          <p className="text-[#8C8C8C]">Try adjusting your search or filters, or add a new resource.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredResources.map((resource) => {
              const Icon = getFormatIcon(resource.format);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={resource.id}
                >
                  <Link href={`/resource/${resource.id}`}>
                    <div className="bg-white rounded-3xl p-6 border border-[#E8E6E1] shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-[#F0EFEA] rounded-xl text-[#8F9F8A] group-hover:bg-[#8F9F8A] group-hover:text-white transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-medium text-[#8C8C8C] uppercase tracking-wider">
                            {resource.format}
                          </span>
                        </div>
                        {resource.folder && (
                          <div className="flex items-center space-x-1 bg-[#F9F8F6] px-2 py-1 rounded-lg text-xs text-[#6B6B6B]">
                            <span>{resource.folder.emoji}</span>
                            <span className="max-w-[80px] truncate">{resource.folder.name}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-medium text-[#4A4A4A] mb-2 line-clamp-2 group-hover:text-[#8F9F8A] transition-colors">
                        {resource.title}
                      </h3>

                      <p className="text-sm text-[#6B6B6B] line-clamp-3 mb-4 flex-grow">
                        {resource.description || 'No description provided.'}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {resource.tags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-[#F9F8F6] rounded-md text-[10px] text-[#8C8C8C] uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                        {resource.tags?.length > 3 && (
                          <span className="px-2 py-1 bg-[#F9F8F6] rounded-md text-[10px] text-[#8C8C8C] uppercase tracking-wider">
                            +{resource.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#E8E6E1] text-xs text-[#8C8C8C]">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3.5 h-3.5" />
                            <span>{resource.likeCount + resource.loveCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{resource.comments?.length || 0}</span>
                          </div>
                        </div>
                        <span>{formatDistanceToNow(new Date(resource.addedAt))} ago</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
