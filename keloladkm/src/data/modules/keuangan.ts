import { FinancialAccount, FinancialTransaction, BudgetPlan } from '../../types';

export const COA_ACCOUNTS: FinancialAccount[] = [
  { code: '101.1', name: 'Kas Tunai (Brankas DKM)', type: 'Aset', balance: 118454 },
  { code: '102.1', name: 'Bank BSI & QRIS Operasional', type: 'Aset', balance: 8990000 },
  { code: '401.1', name: 'Infaq Sholat Jumat', type: 'Penerimaan', balance: 7927500 },
  { code: '401.2', name: 'Kotak Amal Warga RT 008', type: 'Penerimaan', balance: 1617000 },
  { code: '401.3', name: 'Infaq & Sadakoh Donatur', type: 'Penerimaan', balance: 6720000 },
  { code: '401.4', name: 'Penerimaan QRIS Nasional', type: 'Penerimaan', balance: 1475000 },
  { code: '501.1', name: 'Biaya Ibadah Sholat Jumat', type: 'Pengeluaran', balance: 6600000 },
  { code: '501.2', name: 'Biaya Kebersihan Masjid', type: 'Pengeluaran', balance: 3520000 },
  { code: '501.3', name: 'Biaya Majelis Ta\'lim & Kajian', type: 'Pengeluaran', balance: 5300000 },
  { code: '501.4', name: 'Tagihan Listrik PLN', type: 'Pengeluaran', balance: 2173172 },
  { code: '501.5', name: 'Program Sosial & Beras DKM', type: 'Pengeluaran', balance: 1700000 },
  { code: '501.6', name: 'Belanja Sarana & Perlengkapan', type: 'Pengeluaran', balance: 1919900 },
];

