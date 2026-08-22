import React from 'react';
import { motion } from 'motion/react';
import { Target, ShieldCheck, History, MapPin, Quote, CheckCircle2 } from 'lucide-react';
import { MasjidGoogleMap } from '../common/MasjidGoogleMap';
import { GlassCard } from '../common/GlassCard';
import { PageHeader } from '../common/PageHeader';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <PageHeader
        badgeKey="pages.about.badge"
        titleKey="pages.about.title"
        subtitleKey="pages.about.subtitle"
      />

      {/* Sambutan Ketua DKM Card */}
      <GlassCard className="p-6 sm:p-8" glow="emerald" hoverEffect={false}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-4 flex flex-col items-center text-center space-y-3"
          >
            <div className="relative">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-2 border-emerald-500/40">
                Z
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">H. Hamdani</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Ketua DKM Masjid Jami Nurul Iman
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Periode Penugasan 2024 – 2027</p>
            </div>
          </motion.div>

          <div className="md:col-span-8 space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Quote className="w-6 h-6 rotate-180" />
              <span className="text-xs font-bold uppercase tracking-widest">Sambutan Ketua DKM</span>
            </div>

            <p className="italic text-slate-800 dark:text-slate-200 text-base leading-relaxed">
              "Assalamu’alaikum Warahmatullahi Wabarakatuh. Puji syukur kita panjatkan ke hadirat Allah SWT. Masjid Jami Nurul Iman bukan sekadar tempat menunaikan ibadah sholat lima waktu, melainkan benteng moral, wadah ukhuwah, serta pusat pembelajaran dan pemberdayaan ekonomi masyarakat Pejaten Timur."
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              "Melalui aplikasi digital <strong className="text-emerald-700 dark:text-emerald-300">KelolaDKM</strong>, kami bertekad mewujudkan tata kelola keuangan yang 100% transparan, amanah, akuntabel, dan profesional. Semoga platform ini menjadi sarana penghubung kebaikan bagi seluruh jamaah dan donatur."
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Visi, Misi & Nilai-Nilai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visi & Misi Card */}
        <GlassCard className="p-6 space-y-5" glow="emerald">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Visi & Misi Strategis</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[11px] tracking-wider block mb-1.5">
                Visi Utama
              </span>
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/40 rounded-2xl font-medium border border-emerald-500/20 text-slate-800 dark:text-slate-200">
                Terwujudnya Masjid Jami Nurul Iman sebagai pusat ibadah yang makmur, melahirkan generasi Qur’ani yang berakhlak mulia, dan memelopori kemandirian ekonomi syariah di Jakarta Selatan.
              </div>
            </div>

            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[11px] tracking-wider block mb-1.5">
                Misi Strategis
              </span>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Menyelenggarakan kegiatan ibadah yang khusyuk, tertib, dan sesuai tuntunan Al-Qur'an dan Sunnah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Meningkatkan kualitas pendidikan dan pembinaan ummat melalui kajian keilmuan secara konsisten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Mengelola dana ZISWAF secara transparan berbasis teknologi digital terpadu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Menyediakan sarana dan prasarana masjid yang bersih, nyaman, aman, dan ramah anak.</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>

        {/* Nilai-Nilai Pengurus Card */}
        <GlassCard className="p-6 space-y-5" glow="gold">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">Nilai-Nilai Utama DKM</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">1. Amanah & Transparan</div>
              <p className="text-slate-500 dark:text-slate-400">Menjaga kepercayaan dana umat dengan pelaporan terbuka setiap pekan.</p>
            </div>

            <div className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">2. Profesionalisme</div>
              <p className="text-slate-500 dark:text-slate-400">Menerapkan tata kelola profesional dan akuntabel dalam setiap pelayanan DKM.</p>
            </div>

            <div className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">3. Ukhuwah Islamiyah</div>
              <p className="text-slate-500 dark:text-slate-400">Menjadikan masjid sebagai pemersatu tanpa membeda-bedakan status sosial.</p>
            </div>

            <div className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">4. Inovasi Digital</div>
              <p className="text-slate-500 dark:text-slate-400">Memanfaatkan sistem digitalisasi modern untuk memperluas manfaat masjid.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Sejarah & Timeline */}
      <GlassCard className="p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
        <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <History className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-xl text-slate-900 dark:text-white">Sejarah & Milestones Perjalanan</h3>
        </div>

        <div className="relative border-l-2 border-emerald-500/30 ml-4 space-y-8 pl-6 text-xs sm:text-sm">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-0 w-4 h-4 bg-emerald-600 rounded-full ring-4 ring-emerald-100 dark:ring-emerald-950" />
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/20">
              Tahun 1985
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">Awal Pendirian Musholla Nurul Iman</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Didirikan oleh para tokoh warga Pejaten Timur di atas tanah wakaf seluas 350m² sebagai sarana ibadah warga RT 08.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-0 w-4 h-4 bg-emerald-600 rounded-full ring-4 ring-emerald-100 dark:ring-emerald-950" />
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/20">
              Tahun 2008
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">Renovasi Besar & Pemugaran Menjadi Masjid Jami</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Diubah status menjadi Masjid Jami Nurul Iman dengan perluasan bangunan 2 lantai dan pengesahan Sertifikat Wakaf resmi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-[31px] top-0 w-4 h-4 bg-amber-500 rounded-full ring-4 ring-amber-100 dark:ring-amber-950" />
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/20">
              Tahun 2026
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">Peluncuran Digitalisasi KelolaDKM Enterprise</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Penerapan sistem terpadu akuntansi kas, QRIS ZISWAF, scanner inventaris, dan portal publik jamaah real-time.
            </p>
          </motion.div>
        </div>
      </GlassCard>

      {/* Lokasi Peta Google Maps */}
      <section className="space-y-4">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span>Lokasi Fisik Masjid Jami Nurul Iman</span>
        </h3>
        <MasjidGoogleMap />
      </section>
    </div>
  );
};
