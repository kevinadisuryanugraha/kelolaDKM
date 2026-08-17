import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { FilterTabs } from '../common/FilterTabs';
import {
  Calendar,
  Plus,
  QrCode,
  Award,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
  ArrowLeft,
  ChevronRight,
  Save,
  MapPin,
  Clock,
  User,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { formatWhatsAppMessage, openWhatsAppDirect } from '../../utils/whatsappGateway';

export const AgendaEventModule: React.FC = () => {
  const { kajianEvents, addKajianEvent, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'checkin' | 'certificate'>('events');
  const [isAddEventView, setIsAddEventView] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [speakerTitle, setSpeakerTitle] = useState('Ustadz / Penceramah Tamu');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('08:30 - 10:30 WIB');
  const [location, setLocation] = useState('Ruang Utama Sholat Masjid Nurul Iman');
  const [category, setCategory] = useState<'Tafsir' | 'Tematik' | 'Fiqh' | 'Akhlaq'>('Tematik');
  const [description, setDescription] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !speaker.trim()) {
      showToast('Judul kajian dan nama penceramah wajib diisi!', 'error');
      return;
    }

    addKajianEvent({
      title,
      speaker,
      speakerTitle: speakerTitle || 'Ustadz / Narasumber',
      date,
      time,
      location,
      category,
      description: description || `Kajian ${category} bersama ${speaker}`
    });
    setIsAddEventView(false);
    setTitle('');
    setSpeaker('');
    setDescription('');
  };

  const handleSimulateScan = () => {
    if (!scannedCode) return;
    setIsCheckedIn(true);
    showToast(`QR Check-In Sukses untuk Peserta: ${scannedCode}`, 'success');
  };

  // Dedicated Full-Page Form View for Creating New Event
  if (isAddEventView) {
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsAddEventView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Kalender Agenda & Kajian</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Agenda</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Publikasi Agenda Taklim Baru</span>
          </div>
        </div>

        {/* Full-Page Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span>Formulir Jadwal Kajian & Event Masjid</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Jadwalkan taklim, kajian rutin, seminar keislaman, dan peringatan hari besar Islam (PHBI) untuk disiarkan ke jamaah.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-xs">
              {/* Event Title */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Judul Tema Kajian / Event *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Meneladani Akhlaq Mulia Rasulullah dalam Muamalah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Speaker & Speaker Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Ustadz / Penceramah *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: KH. Drs. Ahmad Fauzi, M.Ag."
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Gelar / Jabatan Narasumber
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dai Nasional & Pakar Fiqh Muamalah"
                    value={speakerTitle}
                    onChange={(e) => setSpeakerTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Category, Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kategori Rubrik</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Tematik">📖 Tematik Umum</option>
                    <option value="Tafsir">📜 Tafsir Al-Qur'an</option>
                    <option value="Fiqh">⚖️ Fiqh Ibadah & Muamalah</option>
                    <option value="Akhlaq">🌱 Akhlaq & Tazkiyatun Nufus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Waktu / Jam</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:30 - 10:30 WIB"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Lokasi / Tempat Pelaksanaan</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Ruang Utama Masjid Jami Nurul Iman"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deskripsi Singkat & Pokok Bahasan
                </label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan materi kajian atau fasilitas (snack, e-sertifikat, siaran live youtube)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddEventView(false)}
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
                  <span>Simpan & Siarkan Jadwal</span>
                </motion.button>
              </div>
            </form>
          </GlassCard>

          {/* Right: Live Poster & Taklim Card Preview */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Kartu Jadwal Kajian Jamaah</span>
              </h3>

              <div className="bg-gradient-to-b from-emerald-500/10 to-transparent p-5 rounded-2xl border border-emerald-500/30 space-y-4 text-xs">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                    {category}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">{time}</span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {title || '[Judul Tema Kajian / Seminar]'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {description || 'Materi kajian keislaman terpadu di Masjid Jami Nurul Iman Pejaten Timur.'}
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 dark:text-white">{speaker || '[Nama Ustadz]'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono text-slate-600 dark:text-slate-300">{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-600 dark:text-slate-300 truncate">{location}</span>
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
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Agenda, Event & QR Check-In</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola Event Kajian, Pendaftaran Online, QR Scanner Presensi & E-Sertifikat</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddEventView(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Agenda / Event Baru</span>
        </motion.button>
      </GlassCard>

      {/* Tabs */}
      <FilterTabs
        tabs={[
          { id: 'events', labelKey: 'dashboard.tabs.events' },
          { id: 'checkin', labelKey: 'dashboard.tabs.checkin' },
          { id: 'certificate', labelKey: 'dashboard.tabs.certificate' }
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kajianEvents.map((event) => (
            <GlassCard key={event.id} className="p-6 space-y-4 flex flex-col justify-between" glow="emerald">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/20">
                    {event.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{event.date}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">{event.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{event.speaker} ({event.speakerTitle})</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{event.time}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const msg = formatWhatsAppMessage('KAJIAN', {
                      title: event.title,
                      speaker: event.speaker,
                      date: event.date,
                      time: event.time,
                      location: event.location
                    });
                    openWhatsAppDirect('', msg);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Broadcast WA</span>
                </motion.button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tab 2: Check-In QR */}
      {activeTab === 'checkin' && (
        <GlassCard className="p-8 text-center space-y-6 max-w-lg mx-auto" glow="emerald" hoverEffect={false}>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <QrCode className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">QR Code Scanner Presensi Kajian</h3>
            <p className="text-xs text-slate-500 mt-1">Pindai QR kupon peserta untuk konfirmasi kehadiran otomatis</p>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Masukkan kode ID QR peserta (Contoh: REG-001)..."
              value={scannedCode}
              onChange={(e) => {
                setScannedCode(e.target.value);
                setIsCheckedIn(false);
              }}
              className="w-full px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-center font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSimulateScan}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all"
            >
              Verifikasi Presensi Kehadiran
            </motion.button>
          </div>

          {isCheckedIn && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Presensi Berhasil Diverifikasi!</span>
            </motion.div>
          )}
        </GlassCard>
      )}

      {/* Tab 3: Certificate */}
      {activeTab === 'certificate' && (
        <GlassCard className="p-8 text-center space-y-4 max-w-lg mx-auto" glow="gold" hoverEffect={false}>
          <Award className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Generator E-Sertifikat Otomatis DKM</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Sertifikat digital otomatis diterbitkan untuk seluruh peserta pelatihan, seminar, atau kajian Masjid Nurul Iman.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast('E-Sertifikat berhasil di-generate secara massal!', 'success')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs rounded-2xl shadow-md"
          >
            Generate E-Sertifikat PDF
          </motion.button>
        </GlassCard>
      )}
    </div>
  );
};
