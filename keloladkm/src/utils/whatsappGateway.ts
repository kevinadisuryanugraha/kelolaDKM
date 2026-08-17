import { MASJID_INFO } from '../data/mockData';

export interface WhatsAppMessagePayload {
  recipientPhone: string;
  recipientName: string;
  type: 'KWITANSI_DONASI' | 'BROADCAST_KAJIAN' | 'SURAT_RESMI' | 'REMINDER_QURBAN' | 'CUSTOM';
  data: {
    refNumber?: string;
    amount?: number;
    category?: string;
    title?: string;
    speaker?: string;
    date?: string;
    time?: string;
    customMessage?: string;
  };
}

/**
 * Format message into standard Indonesian Islamic DKM WhatsApp format
 */
export const formatWhatsAppMessage = (payload: WhatsAppMessagePayload): string => {
  const { recipientName, type, data } = payload;
  const masjidName = MASJID_INFO.name;
  const masjidAddress = 'Pejaten Timur, Pasar Minggu, Jakarta Selatan';

  switch (type) {
    case 'KWITANSI_DONASI':
      return `*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. *${recipientName}*,
Terima kasih telah menyalurkan infaq/zakat melalui *${masjidName}*.

🧾 *BUKTI PENERIMAAN RESMI (KWITANSI)*
━━━━━━━━━━━━━━━━━━━━
• *No. Referensi* : ${data.refNumber || 'REC/2026/001'}
• *Peruntukan*    : ${data.category || 'Infaq Kas Masjid'}
• *Jumlah Donasi* : *Rp ${(data.amount || 0).toLocaleString('id-ID')}*
• *Tanggal*       : ${data.date || new Date().toLocaleDateString('id-ID')}
• *Status*        : *LUNAS / SAH DITERIMA*
━━━━━━━━━━━━━━━━━━━━

_Jazakumullahu khairan katsiran._ Semoga infaq/zakat yang Bapak/Ibu tunaikan dibalas dengan keberkahan rezeki yang melimpah dan menjadi amal jariyah di akhirat kelak. Aamiin Ya Rabbal 'Alamin.

Salam hormat,
*Pengurus DKM ${masjidName}*
📍 ${masjidAddress}
🌐 https://masjidnuruliman-pejaten.or.id`;

    case 'BROADCAST_KAJIAN':
      return `*Assalamu'alaikum Warahmatullahi Wabarakatuh*

📢 *UNDANGAN MAJELIS ILMU & KAJIAN RUTIN*
*${masjidName}*

Hadirilah majelis ilmu dengan rincian kegiatan sebagai berikut:
━━━━━━━━━━━━━━━━━━━━
📖 *Tema*       : *${data.title || 'Kajian Rutin Pekanan'}*
🎙️ *Narasumber* : *${data.speaker || 'Ustadz Tamu'}*
📅 *Hari/Tgl*   : ${data.date || 'Sabtu Malam Ahad'}
⏰ *Waktu*      : ${data.time || 'Ba\'da Maghrib s/d Isya'} WIB
📍 *Tempat*     : Ruang Utama ${masjidName}
━━━━━━━━━━━━━━━━━━━━

_Barangsiapa menempuh jalan untuk menuntut ilmu, maka Allah mudahkan baginya jalan menuju surga._ (HR. Muslim)

Ajak serta keluarga dan kerabat. Terbuka untuk umum (Muslimin & Muslimat).

Wassalamu'alaikum Wr. Wb.
*Seksi Dakwah & Ibadah DKM ${masjidName}*`;

    case 'REMINDER_QURBAN':
      return `*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. Bpk/Ibu *${recipientName}*,
Peserta Ibadah Qurban ${masjidName} ${new Date().getFullYear()} H.

🏷️ *KARTU PENGAMBILAN DAGING QURBAN*
━━━━━━━━━━━━━━━━━━━━
• *Kode Kupon* : *${data.refNumber || 'QRB-2026-001'}*
• *Jenis Hewan*: ${data.category || '1/7 Sapi Qurban'}
• *Jadwal Ambil*: Hari Tasyrik (10 Dzulhijjah) pukul 13.00 WIB
• *Lokasi*     : Posko Distribusi Qurban Halaman Masjid
━━━━━━━━━━━━━━━━━━━━
Harap tunjukkan pesan WhatsApp ini kepada panitia saat pengambilan paket.

*Panitia Qurban DKM ${masjidName}*`;

    case 'SURAT_RESMI':
    case 'CUSTOM':
    default:
      return `*Assalamu'alaikum Warahmatullahi Wabarakatuh*

Yth. *${recipientName}*,

${data.customMessage || 'Pemberitahuan resmi dari DKM Masjid Jami Nurul Iman Pejaten Timur.'}

Wassalamu'alaikum Wr. Wb.
*DKM ${masjidName}*`;
  }
};

/**
 * Open direct WhatsApp Web / WhatsApp App link with prepared text
 */
export const openWhatsAppDirect = (phone: string, text: string) => {
  let cleanedPhone = phone.replace(/[^0-9]/g, '');
  if (cleanedPhone.startsWith('0')) {
    cleanedPhone = '62' + cleanedPhone.slice(1);
  } else if (!cleanedPhone.startsWith('62')) {
    cleanedPhone = '62' + cleanedPhone;
  }

  const encoded = encodeURIComponent(text);
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}&text=${encoded}`;
  window.open(waUrl, '_blank');
};
