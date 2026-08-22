import { DonationCampaign, DonorRecord } from '../../types';

export const DONATION_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'CMP-01',
    title: 'Program Pengadaan Beras & Bantuan Sosial Jamaah DKM',
    category: 'Social/Yatim',
    targetAmount: 12000000,
    collectedAmount: 1700000,
    donorCount: 24,
    deadline: '2026-12-31',
    description: 'Penyaluran beras dan bantuan sosial DKM bagi warga dan keluarga mustahik di lingkungan sekitar Masjid Jami Nurul Iman.',
    imageUrl: '',
    isUrgent: true
  },
  {
    id: 'CMP-02',
    title: 'Infaq Pemeliharaan Sarana, Kelistrikan & Kebersihan Masjid',
    category: 'Renovasi',
    targetAmount: 10000000,
    collectedAmount: 1919900,
    donorCount: 48,
    deadline: '2026-12-31',
    description: 'Dukungan pemeliharaan berkala lampu penerangan, sanitasi, obat pembersih, dan kebersihan ruang utama ibadah.',
    imageUrl: ''
  },
  {
    id: 'CMP-03',
    title: 'Infaq Dakwah, Majelis Ta\'lim & Pembinaan Jamaah',
    category: 'Operasional',
    targetAmount: 15000000,
    collectedAmount: 5300000,
    donorCount: 86,
    deadline: '2026-12-31',
    description: 'Operasional kegiatan majelis ta\'lim pekanan, kajian ta\'lim ibu-ibu, dan syiar dakwah Masjid Jami Nurul Iman.',
    imageUrl: ''
  }
];

export const DONOR_RECORDS: DonorRecord[] = [
  {
    id: 'DNR-101',
    donorName: 'Hamba Allah',
    phone: '0812-9900-1122',
    email: '',
    campaignId: 'CMP-01',
    campaignTitle: 'Program Pengadaan Beras & Bantuan Sosial Jamaah DKM',
    amount: 1400000,
    method: 'Transfer BSI',
    date: '2026-07-27',
    status: 'Diterima',
    isAnonymous: true
  },
  {
    id: 'DNR-102',
    donorName: 'Bpk Abdulloh Jusuf',
    phone: '0813-8877-6655',
    email: '',
    campaignId: 'CMP-03',
    campaignTitle: 'Infaq Dakwah, Majelis Ta\'lim & Pembinaan Jamaah',
    amount: 250000,
    method: 'QRIS',
    date: '2026-08-17',
    status: 'Diterima'
  },
  {
    id: 'DNR-103',
    donorName: 'Ibu Kusdarwati',
    phone: '0815-4433-2211',
    email: '',
    campaignId: 'CMP-02',
    campaignTitle: 'Infaq Pemeliharaan Sarana, Kelistrikan & Kebersihan Masjid',
    amount: 250000,
    method: 'Transfer BSI',
    date: '2026-07-11',
    status: 'Diterima'
  },
  {
    id: 'DNR-104',
    donorName: 'Hamba Allah',
    phone: '0811-2233-4455',
    email: '',
    campaignId: 'CMP-02',
    campaignTitle: 'Infaq Pemeliharaan Sarana, Kelistrikan & Kebersihan Masjid',
    amount: 550000,
    method: 'Transfer BSI',
    date: '2026-08-06',
    status: 'Diterima',
    isAnonymous: true
  },
  {
    id: 'DNR-105',
    donorName: 'Bpk Sunardono',
    phone: '0816-7788-9900',
    email: '',
    campaignId: 'CMP-02',
    campaignTitle: 'Infaq Pemeliharaan Sarana, Kelistrikan & Kebersihan Masjid',
    amount: 50000,
    method: 'Transfer BSI',
    date: '2026-08-01',
    status: 'Diterima'
  },
  {
    id: 'DNR-106',
    donorName: 'Bpk Sanusi',
    phone: '0817-6655-4433',
    email: '',
    campaignId: 'CMP-02',
    campaignTitle: 'Infaq Pemeliharaan Sarana, Kelistrikan & Kebersihan Masjid',
    amount: 50000,
    method: 'Cash / Tunai',
    date: '2026-08-05',
    status: 'Diterima'
  }
];