export const FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  // ── AGUSTUS 2026 (Minggu III — Terbaru) ──
  {
    id: 'TRX-2026-140', date: '2026-08-19', type: 'Masuk',
    accountCode: '401.4', accountName: 'Penerimaan QRIS Nasional',
    description: 'Infaq QRIS Jamaah',
    amount: 10000, category: 'QRIS',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260819/001'
  },
  {
    id: 'TRX-2026-139', date: '2026-08-18', type: 'Masuk',
    accountCode: '401.4', accountName: 'Penerimaan QRIS Nasional',
    description: 'Infaq QRIS Jamaah',
    amount: 10000, category: 'QRIS',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260818/001'
  },
  {
    id: 'TRX-2026-138', date: '2026-08-17', type: 'Masuk',
    accountCode: '401.4', accountName: 'Penerimaan QRIS Nasional',
    description: 'Infaq QRIS Bpk Abdulloh Jusuf',
    amount: 250000, category: 'QRIS',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260817/001'
  },
  {
    id: 'TRX-2026-137', date: '2026-08-16', type: 'Masuk',
    accountCode: '401.2', accountName: 'Kotak Amal Warga RT 008',
    description: 'Amal Jariah Warga RT 008',
    amount: 100000, category: 'Kotak Warga',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260816/001'
  },
  {
    id: 'TRX-2026-136', date: '2026-08-15', type: 'Keluar',
    accountCode: '501.3', accountName: 'Biaya Majelis Ta\'lim & Kajian',
    description: 'Biaya Majlis Ta\'lim Sabtu Pagi',
    amount: 400000, category: 'Dakwah',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260815/001'
  },
  {
    id: 'TRX-2026-135', date: '2026-08-14', type: 'Keluar',
    accountCode: '501.2', accountName: 'Biaya Kebersihan Masjid',
    description: 'Biaya Kebersihan Mingguan & Marbot',
    amount: 225000, category: 'Kebersihan',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260814/002'
  },
  {
    id: 'TRX-2026-134', date: '2026-08-14', type: 'Keluar',
    accountCode: '501.1', accountName: 'Biaya Ibadah Sholat Jumat',
    description: 'Honor Khotib & Petugas Sholat Jumat',
    amount: 500000, category: 'Ibadah Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260814/001'
  },
  {
    id: 'TRX-2026-133', date: '2026-08-14', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Sholat Jumat',
    description: 'Infaq Sadakoh Sholat Jumat',
    amount: 370500, category: 'Infaq Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260814/001'
  },

  // ── AGUSTUS 2026 (Minggu II) ──
  {
    id: 'TRX-2026-132', date: '2026-08-11', type: 'Masuk',
    accountCode: '401.4', accountName: 'Penerimaan QRIS Nasional',
    description: 'Infaq QRIS Jamaah',
    amount: 10000, category: 'QRIS',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260811/001'
  },
  {
    id: 'TRX-2026-131', date: '2026-08-09', type: 'Masuk',
    accountCode: '401.2', accountName: 'Kotak Amal Warga RT 008',
    description: 'Amal Jariah Warga RT 008',
    amount: 125000, category: 'Kotak Warga',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260809/001'
  },
  {
    id: 'TRX-2026-130', date: '2026-08-08', type: 'Masuk',
    accountCode: '401.4', accountName: 'Penerimaan QRIS Nasional',
    description: 'Infaq QRIS Jamaah',
    amount: 20000, category: 'QRIS',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260808/001'
  },
  {
    id: 'TRX-2026-129', date: '2026-08-08', type: 'Keluar',
    accountCode: '501.3', accountName: 'Biaya Majelis Ta\'lim & Kajian',
    description: 'Biaya Majlis Ta\'lim Subuh',
    amount: 400000, category: 'Dakwah',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260808/001'
  },
  {
    id: 'TRX-2026-128', date: '2026-08-07', type: 'Keluar',
    accountCode: '501.2', accountName: 'Biaya Kebersihan Masjid',
    description: 'Biaya Kebersihan Mingguan',
    amount: 225000, category: 'Kebersihan',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260807/002'
  },
  {
    id: 'TRX-2026-127', date: '2026-08-07', type: 'Keluar',
    accountCode: '501.1', accountName: 'Biaya Ibadah Sholat Jumat',
    description: 'Biaya Ibadah Sholat Jumat',
    amount: 500000, category: 'Ibadah Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260807/001'
  },
  {
    id: 'TRX-2026-126', date: '2026-08-07', type: 'Masuk',
    accountCode: '401.4', accountName: 'Penerimaan QRIS Nasional',
    description: 'Infaq QRIS Jamaah (4 Transaksi)',
    amount: 135000, category: 'QRIS',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260807/002'
  },
  {
    id: 'TRX-2026-125', date: '2026-08-07', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Sholat Jumat',
    description: 'Infaq Sadakoh Sholat Jumat',
    amount: 629000, category: 'Infaq Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260807/001'
  },

  // ── AGUSTUS 2026 (Minggu I) ──
  {
    id: 'TRX-2026-124', date: '2026-08-06', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Infaq dari Hamba Allah (Bank & Tunai)',
    amount: 550000, category: 'Donatur',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260806/001'
  },
  {
    id: 'TRX-2026-123', date: '2026-08-05', type: 'Keluar',
    accountCode: '501.3', accountName: 'Biaya Majelis Ta\'lim & Kajian',
    description: 'Biaya Ta\'lim Ibu-Ibu',
    amount: 500000, category: 'Dakwah',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260805/001'
  },
  {
    id: 'TRX-2026-122', date: '2026-08-05', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Infaq Bpk Sanusi',
    amount: 50000, category: 'Donatur',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260805/001'
  },
  {
    id: 'TRX-2026-121', date: '2026-08-03', type: 'Keluar',
    accountCode: '501.4', accountName: 'Tagihan Listrik PLN',
    description: 'Bayar Biaya Listrik PLN Masjid',
    amount: 856794, category: 'Utilitas',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260803/001'
  },
  {
    id: 'TRX-2026-120', date: '2026-08-02', type: 'Masuk',
    accountCode: '401.2', accountName: 'Kotak Amal Warga RT 008',
    description: 'Kotak Amal Warga RT 008',
    amount: 105000, category: 'Kotak Warga',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260802/001'
  },
  {
    id: 'TRX-2026-119', date: '2026-08-01', type: 'Keluar',
    accountCode: '501.6', accountName: 'Belanja Sarana & Perlengkapan',
    description: 'Beli Lampu Bohlam Masjid',
    amount: 169900, category: 'Sarana',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260801/001'
  },
  {
    id: 'TRX-2026-118', date: '2026-08-01', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Infaq Bpk Sunardono',
    amount: 50000, category: 'Donatur',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260801/001'
  },
  {
    id: 'TRX-2026-117', date: '2026-07-31', type: 'Keluar',
    accountCode: '501.5', accountName: 'Program Sosial & Beras DKM',
    description: 'Penyaluran Program Sosial DKM',
    amount: 300000, category: 'Sosial',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260731/003'
  },
  {
    id: 'TRX-2026-116', date: '2026-07-31', type: 'Keluar',
    accountCode: '501.2', accountName: 'Biaya Kebersihan Masjid',
    description: 'Beli Obat Pembersih Lantai & Biaya Kebersihan',
    amount: 300000, category: 'Kebersihan',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260731/002'
  },
  {
    id: 'TRX-2026-115', date: '2026-07-31', type: 'Keluar',
    accountCode: '501.1', accountName: 'Biaya Ibadah Sholat Jumat',
    description: 'Biaya Ibadah Sholat Jumat',
    amount: 500000, category: 'Ibadah Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260731/001'
  },
  {
    id: 'TRX-2026-114', date: '2026-07-31', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Infaq Sadakoh Hamba Allah',
    amount: 300000, category: 'Donatur',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260731/003'
  },
  {
    id: 'TRX-2026-113', date: '2026-07-31', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Kotak Amal Masjid Utama',
    amount: 1212000, category: 'Kotak Masjid',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260731/002'
  },
  {
    id: 'TRX-2026-112', date: '2026-07-31', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Sholat Jumat',
    description: 'Kotak Amal Sholat Jumat',
    amount: 714000, category: 'Infaq Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260731/001'
  },

  // ── JULI 2026 (Ringkasan Bulanan & Pekanan) ──
  {
    id: 'TRX-2026-111', date: '2026-07-28', type: 'Keluar',
    accountCode: '501.4', accountName: 'Tagihan Listrik PLN',
    description: 'Tagihan Listrik PLN Masjid Periode Juli 2026',
    amount: 711181, category: 'Utilitas',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260728/001'
  },
  {
    id: 'TRX-2026-110', date: '2026-07-27', type: 'Keluar',
    accountCode: '501.5', accountName: 'Program Sosial & Beras DKM',
    description: 'Beli Beras Program Sosial DKM untuk Warga',
    amount: 1400000, category: 'Sosial',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260727/001'
  },
  {
    id: 'TRX-2026-109', date: '2026-07-27', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Hamba Allah - Donasi Khusus Program Beras',
    amount: 1400000, category: 'Sosial',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260727/001'
  },
  {
    id: 'TRX-2026-108', date: '2026-07-26', type: 'Masuk',
    accountCode: '401.2', accountName: 'Kotak Amal Warga RT 008',
    description: 'Kotak Amal Warga RT 008',
    amount: 145000, category: 'Kotak Warga',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260726/001'
  },
  {
    id: 'TRX-2026-107', date: '2026-07-25', type: 'Keluar',
    accountCode: '501.3', accountName: 'Biaya Majelis Ta\'lim & Kajian',
    description: 'Biaya Majlis Ta\'lim Pekanan',
    amount: 400000, category: 'Dakwah',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260725/001'
  },
  {
    id: 'TRX-2026-106', date: '2026-07-24', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Sholat Jumat',
    description: 'Kotak Amal Sholat Jumat Pekan IV Juli',
    amount: 702000, category: 'Infaq Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260724/001'
  },
  {
    id: 'TRX-2026-105', date: '2026-07-24', type: 'Keluar',
    accountCode: '501.1', accountName: 'Biaya Ibadah Sholat Jumat',
    description: 'Biaya Ibadah Sholat Jumat',
    amount: 500000, category: 'Ibadah Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260724/001'
  },
  {
    id: 'TRX-2026-104', date: '2026-07-17', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Infaq Sadakoh Donatur & Jamaah',
    amount: 550000, category: 'Donatur',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260717/001'
  },
  {
    id: 'TRX-2026-103', date: '2026-07-17', type: 'Keluar',
    accountCode: '501.2', accountName: 'Biaya Kebersihan Masjid',
    description: 'Biaya Kebersihan & Perawatan Sanitasi',
    amount: 250000, category: 'Kebersihan',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260717/001'
  },
  {
    id: 'TRX-2026-102', date: '2026-07-08', type: 'Keluar',
    accountCode: '501.3', accountName: 'Biaya Majelis Ta\'lim & Kajian',
    description: 'Biaya Majelis Ta\'lim Ibu-Ibu',
    amount: 500000, category: 'Dakwah',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260708/001'
  },
  {
    id: 'TRX-2026-101', date: '2026-07-03', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Sholat Jumat',
    description: 'Kotak Amal Sholat Jumat Pekan I Juli',
    amount: 599000, category: 'Infaq Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260703/001'
  },

  // ── JUNI 2026 (Ringkasan Bulanan) ──
  {
    id: 'TRX-2026-100', date: '2026-06-29', type: 'Keluar',
    accountCode: '501.6', accountName: 'Belanja Sarana & Perlengkapan',
    description: 'Belanja Kebutuhan Operasional Masjid',
    amount: 252000, category: 'Sarana',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260629/001'
  },
  {
    id: 'TRX-2026-099', date: '2026-06-28', type: 'Keluar',
    accountCode: '501.4', accountName: 'Tagihan Listrik PLN',
    description: 'Tagihan Listrik PLN Periode Juni 2026',
    amount: 605197, category: 'Utilitas',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260628/001'
  },
  {
    id: 'TRX-2026-098', date: '2026-06-27', type: 'Keluar',
    accountCode: '501.3', accountName: 'Biaya Majelis Ta\'lim & Kajian',
    description: 'Biaya Majelis Ta\'lim Bulanan',
    amount: 1600000, category: 'Dakwah',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260627/001'
  },
  {
    id: 'TRX-2026-097', date: '2026-06-26', type: 'Keluar',
    accountCode: '501.2', accountName: 'Biaya Kebersihan Masjid',
    description: 'Biaya Kebersihan Masjid Bulan Juni',
    amount: 1445000, category: 'Kebersihan',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260626/001'
  },
  {
    id: 'TRX-2026-096', date: '2026-06-25', type: 'Keluar',
    accountCode: '501.1', accountName: 'Biaya Ibadah Sholat Jumat',
    description: 'Biaya Sholat Jumat 4 Pekan Juni',
    amount: 2100000, category: 'Ibadah Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'EXP/20260625/001'
  },
  {
    id: 'TRX-2026-095', date: '2026-06-20', type: 'Masuk',
    accountCode: '401.2', accountName: 'Kotak Amal Warga RT 008',
    description: 'Kotak Amal dari Warga RT 008',
    amount: 662000, category: 'Kotak Warga',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260620/001'
  },
  {
    id: 'TRX-2026-094', date: '2026-06-15', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Infaq Sadakoh Donatur & Jamaah',
    amount: 880000, category: 'Donatur',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260615/001'
  },
  {
    id: 'TRX-2026-093', date: '2026-06-10', type: 'Masuk',
    accountCode: '401.3', accountName: 'Infaq & Sadakoh Donatur',
    description: 'Kotak Amal Masjid Utama',
    amount: 1995000, category: 'Kotak Masjid',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260610/001'
  },
  {
    id: 'TRX-2026-092', date: '2026-06-05', type: 'Masuk',
    accountCode: '401.1', accountName: 'Infaq Sholat Jumat',
    description: 'Kotak Amal Sholat Jumat Bulan Juni',
    amount: 3008500, category: 'Infaq Jumat',
    recordedBy: 'T. Handoko', status: 'Approved', refNumber: 'INV/20260605/001'
  }
];

export const BUDGET_PLANS: BudgetPlan[] = [
  { id: 'BG-01', category: 'Operasional Listrik PLN & Kebersihan', allocatedAmount: 15000000, usedAmount: 5693172, period: 'Tahun 2026' },
  { id: 'BG-02', category: 'Biaya Ibadah Sholat Jumat & Khotib', allocatedAmount: 25000000, usedAmount: 6600000, period: 'Tahun 2026' },
  { id: 'BG-03', category: 'Majelis Ta\'lim & Pembinaan Ummat', allocatedAmount: 20000000, usedAmount: 5300000, period: 'Tahun 2026' },
  { id: 'BG-04', category: 'Program Sosial Santunan & Beras DKM', allocatedAmount: 12000000, usedAmount: 1700000, period: 'Tahun 2026' },
  { id: 'BG-05', category: 'Pemeliharaan Sarana & Perlengkapan', allocatedAmount: 10000000, usedAmount: 1919900, period: 'Tahun 2026' }
];
