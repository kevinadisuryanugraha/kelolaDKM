import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  info: <Info className="w-5 h-5 text-sky-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
};

/**
 * Renders the app-level toast notifications (fixed bottom-right).
 */
export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl animate-in slide-in-from-right duration-200"
        >
          <span className="shrink-0 mt-0.5">{ICONS[toast.type] ?? ICONS.info}</span>
          <p className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
            {toast.message}
          </p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
