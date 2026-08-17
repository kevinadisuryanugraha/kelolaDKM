import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { animate } from 'animejs';
import { useApp } from '../../context/AppContext';
import { MASJID_INFO, KAJIAN_EVENTS } from '../../data/mockData';
import { getUpcomingPrayer, TODAY_PRAYER_TIMES } from '../../utils/prayerTimes';
import { MasjidGoogleMap } from '../common/MasjidGoogleMap';
import { GlassCard } from '../common/GlassCard';
import { BentoGrid, BentoItem } from '../common/BentoGrid';
import { Avatar } from '../common/Avatar';
import { PlaceholderImage } from '../common/PlaceholderImage';
import {
  Clock, QrCode, Calendar, Heart, BookOpen, Users, TrendingUp,
  MapPin, Award, ArrowRight, MessageCircle, DollarSign, CheckCircle2, Volume2
} from 'lucide-react';

/** Running ticker bar */
const RunningTicker: React.FC = () => {
  const tickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tickerRef.current) {
      animate(tickerRef.current, {
        translateX: ['0%', '-50%'],
        duration: 25000,
        ease: 'linear',
        loop: true
      });
    }
  }, []);

  const items = [
    'Kajian Rutin Ba\'da Maghrib Setiap Sabtu Malam Bersama Ustadz Ahmad Fauzi.',
    'Donasi Online QRIS Kini Tersedia 24 Jam untuk Kemudahan Jamaah.',
    'Program Wakaf Karpet & Speaker Utama Masjid Jami Nurul Iman.',
    'Transparansi Laporan Kas Masjid Terkini Dapat Diakses Secara Realtime.',
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-semibold text-[11px] rounded-xl uppercase tracking-wider">
          <Volume2 className="w-3.5 h-3.5" /> Pengumuman
        </span>
        <div className="overflow-hidden w-full relative">
          <div ref={tickerRef} className="inline-flex whitespace-nowrap gap-10 text-xs text-slate-200">
            {[...items, ...items].map((item, i) => (
              <span key={i}>• {item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Sholat countdown + QRIS card in hero */
const PrayerWidget: React.FC<{ upcoming: ReturnType<typeof getUpcomingPrayer> }> = ({ upcoming }) => (
  <div className="space-y-4">
    <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-300 font-medium border-b border-slate-800 pb-2.5">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400" /> Menuju Waktu {upcoming.name} {upcoming.isTomorrow ? '(Besok)' : ''}
        </span>
        <span className="text-white font-mono">{upcoming.time} WIB</span>
      </div>
      <div className="text-center py-3">
        <div className="text-4xl font-mono font-bold text-amber-400 tracking-widest">
          {upcoming.timeLeftFormatted}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Hitung mundur otomatis waktu adhan wilayah Pejaten Timur</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-1 pt-1 text-center">
        {TODAY_PRAYER_TIMES.map((p) => (
          <div key={p.name} className={`p-1.5 sm:p-2 rounded-xl border text-[11px] ${p.name === upcoming.name ? 'bg-emerald-900/60 border-emerald-600 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
            <div className="text-[10px] text-slate-400 truncate">{p.name}</div>
            <div className="font-mono text-xs font-semibold mt-0.5">{p.time}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-amber-400 text-slate-950 rounded-2xl p-4 shadow-md flex items-center justify-between gap-4 border border-amber-300">
      <div className="space-y-1">
        <span className="inline-block text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-slate-950 text-amber-400 rounded-md">
          QRIS Nasional
        </span>
        <div className="font-bold text-sm">Donasi / Infaq Cepat</div>
        <p className="text-[11px] text-slate-800">BCA, BSI, GoPay, OVO, ShopeePay, Dana</p>
      </div>
      <div className="p-2.5 bg-white rounded-2xl shadow-sm shrink-0 border border-amber-200">
        <QrCode className="w-11 h-11 text-slate-950" />
      </div>
    </div>
  </div>
);

/** Stats bento grid section */
const StatsGrid: React.FC = () => (
  <section className="space-y-4">
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Statistik & Layanan Masjid</h2>
      <p className="text-xs text-slate-500">Gambaran operasional dan layanan Jamaah Nurul Iman</p>
    </div>
    <BentoGrid className="auto-rows-[165px]">
      <BentoItem colSpan="col-span-1" title="Saldo Kas Transparan" icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} badge="Realtime">
        <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-2">
          Rp {(MASJID_INFO.stats.totalKas / 1000000).toFixed(1)} Jt
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Audit kas terbuka untuk jamaah</p>
      </BentoItem>
      <BentoItem colSpan="col-span-1" title="Jamaah Terdaftar" icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />} badge="Pejaten Timur">
        <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-2">{MASJID_INFO.stats.totalJamaah}+ KK</div>
        <p className="text-[11px] text-slate-500 mt-1">Komunitas jamaah aktif</p>
      </BentoItem>
      <BentoItem colSpan="col-span-1" title="Donatur Aktif" icon={<BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} badge="Pendidikan">
        <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-2">{MASJID_INFO.stats.totalDonaturAktif}+ Donatur</div>
        <p className="text-[11px] text-slate-500 mt-1">Kontribusi via QRIS, Transfer & ZISWAF</p>
      </BentoItem>
      <BentoItem colSpan="col-span-1" title="Program Keummatan" icon={<Award className="w-5 h-5 text-amber-500" />} badge="Sosial DKM">
        <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-2">{MASJID_INFO.stats.totalProgramAktif} Program</div>
        <p className="text-[11px] text-slate-500 mt-1">Santunan, Wakaf, Qurban & ZISWAF</p>
      </BentoItem>
    </BentoGrid>
  </section>
);

/** Kajian cards section */
const KajianSection: React.FC = () => {
  const { setPublicSubTab, showToast } = useApp();
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Jadwal Kajian & Agenda Masjid
          </h2>
          <p className="text-xs text-slate-500">Hadirilah majelis ilmu dan agenda keagamaan di Masjid Jami Nurul Iman</p>
        </div>
        <button onClick={() => setPublicSubTab('kajian')} className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
          Lihat Semua Agenda <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {KAJIAN_EVENTS.map((item, idx) => (
          <GlassCard key={item.id} className="p-5 flex flex-col justify-between space-y-4" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.1 }}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] rounded-full uppercase tracking-wider border border-slate-200/60 dark:border-slate-700/60">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500">{item.date} • {item.time} WIB</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base hover:text-emerald-600 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-3 pt-1">
                <Avatar src={item.speakerAvatar} name={item.speaker} size="md" />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.speaker}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{item.speakerTitle}</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {item.location}
              </span>
              <button onClick={() => showToast(`Pengingat WhatsApp untuk ${item.title} telah dikirim ke HP Anda`, 'info')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60">
                <MessageCircle className="w-3.5 h-3.5" /> Ingatkan WA
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

/** Featured campaign banner */
const FeaturedCampaign: React.FC = () => {
  const { campaigns, setPublicSubTab } = useApp();
  const featured = campaigns[0];
  if (!featured) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 text-amber-400 text-xs font-semibold rounded-lg border border-amber-400/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Program Donasi Unggulan
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">{featured.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{featured.description}</p>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Terkumpul: Rp {featured.collectedAmount.toLocaleString('id-ID')}</span>
              <span className="text-amber-400">Target: Rp {featured.targetAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, (featured.collectedAmount / featured.targetAmount) * 100)}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }} className="bg-emerald-500 h-full rounded-full" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{featured.donorCount} Donatur Berkontribusi</span>
              <span>{Math.round((featured.collectedAmount / featured.targetAmount) * 100)}% Capaian</span>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPublicSubTab('donation')} className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2">
            <Heart className="w-4 h-4 fill-slate-950" /> Ikut Wakaf / Infaq Sekarang
          </motion.button>
        </div>
        <div className="lg:col-span-5">
          {featured.imageUrl && featured.imageUrl.trim() !== '' ? (
            <img src={featured.imageUrl} alt={featured.title} className="w-full h-64 object-cover rounded-2xl border border-slate-800 shadow-xl" />
          ) : (
            <PlaceholderImage category={featured.category} title={featured.title} className="rounded-2xl h-64" />
          )}
        </div>
      </div>
    </section>
  );
};

export const PublicHome: React.FC = () => {
  const { setPublicSubTab } = useApp();
  const [upcoming, setUpcoming] = useState(() => getUpcomingPrayer());

  useEffect(() => {
    const tick = () => setUpcoming(getUpcomingPrayer());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 pb-16">
      <RunningTicker />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-emerald-400 rounded-lg text-xs font-semibold border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masjid Jami Nurul Iman • Pejaten Timur</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
              Pusat Ibadah, Edukasi & <br className="hidden sm:inline" />
              <span className="text-amber-400">Pemberdayaan Ummat</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Mewujudkan kemakmuran masjid yang modern, transparan, dan inklusif. Melayani seluruh jamaah Pejaten Timur melalui kegiatan ibadah, pengelolaan ZISWAF, program sosial, dan pemberdayaan ekonomi syariah.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPublicSubTab('donation')} className="px-5 sm:px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all">
                <Heart className="w-4 h-4 fill-white" /> Donasi / Infaq Online
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPublicSubTab('prayer_times')} className="px-5 sm:px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all">
                <Clock className="w-4 h-4 text-amber-400" /> Jadwal Sholat
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPublicSubTab('financial_report')} className="px-5 sm:px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Kas Transparan
              </motion.button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-5">
            <PrayerWidget upcoming={upcoming} />
          </motion.div>
        </div>
      </section>

      <StatsGrid />
      <KajianSection />
      <FeaturedCampaign />

      <section className="space-y-4">
        <MasjidGoogleMap />
      </section>
    </div>
  );
};
