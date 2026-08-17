import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMS_ARTICLES } from '../../data/mockData';
import { CMSArticle } from '../../types';
import { Eye, User, ArrowLeft, Share2, MessageSquare, Calendar, Clock, BookOpen, ChevronRight, Check } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { PlaceholderImage } from '../common/PlaceholderImage';
import { Avatar } from '../common/Avatar';
import { useApp } from '../../context/AppContext';
import { openWhatsAppDirect } from '../../utils/whatsappGateway';

export const NewsArticlePage: React.FC = () => {
  const { articles, showToast } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<CMSArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const categories = ['All', 'Kegiatan', 'Pengumuman', 'Dakwah', 'Sosial'];

  const publishedArticles = articles.filter((a) => a.isPublished !== false);

  const filtered = publishedArticles.filter(
    (a) => activeCategory === 'All' || a.category === activeCategory
  );

  const relatedArticles = selectedArticle
    ? publishedArticles.filter((a) => a.id !== selectedArticle.id)
    : [];

  const handleShareWhatsApp = (art: CMSArticle) => {
    const text = `*${art.title}*\n\nKategori: ${art.category}\nPenulis: ${art.author}\n\nBaca artikel selengkapnya di Portal Resmi Masjid Jami Nurul Iman Pejaten:\nhttps://masjidnuruliman-pejaten.or.id`;
    openWhatsAppDirect('', text);
    showToast('Membuka WhatsApp untuk membagikan artikel...', 'info');
  };

  const handleCopyLink = (art: CMSArticle) => {
    navigator.clipboard.writeText(`https://masjidnuruliman-pejaten.or.id/?tab=public&sub=news&id=${art.id}`);
    setIsCopied(true);
    showToast('Tautan artikel berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // ==========================================
  // VIEW 1: DEDICATED FULL ARTICLE READING PAGE
  // ==========================================
  if (selectedArticle) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="space-y-8 pb-20 max-w-5xl mx-auto"
      >
        {/* Breadcrumbs & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <button
            onClick={() => setSelectedArticle(null)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-800 transition-all shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Semua Berita</span>
          </button>

          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="cursor-pointer hover:text-emerald-600" onClick={() => setSelectedArticle(null)}>Berita</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedArticle.category}</span>
          </nav>
        </div>

        {/* Full Article Container */}
        <GlassCard className="p-6 sm:p-10 space-y-8" glow="emerald" hoverEffect={false}>
          {/* Article Header Metadata */}
          <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/20 uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {selectedArticle.date}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> 3 Menit Baca
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Eye className="w-3.5 h-3.5 text-blue-500" /> {selectedArticle.views} Pembaca
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {selectedArticle.title}
            </h1>

            {/* Author Profile Strip */}
            <div className="flex items-center gap-3 pt-2">
              <Avatar name={selectedArticle.author} size="md" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{selectedArticle.author}</div>
                <div className="text-[11px] text-slate-500 font-medium">Kontributor Dakwah & Informasi DKM</div>
              </div>
            </div>
          </div>

          {/* Featured Hero Media */}
          <div className="w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800">
            {selectedArticle.imageUrl && selectedArticle.imageUrl.trim() !== '' ? (
              <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-full object-cover" />
            ) : (
              <PlaceholderImage category={selectedArticle.category} title={selectedArticle.title} />
            )}
          </div>

          {/* Article Full Body */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line space-y-4 pt-2 font-normal">
            {selectedArticle.content}
          </div>

          {/* Quote Highlight Box */}
          <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/40 dark:to-teal-950/20 rounded-3xl border-l-4 border-emerald-500 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
            "Semoga setiap langkah kita menuju majelis ilmu dan pemakmuran masjid dicatat sebagai amal jariyah di sisi Allah Subhanahu Wa Ta'ala."
          </div>

          {/* Action & Share Strip */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Bagikan artikel:</span>
              <button
                onClick={() => handleShareWhatsApp(selectedArticle)}
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleCopyLink(selectedArticle)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Tersalin' : 'Salin Link'}</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Kembali ke Daftar
            </button>
          </div>
        </GlassCard>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Artikel & Berita Terkait Lainnya</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedArticles.map((rel) => (
                <GlassCard
                  key={rel.id}
                  onClick={() => {
                    setSelectedArticle(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 flex gap-4 cursor-pointer group"
                  glow="emerald"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    {rel.imageUrl && rel.imageUrl.trim() !== '' ? (
                      <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <PlaceholderImage category={rel.category} title={rel.title} className="p-2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{rel.category}</span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">{rel.title}</h4>
                    <span className="text-[10px] text-slate-400">{rel.date} • {rel.author}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // ==========================================
  // VIEW 2: ARTICLE LIST CATALOG
  // ==========================================
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
            onClick={() => {
              setSelectedArticle(art);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-0 overflow-hidden flex flex-col sm:flex-row cursor-pointer group"
            glow="emerald"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
          >
            <div className="sm:w-48 h-48 overflow-hidden shrink-0">
              {art.imageUrl && art.imageUrl.trim() !== '' ? (
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <PlaceholderImage category={art.category} title={art.title} />
              )}
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
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  Baca Artikel <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
