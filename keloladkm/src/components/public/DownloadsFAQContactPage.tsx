import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_DOCUMENTS, FAQS_PUBLIC, MASJID_INFO } from '../../data/mockData';
import { Download, HelpCircle, Phone, Mail, MapPin, Send, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasjidGoogleMap } from '../common/MasjidGoogleMap';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';

export const DownloadsFAQContactPage: React.FC = () => {
  const { showToast, openExportModal } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Pesan dari ${contactName} telah terkirim ke Sekretariat DKM. Terima kasih!`, 'success');
    setContactName('');
    setContactPhone('');
    setContactMessage('');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badge="Pusat Bantuan & Dokumen Resmi"
        title="Download Dokumen, FAQ & Hubungi DKM"
        subtitle="Unduh dokumen legalitas dan proposal resmi, dapatkan jawaban seputar layanan keagamaan, serta sampaikan pesan/masukan langsung ke Sekretariat DKM."
      />

      {/* Section 1: Downloads Area */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Unduh Dokumen & Proposal Resmi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFICIAL_DOCUMENTS.map((doc, idx) => (
            <GlassCard
              key={doc.id}
              className="p-5 flex items-center justify-between"
              glow="emerald"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <div className="space-y-1 pr-3">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full border border-emerald-500/20">
                  {doc.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mt-1">{doc.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Size: {doc.fileSize} • {doc.downloadCount}x Didownload
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openExportModal(`Download File: ${doc.title}`, [doc])}
                className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all border border-emerald-500/20 shrink-0"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Section 2: FAQ Accordion (KokonutUI style) */}
      <GlassCard className="p-6 sm:p-8 space-y-6" glow="gold" hoverEffect={false}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <span>Pertanyaan Umum (FAQ)</span>
        </h2>

        <div className="space-y-3">
          {FAQS_PUBLIC.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all bg-white/40 dark:bg-slate-900/40"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full text-left p-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Section 3: Contact Form & Sekretariat Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-5" glow="emerald" hoverEffect={false}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kirim Pesan ke DKM</h2>
            <p className="text-xs text-slate-500">
              Sampaikan pertanyaan, masukan, atau permohonan konsultasi syariah kepada pengurus DKM.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Masukkan nama Anda..."
                className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Pesan / Pertanyaan / Masukan
              </label>
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Tuliskan pesan Anda secara lengkap..."
                className="w-full p-4 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pesan Sekarang</span>
            </motion.button>
          </form>
        </GlassCard>

        {/* Right Info Box */}
        <GlassCard className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6" glow="gold" hoverEffect={false}>
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Sekretariat DKM Masjid</h3>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{MASJID_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono">{MASJID_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono">{MASJID_INFO.email}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400">Jam Layanan Sekretariat:</span>
            <p className="text-slate-600 dark:text-slate-300">Senin - Minggu: 08:00 WIB - 20:00 WIB</p>
          </div>
        </GlassCard>
      </section>

      {/* Section 4: Google Maps Interactive Location */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Lokasi Presisi & Peta Google Maps</span>
        </h2>
        <MasjidGoogleMap />
      </section>
    </div>
  );
};
