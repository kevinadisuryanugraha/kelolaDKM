import React from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/I18nContext';
import { Home, Clock, Calendar, Heart, ShieldCheck, LayoutDashboard } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const {
    activeAppTab,
    setActiveAppTab,
    publicSubTab,
    setPublicSubTab,
    isAuthenticated
  } = useApp();
  const { t } = useI18n();

  // Only render on Public mode
  if (activeAppTab !== 'public') return null;

  const navItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: Home,
      action: () => setPublicSubTab('home'),
      isActive: publicSubTab === 'home'
    },
    {
      id: 'prayer_times',
      label: t('nav.prayerTimes'),
      icon: Clock,
      action: () => setPublicSubTab('prayer_times'),
      isActive: publicSubTab === 'prayer_times'
    },
    {
      id: 'kajian',
      label: t('nav.kajian'),
      icon: Calendar,
      action: () => setPublicSubTab('kajian'),
      isActive: publicSubTab === 'kajian'
    },
    {
      id: 'donation',
      label: t('nav.donation'),
      icon: Heart,
      action: () => setPublicSubTab('donation'),
      isActive: publicSubTab === 'donation'
    },
    {
      id: 'dkm',
      label: isAuthenticated ? 'Dashboard' : 'Masuk DKM',
      icon: isAuthenticated ? LayoutDashboard : ShieldCheck,
      action: () => {
        if (isAuthenticated) {
          setActiveAppTab('dashboard');
        } else {
          setPublicSubTab('login');
        }
      },
      isActive: publicSubTab === 'login'
    }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 safe-area-pb"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all ${
                item.isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  item.isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight truncate mt-0.5 font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
