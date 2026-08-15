# KelolaDKM — Masjid Jami Nurul Iman

Platform digital terpadu untuk manajemen masjid (KelolaDKM) dan portal jamaah
Masjid Jami Nurul Iman, Pejaten Timur, Jakarta Selatan.

Ini adalah **monorepo** yang memuat frontend dan backend KelolaDKM.

## Struktur

```
.
├── .github/workflows/ci.yml   # CI (lint, test, build) frontend + backend
├── PRD-KelolaDKM.md           # Spesifikasi produk
├── keloladkm/                 # Frontend — React 19 + Vite + Tailwind 4 (SPA/PWA)
└── keloladkm-api/             # Backend — Laravel 13 REST API (Sanctum + Spatie)
```

> Proyek **TPQ-Nurul-Rahmanil-Achyar** dikelola di repositori terpisah
> dan sengaja dikecualikan dari repo ini.

## Menjalankan

### Backend (Laravel)

```bash
cd keloladkm-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```

### Frontend (React)

```bash
cd keloladkm
npm install
npm run dev      # http://localhost:3000
```

Frontend memanggil API Laravel sesuai `VITE_API_URL` di `keloladkm/.env`
(default `http://localhost:8000/api`). Tanpa backend, aplikasi berjalan
dalam mode demo/offline (data mock + localStorage).

## Testing & Build

```bash
# Frontend
cd keloladkm && npm run lint && npm test && npm run build

# Backend
cd keloladkm-api && php artisan test
```

## Deployment

Lihat `keloladkm/DEPLOY.md` untuk panduan deploy (Nginx + Cloudflare + aaPanel).
