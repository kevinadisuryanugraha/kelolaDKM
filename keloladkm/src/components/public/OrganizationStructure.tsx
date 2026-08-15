import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DKM_STAFF } from '../../data/mockData';
import { DkmStaff } from '../../types';
import { Phone, Mail, UserCheck, X, Building2 } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';

export const OrganizationStructure: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<DkmStaff | null>(null);

  const ketua = DKM_STAFF.find((s) => s.position === 'Ketua DKM');
  const pengurusLain = DKM_STAFF.filter((s) => s.position !== 'Ketua DKM');

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badgeKey="pages.organization.badge"
        titleKey="pages.organization.title"
        subtitleKey="pages.organization.subtitle"
      />

      {/* Organizational Hierarchy Chart */}
      <GlassCard className="p-6 sm:p-10 space-y-10" glow="emerald" hoverEffect={false}>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-xl text-slate-900 dark:text-white">
            Bagan Hierarki Pengurus Harian
          </h3>
          <p className="text-xs text-slate-500">Klik salah satu pengurus untuk melihat detail biodata & kontak</p>
        </div>

        {/* Level 1: Ketua DKM */}
        {ketua && (
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStaff(ketua)}
              className="bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 dark:from-emerald-950/80 dark:to-emerald-900/60 border-2 border-emerald-500/50 rounded-3xl p-6 w-80 text-center shadow-xl cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />
              
              <img
                src={ketua.photoUrl}
                alt={ketua.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-amber-400 shadow-md mb-3 group-hover:scale-105 transition-transform"
              />
              
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                {ketua.position}
              </span>
              
              <h4 className="font-bold text-base text-slate-900 dark:text-white mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {ketua.name}
              </h4>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ketua.department}</p>
            </motion.div>
          </div>
        )}

        {/* Decorative Connecting Line */}
        <div className="w-0.5 h-8 bg-emerald-500/40 mx-auto -my-4" />

        {/* Level 2: Pengurus Harian / Bidang */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {pengurusLain.map((staff, idx) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStaff(staff)}
              className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center shadow-sm cursor-pointer hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all group relative overflow-hidden"
            >
              <img
                src={staff.photoUrl}
                alt={staff.name}
                className="w-18 h-18 rounded-2xl object-cover mx-auto border border-emerald-500/30 mb-3 shadow-sm group-hover:scale-105 transition-transform"
              />
              
              <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {staff.position}
              </span>
              
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {staff.name}
              </h4>
              
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{staff.department}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Staff Detail Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setSelectedStaff(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 pt-2">
                <img
                  src={selectedStaff.photoUrl}
                  alt={selectedStaff.name}
                  className="w-28 h-28 rounded-3xl object-cover mx-auto border-2 border-emerald-500 shadow-lg"
                />
                <span className="px-3 py-1 bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-400/30 inline-block">
                  {selectedStaff.position}
                </span>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">{selectedStaff.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedStaff.department}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs space-y-3 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" /> Masa Penugasan:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStaff.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" /> Kontak WhatsApp:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{selectedStaff.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-emerald-600" /> Email Resmi:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{selectedStaff.email}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStaff(null)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shadow-md transition-all"
              >
                Tutup Informasi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
