# 🚀 Panduan Deploy KelolaDKM — Full-Stack (React + Laravel)

> **Target**: `https://keloladkm.masjidnuruliman-pejaten.or.id`
> **Stack**: React 19 (Vite) + Laravel 13 (PHP 8.3+)
> **Arsitektur**: Cloudflare tunnel → Nginx → reverse proxy → React (static) + Laravel API (`:8000`)
> (Frontend static file diserve Nginx langsung; API `/api/*` reverse-proxy ke PHP-FPM Laravel.)

---

## 🔐 Informasi Server

> ⚠️ **JANGAN simpan kredensial di file ini / repo.** Nilai di bawah hanyalah placeholder.
> Simpan kredensial asli di manajemen secret (Vault, aaPanel Secret, atau env server).

| Item | Value |
|---|---|
| Host | `<SERVER_HOST>` |
| User | `<SERVER_USER>` |
| Password | `<SERVER_PASSWORD>` |
| aaPanel | `<AAPANEL_URL>` (user: `<AAPANEL_USER>`) |
| Frontend path | `/www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm` |
| Backend path | `/www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm-api` |

---

## 📋 Prasyarat

- [ ] Server dengan aaPanel + cloudflared (tunnel route domain → `127.0.0.1:6100`)
- [ ] Database: MySQL/MariaDB atau SQLite (bawaan)
- [ ] **Node.js ≥ 22** (untuk build frontend)
- [ ] **PHP ≥ 8.3** + Composer (untuk backend Laravel)
- [ ] Nginx (terinstall via aaPanel)
- [ ] PM2 opsional — hanya jika frontend di-serve via Node; jika static via Nginx, tidak perlu

---

## Langkah 1 — Clone Repository

```bash
cd /www/wwwroot
mkdir -p keloladkm.masjidnuruliman-pejaten.or.id
cd keloladkm.masjidnuruliman-pejaten.or.id

git clone https://github.com/smoddevzamzami/KelolaDKM.git keloladkm
git clone https://github.com/smoddevzamzami/KelolaDKM-API.git keloladkm-api
```

> Jika belum dipisah reponya, copy folder `keloladkm/` dan `keloladkm-api/` dari development.

---

## Langkah 2 — Backend Laravel Setup

### 2.1 Install dependencies

```bash
cd /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm-api
composer install --no-dev --optimize-autoloader
```

### 2.2 Konfigurasi `.env`

```bash
cp .env.example .env
nano .env
```

```env
APP_NAME="KelolaDKM API"
APP_ENV=production
APP_DEBUG=false
APP_URL="https://keloladkm.masjidnuruliman-pejaten.or.id"

# Pilih salah satu: SQLite (simple) atau MySQL
# ── OPSI A: SQLite (default, tanpa setup tambahan) ──
DB_CONNECTION=sqlite
DB_DATABASE=/www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm-api/database/database.sqlite

# ── OPSI B: MySQL (via aaPanel) ──
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=keloladkm_db
# DB_USERNAME=keloladkm_user
# DB_PASSWORD=<password-dari-aaPanel>

# CORS — sesuaikan dengan domain frontend
FRONTEND_URL="https://keloladkm.masjidnuruliman-pejaten.or.id"
SANCTUM_STATEFUL_DOMAINS="keloladkm.masjidnuruliman-pejaten.or.id"
SESSION_DOMAIN=".masjidnuruliman-pejaten.or.id"
```

### 2.3 Generate key & migrate

```bash
php artisan key:generate
php artisan migrate --force
php artisan db:seed --class=RoleSeeder --force
```

**Verifikasi:**
```bash
php artisan route:list --path=api | head -15
# → 58 routes terdaftar

# Test login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@masjidnuruliman.or.id","password":"<DEFAULT_ADMIN_PASSWORD>"}'
# → {"success":true,"data":{"user":{...},"token":"1|..."}}
```

### 2.4 Jalankan dengan systemd (atau aaPanel Supervisor)

Buat file `/etc/systemd/system/keloladkm-api.service`:

```ini
[Unit]
Description=KelolaDKM Laravel API
After=network.target

[Service]
User=www
Group=www
WorkingDirectory=/www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm-api
ExecStart=/usr/bin/php artisan serve --host=127.0.0.1 --port=8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now keloladkm-api
systemctl status keloladkm-api
```

> **Alternatif via aaPanel**: tambahkan di Website → PHP-8.3 → Running Mode: **PHP-FPM** (Nginx akan forward `/api/*` ke Laravel via PHP-FPM, tanpa `artisan serve`).

---

## Langkah 3 — Frontend Build

### 3.1 Install & build

```bash
cd /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm
npm ci --production=false
```

### 3.2 Konfigurasi `.env`

```bash
nano .env
```

```env
VITE_API_URL=https://keloladkm.masjidnuruliman-pejaten.or.id/api
```

> ⚠️ Saat development: `http://localhost:8000/api`. Saat production: URL publik.

### 3.3 Build production

```bash
npm run build
```

**Verifikasi:**
```bash
ls dist/index.html dist/assets/*.js dist/sw.js dist/manifest.webmanifest
# Semua harus ada
```

---

## Langkah 4 — Nginx Configuration

Buka aaPanel → Websites → tambah site `keloladkm.masjidnuruliman-pejaten.or.id` →
atau langsung edit file config di `/www/server/panel/vhost/nginx/keloladkm.masjidnuruliman-pejaten.or.id.conf`:

