import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/I18nContext';
import { MASJID_INFO } from '../../data/mockData';
import { getUpcomingPrayer, TODAY_PRAYER_TIMES } from '../../utils/prayerTimes';
import {
  Moon,
  Sun,
  Building2,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { UserRole } from '../../types';

export const HeaderNavbar: React.FC = () => {
  const {
    activeAppTab,
    setActiveAppTab,
    publicSubTab,
    setPublicSubTab,
    isDarkMode,
    toggleDarkMode,
    isAuthenticated,
    logout
  } = useApp();
  const { t, lang, setLang } = useI18n();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Prayer Sync with Real Clock
  const [upcoming, setUpcoming] = useState(() => getUpcomingPrayer());

  useEffect(() => {
    const updateCountdown = () => {
      setUpcoming(getUpcomingPrayer());
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const primaryNavItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'prayer_times', label: t('nav.prayerTimes') },
    { id: 'kajian', label: t('nav.kajian') },
    { id: 'donation', label: t('nav.donation') },
    { id: 'financial_report', label: t('nav.financialReport') }
  ];

  const secondaryNavItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'organization', label: t('nav.organization') },
    { id: 'staff', label: t('nav.staff') },
    { id: 'zakat_calculator', label: t('nav.zakatCalculator') },
    { id: 'news', label: t('nav.news') },
    { id: 'faq_contact', label: t('nav.faqContact') }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors font-sans">
      {/* Top Banner Ticker */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
        {/* Mobile Banner: Single Compact Text */}
        <div className="sm:hidden w-full flex items-center justify-between text-[11px] font-medium text-slate-300">
          <span className="text-emerald-400 font-bold flex items-center gap-1 truncate">
            <Building2 className="w-3 h-3 shrink-0" /> {MASJID_INFO.name}
          </span>
          <span className="text-slate-300 font-mono text-[10px] shrink-0 ml-2">
            {upcoming.name} <span className="text-emerald-400 font-bold">{upcoming.time}</span>
          </span>
        </div>

        {/* Tablet & Desktop Banner */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-slate-300 truncate">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
            <Building2 className="w-3.5 h-3.5" /> {MASJID_INFO.name} Pejaten Timur
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400 font-mono">{MASJID_INFO.phone}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono shrink-0">
          <span className="text-slate-400 font-sans hidden md:inline">Jadwal Sholat:</span>
          {TODAY_PRAYER_TIMES.slice(0, 5).map((p, i) => (
            <React.Fragment key={p.name}>
              {i > 0 && <span className="text-slate-600">•</span>}
              <span className={p.name === upcoming.name ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                {p.name} <span className={p.name === upcoming.name ? 'text-emerald-300 font-bold' : 'text-white font-bold'}>{p.time}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setActiveAppTab('public');
            setPublicSubTab('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-500 transition-colors shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-sm sm:text-base leading-tight text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              {MASJID_INFO.name}
            </h1>
            <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
              Pejaten Timur, Jakarta Selatan
            </span>
          </div>
        </div>

        {/* Desktop Nav Links (When in Public mode) */}
        {activeAppTab === 'public' && (
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPublicSubTab(item.id)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  publicSubTab === item.id
                    ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Dropdown for Secondary Links */}
            <div className="relative group">
              <button className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 flex items-center gap-1 font-semibold whitespace-nowrap">
                <span>{t('nav.more')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 hidden group-hover:block z-50 animate-in fade-in duration-150">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPublicSubTab(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      publicSubTab === item.id
                        ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Action Controls & App Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            title="Bahasa / Language"
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Switcher Button: Public vs Dashboard (Tablet & Desktop) */}
          <div className="hidden sm:block">
            {activeAppTab === 'public' ? (
              <button
                onClick={() => isAuthenticated ? setActiveAppTab('dashboard') : setPublicSubTab('login')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                <span>{t('nav.dashboard')}</span>
              </button>
            ) : (
              <button
                onClick={() => { logout(); setActiveAppTab('public'); }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{t('nav.public')}</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden relative z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Mobile System CTA Button */}
          {activeAppTab === 'public' ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                isAuthenticated ? setActiveAppTab('dashboard') : setPublicSubTab('login');
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span>Masuk KelolaDKM System</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                logout();
                setActiveAppTab('public');
              }}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Kembali ke Web Public</span>
            </button>
          )}

          {/* Navigation Links for Public Mode */}
          {activeAppTab === 'public' && (
            <>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 px-1">
                  Navigasi Utama
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {primaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPublicSubTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-colors font-semibold ${
                        publicSubTab === item.id
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 px-1">
                  Layanan & Informasi
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPublicSubTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-colors font-semibold ${
                        publicSubTab === item.id
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
