# ♻️ Aplikasi Bank Sampah Terintegrasi

Sistem Informasi Pengelolaan Bank Sampah Terintegrasi adalah platform digital berbasis web & mobile yang dirancang untuk mendigitalisasi proses pengumpulan sampah dari nasabah rumah tangga, penimbangan aktual oleh petugas lapangan, verifikasi oleh admin gudang, hingga konversi nilai sampah menjadi saldo dompet digital (wallet).

---

## 🚀 Fitur Utama (Minimum Viable Product)

- **Manajemen Pengguna (RBAC):** Akses khusus untuk 4 peran utama (Nasabah, Petugas Lapangan, Admin Pengelola, dan Super Admin).
- **Pengajuan Penjemputan (Pickup):** Nasabah dapat meminta penjemputan sampah berdasarkan kategori (Organik, Anorganik, Daur Ulang, B3).
- **Pencatatan Lapangan:** Petugas dapat melihat daftar tugas, menginput berat aktual hasil timbangan, dan mengunggah foto bukti.
- **Validasi Satu Pintu:** Admin pengelola melakukan verifikasi terhadap hasil timbangan sebelum dikonversi menjadi saldo.
- **Dompet Digital (Wallet):** Pencatatan otomatis saldo nasabah berdasarkan perhitungan berat aktual dikali harga satuan sampah.

---

## 🛠️ Teknologi & Arsitektur Utama

- **Backend:** Node.js (v20 LTS), Express.js (REST API)
- **Frontend Web:** EJS Template Engine / JavaScript / Tailwind CSS
- **Frontend Mobile:** React Native / Flutter (Mobile Client Workspace)
- **Database:** MySQL 8.x
- **Infrastruktur & DevSecOps:** Docker, Docker Compose, Nginx, Kubernetes, GitHub Actions (CI/CD)

---

## 🔄 5-Stage DevSecOps CI/CD Pipeline

Proyek ini dilengkapi dengan pipeline otomatis GitHub Actions yang menerapkan praktik **DevSecOps** 5-Tahap:

1. 🔐 **Security Scanning Stage:**
   - **Gitleaks**: Deteksi dini kebocoran secret / API keys dalam repositori.
   - **Trivy (FS Scan)**: Scanning kerentanan file system & dependency packages.
2. 🧱 **Infrastructure Validation Stage:**
   - **Docker Compose**: Uji sintaks & skema file `docker-compose.yml`.
   - **Nginx Syntax**: Uji validasi sintaks reverse proxy (`nginx -t`).
3. 🧪 **Testing Stage:**
   - **Jest Unit & Integration Test**: Menjalankan pengujian otomatis Express.js dengan kontainer database MySQL 8.0.
   - Upload artifact laporan cakupan kode (*coverage report*).
4. 🐳 **Build & Push Stage:**
   - Multi-stage Docker image build.
   - Container Image Scanning menggunakan **Trivy**.
   - Push image ke **GitHub Container Registry (GHCR)**.
5. ☸️ **Deployment Stage:**
   - Verifikasi & uji jalan (*client-side dry-run*) manifest Kubernetes menggunakan `kubectl` dan `kustomize`.

---

## 📋 Persyaratan Sistem (Prerequisites)

Sebelum menjalankan proyek ini di mesin lokal Anda, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi 20.x direkomendasikan)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## ⚙️ Instalasi & Menjalankan Proyek Lokal

1. **Clone Repositori**
   ```bash
   git clone https://github.com/rudiwahyudi1/aplikasi-bank-sampah.git
   cd aplikasi-bank-sampah
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Duplikat file `.env.example` menjadi `.env` dan sesuaikan nilainya dengan konfigurasi lokal Anda:
   ```bash
   cp .env.example .env
   ```

4. **Setup Database**
   Pastikan MySQL berjalan, lalu jalankan perintah migrasi dan seeding:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Jalankan Aplikasi (Development Mode)**
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui browser di `http://localhost:3000`.

---

## 🐳 Menjalankan dengan Docker Compose

Anda dapat menjalankan seluruh stack aplikasi (Node.js + MySQL + Nginx) menggunakan Docker Compose:

```bash
docker compose up -d --build
```

Untuk menghentikan layanan:

```bash
docker compose down
```

---

## 📁 Struktur Direktori Utama

```text
aplikasi-bank-sampah/
├── .github/              # Konfigurasi 5-Stage DevSecOps Pipeline GitHub Actions
│   └── workflows/
│       └── main.yml      # CI/CD Pipeline workflow definition
├── backend/              # Modul & microservices Backend
├── frontend/             # Modul antarmuka klien
│   ├── web/              # Aplikasi Web Frontend
│   └── mobile/           # Aplikasi Mobile Frontend (Android/iOS)
├── k8s/                  # Kubernetes Manifests (Deployment, Service, ConfigMap, Kustomize)
├── nginx/                # Konfigurasi Reverse Proxy Nginx (nginx.conf, conf.d)
├── docs/                 # Dokumentasi Proyek (BRD, Architecture, Checklist)
├── src/                  # Source code utama aplikasi Express.js
│   ├── app.js            # Inisialisasi Express & Middleware
│   ├── server.js         # Entry point server aplikasi
│   ├── controllers/      # Logika pemrosesan request HTTP
│   ├── models/           # Definisi skema dan query database
│   ├── routes/           # Definisi endpoint (REST API)
│   └── views/            # File EJS untuk tampilan antarmuka
├── public/               # File statis (CSS, JS Client, Gambar)
├── tests/                # Unit test dan Integration test (Jest)
├── .env.example          # Template environment variables
├── docker-compose.yml    # Konfigurasi orkestrasi container
├── Dockerfile            # Multi-stage Dockerfile
└── package.json          # Metadata proyek dan dependensi
```

---

## 📄 Lisensi

Proyek ini bersifat tertutup (Proprietary) untuk kebutuhan operasional Bank Sampah. Dilarang menyalin, mendistribusikan, atau menggunakan ulang kode tanpa izin tertulis dari pemilik proyek.