import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/I18nContext';
import { MASJID_INFO, PRAYER_TIMES_TODAY } from '../../data/mockData';
import { canRoleAccessTab, getDefaultTabForRole, ROLE_LABELS } from '../../utils/rbac';
import { UserRole } from '../../types';
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
  X,
  Moon,
  Sun,
  Plus,
  MoreHorizontal,
  Bell,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
const KeuanganModule = React.lazy(() => import('./KeuanganModule').then((m) => ({ default: m.KeuanganModule })));
const DonasiZakatWakafQurbanModule = React.lazy(() => import('./DonasiZakatWakafQurbanModule').then((m) => ({ default: m.DonasiZakatWakafQurbanModule })));
const InventarisSarprasModule = React.lazy(() => import('./InventarisSarprasModule').then((m) => ({ default: m.InventarisSarprasModule })));
const AgendaEventModule = React.lazy(() => import('./AgendaEventModule').then((m) => ({ default: m.AgendaEventModule })));
const SuratDokumenModule = React.lazy(() => import('./SuratDokumenModule').then((m) => ({ default: m.SuratDokumenModule })));
const WebsiteCMSModule = React.lazy(() => import('./WebsiteCMSModule').then((m) => ({ default: m.WebsiteCMSModule })));
const BroadcastNotificationModule = React.lazy(() => import('./BroadcastNotificationModule').then((m) => ({ default: m.BroadcastNotificationModule })));
const AuditLogModule = React.lazy(() => import('./AuditLogModule').then((m) => ({ default: m.AuditLogModule })));

const ModuleSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse py-2">
    <div className="h-10 bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl w-48" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl" />
      <div className="h-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl" />
      <div className="h-28 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl" />
    </div>
    <div className="h-72 bg-slate-200/40 dark:bg-slate-800/40 rounded-3xl" />
  </div>
);
import { SimpleChart } from '../common/SimpleChart';
import { GlassCard } from '../common/GlassCard';
import { BentoGrid, BentoItem } from '../common/BentoGrid';
import { NotificationCenter } from '../common/NotificationCenter';

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
    toggleDarkMode,
    showToast
  } = useApp();
  const { t } = useI18n();

  // Mobile Bottom Sheets & Modal States
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isBackOfficeMenuOpen, setIsBackOfficeMenuOpen] = useState(false);

  // Active User Role evaluation
  const activeRole: UserRole = (authUser?.role || currentRole || 'super_admin') as UserRole;

  // Strict Tab Guard: If trying to access an unauthorized subtab, redirect to fallback
  useEffect(() => {
    if (!canRoleAccessTab(activeRole, dashboardSubTab)) {
      const fallbackTab = getDefaultTabForRole(activeRole);
      setDashboardSubTab(fallbackTab);
      showToast(
        `Akses Terbatas: Role ${ROLE_LABELS[activeRole] || activeRole} tidak memiliki izin ke menu tersebut.`,
        'info'
      );
    }
  }, [activeRole, dashboardSubTab, setDashboardSubTab, showToast]);

  // Master Sidebar Menu Definitions with Groups
  const allMenuNav = [
    { id: 'overview', label: t('dashboard.overview'), icon: LayoutDashboard, group: 'main', desc: 'Ringkasan Eksekutif' },
    { id: 'keuangan', label: t('dashboard.keuangan'), icon: DollarSign, group: 'main', desc: 'Kas & Buku Besar' },
    { id: 'donasi_ziswaf', label: t('dashboard.donasi'), icon: Heart, group: 'main', desc: 'ZISWAF & Donatur' },
    { id: 'inventaris', label: t('dashboard.inventaris'), icon: Package, group: 'main', desc: 'Sarpras & Aset' },
    { id: 'agenda_event', label: t('dashboard.agenda'), icon: Calendar, group: 'services', desc: 'Jadwal Kajian & Sholat' },
    { id: 'surat_dokumen', label: t('dashboard.surat'), icon: FileText, group: 'services', desc: 'Disposisi & Arsip' },
    { id: 'website_cms', label: t('dashboard.cms'), icon: Globe, group: 'services', desc: 'Portal & Warta Dakwah' },
    { id: 'broadcast', label: t('dashboard.broadcast'), icon: Send, group: 'services', desc: 'Kirim WA Jamaah' },
    { id: 'audit_log', label: t('dashboard.audit'), icon: Shield, group: 'system', desc: 'Trail & Security' }
  ];

  // Filter menu items allowed for the active role
  const allowedNav = allMenuNav.filter((item) => canRoleAccessTab(activeRole, item.id));
  const mainGroup = allowedNav.filter((item) => item.group === 'main');
  const servicesGroup = allowedNav.filter((item) => item.group === 'services');
  const systemGroup = allowedNav.filter((item) => item.group === 'system');

  const menuNav = allowedNav;

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

  const handleQuickAction = (tabId: string) => {
    setDashboardSubTab(tabId);
    setIsQuickActionOpen(false);
  };

  const handleModuleSelect = (tabId: string) => {
    setDashboardSubTab(tabId);
    setIsBackOfficeMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 flex flex-col lg:flex-row font-sans relative overflow-x-hidden">
      {/* ─────────────────── DESKTOP STATIC SIDEBAR (lg:flex) ─────────────────── */}
      <aside className="hidden lg:flex lg:w-64 bg-slate-900 dark:bg-slate-950 text-white flex-col shrink-0 border-r border-slate-800 shadow-2xl min-h-screen">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-400/50 shadow-lg text-emerald-950 font-bold shrink-0">
              <Shield className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base leading-tight tracking-tight text-white truncate">
                {MASJID_INFO.systemName}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold tracking-[0.1em] uppercase truncate">
                {MASJID_INFO.name}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu Links (Filtered by Role) */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {mainGroup.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">
                Menu Utama
              </div>
              <nav className="space-y-1">
                {mainGroup.map((item) => {
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
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {servicesGroup.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">
                Layanan & Administrasi
              </div>
              <nav className="space-y-1">
                {servicesGroup.map((item) => {
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
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {systemGroup.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">
                Sistem & Log
              </div>
              <nav className="space-y-1">
                {systemGroup.map((item) => {
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
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
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
                  {authUser?.name || ROLE_LABELS[activeRole]}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium truncate">{ROLE_LABELS[activeRole] || authUser?.role || 'Akses Aktif Sistem'}</span>
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

      {/* ─────────────────── MAIN DASHBOARD VIEWPORT ─────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar (Desktop & Mobile Optimized) */}
        <header className="h-16 sm:h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-3.5 sm:px-8 shrink-0 gap-2 sticky top-0 z-30">
          {/* Mobile Profile & Workspace Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
              {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {menuNav.find((m) => m.id === dashboardSubTab)?.label || 'Dashboard Overview'}
                </h1>
                <span className="inline-flex lg:hidden items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] border border-emerald-500/20 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {ROLE_LABELS[activeRole] || 'Pengurus'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                <span className="hidden md:inline">{gregorianDate} • </span>{hijriDate} • {MASJID_INFO.name}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notification Center Bell & Popover */}
            <NotificationCenter />

            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors border border-slate-200/80 dark:border-slate-800"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openExportModal('Ringkasan Laporan Sistem', transactions)}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-md transition-all shrink-0"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export Ringkasan</span>
              <span className="sm:hidden text-[11px]">Export</span>
            </motion.button>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto pb-28 lg:pb-8">
          {/* SubTab 1: Overview */}
          {dashboardSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Mobile-Friendly Hero Welcome Card (Matching User UI Design) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-5 sm:p-7 shadow-xl border border-slate-800"
              >
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/90 text-emerald-400 rounded-full text-[10px] font-bold tracking-wider uppercase border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Workspace: {MASJID_INFO.name}</span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span>Selamat Datang, {authUser?.name || 'Pengurus DKM'}!</span>
                      <span>👋</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-normal leading-relaxed mt-1 max-w-xl">
                      Anda memiliki <strong className="text-amber-300 font-bold">{pendingApprovals} persetujuan kas pending</strong> dan <strong className="text-emerald-300 font-bold">{agendaCount} agenda aktif</strong> pekan ini.
                    </p>
                  </div>

                  {/* Hero Quick Action Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      onClick={() => setDashboardSubTab('keuangan')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Kelola Kas DKM
                    </button>
                    <button
                      onClick={() => setDashboardSubTab('donasi_ziswaf')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400" /> Lihat Donasi & ZIS
                    </button>
                  </div>

                  {/* 3 Metric Counters */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
                    <div className="p-2 bg-slate-800/40 rounded-2xl border border-slate-800">
                      <div className="text-base sm:text-xl font-bold font-mono text-amber-400">{pendingApprovals}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Approval</div>
                    </div>
                    <div className="p-2 bg-slate-800/40 rounded-2xl border border-slate-800">
                      <div className="text-base sm:text-xl font-bold font-mono text-emerald-400">{agendaCount}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Agenda Aktif</div>
                    </div>
                    <div className="p-2 bg-slate-800/40 rounded-2xl border border-slate-800">
                      <div className="text-base sm:text-xl font-bold font-mono text-blue-400">{transactions.length}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Transaksi</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Quick Module Cards Grid (Matching User Reference) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:hidden">
                {[
                  { id: 'keuangan', label: 'Kas & Keuangan', desc: 'Buku Kas & Jurnal', icon: DollarSign, color: 'emerald', badge: 'Keuangan' },
                  { id: 'donasi_ziswaf', label: 'Donasi & ZISWAF', desc: 'Zakat & Infaq', icon: Heart, color: 'rose', badge: 'ZISWAF' },
                  { id: 'inventaris', label: 'Inventaris & Aset', desc: 'Sarpras Masjid', icon: Package, color: 'blue', badge: 'Sarpras' },
                  { id: 'agenda_event', label: 'Agenda & Kajian', desc: 'Khutbah & Event', icon: Calendar, color: 'amber', badge: 'Agenda' }
                ].map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <motion.button
                      key={mod.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setDashboardSubTab(mod.id)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-left shadow-xs flex flex-col justify-between space-y-2 group transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{mod.badge}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">{mod.label}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{mod.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Bento Grid Stats Overview */}
              <BentoGrid className="auto-rows-auto sm:auto-rows-[175px]">
                <BentoItem
                  colSpan="col-span-1"
                  title="Saldo Kas Utama"
                  icon={<DollarSign className="w-5 h-5" />}
                  badge="+12.4%"
                >
                  <div className="text-base sm:text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
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
                  <div className="text-base sm:text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
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
                  <div className="text-base sm:text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
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
                  <div className="text-base sm:text-lg xl:text-xl font-bold text-slate-900 dark:text-white font-mono whitespace-nowrap tracking-tight">
                    {pendingApprovals} Pending
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">Konfirmasi Bendahara</p>
                </BentoItem>
              </BentoGrid>

              {/* Main Content Grid: Chart + Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Recharts Flow Area Chart */}
                <GlassCard className="lg:col-span-2 p-4 sm:p-6 flex flex-col space-y-4" glow="emerald" hoverEffect={false}>
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      Grafik Arus Kas Pekanan (Masuk vs Keluar)
                    </h3>
                    <button
                      onClick={() => openExportModal('Grafik Arus Kas', transactions)}
                      className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline"
                    >
                      Lihat Rincian
                    </button>
                  </div>
                  <div className="w-full pt-2">
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
                  <GlassCard className="p-4 sm:p-5 space-y-3" glow="gold" hoverEffect={false}>
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
                            <span className="font-medium">{p.name}</span>
                            <span className="font-mono font-semibold">{p.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          )}

          {/* Module Views (Lazy Loaded on Demand) */}
          <React.Suspense fallback={<ModuleSkeleton />}>
            {dashboardSubTab === 'keuangan' && <KeuanganModule />}
            {dashboardSubTab === 'donasi_ziswaf' && <DonasiZakatWakafQurbanModule />}
            {dashboardSubTab === 'inventaris' && <InventarisSarprasModule />}
            {dashboardSubTab === 'agenda_event' && <AgendaEventModule />}
            {dashboardSubTab === 'surat_dokumen' && <SuratDokumenModule />}

            {dashboardSubTab === 'website_cms' && <WebsiteCMSModule />}
            {dashboardSubTab === 'broadcast' && <BroadcastNotificationModule />}
            {dashboardSubTab === 'audit_log' && <AuditLogModule />}
          </React.Suspense>
        </main>

        {/* Status Bar / Footer */}
        <footer className="h-10 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between text-[10px] text-slate-500 shrink-0 hidden lg:flex">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase font-semibold text-slate-600 dark:text-slate-400">Connected</span>
            </div>
            <div className="text-slate-300">|</div>
            <div className="uppercase font-semibold text-slate-600 dark:text-slate-400 truncate">
              {ROLE_LABELS[activeRole] || activeRole.replace(/_/g, ' ')}
            </div>
          </div>
          <div className="text-slate-400 font-medium truncate">
            v2.4.0 • {MASJID_INFO.name}
          </div>
        </footer>
      </div>

      {/* ─────────────────── MOBILE TAB BUTTON WIDGET (BOTTOM BAR) ─────────────────── */}
      <nav
        aria-label="Dashboard Mobile Tab Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center">
          {/* Tab 1: Dasbor */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDashboardSubTab('overview')}
            className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
              dashboardSubTab === 'overview'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${dashboardSubTab === 'overview' ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight font-bold mt-0.5 tracking-tight">Dasbor</span>
          </motion.button>

          {/* Tab 2: Keuangan */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDashboardSubTab('keuangan')}
            className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
              dashboardSubTab === 'keuangan'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${dashboardSubTab === 'keuangan' ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight font-bold mt-0.5 tracking-tight">Keuangan</span>
          </motion.button>

          {/* Center Elevated Action Button (+) */}
          <div className="flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsQuickActionOpen(true)}
              aria-label="Aksi Cepat Pengurus"
              className="-translate-y-4 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(16,185,129,0.4)] border-4 border-slate-100 dark:border-slate-950 transition-all"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </motion.button>
          </div>

          {/* Tab 4: Donasi / ZIS */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDashboardSubTab('donasi_ziswaf')}
            className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all ${
              dashboardSubTab === 'donasi_ziswaf'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1 rounded-xl ${dashboardSubTab === 'donasi_ziswaf' ? 'bg-emerald-50 dark:bg-emerald-500/15' : ''}`}>
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight font-bold mt-0.5 tracking-tight">ZISWAF</span>
          </motion.button>

          {/* Tab 5: Lainnya (BackOffice Sheet) */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsBackOfficeMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-2xl transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            <div className="p-1 rounded-xl">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight font-bold mt-0.5 tracking-tight">Lainnya</span>
          </motion.button>
        </div>
      </nav>

      {/* ─────────────────── MODAL 1: AKSI CEPAT PENGURUS (+) ─────────────────── */}
      <AnimatePresence>
        {isQuickActionOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Sheet Header */}
              <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Aksi Cepat Pengurus DKM</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Buat data baru atau proses kas & agenda secara langsung</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsQuickActionOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action List (Matching User Image 3) */}
              <div className="p-4 space-y-2.5 overflow-y-auto">
                {[
                  {
                    tabId: 'keuangan',
                    title: 'Catat Transaksi Kas Baru',
                    desc: 'Pemasukan atau pengeluaran kas DKM',
                    icon: DollarSign,
                    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  },
                  {
                    tabId: 'donasi_ziswaf',
                    title: 'Input Donasi & ZISWAF',
                    desc: 'Catat donatur, infaq, zakat & sedekah',
                    icon: Heart,
                    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  },
                  {
                    tabId: 'agenda_event',
                    title: 'Tambah Agenda & Kajian',
                    desc: 'Jadwal sholat jumat & kajian rutin jamaah',
                    icon: Calendar,
                    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  },
                  {
                    tabId: 'surat_dokumen',
                    title: 'Buat Surat & Disposisi',
                    desc: 'Kop surat resmi & permohonan dana proposal',
                    icon: FileText,
                    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                  },
                  {
                    tabId: 'broadcast',
                    title: 'Kirim Broadcast WA Jamaah',
                    desc: 'Warta jumat & pengumuman massal terverifikasi',
                    icon: Send,
                    iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                  }
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <motion.button
                      key={act.tabId}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(act.tabId)}
                      className="w-full p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${act.iconBg}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {act.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{act.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition-all shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────── MODAL 2: MENU BACKOFFICE DKM (LAINNYA) ─────────────────── */}
      <AnimatePresence>
        {isBackOfficeMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Sheet Header */}
              <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Menu BackOffice DKM</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Akses cepat seluruh modul operasional {MASJID_INFO.systemName}</p>
                </div>
                <button
                  onClick={() => setIsBackOfficeMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2-Column Grid of Modules (Matching User Image 4) */}
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-2.5">
                  {allowedNav.map((item) => {
                    const Icon = item.icon;
                    const isActive = dashboardSubTab === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleModuleSelect(item.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                          isActive
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs block leading-tight truncate">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">{item.desc}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Status Role Strip */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      Hak Akses: {ROLE_LABELS[activeRole] || activeRole}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Aktif</span>
                </div>

                {/* User Profile & Logout Strip */}
                <div className="p-3.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {authUser?.name ? authUser.name.charAt(0).toUpperCase() : 'DK'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{authUser?.name || 'Pengurus DKM'}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{authUser?.email || 'admin@masjidnuruliman.or.id'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setActiveAppTab('public');
                    }}
                    className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-rose-200 shrink-0 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
