import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Save,
  Eye,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Sparkles,
  ExternalLink,
  X,
  Search,
  Check,
  Share2,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  ChevronRight,
  LayoutTemplate
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { FilterTabs } from '../common/FilterTabs';
import { CMSArticle } from '../../types';
import { PlaceholderImage } from '../common/PlaceholderImage';

export const WebsiteCMSModule: React.FC = () => {
  const {
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    togglePublishArticle,
    runningText,
    setRunningText,
    showToast,
    setActiveAppTab,
    setPublicSubTab
  } = useApp();

  const [activeTab, setActiveTab] = useState<'articles' | 'banner' | 'guide'>('articles');

  // Search & Category Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Article Form State
  const [isEditorView, setIsEditorView] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Dakwah' | 'Pengumuman' | 'Kegiatan' | 'Sosial'>('Dakwah');
  const [author, setAuthor] = useState('Sekretariat DKM Nurul Iman');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Banner State
  const [heroTitle, setHeroTitle] = useState('Pusat Ibadah & Dakwah Syiar Islam Pejaten Timur');
  const [heroDescription, setHeroDescription] = useState(
    'Melayani jamaah dengan penuh keikhlasan, transparansi keuangan, dan program keummatan terpadu.'
  );
  const [runningTextDraft, setRunningTextDraft] = useState(runningText);

  const openCreateEditor = () => {
    setEditingArticleId(null);
    setTitle('');
    setCategory('Dakwah');
    setAuthor('Sekretariat DKM Nurul Iman');
    setDate(new Date().toISOString().slice(0, 10));
    setSummary('');
    setContent('');
    setImageUrl('');
    setIsPublished(true);
    setIsEditorView(true);
  };

  const openEditEditor = (art: CMSArticle) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setCategory(art.category as any);
    setAuthor(art.author);
    setDate(art.date);
    setSummary(art.summary);
    setContent(art.content);
    setImageUrl(art.imageUrl || '');
    setIsPublished(art.isPublished !== false);
    setIsEditorView(true);
  };

  const handleSaveArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Judul dan isi konten artikel wajib diisi!', 'error');
      return;
    }

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title,
        category,
        author,
        date,
        summary: summary || title,
        content,
        imageUrl,
        isPublished
      });
    } else {
      addArticle({
        title,
        category,
        author,
        date,
        summary: summary || title,
        content,
        imageUrl,
        isPublished
      });
    }

    setIsEditorView(false);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    setRunningText(runningTextDraft);
    showToast('Pengaturan Website CMS & Running Text berhasil diperbarui!', 'success');
  };

  const filteredArticles = articles.filter((a) => {
    const matchCat = selectedCategoryFilter === 'All' || a.category === selectedCategoryFilter;
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Dedicated Full-Page Form View for CMS Article Editor
  if (isEditorView) {
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsEditorView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Manajemen Berita CMS</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Website CMS</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {editingArticleId ? 'Edit Rilis Berita & Artikel' : 'Tulis Artikel & Berita Baru'}
            </span>
          </div>
        </div>

        {/* Full-Page Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Editor Inputs */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span>{editingArticleId ? 'Studio Pengeditan Artikel' : 'Studio Penulisan Artikel Baru'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tulis naskah dakwah, maklumat DKM, atau dokumentasi kegiatan masjid untuk dipublikasikan langsung ke jamaah.
              </p>
            </div>

            <form onSubmit={handleSaveArticleSubmit} className="space-y-5 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Artikel / Pengumuman *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Keutamaan Menjaga Sholat Subuh Berjamaah & Dzikir Pagi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kategori Rubrik</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                  >
                    <option value="Dakwah">📖 Dakwah & Tausiyah</option>
                    <option value="Pengumuman">📢 Pengumuman Resmi DKM</option>
                    <option value="Kegiatan">🕌 Kegiatan & Taklim</option>
                    <option value="Sosial">🤝 Sosial & Santunan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Publikasi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Penulis / Narasumber *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: KH. Drs. Ahmad Fauzi, M.Ag. / Divisi Humas DKM"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ringkasan Singkat (Lead Paragraph)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang tampil di kartu katalog artikel..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Isi Konten Artikel Lengkap *
                </label>
                <textarea
                  rows={7}
                  placeholder="Tuliskan naskah isi artikel lengkap di sini..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  URL Foto Poster Banner (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Kosongkan untuk menggunakan poster visual gradien otomatis"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="fullPagePublishCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="fullPagePublishCheck" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Langsung publikasikan ke website portal jamaah (Status: <span className={isPublished ? 'text-emerald-600' : 'text-amber-600'}>{isPublished ? 'Published' : 'Draft Simpanan'}</span>)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorView(false)}
                  className="px-5 py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-xs rounded-2xl"
                >
                  Batal
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-xs shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticleId ? 'Simpan Perubahan Artikel' : 'Simpan & Publikasikan'}</span>
                </motion.button>
              </div>
            </form>
          </GlassCard>

          {/* Right: Real-Time Live Article Preview Card */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Tampilan Berita di Portal Jamaah</span>
              </h3>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="h-36 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {imageUrl && imageUrl.trim() !== '' ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <PlaceholderImage category={category} title={title || 'Judul Artikel'} />
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      {category}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>{date}</span>
                    <span>1 Pembaca</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {title || '[Judul Artikel Belum Diisi]'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {summary || content || '[Teks ringkasan artikel akan tampil di sini...]'}
                  </p>
                  <div className="pt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{author}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Module Header */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Website CMS & Media Content Studio</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Kelola Rilis Berita, Artikel Dakwah, Pengumuman Resmi & Running Text Website Masjid Tanpa Coding
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateEditor}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Navigation Subtabs (Interactive Dropdown on Mobile, Pills on Desktop) */}
      <FilterTabs
        tabs={[
          { id: 'articles', label: '📰 Manajemen Berita & Artikel', count: articles.length },
          { id: 'banner', label: '🌐 Running Text & Banner Hero' },
          { id: 'guide', label: '📖 Panduan Operasional CMS DKM' }
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* ========================================== */}
      {/* TAB 1: ARTICLES MANAGEMENT TABLE */}
      {/* ========================================== */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
            <div className="flex items-center gap-2 w-full sm:w-80 bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari artikel, judul, atau penulis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs text-slate-900 dark:text-white outline-none w-full font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Dakwah', 'Pengumuman', 'Kegiatan', 'Sosial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategoryFilter === cat
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Articles Table & Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <GlassCard
                key={art.id}
                className="p-0 overflow-hidden flex flex-col justify-between group"
                glow="emerald"
              >
                <div>
                  {/* Article Banner Header */}
                  <div className="h-40 overflow-hidden relative">
                    {art.imageUrl && art.imageUrl.trim() !== '' ? (
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <PlaceholderImage category={art.category} title={art.title} />
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        {art.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                          art.isPublished !== false
                            ? 'bg-emerald-500/80 text-white border-emerald-400'
                            : 'bg-amber-500/80 text-slate-950 border-amber-300'
                        }`}
                      >
                        {art.isPublished !== false ? '● Tayang' : '○ Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between font-medium">
                      <span>{art.date}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-amber-500" /> {art.views} Pembaca</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">{art.author}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditEditor(art)}
                      className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                      title="Edit Artikel"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => togglePublishArticle(art.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        art.isPublished !== false
                          ? 'text-amber-600 hover:bg-amber-500/10'
                          : 'text-emerald-600 hover:bg-emerald-500/10'
                      }`}
                      title={art.isPublished !== false ? 'Ubah ke Draft' : 'Terbitkan Sekarang'}
                    >
                      {art.isPublished !== false ? 'Jadikan Draft' : 'Terbitkan'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setActiveAppTab('public');
                        setPublicSubTab('news');
                      }}
                      className="p-2 text-slate-400 hover:text-blue-500 rounded-xl hover:bg-blue-500/10 transition-colors"
                      title="Lihat Tampilan Publik"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus artikel "${art.title}"?`)) {
                          deleteArticle(art.id);
                        }
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: RUNNING TEXT & HERO BANNER SETTINGS */}
      {/* ========================================== */}
      {activeTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GlassCard className="lg:col-span-8 p-6 space-y-4" glow="emerald" hoverEffect={false}>
            <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              Pengaturan Teks Berjalan (Running Text) & Hero Landing Page
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Running Text Banner Topbar (Teks Berjalan Pengumuman Sholat & Donasi)
                </label>
                <textarea
                  rows={3}
                  value={runningTextDraft}
                  onChange={(e) => setRunningTextDraft(e.target.value)}
                  className="w-full p-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">Teks ini tampil bergerak di bagian paling atas website untuk seluruh jamaah.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Utama Hero Banner Website
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full p-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deskripsi Singkat Hero Section
                </label>
                <textarea
                  rows={3}
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  className="w-full p-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Publikasikan ke Website</span>
              </motion.button>
            </form>
          </GlassCard>

          <GlassCard className="lg:col-span-4 p-6 space-y-4" glow="gold" hoverEffect={false}>
            <div className="flex items-center justify-between text-amber-500 text-xs font-bold">
              <Eye className="w-4 h-4" /> Live Preview Tampilan
            </div>

            <div className="bg-emerald-500/10 p-3 text-[11px] text-emerald-700 dark:text-emerald-300 font-mono rounded-xl border border-emerald-500/20 font-bold leading-relaxed">
              [RUNNING TEXT]: {runningTextDraft}
            </div>

            <div className="p-5 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">HERO SECTION</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{heroTitle}</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{heroDescription}</p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: CMS OPERATIONAL MANUAL FOR DKM STAFF */}
      {/* ========================================== */}
      {activeTab === 'guide' && (
        <GlassCard className="p-6 sm:p-10 space-y-8" glow="emerald" hoverEffect={false}>
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Petunjuk & Panduan Operasional CMS Berita untuk Pengurus DKM</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Panduan praktis bagi Sekretariat & Divisi Media DKM Masjid Jami Nurul Iman dalam mengelola publikasi website secara mandiri.
            </p>
          </div>

          {/* Guide Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Cara Menulis Berita / Artikel Baru</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                1. Klik tombol <strong>"+ Tulis Artikel Baru"</strong> di kanan atas.<br />
                2. Masukkan <strong>Judul Artikel</strong> yang jelas dan menarik jamaah.<br />
                3. Tentukan <strong>Kategori</strong> yang sesuai (*Dakwah, Pengumuman, Kegiatan, Sosial*).<br />
                4. Tuliskan nama <strong>Penulis</strong> (contoh: *KH. Ahmad Fauzi / Divisi Dakwah DKM*).<br />
                5. Isi teks konten lengkap lalu klik <strong>"Simpan & Terbitkan"</strong>.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Penggunaan Kategori Artikel yang Tepat</h4>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>• 📖 <strong>Dakwah</strong>: Nasehat keislaman, kultum subuh, tadabbur Al-Qur'an & hadits.</li>
                <li>• 📢 <strong>Pengumuman</strong>: Maklumat DKM, jadwal sholat Id, rilis laporan kas masjid.</li>
                <li>• 🕌 <strong>Kegiatan</strong>: Dokumentasi taklim akbar, PHBI, festival anak sholeh, gotong royong.</li>
                <li>• 🤝 <strong>Sosial</strong>: Laporan santunan anak yatim, pembagian zakat, dan baksos kesehatan.</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Mode Draft & Pratinjau (Preview)</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Jika artikel masih berupa draf naskah yang belum siap dibaca publik, nonaktifkan opsi <strong>"Diterbitkan"</strong> saat menyimpan. Artikel akan berstatus <strong>Draft</strong> dan hanya terlihat di dashboard pengurus.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Memperbarui Running Text Berjalan</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Gunakan tab <strong>"Running Text & Banner Hero"</strong> untuk mengubah pesan teks berjalan pada bilah teratas website (seperti mengingatkan infaq jumat, jadwal imam sholat, atau ajakan donasi).
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
