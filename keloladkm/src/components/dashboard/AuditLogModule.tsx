import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { Shield, Download } from 'lucide-react';
import { AuditLog } from '../../types';
import { GlassCard } from '../common/GlassCard';

const logColumns: DataTableColumn<AuditLog>[] = [
  { key: 'timestamp', header: 'Waktu & Tanggal', className: 'font-mono text-slate-500 font-bold' },
  { key: 'userName', header: 'Pengguna', className: 'font-bold text-slate-900 dark:text-white' },
  {
    key: 'userRole',
    header: 'Role',
    render: (log) => (
      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full capitalize border border-emerald-500/20">
        {log.userRole.replace(/_/g, ' ')}
      </span>
    )
  },
  { key: 'action', header: 'Aksi / Kegiatan', className: 'font-bold text-slate-800 dark:text-slate-200' },
  { key: 'details', header: 'Rincian Perubahan Data', className: 'text-slate-500 font-medium' },
  { key: 'ipAddress', header: 'IP Address', className: 'font-mono text-slate-400 font-bold' }
];

export const AuditLogModule: React.FC = () => {
  const { auditLogs, openExportModal } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Security, Audit Log & RBAC Access</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Catatan Aktivitas Sistem, Jejak Digital Pengurus & Pengaturan Hak Akses Role</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openExportModal('Audit Log System Activity KelolaDKM', auditLogs)}
          className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail</span>
        </motion.button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Riwayat Jejak Digital Sistem</h3>
          <span className="text-xs font-mono font-bold text-slate-400">{auditLogs.length} Records Activity</span>
        </div>
        <DataTable columns={logColumns} data={auditLogs} keyField="id" />
      </GlassCard>
    </div>
  );
};
