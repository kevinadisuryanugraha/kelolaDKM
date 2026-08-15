import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/I18nContext';
import { MASJID_INFO, PRAYER_TIMES_TODAY } from '../../data/mockData';
import {
  LayoutDashboard,
  DollarSign,
  Heart,
  Package,
  Calendar,
  FileText,
  Users,
  Globe,
  Send,
  Shield,
  Clock,
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { KeuanganModule } from './KeuanganModule';
import { DonasiZakatWakafQurbanModule } from './DonasiZakatWakafQurbanModule';
import { InventarisSarprasModule } from './InventarisSarprasModule';
import { AgendaEventModule } from './AgendaEventModule';
import { SuratDokumenModule } from './SuratDokumenModule';

import { WebsiteCMSModule } from './WebsiteCMSModule';
import { BroadcastNotificationModule } from './BroadcastNotificationModule';
import { AuditLogModule } from './AuditLogModule';
import { SimpleChart } from '../common/SimpleChart';
import { GlassCard } from '../common/GlassCard';
import { BentoGrid, BentoItem } from '../common/BentoGrid';

export const DashboardMain: React.FC = () => {
  const {
    dashboardSubTab,
    setDashboardSubTab,
    currentRole,
    setActiveAppTab,
    logout,
    authUser,
    transactions,
    auditLogs,
    accounts,
    donorRecords,
    kajianEvents,
    openExportModal,
    isDarkMode,
    toggleDarkMode
  } = useApp();
  const { t } = useI18n();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sidebar menu items
  const menuNav = [
    { id: 'overview', label: t('dashboard.overview'), icon: LayoutDashboard },
    { id: 'keuangan', label: t('dashboard.keuangan'), icon: DollarSign },
    { id: 'donasi_ziswaf', label: t('dashboard.donasi'), icon: Heart },
    { id: 'inventaris', label: t('dashboard.inventaris'), icon: Package },
    { id: 'agenda_event', label: t('dashboard.agenda'), icon: Calendar },
    { id: 'surat_dokumen', label: t('dashboard.surat'), icon: FileText },

    { id: 'website_cms', label: t('dashboard.cms'), icon: Globe },
    { id: 'broadcast', label: t('dashboard.broadcast'), icon: Send },
    { id: 'audit_log', label: t('dashboard.audit'), icon: Shield }
  ];

  const totalKas = accounts.reduce((sum, a) => (a.type === 'Aset' ? sum + Number(a.balance) : sum), 0) || MASJID_INFO.stats.totalKas;
  const pendingApprovals = transactions.filter((t) => t.status === 'Pending').length;
  const totalDonasi = donorRecords.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const agendaCount = kajianEvents.length;

  const now = new Date();
  const gregorianDate = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const hijriDate = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);

  // Build the cash-flow chart from real transactions (most recent 7 days with data).
  const chartOverviewData = (() => {
    const byDate = new Map<string, { masuk: number; keluar: number }>();
    for (const t of transactions) {
      if (!t.date) continue;
      const cur = byDate.get(t.date) ?? { masuk: 0, keluar: 0 };
      if (t.type === 'Masuk') cur.masuk += Number(t.amount) || 0;
      else cur.keluar += Number(t.amount) || 0;
      byDate.set(t.date, cur);
    }
    const dates = Array.from(byDate.keys()).sort();
    if (dates.length === 0) {
      return [
        { day: 'Senin', KasMasuk: 0, KasKeluar: 0 },
        { day: 'Selasa', KasMasuk: 0, KasKeluar: 0 },
        { day: 'Rabu', KasMasuk: 0, KasKeluar: 0 },
        { day: 'Kamis', KasMasuk: 0, KasKeluar: 0 },
        { day: 'Jumat', KasMasuk: 0, KasKeluar: 0 },
        { day: 'Sabtu', KasMasuk: 0, KasKeluar: 0 },
        { day: 'Minggu', KasMasuk: 0, KasKeluar: 0 },
      ];
    }
    return dates.slice(-7).map((date) => {
      const { masuk, keluar } = byDate.get(date)!;
      return {
        day: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(new Date(`${date}T00:00:00`)),
        KasMasuk: masuk,
        KasKeluar: keluar,
      };
    });
  })();

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 flex flex-col lg:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside
        className={`w-full lg:w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col shrink-0 border-r border-slate-800 transition-all duration-300 z-30 ${
          isSidebarOpen ? 'block' : 'hidden lg:flex'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-400/50 shadow-lg text-emerald-950 font-bold">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight tracking-tight text-white">
                {MASJID_INFO.systemName}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-[0.1em] uppercase">
                {MASJID_INFO.name}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">
              Menu Utama
            </div>
            <nav className="space-y-1">
              {menuNav.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = dashboardSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDashboardSubTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">
              Layanan & Administrasi
            </div>
            <nav className="space-y-1">
              {menuNav.slice(4, 8).map((item) => {
                const Icon = item.icon;
                const isActive = dashboardSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDashboardSubTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">
              Sistem & Log
            </div>
            <nav className="space-y-1">
              {menuNav.slice(8).map((item) => {
                const Icon = item.icon;
                const isActive = dashboardSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDashboardSubTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom User Role Card */}
        <div className="mt-auto p-4 border-t border-slate-800/80 space-y-3">
          <div className="bg-slate-800/50 rounded-2xl p-3.5 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Status Role</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0">
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'DK'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate capitalize text-white">
                  {authUser?.name || currentRole.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium truncate">{authUser?.role || 'Akses Aktif Sistem'}</span>
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-full py-2.5 px-3 bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700/60"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => { logout(); setActiveAppTab('public'); }}
            className="w-full py-2.5 px-3 bg-rose-950/60 hover:bg-rose-900 text-rose-200 hover:text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-rose-800/60"
          >
            <LogOut className="w-4 h-4 text-amber-300" />
            <span>Logout & Kembali ke Web</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {menuNav.find((m) => m.id === dashboardSubTab)?.label || 'Dashboard Overview'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {gregorianDate} • {hijriDate} • {MASJID_INFO.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openExportModal('Ringkasan Laporan Sistem', transactions)}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Export Ringkasan</span>
            </motion.button>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* SubTab 1: Overview */}
          {dashboardSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Bento Grid Stats Overview */}
              <BentoGrid className="auto-rows-[175px]">
                <BentoItem
                  colSpan="col-span-1"
                  title="Saldo Kas Utama"
                  icon={<DollarSign className="w-5 h-5" />}
                  badge="+12.4%"
                >
                  <div className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
                    Rp {totalKas.toLocaleString('id-ID')}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">Kas BSI & Tunai DKM</p>
                </BentoItem>

                <BentoItem
                  colSpan="col-span-1"
                  title="Donasi & ZIS Pekan Ini"
                  icon={<Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
                  badge="+18.2%"
                >
                  <div className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
                    Rp {totalDonasi.toLocaleString('id-ID')}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">Infaq, Zakat & Wakaf</p>
                </BentoItem>

                <BentoItem
                  colSpan="col-span-1"
                  title="Agenda Kajian Bulan Ini"
                  icon={<Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  badge={`${agendaCount} Event`}
                >
                  <div className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
                    {agendaCount} Kegiatan
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">Kajian rutin & Tabligh</p>
                </BentoItem>

                <BentoItem
                  colSpan="col-span-1"
                  title="Persetujuan Verifikasi"
                  icon={<Shield className="w-5 h-5 text-amber-500" />}
                  badge="Need Approval"
                >
                  <div className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
                    {pendingApprovals} Pending
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">Konfirmasi Bendahara</p>
                </BentoItem>
              </BentoGrid>

              {/* Main Content Grid: Chart + Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recharts Flow Area Chart */}
                <GlassCard className="lg:col-span-2 p-6 flex flex-col space-y-4" glow="emerald" hoverEffect={false}>
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Grafik Arus Kas Pekanan (Masuk vs Keluar)
                    </h3>
                    <button
                      onClick={() => openExportModal('Grafik Arus Kas', transactions)}
                      className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline"
                    >
                      Lihat Rincian
                    </button>
                  </div>
                  <div className="h-72 w-full pt-2">
                    <SimpleChart
                      type="area"
                      data={chartOverviewData}
                      xKey="day"
                      series={[
                        { key: 'KasMasuk', label: 'Kas Masuk', color: '#10b981' },
                        { key: 'KasKeluar', label: 'Kas Keluar', color: '#f43f5e' },
                      ]}
                      formatValue={(v) => v.toLocaleString('id-ID')}
                      formatAxis={(v) => `${(v / 1000000).toFixed(1)}Jt`}
                    />
                  </div>
                </GlassCard>

                {/* Right Side Widgets */}
                <div className="space-y-6">
                  {/* Prayer Times Widget */}
                  <GlassCard className="p-5 space-y-3" glow="gold" hoverEffect={false}>
                    <h4 className="text-amber-600 dark:text-amber-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Jadwal Sholat Hari Ini (Pejaten)
                    </h4>
                    <div className="space-y-2 pt-1">
                      {PRAYER_TIMES_TODAY.map((p, idx) => {
                        const isAshar = p.name === 'Ashar';
                        return (
                          <div
                            key={p.name}
                            className={`flex items-center justify-between text-xs p-2 rounded-xl border transition-colors ${
                              isAshar
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-bold'
                                : 'bg-slate-100/50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{p.name}</span>
                            <span className="font-mono font-bold">{p.time} WIB</span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>

                  {/* Audit Feed Widget */}
                  <GlassCard className="p-5 space-y-3" glow="emerald" hoverEffect={false}>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm flex items-center justify-between">
                      <span>Audit Trail Terakhir</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Real-time</span>
                    </h4>
                    <div className="space-y-2">
                      {auditLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl text-xs space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200">
                            <span>{log.userName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{log.details}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          )}

          {/* Module Views */}
          {dashboardSubTab === 'keuangan' && <KeuanganModule />}
          {dashboardSubTab === 'donasi_ziswaf' && <DonasiZakatWakafQurbanModule />}
          {dashboardSubTab === 'inventaris' && <InventarisSarprasModule />}
          {dashboardSubTab === 'agenda_event' && <AgendaEventModule />}
          {dashboardSubTab === 'surat_dokumen' && <SuratDokumenModule />}

          {dashboardSubTab === 'website_cms' && <WebsiteCMSModule />}
          {dashboardSubTab === 'broadcast' && <BroadcastNotificationModule />}
          {dashboardSubTab === 'audit_log' && <AuditLogModule />}
        </main>

        {/* Status Bar / Footer */}
        <footer className="h-10 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 px-6 sm:px-8 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase font-semibold text-slate-600 dark:text-slate-400">Server: Connected</span>
            </div>
            <div className="text-slate-300">|</div>
            <div className="uppercase font-semibold text-slate-600 dark:text-slate-400">
              User Role: {currentRole.replace(/_/g, ' ')}
            </div>
          </div>
          <div className="text-slate-400 hidden sm:block font-medium">
            v2.4.0 Production Build • {MASJID_INFO.name}
          </div>
        </footer>
      </div>
    </div>
  );
};
