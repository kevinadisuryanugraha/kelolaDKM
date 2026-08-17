import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_DOCUMENTS } from '../../data/mockData';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  FileText,
  Plus,
  Download,
  X,
  ArrowLeft,
  ChevronRight,
  Save,
  Send,
  Inbox,
  UserCheck,
  Building,
  Calendar,
  FileCheck2
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { OfficialLetter } from '../../types';

export const SuratDokumenModule: React.FC = () => {
  const { letters, addLetter, openExportModal, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'surat' | 'arsip'>('surat');
  const [isAddLetterView, setIsAddLetterView] = useState(false);

  // Form State
  const [letterNumber, setLetterNumber] = useState('049/DKM-NI/PJM/VIII/2026');
  const [type, setType] = useState<'Masuk' | 'Keluar'>('Keluar');
  const [senderOrRecipient, setSenderOrRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [dispositionTo, setDispositionTo] = useState('Ketua DKM & Sekretaris');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleAddLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterNumber.trim() || !senderOrRecipient.trim() || !subject.trim()) {
      showToast('Nomor surat, pengirim/tujuan, dan perihal wajib diisi!', 'error');
      return;
    }

    addLetter({
      letterNumber,
      type,
      senderOrRecipient,
      subject,
      date,
      dispositionTo: dispositionTo || 'Ketua DKM & Sekretaris'
    });
    setIsAddLetterView(false);
    setSubject('');
    setSenderOrRecipient('');
    showToast(`Surat ${type} dengan nomor ${letterNumber} berhasil diregistrasi!`, 'success');
  };

  const letterColumns: DataTableColumn<OfficialLetter>[] = [
    {
      key: 'letterNumber',
      header: 'Nomor Surat',
      className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-[11px]'
    },
    {
      key: 'type',
      header: 'Tipe',
      className: 'whitespace-nowrap',
      render: (l) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
          l.type === 'Masuk'
            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20'
            : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
        }`}>
          Surat {l.type}
        </span>
      )
    },
    {
      key: 'senderOrRecipient',
      header: 'Pengirim / Penerima',
      className: 'font-bold text-slate-900 dark:text-slate-100 text-xs'
    },
    {
      key: 'subject',
      header: 'Perihal / Subjek',
      className: 'text-slate-700 dark:text-slate-300 font-medium text-xs leading-snug'
    },
    {
      key: 'date',
      header: 'Tanggal',
      className: 'font-mono text-slate-500 font-bold whitespace-nowrap text-[11px]'
    },
    {
      key: 'dispositionTo',
      header: 'Disposisi',
      className: 'text-slate-500 font-medium text-xs whitespace-nowrap'
    },
    {
      key: 'status',
      header: 'Status',
      className: 'text-center whitespace-nowrap',
      render: (l) => (
        <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-[10px] border border-emerald-500/20 whitespace-nowrap">
          {l.status}
        </span>
      )
    }
  ];

  // Dedicated Full-Page Form View for Adding New Official Letter
  if (isAddLetterView) {
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsAddLetterView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Buku Agenda Persuratan</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Persuratan</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Registrasi Surat & Disposisi Baru</span>
          </div>
        </div>

        {/* Full-Page Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Formulir Registrasi Surat Resmi DKM</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Catat surat masuk atau surat keluar resmi masjid, rekam nomor registrasi, perihal, dan alur disposisi.
              </p>
            </div>

            <form onSubmit={handleAddLetter} className="space-y-5 text-xs">
              {/* Type Selector Toggle */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Tipe Persuratan *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('Masuk')}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                      type === 'Masuk'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500/40'
                    }`}
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Surat Masuk (Eksternal)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('Keluar')}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                      type === 'Keluar'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-500/40'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Surat Keluar (Resmi DKM)</span>
                  </button>
                </div>
              </div>

              {/* Letter Number & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nomor Registrasi Surat *
                  </label>
                  <input
                    type="text"
                    value={letterNumber}
                    onChange={(e) => setLetterNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Tanggal Surat</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Sender / Recipient */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {type === 'Masuk' ? 'Instansi Pengirim / Asal Surat *' : 'Tujuan / Instansi Penerima Surat *'}
                </label>
                <input
                  type="text"
                  placeholder={type === 'Masuk' ? 'Contoh: Kantor Urusan Agama (KUA) Kec. Pasar Minggu' : 'Contoh: Camat Pasar Minggu / Lurah Pejaten Timur'}
                  value={senderOrRecipient}
                  onChange={(e) => setSenderOrRecipient(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Perihal / Pokok Isi Surat *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Undangan Koordinasi PHBI & Taklim Akbar Maulid Nabi"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Disposition Target */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tindak Lanjut / Lembar Disposisi Kepada
                </label>
                <select
                  value={dispositionTo}
                  onChange={(e) => setDispositionTo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Ketua DKM & Sekretaris">Ketua DKM & Sekretaris</option>
                  <option value="Bendahara DKM">Bendahara DKM (Verifikasi Anggaran)</option>
                  <option value="Divisi Dakwah & Ibadah">Divisi Dakwah & Ibadah</option>
                  <option value="Divisi Sarana Prasarana">Divisi Sarana Prasarana</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLetterView(false)}
                  className="px-5 py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-xs rounded-2xl"
                >
                  Batal
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-2xl text-xs shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Registrasi Dokumen</span>
                </motion.button>
              </div>
            </form>
          </GlassCard>

          {/* Right: Disposition Sheet Preview */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Simulasi Lembar Disposisi Surat</span>
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 text-xs">
                <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-[10px] px-2.5 py-0.5 bg-blue-600 text-white font-bold rounded-full">
                    KOP RESMI DKM MASJID JAMI NURUL IMAN
                  </span>
                  <div className="font-mono text-[11px] text-slate-500 mt-1">No. {letterNumber}</div>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kategori:</span>
                    <span className="font-bold text-blue-600">Surat {type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{type === 'Masuk' ? 'Pengirim:' : 'Tujuan:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{senderOrRecipient || '[Instansi / Pihak]'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Perihal:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{subject || '[Perihal Surat]'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Disposisi Ke:</span>
                    <span className="font-bold text-emerald-600">{dispositionTo}</span>
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
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Modul Persuratan, Disposisi & Arsip Dokumen</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Registrasi Surat Masuk/Keluar, Lembar Disposisi, AD ART & Proposal</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('surat');
              setIsAddLetterView(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi Surat Baru</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Buku Agenda Persuratan DKM', letters)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export Agenda</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Tabs */}
      <FilterTabs
        tabs={[
          { id: 'surat', labelKey: 'dashboard.tabs.letters' },
          { id: 'arsip', labelKey: 'dashboard.tabs.documents' }
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Surat Table */}
      {activeTab === 'surat' && (
        <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
          <DataTable columns={letterColumns} data={letters} keyField="id" minWidth="w-full min-w-[750px]" />
        </GlassCard>
      )}

      {/* Tab 2: Arsip */}
      {activeTab === 'arsip' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFICIAL_DOCUMENTS.map((doc, idx) => (
            <GlassCard
              key={doc.id}
              className="p-5 space-y-3 flex flex-col justify-between"
              glow="emerald"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <div className="space-y-1.5">
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-[10px] rounded-full border border-amber-400/30">
                  {doc.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">{doc.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium">Ukuran File: {doc.fileSize}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openExportModal(`Unduh Arsip: ${doc.title}`, [doc])}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File PDF</span>
              </motion.button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
