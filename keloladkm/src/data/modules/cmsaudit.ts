import { CMSArticle, AuditLog } from '../../types';

export const CMS_ARTICLES: CMSArticle[] = [
  {
    id: 'ART-01',
    title: 'Keutamaan Menjaga Sholat Subuh Berjamaah & Dzikir Pagi',
    category: 'Dakwah',
    author: 'KH. Drs. Ahmad Fauzi, M.Ag.',
    date: '2026-07-22',
    summary: 'Rasulullah SAW bersabda bahwa dua rakaat sebelum Subuh lebih baik dari dunia dan seisinya.',
    content: 'Sholat Subuh berjamaah di masjid membawa keberkahan luar biasa dalam kehidupan seorang muslim. Rasulullah SAW bersabda: "Barangsiapa yang sholat Subuh berjamaah, maka ia berada dalam jaminan Allah." Hadits ini menunjukkan betapa agungnya kedudukan sholat Subuh berjamaah.\n\nSelain itu, dzikir pagi setelah sholat Subuh juga memiliki keutamaan yang tak kalah besar. Allah SWT berfirman dalam Al-Qur\'an: "Dan bertasbihlah kepada-Nya di waktu pagi dan petang." (QS. Al-Ahzab: 42).',
    imageUrl: '',
    views: 420,
    isPublished: true
  },
  {
    id: 'ART-02',
    title: 'Laporan Progres Renovasi Kanopi Selasar Masjid',
    category: 'Pengumuman',
    author: 'Sekretariat DKM',
    date: '2026-07-20',
    summary: 'Progres pengerjaan kanopi selasar telah mencapai 75%.',
    content: 'Alhamdulillah, pengerjaan rangka baja ringan dan atap kanopi selasar Masjid Jami Nurul Iman berjalan lancar. Hingga 20 Juli 2026, progres telah mencapai 75%.\n\nDana yang terkumpul sejauh ini mencapai Rp 62.800.000 dari target Rp 85.000.000. Kami mengucapkan terima kasih kepada seluruh jamaah dan donatur yang telah berkontribusi. Semoga Allah SWT membalas dengan kebaikan yang berlipat ganda.',
    imageUrl: '',
    views: 615,
    isPublished: true
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-1001',
    timestamp: '2026-07-24 09:15:22',
    userName: 'H. Rahmat Hidayat',
    userRole: 'Bendahara',
    action: 'CREATE_TRANSACTION',
    module: 'Keuangan',
    details: 'Menambahkan transaksi Kas Masuk Rp 8.450.000 (Infaq Jumat)',
    ipAddress: '180.252.110.45'
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-07-24 08:30:10',
    userName: 'H. M. Zamzami',
    userRole: 'Ketua DKM',
    action: 'APPROVE_BUDGET',
    module: 'Approval',
    details: 'Menyetujui pengajuan 2 unit Microphone Wireless Shure',
    ipAddress: '180.252.110.12'
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-07-23 16:45:00',
    userName: 'Ustadz Abdullah',
    userRole: 'Sekretaris',
    action: 'UPDATE_AGENDA',
    module: 'Website CMS',
    details: 'Memperbarui poster & jadwal Kajian Subuh KH. Ahmad Fauzi',
    ipAddress: '180.252.112.89'
  }
];
