import React from 'react';
import { motion } from 'motion/react';
import { IMAM_MUADZIN_LIST } from '../../data/mockData';
import { Calendar, BookOpen, Award } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';

export const ImamMuadzinKhatib: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badge="Tokoh & Petugas Ibadah"
        title="Profil Imam, Muadzin & Khatib"
        subtitle="Para ustadz, muadzin, dan huffazh Al-Qur'an yang memimpin pelaksanaan ibadah ritual, adhan, dan khutbah Jumat di Masjid Jami Nurul Iman Pejaten Timur."
      />

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {IMAM_MUADZIN_LIST.map((item, idx) => (
          <GlassCard
            key={item.id}
            className="p-6 flex flex-col justify-between space-y-5"
            glow="emerald"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className="space-y-4 text-center">
              <div className="relative inline-block">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-32 h-32 rounded-3xl object-cover mx-auto border-2 border-emerald-500/40 shadow-xl"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-emerald-950 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
                  {item.role}
                </span>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{item.role}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-left bg-slate-100/60 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                {item.bio}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Jadwal Penugasan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.dutyDays.map((day, dIdx) => (
                  <span
                    key={dIdx}
                    className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl text-[11px] border border-emerald-500/20"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
