import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Calculator, CheckCircle, Scale, AlertCircle } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';

export const ZakatCalculatorPage: React.FC = () => {
  const { addDonorRecord, showToast } = useApp();

  const [zakatType, setZakatType] = useState<'fitrah' | 'mal' | 'fidyah' | 'infaq'>('fitrah');

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

  const handlePayZakat = () => {
    addDonorRecord({
      donorName: 'Muzakki Nurul Iman',
      phone: '081298765432',
      campaignId: 'CMP-ZIS',
      campaignTitle: `Pembayaran ${zakatType.toUpperCase()}`,
      amount: currentTotal,
      method: 'QRIS'
    });
    showToast(`Alhamdulillah, pembayaran Zakat/Infaq sebesar Rp ${currentTotal.toLocaleString('id-ID')} berhasil diproses!`, 'success');
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
              <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-400/30 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-500" /> Nisab Zakat Mal: 85 Gram Emas (± Rp {nisabGoldValue.toLocaleString('id-ID')})
                </p>
                <p>Kadar zakat sebesar 2.5% jika total kepemilikan harta telah mencapai Nisab dan genap 1 Haul (1 tahun kepemilikan).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Tabungan / Deposito / Kas (Rp)
                  </label>
                  <input
                    type="number"
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Kepemilikan Emas (Gram)
                  </label>
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
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
            onClick={handlePayZakat}
            disabled={currentTotal <= 0}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Tunaikan {zakatType.toUpperCase()} Sekarang</span>
          </motion.button>
        </GlassCard>
      </div>
    </div>
  );
};
