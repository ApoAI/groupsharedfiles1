'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderHeart, Plus, Trash2, Edit3, Check, X, FileText, Heart } from 'lucide-react';
import { DEFAULT_FOLDER_EMOJIS } from '@/lib/config';
import { formatDistanceToNow } from 'date-fns';

export default function FoldersClient({ initialFolders }: { initialFolders: any[] }) {
    const [folders, setFolders] = useState(initialFolders);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmoji, setNewEmoji] = useState('📁');
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmoji, setEditEmoji] = useState('');
    const [creating, setCreating] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, emoji: newEmoji }),
            });
            if (res.ok) {
                const created = await res.json();
                setFolders(prev => [{ ...created, resources: [] }, ...prev]);
                setNewName('');
                setNewEmoji('📁');
                setShowCreate(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            const res = await fetch(`/api/folders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, emoji: editEmoji }),
            });
            if (res.ok) {
                const updated = await res.json();
                setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
                setEditId(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this folder? Resources inside will be moved to Unsorted.')) return;
        try {
            const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setFolders(prev => prev.filter(f => f.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-[#4A4A4A]">Folders</h1>
                    <p className="text-[#8C8C8C] mt-1">Organize your resources into meaningful collections.</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#8F9F8A] hover:bg-[#7A8A75] text-white rounded-xl font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Folder
                </button>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="bg-white rounded-3xl p-6 border border-[#E8E6E1] shadow-sm">
                            <h3 className="text-lg font-serif text-[#4A4A4A] mb-4">Create New Folder</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-shrink-0">
                                    <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Emoji</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DEFAULT_FOLDER_EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setNewEmoji(emoji)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${newEmoji === emoji ? 'bg-[#8F9F8A] scale-110 shadow-md' : 'bg-[#F0EFEA] hover:bg-[#E8E6E1]'
                                                    }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-[#6B6B6B] mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. Grounding Techniques"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 focus:border-[#8F9F8A] transition-all"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="px-6 py-3 bg-[#8F9F8A] hover:bg-[#7A8A75] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                                    >
                                        {creating ? 'Creating...' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreate(false)}
                                        className="px-4 py-3 bg-[#F0EFEA] hover:bg-[#E8E6E1] text-[#6B6B6B] rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Folders Grid */}
            {folders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border border-[#E8E6E1]"
                >
                    <div className="w-16 h-16 bg-[#F0EFEA] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderHeart className="w-8 h-8 text-[#8F9F8A]" />
                    </div>
                    <h3 className="text-xl font-serif text-[#4A4A4A] mb-2">No folders yet</h3>
                    <p className="text-[#8C8C8C]">Create your first folder to start organizing resources.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {folders.map((folder) => (
                            <motion.div
                                key={folder.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-6 border border-[#E8E6E1] shadow-sm hover:shadow-md transition-all group"
                            >
                                {editId === folder.id ? (
                                    /* Edit Mode */
                                    <div className="space-y-4">
                                        <div className="flex gap-2 flex-wrap">
                                            {DEFAULT_FOLDER_EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => setEditEmoji(emoji)}
                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${editEmoji === emoji ? 'bg-[#8F9F8A] scale-110' : 'bg-[#F0EFEA] hover:bg-[#E8E6E1]'
                                                        }`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-[#E8E6E1] bg-[#FCFCFB] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(folder.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#8F9F8A] text-white rounded-lg text-sm"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Save
                                            </button>
                                            <button
                                                onClick={() => setEditId(null)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#F0EFEA] text-[#6B6B6B] rounded-lg text-sm"
                                            >
                                                <X className="w-3.5 h-3.5" /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-[#F0EFEA] rounded-2xl flex items-center justify-center text-2xl">
                                                    {folder.emoji || '📁'}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-[#4A4A4A]">{folder.name}</h3>
                                                    <p className="text-xs text-[#8C8C8C]">
                                                        {folder.resources?.length || 0} resource{folder.resources?.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditId(folder.id);
                                                        setEditName(folder.name);
                                                        setEditEmoji(folder.emoji || '📁');
                                                    }}
                                                    className="p-2 text-[#8C8C8C] hover:text-[#4A4A4A] hover:bg-[#F0EFEA] rounded-lg transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(folder.id)}
                                                    className="p-2 text-[#8C8C8C] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Resource previews */}
                                        {folder.resources?.length > 0 ? (
                                            <div className="space-y-2">
                                                {folder.resources.slice(0, 3).map((resource: any) => (
                                                    <Link
                                                        key={resource.id}
                                                        href={`/resource/${resource.id}`}
                                                        className="flex items-center gap-2 px-3 py-2 bg-[#F9F8F6] rounded-xl hover:bg-[#F0EFEA] transition-colors group/item"
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-[#8C8C8C]" />
                                                        <span className="text-sm text-[#4A4A4A] truncate flex-grow group-hover/item:text-[#8F9F8A]">
                                                            {resource.title}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-[#8C8C8C]">
                                                            <Heart className="w-3 h-3" />
                                                            <span className="text-xs">{resource.likeCount + resource.loveCount}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                                {folder.resources.length > 3 && (
                                                    <p className="text-xs text-[#8C8C8C] text-center pt-1">
                                                        +{folder.resources.length - 3} more resource{folder.resources.length - 3 > 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 bg-[#F9F8F6] rounded-xl">
                                                <p className="text-sm text-[#8C8C8C]">No resources yet</p>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-3 border-t border-[#E8E6E1] text-xs text-[#8C8C8C]">
                                            Created {formatDistanceToNow(new Date(folder.createdAt))} ago
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
