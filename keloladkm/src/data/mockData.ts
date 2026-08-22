// Barrel file — re-exports all mock data from per-module files
export { PRAYER_TIMES_TODAY } from './modules/prayer';
export { KAJIAN_EVENTS } from './modules/kajian';
export { DKM_STAFF, IMAM_MUADZIN_LIST } from './modules/staff';
export { COA_ACCOUNTS, FINANCIAL_TRANSACTIONS, BUDGET_PLANS } from './modules/keuangan';
export { DONATION_CAMPAIGNS, DONOR_RECORDS } from './modules/donasi';
export { QURBAN_PARTICIPANTS } from './modules/qurban';
export { INVENTORY_ITEMS, ROOM_BOOKINGS } from './modules/inventaris';
export { OFFICIAL_LETTERS, OFFICIAL_DOCUMENTS } from './modules/surat';
export { CMS_ARTICLES, AUDIT_LOGS } from './modules/cmsaudit';
export { FAQS_PUBLIC } from './modules/faq';
export { DEFAULT_NOTIFICATIONS } from './modules/notifications';

export const MASJID_INFO = {
  name: 'Masjid Jami Nurul Iman',
  systemName: 'KelolaDKM',
  tagline: 'Pusat Ibadah, Pembinaan Ummat & Pemberdayaan Ekonomi Syariah',
  address: 'Jl. Gunuk V No.8, RT.8/RW.3, Pejaten Timur, Pasar Minggu, Kota Jakarta Selatan, DKI Jakarta 12510',
  phone: '(021) 781-4920 / 0812-8888-9900',
  email: 'dkm@masjidnuruliman-pejaten.or.id',
  website: 'https://masjidnuruliman-pejaten.or.id',
  qrisMerchantName: 'MASJID JAMI NURUL IMAN PEJATEN',
  qrisNMID: 'ID1023948571203',
  bankAccounts: [
    { bank: 'Bank Syariah Indonesia (BSI)', accountNumber: '711-2233-445', accountName: 'DKM Masjid Jami Nurul Iman - Kas' },
    { bank: 'Bank Syariah Indonesia (BSI)', accountNumber: '788-9900-112', accountName: 'DKM Masjid Jami Nurul Iman - Zakat/Infaq' },
    { bank: 'Bank Mandiri Syariah', accountNumber: '127-000-889912-3', accountName: 'DKM Nurul Iman - Pembangunan' }
  ],
  stats: {
    totalKas: 9108454,
    totalJamaah: 1850,
    totalProgramAktif: 12,
    totalDonaturAktif: 320,
    qurbanAnimalsCount: 28
  }
};
