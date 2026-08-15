import { FinancialAccount, FinancialTransaction, BudgetPlan } from '../../types';

export const COA_ACCOUNTS: FinancialAccount[] = [
  { code: '101.1', name: 'Kas Tunai Utama Masjid', type: 'Aset', balance: 18500000 },
  { code: '101.2', name: 'Kas Tunai Kotak Infaq', type: 'Aset', balance: 7200000 },
  { code: '102.1', name: 'Bank BSI - Rekening Kas Operasional', type: 'Aset', balance: 142800000 },
  { code: '102.2', name: 'Bank BSI - Rekening ZISWAF', type: 'Aset', balance: 52000000 },
  { code: '102.3', name: 'Bank Mandiri - Rekening Pembangunan', type: 'Aset', balance: 28000000 },
  { code: '401.1', name: 'Infaq Salat Jumat', type: 'Penerimaan', balance: 85400000 },
  { code: '401.2', name: 'Donasi Online & QRIS', type: 'Penerimaan', balance: 64200000 },
  { code: '402.1', name: 'Penerimaan Zakat Mal & Fitrah', type: 'Penerimaan', balance: 48000000 },
  { code: '501.1', name: 'Beban Listrik, Air & Wi-Fi', type: 'Pengeluaran', balance: 14500000 },
  { code: '501.2', name: 'Honorarium Imam, Muadzin & Marbot', type: 'Pengeluaran', balance: 28000000 },
  { code: '502.1', name: 'Pemeliharaan AC, Sound System & Karpet', type: 'Pengeluaran', balance: 12400000 }
];

export const FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TRX-2026-089', date: '2026-07-24', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Salat Jumat',
    description: 'Infaq Kotak Salat Jumat Pekan IV Juli 2026',
    amount: 8450000, category: 'Infaq Jumat',
    recordedBy: 'H. Rahmat Hidayat', status: 'Approved', refNumber: 'INV/20260724/001'
  },
  {
    id: 'TRX-2026-088', date: '2026-07-23', type: 'Keluar',
    accountCode: '501.1', accountName: 'Beban Listrik, Air & Wi-Fi',
    description: 'Pembayaran Tagihan PLN Masjid & Indihome Juli 2026',
    amount: 3250000, category: 'Operasional',
    recordedBy: 'H. Rahmat Hidayat', status: 'Approved', refNumber: 'EXP/20260723/004'
  },
  {
    id: 'TRX-2026-087', date: '2026-07-22', type: 'Masuk',
    accountCode: '401.2', accountName: 'Donasi Online & QRIS',
    description: 'Donasi QRIS Jamaah Hamba Allah - Renovasi Kanopi',
    amount: 5000000, category: 'Donasi Pembangunan',
    recordedBy: 'Admin QRIS', status: 'Approved', refNumber: 'QRIS/20260722/012'
  },
  {
    id: 'TRX-2026-086', date: '2026-07-21', type: 'Keluar',
    accountCode: '502.1', accountName: 'Pemeliharaan AC & Sound System',
    description: 'Service & Cuci 8 Unit AC Inverter Selasar dan Ruang Utama',
    amount: 1400000, category: 'Maintenance',
    recordedBy: 'Ir. H. Budi Santoso', status: 'Approved', refNumber: 'EXP/20260721/002'
  },
  {
    id: 'TRX-2026-085', date: '2026-07-20', type: 'Masuk',
    accountCode: '402.1', accountName: 'Penerimaan Zakat Mal',
    description: 'Zakat Mal Bapak H. Hartono Pejaten',
    amount: 12500000, category: 'Zakat',
    recordedBy: 'H. Rahmat Hidayat', status: 'Approved', refNumber: 'ZKT/20260720/003'
  }
];

export const BUDGET_PLANS: BudgetPlan[] = [
  { id: 'BG-01', category: 'Operasional Listrik, Air & Kebersihan', allocatedAmount: 45000000, usedAmount: 26500000, period: 'Tahun 2026' },
  { id: 'BG-02', category: 'Honorarium Imam, Muadzin & Marbot', allocatedAmount: 96000000, usedAmount: 56000000, period: 'Tahun 2026' },
  { id: 'BG-03', category: 'Program Dakwah, Kajian & Tabligh Akbar', allocatedAmount: 35000000, usedAmount: 18200000, period: 'Tahun 2026' },
  { id: 'BG-04', category: 'Renovasi Kanopi & Sound System Utama', allocatedAmount: 120000000, usedAmount: 85000000, period: 'Tahun 2026' }
];
