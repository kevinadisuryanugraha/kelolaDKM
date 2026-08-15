import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ShieldCheck,
  Radio,
  Wallet,
  MessageSquare,
  QrCode,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { login as apiLogin } from '../../api/client';
import { UserRole } from '../../types';
import { MASJID_INFO } from '../../data/mockData';

export const LoginPage: React.FC = () => {
  const { login, setPublicSubTab, setCurrentRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('ketua_dkm');

  // Mouse Parallax 3D tracking for interactive animation
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const demoAccounts: { role: UserRole; name: string; email: string; desc: string }[] = [
    { role: 'super_admin', name: 'Super Admin', email: 'admin@masjidnuruliman.or.id', desc: 'Akses Penuh System' },
    { role: 'ketua_dkm', name: 'H. M. Zamzami', email: 'ketua@masjidnuruliman.or.id', desc: 'Ketua DKM & Approval' },
    { role: 'bendahara', name: 'H. Rahmat Hidayat', email: 'bendahara@masjidnuruliman.or.id', desc: 'Kas & Buku Besar' },

  ];

  const handleFillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword('password123');
    setSelectedDemoRole(acc.role);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiLogin(email, password);
      if (res && res.data && res.data.token) {
        login(res.data.token, res.data.user);
        return;
      }
      throw new Error('Fallback to local authentication');
    } catch (err: any) {
      // Fallback mode for standalone frontend / demo mode
      if (email.length > 0) {
        const partialUser = err?.response?.data?.data?.user || err?.response?.data?.user || null;
        const matchedDemo = demoAccounts.find((d) => d.email === email);
        const mockUser = {
          id: partialUser?.id || 1,
          name: matchedDemo ? matchedDemo.name : (partialUser?.name || 'Pengurus DKM'),
          email: email,
          role: matchedDemo ? matchedDemo.role : (selectedDemoRole || 'ketua_dkm')
        };
        setCurrentRole(mockUser.role as UserRole);
        login('mock_token_demo_12345', mockUser);
      } else {
        setError(err?.response?.data?.message || 'Gagal masuk. Periksa email dan kata sandi Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
      {/* ────────── LEFT SIDE: Form & Authentication ────────── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shrink-0 z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setPublicSubTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-emerald-500 transition-all">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight leading-none">
                KelolaDKM
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                {MASJID_INFO.name}
              </span>
            </div>
          </div>

          <button
            onClick={() => setPublicSubTab('home')}
            className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors sm:hidden"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Beranda
          </button>
        </div>

        {/* Center Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full mx-auto my-auto py-8 space-y-6"
        >
          <div className="space-y-2">
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Masuk BackOffice DKM
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              SUPER ADMIN • KETUA DKM • BENDAHARA
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pilih Akses Demo Pengurus (Simulasi 1-Klik)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = email === acc.email;
                return (
                  <button
                    type="button"
                    key={acc.role}
                    onClick={() => handleFillDemo(acc)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px]">{acc.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{acc.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                EMAIL PENGURUS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@masjidnuruliman.or.id"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  KATA SANDI
                </label>
                <button
                  type="button"
                  onClick={() => alert('Fitur reset kata sandi telah dikirim ke email pengurus terdaftar.')}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none text-slate-900 dark:text-white placeholder-slate-400 pr-10 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Main Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Bottom Switch Link */}
          <div className="text-center pt-2">
            <span className="text-xs text-slate-500 font-medium">Jamaah Publik? </span>
            <button
              onClick={() => setPublicSubTab('home')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Kembali ke Beranda Utama
            </button>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="hidden sm:flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
          <span>© 2026 {MASJID_INFO.name}</span>
          <span className="font-mono text-[10px]">KelolaDKM v2.4</span>
        </div>
      </div>

      {/* ────────── RIGHT SIDE: Interactive 3D Parallax Showcase ────────── */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex w-[55%] bg-slate-100/90 dark:bg-slate-950 relative overflow-hidden flex-col items-center justify-center p-12 select-none border-l border-slate-200/50 dark:border-slate-800 cursor-pointer"
      >
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#334155_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

        {/* Dynamic Glow Spheres Tracking Mouse */}
        <motion.div
          animate={{
            x: mousePos.x * 40,
            y: mousePos.y * 40,
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className="absolute top-1/4 right-1/4 w-[420px] h-[420px] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: -mousePos.x * 30,
            y: -mousePos.y * 30,
          }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] bg-teal-400/20 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Floating Top Badge 1 (WA Broadcast) */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            x: mousePos.x * 20,
          }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            x: { type: 'spring', stiffness: 150, damping: 15 }
          }}
          whileHover={{ scale: 1.06, y: -4 }}
          className="absolute top-16 left-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 text-xs font-semibold z-20 transition-shadow hover:shadow-2xl"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">WA BROADCAST</div>
            <div className="text-slate-900 dark:text-white font-bold text-[11px]">Infaq Jumat & Laporan Kas Terkirim</div>
          </div>
        </motion.div>

        {/* Floating Top Badge 2 (Live Sync System) */}
        <motion.div
          animate={{
            y: [0, 10, 0],
            x: mousePos.x * 15,
          }}
          transition={{
            y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            x: { type: 'spring', stiffness: 150, damping: 15 }
          }}
          whileHover={{ scale: 1.06, y: -2 }}
          className="absolute top-24 right-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 z-20 transition-shadow hover:shadow-2xl"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px]">LIVE SYNC SYSTEM</span>
        </motion.div>

        {/* Main 3D Tilted Dashboard Showcase Card with Interactive Mouse Tilt */}
        <motion.div
          animate={{
            rotateX: -mousePos.y * 14 + 6,
            rotateY: mousePos.x * 14 - 6,
            y: [0, -8, 0],
          }}
          transition={{
            rotateX: { type: 'spring', stiffness: 200, damping: 20 },
            rotateY: { type: 'spring', stiffness: 200, damping: 20 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          whileHover={{ scale: 1.03 }}
          className="w-[90%] max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 space-y-5 transform-gpu z-10 transition-shadow hover:shadow-[0_25px_60px_-15px_rgba(16,185,129,0.2)]"
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        >
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-slate-400 ml-2">dkm.masjidnuruliman.or.id</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500 animate-spin" /> ONLINE
            </span>
          </div>

          {/* Mock Card Content Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1 transition-all"
            >
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                <span>TOTAL KAS DKM</span>
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                Rp 248.500.000
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">↑ +14.2% Bulan Ini</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1 transition-all"
            >
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                <span>SHOLAT BERIKUTNYA</span>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <div className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
                Ashar 15:24
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Pejaten Timur WIB</div>
            </motion.div>
          </div>

          {/* Bottom Mock Chart & Stats */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl space-y-2 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="font-serif">Program Pembangunan Selasar Kanopi</span>
              <span className="font-mono text-emerald-400">75% Terkumpul</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Target: Rp 120.000.000</span>
              <span className="text-white font-bold">Terkumpul: Rp 85.000.000</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Bottom Badge 3 (Midtrans QRIS) */}
        <motion.div
          animate={{
            y: [0, -14, 0],
            x: mousePos.x * 25,
          }}
          transition={{
            y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            x: { type: 'spring', stiffness: 150, damping: 15 }
          }}
          whileHover={{ scale: 1.06, y: -4 }}
          className="absolute bottom-12 right-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3 z-20 transition-shadow hover:shadow-2xl"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[11px] text-slate-900 dark:text-white">MIDTRANS QRIS SNAP</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold rounded">
                PAID
              </span>
            </div>
            <div className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
              Rp 12.500.000 (Zakat Mal)
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
