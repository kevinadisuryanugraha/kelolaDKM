import { describe, it, expect } from 'vitest';
import { formatWhatsAppMessage } from '../utils/whatsappGateway';

describe('WhatsApp Gateway Formatting', () => {
  it('formats KWITANSI_DONASI message with reference number and rupiah formatting', () => {
    const msg = formatWhatsAppMessage({
      recipientName: 'H. Ahmad',
      recipientPhone: '081234567890',
      type: 'KWITANSI_DONASI',
      data: {
        refNumber: 'INV/20260819/001',
        amount: 250000,
        category: 'Infaq Renovasi',
        date: '19 Agustus 2026'
      }
    });

    expect(msg).toContain('BUKTI PENERIMAAN RESMI');
    expect(msg).toContain('INV/20260819/001');
    expect(msg).toContain('Rp 250.000');
    expect(msg).toContain('H. Ahmad');
  });

  it('formats BROADCAST_KAJIAN with speaker and schedule details', () => {
    const msg = formatWhatsAppMessage({
      recipientName: 'Jamaah Masjid',
      recipientPhone: '081234567890',
      type: 'BROADCAST_KAJIAN',
      data: {
        title: 'Tafsir Surat Al-Kahfi',
        speaker: 'Ustadz Fulan',
        date: 'Sabtu Malam',
        time: '18:30'
      }
    });

    expect(msg).toContain('UNDANGAN MAJELIS ILMU');
    expect(msg).toContain('Tafsir Surat Al-Kahfi');
    expect(msg).toContain('Ustadz Fulan');
    expect(msg).toContain('18:30 WIB');
  });

  it('formats REMINDER_QURBAN with coupon code and animal type', () => {
    const msg = formatWhatsAppMessage({
      recipientName: 'Shohibul Qurban',
      recipientPhone: '081234567890',
      type: 'REMINDER_QURBAN',
      data: {
        refNumber: 'KPN-SA-42',
        category: '1/7 Sapi Qurban'
      }
    });

    expect(msg).toContain('KARTU PENGAMBILAN DAGING QURBAN');
    expect(msg).toContain('KPN-SA-42');
    expect(msg).toContain('1/7 Sapi Qurban');
  });

  it('formats SURAT_RESMI and CUSTOM with fallback handling', () => {
    const msg = formatWhatsAppMessage({
      recipientName: 'Pengurus',
      recipientPhone: '081234567890',
      type: 'CUSTOM',
      data: {
        customMessage: 'Rapat pleno evaluasi DKM akan diselenggarakan besok malam.'
      }
    });

    expect(msg).toContain('Rapat pleno evaluasi DKM');
    expect(msg).toContain('Pengurus');
  });
});
