export type UserRole = 
  | 'super_admin'
  | 'ketua_dkm'
  | 'wakil_ketua'
  | 'sekretaris'
  | 'bendahara'
  | 'admin_keuangan'
  | 'admin_inventaris'

  | 'imam_muadzin'
  | 'relawan'
  | 'jamaah_donatur'
  | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  department?: string;
}

export interface PrayerTime {
  name: string;
  time: string; // HH:mm
  arabic: string;
  iqamahOffsetMinutes: number;
}

export interface KajianEvent {
  id: string;
  title: string;
  speaker: string; // Ustadz
  speakerTitle: string;
  speakerAvatar?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  category: 'Rutinkan Subuh' | 'Tematik' | 'Tafsir' | 'Fiqh' | 'Akhlaq' | 'Remaja';
  description: string;
  liveStreamUrl?: string;
  posterUrl?: string;
  isLive?: boolean;
}

export interface FinancialAccount {
  code: string; // COA code like '101.1'
  name: string;
  type: 'Aset' | 'Kewajiban' | 'Ekuitas' | 'Penerimaan' | 'Pengeluaran';
  balance: number;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'Masuk' | 'Keluar';
  accountCode: string;
  accountName: string;
  description: string;
  amount: number;
  category: string;
  recordedBy: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptUrl?: string;
  refNumber: string;
}

export interface BudgetPlan {
  id: string;
  category: string;
  allocatedAmount: number;
  usedAmount: number;
  period: string; // e.g. "Tahun 2026"
}

export interface DonationCampaign {
  id: string;
  title: string;
  category: 'Renovasi' | 'Operasional' | 'Social/Yatim' | 'Qurban' | 'Wakaf';
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  deadline: string;
  description: string;
  imageUrl: string;
  isUrgent?: boolean;
}

export interface DonorRecord {
  id: string;
  donorName: string;
  phone: string;
  email?: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  method: 'QRIS' | 'Transfer BSI' | 'Transfer Mandiri' | 'Cash / Tunai' | 'Transfer Muamalat';
  date: string;
  status: 'Verifikasi' | 'Diterima' | 'Ditolak';
  proofUrl?: string;
  isAnonymous?: boolean;
}

export interface ZakatCalculation {
  type: 'fitrah' | 'mal' | 'fidyah' | 'infaq';
  familyMembers?: number;
  ricePricePerKg?: number;
  goldGram?: number;
  goldPricePerGram?: number;
  totalIncomePerMonth?: number;
  totalAssets?: number;
  totalCalculated: number;
}

export interface QurbanParticipant {
  id: string;
  participantName: string;
  animalType: 'Sapi' | 'Kambing' | 'Domba Super';
  groupName?: string; // For 1/7 sapi
  phone: string;
  amount: number;
  paymentStatus: 'Lunas' | 'DP' | 'Belum Lunas';
  couponCode: string;
  isDistributed: boolean;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Elektronik' | 'Mebel & Interior' | 'Alat Ibadah' | 'Kendaraan' | 'Lainnya';
  location: string;
  quantity: number;
  unit: string;
  condition: 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan' | 'Rusak';
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  qrCode: string;
  lastMaintenance?: string;
  notes?: string;
}

export interface RoomBooking {
  id: string;
  roomName: string; // e.g. "Ruang Utama", "Aula Lt. 2", "Selasar Barat"
  applicantName: string;
  eventName: string;
  startDate: string;
  endDate: string;
  status: 'Disetujui' | 'Menunggu' | 'Ditolak';
}

export interface OfficialLetter {
  id: string;
  letterNumber: string;
  type: 'Masuk' | 'Keluar';
  senderOrRecipient: string;
  subject: string;
  date: string;
  dispositionTo?: string;
  status: 'Diterima' | 'Diproses' | 'Selesai' | 'Tersimpan';
  fileUrl?: string;
}

export interface OfficialDocument {
  id: string;
  title: string;
  category: 'AD ART' | 'SK DKM' | 'Sertifikat Wakaf' | 'Proposal' | 'Laporan Tahunan';
  uploadDate: string;
  fileSize: string;
  downloadCount: number;
}

export interface DkmStaff {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  photoUrl: string;
  period: string; // e.g. "2024 - 2027"
}

export interface ImamSchedule {
  id: string;
  name: string;
  role: 'Imam Utama' | 'Imam Rawatib' | 'Muadzin Utama' | 'Khatib';
  dutyDays: string[];
  bio: string;
  photoUrl: string;
}

export interface CMSArticle {
  id: string;
  title: string;
  category: 'Kegiatan' | 'Pengumuman' | 'Dakwah' | 'Sosial';
  author: string;
  date: string;
  summary: string;
  content: string;
  imageUrl: string;
  views: number;
  isPublished: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}
