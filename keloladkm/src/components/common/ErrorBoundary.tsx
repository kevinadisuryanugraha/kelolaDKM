import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends (Component as any) {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center space-y-5">
            <div className="mx-auto w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Terjadi Kesalahan Sistem
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Maaf, terjadi kesalahan yang tidak terduga. Tim teknis telah diberitahu.
              Silakan muat ulang halaman atau kembali ke beranda.
            </p>
            {this.state.error && (
              <pre className="text-left text-[10px] bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-500 overflow-auto max-h-32 border border-slate-200 dark:border-slate-700">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Muat Ulang
              </button>
              <button
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <Home className="w-4 h-4" /> Beranda
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
