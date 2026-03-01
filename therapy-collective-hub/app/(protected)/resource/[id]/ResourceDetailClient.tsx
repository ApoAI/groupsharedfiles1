'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Heart, MessageCircle, Download, FileText, Video, Headphones, BookOpen, Link as LinkIcon, Image as ImageIcon, File, User, Send } from 'lucide-react';

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

export default function ResourceDetailClient({ initialResource }: { initialResource: any }) {
  const [resource, setResource] = useState(initialResource);
  const [commentText, setCommentText] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showHeartBloom, setShowHeartBloom] = useState(false);

  const Icon = getFormatIcon(resource.format);

  const handleReaction = async (type: 'like' | 'love') => {
    try {
      if (type === 'love') setShowHeartBloom(true);
      
      const res = await fetch(`/api/resources/${resource.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setResource((prev: any) => ({
          ...prev,
          likeCount: data.likeCount,
          loveCount: data.loveCount,
        }));
      }
      
      if (type === 'love') {
        setTimeout(() => setShowHeartBloom(false), 1000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/resources/${resource.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: commentText,
          name: commentName || 'Anonymous',
        }),
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setResource((prev: any) => ({
          ...prev,
          comments: [newComment, ...prev.comments],
        }));
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-10 border border-[#E8E6E1] shadow-sm relative overflow-hidden"
      >
        <AnimatePresence>
          {showHeartBloom && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 20, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-pink-100 rounded-full pointer-events-none z-0"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center space-x-2 bg-[#F0EFEA] px-3 py-1.5 rounded-xl text-[#8F9F8A]">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">{resource.format}</span>
            </div>
            <div className="bg-[#F9F8F6] px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B]">
              {resource.category}
            </div>
            {resource.folder && (
              <div className="flex items-center space-x-1 bg-[#F9F8F6] px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B6B6B]">
                <span>{resource.folder.emoji}</span>
                <span>{resource.folder.name}</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-[#4A4A4A] mb-4 leading-tight">
            {resource.title}
          </h1>

          {resource.description && (
            <p className="text-lg text-[#6B6B6B] mb-8 leading-relaxed">
              {resource.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {resource.tags?.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-[#F9F8F6] rounded-lg text-xs font-medium text-[#8C8C8C] uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-[#E8E6E1]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleReaction('like')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9F8F6] hover:bg-[#F0EFEA] text-[#6B6B6B] transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">{resource.likeCount}</span>
              </button>
              <button
                onClick={() => handleReaction('love')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-500 transition-colors"
              >
                <span className="text-xl leading-none">🥰</span>
                <span className="font-medium">{resource.loveCount}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#8F9F8A] hover:bg-[#7A8A75] text-white rounded-xl font-medium transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open Link
                </a>
              )}
              {resource.blobUrl && (
                <a
                  href={resource.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-[#E8E6E1] hover:bg-[#F9F8F6] text-[#4A4A4A] rounded-xl font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Meta & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Notes Section */}
          {resource.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#F0EFEA]/50 rounded-3xl p-8 border border-[#E8E6E1]"
            >
              <h3 className="text-lg font-serif text-[#4A4A4A] mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8F9F8A]" />
                Private Notes
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed whitespace-pre-wrap">
                {resource.notes}
              </p>
            </motion.div>
          )}

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-[#E8E6E1] shadow-sm"
          >
            <h3 className="text-xl font-serif text-[#4A4A4A] mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#8F9F8A]" />
              Discussion ({resource.comments?.length || 0})
            </h3>

            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="bg-[#F9F8F6] rounded-2xl p-4 border border-[#E8E6E1]">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this resource..."
                  className="w-full bg-transparent border-none focus:ring-0 resize-none text-[#4A4A4A] placeholder:text-[#8C8C8C] p-0"
                  rows={3}
                  required
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-[#E8E6E1]">
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Your Name (optional)"
                    className="bg-white px-3 py-1.5 rounded-lg text-sm border border-[#E8E6E1] focus:outline-none focus:ring-2 focus:ring-[#8F9F8A]/50 w-full sm:w-auto"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8F9F8A] hover:bg-[#7A8A75] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              <AnimatePresence>
                {resource.comments?.map((comment: any) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F0EFEA] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#8C8C8C]" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-[#4A4A4A]">{comment.name || 'Anonymous'}</span>
                        <span className="text-xs text-[#8C8C8C]">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-[#6B6B6B] text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {resource.comments?.length === 0 && (
                <p className="text-center text-[#8C8C8C] py-4 text-sm">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-3xl p-6 border border-[#E8E6E1] shadow-sm">
            <h4 className="text-sm font-semibold text-[#8C8C8C] uppercase tracking-wider mb-4">
              Resource Details
            </h4>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[#8C8C8C] mb-1">Added By</dt>
                <dd className="font-medium text-[#4A4A4A]">{resource.addedBy || 'Anonymous'}</dd>
              </div>
              <div>
                <dt className="text-[#8C8C8C] mb-1">Added On</dt>
                <dd className="font-medium text-[#4A4A4A]">
                  {new Date(resource.addedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-[#8C8C8C] mb-1">Format</dt>
                <dd className="font-medium text-[#4A4A4A]">{resource.format}</dd>
              </div>
              <div>
                <dt className="text-[#8C8C8C] mb-1">Category</dt>
                <dd className="font-medium text-[#4A4A4A]">{resource.category}</dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
