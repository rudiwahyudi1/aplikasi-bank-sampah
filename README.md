# ♻️ Aplikasi Bank Sampah Terintegrasi

Sistem Informasi Pengelolaan Bank Sampah Terintegrasi adalah platform berbasis web yang dirancang untuk mendigitalisasi proses pengumpulan sampah dari nasabah rumah tangga, penimbangan aktual oleh petugas lapangan, verifikasi oleh admin gudang, hingga konversi nilai sampah menjadi saldo dompet digital (wallet).

## 🚀 Fitur Utama (Minimum Viable Product)

- **Manajemen Pengguna (RBAC):** Akses khusus untuk 4 peran utama (Nasabah, Petugas Lapangan, Admin Pengelola, dan Super Admin).
- **Pengajuan Penjemputan (Pickup):** Nasabah dapat meminta penjemputan sampah berdasarkan kategori (Organik, Anorganik, Daur Ulang, B3).
- **Pencatatan Lapangan:** Petugas dapat melihat daftar tugas, menginput berat aktual hasil timbangan, dan mengunggah foto bukti.
- **Validasi Satu Pintu:** Admin pengelola melakukan verifikasi terhadap hasil timbangan sebelum dikonversi menjadi saldo.
- **Dompet Digital (Wallet):** Pencatatan otomatis saldo nasabah berdasarkan perhitungan berat aktual dikali harga satuan sampah.

## 🛠️ Teknologi yang Digunakan

- **Backend:** Node.js (v20 LTS), Express.js (REST API)
- **Frontend:** EJS (Template Engine), JavaScript, CSS (Tailwind CSS)
- **Database:** MySQL 8.x
- **Infrastruktur & DevOps:** Docker, Docker Compose, GitHub Actions (CI/CD)

## 📋 Persyaratan Sistem (Prerequisites)

Sebelum menjalankan proyek ini di mesin lokal Anda, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi 20.x direkomendasikan)
- [MySQL](https://www.mysql.com/) atau [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## ⚙️ Instalasi & Menjalankan Proyek Lokal

1. **Clone Repositori**
   ```bash
   git clone [https://github.com/rudiwahyudi1/aplikasi-bank-sampah.git](https://github.com/rudiwahyudi1/aplikasi-bank-sampah.git)
   cd aplikasi-bank-sampah

```

2. **Instal Dependensi**
```bash
npm install

```


3. **Konfigurasi Environment**
Duplikat file `.env.example` menjadi `.env` dan sesuaikan nilainya dengan konfigurasi lokal Anda.
```bash
cp .env.example .env

```


4. **Setup Database**
Pastikan MySQL berjalan, lalu jalankan perintah migrasi dan seeding (jika tersedia):
```bash
npm run db:migrate
npm run db:seed

```


5. **Jalankan Aplikasi (Development Mode)**
```bash
npm run dev

```


Aplikasi dapat diakses melalui browser di `http://localhost:3000` (atau port lain sesuai konfigurasi `.env`).

## 🐳 Menjalankan dengan Docker (Opsional)

Jika Anda tidak ingin menginstal Node.js dan MySQL secara manual di sistem utama, Anda dapat menjalankan seluruh layanan (Aplikasi + Database) menggunakan Docker Compose:

```bash
docker compose up -d --build

```

Untuk menghentikan layanan:

```bash
docker compose down

```

## 🔄 Alur Git & Konvensi Commit

Proyek ini menggunakan **Conventional Commits** untuk penamaan pesan commit. Harap ikuti format berikut saat melakukan push kode:

* `feat(scope): deskripsi fitur` (Menambahkan fitur baru)
* `fix(scope): deskripsi perbaikan` (Memperbaiki bug)
* `chore(scope): deskripsi tugas` (Pembaruan dependensi, CI/CD, dll)
* `docs(scope): deskripsi dokumen` (Perubahan pada file dokumentasi/README)

**Contoh:**
`feat(pickup): menambahkan form pengajuan jemput sampah untuk nasabah`

## 📁 Struktur Direktori Utama

```text
aplikasi-bank-sampah/
├── .github/              # Konfigurasi GitHub Actions & Issue Templates
├── docs/                 # Dokumentasi Proyek (BRD, Checklist, dll)
├── src/                  # Source code utama aplikasi
│   ├── app.js            # Inisialisasi Express & Middleware
│   ├── server.js         # Entry point server aplikasi
│   ├── controllers/      # Logika pemrosesan request HTTP
│   ├── models/           # Definisi skema dan query database
│   ├── routes/           # Definisi endpoint (REST API)
│   ├── views/            # File EJS untuk tampilan antarmuka
├── public/               # File statis (CSS, JS Client, Gambar, dll)
├── tests/                # Unit test dan Integration test
├── .env.example          # Template environment variables
├── docker-compose.yml    # Konfigurasi orkestrasi container
├── Dockerfile            # Konfigurasi pembuatan image aplikasi
└── package.json          # Metadata proyek dan dependensi

```

## 📄 Lisensi

Proyek ini bersifat tertutup (Proprietary) untuk kebutuhan operasional Bank Sampah. Dilarang menyalin, mendistribusikan, atau menggunakan ulang kode tanpa izin tertulis dari pemilik proyek.

```

```