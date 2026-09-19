# Project Tracking — Aplikasi Bank Sampah Terintegrasi

> **Terakhir diperbarui:** 20 September 2026
> **Metode:** Milestone-based delivery dengan GitHub Issues

---

## Ringkasan Milestone

| Milestone | Nama | Target | Status |
|---|---|---|---|
| M1 | MVP — Core Operations | Minggu 1–6 | 🔲 Belum Dimulai |
| M2 | Finansial & B2B | Minggu 7–10 | 🔲 Belum Dimulai |
| M3 | Integrasi Eksternal | Minggu 11–14 | 🔲 Belum Dimulai |

---

## Milestone 1: MVP — Core Operations

**Target:** Minggu 1–6
**Tujuan:** Membangun fondasi aplikasi yang dapat digunakan untuk operasional dasar bank sampah.

### Deliverables

#### Sprint 1 (Minggu 1–2): Foundation & Database

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 1 | Desain ERD (Entity-Relationship Diagram) lengkap | `database`, `documentation` | — | ⬜ Todo |
| 2 | Implementasi skema database MySQL (migrations) | `database`, `backend` | — | ⬜ Todo |
| 3 | Seed data awal: roles, permissions, waste categories | `database`, `backend` | — | ⬜ Todo |
| 4 | Setup project structure (Express.js, EJS, Tailwind) | `setup`, `backend`, `frontend` | — | ⬜ Todo |
| 5 | Konfigurasi Docker & Docker Compose | `devops`, `setup` | — | ⬜ Todo |
| 6 | Setup CI/CD pipeline (GitHub Actions) | `ci/cd`, `devops` | — | ⬜ Todo |

#### Sprint 2 (Minggu 3–4): Authentication & Core Modules

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 7 | Registrasi nasabah (form + validasi + database) | `auth`, `backend`, `frontend` | — | ⬜ Todo |
| 8 | Login pengguna (email/telepon + password, JWT) | `auth`, `backend` | — | ⬜ Todo |
| 9 | Middleware RBAC (Role-Based Access Control) | `auth`, `backend`, `security` | — | ⬜ Todo |
| 10 | Halaman dashboard per role (Nasabah, Petugas, Admin) | `frontend`, `ui` | — | ⬜ Todo |
| 11 | CRUD Katalog Jenis Sampah & Harga per Kg | `master-data`, `backend`, `frontend` | — | ⬜ Todo |

#### Sprint 3 (Minggu 5–6): Pickup Flow & Validation

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 12 | Form pengajuan pickup request (nasabah) | `pickup`, `backend`, `frontend` | — | ⬜ Todo |
| 13 | Daftar & detail pickup request (nasabah view) | `pickup`, `frontend` | — | ⬜ Todo |
| 14 | Dashboard pickup Admin (approve/reject/assign) | `pickup`, `backend`, `frontend` | — | ⬜ Todo |
| 15 | Input hasil timbangan oleh Petugas (multi-item) | `collection`, `backend`, `frontend` | — | ⬜ Todo |
| 16 | Validasi hasil pengumpulan oleh Admin | `collection`, `backend` | — | ⬜ Todo |
| 17 | State machine: transisi status pickup request | `pickup`, `backend`, `core` | — | ⬜ Todo |
| 18 | Riwayat status (status_history) tracking | `pickup`, `backend` | — | ⬜ Todo |

---

## Milestone 2: Finansial & B2B

**Target:** Minggu 7–10
**Tujuan:** Mengimplementasikan sistem keuangan (wallet) dan modul penjualan ke buyer.

### Deliverables

#### Sprint 4 (Minggu 7–8): Wallet & Transactions

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 19 | Implementasi tabel wallet & wallet_transactions | `wallet`, `database`, `backend` | — | ⬜ Todo |
| 20 | Logika kalkulasi saldo otomatis (post-validation credit) | `wallet`, `backend`, `core` | — | ⬜ Todo |
| 21 | Halaman saldo & riwayat transaksi nasabah | `wallet`, `frontend` | — | ⬜ Todo |
| 22 | Pengajuan penarikan saldo (withdrawal request) | `wallet`, `backend`, `frontend` | — | ⬜ Todo |
| 23 | Approval penarikan saldo oleh Admin | `wallet`, `backend` | — | ⬜ Todo |
| 24 | Audit trail untuk semua transaksi finansial | `wallet`, `security`, `backend` | — | ⬜ Todo |

#### Sprint 5 (Minggu 9–10): B2B Sales & Reporting

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 25 | CRUD data buyer/pengepul | `b2b`, `backend`, `frontend` | — | ⬜ Todo |
| 26 | Pencatatan transaksi penjualan ke buyer | `b2b`, `backend`, `frontend` | — | ⬜ Todo |
| 27 | Dashboard laporan operasional (Admin) | `reporting`, `frontend` | — | ⬜ Todo |
| 28 | Export laporan PDF/Excel (mutasi, operasional) | `reporting`, `backend` | — | ⬜ Todo |
| 29 | Laporan penjualan periodik ke buyer | `b2b`, `reporting` | — | ⬜ Todo |

