import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { Heart, Plus, QrCode, Download, X } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { DonorRecord, QurbanParticipant } from '../../types';

export const DonasiZakatWakafQurbanModule: React.FC = () => {
  const {
    campaigns,
    donorRecords,
    qurbanParticipants,
    addQurbanParticipant,
    toggleQurbanDistributed,
    openExportModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'donors' | 'qurban'>('campaigns');
  const [isAddQurbanOpen, setIsAddQurbanOpen] = useState(false);

  // Form State Qurban
  const [participantName, setParticipantName] = useState('');
  const [animalType, setAnimalType] = useState<'Sapi' | 'Kambing' | 'Domba Super'>('Sapi');
  const [phone, setPhone] = useState('');
  const [qurbanAmount] = useState<number>(3800000);

  const handleAddQurban = (e: React.FormEvent) => {
    e.preventDefault();
    addQurbanParticipant({
      participantName,
      animalType,
      phone,
      amount: Number(qurbanAmount),
      paymentStatus: 'Lunas'
    });
    setIsAddQurbanOpen(false);
    setParticipantName('');
    setPhone('');
  };

  const donorColumns: DataTableColumn<DonorRecord>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-slate-500 font-bold whitespace-nowrap' },
    { key: 'donorName', header: 'Nama Donatur', className: 'font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap' },
    { key: 'campaignTitle', header: 'Program' },
    {
      key: 'amount',
      header: 'Jumlah (Rp)',
      className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap',
      render: (d) => `Rp ${d.amount.toLocaleString('id-ID')}`
    },
    { key: 'method', header: 'Metode', className: 'font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap' },
    { key: 'date', header: 'Tanggal', className: 'text-slate-500 font-mono whitespace-nowrap' },
    {
      key: 'status',
      header: 'Status',
      className: 'text-center whitespace-nowrap',
      render: (d) => (
        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-[10px] border border-emerald-500/20 whitespace-nowrap">
          {d.status}
        </span>
      )
    }
  ];

  const qurbanColumns: DataTableColumn<QurbanParticipant>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-slate-500 font-bold whitespace-nowrap' },
    { key: 'participantName', header: 'Nama Peserta', className: 'font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap' },
    {
      key: 'animalType',
      header: 'Jenis Hewan',
      className: 'whitespace-nowrap',
      render: (q) => (
        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold rounded-full text-[10px] border border-amber-500/20 whitespace-nowrap">
          {q.animalType}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Nominal (Rp)',
      className: 'font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap',
      render: (q) => `Rp ${q.amount.toLocaleString('id-ID')}`
    },
    {
      key: 'couponCode',
      header: 'Kode Kupon',
      className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap',
      render: (q) => (
        <span className="inline-flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
          <QrCode className="w-4 h-4" /> {q.couponCode}
        </span>
      )
    },
    {
      key: 'isDistributed',
      header: 'Status Distribusi Daging',
      className: 'text-center whitespace-nowrap',
      render: (q) => (
        <button
          onClick={() => toggleQurbanDistributed(q.id)}
          className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
            q.isDistributed
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {q.isDistributed ? 'Sudah Diambil / Diterima' : 'Tandai Sudah Diambil'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Modul Donasi, Zakat, Wakaf & Qurban</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kelola Program Campaign Donasi, Verifikasi Bukti Transfer & Panitia Qurban</p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Data Donatur & Peserta Qurban', qurbanParticipants)}
            className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Tabs */}
      <FilterTabs
        tabs={[
          { id: 'campaigns', label: 'Program Campaign Donasi' },
          { id: 'donors', label: 'Riwayat Donatur' },
          { id: 'qurban', label: 'Manajemen Qurban & Kupon QR' }
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((cmp, idx) => (
            <GlassCard
              key={cmp.id}
              className="p-6 space-y-4 flex flex-col justify-between"
              glow="emerald"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full uppercase border border-emerald-500/20">
                  {cmp.category}
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">{cmp.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{cmp.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Terkumpul: Rp {cmp.collectedAmount.toLocaleString('id-ID')} / Rp {cmp.targetAmount.toLocaleString('id-ID')}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (cmp.collectedAmount / cmp.targetAmount) * 100)}%` }}
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tab 2: Donors */}
      {activeTab === 'donors' && (
        <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
          <DataTable columns={donorColumns} data={donorRecords} keyField="id" minWidth="min-w-[880px]" />
        </GlassCard>
      )}

      {/* Tab 3: Qurban */}
      {activeTab === 'qurban' && (
        <GlassCard className="p-6 space-y-5" glow="emerald" hoverEffect={false}>
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Data Peserta Qurban & Kupon Distribusi QR Code
            </h3>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddQurbanOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Daftar Peserta Qurban</span>
            </motion.button>
          </div>

          <DataTable columns={qurbanColumns} data={qurbanParticipants} keyField="id" minWidth="min-w-[900px]" />
        </GlassCard>
      )}

      {/* Modal Add Qurban */}
      <AnimatePresence>
        {isAddQurbanOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Pendaftaran Qurban Baru</h3>
                <button onClick={() => setIsAddQurbanOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddQurban} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nama Shohibul Qurban</label>
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Contoh: Bpk. H. Bambang Sugipto"
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Jenis Hewan Qurban</label>
                  <select
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Sapi">Sapi (1/7 Sapi - Rp 3.800.000)</option>
                    <option value="Kambing">Kambing Premium - Rp 3.500.000</option>
                    <option value="Domba Super">Domba Super - Rp 4.200.000</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md">
                  Simpan & Generate Kupon QR
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
