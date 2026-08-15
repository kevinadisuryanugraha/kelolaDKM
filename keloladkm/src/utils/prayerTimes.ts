export interface PrayerTimeItem {
  name: string;
  time: string; // HH:mm
  arabic: string;
  iqamahOffsetMinutes: number;
}

export const TODAY_PRAYER_TIMES: PrayerTimeItem[] = [
  { name: 'Subuh', time: '04:38', arabic: 'الفجر', iqamahOffsetMinutes: 15 },
  { name: 'Syuruq', time: '05:54', arabic: 'الشروق', iqamahOffsetMinutes: 0 },
  { name: 'Dzuhur', time: '12:02', arabic: 'الظهر', iqamahOffsetMinutes: 10 },
  { name: 'Ashar', time: '15:24', arabic: 'العصر', iqamahOffsetMinutes: 10 },
  { name: 'Maghrib', time: '18:00', arabic: 'المغرب', iqamahOffsetMinutes: 10 },
  { name: 'Isya', time: '19:12', arabic: 'العشاء', iqamahOffsetMinutes: 10 }
];

export interface UpcomingPrayerInfo {
  name: string;
  time: string;
  arabic: string;
  timeLeftSeconds: number;
  timeLeftFormatted: string; // HH:mm:ss
  isTomorrow: boolean;
}

export function getUpcomingPrayer(now: Date = new Date()): UpcomingPrayerInfo {
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const prayer of TODAY_PRAYER_TIMES) {
    const [h, m] = prayer.time.split(':').map(Number);
    const prayerSeconds = h * 3600 + m * 60;

    if (prayerSeconds > currentSeconds) {
      const diff = prayerSeconds - currentSeconds;
      const hours = Math.floor(diff / 3600);
      const mins = Math.floor((diff % 3600) / 60);
      const secs = diff % 60;

      return {
        name: prayer.name,
        time: prayer.time,
        arabic: prayer.arabic,
        timeLeftSeconds: diff,
        timeLeftFormatted: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
        isTomorrow: false
      };
    }
  }

  // If past Isya (19:12), the next prayer is Subuh tomorrow at 04:38
  const subuh = TODAY_PRAYER_TIMES[0];
  const [subuhH, subuhM] = subuh.time.split(':').map(Number);
  const subuhSeconds = subuhH * 3600 + subuhM * 60;
  const secondsUntilMidnight = 86400 - currentSeconds;
  const diff = secondsUntilMidnight + subuhSeconds;

  const hours = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;

  return {
    name: subuh.name,
    time: subuh.time,
    arabic: subuh.arabic,
    timeLeftSeconds: diff,
    timeLeftFormatted: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
    isTomorrow: true
  };
}
