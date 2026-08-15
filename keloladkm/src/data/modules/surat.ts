import { OfficialLetter, OfficialDocument } from '../../types';

export const OFFICIAL_LETTERS: OfficialLetter[] = [
  { id: 'LTR-001', letterNumber: '045/DKM-NI/PJM/VII/2026', type: 'Keluar',
    senderOrRecipient: 'Kelurahan Pejaten Timur', subject: 'Permohonan Izin Tempat & Keramaian Tabligh Akbar',
    date: '2026-07-20', dispositionTo: 'Sekretaris DKM', status: 'Selesai' },
  { id: 'LTR-002', letterNumber: '112/KUA-PSM/VII/2026', type: 'Masuk',
    senderOrRecipient: 'KUA Kecamatan Pasar Minggu', subject: 'Undangan Rapat Koordinasi Panitia ZISWAF Kecamatan',
    date: '2026-07-22', dispositionTo: 'Ketua DKM & Bendahara', status: 'Diproses' }
];

export const OFFICIAL_DOCUMENTS: OfficialDocument[] = [
  { id: 'DOC-01', title: 'SK Pengurus DKM Masjid Jami Nurul Iman Periode 2024-2027',
    category: 'SK DKM', uploadDate: '2024-01-15', fileSize: '2.4 MB', downloadCount: 184 },
  { id: 'DOC-02', title: 'Sertifikat Wakaf Tanah Masjid & IMB Bangunan',
    category: 'Sertifikat Wakaf', uploadDate: '2022-03-10', fileSize: '4.1 MB', downloadCount: 92 },
  { id: 'DOC-03', title: 'Proposal Laporan Keuangan Audit & Rencana Renovasi 2026',
    category: 'Proposal', uploadDate: '2026-01-05', fileSize: '5.8 MB', downloadCount: 310 }
];
