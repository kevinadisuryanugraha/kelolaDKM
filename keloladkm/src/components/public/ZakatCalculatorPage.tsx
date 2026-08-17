import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Calculator, CheckCircle, Scale, AlertCircle, QrCode, Copy, Check, MessageSquare, Printer, ShieldCheck, X } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { printOfficialReceipt } from '../../utils/exportOfficialDoc';
import { openWhatsAppDirect } from '../../utils/whatsappGateway';
import { MASJID_INFO } from '../../data/mockData';

export const ZakatCalculatorPage: React.FC = () => {
  const { addDonorRecord, showToast } = useApp();

  const [zakatType, setZakatType] = useState<'fitrah' | 'mal' | 'fidyah' | 'infaq'>('fitrah');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [muzakkiName, setMuzakkiName] = useState('Bpk. H. Abdullah');
  const [muzakkiPhone, setMuzakkiPhone] = useState('081298765432');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Zakat Fitrah state
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [ricePricePerKg, setRicePricePerKg] = useState<number>(15000);

  // Zakat Mal state
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [goldPrice] = useState<number>(1350000);
  const [savingsAmount, setSavingsAmount] = useState<number>(120000000);
  const [tradeProfit] = useState<number>(0);

  // Fidyah state
  const [fidyahDays, setFidyahDays] = useState<number>(7);
  const [fidyahRatePerDay] = useState<number>(45000);

  // Infaq state
  const [infaqAmount, setInfaqAmount] = useState<number>(100000);

  // Calculation Logic
  const fitrahTotal = peopleCount * (2.5 * ricePricePerKg);

  const nisabGoldValue = 85 * goldPrice;
  const totalMalWealth = (goldGrams * goldPrice) + savingsAmount + tradeProfit;
  const isNisabReached = totalMalWealth >= nisabGoldValue;
  const malTotal = isNisabReached ? totalMalWealth * 0.025 : 0;

  const fidyahTotal = fidyahDays * fidyahRatePerDay;

  const currentTotal =
    zakatType === 'fitrah'
      ? fitrahTotal
      : zakatType === 'mal'
      ? malTotal
      : zakatType === 'fidyah'
      ? fidyahTotal
      : infaqAmount;

  const handleCopyAccount = (accNumber: string, bank: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(bank);
    showToast(`Nomor rekening ${bank} (${accNumber}) berhasil disalin!`, 'success');
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleConfirmZakat = () => {
    const refNum = `ZIS/${Date.now().toString().slice(-6)}`;
    addDonorRecord({
      donorName: muzakkiName || 'Muzakki Nurul Iman',
      phone: muzakkiPhone || '081298765432',
      campaignId: 'CMP-ZIS',
      campaignTitle: `Tunaikan ${zakatType.toUpperCase()}`,
      amount: currentTotal,
      method: 'QRIS'
    });

    const waText = `*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. Amil ZISWAF DKM *${MASJID_INFO.name}*,

Saya ingin konfirmasi penunaian ZISWAF:
━━━━━━━━━━━━━━━━━━━━
• *Nama Muzakki*  : *${muzakkiName || 'Hamba Allah'}*
• *No. WhatsApp*  : ${muzakkiPhone}
• *Jenis ZISWAF*  : *${zakatType.toUpperCase()}*
• *Nominal Bayar* : *Rp ${currentTotal.toLocaleString('id-ID')}*
• *Metode*        : QRIS Resmi DKM / Transfer BSI
• *No. Referensi* : ${refNum}
• *Tanggal*       : ${new Date().toLocaleDateString('id-ID')}
━━━━━━━━━━━━━━━━━━━━

Mohon untuk diverifikasi dan dicatat pada pembukuan ZISWAF DKM. Syukran.

Wassalamu'alaikum Wr. Wb.`;

    openWhatsAppDirect('081298765432', waText);
    showToast(`Alhamdulillah, pembayaran ${zakatType.toUpperCase()} dicatat & WhatsApp disiapkan!`, 'success');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badgeKey="pages.zakat.badge"
        titleKey="pages.zakat.title"
        subtitleKey="pages.zakat.subtitle"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Calculator Form */}
        <GlassCard className="lg:col-span-8 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
          {/* Zakat Type Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'fitrah', label: 'Zakat Fitrah' },
              { id: 'mal', label: 'Zakat Mal / Harta' },
              { id: 'fidyah', label: 'Fidyah Puasa' },
              { id: 'infaq', label: 'Infaq & Sedekah' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setZakatType(tab.id as any)}
                className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                  zakatType === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Type 1: Zakat Fitrah */}
          {zakatType === 'fitrah' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <p className="font-bold">Ketentuan Zakat Fitrah Syariat:</p>
                <p>Wajib dibayarkan setiap jiwa sebesar 2.5 kg atau 3.5 liter beras kualitas konsumsi harian (atau dikonversi ke nominal uang tunai).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Jumlah Anggota Keluarga (Jiwa)
                </label>
                <input
                  type="number"
                  min={1}
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Harga Beras Per Kg (Rp)
                </label>
                <input
                  type="number"
                  value={ricePricePerKg}
                  onChange={(e) => setRicePricePerKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </motion.div>
          )}

          {/* Type 2: Zakat Mal */}
          {zakatType === 'mal' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-400/30 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-bold">Ketentuan Zakat Harta (Mal):</p>
                <p>Nisab 85 gram emas (± Rp {(85 * goldPrice).toLocaleString('id-ID')}). Haul 1 tahun kepemilikan. Tarif 2.5%.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tabungan, Deposito, Kas (Rp)
                  </label>
                  <input
                    type="number"
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Simpanan Emas Murni (Gram)
                  </label>
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Type 3: Fidyah */}
          {zakatType === 'fidyah' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Jumlah Hari Utang Puasa (Hari)
                </label>
                <input
                  type="number"
                  min={1}
                  value={fidyahDays}
                  onChange={(e) => setFidyahDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </motion.div>
          )}

          {/* Type 4: Infaq */}
          {zakatType === 'infaq' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nominal Infaq / Sedekah (Rp)
                </label>
                <input
                  type="number"
                  value={infaqAmount}
                  onChange={(e) => setInfaqAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </motion.div>
          )}
        </GlassCard>

        {/* Right: Summary Box & Checkout */}
        <GlassCard className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6" glow="gold">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" /> Hasil Perhitungan {zakatType.toUpperCase()}
            </div>

            <div className="py-4 border-y border-slate-200/80 dark:border-slate-800/80 space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Wajib Bayar:</span>
              <div className="text-3xl font-mono font-bold text-amber-500 dark:text-amber-400 tracking-wider">
                Rp {currentTotal.toLocaleString('id-ID')}
              </div>
            </div>

            {zakatType === 'mal' && !isNisabReached && (
              <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-400/30 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Harta belum mencapai Nisab 85g emas. Anda tidak diwajibkan Zakat Mal, namun disunnahkan ber-Infaq.
                </span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPayModalOpen(true)}
            disabled={currentTotal <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Tunaikan {zakatType.toUpperCase()} Sekarang</span>
          </motion.button>
        </GlassCard>
      </div>

      {/* Direct Payment & QRIS Modal */}
      <AnimatePresence>
        {isPayModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto"
            >
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">Tunaikan {zakatType.toUpperCase()}</h3>
                  <p className="text-xs text-amber-300 font-mono font-bold">Total: Rp {currentTotal.toLocaleString('id-ID')}</p>
                </div>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Muzakki / Donatur</label>
                    <input
                      type="text"
                      value={muzakkiName}
                      onChange={(e) => setMuzakkiName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp</label>
                    <input
                      type="text"
                      value={muzakkiPhone}
                      onChange={(e) => setMuzakkiPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* QRIS Direct Box */}
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-400/40 text-center space-y-2">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Scan QRIS Resmi {MASJID_INFO.name}
                  </div>
                  <div className="bg-white p-3 rounded-2xl w-36 h-36 mx-auto flex items-center justify-center border shadow-md">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-[10px] text-slate-500">NMID: ID1024398291048 • Bebas Biaya Admin</p>
                </div>

                {/* BSI Account Option */}
                <div className="bg-slate-100/90 dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Atau Transfer Bank BSI:</div>
                    <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">718-293-8472</div>
                    <div className="text-[10px] text-slate-500">a.n. DKM Masjid Jami Nurul Iman</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount('7182938472', 'BSI')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border transition-all"
                  >
                    {copiedBank === 'BSI' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmZakat}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Kirim Konfirmasi WA ke Amil DKM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      printOfficialReceipt({
                        refNumber: `ZIS/${Date.now().toString().slice(-6)}`,
                        donorName: muzakkiName || 'Hamba Allah',
                        amount: currentTotal,
                        category: `Pembayaran ${zakatType.toUpperCase()}`,
                        date: new Date().toISOString().slice(0, 10),
                        recordedBy: 'Amil ZISWAF DKM'
                      });
                    }}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Kwitansi ZISWAF Sah</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
