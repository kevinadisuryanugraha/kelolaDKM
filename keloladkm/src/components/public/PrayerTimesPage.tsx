import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PRAYER_TIMES_TODAY } from '../../data/mockData';
import { Compass, Bell, Clock } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { getUpcomingPrayer } from '../../utils/prayerTimes';

interface WeeklyPrayerRow {
  dayLabel: string;
  subuh: string;
  syuruq: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export const PrayerTimesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [upcoming, setUpcoming] = useState(() => getUpcomingPrayer());

  useEffect(() => {
    const tick = () => setUpcoming(getUpcomingPrayer());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const weeklyData: WeeklyPrayerRow[] = [
    { dayLabel: 'Hari Ini (Jumat)', subuh: '04:38', syuruq: '05:54', dzuhur: '12:02', ashar: '15:24', maghrib: '18:00', isya: '19:12' },
    { dayLabel: 'Sabtu, 25 Juli', subuh: '04:38', syuruq: '05:54', dzuhur: '12:02', ashar: '15:24', maghrib: '18:00', isya: '19:12' },
    { dayLabel: 'Minggu, 26 Juli', subuh: '04:39', syuruq: '05:55', dzuhur: '12:02', ashar: '15:25', maghrib: '18:01', isya: '19:13' },
    { dayLabel: 'Senin, 27 Juli', subuh: '04:39', syuruq: '05:55', dzuhur: '12:03', ashar: '15:25', maghrib: '18:01', isya: '19:13' },
    { dayLabel: 'Selasa, 28 Juli', subuh: '04:39', syuruq: '05:55', dzuhur: '12:03', ashar: '15:25', maghrib: '18:01', isya: '19:13' },
    { dayLabel: 'Rabu, 29 Juli', subuh: '04:39', syuruq: '05:55', dzuhur: '12:03', ashar: '15:25', maghrib: '18:01', isya: '19:13' },
    { dayLabel: 'Kamis, 30 Juli', subuh: '04:40', syuruq: '05:56', dzuhur: '12:03', ashar: '15:25', maghrib: '18:02', isya: '19:14' }
  ];

  const monthlyData: WeeklyPrayerRow[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - 5));
    const dayLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }).format(d);
    const minuteOffset = Math.floor(i / 6);
    const subuhMin = String(38 + (i % 2)).padStart(2, '0');
    const dzuhurMin = String(2 + minuteOffset).padStart(2, '0');
    const asharMin = String(24 + minuteOffset).padStart(2, '0');
    const maghribMin = String(i % 3).padStart(2, '0');
    const isyaMin = String(12 + (i % 3)).padStart(2, '0');

    return {
      dayLabel,
      subuh: `04:${subuhMin}`,
      syuruq: '05:55',
      dzuhur: `12:${dzuhurMin}`,
      ashar: `15:${asharMin}`,
      maghrib: `18:${maghribMin}`,
      isya: `19:${isyaMin}`
    };
  });

  const prayerColumns: DataTableColumn<WeeklyPrayerRow>[] = [
    { key: 'dayLabel', header: 'Hari & Tanggal', className: 'font-bold whitespace-nowrap' },
    { key: 'subuh', header: 'Subuh', className: 'font-mono whitespace-nowrap' },
    { key: 'syuruq', header: 'Syuruq', className: 'font-mono whitespace-nowrap' },
    { key: 'dzuhur', header: 'Dzuhur', className: 'font-mono whitespace-nowrap' },
    { key: 'ashar', header: 'Ashar', className: 'font-mono whitespace-nowrap' },
    {
      key: 'maghrib',
      header: 'Maghrib',
      className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap'
    },
    { key: 'isya', header: 'Isya', className: 'font-mono whitespace-nowrap' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        titleKey="pages.prayer.title"
        subtitleKey="pages.prayer.subtitle"
      />

      {/* Main Grid: Schedule & Qibla Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prayer Times Table */}
        <GlassCard className="lg:col-span-8 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
          {/* Tabs & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'today'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'weekly'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                Minggu Ini
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                Bulan Ini
              </button>
            </div>

            <button
              onClick={() => setNotificationEnabled(!notificationEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                notificationEnabled
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{notificationEnabled ? 'Pengingat Adhan Aktif' : 'Aktifkan Notification Alert'}</span>
            </button>
          </div>

          {/* Today Cards Grid */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PRAYER_TIMES_TODAY.map((p, idx) => {
                const isCurrentUpcoming = p.name === upcoming.name;
                return (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                      isCurrentUpcoming
                        ? 'bg-gradient-to-br from-emerald-800 to-emerald-950 text-white border-emerald-500 shadow-xl ring-2 ring-emerald-400 font-bold'
                        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white'
                    }`}
                  >
                    {isCurrentUpcoming && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        <Clock className="w-3 h-3" /> Menuju Adhan
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{p.name}</span>
                      <span className="font-serif text-lg opacity-80">{p.arabic}</span>
                    </div>
                    <div className="text-3xl font-bold font-mono tracking-wider my-2">{p.time}</div>
                    <div className="flex items-center justify-between text-[10px] opacity-80 mt-1">
                      <span>Iqamah Offset: +{p.iqamahOffsetMinutes} mnt</span>
                      {isCurrentUpcoming && (
                        <span className="text-amber-300 font-mono font-bold">-{upcoming.timeLeftFormatted}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Weekly / Monthly Table */}
          {activeTab !== 'today' && (
            <DataTable
              columns={prayerColumns}
              data={activeTab === 'monthly' ? monthlyData : weeklyData}
              keyField="dayLabel"
              minWidth="w-full min-w-[600px]"
            />
          )}
        </GlassCard>

        {/* Right: Qibla & Compass Widget */}
        <GlassCard className="lg:col-span-4 p-6 space-y-6 text-center" glow="emerald">
          <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
            <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Arah Kiblat Pejaten Timur</span>
          </div>

          <div className="w-40 h-40 rounded-full border-2 border-emerald-500/30 mx-auto flex items-center justify-center relative bg-slate-50 dark:bg-slate-900 shadow-inner">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">295.2°</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Barat - Laut
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Presisi posisi kiblat berjarak ±7.920 KM dari Pejaten Timur mengarah lurus ke Ka'bah Al-Mukarramah Makkah.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
