import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { DollarSign, Plus, CheckCircle, Download, X, RefreshCw, CheckCircle2, ShieldCheck, PieChart, Landmark, Printer, ArrowLeft, Save, ChevronRight, FileText } from 'lucide-react';
import { FinancialTransaction, FinancialAccount } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { printOfficialReceipt } from '../../utils/exportOfficialDoc';

const KEUANGAN_TABS = [
  { id: 'kas', labelKey: 'dashboard.tabs.kas' },
  { id: 'coa', labelKey: 'dashboard.tabs.coa' },
  { id: 'jurnal', labelKey: 'dashboard.tabs.jurnal' },
  { id: 'anggaran', labelKey: 'dashboard.tabs.anggaran' },
  { id: 'rekonsiliasi', labelKey: 'dashboard.tabs.rekonsiliasi' }
];

interface JournalRow {
  id: string;
  refNumber: string;
  date: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

interface BankReconcileItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  ledgerBalance: number;
  bankBalance: number;
  lastSynced: string;
  status: 'Matched' | 'Pending';
}

export const KeuanganModule: React.FC = () => {
  const { transactions, addTransaction, approveTransaction, accounts, budgets, openExportModal, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<string>('kas');
  const [isCreateTxView, setIsCreateTxView] = useState(false);

  // Form State
  const [type, setType] = useState<'Masuk' | 'Keluar'>('Masuk');
  const [accountCode, setAccountCode] = useState('401.1');
  const [amount, setAmount] = useState<number>(1000000);
  const [description, setDescription] = useState('');

  // Reconcile state
  const [reconcileList, setReconcileList] = useState<BankReconcileItem[]>([
    {
      id: 'REC-01',
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '711-2233-445',
      accountName: 'Kas Bank & QRIS Operasional DKM',
      ledgerBalance: 8990000,
      bankBalance: 8990000,
      lastSynced: '2026-08-20 18:30',
      status: 'Matched'
    },
    {
      id: 'REC-02',
      bankName: 'Brankas Tunai Masjid',
      accountNumber: 'KAS-FISIK-01',
      accountName: 'Kas Tunai (Brankas DKM)',
      ledgerBalance: 118454,
      bankBalance: 118454,
      lastSynced: '2026-08-20 18:30',
      status: 'Matched'
    }
  ]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const coaObj = accounts.find((c) => c.code === accountCode);
    addTransaction({
      date: new Date().toISOString().slice(0, 10),
      type,
      accountCode,
      accountName: coaObj ? coaObj.name : 'Kas Utama',
      description,
      amount: Number(amount),
      category: type === 'Masuk' ? 'Infaq / Donasi' : 'Operasional',
      recordedBy: 'Bendahara DKM'
    });
    setIsCreateTxView(false);
    setDescription('');
    showToast('Transaksi kas baru berhasil dicatat dan masuk status Pending Approval', 'success');
  };

  const handleSyncBank = (id: string) => {
    setReconcileList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, lastSynced: new Date().toLocaleString('id-ID'), status: 'Matched' }
          : item
      )
    );
    showToast('Rekonsiliasi saldo bank berhasil disinkronkan dengan mutasi mutakhir', 'success');
  };

  // ────────── Generate Double-Entry Journal Rows ──────────
  const journalRows: JournalRow[] = [];
  transactions.forEach((tx) => {
    const isBankOrQris = tx.accountCode.startsWith('401.4') || tx.accountCode === '102.1' || tx.description.toLowerCase().includes('qris') || tx.description.toLowerCase().includes('bank') || tx.description.toLowerCase().includes('transfer');
    const cashAccountCode = isBankOrQris ? '102.1' : '101.1';
    const cashAccountName = isBankOrQris ? 'Bank BSI & QRIS Operasional' : 'Kas Tunai (Brankas DKM)';

    if (tx.type === 'Masuk') {
      // Debit: Kas / Bank, Credit: Income Account (tx.accountCode)
      journalRows.push({
        id: `${tx.id}-D`,
        refNumber: tx.refNumber || tx.id,
        date: tx.date,
        accountCode: cashAccountCode,
        accountName: cashAccountName,
        description: tx.description,
        debit: tx.amount,
        credit: 0
      });
      journalRows.push({
        id: `${tx.id}-C`,
        refNumber: tx.refNumber || tx.id,
        date: tx.date,
        accountCode: tx.accountCode,
        accountName: tx.accountName,
        description: tx.description,
        debit: 0,
        credit: tx.amount
      });
    } else {
      // Debit: Expense Account (tx.accountCode), Credit: Kas / Bank
      journalRows.push({
        id: `${tx.id}-D`,
        refNumber: tx.refNumber || tx.id,
        date: tx.date,
        accountCode: tx.accountCode,
        accountName: tx.accountName,
        description: tx.description,
        debit: tx.amount,
        credit: 0
      });
      journalRows.push({
        id: `${tx.id}-C`,
        refNumber: tx.refNumber || tx.id,
        date: tx.date,
        accountCode: cashAccountCode,
        accountName: cashAccountName,
        description: tx.description,
        debit: 0,
        credit: tx.amount
      });
    }
  });

  // ────────── Column definitions ──────────

  const txColumns: DataTableColumn<FinancialTransaction>[] = [
    { key: 'refNumber', header: 'Ref ID', className: 'font-mono text-slate-500 font-bold whitespace-nowrap' },
    { key: 'date', header: 'Tanggal', className: 'font-semibold whitespace-nowrap' },
    {
      key: 'accountCode',
      header: 'Akun COA',
      render: (tx) => (
        <>
          <span className="font-bold text-slate-900 dark:text-slate-100">{tx.accountCode}</span>
          <span className="text-[10px] text-slate-400 block font-medium truncate max-w-[140px]">{tx.accountName}</span>
        </>
      )
    },
    { key: 'description', header: 'Deskripsi Keterangan' },
    {
      key: 'amount',
      header: 'Jumlah (Rp)',
      className: 'font-mono font-bold whitespace-nowrap',
      render: (tx) => (
        <span className={tx.type === 'Masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
          {tx.type === 'Masuk' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
        </span>
      )
    },
    { key: 'recordedBy', header: 'Oleh', className: 'text-slate-500 font-medium whitespace-nowrap' },
    {
      key: 'status',
      header: 'Status Approval',
      className: 'text-center whitespace-nowrap',
      render: (tx) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
          tx.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
        }`}>
          {tx.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Aksi & Kwitansi',
      className: 'text-center whitespace-nowrap',
      render: (tx) => (
        <div className="flex items-center justify-center gap-1.5">
          {tx.type === 'Masuk' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                printOfficialReceipt({
                  refNumber: tx.refNumber || tx.id,
                  donorName: tx.description,
                  amount: tx.amount,
                  category: tx.category,
                  date: tx.date,
                  notes: tx.accountName,
                  recordedBy: tx.recordedBy
                });
                showToast(`Mencetak kwitansi resmi untuk ${tx.refNumber || tx.id}`, 'info');
              }}
              title="Cetak Kwitansi Sah DKM"
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kwitansi</span>
            </motion.button>
          )}
          {tx.status === 'Pending' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { approveTransaction(tx.id); showToast('Transaksi berhasil di-approve', 'success'); }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-xl shadow-xs"
            >
              Approve
            </motion.button>
          ) : (
            tx.type !== 'Masuk' && <CheckCircle className="w-4 h-4 text-emerald-600" />
          )}
        </div>
      )
    }
  ];

  const coaColumns: DataTableColumn<FinancialAccount>[] = [
    { key: 'code', header: 'Kode COA', className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap' },
    { key: 'name', header: 'Nama Akun / Rekening Buku Besar', className: 'font-bold text-slate-900 dark:text-slate-100' },
    {
      key: 'type',
      header: 'Klasifikasi Akun',
      render: (acc) => (
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
          {acc.type}
        </span>
      )
    },
    {
      key: 'balance',
      header: 'Saldo Akun (Rp)',
      className: 'text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap',
      render: (acc) => `Rp ${acc.balance.toLocaleString('id-ID')}`
    }
  ];

  const journalColumns: DataTableColumn<JournalRow>[] = [
    { key: 'refNumber', header: 'Ref Jurnal', className: 'font-mono text-slate-500 font-bold whitespace-nowrap' },
    { key: 'date', header: 'Tanggal', className: 'font-semibold whitespace-nowrap' },
    {
      key: 'accountCode',
      header: 'Kode & Nama Akun',
      render: (j) => (
        <div>
          <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{j.accountCode}</span>
          <span className="text-slate-900 dark:text-white font-medium text-xs ml-2">{j.accountName}</span>
        </div>
      )
    },
    { key: 'description', header: 'Keterangan Jurnal' },
    {
      key: 'debit',
      header: 'Debit (Rp)',
      className: 'text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap',
      render: (j) => (j.debit > 0 ? `Rp ${j.debit.toLocaleString('id-ID')}` : '-')
    },
    {
      key: 'credit',
      header: 'Kredit (Rp)',
      className: 'text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap',
      render: (j) => (j.credit > 0 ? `Rp ${j.credit.toLocaleString('id-ID')}` : '-')
    }
  ];

  const reconcileColumns: DataTableColumn<BankReconcileItem>[] = [
    {
      key: 'bankName',
      header: 'Bank & Rekening',
      render: (r) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-emerald-600" /> {r.bankName}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">No. {r.accountNumber} • {r.accountName}</div>
        </div>
      )
    },
    {
      key: 'ledgerBalance',
      header: 'Saldo Buku Besar DKM',
      className: 'font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap',
      render: (r) => `Rp ${r.ledgerBalance.toLocaleString('id-ID')}`
    },
    {
      key: 'bankBalance',
      header: 'Saldo Rekening Bank',
      className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap',
      render: (r) => `Rp ${r.bankBalance.toLocaleString('id-ID')}`
    },
    {
      key: 'status',
      header: 'Status Sinkron',
      className: 'text-center whitespace-nowrap',
      render: (r) => (
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/20 inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> {r.status} (Selisih Rp 0)
        </span>
      )
    },
    {
      key: 'lastSynced',
      header: 'Terakhir Dihubungkan',
      className: 'text-xs text-slate-500 font-mono whitespace-nowrap'
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'text-center whitespace-nowrap',
      render: (r) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSyncBank(r.id)}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 mx-auto"
        >
          <RefreshCw className="w-3 h-3 text-emerald-600" /> Sync Bank
        </motion.button>
      )
    }
  ];

  // ────────── Render ──────────

  if (isCreateTxView) {
    const selectedCoa = accounts.find((c) => c.code === accountCode);
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsCreateTxView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Buku Kas & Jurnal</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Keuangan</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Formulir Pencatatan Transaksi Kas Baru</span>
          </div>
        </div>

        {/* Full-Page Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span>Formulir Pencatatan Transaksi Kas DKM</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Catat penerimaan infaq/donasi atau pengeluaran operasional masjid secara resmi berstandar akuntansi syariah.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5 text-xs">
              {/* Type Toggle */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Jenis Arus Kas *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setType('Masuk');
                      setAccountCode('401.1');
                    }}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                      type === 'Masuk'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500/40'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${type === 'Masuk' ? 'text-white' : 'text-emerald-600'}`} />
                    <span>Kas Masuk (Penerimaan Infaq / ZIS)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType('Keluar');
                      setAccountCode('501.1');
                    }}
                    className={`py-3.5 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                      type === 'Keluar'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-500/40'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${type === 'Keluar' ? 'text-white' : 'text-rose-600'}`} />
                    <span>Kas Keluar (Operasional / Biaya)</span>
                  </button>
                </div>
              </div>

              {/* COA Account */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pos Akun Anggaran (Chart of Accounts - COA) *
                </label>
                <select
                  value={accountCode}
                  onChange={(e) => setAccountCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  {accounts
                    .filter((c) => (type === 'Masuk' ? c.category === 'Pendapatan' || c.code.startsWith('4') : c.category === 'Beban' || c.code.startsWith('5')))
                    .map((c) => (
                      <option key={c.code} value={c.code}>
                        [{c.code}] {c.name} — {c.category}
                      </option>
                    ))}
                  {accounts
                    .filter((c) => !(type === 'Masuk' ? c.category === 'Pendapatan' || c.code.startsWith('4') : c.category === 'Beban' || c.code.startsWith('5')))
                    .map((c) => (
                      <option key={c.code} value={c.code}>
                        [{c.code}] {c.name} — {c.category}
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nominal Transaksi (Rupiah) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                    Rp
                  </div>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  Terbilang: <span className="font-mono text-emerald-600 dark:text-emerald-400">Rp {amount.toLocaleString('id-ID')}</span>
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Keterangan & Rincian Transaksi *
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Penerimaan Kotak Infaq Sholat Jumat Pekan ke-3 / Pembelian Perlengkapan Sound System"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateTxView(false)}
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
                  <span>Simpan & Catat ke Jurnal Kas</span>
                </motion.button>
              </div>
            </form>
          </GlassCard>

          {/* Right: Live Double-Entry Journal Analysis Preview */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Entri Jurnal Berpasangan (Double-Entry)</span>
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">Jenis Jurnal:</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${type === 'Masuk' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    {type === 'Masuk' ? 'Penerimaan Kas (Debit Kas)' : 'Pengeluaran Kas (Kredit Kas)'}
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {type === 'Masuk' ? '[101.1] Kas Utama & Bank (Debit)' : `[${accountCode}] ${selectedCoa?.name || 'Beban Operasional'} (Debit)`}
                    </span>
                    <span className="font-bold text-emerald-600">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {type === 'Masuk' ? `[${accountCode}] ${selectedCoa?.name || 'Pendapatan'} (Kredit)` : '[101.1] Kas Utama & Bank (Kredit)'}
                    </span>
                    <span className="font-bold text-slate-500">Rp {amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
                  ✓ Neraca Pembukuan Seimbang (Balance Rp {amount.toLocaleString('id-ID')}). Transaksi otomatis dicatat dengan stempel otorisasi Bendahara DKM.
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
            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Akuntansi & Pembukuan Kas DKM</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Sistem akuntansi berpasangan (*double-entry*), COA, Jurnal Umum, Buku Besar, Anggaran RAB & Rekonsiliasi Bank.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateTxView(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Catat Transaksi Kas</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Laporan Akuntansi & Jurnal Umum DKM', transactions)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Laporan</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Navigation Filter Tabs */}
      <FilterTabs tabs={KEUANGAN_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Kas Masuk / Keluar */}
      {activeTab === 'kas' && (
        <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
          <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Buku Transaksi Kas Utama</h3>
              <p className="text-xs text-slate-500">Catatan penerimaan infaq/donasi & pengeluaran operasional DKM</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
              {transactions.length} Records
            </span>
          </div>
          <DataTable columns={txColumns} data={transactions} keyField="id" minWidth="w-full min-w-[750px]" />
        </GlassCard>
      )}

      {/* Tab 2: COA (Chart of Accounts) */}
      {activeTab === 'coa' && (
        <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Chart of Accounts (COA) Standard DKM</h3>
            <p className="text-xs text-slate-500">Bagan akun standar akuntansi masjid untuk Aset, Penerimaan, dan Pengeluaran</p>
          </div>
          <DataTable columns={coaColumns} data={accounts} keyField="code" minWidth="w-full min-w-[650px]" />
        </GlassCard>
      )}

      {/* Tab 3: Jurnal Umum & Buku Besar */}
      {activeTab === 'jurnal' && (
        <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Jurnal Umum & Buku Besar (*Double-Entry*)</h3>
              <p className="text-xs text-slate-500">Catatan pencatatan berpasangan Debit dan Kredit otomatis sesuai prinsip akuntansi syariah</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-500/20">
              {journalRows.length} Journal Entries
            </span>
          </div>
          <DataTable columns={journalColumns} data={journalRows} keyField="id" minWidth="w-full min-w-[700px]" />
        </GlassCard>
      )}

      {/* Tab 4: Anggaran vs Realisasi (RAB) */}
      {activeTab === 'anggaran' && (
        <GlassCard className="p-6 space-y-6" glow="emerald" hoverEffect={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" /> Rencana Anggaran Biaya (RAB) vs Realisasi 2026
              </h3>
              <p className="text-xs text-slate-500">Monitoring daya serap anggaran program operasional dan pembangunan DKM</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block text-[10px]">Total Anggaran:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Rp {budgets.reduce((sum, b) => sum + b.allocatedAmount, 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-600 dark:text-emerald-400 block text-[10px]">Total Terpakai:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                  Rp {budgets.reduce((sum, b) => sum + b.usedAmount, 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {budgets.map((bg) => {
              const p = Math.round((bg.usedAmount / bg.allocatedAmount) * 100);
              return (
                <div key={bg.id} className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
                    <span className="text-slate-900 dark:text-white text-sm">{bg.category}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      Realisasi: Rp {bg.usedAmount.toLocaleString('id-ID')} / Target RAB: Rp {bg.allocatedAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-200 dark:border-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                    <span>Periode Anggaran: {bg.period}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{p}% Daya Serap Terpakai</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Tab 5: Rekonsiliasi Bank */}
      {activeTab === 'rekonsiliasi' && (
        <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" /> Rekonsiliasi Bank & Kas Masjid
            </h3>
            <p className="text-xs text-slate-500">Pencocokan saldo catatan internal pembukuan DKM dengan saldo rill rekening bank perbankan syariah</p>
          </div>
          <DataTable columns={reconcileColumns} data={reconcileList} keyField="id" minWidth="w-full min-w-[700px]" />
        </GlassCard>
      )}
    </div>
  );
};
