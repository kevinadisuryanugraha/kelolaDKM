import { DonationCampaign, DonorRecord } from '../../types';

export const DONATION_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'CMP-01', title: 'Pengadaan & Renovasi Kanopi Selasar Barat Masjid Jami Nurul Iman',
    category: 'Renovasi', targetAmount: 85000000, collectedAmount: 62400000, donorCount: 142,
    deadline: '2026-08-31',
    description: 'Renovasi kanopi selasar seluas 120m² untuk kenyamanan jamaah saat jamaah melimpah pada Sholat Jumat & Kajian Akbar.',
    imageUrl: '', isUrgent: true
  },
  {
    id: 'CMP-02', title: 'Santunan 100 Anak Yatim & Dhuafa Pejaten Timur',
    category: 'Social/Yatim', targetAmount: 50000000, collectedAmount: 38200000, donorCount: 98,
    deadline: '2026-08-15',
    description: 'Program santunan bulanan berupa uang saku sekolah, perlengkapan belajar, dan paket sembako keluarga dhuafa.',
    imageUrl: ''
  },
  {
    id: 'CMP-03', title: 'Bantuan Operasional Ibadah & Syiar Ramadhan',
    category: 'Operasional', targetAmount: 30000000, collectedAmount: 21500000, donorCount: 64,
    deadline: '2026-09-30',
    description: 'Dukungan operasional ibadah Ramadhan, takjil gratis & syiar dakwah untuk jamaah Pejaten Timur.',
    imageUrl: ''
  }
];

export const DONOR_RECORDS: DonorRecord[] = [
  { id: 'DNR-101', donorName: 'H. Bambang Sugipto', phone: '0812-3344-5566', email: 'bambang@gmail.com',
    campaignId: 'CMP-01', campaignTitle: 'Renovasi Kanopi Selasar Barat', amount: 2500000,
    method: 'Transfer BSI', date: '2026-07-23', status: 'Diterima' },
  { id: 'DNR-102', donorName: 'Hamba Allah', phone: '0815-9900-1122',
    campaignId: 'CMP-02', campaignTitle: 'Santunan 100 Anak Yatim', amount: 500000,
    method: 'QRIS', date: '2026-07-23', status: 'Diterima', isAnonymous: true },
  { id: 'DNR-103', donorName: 'Hj. Ratna Sari', phone: '0811-2233-4455', email: 'ratna.sari@yahoo.com',
    campaignId: 'CMP-01', campaignTitle: 'Renovasi Kanopi Selasar Barat', amount: 1000000,
    method: 'QRIS', date: '2026-07-22', status: 'Diterima' }
];
