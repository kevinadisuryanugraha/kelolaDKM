import { InventoryItem, RoomBooking } from '../../types';

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'INV-AC-01', code: 'AST-AC-2024-001', name: 'AC Inverter Daikin 2 PK Split Wall',
    category: 'Elektronik', location: 'Ruang Utama Sholat', quantity: 6, unit: 'Unit',
    condition: 'Sangat Baik', purchaseDate: '2024-03-15', purchasePrice: 9500000,
    currentValue: 7800000, qrCode: 'QR-AST-AC-2024-001', lastMaintenance: '2026-07-21',
    notes: 'Service rutin pencucian evaporator & penambahan freon R32' },
  { id: 'INV-SPK-01', code: 'AST-SPK-2025-002', name: 'Speaker Active Column Yamaha DBR15 1000W',
    category: 'Elektronik', location: 'Mimbar Utama & Selasar', quantity: 4, unit: 'Set',
    condition: 'Sangat Baik', purchaseDate: '2025-01-10', purchasePrice: 14200000,
    currentValue: 12500000, qrCode: 'QR-AST-SPK-2025-002', lastMaintenance: '2026-06-10',
    notes: 'Termasuk digital mixer Soundcraft Signature 16' },
  { id: 'INV-KRP-01', code: 'AST-KRP-2023-005', name: 'Karpet Sajadah Import Turki Premium Tebal 16mm',
    category: 'Alat Ibadah', location: 'Ruang Utama Sholat', quantity: 120, unit: 'Meter',
    condition: 'Baik', purchaseDate: '2023-09-01', purchasePrice: 650000, currentValue: 500000,
    qrCode: 'QR-AST-KRP-2023-005', lastMaintenance: '2026-07-01',
    notes: 'Vacuum cleaning mingguan & cuci profesional per 6 bulan' }
];

export const ROOM_BOOKINGS: RoomBooking[] = [
  { id: 'BKG-001', roomName: 'Aula Lantai 2 Masjid', applicantName: 'Panitia Kajian Subuh Nurul Iman',
    eventName: 'Pelatihan Leadership & Public Speaking Remaja', startDate: '2026-08-01 08:00',
    endDate: '2026-08-01 16:00', status: 'Disetujui' },
  { id: 'BKG-002', roomName: 'Selasar Barat', applicantName: 'Panitia Khitanan Massal',
    eventName: 'Khitanan Ceria Gratis Anak Dhuafa', startDate: '2026-08-09 07:00',
    endDate: '2026-08-09 13:00', status: 'Disetujui' }
];
