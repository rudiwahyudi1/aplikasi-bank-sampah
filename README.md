# Aplikasi Bank Sampah & Pengelolaan Terintegrasi (ERD Edition)

Sistem Informasi Manajemen Pengelolaan Sampah Terpadu berbasis web modern, responsif (*mobile-friendly*), dan dilengkapi dengan kontrol hak akses berbasis peran (*Role-Based Access Control / RBAC*).

---

## Daftar Isi
1. [Ringkasan Sistem & Arsitektur](#-ringkasan-sistem--arsitektur)
2. [Akun Demo & Kredensial Login](#-akun-demo--kredensial-login)
3. [Panduan Lengkap Peran & Hak Akses (Siapa Bisa Apa?)](#-panduan-lengkap-peran--hak-akses)
   - [1. Super Administrator](#1-super-administrator-superadmin)
   - [2. Admin Pengelola](#2-admin-pengelola-admin_pengelola)
   - [3. Petugas Lapangan / Operator](#3-petugas-lapangan--operator-petugas_pengumpulan)
   - [4. Nasabah / Warga Bank Sampah](#4-nasabah--warga-bank-sampah-nasabah)
4. [Alur Operasional Inti (SOP Siklus Sampah & Tabungan)](#-alur-operasional-inti)
5. [Fitur-Fitur Unggulan Sistem](#-fitur-fitur-unggulan-sistem)
6. [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)

---

## Ringkasan Sistem & Arsitektur

Aplikasi ini mendigitalkan seluruh siklus pengelolaan sampah di lingkungan bank sampah, Tempat Pengolahan Sampah Terpadu (TPST), maupun badan usaha pengelola limbah:
* **Hulu**: Penjemputan (*pickup*) dari rumah tangga / nasabah, penimbangan digital, pencatatan otomatis ke saldo tabungan.
* **Tengah**: Penjadwalan armada, pemilahan, pencacahan, pengomposan mandiri, dan monitoring stok gudang (*inventory*).
* **Hilir**: Penjualan sampah kering/daur ulang ke pabrik rekanan (*buyers*), pencatatan omzet B2B.
* **Sosial & Edukasi**: Penukaran saldo dengan sembako/voucher (*rewards*), edukasi artikel 3R (*education*), **layanan pengaduan & lapor sampah liar (`/complaints`)**, dan live chat konsultasi warga.

---

## Akun Demo & Kredensial Login

Aplikasi menyediakan akun demo bawaan untuk menguji masing-masing tingkat wewenang pengguna:

| Peran (Role) | Username | Password Demo | Hak Akses Utama |
|---|---|---|---|
| **Super Administrator** | `admin` | `admin123` / `password` | Kendali Penuh Seluruh Sistem & Konfigurasi RBAC |
| **Admin Pengelola** | `operator` | `password` | Operasional, Keuangan, Persetujuan, Katalog, & Laporan |
| **Petugas Pengumpulan** | `petugas` | `password` | Lapangan, Penjemputan, Penimbangan, Rute, & Pengolahan |
| **Nasabah (Warga)** | `nasabah` | `nasabah123` / `password` | Mengajukan Pickup, Cek Tabungan, Tarik Saldo, Tukar Sembako |

---

## Panduan Lengkap Peran & Hak Akses

Berikut rincian mendalam mengenai wewenang operasional setiap peran:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SUPER ADMINISTRATOR                           │
│   (Hak Akses Penuh: Konfigurasi RBAC, Manajemen User, Log Audit, All)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│         ADMIN PENGELOLA         │             │        PETUGAS LAPANGAN         │
│ • Validasi Setoran Sampah       │             │ • Eksekusi Penjemputan Armada   │
│ • Verifikasi Tarik Tunai        │             │ • Penimbangan Sampah Lapangan   │
│ • Penjualan ke Pengepul (B2B)   │             │ • Input Pengolahan & Kompos     │
│ • Kelola Jadwal & Wilayah       │             │ • Catat Riwayat Rute Armada     │
│ • Kelola Katalog Reward/Sembako │             │ • Update Muatan Masuk Gudang    │
│ • Kelola Artikel Edukasi 3R     │             │ • Live Chat Layanan Warga       │
│ • Cetak Laporan Keuangan & PDF  │             └─────────────────────────────────┘
└────────────────┬────────────────┘                              ▲
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                        ┌─────────────────────────────────┐
                        │             NASABAH             │
                        │ • Ajukan Permintaan Penjemputan │
                        │ • Cek Saldo Buku Tabungan Sampah│
                        │ • Ajukan Tarik Tunai Rekening   │
                        │ • Tukar Poin dengan Sembako     │
                        │ • Baca Panduan & Artikel 3R     │
                        │ • Chat Bantuan dengan Pengelola │
                        └─────────────────────────────────┘
```

---

### 1. Super Administrator (`superadmin`)
Peran dengan hierarki tertinggi dalam sistem yang bertanggung jawab atas tata kelola pengguna, keamanan, dan integritas data.

#### Apa saja yang bisa dilakukan Superadmin?
1. **Manajemen Pengguna & Keamanan (`/admin/users`)**:
   - Menambahkan akun baru (Admin, Petugas Lapangan, atau Nasabah).
   - Mengedit data profil, mengganti password akun pengguna yang lupa password.
   - Mengubah peran (*role assignment*) pengguna secara dinamis.
   - Mengaktifkan atau menonaktifkan akun yang melanggar ketentuan.
2. **Manajemen Role & Hak Akses Berbasis RBAC (`/admin/rbac`)**:
   - Mengatur izin (*permissions*) untuk setiap peran (misal: menentukan role mana yang boleh menghapus data, melihat laporan, atau mengelola stok).
   - Menambah role kustom baru jika organisasi berkembang.
3. **Audit Trail & Log Aktivitas Sistem (`/activity`)**:
   - Memantau seluruh rekam jejak aktivitas (*who, what, when, IP address*) dari semua pengguna.
   - Memeriksa transaksi berisiko tinggi seperti penarikan dana besar atau penghapusan data.
4. **Akses Penuh Seluruh Modul Operasional**:
   - Memiliki wewenang *override* untuk semua fitur yang dimiliki oleh Admin Pengelola, Petugas, dan Nasabah.
5. **⚙️ Pengaturan Profil Bank Sampah & Konfigurasi Global (`/settings`)**:
   - Mengubah Nama Lembaga Bank Sampah, Alamat Kantor Pusat/Gudang, Nomor WhatsApp CS Resmi, Telepon, dan Email.
   - Menentukan Syarat Minimal Penarikan Tunai (*Min. Withdrawal*) dan Jam Operasional Layanan secara instan dari antarmuka web tanpa menyentuh kode program.

---

### 2. Admin Pengelola (`admin_pengelola`)
Peran manajerial harian yang mengurus kelancaran operasional bank sampah, administrasi keuangan, logistik gudang, dan kemitraan.

#### Apa saja yang bisa dilakukan Admin Pengelola?
1. **Persetujuan & Validasi Penjemputan Sampah (`/collection`)**:
   - Meninjau pengajuan penjemputan dari nasabah.
   - Memverifikasi hasil penimbangan timbangan riil dari petugas lapangan.
   - Menyetujui (*approve*) setoran sampah, yang secara otomatis mengkreditkan saldo Rupiah ke dompet tabungan nasabah.
2. **Keuangan & Verifikasi Tarik Tunai (`/withdrawals` & `/wallet`)**:
   - Memeriksa permohonan tarik tunai dari nasabah (Transfer Bank / E-Wallet DANA, OVO, GoPay).
   - Menyetujui pencairan dana, mengunggah bukti transfer, atau menolak permohonan jika data rekening tidak valid.
   - Melihat mutasi transaksi keuangan dan total perputaran uang kas tabungan.
3. **Kemitraan & Penjualan Sampah B2B (`/sales` & `/buyers`)**:
   - Mencatat kontrak penjualan sampah terpilah ke pabrik daur ulang atau pengepul rekanan.
   - Memilih pembeli rekanan (*buyer*), kuantiti tonase, harga kesepakatan, dan mencetak faktur invoice penjualan.
   - Mendaftarkan dan mengelola direktori profil mitra pembeli.
4. **Kelola Jadwal & Armada Penjemputan (`/schedules`)**:
   - Membuat jadwal rute penjemputan per zona/lingkungan (hari operasional, jam mulai, target kuota kg, driver armada).
   - Mengaktifkan atau menonaktifkan jalur penjemputan.
5. **Layanan Pengaduan & Lapor Sampah Liar (`/complaints`)**:
   - Memantau tiket laporan tumpukan sampah liar yang diajukan oleh warga/nasabah.
   - Meninjau foto & tingkat urgensi (*Darurat*, *Tinggi*, *Normal*).
   - Menugaskan armada petugas kebersihan (*PIC*), menulis catatan penyelesaian lapangan, dan memberikan **bonus poin apresiasi lingkungan** ke dompet nasabah saat laporan tuntas.
6. **Gudang & Stok Sampah Terpilah (`/inventory` & `/processing`)**:
   - Memonitor stok fisik sampah terpilah (Plastik PET, Kertas Kardus, Logam/Aluminium, Organik, Kompos).
   - Mencatat penyesuaian stok manual (*stock adjustment*), susut timbang, atau transfer gudang.
   - Mengawasi proses komposting dan pengolahan limbah organik.
7. **Katalog Hadiah Sembako & Kedaluwarsa (`/rewards`)**:
   - Menambah barang reward baru (Beras, Minyak Goreng, Gula, Token Listrik, Pupuk).
   - Menetapkan harga poin/Rupiah dan jumlah stok fisik.
   - Menetapkan **tanggal kedaluwarsa barang (*expiry date*)** sembako dan mengontrol ketersediaan agar barang kadaluarsa otomatis dicegah dari penukaran nasabah.
   - Memproses klaim penukaran: mengubah status menjadi *Siap Diambil di Kantor* atau *Sudah Diserahkan*.
8. **Pusat Edukasi & Berita 3R (`/education`)**:
   - Menerbitkan artikel panduan edukasi pemilahan sampah mandiri, tips biopori, dan daur ulang.
   - Mengedit isi materi dan menghapus artikel usang.
9. **Ekspor Laporan & Dokumen Resmi (`/reports` & `/documents`)**:
   - Menghasilkan laporan analitik periode bulanan/tahunan (tonase sampah, omzet penjualan, dividen nasabah).
   - Mengunduh laporan dalam format **PDF Resmi** atau **Excel Spreadsheet**.
   - Mengunggah dan mengarsipkan dokumen legalitas MoU, izin lingkungan, dan SOP.
10. **⚙️ Pengaturan Profil Bank Sampah (`/settings`)**:
    - Memperbarui identitas resmi lembaga bank sampah, nomor WhatsApp CS resmi, alamat operasional, dan syarat minimal penarikan tunai tabungan.
11. **🏷️ Papan Harga Sampah & Panduan Sortir Bersih (`/prices`)**:
    - Mengatur harga beli dari warga, harga jual B2B ke pabrik daur ulang, memantau margin keuntungan per kg, memperbarui indikator tren pasar (naik/stabil/turun), dan membagikan daftar harga resmi ke WhatsApp komunitas.
12. **💰 Biaya Operasional & Kas Kecil (`/expenses`)**:
    - Mencatat bukti kas keluar harian pengelola (BBM armada viar/truk, karung goni, tali rafia, servis timbangan, konsumsi petugas) untuk memantau laba bersih bank sampah secara akurat.

---

### 3. Petugas Lapangan / Operator (`petugas_pengumpulan`)
Peran garda terdepan (*frontliner*) yang bertugas di lapangan mengendarai armada penjemputan sampah, menimbang muatan, dan memproses pengolahan di unit TPST/Gudang.

#### Apa saja yang bisa dilakukan Petugas Lapangan?
1. **Penjemputan, Penimbangan & Cetak Struk (`/collection`)**:
   - Melihat daftar tugas penjemputan sampah yang harus diambil hari ini lengkap dengan alamat dan nomor kontak nasabah.
   - **Scanner Kamera QR Code**: Membuka kamera HP untuk scan QR Code pada kartu anggota nasabah secara instan tanpa ketik manual.
   - Melakukan penimbangan di tempat menggunakan timbangan gantung/digital.
   - Menginput berat aktual (Kg) per kategori sampah (Plastik, Kertas, Logam, Organik) langsung dari HP.
   - **Cetak Struk Thermal & Kirim WA**: Mencetak nota timbangan langsung ke printer thermal bluetooth 58mm/80mm atau mengirimkan ringkasan setoran via format WhatsApp resmi ke nomor nasabah.
   - Mengubah status penjemputan menjadi *Selesai Ditimbang* agar siap divalidasi oleh admin.
2. **Pelaksanaan Jadwal & Log Rute Wilayah (`/schedules`)**:
   - Mengecek rute dan zona tugas hari ini beserta target kuota muatan.
   - Mencatat realisasi penjemputan harian (jumlah KK yang berhasil dilayani, total kg muatan terkumpul, dan catatan kondisi lapangan).
3. **Pengolahan & Kompos Mandiri (`/processing`)**:
   - Mencatat proses komposting sampah organik (tahap fermentasi, pembalikan, hingga panen pupuk siap pakai).
   - Mencatat pencacahan sampah plastik (*plastic shredding*) menjadi biji/serpihan daur ulang.
4. **Monitoring Stok Masuk Gudang (`/inventory`)**:
   - Melihat ketersediaan ruang penyimpanan gudang sampah terpilah.
5. **Live Chat Layanan Warga (`/chat`)**:
   - Berkomunikasi langsung dengan nasabah terkait arahan lokasi rumah atau konfirmasi waktu tiba armada pickup.
6. **Cek Standar Harga & Kualitas Pilah (`/prices`)**:
   - Menjadikan acuan harga beli resmi dan spesifikasi kebersihan saat menimbang muatan di lokasi warga.

---

### 4. Nasabah / Warga Bank Sampah (`nasabah`)
Peran pengguna umum (masyarakat, RT/RW, instansi, atau sekolah) yang menyetorkan sampah daur ulang dan menikmati manfaat ekonomi dari tabungan sampah.

#### Apa saja yang bisa dilakukan Nasabah?
1. **Buku Tabungan Digital & Saldo (`/wallet`)**:
   - Memantau saldo tabungan sampah secara transparan dan real-time.
   - Melihat riwayat mutasi: uang masuk dari setoran sampah, uang keluar dari tarik tunai, atau debit penukaran sembako.
2. **Pengajuan Penjemputan Sampah Mandiri (`/collection`)**:
   - Mengajukan permintaan penjemputan sampah dari rumah tanpa perlu repot membawa sendiri ke kantor bank sampah.
   - Memilih jenis sampah yang dimiliki, perkiraan berat, alamat penjemputan, dan waktu penjemputan yang diinginkan.
   - Memantau status penjemputan: *Menunggu Driver* $\rightarrow$ *Armada Menuju Lokasi* $\rightarrow$ *Ditimbang* $\rightarrow$ *Selesai (Saldo Masuk)*.
3. **Pencairan Saldo / Tarik Tunai (`/withdrawals`)**:
   - Mengajukan penarikan uang tabungan kapan saja saat membutuhkan dana.
   - Mendukung pencairan ke rekening Bank (BCA, Mandiri, BRI, BNI) maupun E-Wallet (DANA, GoPay, OVO, ShopeePay).
   - Memantau status pengiriman dana dan bukti transfer dari pengelola.
4. **Tukar Poin / Saldo dengan Sembako & Reward (`/rewards`)**:
   - Menukarkan saldo tabungan sampah secara langsung dengan kebutuhan pokok keluarga (Beras, Minyak Goreng, Gula, Telur) atau Token Listrik PLN.
   - Mengetahui batas kedaluwarsa barang secara transparan.
   - Menerima kode klaim unik untuk ditunjukkan saat pengambilan barang di kantor bank sampah.
5. **Lapor Sampah Liar & Titik Darurat Lingkungan (`/complaints`)**:
   - Melaporkan tumpukan sampah liar, pembuangan ilegal, atau selokan tersumbat sampah di sekitar tempat tinggal langsung dari HP.
   - Mengisi patokan lokasi, perkiraan volume, serta memilih tingkat urgensi (*Darurat, Tinggi, Normal*).
   - Memantau proses penanganan armada kebersihan hingga tuntas (*Pending $\rightarrow$ Verified $\rightarrow$ In Progress $\rightarrow$ Resolved*).
   - Berhak mendapatkan **apresiasi Poin Lingkungan** yang otomatis menambah saldo tabungan saat laporan valid berhasil dibersihkan!
6. **Akses Jadwal Penjemputan Lingkungan (`/schedules`)**:
   - Melihat jadwal rutin kedatangan truk/gerobak sampah di RW/lingkungan masing-masing.
7. **Membaca Edukasi & Panduan 3R (`/education`)**:
   - Membaca artikel dan panduan praktis memilah sampah dari rumah agar sampah bernilai jual tinggi.
   - Membagikan artikel edukasi ke grup WhatsApp RT/RW melalui tombol *Salin Info*.
8. **Pusat Bantuan & Live Chat (`/chat`)**:
   - Bertanya langsung kepada pengelola bank sampah seputar harga sampah hari ini, kendala penjemputan, atau tata cara pemilahan.
9. **Kartu Anggota Digital & QR Code Nasabah (`/members`)**:
   - Memiliki kartu anggota bank sampah digital elegan berdesain modern yang dilengkapi chip EMV dan kode QR unik.
   - Dapat ditunjukkan kepada petugas lapangan saat setoran langsung tanpa repot mencari nama manual.
   - Tersedia opsi cetak atau simpan kartu anggota ke perangkat.
10. **Kalkulator Tabungan & Dampak Lingkungan (`/calculator`)**:
   - Menghitung simulasi perolehan uang tunai (Rp) dan reward poin secara instan sebelum menyetorkan sampah.
   - Mengetahui kontribusi ekologis nyata: estimasi kilogram emisi karbon ($CO_2$) yang dicegah dan jumlah pohon setara yang berhasil diselamatkan.
11. **Peringkat Warga & Lencana Prestasi Lingkungan (`/leaderboard`)**:
   - Memantau klasemen warga dan lingkungan teraktif dalam memilah sampah (*Top 3 Podium & Ranking Warga*).
   - Meraih lencana digital otomatis (*Pendekar Daur Ulang, Pahlawan Lingkungan, Pejuang Pemilah, Sahabat Hijau*).
12. **Papan Harga Sampah Hari Ini & Panduan Bersih Pilah (`/prices`)**:
   - Melihat daftar harga beli sampah transparan terkini per kg lengkap dengan indikator tren naik/turun pasar.
   - Membuka panduan langkah demi langkah cara membersihkan dan menyortir setiap komoditas agar diterima dengan harga grade tertinggi.
   - Membagikan ringkasan harga harian langsung ke grup WhatsApp warga RT/RW.

---

## Alur Operasional Inti (SOP Siklus Sampah & Tabungan)

```
[1. Nasabah Ajukan Pickup] ──> [2. Petugas Tiba & Timbang] ──> [3. Admin Validasi Setoran]
                                                                        │
                                                                        ▼
[6. Penjualan ke Pabrik]   <── [5. Sortir & Masuk Gudang]  <── [4. Saldo Otomatis Masuk]
                                                                        │
                                                                        ▼
                                                       [7. Nasabah Tarik Tunai / Sembako]
```

1. **Pengajuan**: Nasabah memilah sampah di rumah lalu menekan menu **"Jemput Sampah"** di aplikasi.
2. **Penjemputan**: Petugas lapangan mendatangi lokasi sesuai rute, menimbang sampah, dan menginput kilogram riil ke aplikasi.
3. **Validasi**: Admin memeriksa data timbangan dan menyetujui setoran.
4. **Pencairan Saldo**: Saldo nasabah otomatis bertambah sesuai rumus: `Kg x Harga Sampah per Kg`.
5. **Gudang & Olah**: Sampah masuk ke gudang inventaris atau diproses menjadi pupuk kompos.
6. **Penjualan B2B**: Ketika stok gudang terkumpul cukup banyak (misal: 1 ton botol plastik), admin membuat transaksi penjualan ke pabrik mitra dengan harga grosir industri.
7. **Pemanfaatan Saldo**: Nasabah dapat mencairkan uangnya via rekening/DANA atau menukarkannya langsung dengan sembako di menu Rewards.

---

## Fitur-Fitur Unggulan Sistem

* **100% Mobile App Experience**: Tampilan responsif murni menyerupai aplikasi Android/iOS native saat dibuka lewat peramban HP (tombol ramah sentuhan, navigasi bawah, card modern).
* **Preview & Ekspor Dokumen Resmi**: Menghasilkan dokumen cetak PDF yang rapi, lengkap dengan kop surat, tabel terstruktur, dan kolom tanda tangan resmi.
* **Real-Time Live Chat**: Komunikasi interaktif dua arah antara nasabah dan pengelola tanpa perlu membuka aplikasi chat eksternal.
* **Proteksi Mutasi & Saldo Akurat**: Saldo tabungan dikunci dengan transaksi database ACID, mencegah saldo ganda atau manipulasi nilai.
* **Kontrol Kedaluwarsa Sembako**: Pencegahan otomatis penukaran barang yang telah melewati batas tanggal exp demi keselamatan konsumen.

---

## Panduan Instalasi & Menjalankan

### Persyaratan Sistem:
* **Node.js** v18 atau lebih baru.
* **MySQL** / MariaDB (melalui XAMPP, Laragon, atau standalone).
* Peramban modern (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Langkah-langkah:
1. **Nyalakan Layanan MySQL**:
   * Buka control panel XAMPP dan klik **Start** pada modul MySQL.
2. **Import Database**:
   * Buka browser ke `http://localhost/phpmyadmin`.
   * Buat database baru bernama `aplikasi_sampah`.
   * Import file SQL yang berada di direktori `database/aplikasi_sampah.sql`.
3. **Konfigurasi Lingkungan (`.env`)**:
   Pastikan file `.env` di direktori proyek memiliki konfigurasi database yang sesuai:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=aplikasi_sampah
   SESSION_SECRET=kunci_rahasia_aplikasi_sampah_2026
   ```
4. **Install Dependensi & Jalankan**:
   Buka terminal di folder proyek dan jalankan:
   ```bash
   npm install
   npm start
   ```
5. **Akses Aplikasi**:
   * Buka peramban ke: **`http://localhost:5000`**
   * Masuk menggunakan salah satu akun demo di atas.

---

5. **Masalah Dalam Sistem Kami**:
   * Belum bisa Scan QR Nasabah
   * Nembak GPS masih Eror

*Dikembangkan untuk efisiensi operasional bank sampah, peningkatan ekonomi sirkular masyarakat, dan kelestarian lingkungan hidup.*