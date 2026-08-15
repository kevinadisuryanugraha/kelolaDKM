import React from 'react';
import { useApp } from '../../context/AppContext';
import { MASJID_INFO } from '../../data/mockData';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Heart,
  ExternalLink,
  QrCode,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPublicSubTab, setActiveAppTab, isAuthenticated, setShowLoginModal } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Masjid Brand & Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-300 font-bold text-lg shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{MASJID_INFO.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">Pejaten Timur, Jakarta Selatan</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{MASJID_INFO.tagline}</p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{MASJID_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{MASJID_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{MASJID_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation & Public Pages */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-emerald-800/60 pb-2">
              Layanan Jamaah
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Jadwal Sholat & Adhan', tab: 'prayer_times' },
                { label: 'Jadwal Kajian & Ustadz', tab: 'kajian' },
                { label: 'Donasi & Infaq Online', tab: 'donation' },
                { label: 'Kalkulator Zakat Fitrah & Mal', tab: 'zakat_calculator' },
                { label: 'Transparansi Keuangan Kas', tab: 'financial_report' },
                { label: 'Berita & Artikel Islami', tab: 'news' },
                { label: 'Profil Pengurus & Imam', tab: 'staff' }
              ].map((link) => (
                <li key={link.tab}>
                  <button
                    onClick={() => {
                      setActiveAppTab('public');
                      setPublicSubTab(link.tab);
                    }}
                    className="text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-emerald-500" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Donasi & Bank Syariah Accounts */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-emerald-800/60 pb-2">
              Rekening Infaq & Zakat
            </h4>
            <div className="space-y-2.5 text-xs">
              {MASJID_INFO.bankAccounts.map((acc, idx) => (
                <div key={idx} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <div className="text-amber-400 font-semibold text-[11px]">{acc.bank}</div>
                  <div className="font-mono text-sm font-bold text-white tracking-wider my-0.5">{acc.accountNumber}</div>
                  <div className="text-[10px] text-slate-400">{acc.accountName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: KelolaDKM System & QRIS */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider border-b border-emerald-800/60 pb-2">
              KelolaDKM System
            </h4>
            <p className="text-xs text-slate-400">
              Sistem informasi manajemen operasional, akuntansi keuangan, inventaris, dan ZISWAF terpadu Masjid Jami Nurul Iman.
            </p>

            <button
              onClick={() => isAuthenticated ? setActiveAppTab('dashboard') : setShowLoginModal(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-emerald-600/40 shadow-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Masuk Dashboard DKM</span>
            </button>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Mendukung Donasi QRIS Standar Nasional</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DKM Masjid Jami Nurul Iman Pejaten. Powered by KelolaDKM Enterprise Platform.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk Kemakmuran Masjid
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
