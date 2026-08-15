# KelolaDKM — Frontend (Masjid Jami Nurul Iman)

Platform digital terpadu untuk manajemen masjid (KelolaDKM) dan portal jamaah
Masjid Jami Nurul Iman, Pejaten Timur, Jakarta Selatan.

Frontend ini adalah **SPA + PWA** yang terdiri dari dua area utama:

- **Website Publik** — profil masjid, jadwal sholat, kajian, donasi, kalkulator zakat,
  laporan keuangan transparan, berita, FAQ & kontak.
- **Dashboard Manajemen DKM** — keuangan, donasi/zakat/qurban, inventaris & sarpras,
  agenda & QR check-in, surat & arsip, website CMS, broadcast, dan audit log.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 6 + Tailwind CSS 4 |
| Routing | react-router-dom 7 (query-param based) |
| State | React Context (`AppContext`) |
| Data | Axios (`src/api/client.ts`) + localStorage fallback |
| Charts | Recharts |
| UI | Motion, Anime.js, Lucide, custom GlassCard/BentoGrid |
| Maps | @vis.gl/react-google-maps |
| PWA | vite-plugin-pwa |

## Struktur

```
src/
├── api/            # Axios client + data service (API-first, localStorage fallback)
├── components/
│   ├── auth/       # Halaman login
│   ├── common/     # Primitif UI & komponen bersama
│   ├── dashboard/  # 9 modul dashboard DKM
│   └── public/     # 11 halaman website publik
├── context/        # AppContext (state global + persistence)
├── data/           # Data mock & per-modul
├── i18n/           # Terjemahan id/en
├── types/          # Definisi tipe domain
└── utils/          # Helper (prayer times, dsb.)
```

## Menjalankan

**Prasyarat:** Node.js 18+ (disarankan 22).

```bash
npm install

# Development (http://localhost:3000)
npm run dev

# Type check
npm run lint

# Test (Vitest)
npm test

# Production build (output ke dist/)
npm run build
```

## Environment Variables

Buat file `.env` (lihat `.env.example` / `.env.production`):

```env
VITE_API_URL=http://localhost:8000/api     # URL backend Laravel (keloladkm-api)
VITE_MIDTRANS_CLIENT_KEY=                  # opsional
VITE_GOOGLE_MAPS_KEY=                      # opsional
```

## Backend

Frontend ini terhubung ke REST API Laravel di `../keloladkm-api`.
Jalankan backend terlebih dahulu agar autentikasi & data API berfungsi:

```bash
cd ../keloladkm-api
php artisan serve --port=8000
```

> Tanpa backend, aplikasi tetap berjalan dalam mode **demo/offline**
> (data mock dari `src/data/` disimpan di localStorage).

## Deployment

Lihat `DEPLOY.md` untuk panduan deploy ke Nginx + Cloudflare + aaPanel.
