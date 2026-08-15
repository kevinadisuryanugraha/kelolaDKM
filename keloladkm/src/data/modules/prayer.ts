import { PrayerTime } from '../../types';

export const PRAYER_TIMES_TODAY: PrayerTime[] = [
  { name: 'Subuh', time: '04:38', arabic: 'الفجر', iqamahOffsetMinutes: 15 },
  { name: 'Syuruq', time: '05:54', arabic: 'الشروق', iqamahOffsetMinutes: 0 },
  { name: 'Dzuhur', time: '12:02', arabic: 'الظهر', iqamahOffsetMinutes: 10 },
  { name: 'Ashar', time: '15:24', arabic: 'العصر', iqamahOffsetMinutes: 10 },
  { name: 'Maghrib', time: '18:00', arabic: 'المغرب', iqamahOffsetMinutes: 10 },
  { name: 'Isya', time: '19:12', arabic: 'العشاء', iqamahOffsetMinutes: 10 }
];
