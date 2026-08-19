import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  Heart,
  Plus,
  QrCode,
  Download,
  X,
  Printer,
  ArrowLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  UserCheck,
  Phone,
  Tag,
  Gift
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { DonorRecord, QurbanParticipant } from '../../types';
import { printOfficialReceipt } from '../../utils/exportOfficialDoc';

export const DonasiZakatWakafQurbanModule: React.FC = () => {
  const {
    campaigns,
    donorRecords,
    qurbanParticipants,
    addQurbanParticipant,
    toggleQurbanDistributed,
    openExportModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'donors' | 'qurban'>('campaigns');
  const [isAddQurbanView, setIsAddQurbanView] = useState(false);

  // Form State Qurban
  const [participantName, setParticipantName] = useState('');
  const [animalType, setAnimalType] = useState<'Sapi' | 'Kambing' | 'Domba Super'>('Sapi');
  const [phone, setPhone] = useState('');

  const getAnimalPrice = (type: string) => {
    switch (type) {
      case 'Sapi':
        return 3800000;
      case 'Kambing':
        return 3500000;
      case 'Domba Super':
        return 4200000;
      default:
        return 3500000;
    }
  };

  const handleAddQurban = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim() || !phone.trim()) {
      showToast('Nama shohibul qurban dan nomor WhatsApp wajib diisi!', 'error');
      return;
    }

    const price = getAnimalPrice(animalType);
    addQurbanParticipant({
      participantName,
      animalType,
      phone,
      amount: price,
      paymentStatus: 'Lunas'
    });
    setIsAddQurbanView(false);
    setParticipantName('');
    setPhone('');
    showToast(`Pendaftaran qurban atas nama ${participantName} berhasil disimpan & kupon QR siap dicetak!`, 'success');
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
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            d.status === 'Diterima'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}
        >
          {d.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Kwitansi',
      className: 'text-center whitespace-nowrap',
      render: (d) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            printOfficialReceipt({
              refNumber: d.id,
              donorName: d.donorName,
              amount: d.amount,
              category: d.campaignTitle,
              date: d.date
            });
          }}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 mx-auto border border-slate-200 dark:border-slate-700"
        >
          <Printer className="w-3 h-3 text-emerald-600" /> Cetak
        </motion.button>
      )
    }
  ];

  const qurbanColumns: DataTableColumn<QurbanParticipant>[] = [
    { key: 'couponCode', header: 'Kupon QR', className: 'font-mono font-bold text-amber-500 whitespace-nowrap' },
    { key: 'participantName', header: 'Shohibul Qurban', className: 'font-bold text-slate-900 dark:text-white whitespace-nowrap' },
    {
      key: 'animalType',
      header: 'Jenis Hewan',
      render: (q) => (
        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-[10px] whitespace-nowrap">
          {q.animalType}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Biaya Qurban',
      className: 'font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap',
      render: (q) => `Rp ${q.amount.toLocaleString('id-ID')}`
    },
    { key: 'phone', header: 'WhatsApp', className: 'font-mono text-slate-500 whitespace-nowrap' },
    {
      key: 'isDistributed',
      header: 'Distribusi Daging',
      className: 'text-center whitespace-nowrap',
      render: (q) => (
        <button
          onClick={() => toggleQurbanDistributed(q.id)}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
            q.isDistributed
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}
        >
          {q.isDistributed ? '✓ Daging Sudah Diambil' : '✕ Belum Diambil'}
        </button>
      )
    },
    {
      key: 'actions',
      header: 'Cetak Kupon',
      className: 'text-center whitespace-nowrap',
      render: (q) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            printOfficialReceipt({
              refNumber: q.couponCode,
              donorName: q.participantName,
              amount: q.amount,
              category: `Kupon Qurban 1448 H (${q.animalType})`,
              date: new Date().toISOString().slice(0, 10)
            });
          }}
          className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 mx-auto border border-amber-500/30"
        >
          <QrCode className="w-3 h-3 text-amber-500" /> Kupon QR
        </motion.button>
      )
    }
  ];

  // Dedicated Full-Page Form View for Qurban Registration
  if (isAddQurbanView) {
    const currentPrice = getAnimalPrice(animalType);
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsAddQurbanView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Data Qurban & ZISWAF</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Donasi & ZISWAF</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Pendaftaran Shohibul Qurban Baru</span>
          </div>
        </div>

        {/* Full-Page Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-amber-500" />
                <span>Formulir Pendaftaran Shohibul Qurban 1448 H</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Registrasi kepesertaan hewan qurban, generate kupon QR pengambilan daging, dan verifikasi status pelunasan.
              </p>
            </div>

            <form onSubmit={handleAddQurban} className="space-y-5 text-xs">
              {/* Participant Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap Shohibul Qurban (Pekurban) *
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Contoh: Bpk. H. Bambang Sugipto bin Soedarmo"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Animal Type Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Paket Hewan Qurban *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Sapi', label: '1/7 Sapi Berjamaah', price: 'Rp 3.800.000', badge: 'Terfavorit' },
                    { id: 'Kambing', label: 'Kambing Premium', price: 'Rp 3.500.000', badge: 'Standar' },
                    { id: 'Domba Super', label: 'Domba Super', price: 'Rp 4.200.000', badge: 'Super' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAnimalType(p.id as any)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        animalType === p.id
                          ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{p.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold">
                          {p.badge}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1">{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone / WA */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nomor WhatsApp Shohibul Qurban (Untuk Pengiriman E-Kupon) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddQurbanView(false)}
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
                  <span>Simpan & Terbitkan Kupon QR</span>
                </motion.button>
              </div>
            </form>
          </GlassCard>

          {/* Right: Summary Voucher Preview */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4" glow="gold" hoverEffect={false}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-500" />
                <span>Pratinjau E-Kupon Distribusi Qurban</span>
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-600 text-white font-bold rounded-full">
                    KUPON RESMI DKM 1448 H
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {participantName || '[Nama Shohibul Qurban]'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">ID Kupon Otomatis: QRB-{String(qurbanParticipants.length + 1).padStart(3, '0')}</p>
                </div>

                <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-3 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pilihan Hewan:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{animalType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Biaya:</span>
                    <span className="font-bold text-emerald-600">Rp {currentPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Pembayaran:</span>
                    <span className="font-bold text-emerald-600">✓ LUNAS</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-400/10 rounded-xl border border-amber-400/20 text-[11px] text-amber-900 dark:text-amber-300 font-medium leading-relaxed">
                  💡 Kupon QR ini dapat dipindai oleh Panitia Qurban pada Hari Tasyrik untuk validasi jatah 1/3 daging pekurban secara tertib dan akurat.
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
      {/* Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Donasi, Zakat, Wakaf & Qurban</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manajemen crowdfunding program masjid, database donatur / muzakki, dan kupon qurban QR Code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('qurban');
              setIsAddQurbanView(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Pendaftaran Qurban</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Laporan Donasi & ZISWAF DKM', donorRecords)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Data</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <FilterTabs
        tabs={[
          { id: 'campaigns', labelKey: 'dashboard.tabs.campaigns' },
          { id: 'donors', labelKey: 'dashboard.tabs.donors' },
          { id: 'qurban', labelKey: 'dashboard.tabs.qurban' }
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* Tab 1: Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((cmp) => (
            <GlassCard key={cmp.id} className="p-6 space-y-4" glow="emerald">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {cmp.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">Hingga: {cmp.endDate}</span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{cmp.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cmp.description}</p>
              </div>

              <div className="space-y-1.5 pt-2">
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
              onClick={() => setIsAddQurbanView(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Daftar Peserta Qurban</span>
            </motion.button>
          </div>

          <DataTable columns={qurbanColumns} data={qurbanParticipants} keyField="id" minWidth="min-w-[900px]" />
        </GlassCard>
      )}
    </div>
  );
};
