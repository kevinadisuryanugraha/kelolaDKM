import { DkmStaff, ImamSchedule } from '../../types';

export const DKM_STAFF: DkmStaff[] = [
  {
    id: 'STF-01', name: 'H. Hamdani', position: 'Ketua DKM',
    department: 'Badan Pengurus Harian', phone: '0812-9988-1122',
    email: 'ketua@masjidnuruliman-pejaten.or.id',
    photoUrl: '', period: '2024 - 2027'
  },
  {
    id: 'STF-02', name: 'Drs. H. Syamsuddin, M.Si.', position: 'Wakil Ketua',
    department: 'Badan Pengurus Harian', phone: '0813-1122-3344',
    email: 'wakil@masjidnuruliman-pejaten.or.id',
    photoUrl: '', period: '2024 - 2027'
  },
  {
    id: 'STF-03', name: 'Ustadz H. Abdullah Mansyur, S.Pd.I.', position: 'Sekretaris',
    department: 'Sekretariat & Administrasi', phone: '0815-4433-2211',
    email: 'sekretaris@masjidnuruliman-pejaten.or.id',
    photoUrl: '', period: '2024 - 2027'
  },
  {
    id: 'STF-04', name: 'T. Handoko', position: 'Bendahara Umum',
    department: 'Bidang Keuangan & ZISWAF', phone: '0811-8822-3344',
    email: 'bendahara@masjidnuruliman-pejaten.or.id',
    photoUrl: '', period: '2024 - 2027'
  },
  {
    id: 'STF-05', name: 'Ir. H. Budi Santoso', position: 'Ketua Bidang Sarpras & Inventaris',
    department: 'Bidang Pembangunan & Pemeliharaan', phone: '0816-7788-9900',
    email: 'sarpras@masjidnuruliman-pejaten.or.id',
    photoUrl: '', period: '2024 - 2027'
  },
];

export const IMAM_MUADZIN_LIST: ImamSchedule[] = [
  {
    id: 'IM-01', name: 'Ustadz Farhan Al-Hafiz, Lc.', role: 'Imam Utama',
    dutyDays: ['Senin', 'Rabu', 'Jumat', 'Sabtu'],
    bio: 'Alumnus Fakultas Shariah Universitas Al-Azhar Kairo. Hafiz 30 Juz dengan Sanad Qira\'at Ashim.',
    photoUrl: ''
  },
  {
    id: 'IM-02', name: 'Ustadz Bilal Ramadhan, S.Q.', role: 'Muadzin Utama',
    dutyDays: ['Setiap Hari'],
    bio: 'Qari\' Juara MTQ DKI Jakarta. Berjiwa lembut dengan alunan adhan khas Makam & Hijaz.',
    photoUrl: ''
  },
  {
    id: 'IM-03', name: 'KH. Drs. Ahmad Fauzi, M.Ag.', role: 'Khatib',
    dutyDays: ['Jumat Minggu I & III'],
    bio: 'Ketua MUI Pasar Minggu & Penceramah Rutin TVRI.',
    photoUrl: ''
  }
];
