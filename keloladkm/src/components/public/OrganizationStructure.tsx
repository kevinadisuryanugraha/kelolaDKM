import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DKM_STAFF } from '../../data/mockData';
import { DkmStaff } from '../../types';
import { Phone, Mail, UserCheck, X, Building2, UserCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { Avatar } from '../common/Avatar';
import { openWhatsAppDirect } from '../../utils/whatsappGateway';

export const OrganizationStructure: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<DkmStaff | null>(null);

  const ketua = DKM_STAFF.find((s) => s.position === 'Ketua DKM');
  const pengurusLain = DKM_STAFF.filter((s) => s.position !== 'Ketua DKM');

  const handleSelectStaff = (staff: DkmStaff) => {
    setSelectedStaff(selectedStaff?.id === staff.id ? null : staff);
  };

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
          <p className="text-xs text-slate-500">Pilih salah satu pengurus untuk melihat detail profil & kontak di bawah</p>
        </div>

        {/* Level 1: Ketua DKM */}
        {ketua && (
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectStaff(ketua)}
              className={`bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 dark:from-emerald-950/80 dark:to-emerald-900/60 border-2 rounded-3xl p-6 w-80 text-center shadow-xl cursor-pointer transition-all group relative overflow-hidden ${
                selectedStaff?.id === ketua.id
                  ? 'border-amber-400 ring-4 ring-amber-400/20'
                  : 'border-emerald-500/50 hover:border-emerald-500'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />
              
              <Avatar
                src={ketua.photoUrl}
                name={ketua.name}
                size="2xl"
                className="mx-auto border-2 border-amber-400 shadow-md mb-3 group-hover:scale-105 transition-transform"
              />
              
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
                {ketua.position}
              </span>
              
              <h4 className="font-bold text-base text-slate-900 dark:text-white mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                {ketua.name}
              </h4>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ketua.department}</p>

              <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                <span>{selectedStaff?.id === ketua.id ? 'Tutup Detail' : 'Lihat Profil'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectedStaff?.id === ketua.id ? 'rotate-180' : ''}`} />
              </div>
            </motion.div>
          </div>
        )}

        {/* Decorative Connecting Line */}
        <div className="w-0.5 h-8 bg-emerald-500/40 mx-auto -my-4" />

        {/* Level 2: Pengurus Harian / Bidang */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {pengurusLain.map((staff, idx) => {
            const isSelected = selectedStaff?.id === staff.id;
            return (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectStaff(staff)}
                className={`bg-white/80 dark:bg-slate-900/80 border rounded-2xl p-5 text-center shadow-sm cursor-pointer transition-all group relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <Avatar
                  src={staff.photoUrl}
                  name={staff.name}
                  size="xl"
                  className="w-16 h-16 text-lg font-bold mx-auto border border-emerald-500/30 mb-3 shadow-sm group-hover:scale-105 transition-transform"
                />
                
                <span className="inline-block text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {staff.position}
                </span>
                
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {staff.name}
                </h4>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{staff.department}</p>

                <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>{isSelected ? 'Tutup Detail' : 'Lihat Profil'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* Inline Dedicated Staff Detail Section */}
      <AnimatePresence>
        {selectedStaff && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="scroll-mt-6"
          >
            <GlassCard className="p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <Avatar
                    src={selectedStaff.photoUrl}
                    name={selectedStaff.name}
                    size="2xl"
                    className="w-24 h-24 text-2xl font-bold border-2 border-emerald-500 shadow-xl"
                  />
                  <div className="space-y-1.5">
                    <span className="px-3 py-1 bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-400/30 inline-block">
                      {selectedStaff.position}
                    </span>
                    <h3 className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">{selectedStaff.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedStaff.department} • Masjid Jami Nurul Iman</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors self-end sm:self-start"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-4 h-4 text-emerald-600" /> Masa Bakti Khidmat
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedStaff.period}</div>
                  <span className="text-[10px] text-emerald-600 font-medium">Aktif Bertugas</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Phone className="w-4 h-4 text-emerald-600" /> Kontak WhatsApp Resmi
                  </span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{selectedStaff.phone}</div>
                  <button
                    onClick={() => openWhatsAppDirect(selectedStaff.phone.replace(/[^0-9]/g, ''), `Assalamu'alaikum Warahmatullahi Wabarakatuh ${selectedStaff.name}`)}
                    className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" /> Hubungi Pengurus
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Mail className="w-4 h-4 text-emerald-600" /> Email Resmi DKM
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white font-mono text-xs truncate">{selectedStaff.email}</div>
                  <span className="text-[10px] text-slate-400 font-medium">Domain Resmi Masjid</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
