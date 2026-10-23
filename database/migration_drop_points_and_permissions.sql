-- ============================================================
-- MIGRASI: POS DROP POINT & PENYEMPURNAAN HAK AKSES ROLE
-- Aplikasi Sampah Terintegrasi - PilahKita
-- ============================================================

USE `aplikasi_sampah`;

-- 1. TABEL DROP POINTS (POS SETOR SAMPAH MANDIRI)
CREATE TABLE IF NOT EXISTS `drop_points` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('unit_bank_sampah','dropbox_publik','tps3r_induk','sekolah_kampus','kantor_mitra') NOT NULL DEFAULT 'unit_bank_sampah',
  `address` TEXT NOT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `operational_hours` VARCHAR(100) DEFAULT '08:00 - 16:00 WIB',
  `operational_days` VARCHAR(100) DEFAULT 'Senin - Sabtu',
  `accepted_waste_types` VARCHAR(255) DEFAULT 'Organik, Plastik, Kertas, Logam',
  `capacity_kg` DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  `current_load_kg` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `pic_name` VARCHAR(120) DEFAULT NULL,
  `pic_phone` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('aktif','hampir_penuh','penuh','pemeliharaan','nonaktif') NOT NULL DEFAULT 'aktif',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_dp_code` (`code`),
  KEY `idx_dp_category` (`category`),
  KEY `idx_dp_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL LOG PENGANGKUTAN / PENGOSONGAN DROP POINT
CREATE TABLE IF NOT EXISTS `drop_point_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `drop_point_id` BIGINT UNSIGNED NOT NULL,
  `emptied_by` BIGINT UNSIGNED DEFAULT NULL,
  `weight_collected_kg` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `collection_date` DATE NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_dpl_dp` (`drop_point_id`),
  KEY `idx_dpl_user` (`emptied_by`),
  CONSTRAINT `fk_dpl_dp` FOREIGN KEY (`drop_point_id`) REFERENCES `drop_points`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dpl_user` FOREIGN KEY (`emptied_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. INSERT PERMISSIONS BARU UNTUK DROP POINT
INSERT IGNORE INTO `permissions` (`id`, `code`, `name`, `module`, `description`, `is_menu`, `icon`, `sort_order`, `status`) VALUES
(60, 'drop_points.read', 'Lihat Pos Drop Point', 'drop_points', 'Melihat direktori dan lokasi pos drop point', 1, 'bi-geo-alt', 44, 'active'),
(61, 'drop_points.manage', 'Kelola Pos Drop Point', 'drop_points', 'Mengatur data pos drop point dan update muatan kontainer', 0, NULL, 45, 'active');

-- 4. PENYEMPURNAAN HAK AKSES ROLE (RBAC)
-- Role 1: Superadmin (Dapatkan semua permission)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, id FROM `permissions` WHERE `id` IN (60, 61);

-- Role 2: Admin Pengelola (Dapatkan drop_points.* dan roles.read)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, id FROM `permissions` WHERE `code` IN ('drop_points.read', 'drop_points.manage', 'roles.read');

-- Role 3: Petugas Pengumpulan (Dapatkan drop_points.* dan inventory.manage)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 3, id FROM `permissions` WHERE `code` IN ('drop_points.read', 'drop_points.manage', 'inventory.manage');

-- Role 4: Nasabah (PERBAIKAN KRUSIAL: Dapatkan withdrawal.read dan drop_points.read)
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 4, id FROM `permissions` WHERE `code` IN ('withdrawal.read', 'drop_points.read');

-- 5. SEED DATA DROP POINTS DEMO
INSERT IGNORE INTO `drop_points` (`id`, `code`, `name`, `category`, `address`, `district`, `latitude`, `longitude`, `operational_hours`, `operational_days`, `accepted_waste_types`, `capacity_kg`, `current_load_kg`, `pic_name`, `pic_phone`, `status`, `notes`) VALUES
(1, 'DP-JKT-001', 'Drop Point Sentra RW 05 Cilandak', 'unit_bank_sampah', 'Jl. Melati Indah No. 12, RT 05 / RW 05', 'Cilandak', -6.29210000, 106.80420000, '08:00 - 15:00 WIB', 'Senin - Sabtu', 'Plastik, Kertas/Kardus, Logam, Minyak Jelantah', 500.00, 320.00, 'Bambang Irawan', '081298765432', 'aktif', 'Pos penimbangan mandiri warga RW 05 dengan timbangan digital.'),
(2, 'DP-JKT-002', 'Smart Dropbox Botol Plastik Stasiun MRT', 'dropbox_publik', 'Plaza Pintu Barat Stasiun MRT Fatmawati', 'Cilandak Barat', -6.29520000, 106.79380000, '06:00 - 22:00 WIB', 'Setiap Hari', 'Botol Plastik PET Bening, Kaleng Minuman', 200.00, 185.00, 'Dedi Suhendar (Petugas Stasiun)', '081311223344', 'hampir_penuh', 'Dropbox otomatis dengan reward poin langsung ke akun PilahKita.'),
(3, 'DP-JKT-003', 'TPS3R Induk PilahKita Mandiri', 'tps3r_induk', 'Komplek Hanggar Pengolahan Sampah Terpadu No. 1', 'Pasar Minggu', -6.28450000, 106.82890000, '07:30 - 17:00 WIB', 'Senin - Minggu', 'Semua Jenis Sampah (Organik, Anorganik & B3)', 2000.00, 1150.00, 'Ahmad Fauzi (Supervisor TPS3R)', '081199887766', 'aktif', 'Fasilitas pusat pencacahan plastik, rumah pengomposan aerobik dan maggot BSF.'),
(4, 'DP-JKT-004', 'Eco-Corner Kampus Terpadu Nusantara', 'sekolah_kampus', 'Gedung Rektorat Lt. 1, Universitas Nusantara', 'Kebayoran Lama', -6.24100000, 106.78200000, '08:00 - 17:00 WIB', 'Senin - Jumat', 'Kertas HVS, Kardus Buku, Botol Kemasan, Tutup Botol', 350.00, 90.00, 'Siti Rahma (Green Campus Ambassador)', '081577889900', 'aktif', 'Drop point edukasi pemilahan sampah civitas akademika.'),
(5, 'DP-JKT-005', 'Drop Point Mall Hijau Lestari', 'kantor_mitra', 'Loading Dock B Ground Floor, Mall Hijau Lestari', 'Pancoran', -6.25050000, 106.84000000, '10:00 - 20:00 WIB', 'Setiap Hari', 'Kardus Packaging, Plastik Wrapping, Kaleng Logam', 800.00, 780.00, 'Hendra Gunawan (Facility Manager)', '081822334455', 'penuh', 'Memerlukan armada pengangkutan segera karena muatan sudah mencapai 97%.');

-- 6. SEED LOG PENGANGKUTAN DARI DROP POINT KE GUDANG UTAMA
INSERT IGNORE INTO `drop_point_logs` (`id`, `drop_point_id`, `emptied_by`, `weight_collected_kg`, `collection_date`, `notes`) VALUES
(1, 1, 3, 240.00, '2026-09-18', 'Pengangkutan rutin mingguan muatan plastik dan kardus ke gudang induk.'),
(2, 3, 3, 500.00, '2026-09-19', 'Pemindahan bahan baku organik terpilah ke hangar pengomposan.');
