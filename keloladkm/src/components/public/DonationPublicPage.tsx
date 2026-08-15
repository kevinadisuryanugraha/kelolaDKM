import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { MASJID_INFO } from '../../data/mockData';
import { DonationCampaign } from '../../types';
import { Heart, QrCode, Upload, CheckCircle2, X } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { PlaceholderImage } from '../common/PlaceholderImage';

export const DonationPublicPage: React.FC = () => {
  const { campaigns, addDonorRecord } = useApp();

  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [amount, setAmount] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Transfer BSI' | 'Transfer Mandiri'>('QRIS');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [proofFileName, setProofFileName] = useState<string>('');

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    addDonorRecord({
      donorName: isAnonymous ? 'Hamba Allah' : donorName || 'Hamba Allah',
      phone: donorPhone || '081234567890',
      email: donorEmail,
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      amount: Number(amount),
      method: paymentMethod,
      isAnonymous,
      proofUrl: proofFileName ? 'uploaded_proof.jpg' : undefined
    });

    // Reset Form
    setSelectedCampaign(null);
    setDonorName('');
    setDonorPhone('');
    setAmount(100000);
    setProofFileName('');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        title="Donasi Resmi Masjid Jami Nurul Iman"
        subtitle="Salurkan infaq, sedekah, dan wakaf Anda untuk pembangunan sarana ibadah dan pemberdayaan ummat. Seluruh donasi dicatat secara akuntabel dan transparan."
      />

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((cmp, idx) => {
          const percent = Math.min(100, Math.round((cmp.collectedAmount / cmp.targetAmount) * 100));
          return (
            <GlassCard
              key={cmp.id}
              className="p-0 overflow-hidden flex flex-col justify-between group"
              glow="emerald"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <div className="space-y-4">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  {cmp.imageUrl ? (
                    <img
                      src={cmp.imageUrl}
                      alt={cmp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <PlaceholderImage category={cmp.category} title={cmp.title} />
                  )}
                  <div className="absolute top-3 left-3 bg-emerald-950/90 text-amber-300 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-md">
                    {cmp.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {cmp.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{cmp.description}</p>

                  {/* Progress bar */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Rp {cmp.collectedAmount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-400 font-medium">
                        Target: Rp {cmp.targetAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-emerald-500 h-full rounded-full"
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>{cmp.donorCount} Donatur</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{percent}% Terkumpul</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCampaign(cmp)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Donasi Sekarang</span>
                </motion.button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Donation Form Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
            >
              {/* Sticky Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">Form Infaq / Donasi Online</h3>
                  <p className="text-xs text-slate-300 truncate max-w-xs">{selectedCampaign.title}</p>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleDonateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Quick Nominal Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Pilih Nominal Donasi (Rp)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[50000, 100000, 250000, 500000, 1000000, 2500000].map((nom) => (
                      <button
                        type="button"
                        key={nom}
                        onClick={() => setAmount(nom)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          amount === nom
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Rp {nom.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Atau Masukkan Nominal Lain (Rp)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                {/* Donor Info */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Lengkap Donatur
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: H. Ahmad Fauzan"
                      disabled={isAnonymous}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anon"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <label htmlFor="anon" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      Sembunyikan nama saya (Donasi sebagai Hamba Allah)
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nomor WhatsApp (untuk bukti tanda terima)
                    </label>
                    <input
                      type="text"
                      placeholder="0812xxxxxxxx"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="pt-1 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Metode Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'QRIS', label: 'QRIS Instant' },
                      { id: 'Transfer BSI', label: 'Transfer BSI' },
                      { id: 'Transfer Mandiri', label: 'Mandiri Syariah' }
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          paymentMethod === m.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* QRIS / Bank Details */}
                {paymentMethod === 'QRIS' ? (
                  <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-400/40 text-center space-y-2">
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      Scan Kode QRIS {MASJID_INFO.qrisMerchantName}
                    </div>
                    <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex items-center justify-center border shadow-md">
                      <QrCode className="w-28 h-28 text-slate-900" />
                    </div>
                    <p className="text-[10px] text-amber-700 dark:text-amber-400">
                      NMID: {MASJID_INFO.qrisNMID} • Bebas Biaya Admin
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-100/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Transfer Rekening DKM:</p>
                    <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      {paymentMethod === 'Transfer BSI' ? '711-2233-445 (BSI)' : '127-000-889912-3 (Mandiri)'}
                    </p>
                    <p className="text-[11px] text-slate-500">Atas Nama: {MASJID_INFO.bankAccounts[0].accountName}</p>
                  </div>
                )}

                {/* Proof File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Unggah Bukti Transfer / Scan (Opsional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <input
                      type="file"
                      id="fileProof"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProofFileName(e.target.files[0].name);
                        }
                      }}
                    />
                    <label htmlFor="fileProof" className="cursor-pointer space-y-1 block">
                      <Upload className="w-5 h-5 text-emerald-600 mx-auto" />
                      <span className="text-xs text-slate-600 dark:text-slate-300 block font-medium">
                        {proofFileName || 'Klik di sini untuk upload foto struk transfer'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Donasi Rp {Number(amount).toLocaleString('id-ID')}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
