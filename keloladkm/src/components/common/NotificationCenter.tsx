import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  DollarSign,
  Heart,
  Calendar,
  FileText,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardNotification } from '../../types';

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    setDashboardSubTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'keuangan' | 'donasi' | 'system'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    if (filter === 'keuangan') return item.type === 'keuangan';
    if (filter === 'donasi') return item.type === 'donasi';
    if (filter === 'system') return item.type === 'security' || item.type === 'system' || item.type === 'surat';
    return true;
  });

  const getIconAndColor = (type: DashboardNotification['type']) => {
    switch (type) {
      case 'keuangan':
        return {
          icon: DollarSign,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
        };
      case 'donasi':
        return {
          icon: Heart,
          bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
          badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
        };
      case 'agenda':
        return {
          icon: Calendar,
          bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20',
          badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
        };
      case 'surat':
        return {
          icon: FileText,
          bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20',
          badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
        };
      case 'security':
        return {
          icon: ShieldAlert,
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
          badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/20',
          badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
        };
    }
  };

  const handleNotificationClick = (item: DashboardNotification) => {
    markNotificationAsRead(item.id);
    if (item.actionTab) {
      setDashboardSubTab(item.actionTab);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={panelRef}>
      {/* Bell Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Pusat Notifikasi DKM"
        className="relative p-2 sm:p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors border border-slate-200/80 dark:border-slate-800"
      >
        <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadNotificationsCount}
          </span>
        )}
      </motion.button>

      {/* Popover Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 sm:inset-x-auto sm:absolute sm:right-0 top-16 sm:top-full mt-2 sm:w-[420px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Notifikasi & Aktivitas</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                        {unreadNotificationsCount} Baru
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400">Pembaruan transaksi, agenda & sistem</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    title="Tandai semua dibaca"
                    className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    title="Bersihkan semua"
                    className="p-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'unread', label: `Belum Dibaca (${unreadNotificationsCount})` },
                { id: 'keuangan', label: 'Keuangan' },
                { id: 'donasi', label: 'ZISWAF' },
                { id: 'system', label: 'Sistem' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Notification Items List */}
            <div className="p-2 overflow-y-auto space-y-1.5 max-h-[340px] flex-1">
              {filteredNotifications.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <CheckCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Semua Notifikasi Bersih!</p>
                  <p className="text-[11px] text-slate-400">Tidak ada notifikasi baru untuk filter ini.</p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const { icon: Icon, bg, badgeBg } = getIconAndColor(item.type);
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        item.isRead
                          ? 'border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 opacity-80'
                          : 'border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/10 text-slate-900 dark:text-white font-medium shadow-xs'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border shrink-0 mt-0.5 ${bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs truncate flex items-center gap-1.5">
                            {!item.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            )}
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${badgeBg}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                          {item.message}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" /> {item.timestamp}
                          </span>
                          {item.actionTab && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 group-hover:underline">
                              Buka <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => {
                  setDashboardSubTab('audit_log');
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Seluruh Aktivitas Audit Trail</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
