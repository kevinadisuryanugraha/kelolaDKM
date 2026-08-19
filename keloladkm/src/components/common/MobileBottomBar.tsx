import React from 'react';
import { motion } from 'motion/react';
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
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-colors"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all select-none ${
                item.isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {item.isActive && (
                <motion.div
                  layoutId="activeBottomNavPill"
                  className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl border border-emerald-500/20"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <div className="relative z-10 p-1">
                <Icon className={`w-5 h-5 transition-transform ${item.isActive ? 'scale-110' : ''}`} />
              </div>
              <span className="relative z-10 text-[10px] leading-tight truncate mt-0.5 font-bold tracking-tight">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
