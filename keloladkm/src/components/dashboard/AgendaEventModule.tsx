import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { FilterTabs } from '../common/FilterTabs';
import { Calendar, Plus, QrCode, Award, CheckCircle2, X } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const AgendaEventModule: React.FC = () => {
  const { kajianEvents, addKajianEvent, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'checkin' | 'certificate'>('events');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState('2026-08-10');
  const [time, setTime] = useState('08:30');
  const [location, setLocation] = useState('Ruang Utama Masjid');
  const [category, setCategory] = useState<'Tafsir' | 'Tematik' | 'Fiqh' | 'Akhlaq'>('Tematik');
  const [description, setDescription] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addKajianEvent({
      title,
      speaker,
      speakerTitle: 'Ustadz / Penceramah Tamu',
      date,
      time,
      location,
      category,
      description
    });
    setIsAddEventOpen(false);
    setTitle('');
  };

  const handleSimulateScan = () => {
    if (!scannedCode) return;
    setIsCheckedIn(true);
    showToast(`QR Check-In Sukses untuk Peserta: ${scannedCode}`, 'success');
  };

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
          onClick={() => setIsAddEventOpen(true)}
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
          {kajianEvents.map((ev, idx) => (
            <GlassCard
              key={ev.id}
              className="p-6 space-y-3 flex flex-col justify-between"
              glow="emerald"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full uppercase border border-emerald-500/20">
                    {ev.category}
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{ev.date} • {ev.time}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">{ev.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{ev.speaker} • {ev.location}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tab 2: Scanner Checkin */}
      {activeTab === 'checkin' && (
        <GlassCard className="p-8 max-w-lg mx-auto text-center space-y-5" glow="emerald" hoverEffect={false}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Simulasi QR Code Scanner Kamera</span>
          </h3>

          <div className="bg-slate-900 p-6 rounded-2xl border-2 border-dashed border-emerald-500/50 text-white space-y-3">
            <QrCode className="w-20 h-20 text-emerald-400 mx-auto animate-pulse" />
            <p className="text-xs text-slate-300 font-medium">Arahkan kamera ke QR Code Tiket / Kupon Peserta</p>
          </div>

          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Input Manual Kode Tiket Peserta (Atau Scan ID)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: TKT-2026-0891"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
              />
              <button
                onClick={handleSimulateScan}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shrink-0 shadow-md"
              >
                Scan Ticket
              </button>
            </div>
          </div>

          {isCheckedIn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-2xl border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>PRESENSI BERHASIL DICATAT DENGAN STATUS HADIR!</span>
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

      {/* Modal Add Event */}
      <AnimatePresence>
        {isAddEventOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Buat Agenda Kajian / Event Baru</h3>
                <button onClick={() => setIsAddEventOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Judul Agenda / Kajian</label>
                  <input
                    type="text"
                    placeholder="Judul kajian..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Penceramah / Ustadz</label>
                  <input
                    type="text"
                    placeholder="Nama ustadz..."
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Tanggal</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Jam WIB</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md">
                  Publikasikan Agenda
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
