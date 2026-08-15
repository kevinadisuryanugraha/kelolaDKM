import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Globe, Save, Eye } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const WebsiteCMSModule: React.FC = () => {
  const { runningText, setRunningText, showToast } = useApp();

  const [heroTitle, setHeroTitle] = useState('Pusat Ibadah & Dakwah Syiar Islam Pejaten Timur');
  const [heroDescription, setHeroDescription] = useState(
    'Melayani jamaah dengan penuh keikhlasan, transparansi keuangan, dan program keummatan terpadu.'
  );
  const [runningTextDraft, setRunningTextDraft] = useState(runningText);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setRunningText(runningTextDraft);
    showToast('Pengaturan Website CMS & Running Text berhasil diperbarui!', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex items-center justify-between" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Website CMS & Media Content Manager</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Edit Running Text Banner, Konten Landing Page, Berita & Galeri Tanpa Coding</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: CMS Form */}
        <GlassCard className="lg:col-span-8 p-6 space-y-4" glow="emerald" hoverEffect={false}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            Pengaturan Teks & Running Banner Website
          </h3>

          <form onSubmit={handleSaveCMS} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Running Text Banner Topbar (Teks Berjalan)
              </label>
              <textarea
                rows={2}
                value={runningTextDraft}
                onChange={(e) => setRunningTextDraft(e.target.value)}
                className="w-full p-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
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
                className="w-full p-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
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

        {/* Right: Live Preview Box */}
        <GlassCard className="lg:col-span-4 p-6 space-y-4" glow="gold" hoverEffect={false}>
          <div className="flex items-center justify-between text-amber-500 text-xs font-bold">
            <Eye className="w-4 h-4" /> Live Preview Tampilan
          </div>

          <div className="bg-emerald-500/10 p-2.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-mono truncate rounded-xl border border-emerald-500/20 font-bold">
            [RUNNING TEXT]: {runningTextDraft}
          </div>

          <div className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">HERO SECTION</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{heroTitle}</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{heroDescription}</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
