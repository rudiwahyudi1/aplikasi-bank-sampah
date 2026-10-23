-- ============================================================
-- MIGRASI FITUR TAMBAHAN: PILAHKITA
-- 1. Pengolahan Sampah (Kompos / Daur Ulang)
-- 2. Inventori Gudang & Log Mutasi
-- 3. Reward & Penukaran Sembako
-- 4. Panduan Edukasi 3R
-- ============================================================

USE `aplikasi_sampah`;

-- 1. PENGOLAHAN SAMPAH
CREATE TABLE IF NOT EXISTS `waste_processings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `waste_type_id` BIGINT UNSIGNED NOT NULL,
  `process_type` ENUM('kompos','maggot','cacah_plastik','press_bal','kerajinan','lainnya') NOT NULL,
  `input_weight` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  `output_product_name` VARCHAR(150) DEFAULT NULL,
  `output_weight` DECIMAL(12,3) DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `status` ENUM('direncanakan','proses','selesai','gagal') NOT NULL DEFAULT 'proses',
  `pic_user_id` BIGINT UNSIGNED DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wp_code` (`code`),
  KEY `idx_wp_waste` (`waste_type_id`),
  KEY `idx_wp_pic` (`pic_user_id`),
  CONSTRAINT `fk_wp_waste` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_wp_pic` FOREIGN KEY (`pic_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. INVENTORI GUDANG & LOG MUTASI
CREATE TABLE IF NOT EXISTS `waste_inventory_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `waste_type_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('in','out','adjustment') NOT NULL,
  `quantity` DECIMAL(12,3) NOT NULL,
  `reference_type` VARCHAR(50) DEFAULT 'manual',
  `reference_id` BIGINT UNSIGNED DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `recorded_by` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inv_waste` (`waste_type_id`),
  KEY `idx_inv_recorded` (`recorded_by`),
  CONSTRAINT `fk_inv_waste` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_inv_recorded` FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. REWARD & PENUKARAN SEMBAKO
CREATE TABLE IF NOT EXISTS `reward_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `category` ENUM('sembako','voucher','merchandise','bibit_pupuk') NOT NULL DEFAULT 'sembako',
  `points_cost` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `stock` INT NOT NULL DEFAULT 0,
  `unit` VARCHAR(30) NOT NULL DEFAULT 'pcs',
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ri_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `reward_redemptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `reward_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_points` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pending','ready','completed','rejected') NOT NULL DEFAULT 'pending',
  `processed_by` BIGINT UNSIGNED DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rr_code` (`code`),
  KEY `idx_rr_user` (`user_id`),
  KEY `idx_rr_reward` (`reward_id`),
  CONSTRAINT `fk_rr_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rr_reward` FOREIGN KEY (`reward_id`) REFERENCES `reward_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_rr_processed` FOREIGN KEY (`processed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PANDUAN EDUKASI 3R
