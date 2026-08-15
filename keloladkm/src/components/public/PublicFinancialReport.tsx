import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { MASJID_INFO } from '../../data/mockData';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { FinancialTransaction } from '../../types';

export const PublicFinancialReport: React.FC = () => {
  const { transactions, openExportModal } = useApp();

  const totalMasuk = transactions.filter((t) => t.type === 'Masuk').reduce((acc, t) => acc + t.amount, 0);
  const totalKeluar = transactions.filter((t) => t.type === 'Keluar').reduce((acc, t) => acc + t.amount, 0);
  const totalSaldo = MASJID_INFO.stats.totalKas;

  const chartData = [
    { month: 'Pekan I Juli', Pemasukan: 18500000, Pengeluaran: 6200000 },
    { month: 'Pekan II Juli', Pemasukan: 24000000, Pengeluaran: 8400000 },
    { month: 'Pekan III Juli', Pemasukan: 21500000, Pengeluaran: 5100000 },
    { month: 'Pekan IV Juli', Pemasukan: 28450000, Pengeluaran: 4650000 }
  ];

  const transactionColumns: DataTableColumn<FinancialTransaction>[] = [
    { key: 'refNumber', header: 'Ref / No', className: 'font-mono text-slate-500 font-bold whitespace-nowrap' },
    { key: 'date', header: 'Tanggal', className: 'font-semibold whitespace-nowrap' },
    {
      key: 'category',
      header: 'Kategori',
      className: 'whitespace-nowrap',
      render: (tx) => (
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
          {tx.category}
        </span>
      )
    },
    { key: 'description', header: 'Keterangan', className: 'text-slate-700 dark:text-slate-300 font-medium' },
    {
      key: 'amount',
      header: 'Jumlah (Rp)',
      className: 'text-right whitespace-nowrap',
      render: (tx) => (
        <span className={`font-mono font-bold ${tx.type === 'Masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {tx.type === 'Masuk' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badge="Transparansi Kas 100%"
        title="Laporan Keuangan Kas Masjid Publik"
        subtitle="Dipublikasikan secara akuntabel setiap pekan untuk menjamin amanah infaq, sedekah, dan donasi jamaah Masjid Jami Nurul Iman."
        action={
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Laporan Keuangan Kas Masjid Publik Juli 2026', transactions)}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold rounded-2xl text-xs shadow-xl flex items-center gap-2 transition-all border border-amber-300"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF / Excel</span>
          </motion.button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center justify-between" glow="emerald">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Saldo Kas Utama</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-wide">
              Rp {totalSaldo.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">BSI & Kas Tunai Masjid</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center justify-between" glow="slate">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Pemasukan Bulan Ini</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-wide">
              Rp {totalMasuk.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">+14% dari pekan lalu</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center justify-between" glow="slate">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Pengeluaran Bulan Ini</span>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono tracking-wide">
              Rp {totalKeluar.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-400">Operasional & Maintenance</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/20">
            <TrendingDown className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Chart Section */}
      <GlassCard className="p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Grafik Tren Pemasukan vs Pengeluaran Kas (Juli 2026)
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}Jt`} />
              <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']} />
              <Bar dataKey="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Transaction Table */}
      <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Rincian Transaksi Kas Terbaru
          </h3>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {transactions.length} Transaksi Tercatat
          </span>
        </div>

        <DataTable columns={transactionColumns} data={transactions} keyField="id" minWidth="min-w-[800px]" />
      </GlassCard>
    </div>
  );
};
