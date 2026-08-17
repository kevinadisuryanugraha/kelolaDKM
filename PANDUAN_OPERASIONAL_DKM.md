# Buku Panduan Operasional & Serah Terima Sistem KelolaDKM
**Masjid Jami Nurul Iman — Pejaten Timur, Pasar Minggu, Jakarta Selatan**

Selamat datang di sistem digitalisasi terpadu **KelolaDKM**. Dokumen ini disusun sebagai panduan operasional resmi bagi pengurus Dewan Kemakmuran Masjid (DKM), donatur, dan administrator sistem.

---

## 1. Daftar Akun Demo & Hak Akses Pengurus

Sistem menggunakan **Strict Role-Based Access Control (RBAC)** dengan 6 hak akses:

| Role / Jabatan | Email Login | Password Default | Cakupan Wewenang |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@masjidnuruliman.id` | `password123` | Akses penuh ke seluruh konfigurasi sistem, database, audit log, dan manajemen user. |
| **Ketua DKM** | `ketua@masjidnuruliman.id` | `password123` | Overview, persetujuan keuangan kas, disposisi surat resmi, monitoring agenda & audit log. |
| **Bendahara** | `bendahara@masjidnuruliman.id` | `password123` | Pencatatan transaksi kas masuk/keluar, akun COA, anggaran, verifikasi donasi ZISWAF & qurban. |
| **Sekretaris** | `sekretaris@masjidnuruliman.id` | `password123` | Pembuatan surat resmi dinas, jadwal kajian/agenda, artikel CMS berita website & blast WA. |
| **Admin Inventaris**| `inventaris@masjidnuruliman.id` | `password123` | Pendataan aset masjid, peminjaman ruangan/fasilitas, dan status pemeliharaan sarpras. |
| **Viewer (Jamaah)**| `viewer@masjidnuruliman.id` | `password123` | Akses ringkasan transparan (Read-Only). Tidak dapat mengubah data keuangan/inventaris. |

---

## 2. Prosedur Operasional Harian Pengurus

### 💰 A. Bendahara: Pencatatan Kas & Verifikasi Donasi
1. Buka dashboard menu **"Akuntansi & Keuangan"**.
2. Klik tombol **"+ Catat Transaksi Kas"**.
3. Pilih jenis transaksi (*Masuk / Keluar*), akun rekening (*COA*), nominal Rupiah, dan keterangan transaksi.
4. Transaksi akan berstatus *Pending Approval* hingga disetujui oleh Ketua DKM / Bendahara Utama.
5. Untuk setiap kas masuk / donasi, tekan tombol **"Kwitansi"** pada tabel untuk mencetak tanda terima sah ber-watermark bagi donatur.
6. Tekan tombol **"Export Ringkasan"** untuk mengunduh laporan keuangan bulanan ber-Kop Surat A4 atau format Excel (.csv).

### 📢 B. Sekretaris: Broadcast WhatsApp & Agenda Kajian
1. Buka modul **"Agenda & Event Kajian"** untuk menambah jadwal taklim baru.
2. Pada kartu kajian yang ingin diumumkan, klik **"Broadcast WA"**.
3. Buka modul **"Broadcast WhatsApp"** untuk menyusun pesan blast massal ke grup jamaah (1,420 kontak jamaah Pejaten Timur).
4. Gunakan template standar yang telah disediakan (*Jadwal Kajian, Kwitansi Donasi, Kupon Qurban*).

### 📦 C. Admin Sarpras: Inventaris & Peminjaman Ruangan
1. Buka modul **"Inventaris & Sarpras"**.
2. Tambahkan aset baru dengan nomor inventaris, lokasi penempatan, kondisi (*Baik, Rusak Ringan, Perlu Perbaikan*), dan nilai perolehan.
3. Catat jadwal peminjaman Aula Utama atau Ruang Rapat DKM pada tab *Peminjaman Ruangan*.

### 📰 D. Sekretaris & Media: Pengelolaan CMS Berita, Artikel & Running Text
1. Buka modul dashboard **"Website CMS & Media"**.
2. **Menulis Berita Baru**:
   * Klik tombol **"+ Tulis Artikel Baru"**.
   * Isi Judul Artikel, pilih Rubrik (*Dakwah, Pengumuman, Kegiatan, Sosial*), nama Penulis, Ringkasan, dan Teks Konten Lengkap.
   * Aktifkan opsi **"Langsung terbitkan ke website publik"** (*atau nonaktifkan untuk menyimpan sebagai Draft*), lalu klik **"Simpan & Publikasikan"**.
   * Berita akan langsung tampil di halaman publik portal jamaah tanpa perlu menyentuh koding.
3. **Mengedit / Menghapus Berita**:
   * Pada tabel/kartu artikel, klik tombol **"Edit"** untuk memperbarui isi, atau **"Jadikan Draft"** untuk menonaktifkan tayangan publik sementara.
4. **Mengubah Running Text Topbar**:
   * Masuk ke tab **"Running Text & Banner Hero"**, ubah teks pengumuman berjalan, lalu klik **"Simpan & Publikasikan"**.

---

## 3. Alur Donasi Jamaah Tanpa Biaya Admin (Zero-Fee)

1. Jamaah membuka halaman **"Donasi Online"** atau **"Kalkulator Zakat"**.
2. Pilih nominal infaq/zakat dan metode pembayaran:
   * **QRIS Resmi**: Pindai langsung melalui BSI Mobile, BCA Mobile, Livin Mandiri, GoPay, OVO, ShopeePay, DANA.
   * **Transfer BSI**: Rekening `718-293-8472` a.n. `DKM Masjid Jami Nurul Iman`.
3. Setelah donasi disalurkan, jamaah menekan tombol **"Kirim Konfirmasi ke WA Bendahara"**.
4. Sistem otomatis mencatat donasi ke pembukuan DKM dan jamaah dapat mencetak kwitansi tanda terima digital seketika.

---

## 4. Perintah Cepat Menjalankan Aplikasi di Server

### Menjalankan Server Lokal / Development:
```bash
# Terminal 1: Backend Laravel API
cd keloladkm-api
php artisan serve --port=8000

# Terminal 2: Frontend React Vite PWA
cd keloladkm
npm run dev
```

### Menjalankan Production Build:
```bash
cd keloladkm
npm run build
```

### Menjalankan Pengujian Otomatis:
```bash
# Pengujian Backend API (PHPUnit)
cd keloladkm-api
php artisan test

# Pengujian Frontend (Vitest)
cd keloladkm
npm test
```

---
*Dokumen ini diterbitkan oleh Tim Pengembang KelolaDKM untuk DKM Masjid Jami Nurul Iman.*
