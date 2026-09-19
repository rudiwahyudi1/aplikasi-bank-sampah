# Business Requirement Document (BRD)

## Aplikasi Bank Sampah Terintegrasi

| Informasi Dokumen | Detail |
|---|---|
| **Versi Dokumen** | 1.0.0 |
| **Tanggal** | 20 September 2026 |
| **Status** | Draft |
| **Penulis** | Tim Engineering |

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Tujuan Bisnis](#2-tujuan-bisnis)
3. [Ruang Lingkup Sistem](#3-ruang-lingkup-sistem)
4. [Aktor & Hak Akses](#4-aktor--hak-akses)
5. [Alur Bisnis Utama](#5-alur-bisnis-utama)
6. [Manajemen State (Status Pengajuan)](#6-manajemen-state-status-pengajuan)
7. [Fitur Fungsional](#7-fitur-fungsional)
8. [Persyaratan Non-Fungsional](#8-persyaratan-non-fungsional)
9. [Arsitektur Teknis](#9-arsitektur-teknis)
10. [Asumsi & Batasan](#10-asumsi--batasan)
11. [Lampiran](#11-lampiran)

---

## 1. Ringkasan Eksekutif

Aplikasi Bank Sampah Terintegrasi adalah platform digital berbasis web yang dirancang untuk mengelola seluruh rantai nilai (value chain) pengelolaan sampah — mulai dari pengajuan pengumpulan oleh nasabah, proses penimbangan dan validasi oleh petugas, hingga pencatatan transaksi finansial (wallet/saldo) dan penjualan sampah ke buyer/pengepul.

Sistem ini menggantikan proses manual pencatatan buku tabungan sampah dengan digitalisasi penuh, memberikan transparansi, akuntabilitas, dan efisiensi operasional bagi seluruh pemangku kepentingan.

---

## 2. Tujuan Bisnis

| # | Tujuan | Indikator Keberhasilan (KPI) |
|---|---|---|
| 1 | Digitalisasi operasional bank sampah | 100% transaksi tercatat digital dalam 3 bulan |
| 2 | Meningkatkan partisipasi nasabah | Pertumbuhan nasabah aktif 20% per kuartal |
| 3 | Transparansi keuangan | Laporan real-time dapat diakses seluruh aktor terkait |
| 4 | Mempercepat proses pengumpulan | Waktu rata-rata pickup berkurang 40% |
| 5 | Membangun ekosistem B2B penjualan sampah | Minimal 3 buyer terintegrasi di kuartal pertama |

---

## 3. Ruang Lingkup Sistem

### 3.1 Dalam Ruang Lingkup (In Scope)

- Registrasi dan autentikasi multi-role pengguna
- Pengajuan dan manajemen pickup request
- Penimbangan dan pencatatan hasil pengumpulan
- Validasi administratif atas transaksi pengumpulan
- Sistem wallet/saldo digital nasabah
- Manajemen katalog jenis sampah dan harga per kilogram
- Transaksi penjualan sampah ke buyer
- Dashboard dan laporan per role
- Notifikasi via email dan WhatsApp

### 3.2 Di Luar Ruang Lingkup (Out of Scope)

- Aplikasi mobile native (fase berikutnya)
- Integrasi langsung ke sistem perbankan
- Pengelolaan armada/kendaraan pengumpulan
- Fitur gamifikasi dan reward point

---

## 4. Aktor & Hak Akses

### 4.1 Definisi Aktor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HIERARKI AKTOR SISTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐                                                         │
│   │ Super Admin   │ ← Pengelolaan sistem secara keseluruhan                │
│   └──────┬───────┘                                                         │
│          │                                                                  │
│   ┌──────▼───────┐                                                         │
│   │ Admin        │ ← Validasi transaksi & manajemen operasional            │
│   │ Pengelola    │                                                         │
│   └──────┬───────┘                                                         │
│          │                                                                  │
│   ┌──────▼───────┐                                                         │
│   │ Petugas      │ ← Pengumpulan lapangan, timbang, input data            │
│   │ Pengumpulan  │                                                         │
│   └──────┬───────┘                                                         │
│          │                                                                  │
│   ┌──────▼───────┐                                                         │
│   │ Nasabah      │ ← Penyetor sampah, pemilik saldo                      │
│   └──────────────┘                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Matriks Hak Akses (RBAC)

| Fitur / Modul | Nasabah | Petugas Pengumpulan | Admin Pengelola | Super Admin |
|---|:---:|:---:|:---:|:---:|
| Registrasi & Login | ✅ | ✅ | ✅ | ✅ |
| Ajukan Pickup Request | ✅ (Create) | ❌ | ❌ | ❌ |
| Lihat Pickup Request Sendiri | ✅ (Read) | ❌ | ❌ | ❌ |
| Batalkan Pickup Request | ✅ (Own) | ❌ | ❌ | ❌ |
| Terima/Tolak Pickup Request | ❌ | ❌ | ✅ | ✅ |
| Lihat Daftar Pickup Terjadwal | ❌ | ✅ (Assigned) | ✅ (All) | ✅ (All) |
| Input Hasil Timbangan | ❌ | ✅ | ❌ | ❌ |
| Validasi Hasil Pengumpulan | ❌ | ❌ | ✅ | ✅ |
| Lihat Saldo Wallet | ✅ (Own) | ❌ | ✅ (All) | ✅ (All) |
| Ajukan Penarikan Saldo | ✅ (Own) | ❌ | ❌ | ❌ |
| Proses Penarikan Saldo | ❌ | ❌ | ✅ | ✅ |
| Kelola Katalog Sampah & Harga | ❌ | ❌ | ✅ | ✅ |
| Kelola Transaksi Penjualan (Buyer) | ❌ | ❌ | ✅ | ✅ |
| Kelola Data Pengguna | ❌ | ❌ | ❌ | ✅ |
| Kelola Data Petugas | ❌ | ❌ | ❌ | ✅ |
| Kelola Role & Permission | ❌ | ❌ | ❌ | ✅ |
| Lihat Dashboard & Laporan | ✅ (Own) | ✅ (Own) | ✅ (All) | ✅ (All) |
| Export Laporan (PDF/Excel) | ❌ | ❌ | ✅ | ✅ |
| Konfigurasi Sistem | ❌ | ❌ | ❌ | ✅ |
| Lihat Audit Log | ❌ | ❌ | ✅ (Read) | ✅ (Full) |

---

## 5. Alur Bisnis Utama

### 5.1 Alur Pengajuan Pickup (Core Business Flow)

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐     ┌─────────────┐
│ NASABAH  │     │ ADMIN         │     │ PETUGAS      │     │ SISTEM      │
│          │     │ PENGELOLA     │     │ PENGUMPULAN  │     │             │
└────┬─────┘     └───────┬───────┘     └──────┬───────┘     └──────┬──────┘
     │                   │                    │                     │
     │ 1. Ajukan Pickup  │                    │                     │
     │   Request         │                    │                     │
     │──────────────────►│                    │                     │
     │                   │                    │                     │
     │                   │ 2. Notifikasi      │                     │
     │                   │   masuk            │                     │
     │                   │◄───────────────────┤────────────────────►│
     │                   │                    │  (auto-notify)      │
     │                   │                    │                     │
     │                   │ 3. Review &        │                     │
     │                   │   Approve/Reject   │                     │
     │                   │───────────────────►│                     │
     │                   │                    │                     │
     │ 4. Notifikasi     │                    │                     │
     │   status          │                    │                     │
     │◄──────────────────┤                    │                     │
     │                   │                    │                     │
     │                   │                    │ 5. Kunjungi lokasi  │
     │                   │                    │    nasabah          │
     │◄───────────────────────────────────────┤                     │
     │                   │                    │                     │
     │                   │                    │ 6. Timbang sampah   │
     │                   │                    │    & input data     │
     │                   │                    │    (jenis, berat)   │
     │                   │                    │────────────────────►│
     │                   │                    │                     │
     │                   │ 7. Validasi hasil  │                     │
     │                   │    pengumpulan     │                     │
     │                   │◄────────────────────────────────────────│
     │                   │                    │                     │
     │                   │ 8. Approve/Revisi  │                     │
     │                   │    hasil timbangan │                     │
     │                   │────────────────────────────────────────►│
     │                   │                    │                     │
     │                   │                    │                     │ 9. Hitung nilai
     │                   │                    │                     │    berdasar harga/kg
     │                   │                    │                     │
     │ 10. Wallet        │                    │                     │ 10. Catat transaksi
     │     terupdate     │                    │                     │     wallet/saldo
     │◄──────────────────┤────────────────────┤────────────────────│
     │                   │                    │                     │
```

### 5.2 Alur Penarikan Saldo (Withdrawal)

```
┌──────────┐           ┌───────────────┐           ┌─────────────┐
│ NASABAH  │           │ ADMIN         │           │ SISTEM      │
│          │           │ PENGELOLA     │           │             │
└────┬─────┘           └───────┬───────┘           └──────┬──────┘
     │                         │                          │
     │ 1. Ajukan penarikan     │                          │
     │    saldo (jumlah)       │                          │
     │────────────────────────►│                          │
     │                         │                          │
     │                         │ 2. Verifikasi saldo      │
     │                         │    cukup                 │
     │                         │─────────────────────────►│
     │                         │                          │
     │                         │ 3. Approve/Reject        │
     │                         │    penarikan             │
     │                         │─────────────────────────►│
     │                         │                          │
     │                         │                          │ 4. Potong saldo
     │                         │                          │    & catat transaksi
     │                         │                          │
     │ 5. Notifikasi           │                          │
     │    penarikan berhasil   │                          │
     │◄────────────────────────┤──────────────────────────│
     │                         │                          │
```

### 5.3 Alur Penjualan ke Buyer (B2B)

```
┌───────────────┐           ┌─────────────────┐           ┌─────────────┐
│ ADMIN         │           │ BUYER           │           │ SISTEM      │
│ PENGELOLA     │           │ (Eksternal)     │           │             │
└───────┬───────┘           └────────┬────────┘           └──────┬──────┘
        │                            │                           │
        │ 1. Buat transaksi          │                           │
        │    penjualan               │                           │
        │───────────────────────────────────────────────────────►│
        │                            │                           │
        │                            │                           │ 2. Catat volume,
        │                            │                           │    harga, buyer
        │                            │                           │
        │ 3. Generate invoice        │                           │
        │◄───────────────────────────────────────────────────────│
        │                            │                           │
        │ 4. Kirim invoice           │                           │
        │───────────────────────────►│                           │
        │                            │                           │
        │                            │ 5. Konfirmasi pembayaran  │
        │                            │──────────────────────────►│
        │                            │                           │
        │                            │                           │ 6. Update status
        │                            │                           │    transaksi
        │                            │                           │
```

---

## 6. Manajemen State (Status Pengajuan)

### 6.1 Diagram Transisi Status — Pickup Request

```
                         ┌─────────────────────────────────────┐
                         │          STATUS LIFECYCLE            │
                         └─────────────────────────────────────┘

   ┌─────────┐      Approve      ┌──────────┐     Assign       ┌────────────┐
   │         │ ──────────────►   │          │ ──────────────►  │            │
   │ PENDING │                   │ APPROVED │                  │ ON PROCESS │
   │         │                   │          │                  │            │
   └────┬────┘                   └──────────┘                  └─────┬──────┘
        │                                                            │
        │  Reject/Cancel                                   Complete  │
        │                                                            │
        ▼                                                            ▼
   ┌──────────────┐                                        ┌───────────┐
   │  REJECTED /  │                                        │ COMPLETED │
   │  CANCELLED   │                                        │           │
   └──────────────┘                                        └───────────┘
```

### 6.2 Aturan Transisi Mutlak

| Dari | Ke | Syarat | Aktor yang Berhak |
|---|---|---|---|
| — | `PENDING` | Nasabah mengajukan pickup request | Nasabah |
| `PENDING` | `APPROVED` | Admin menyetujui pickup request | Admin Pengelola |
| `PENDING` | `REJECTED` | Admin menolak pickup request (alasan wajib diisi) | Admin Pengelola |
| `PENDING` | `CANCELLED` | Nasabah membatalkan pengajuan sendiri | Nasabah |
| `APPROVED` | `ON_PROCESS` | Petugas menerima tugas dan mulai menuju lokasi | Petugas Pengumpulan |
| `ON_PROCESS` | `COMPLETED` | Admin memvalidasi hasil timbangan dari petugas | Admin Pengelola |
| `ON_PROCESS` | `REJECTED` | Admin menolak hasil timbangan (data tidak valid) | Admin Pengelola |

### 6.3 Constraint & Validasi

> **Aturan Integritas Transisi:**
>
> - Status **TIDAK BOLEH** mundur ke state sebelumnya (irreversible, kecuali rejection).
> - Status `COMPLETED` dan `REJECTED/CANCELLED` bersifat **terminal** — tidak dapat diubah lagi.
> - Setiap perubahan status **WAJIB** dicatat di tabel `status_history` dengan timestamp dan `user_id` pelaku.
> - Nasabah hanya dapat membatalkan pada status `PENDING`. Setelah `APPROVED`, pembatalan memerlukan persetujuan Admin.
> - Transisi status wajib memicu event notifikasi ke semua aktor terkait.

---

## 7. Fitur Fungsional

### 7.1 Modul Autentikasi & Otorisasi

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| AUTH-001 | Registrasi nasabah (nama, email, telepon, alamat, password) | P0 — MVP |
| AUTH-002 | Login dengan email/telepon + password | P0 — MVP |
| AUTH-003 | JWT-based session management dengan refresh token | P0 — MVP |
| AUTH-004 | Role-Based Access Control (RBAC) middleware | P0 — MVP |
| AUTH-005 | Reset password via email | P1 |
| AUTH-006 | Verifikasi email/telepon | P1 |

### 7.2 Modul Pickup Request

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| PKP-001 | Form pengajuan pickup (jenis sampah, estimasi berat, alamat, jadwal) | P0 — MVP |
| PKP-002 | Daftar pickup request nasabah (filter status) | P0 — MVP |
| PKP-003 | Pembatalan pickup oleh nasabah (status PENDING) | P0 — MVP |
| PKP-004 | Dashboard pickup untuk Admin (approve/reject) | P0 — MVP |
| PKP-005 | Assign petugas ke pickup request | P0 — MVP |
| PKP-006 | Notifikasi perubahan status ke nasabah | P1 |
| PKP-007 | Lokasi pickup pada peta (Google Maps embed) | P2 |

### 7.3 Modul Pengumpulan & Timbangan

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| TBG-001 | Daftar tugas pickup untuk petugas (hari ini) | P0 — MVP |
| TBG-002 | Input hasil timbangan (multi-item: jenis + berat aktual) | P0 — MVP |
| TBG-003 | Upload foto bukti timbangan | P1 |
| TBG-004 | Validasi hasil timbangan oleh Admin | P0 — MVP |
| TBG-005 | Riwayat pengumpulan per petugas | P1 |

### 7.4 Modul Wallet & Transaksi Finansial

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| WLT-001 | Saldo wallet nasabah (otomatis bertambah setelah validasi) | P1 |
| WLT-002 | Riwayat transaksi wallet (credit/debit) | P1 |
| WLT-003 | Pengajuan penarikan saldo (withdrawal request) | P1 |
| WLT-004 | Persetujuan penarikan oleh Admin | P1 |
| WLT-005 | Export mutasi saldo (PDF/Excel) | P2 |

### 7.5 Modul Penjualan ke Buyer (B2B)

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| B2B-001 | Manajemen data buyer/pengepul | P1 |
| B2B-002 | Pencatatan transaksi penjualan (jenis, volume, harga, buyer) | P1 |
| B2B-003 | Generate invoice penjualan | P2 |
| B2B-004 | Laporan penjualan periodik | P2 |

### 7.6 Modul Master Data

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| MST-001 | Katalog jenis sampah (organik, anorganik, B3, dll.) | P0 — MVP |
| MST-002 | Harga per kilogram per jenis sampah | P0 — MVP |
| MST-003 | Riwayat perubahan harga | P1 |
| MST-004 | Manajemen area/wilayah operasional | P2 |

### 7.7 Modul Dashboard & Laporan

| Kode Fitur | Deskripsi | Prioritas |
|---|---|---|
| RPT-001 | Dashboard Admin (total sampah, pendapatan, nasabah aktif) | P1 |
| RPT-002 | Dashboard Nasabah (saldo, riwayat setoran) | P0 — MVP |
| RPT-003 | Laporan harian/bulanan operasional | P1 |
| RPT-004 | Export laporan PDF/Excel | P2 |

---

## 8. Persyaratan Non-Fungsional

| Aspek | Requirement | Target |
|---|---|---|
| **Performa** | Response time API < 500ms untuk 95th percentile | P95 < 500ms |
| **Ketersediaan** | Uptime minimal 99.5% (bulanan) | 99.5% SLA |
| **Keamanan** | Password hashing (bcrypt), JWT auth, HTTPS, input validation, SQL injection prevention | Comply OWASP Top 10 |
| **Skalabilitas** | Mendukung hingga 10.000 nasabah aktif | Horizontal scaling ready |
| **Data Integrity** | ACID transactions pada operasi finansial (wallet) | Zero data loss |
| **Audit Trail** | Setiap perubahan data kritis dicatat dengan timestamp & pelaku | Full audit log |
| **Backup** | Database backup otomatis harian, retensi 30 hari | Automated daily backup |
| **Responsivitas UI** | Tampilan responsif di perangkat mobile (min. 360px) | Mobile-first design |

---

## 9. Arsitektur Teknis

### 9.1 Stack Teknologi

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│   Browser ──► EJS Templates + Tailwind CSS + JavaScript     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    APPLICATION LAYER                         │
│   Node.js + Express.js (REST API + Server-Side Rendering)   │
│   ├── Middleware: Auth (JWT), RBAC, Validation, Rate Limit  │
│   ├── Controllers: Request handlers                         │
│   ├── Services: Business logic                              │
│   ├── Models: Database abstraction                          │
│   └── Utils: Helpers, mailers, notification service         │
└──────────────────────────┬──────────────────────────────────┘
                           │ TCP/3306
┌──────────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                             │
│   MySQL 8.0 (InnoDB, utf8mb4, relational schema)            │
│   ├── Users, Roles, Permissions                             │
│   ├── Pickup Requests, Status History                       │
│   ├── Waste Categories, Pricing                             │
│   ├── Collections, Collection Items                         │
│   ├── Wallets, Wallet Transactions                          │
│   ├── Sales (B2B), Buyers                                   │
│   └── Audit Logs                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│   Docker + Docker Compose │ Linux VPS │ GitHub Actions CI/CD │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Struktur Direktori Proyek

```
aplikasi-bank-sampah/
├── .github/
│   ├── workflows/main.yml
│   └── ISSUE_TEMPLATE/
├── docs/
│   ├── BRD.md
│   ├── PROJECT_TRACKING.md
│   └── CONTRIBUTING.md
├── src/
│   ├── config/          # Database, app config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, RBAC, validation
│   ├── models/          # Database models
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helpers & utilities
│   ├── database/
│   │   ├── migrations/  # Schema versioning
│   │   ├── seeds/       # Initial data
│   │   └── init/        # Docker init scripts
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── views/               # EJS templates
│   ├── layouts/
│   ├── pages/
│   └── partials/
├── public/              # Static assets
│   ├── css/
│   ├── js/
│   └── images/
├── tests/               # Test suites
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 10. Asumsi & Batasan

### 10.1 Asumsi

1. Nasabah memiliki akses ke perangkat dengan browser modern (Chrome, Firefox, Safari, Edge).
2. Petugas pengumpulan memiliki smartphone untuk mengakses aplikasi di lapangan.
3. Koneksi internet tersedia di area operasional bank sampah.
4. Harga sampah per kilogram ditentukan dan diperbarui secara manual oleh Admin.
5. Satu pickup request dapat mengandung beberapa jenis sampah sekaligus.

### 10.2 Batasan

1. Aplikasi versi awal (MVP) hanya mendukung platform web — belum ada mobile native.
2. Sistem pembayaran/penarikan saldo masih bersifat manual (transfer bank) di fase MVP.
3. Integrasi payment gateway dan GPS tracking ditargetkan untuk milestone selanjutnya.
4. Kapasitas server awal disesuaikan dengan skala 1 unit VPS (vertical scaling).

---

## 11. Lampiran

### 11.1 Glosarium

| Istilah | Definisi |
|---|---|
| **Nasabah** | Pengguna (masyarakat) yang menyetorkan sampah ke bank sampah |
| **Petugas Pengumpulan** | Staf lapangan yang melakukan pickup dan penimbangan sampah |
| **Admin Pengelola** | Pengelola operasional harian bank sampah |
| **Super Admin** | Administrator sistem dengan akses penuh |
| **Buyer / Pengepul** | Pihak ketiga yang membeli sampah dalam volume besar |
| **Pickup Request** | Permintaan pengambilan sampah dari nasabah |
| **Wallet** | Saldo digital nasabah yang mencatat nilai sampah yang telah disetorkan |
| **B2B** | Business-to-Business — transaksi penjualan sampah ke buyer/pengepul |

### 11.2 Referensi

- Dokumen analisis kebutuhan stakeholder (interview)
- Benchmark aplikasi bank sampah sejenis di Indonesia
- OWASP Top 10 Security Guidelines
- Conventional Commits Specification v1.0.0
