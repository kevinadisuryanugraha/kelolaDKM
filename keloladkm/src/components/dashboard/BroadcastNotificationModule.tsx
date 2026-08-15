import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Send } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const BroadcastNotificationModule: React.FC = () => {
  const { showToast } = useApp();

  const [targetGroup, setTargetGroup] = useState('Jamaah umum');
  const [channel, setChannel] = useState<'WhatsApp' | 'Telegram' | 'Email'>('WhatsApp');
  const [message, setMessage] = useState(
    "Assalamu'alaikum Wr. Wb. Diberitahukan kepada seluruh Jamaah Masjid Jami Nurul Iman Pejaten Timur, Khatib Sholat Jumat esok hari adalah KH. Dr. Syamsuddin Noor, MA. Mohon hadir tepat waktu. Bararakallahu fiikum."
  );

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Pesan Broadcast via ${channel} berhasil dikirimkan ke grup: ${targetGroup}!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex items-center justify-between" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Broadcast WhatsApp, Telegram & Email</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Kirim Pesan Massal, Pengumuman Sholat Jumat & Kwitansi Digital Auto-WA</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-8 p-6 space-y-4" glow="emerald" hoverEffect={false}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
            Form Kirim Pesan Broadcast Massal
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Kanal Pengiriman</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="WhatsApp">WhatsApp Official Gateway</option>
                  <option value="Telegram">Telegram Channel DKM</option>
                  <option value="Email">Email Newsletter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Penerima Pesan (Target Group)</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Jamaah umum">Seluruh Jamaah (1,420 Kontak)</option>
                  <option value="Donatur rutin">Donatur & Muzakki (210 Kontak)</option>
                  <option value="Pengurus DKM">Pengurus & Relawan DKM (32 Kontak)</option>

                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Isi Pesan Broadcast</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-sans leading-relaxed"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Broadcast Sekarang</span>
            </motion.button>
          </form>
        </GlassCard>

        {/* Right WhatsApp Simulator */}
        <GlassCard className="lg:col-span-4 p-6 space-y-4" glow="gold" hoverEffect={false}>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">Simulasi Pesan WhatsApp</h4>
          <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 text-xs space-y-2 text-white">
            <div className="font-bold text-amber-300">DKM Nurul Iman Official</div>
            <p className="text-emerald-100 whitespace-pre-line leading-relaxed">{message}</p>
            <span className="text-[10px] text-emerald-400 font-mono block text-right">Terkirim 11:24 • WA Gateway Verified</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
