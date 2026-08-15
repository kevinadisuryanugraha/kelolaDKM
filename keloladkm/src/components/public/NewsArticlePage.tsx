import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMS_ARTICLES } from '../../data/mockData';
import { CMSArticle } from '../../types';
import { Eye, User, X } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';

export const NewsArticlePage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<CMSArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Kegiatan', 'Pengumuman', 'Dakwah', 'Sosial'];

  const filtered = CMS_ARTICLES.filter(
    (a) => activeCategory === 'All' || a.category === activeCategory
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badgeKey="pages.news.badge"
        titleKey="pages.news.title"
        subtitleKey="pages.news.subtitle"
      />

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:text-emerald-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((art, idx) => (
          <GlassCard
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="p-0 overflow-hidden flex flex-col sm:flex-row cursor-pointer group"
            glow="emerald"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
          >
            <div className="sm:w-48 h-48 overflow-hidden shrink-0">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex flex-col justify-between space-y-3 flex-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold rounded-full border border-emerald-500/20">
                    {art.category}
                  </span>
                  <span>{art.date}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{art.summary}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> {art.author}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-amber-500" /> {art.views} Pembaca
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full shadow-2xl overflow-hidden my-8 relative"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-64 object-cover" />

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold rounded-full border border-emerald-500/20">
                    {selectedArticle.category}
                  </span>
                  <span>{selectedArticle.date}</span>
                  <span>• Penulis: {selectedArticle.author}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-200/80 dark:border-slate-800/80 pt-4">
                  {selectedArticle.content}
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shadow-md transition-all"
                  >
                    Tutup Artikel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