---

## Milestone 3: Integrasi Eksternal

**Target:** Minggu 11–14
**Tujuan:** Mengintegrasikan layanan pihak ketiga untuk notifikasi, pembayaran, dan peta.

### Deliverables

#### Sprint 6 (Minggu 11–12): Notifications & Payment

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 30 | Webhook notifikasi email (SMTP/Nodemailer) | `notification`, `backend`, `integration` | — | ⬜ Todo |
| 31 | Webhook notifikasi WhatsApp (API integration) | `notification`, `backend`, `integration` | — | ⬜ Todo |
| 32 | Integrasi Payment Gateway (Midtrans/Xendit) | `payment`, `backend`, `integration` | — | ⬜ Todo |
| 33 | Callback handler untuk konfirmasi pembayaran | `payment`, `backend` | — | ⬜ Todo |
| 34 | Notifikasi real-time perubahan status pickup | `notification`, `frontend` | — | ⬜ Todo |

#### Sprint 7 (Minggu 13–14): Maps, Polish & Launch

| # | Issue Title | Label | Assignee | Status |
|---|---|---|---|---|
| 35 | Integrasi Google Maps API (lokasi pickup) | `maps`, `frontend`, `integration` | — | ⬜ Todo |
| 36 | Geocoding alamat nasabah ke koordinat | `maps`, `backend` | — | ⬜ Todo |
| 37 | Optimisasi performa (query, caching, lazy load) | `performance`, `backend` | — | ⬜ Todo |
| 38 | Security hardening (rate limiting, CORS, helmet) | `security`, `backend` | — | ⬜ Todo |
| 39 | User Acceptance Testing (UAT) | `testing`, `qa` | — | ⬜ Todo |
| 40 | Dokumentasi API (Swagger/OpenAPI) | `documentation` | — | ⬜ Todo |
| 41 | Deployment ke production VPS | `devops`, `deployment` | — | ⬜ Todo |

---

## Label Reference

| Label | Warna | Deskripsi |
|---|---|---|
| `backend` | 🔵 `#0075ca` | Perubahan di sisi server (Express, API) |
| `frontend` | 🟣 `#7057ff` | Perubahan di sisi UI (EJS, CSS, JS) |
| `database` | 🟠 `#e4e669` | Skema database, migrations, seeds |
| `auth` | 🔴 `#d73a4a` | Autentikasi & otorisasi |
| `pickup` | 🟢 `#0e8a16` | Modul pengajuan pickup |
| `collection` | 🟤 `#c2e0c6` | Modul pengumpulan & timbangan |
| `wallet` | 🟡 `#fbca04` | Modul wallet & transaksi |
| `b2b` | 🟦 `#1d76db` | Modul penjualan ke buyer |
| `notification` | 🟪 `#5319e7` | Email, WhatsApp, push notification |
| `payment` | 💰 `#bfd4f2` | Payment gateway integration |
| `maps` | 🗺️ `#c5def5` | Google Maps & GPS |
| `reporting` | 📊 `#d4c5f9` | Laporan & export |
| `devops` | ⚙️ `#006b75` | CI/CD, Docker, deployment |
| `security` | 🔒 `#b60205` | Keamanan & audit |
| `documentation` | 📝 `#0075ca` | Dokumentasi |
| `bug` | 🐛 `#d73a4a` | Bug report |
| `enhancement` | ✨ `#a2eeef` | Feature request |
| `testing` | 🧪 `#e99695` | Testing & QA |

---

## Velocity & Progress Tracking

```
Milestone 1 (MVP)        [░░░░░░░░░░░░░░░░░░░░]  0/18 issues  (0%)
Milestone 2 (Finansial)  [░░░░░░░░░░░░░░░░░░░░]  0/11 issues  (0%)
Milestone 3 (Integrasi)  [░░░░░░░░░░░░░░░░░░░░]  0/12 issues  (0%)
────────────────────────────────────────────────────────────────────
Total                    [░░░░░░░░░░░░░░░░░░░░]  0/41 issues  (0%)
```

---

## Catatan

- Setiap issue harus memiliki acceptance criteria yang jelas sebelum dikerjakan.
- Pull Request harus mereferensikan nomor issue (contoh: `Closes #12`).
- Review wajib dilakukan sebelum merge ke `staging` atau `main`.
- Estimasi effort menggunakan skala Story Points: 1 (XS), 2 (S), 3 (M), 5 (L), 8 (XL).
