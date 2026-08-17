import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Send, MessageSquare, CheckCheck, Smartphone, Sparkles, RefreshCw, PhoneCall, Users, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { formatWhatsAppMessage, openWhatsAppDirect, WhatsAppMessagePayload } from '../../utils/whatsappGateway';
import { MASJID_INFO } from '../../data/mockData';

export const BroadcastNotificationModule: React.FC = () => {
  const { showToast } = useApp();

  const [targetGroup, setTargetGroup] = useState('Jamaah umum');
  const [templateType, setTemplateType] = useState<WhatsAppMessagePayload['type']>('BROADCAST_KAJIAN');
  const [channel, setChannel] = useState<'WhatsApp' | 'Telegram' | 'Email'>('WhatsApp');
  const [testPhone, setTestPhone] = useState('081298765432');
  const [recipientName, setRecipientName] = useState('Bpk. H. Abdullah');
  const [isSending, setIsSending] = useState(false);

  // Dynamic message based on template
  const [message, setMessage] = useState(() =>
    formatWhatsAppMessage({
      recipientName: 'Bpk. H. Abdullah',
      recipientPhone: '081298765432',
      type: 'BROADCAST_KAJIAN',
      data: {
        title: 'Kajian Tafsir Al-Qur\'an & Bedah Kitab Riyadhus Shalihin',
        speaker: 'Ustadz Dr. H. Ahmad Fauzi, Lc., MA.',
        date: 'Sabtu Malam Ahad (22 Agustus 2026)',
        time: 'Ba\'da Maghrib (18:15 WIB)',
      }
    })
  );

  const handleTemplateChange = (type: WhatsAppMessagePayload['type']) => {
    setTemplateType(type);
    let newMsg = '';
    if (type === 'KWITANSI_DONASI') {
      newMsg = formatWhatsAppMessage({
        recipientName: recipientName || 'Hamba Allah',
        recipientPhone: testPhone,
        type: 'KWITANSI_DONASI',
        data: {
          refNumber: 'INV/20260817/042',
          amount: 500000,
          category: 'Infaq Renovasi Sound System Masjid',
          date: new Date().toLocaleDateString('id-ID'),
        }
      });
    } else if (type === 'BROADCAST_KAJIAN') {
      newMsg = formatWhatsAppMessage({
        recipientName: 'Jamaah Nurul Iman',
        recipientPhone: testPhone,
        type: 'BROADCAST_KAJIAN',
        data: {
          title: 'Kajian Rutin Tafsir Ayat-Ayat Syariah',
          speaker: 'Ustadz Dr. H. Syamsuddin Noor, MA.',
          date: 'Ahad Pagi (23 Agustus 2026)',
          time: '06:00 WIB',
        }
      });
    } else if (type === 'REMINDER_QURBAN') {
      newMsg = formatWhatsAppMessage({
        recipientName: recipientName || 'Bpk. Hendra Gunawan',
        recipientPhone: testPhone,
        type: 'REMINDER_QURBAN',
        data: {
          refNumber: 'QRB-2026-088',
          category: '1 Ekor Kambing Super',
        }
      });
    } else {
      newMsg = `*Assalamu'alaikum Warahmatullahi Wabarakatuh*\n\nDiberitahukan kepada seluruh Jamaah ${MASJID_INFO.name}, pengajian bulanan Muslimah akan diselenggarakan pada hari Kamis pukul 09.00 WIB.\n\n*DKM ${MASJID_INFO.name}*`;
    }
    setMessage(newMsg);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast(`Pesan broadcast berhasil dikirim via ${channel} ke ${targetGroup} (1,420 Kontak)!`, 'success');
    }, 1000);
  };

  const handleOpenDirectWhatsApp = () => {
    openWhatsAppDirect(testPhone, message);
    showToast(`Membuka WhatsApp Web untuk nomor ${testPhone}`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Broadcast WhatsApp & Notifikasi Jamaah</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Gateway Pengiriman Pesan Massal, Jadwal Kajian & Kwitansi Digital Otomatis</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> WA Gateway Online
          </span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Broadcast Setup */}
        <GlassCard className="lg:col-span-7 p-6 space-y-5" glow="emerald" hoverEffect={false}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800/80 pb-3 flex items-center justify-between">
            <span>Penyusunan Pesan Broadcast</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </h3>

          {/* Preset Templates */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Template Standar DKM:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'BROADCAST_KAJIAN', label: '📢 Jadwal Kajian' },
                { id: 'KWITANSI_DONASI', label: '🧾 Kwitansi Donasi' },
                { id: 'REMINDER_QURBAN', label: '🏷️ Kupon Qurban' },
                { id: 'CUSTOM', label: '✍️ Pesan Kustom' },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id as any)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all ${
                    templateType === tmpl.id
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kanal Blast</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="WhatsApp">WhatsApp Official Gateway</option>
                  <option value="Telegram">Telegram Channel DKM</option>
                  <option value="Email">Email Newsletter Jamaah</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Target Jamaah</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Jamaah umum">Seluruh Jamaah Nurul Iman (1,420 Kontak)</option>
                  <option value="Donatur rutin">Muzakki & Donatur Tetap (210 Kontak)</option>
                  <option value="Peserta Qurban">Peserta Ibadah Qurban (88 Kontak)</option>
                  <option value="Pengurus DKM">Pengurus & Seksi Bidang (32 Kontak)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nama Jamaah (Uji Coba)</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Contoh: Bpk. H. Abdullah"
                  className="w-full px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nomor WhatsApp HP</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="0812xxxxxxx"
                  className="w-full px-3.5 py-2 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Isi Pesan (Format WhatsApp Markdown)</label>
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSending}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengirim ke Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Blast Massal ke {targetGroup}</span>
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleOpenDirectWhatsApp}
                className="px-4 py-3 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 text-xs transition-colors"
              >
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>Test Buka WA Web</span>
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Right Phone WhatsApp Chat Simulator */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#0b141a] text-slate-100 rounded-3xl p-4 shadow-2xl border-4 border-slate-800 flex flex-col flex-1 max-w-md mx-auto w-full">
            {/* Phone Top Header */}
            <div className="bg-[#202c33] p-3 rounded-2xl flex items-center justify-between mb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-amber-300 text-sm">
                  🕌
                </div>
                <div>
                  <div className="font-bold text-xs text-white leading-tight flex items-center gap-1">
                    <span>{MASJID_INFO.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">Akun Resmi Terverifikasi</div>
                </div>
              </div>
              <div className="text-slate-400 text-xs font-mono">11:45</div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-[#0b141a] rounded-2xl p-2 overflow-y-auto space-y-3 min-h-[300px]">
              <div className="text-center">
                <span className="bg-[#182229] text-slate-400 text-[10px] px-3 py-1 rounded-lg">
                  HARI INI
                </span>
              </div>

              {/* Chat Bubble */}
              <div className="flex justify-start">
                <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tl-xs max-w-[92%] shadow-md text-xs relative space-y-1">
                  <p className="whitespace-pre-line leading-relaxed text-[11px] font-sans">
                    {message}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200 mt-1 font-mono">
                    <span>11:45</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Footer Bar */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Status: <strong className="text-emerald-400">Terkirim & Terbaca</strong></span>
              <span className="font-mono">ID: WA-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