```nginx
server {
    listen 127.0.0.1:6100;
    server_name keloladkm.masjidnuruliman-pejaten.or.id;

    root /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
    gzip_min_length 512;

    # Cache static assets (1 year)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # PWA files
    location = /sw.js {
        expires -1;
        add_header Cache-Control "no-cache";
    }
    location = /manifest.webmanifest {
        expires 7d;
        add_header Cache-Control "public";
    }
    location = /registerSW.js {
        expires 7d;
    }

    # API — reverse proxy ke Laravel (PHP-FPM atau artisan serve)
    location /api/ {
        # ── OPSI A: Laravel via artisan serve di port 8000 ──
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        # ── OPSI B: Laravel via PHP-FPM (aaPanel default) ──
        # Ganti blok proxy_pass di atas dengan:
        # include enable-php-83.conf;
        # fastcgi_param SCRIPT_FILENAME /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm-api/public/index.php;
    }

    # SPA fallback — semua request non-file ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

```bash
nginx -t && nginx -s reload
```

---

## Langkah 5 — Verifikasi Akhir

```bash
# Frontend HTML
curl -sI https://keloladkm.masjidnuruliman-pejaten.or.id | grep HTTP
# → HTTP/2 200

# Frontend JS chunk
curl -sI https://keloladkm.masjidnuruliman-pejaten.or.id/assets/index-*.js | grep -E "HTTP|content-type"
# → application/javascript

# API publik (tanpa login)
curl -s https://keloladkm.masjidnuruliman-pejaten.or.id/api/kajian-events | head -c 100
# → {"success":true,"message":"OK","data":{...}}

# API terproteksi (tanpa login → 401)
curl -s -o /dev/null -w "%{http_code}" https://keloladkm.masjidnuruliman-pejaten.or.id/api/financial-transactions
# → 401

# Login
curl -s -X POST https://keloladkm.masjidnuruliman-pejaten.or.id/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@masjidnuruliman.or.id","password":"<DEFAULT_ADMIN_PASSWORD>"}' | head -c 150
# → {"success":true,"data":{"user":{...},"token":"..."}}

# PWA manifest
curl -sI https://keloladkm.masjidnuruliman-pejaten.or.id/manifest.webmanifest | grep content-type
# → application/manifest+json
```

**Browser:**
1. `https://keloladkm.masjidnuruliman-pejaten.or.id` → Website publik
2. Klik "KelolaDKM System" → Dashboard management
3. `https://keloladkm.masjidnuruliman-pejaten.or.id/?tab=dashboard&sub=keuangan` → deep-link ke modul keuangan
4. Install PWA: browser akan prompt "Install app" (via service worker)

---

## 🔄 Update / Redeploy

### Backend (Laravel)
```bash
cd /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm-api
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
systemctl restart keloladkm-api
```

### Frontend (React)
```bash
cd /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/keloladkm
git pull && npm ci --production=false && npm run build
# Nginx membaca dari folder dist/ → tidak perlu restart
```

### Full redeploy (script)
```bash
#!/bin/bash
cd /www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id
cd keloladkm-api && git pull && composer install --no-dev -o && php artisan migrate --force && cd ..
cd keloladkm && git pull && npm ci --production=false && npm run build && cd ..
systemctl restart keloladkm-api
echo "✅ Deploy complete"
```

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---|---|
| 502 Bad Gateway | Cek Laravel: `systemctl status keloladkm-api` atau `curl http://127.0.0.1:8000/api/me` |
| API CORS error | Pastikan `FRONTEND_URL` di `.env` backend = domain frontend |
| Halaman putih / 404 | `npm run build` sudah jalan? Cek `dist/index.html` ada? |
| PWA tidak muncul | Cek `sw.js` bisa diakses via browser → harus `no-cache` |
| Login gagal | User sudah di-seed? `php artisan db:seed --class=RoleSeeder` |
| Data hilang setelah refresh | `localStorage` clear? Cek di DevTools → Application → Local Storage |
| "Mixed Content" error | API URL harus `https://` (bukan `http://`) di `.env` frontend |
| Google Maps tidak muncul | `GOOGLE_MAPS_PLATFORM_KEY` belum di-set di env variable server |
| SQLite permission error | `chmod 775 database/database.sqlite` dan `chown www:www database/ -R` |

---

## 🗂️ Struktur Folder di Server

```
/www/wwwroot/keloladkm.masjidnuruliman-pejaten.or.id/
├── keloladkm/                     # Frontend React
│   ├── dist/                      # Build production (diserve Nginx)
│   ├── .env                       # VITE_API_URL
│   └── ...
└── keloladkm-api/                 # Backend Laravel
    ├── .env                       # DB, APP_URL, CORS
    ├── database/database.sqlite   # SQLite file (jika pakai SQLite)
    ├── public/index.php           # Entry point Laravel
    └── ...
```

---

## 🔐 Keamanan

- [ ] Ganti password default admin: `admin@masjidnuruliman.or.id` → set `DEFAULT_ADMIN_PASSWORD` di `.env` sebelum `db:seed` (atau update via tinker)
- [ ] `.env` backend: set `APP_DEBUG=false`
- [ ] Nginx: tambahkan rate limiting di `/api/login` (5 request/menit per IP)
- [ ] Cloudflare: enable WAF + Bot Fight Mode
- [ ] Backup database otomatis: `./scripts/backup-db.sh` (tambahkan ke cron harian)
- [ ] File ini sudah di `.gitignore` — **JANGAN** commit ke public repo

---

> Ditulis untuk: DKM Masjid Jami Nurul Iman Pejaten Timur
> Stack: React 19 + Laravel 13 + SQLite + Nginx + Cloudflare
> Support: hubungi developer via WhatsApp DKM
