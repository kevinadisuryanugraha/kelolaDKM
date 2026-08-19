import { DashboardNotification } from '../../types';

export const DEFAULT_NOTIFICATIONS: DashboardNotification[] = [
  {
    id: 'notif-1',
    title: 'Donasi QRIS Terverifikasi',
    message: 'Hamba Allah berhasil menunaikan Infaq Renovasi Kanopi sebesar Rp 500.000 via QRIS Midtrans.',
    type: 'donasi',
    timestamp: '5 menit yang lalu',
    isRead: false,
    actionTab: 'donasi_ziswaf',
    badge: 'QRIS'
  },
  {
    id: 'notif-2',
    title: 'Persetujuan Anggaran Diperlukan',
    message: 'Proposal pengadaan Sound System Selasar Rp 4.500.000 menunggu verifikasi & approval Ketua DKM.',
    type: 'keuangan',
    timestamp: '25 menit yang lalu',
    isRead: false,
    actionTab: 'keuangan',
    badge: 'Approval'
  },
  {
    id: 'notif-3',
    title: 'Surat Masuk KUA Pasar Minggu',
    message: 'Surat No. B-402/KUA/VIII/2026 perihal Koordinasi Pelatihan Amil ZISWAF telah diarsipkan.',
    type: 'surat',
    timestamp: '1 jam yang lalu',
    isRead: false,
    actionTab: 'surat_dokumen',
    badge: 'Surat Masuk'
  },
  {
    id: 'notif-4',
    title: 'Pengingat Kajian Akbar Dhuha',
    message: 'Kajian Ustadz Dr. H. Khalid Basalamah dijadwalkan besok Ahad pukul 09:00 WIB di Ruang Utama.',
    type: 'agenda',
    timestamp: '3 jam yang lalu',
    isRead: true,
    actionTab: 'agenda_event',
    badge: 'Kajian'
  },
  {
    id: 'notif-5',
    title: 'Autentikasi & Keamanan Sistem',
    message: 'Sesi login Super Admin terverifikasi dari Jakarta Selatan (IP 180.252.88.14).',
    type: 'security',
    timestamp: '5 jam yang lalu',
    isRead: true,
    actionTab: 'audit_log',
    badge: 'Audit Trail'
  },
  {
    id: 'notif-6',
    title: 'Pendaftaran Shohibul Qurban',
    message: 'Bpk. H. Bambang Soediro mendaftar 1 Ekor Sapi Limousin (Kupon Q-029).',
    type: 'donasi',
    timestamp: '1 hari yang lalu',
    isRead: true,
    actionTab: 'donasi_ziswaf',
    badge: 'Qurban'
  }
];
