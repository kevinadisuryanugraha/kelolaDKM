import React, { useState } from 'react';
import { ShieldCheck, LogIn, AlertCircle } from 'lucide-react';
import { login } from '../../api/client';
import { isDemoModeEnabled } from '../../lib/demoMode';

interface Props {
  onLogin: (token: string, user: any) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<Props> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res && res.data && res.data.token) {
        onLogin(res.data.token, res.data.user);
        return;
      }
      throw new Error('Fallback to local authentication');
    } catch (err: any) {
      // Offline/demo fallback is only allowed when demo mode is explicitly enabled.
      if (isDemoModeEnabled() && email.length > 0) {
        // Use partial response data if available, otherwise default mock
        const partialUser = err?.response?.data?.data?.user || err?.response?.data?.user || null;
        const mockUser = {
          id: partialUser?.id || 1,
          name: partialUser?.name || 'H. M. Zamzami',
          email: email || 'admin@masjidnuruliman.or.id',
          role: partialUser?.role || 'ketua_dkm'
        };
        onLogin('mock_token_demo_12345', mockUser);
      } else {
        setError(err?.response?.data?.message || 'Gagal login. Periksa kredensial dan pastikan backend aktif.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-6 text-white text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-950" />
          </div>
          <h3 className="font-bold text-lg">Masuk KelolaDKM</h3>
          <p className="text-emerald-200 text-xs">Sistem Manajemen Masjid Jami Nurul Iman</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@masjidnuruliman.or.id"
              className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{loading ? 'Memproses...' : 'Masuk Dashboard'}</span>
          </button>

          <p className="text-center text-[11px] text-slate-400 font-medium">
            Akses terbatas untuk Pengurus DKM & Admin
          </p>
        </form>

        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
          >
            Kembali ke Website
          </button>
        </div>
      </div>
    </div>
  );
};
