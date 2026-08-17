import { MASJID_INFO } from '../data/mockData';

export interface OfficialDocOptions {
  title: string;
  docNumber?: string;
  period?: string;
  data: any[];
  columns?: { key: string; header: string; align?: 'left' | 'center' | 'right'; format?: (val: any) => string }[];
  summary?: { label: string; value: string }[];
  signerLeft?: { title: string; name: string };
  signerRight?: { title: string; name: string };
}

/**
 * Generate pixel-perfect official printable A4 document with Masjid Kop Surat and Signatures
 */
export const printOfficialDocument = (opts: OfficialDocOptions) => {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Pop-up terblokir. Harap izinkan pop-up peramban untuk mencetak dokumen resmi.');
    return;
  }

  const currentDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const docNumber = opts.docNumber || `0${Math.floor(Math.random() * 90 + 10)}/DKM-MNI/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  // Build Table Headers & Rows
  const cols = opts.columns || (opts.data.length > 0
    ? Object.keys(opts.data[0]).slice(0, 6).map(k => ({
        key: k,
        header: k.replace(/([A-Z])/g, ' $1').toUpperCase(),
        align: (typeof opts.data[0][k] === 'number' ? 'right' : 'left') as 'left' | 'right'
      }))
    : []);

  const tableHeaderHtml = cols.map(c => `<th style="text-align: ${c.align || 'left'};">${c.header}</th>`).join('');

  const tableRowsHtml = opts.data.map((row, idx) => {
    const cells = cols.map(c => {
      let val = row[c.key];
      if (c.format) {
        val = c.format(val);
      } else if (typeof val === 'number') {
        val = `Rp ${val.toLocaleString('id-ID')}`;
      } else if (val === null || val === undefined) {
        val = '-';
      }
      return `<td style="text-align: ${c.align || 'left'};">${val}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  // Summary box
  let summaryHtml = '';
  if (opts.summary && opts.summary.length > 0) {
    summaryHtml = `
      <div class="summary-box">
        ${opts.summary.map(s => `
          <div class="summary-item">
            <span class="summary-label">${s.label}:</span>
            <span class="summary-value">${s.value}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  const leftSigner = opts.signerLeft || { title: 'Bendahara DKM', name: 'H. M. Syukron, S.E.' };
  const rightSigner = opts.signerRight || { title: 'Ketua DKM Masjid Jami Nurul Iman', name: 'Drs. H. Ahmad Dahlan, M.Pd.I' };

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${opts.title} — ${MASJID_INFO.name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 20mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif, Arial, sans-serif;
      color: #111827;
      background: #fff;
      margin: 0;
      padding: 10px;
      font-size: 11pt;
      line-height: 1.4;
    }
    /* Kop Surat Header */
    .kop-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding-bottom: 10px;
      border-bottom: 3px double #0f172a;
      margin-bottom: 20px;
    }
    .kop-logo {
      width: 75px;
      height: 75px;
      background: #064e3b;
      color: #fbbf24;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32pt;
      font-weight: bold;
      flex-shrink: 0;
    }
    .kop-text {
      text-align: center;
    }
    .kop-title-sub {
      font-size: 10pt;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 600;
      color: #065f46;
      margin-bottom: 2px;
    }
    .kop-title-main {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
      margin: 0;
    }
    .kop-address {
      font-size: 9pt;
      color: #475569;
      margin-top: 4px;
    }
    .kop-contact {
      font-size: 8.5pt;
      color: #047857;
      font-weight: 500;
    }

    /* Document Title */
    .doc-meta {
      text-align: center;
      margin-bottom: 20px;
    }
    .doc-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: underline;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .doc-num {
      font-size: 10pt;
      font-family: monospace;
      color: #334155;
    }
    .doc-period {
      font-size: 9.5pt;
      color: #475569;
      margin-top: 2px;
    }

    /* Data Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: 9.5pt;
    }
    th {
      background-color: #064e3b;
      color: #ffffff;
      padding: 8px 10px;
      border: 1px solid #064e3b;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 8.5pt;
      letter-spacing: 0.5px;
    }
    td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Summary Box */
    .summary-box {
      margin-top: 15px;
      margin-left: auto;
      width: 320px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 10pt;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }
    .summary-label {
      color: #475569;
      font-weight: 500;
    }
    .summary-value {
      font-weight: bold;
      color: #0f172a;
      font-family: monospace;
    }

    /* Signatures Section */
    .signatures {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .signature-col {
      width: 250px;
      text-align: center;
      font-size: 10pt;
    }
    .signature-space {
      height: 70px;
    }
    .signature-name {
      font-weight: bold;
      text-decoration: underline;
      color: #0f172a;
    }
    .signature-title {
      font-size: 9pt;
      color: #475569;
    }

    /* Footer Note */
    .footer-note {
      margin-top: 35px;
      padding-top: 8px;
      border-top: 1px dashed #94a3b8;
      font-size: 8pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <!-- Print Control Bar -->
  <div class="no-print" style="background: #0f172a; color: white; padding: 12px 20px; margin-bottom: 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <strong>Pratinjau Dokumen Cetak Resmi A4</strong> — Masjid Jami Nurul Iman
    </div>
    <div>
      <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px; margin-right: 8px;">
        🖨️ Cetak / Simpan PDF
      </button>
      <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">
        Tutup
      </button>
    </div>
  </div>

  <!-- Kop Surat Resmi -->
  <div class="kop-header">
    <div class="kop-logo">🕌</div>
    <div class="kop-text">
      <div class="kop-title-sub">Dewan Kemakmuran Masjid (DKM)</div>
      <h1 class="kop-title-main">${MASJID_INFO.name}</h1>
      <div class="kop-address">${MASJID_INFO.address}</div>
      <div class="kop-contact">Telp: ${MASJID_INFO.phone} • Email: ${MASJID_INFO.email} • Web: masjidnuruliman-pejaten.or.id</div>
    </div>
  </div>

  <!-- Document Meta & Title -->
  <div class="doc-meta">
    <div class="doc-title">${opts.title}</div>
    <div class="doc-num">Nomor: ${docNumber}</div>
    ${opts.period ? `<div class="doc-period">Periode: ${opts.period}</div>` : ''}
  </div>

  <!-- Data Table -->
  <table>
    <thead>
      <tr>
        ${tableHeaderHtml}
      </tr>
    </thead>
    <tbody>
      ${tableRowsHtml}
    </tbody>
  </table>

  <!-- Summary Box -->
  ${summaryHtml}

  <!-- Signatures -->
  <div class="signatures">
    <div class="signature-col">
      <div>Mengetahui,</div>
      <div class="signature-title">${leftSigner.title}</div>
      <div class="signature-space"></div>
      <div class="signature-name">${leftSigner.name}</div>
      <div class="signature-title">NIP: DKM-MNI-${new Date().getFullYear()}-01</div>
    </div>

    <div class="signature-col">
      <div>Jakarta, ${currentDate}</div>
      <div class="signature-title">${rightSigner.title}</div>
      <div class="signature-space"></div>
      <div class="signature-name">${rightSigner.name}</div>
      <div class="signature-title">NIP: DKM-MNI-${new Date().getFullYear()}-00</div>
    </div>
  </div>

  <!-- Footer Note -->
  <div class="footer-note">
    <span>Dicetak secara otomatis melalui KelolaDKM System</span>
    <span>Tanggal Cetak: ${currentDate}</span>
    <span>Halaman 1 dari 1</span>
  </div>

  <script>
    // Auto-trigger print dialog after load
    window.onload = function() {
      // Optional: window.print();
    }
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

/**
 * Generate official Kwitansi Infaq / Zakat Slip (A5 / Slip format)
 */
export const printOfficialReceipt = (tx: {
  refNumber: string;
  donorName: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  recordedBy?: string;
}) => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    alert('Pop-up terblokir. Harap izinkan pop-up peramban untuk mencetak kwitansi.');
    return;
  }

  const currentDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(tx.date || new Date()));

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Kwitansi ${tx.refNumber} — ${MASJID_INFO.name}</title>
  <style>
    @page { size: A5 landscape; margin: 10mm; }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 15px;
      color: #1e293b;
      font-size: 11pt;
    }
    .receipt-container {
      border: 2px solid #064e3b;
      border-radius: 12px;
      padding: 20px;
      background: #fafaf9;
      position: relative;
    }
    .receipt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #064e3b;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .receipt-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .receipt-logo {
      font-size: 28pt;
    }
    .receipt-title {
      font-size: 14pt;
      font-weight: bold;
      color: #064e3b;
      text-transform: uppercase;
    }
    .receipt-badge {
      background: #064e3b;
      color: #fef08a;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12pt;
      font-weight: bold;
      text-align: right;
    }
    .receipt-body {
      margin: 15px 0;
      line-height: 1.8;
    }
    .receipt-row {
      display: flex;
      margin-bottom: 6px;
    }
    .receipt-label {
      width: 170px;
      color: #64748b;
      font-weight: 500;
    }
    .receipt-value {
      flex: 1;
      font-weight: bold;
      color: #0f172a;
    }
    .amount-box {
      background: #ecfdf5;
      border: 1px solid #10b981;
      color: #065f46;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14pt;
      font-weight: bold;
      font-family: monospace;
      margin-top: 10px;
      display: inline-block;
    }
    .receipt-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 25px;
    }
    .signer-box {
      text-align: center;
      width: 200px;
    }
    .signer-space {
      height: 50px;
    }
    .signer-name {
      font-weight: bold;
      text-decoration: underline;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-size: 60pt;
      color: rgba(6, 78, 59, 0.05);
      font-weight: 900;
      pointer-events: none;
      white-space: nowrap;
    }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; text-align: right;">
    <button onclick="window.print()" style="background: #064e3b; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
      🖨️ Cetak Kwitansi
    </button>
  </div>

  <div class="receipt-container">
    <div class="watermark">LUNAS / DITERIMA</div>

    <div class="receipt-header">
      <div class="receipt-brand">
        <div class="receipt-logo">🕌</div>
        <div>
          <div class="receipt-title">${MASJID_INFO.name}</div>
          <div style="font-size: 8.5pt; color: #64748b;">${MASJID_INFO.address}</div>
        </div>
      </div>
      <div class="receipt-badge">
        BUKTI PENERIMAAN<br>
        <span style="font-size: 9pt; font-family: monospace; color: white;">${tx.refNumber}</span>
      </div>
    </div>

    <div class="receipt-body">
      <div class="receipt-row">
        <span class="receipt-label">Telah Diterima Dari</span>
        <span class="receipt-value">: ${tx.donorName}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Untuk Keperluan</span>
        <span class="receipt-value">: ${tx.category} ${tx.notes ? `(${tx.notes})` : ''}</span>
      </div>
      <div class="receipt-row">
        <span class="receipt-label">Jumlah Pembayaran</span>
        <span class="receipt-value">: <span class="amount-box">Rp ${tx.amount.toLocaleString('id-ID')}</span></span>
      </div>
    </div>

    <div class="receipt-footer">
      <div style="font-size: 8.5pt; color: #64748b;">
        * Bukti sah diterbitkan oleh Sistem KelolaDKM<br>
        * Syukran Katsiran, Jazakumullah Khairan Katsiran
      </div>
      <div class="signer-box">
        <div style="font-size: 9pt;">Jakarta, ${currentDate}</div>
        <div style="font-size: 9pt; color: #64748b;">Bendahara / Petugas Penerima</div>
        <div class="signer-space"></div>
        <div class="signer-name">${tx.recordedBy || 'H. M. Syukron, S.E.'}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

/**
 * Export data to CSV / Excel with UTF-8 BOM
 */
export const downloadExcelCsv = (title: string, data: any[]) => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk di-export.');
    return;
  }

  const keys = Object.keys(data[0]);
  const headerRow = keys.map(k => `"${k.replace(/([A-Z])/g, ' $1').toUpperCase()}"`).join(',');

  const rows = data.map(row => {
    return keys.map(k => {
      let val = row[k];
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
