import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n/I18nContext';
import { X, Download, FileText, Table as TableIcon, Printer, CheckCircle } from 'lucide-react';
import { DataTable, DataTableColumn } from './DataTable';

import { printOfficialDocument, downloadExcelCsv } from '../../utils/exportOfficialDoc';

export const ExportModal: React.FC = () => {
  const { exportModalData, closeExportModal, showToast } = useApp();
  const { t } = useI18n();
  const { isOpen, title, data } = exportModalData;

  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv' | 'print'>('pdf');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        if (exportFormat === 'pdf' || exportFormat === 'print') {
          printOfficialDocument({
            title: title || 'Laporan Resmi DKM',
            period: new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date()),
            data: data || [],
          });
        } else if (exportFormat === 'excel' || exportFormat === 'csv') {
          downloadExcelCsv(title || 'Laporan_DKM', data || []);
        }
        showToast(`Dokumen ${title} berhasil disiapkan dalam format ${exportFormat.toUpperCase()}`, 'success');
      } catch (err) {
        showToast('Gagal memproses dokumen export', 'error');
      } finally {
        setIsExporting(false);
        closeExportModal();
      }
    }, 600);
  };

  const keys = data.length > 0 ? Object.keys(data[0]).slice(0, 5) : [];

  const previewColumns: DataTableColumn<any>[] = keys.map((k) => ({
    key: k,
    header: k.replace(/([A-Z])/g, ' $1').toUpperCase(),
    className: 'truncate max-w-[140px] whitespace-nowrap',
    render: (row) =>
      typeof row[k] === 'number' ? `Rp ${row[k].toLocaleString('id-ID')}` : String(row[k] ?? '-')
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-emerald-950 p-2 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('exportModal.title')}</h3>
              <p className="text-emerald-200 text-xs">{title} • {data.length} {t('exportModal.records')}</p>
            </div>
          </div>
          <button
            onClick={closeExportModal}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {t('exportModal.formatLabel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FileText className="w-6 h-6 text-red-500" />
                <span>{t('exportModal.pdf')}</span>
              </button>

              <button
                onClick={() => setExportFormat('excel')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                  exportFormat === 'excel'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <TableIcon className="w-6 h-6 text-emerald-600" />
                <span>{t('exportModal.excel')}</span>
              </button>

              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                  exportFormat === 'csv'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FileText className="w-6 h-6 text-blue-500" />
                <span>{t('exportModal.csv')}</span>
              </button>

              <button
                onClick={() => setExportFormat('print')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                  exportFormat === 'print'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Printer className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span>{t('exportModal.print')}</span>
              </button>
            </div>
          </div>

          {/* Document Preview Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{t('exportModal.preview')}</span>
              <span>Masjid Jami Nurul Iman</span>
            </div>

            <div className="text-center py-3 border-b border-dashed border-slate-300 dark:border-slate-700 mb-4">
              <h4 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase">
                DEWAN KEMAKMURAN MASJID (DKM) MASJID JAMI NURUL IMAN
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Jl. Gunuk V No.8, Pejaten Timur, Pasar Minggu, Jakarta Selatan 12510 • Telp: (021) 781-4920
              </p>
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-semibold rounded-full text-xs mt-2">
                LAPORAN RESMI: {title.toUpperCase()}
              </div>
            </div>

            {/* Table Preview */}
            <DataTable columns={previewColumns} data={data.slice(0, 4)} minWidth="w-full" />

            {data.length > 4 && (
              <p className="text-[11px] text-slate-400 text-center mt-2 italic">
                + {data.length - 4} baris data lainnya akan disertakan secara lengkap pada file download
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
          <button
            onClick={closeExportModal}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
          >
            {t('exportModal.cancel')}
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-700/20 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t('exportModal.processing')}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Download {exportFormat.toUpperCase()} Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
