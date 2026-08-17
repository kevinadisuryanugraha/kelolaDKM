import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { MASJID_INFO } from '../../data/mockData';
import { DonationCampaign } from '../../types';
import { Heart, QrCode, Upload, CheckCircle2, X, Copy, Check, MessageSquare, Download, Printer, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { PlaceholderImage } from '../common/PlaceholderImage';
import { openWhatsAppDirect, formatWhatsAppMessage } from '../../utils/whatsappGateway';
import { printOfficialReceipt } from '../../utils/exportOfficialDoc';

export const DonationPublicPage: React.FC = () => {
  const { campaigns, addDonorRecord, showToast } = useApp();

  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [amount, setAmount] = useState<number>(100000);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Transfer BSI' | 'Transfer Muamalat'>('QRIS');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [proofFileName, setProofFileName] = useState<string>('');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Success Step State
  const [isSuccessModal, setIsSuccessModal] = useState<boolean>(false);
  const [submittedDonation, setSubmittedDonation] = useState<any>(null);

  const handleCopyAccount = (accNumber: string, bank: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(bank);
    showToast(`Nomor rekening ${bank} (${accNumber}) berhasil disalin!`, 'success');
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    const refNum = `REC/${Date.now().toString().slice(-6)}`;
    const effectiveName = isAnonymous ? 'Hamba Allah' : donorName.trim() || 'Hamba Allah';

    const donationData = {
      id: refNum,
      donorName: effectiveName,
      phone: donorPhone || '081298765432',
      email: donorEmail,
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      amount: Number(amount),
      method: paymentMethod,
      isAnonymous,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending' as const,
      proofUrl: proofFileName ? 'uploaded_proof.jpg' : undefined
    };

    addDonorRecord(donationData);
    setSubmittedDonation(donationData);
    setIsSuccessModal(true);
    setSelectedCampaign(null);
  };

  const handleSendConfirmationWA = () => {
    if (!submittedDonation) return;

    const waText = `*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. Bendahara DKM *${MASJID_INFO.name}*,

Saya ingin konfirmasi penyaluran donasi/infaq online:
━━━━━━━━━━━━━━━━━━━━
• *Nama Donatur* : *${submittedDonation.donorName}*
• *No. WhatsApp* : ${submittedDonation.phone}
• *Program*      : ${submittedDonation.campaignTitle}
• *Nominal*      : *Rp ${submittedDonation.amount.toLocaleString('id-ID')}*
• *Metode*       : ${submittedDonation.method}
• *Tanggal*      : ${new Date().toLocaleDateString('id-ID')}
• *No. Referensi*: ${submittedDonation.id}
━━━━━━━━━━━━━━━━━━━━

Mohon untuk diverifikasi dan dicatat pada pembukuan kas DKM. Terima kasih.

Wassalamu'alaikum Wr. Wb.`;

    openWhatsAppDirect('081298765432', waText);
    showToast('Membuka WhatsApp untuk mengirim bukti konfirmasi donasi ke Bendahara', 'info');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        titleKey="pages.donation.title"
        subtitleKey="pages.donation.subtitle"
      />

      {/* Direct Payment Guide Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 border border-emerald-700/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-400/30">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Donasi Langsung Bebas Potongan Pihak Ketiga (100% Masuk Kas Masjid)
          </div>
          <h3 className="text-xl font-bold">Salurkan Infaq, Zakat & Wakaf via QRIS Resmi atau Transfer BSI</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Seluruh transaksi donasi tercatat transparan dan langsung diverifikasi oleh Bendahara DKM {MASJID_INFO.name}.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white p-2.5 rounded-2xl shadow-lg border border-emerald-500/30 text-center">
            <QrCode className="w-16 h-16 text-slate-900 mx-auto" />
            <span className="text-[10px] font-bold text-slate-700 block mt-1">QRIS Standar BI</span>
          </div>
        </div>
      </div>

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
                  {cmp.imageUrl && cmp.imageUrl.trim() !== '' ? (
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
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto"
            >
              {/* Sticky Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">Form Infaq / Donasi Online</h3>
                  <p className="text-xs text-emerald-400 font-medium truncate max-w-xs">{selectedCampaign.title}</p>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleDonateSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Quick Nominal Options */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Pilih Nominal Donasi (Rp)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[25000, 50000, 100000, 250000, 500000, 1000000].map((nom) => (
                      <button
                        type="button"
                        key={nom}
                        onClick={() => setAmount(nom)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
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
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
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
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Lengkap Donatur
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: H. Ahmad Fauzan"
                      disabled={isAnonymous}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50 text-slate-900 dark:text-white"
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
                    <label htmlFor="anon" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium">
                      Sembunyikan nama saya (Donasi sebagai Hamba Allah)
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nomor WhatsApp (untuk konfirmasi & kwitansi)
                    </label>
                    <input
                      type="text"
                      placeholder="0812xxxxxxxx"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Direct Payment Channel Selector */}
                <div className="pt-2 space-y-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Pilih Metode Donasi Bebas Admin
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'QRIS', label: '📱 QRIS Resmi' },
                      { id: 'Transfer BSI', label: '🏦 Transfer BSI' },
                      { id: 'Transfer Muamalat', label: '🏦 Bank Muamalat' }
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
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

                {/* Method Display Card */}
                {paymentMethod === 'QRIS' ? (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-400/40 text-center space-y-3">
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                      Scan QRIS Resmi {MASJID_INFO.name}
                    </div>
                    <div className="bg-white p-3 rounded-2xl w-40 h-40 mx-auto flex items-center justify-center border shadow-md">
                      <QrCode className="w-32 h-32 text-slate-900" />
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <p className="font-semibold">NMID: <span className="font-mono font-bold text-slate-900 dark:text-white">ID1024398291048</span></p>
                      <p className="text-[10px] text-slate-500">Mendukung: BSI Mobile, BCA Mobile, Livin, GoPay, OVO, ShopeePay, DANA</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100/90 dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {paymentMethod === 'Transfer BSI' ? 'Bank Syariah Indonesia (BSI)' : 'Bank Muamalat Indonesia'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-md">Bebas Potongan</span>
                    </div>
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="text-[10px] text-slate-400">Nomor Rekening Resmi DKM:</div>
                        <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                          {paymentMethod === 'Transfer BSI' ? '718-293-8472' : '101-008-9921'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">a.n. DKM Masjid Jami Nurul Iman</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(paymentMethod === 'Transfer BSI' ? '7182938472' : '1010089921', paymentMethod)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        {copiedBank === paymentMethod ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedBank === paymentMethod ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lanjutkan Konfirmasi Donasi Rp {Number(amount).toLocaleString('id-ID')}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Confirmation Modal */}
      <AnimatePresence>
        {isSuccessModal && submittedDonation && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl p-6 text-center space-y-4 my-auto"
            >
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Alhamdulillah, Donasi Dicatat!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Terima kasih atas infaq/zakat Anda untuk <strong>{submittedDonation.campaignTitle}</strong>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Referensi:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{submittedDonation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Donatur:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{submittedDonation.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jumlah Donasi:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {submittedDonation.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{submittedDonation.method}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendConfirmationWA}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Konfirmasi ke WA Bendahara</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    printOfficialReceipt({
                      refNumber: submittedDonation.id,
                      donorName: submittedDonation.donorName,
                      amount: submittedDonation.amount,
                      category: submittedDonation.campaignTitle,
                      date: submittedDonation.date,
                      notes: `Metode: ${submittedDonation.method}`,
                      recordedBy: 'Online Donatur'
                    });
                  }}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Kwitansi Digital</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModal(false);
                    setSubmittedDonation(null);
                  }}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