CREATE TABLE IF NOT EXISTS `education_articles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `category` ENUM('pilah_organik','pilah_plastik','pilah_kertas_logam','limbah_b3','kompos_mandiri','info_bank_sampah') NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `thumbnail_icon` VARCHAR(50) DEFAULT 'bi-recycle',
  `reading_time` INT NOT NULL DEFAULT 3,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ea_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEED DATA PERMISSIONS (IF NOT EXISTS)
INSERT IGNORE INTO `permissions` (`id`, `code`, `name`, `module`, `description`, `is_menu`, `icon`, `sort_order`, `status`) VALUES
(40, 'processing.read', 'Lihat Pengolahan', 'processing', 'Melihat daftar dan progres pengolahan sampah', 1, 'bi-gear-wide-connected', 45, 'active'),
(41, 'processing.manage', 'Kelola Pengolahan', 'processing', 'Membuat batch dan panen hasil pengolahan', 0, NULL, 46, 'active'),
(42, 'inventory.read', 'Lihat Stok Gudang', 'inventory', 'Melihat stok gudang dan mutasi sampah', 1, 'bi-boxes', 47, 'active'),
(43, 'inventory.manage', 'Kelola Stok Gudang', 'inventory', 'Melakukan stock opname dan penyesuaian stok', 0, NULL, 48, 'active'),
(44, 'rewards.read', 'Lihat Hadiah & Sembako', 'rewards', 'Melihat katalog reward dan riwayat penukaran', 1, 'bi-gift', 65, 'active'),
(45, 'rewards.manage', 'Kelola Hadiah & Sembako', 'rewards', 'Mengelola stok hadiah dan verifikasi penukaran', 0, NULL, 66, 'active'),
(46, 'education.read', 'Lihat Edukasi 3R', 'education', 'Membaca panduan pemilahan sampah dan artikel 3R', 1, 'bi-book-half', 140, 'active');

-- ASSIGN PERMISSIONS TO ROLES (1 = superadmin, 2 = admin_pengelola, 3 = petugas, 4 = nasabah)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, id FROM `permissions` WHERE `id` >= 40;

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, id FROM `permissions` WHERE `id` >= 40;

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 3, id FROM `permissions` WHERE `code` IN ('processing.read', 'processing.manage', 'inventory.read', 'rewards.read', 'education.read');

INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 4, id FROM `permissions` WHERE `code` IN ('rewards.read', 'education.read');

-- SEED REWARD ITEMS
INSERT IGNORE INTO `reward_items` (`id`, `code`, `name`, `category`, `points_cost`, `stock`, `unit`, `photo_url`, `description`, `status`) VALUES
(1, 'RWD-SBK-01', 'Beras Premium 5 Kg', 'sembako', 75000.00, 25, 'sak', '/images/rewards/beras.png', 'Beras putih pulen kualitas premium kemasan 5 kg.', 'active'),
(2, 'RWD-SBK-02', 'Minyak Goreng 2 Liter', 'sembako', 35000.00, 30, 'pouch', '/images/rewards/minyak.png', 'Minyak goreng kelapa sawit higienis kemasan pouch 2 liter.', 'active'),
(3, 'RWD-SBK-03', 'Gula Pasir 1 Kg', 'sembako', 18000.00, 40, 'bungkus', '/images/rewards/gula.png', 'Gula pasir murni kristal putih kemasan 1 kg.', 'active'),
(4, 'RWD-MRC-01', 'Tumbler Stainless PilahKita', 'merchandise', 45000.00, 15, 'pcs', '/images/rewards/tumbler.png', 'Tumbler termos ramah lingkungan tahan panas/dingin 12 jam (500ml).', 'active'),
(5, 'RWD-BIB-01', 'Pupuk Kompos Organik 5 Kg', 'bibit_pupuk', 20000.00, 50, 'kantong', '/images/rewards/kompos.png', 'Pupuk organik padat kaya nutrisi hasil daur ulang Bank Sampah PilahKita.', 'active'),
(6, 'RWD-VCR-01', 'Token Listrik PLN Rp 50.000', 'voucher', 52000.00, 100, 'voucher', '/images/rewards/pln.png', 'Voucher isi ulang token listrik PLN prabayar nominal Rp 50.000.', 'active');

-- SEED PROCESSING DEMO DATA
INSERT IGNORE INTO `waste_processings` (`id`, `code`, `waste_type_id`, `process_type`, `input_weight`, `output_product_name`, `output_weight`, `start_date`, `end_date`, `status`, `pic_user_id`, `notes`) VALUES
(1, 'PRC-2026-001', 1, 'kompos', 150.000, 'Pupuk Kompos Organik PilahKita', 75.000, '2026-09-01', '2026-09-18', 'selesai', 3, 'Proses pengomposan aerobik 18 hari selesai sempurna.'),
(2, 'PRC-2026-002', 2, 'cacah_plastik', 85.000, 'Flakes Cacahan PET Bening', 82.500, '2026-09-10', '2026-09-11', 'selesai', 3, 'Pencacahan botol plastik bening siap supply pabrik daur ulang.'),
(3, 'PRC-2026-003', 1, 'maggot', 200.000, 'Pakan Maggot BSF Kering', NULL, '2026-09-16', NULL, 'proses', 3, 'Biokonversi sisa makanan organik menggunakan larva Black Soldier Fly (BSF).'),
(4, 'PRC-2026-004', 3, 'press_bal', 120.000, 'Kardus Press Padat (Bal)', NULL, '2026-09-19', NULL, 'proses', 3, 'Pemadatan kardus terpilah dengan mesin press hidrolik.');

-- SEED INVENTORY LOGS DEMO DATA
INSERT IGNORE INTO `waste_inventory_logs` (`id`, `waste_type_id`, `type`, `quantity`, `reference_type`, `reference_id`, `notes`, `recorded_by`) VALUES
(1, 2, 'in', 50.000, 'collection', 1, 'Masuk dari pengumpulan COL-DEMO-0001', 3),
(2, 3, 'in', 35.000, 'collection', 1, 'Masuk dari pengumpulan COL-DEMO-0001', 3),
(3, 4, 'in', 20.000, 'collection', 1, 'Masuk dari pengumpulan COL-DEMO-0001', 3),
(4, 2, 'out', 25.500, 'sale', 1, 'Keluar untuk transaksi penjualan SAL-DEMO-0001', 1),
(5, 1, 'in', 250.000, 'manual', NULL, 'Penerimaan sampah organik basah pasar', 3),
(6, 1, 'out', 150.000, 'processing', 1, 'Dialokasikan ke batch kompos PRC-2026-001', 3);

-- SEED EDUCATION ARTICLES
INSERT IGNORE INTO `education_articles` (`id`, `title`, `slug`, `category`, `summary`, `content`, `thumbnail_icon`, `reading_time`) VALUES
(1, 'Cara Tepat Memilah Sampah Plastik agar Bernilai Jual Tinggi', 'cara-tepat-memilah-sampah-plastik', 'pilah_plastik', 'Pelajari cara membersihkan, mengeringkan, dan membedakan jenis plastik (PET, HDPE) agar dihargai maksimal oleh Bank Sampah.', '### 1. Pisahkan Berdasarkan Jenis Plastik\nTidak semua plastik bernilai sama. Plastik PET (seperti botol air mineral bening) memiliki harga jual lebih tinggi dibandingkan plastik multilayer (kemasan sachet).\n\n### 2. Cuci dan Keringkan\nBotol atau wadah plastik yang kotor terkena sisa minuman/minyak akan menurunkan kualitas daur ulang. Bilas sebentar dengan air dan tiriskan hingga kering.\n\n### 3. Lepas Tutup dan Label\nTutup botol umumnya berbahan HDPE/PP sedangkan botolnya berbahan PET. Memisahkan keduanya mempermudah petugas daur ulang dan menaikkan timbangan bersih.\n\n### 4. Remas atau Pipihkan\nPipihkan botol atau kardus sebelum dikumpulkan untuk menghemat ruang penyimpanan di rumah Anda.', 'bi-recycle', 3),

(2, 'Panduan Praktis Membuat Kompos Sendiri di Rumah (Metode Takakura & Ember Tumpuk)', 'panduan-membuat-kompos-mandiri', 'kompos_mandiri', 'Ubah sisa sayuran, kulit buah, dan daun kering menjadi pupuk organik subur untuk tanaman pekarangan.', '### Bahan yang Dibutuhkan:\n- Ember atau keranjang berlubang ventilasi\n- Sampah organik basah (sisa sayur, kulit buah, ampas kopi/teh)\n- Sampah cokelat kering (daun kering, serbuk gergaji, sekam)\n- Bio-aktivator (cairan EM4 atau sedikit kompos jadi)\n\n### Langkah Pengerjaan:\n1. **Lapisan Dasar**: Letakkan sampah cokelat kering di dasar ember setebal 5 cm.\n2. **Masukkan Sampah Organik**: Potong kecil sisa sayur/buah agar cepat terurai, lalu masukkan ke dalam wadah.\n3. **Taburi Bioaktivator**: Percikkan cairan EM4 yang telah diencerkan dengan air gula.\n4. **Tutup Rapat**: Jaga kelembaban sekitar 50% (tidak terlalu becek dan tidak kering). Aduk seminggu sekali.\n5. **Panen**: Dalam waktu 3-4 minggu, kompos akan berwarna kehitaman seperti tanah gembur dan tidak berbau busuk. Kompos siap dipakai!', 'bi-flower1', 4),

(3, 'Mengenal Limbah B3 Rumah Tangga dan Bahayanya', 'mengenal-limbah-b3-rumah-tangga', 'limbah_b3', 'Baterai bekas, lampu neon, botol aerosol, dan obat kedaluwarsa tidak boleh dibuang ke tempat sampah biasa!', '### Apa Itu Limbah B3 Rumah Tangga?\nLimbah Bahan Berbahaya dan Beracun (B3) adalah limbah yang mengandung zat beracun, mudah terbakar, atau korosif.\n\n### Contoh Limbah B3 Sehari-hari:\n- Baterai bekas dan aki kendaraan\n- Lampu tabung (TL/neon) yang mengandung uap merkuri\n- Kaleng aerosol (semprotan nyamuk, hairspray, cat pylox)\n- Wadah sisa pemutih dan pembersih lantai kimiawi\n- Obat-obatan kedaluwarsa dan jarum suntik\n\n### Bahaya Pembuangan Sembarangan:\nJika dibuang ke TPA atau sungai, logam berat seperti timbal, raksa, dan kadmium dapat meresap ke dalam air tanah yang dikonsumsi masyarakat.\n\n### Solusi Penanganan:\nSimpan limbah B3 di wadah terpisah yang kering dan berlabel khusus, lalu serahkan ke TPS3R PilahKita yang memiliki fasilitas drop point B3 berizin.', 'bi-radioactive', 5),

(4, 'Cara Memaksimalkan Saldo Tabungan Bank Sampah PilahKita', 'memaksimalkan-saldo-tabungan-bank-sampah', 'info_bank_sampah', 'Tips dan trik mengumpulkan sampah terpilah secara rutin agar tabungan cepat bertambah untuk ditukar sembako.', '### 1. Buat Sudut Pemilahan di Dapur\nSediakan 3 wadah terpisah di rumah: Organik, Anorganik Daur Ulang (kertas, plastik, logam), dan Residu.\n\n### 2. Kumpulkan Kardus & Kaleng Bekas Belanja Online\nKardus packing dan kaleng susu memiliki bobot timbangan yang solid dan harga per kg yang stabil.\n\n### 3. Manfaatkan Jadwal Jemput Rutin (Pickup)\nGunakan fitur Pengumpulan di aplikasi PilahKita. Petugas kami akan datang langsung ke alamat rumah Anda, menimbang di tempat, dan saldo otomatis masuk ke dompet digital Anda.\n\n### 4. Tukarkan Saldo dengan Sembako Hemat\nGunakan menu Reward di PilahKita untuk menukarkan saldo Anda dengan Beras 5kg, Minyak Goreng, atau Token Listrik tanpa biaya admin!', 'bi-wallet2', 3);
