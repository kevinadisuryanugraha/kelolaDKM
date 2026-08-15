import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_DOCUMENTS } from '../../data/mockData';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { FileText, Plus, Download, X } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { OfficialLetter } from '../../types';

export const SuratDokumenModule: React.FC = () => {
  const { letters, addLetter, openExportModal } = useApp();

  const [activeTab, setActiveTab] = useState<'surat' | 'arsip'>('surat');
  const [isAddLetterOpen, setIsAddLetterOpen] = useState(false);

  // Form State
  const [letterNumber, setLetterNumber] = useState('048/DKM-NI/PJM/VII/2026');
  const [type, setType] = useState<'Masuk' | 'Keluar'>('Keluar');
  const [senderOrRecipient, setSenderOrRecipient] = useState('');
  const [subject, setSubject] = useState('');

  const handleAddLetter = (e: React.FormEvent) => {
    e.preventDefault();
    addLetter({
      letterNumber,
      type,
      senderOrRecipient,
      subject,
      date: new Date().toISOString().slice(0, 10),
      dispositionTo: 'Ketua DKM & Sekretaris'
    });
    setIsAddLetterOpen(false);
    setSubject('');
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

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddLetterOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Registrasi Surat Baru</span>
        </motion.button>
      </GlassCard>

      {/* Tabs */}
      <FilterTabs
        tabs={[
          { id: 'surat', label: 'Surat Masuk & Keluar' },
          { id: 'arsip', label: 'Arsip Dokumen Legalitas & SK' }
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

      {/* Modal Add Letter */}
      <AnimatePresence>
        {isAddLetterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Registrasi Surat Baru</h3>
                <button onClick={() => setIsAddLetterOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddLetter} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nomor Surat</label>
                  <input
                    type="text"
                    value={letterNumber}
                    onChange={(e) => setLetterNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Tipe Surat</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white"
                  >
                    <option value="Masuk">Surat Masuk</option>
                    <option value="Keluar">Surat Keluar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Pengirim / Tujuan Surat</label>
                  <input
                    type="text"
                    placeholder="Contoh: KUA Kecamatan Pasar Minggu"
                    value={senderOrRecipient}
                    onChange={(e) => setSenderOrRecipient(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Perihal / Subjek</label>
                  <input
                    type="text"
                    placeholder="Keterangan perihal surat..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md">
                  Simpan Registrasi Surat
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
