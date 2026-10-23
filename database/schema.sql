-- ============================================================
-- DATABASE : aplikasi_sampah
-- APLIKASI : Aplikasi Sampah Terintegrasi
-- BASIS    : ERD yang diberikan
-- MYSQL    : 8.0+ / XAMPP
-- ============================================================

SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET time_zone='+07:00';
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `aplikasi_sampah` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `aplikasi_sampah`;
SET FOREIGN_KEY_CHECKS=0;

DROP VIEW IF EXISTS `v_collection_report`;
DROP TABLE IF EXISTS `activity_logs`,`withdrawal_requests`,`documents`,`notifications`,`wallet_transactions`,`sales`,`collection_items`,`collection_requests`,`buyers`,`waste_types`,`companies`,`role_permissions`,`permissions`,`user_roles`,`roles`,`users`;

CREATE TABLE `users` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `username` VARCHAR(50) NOT NULL,
 `email` VARCHAR(150) NOT NULL,
 `password_hash` VARCHAR(255) NOT NULL,
 `full_name` VARCHAR(105) NOT NULL,
 `phone` VARCHAR(30) DEFAULT NULL,
 `address` TEXT DEFAULT NULL,
 `photo_url` VARCHAR(255) DEFAULT NULL,
 `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
 `wallet_balance` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `email_verified_at` DATETIME DEFAULT NULL,
 `last_login_at` DATETIME DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_users_username` (`username`), UNIQUE KEY `uq_users_email` (`email`), KEY `idx_users_status` (`status`), KEY `idx_users_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `name` VARCHAR(60) NOT NULL,
 `display_name` VARCHAR(100) NOT NULL,
 `description` TEXT DEFAULT NULL,
 `is_system` BOOLEAN NOT NULL DEFAULT 0,
 `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_roles` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` BIGINT UNSIGNED NOT NULL,
 `role_id` BIGINT UNSIGNED NOT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_user_roles` (`user_id`,`role_id`), KEY `idx_ur_role` (`role_id`),
 CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `code` VARCHAR(100) NOT NULL,
 `name` VARCHAR(120) NOT NULL,
 `module` VARCHAR(50) NOT NULL,
 `description` TEXT DEFAULT NULL,
 `is_menu` BOOLEAN NOT NULL DEFAULT 1,
 `parent_id` BIGINT UNSIGNED DEFAULT NULL,
 `icon` VARCHAR(50) DEFAULT NULL,
 `sort_order` INT NOT NULL DEFAULT 0,
 `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_permissions_code` (`code`), KEY `idx_perm_parent` (`parent_id`), KEY `idx_perm_module` (`module`),
 CONSTRAINT `fk_perm_parent` FOREIGN KEY (`parent_id`) REFERENCES `permissions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `role_id` BIGINT UNSIGNED NOT NULL,
 `permission_id` BIGINT UNSIGNED NOT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_role_perm` (`role_id`,`permission_id`), KEY `idx_rp_perm` (`permission_id`),
 CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `companies` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `name` VARCHAR(100) NOT NULL,
 `address` TEXT DEFAULT NULL,
 `phone` VARCHAR(20) DEFAULT NULL,
 `email` VARCHAR(100) DEFAULT NULL,
 `logo_url` VARCHAR(255) DEFAULT NULL,
 `tax_number` VARCHAR(50) DEFAULT NULL,
 `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), KEY `idx_company_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `waste_types` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `code` VARCHAR(50) NOT NULL,
 `name` VARCHAR(100) NOT NULL,
 `category` ENUM('organik','anorganik','daur_ulang','b3','lainnya') NOT NULL,
 `unit` VARCHAR(20) NOT NULL DEFAULT 'kg',
 `price_per_unit` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `treatment_method` VARCHAR(200) DEFAULT NULL,
 `is_hazardous` TINYINT(1) NOT NULL DEFAULT 0,
 `description` TEXT DEFAULT NULL,
 `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_waste_code` (`code`), KEY `idx_waste_category` (`category`), KEY `idx_waste_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `buyers` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `name` VARCHAR(100) NOT NULL,
 `phone` VARCHAR(20) DEFAULT NULL,
 `email` VARCHAR(100) DEFAULT NULL,
 `address` TEXT DEFAULT NULL,
 `company` VARCHAR(100) DEFAULT NULL,
 `type` ENUM('perorangan','perusahaan') NOT NULL DEFAULT 'perorangan',
 `npwp` VARCHAR(50) DEFAULT NULL,
 `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), KEY `idx_buyer_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `collection_requests` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `code` VARCHAR(50) NOT NULL,
 `user_id` BIGINT UNSIGNED NOT NULL,
 `company_id` BIGINT UNSIGNED DEFAULT NULL,
 `address` TEXT NOT NULL,
 `latitude` DECIMAL(10,8) DEFAULT NULL,
 `longitude` DECIMAL(11,8) DEFAULT NULL,
 `scheduled_date` DATE DEFAULT NULL,
 `scheduled_time` TIME DEFAULT NULL,
 `request_note` TEXT DEFAULT NULL,
 `photo_url` VARCHAR(255) DEFAULT NULL,
 `status` ENUM('diajukan','dijadwalkan','diambil','ditimbang','selesai','ditolak','dibatalkan') NOT NULL DEFAULT 'diajukan',
 `rejected_reason` TEXT DEFAULT NULL,
 `assigned_to` BIGINT UNSIGNED DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_collection_code` (`code`), KEY `idx_cr_user` (`user_id`), KEY `idx_cr_company` (`company_id`), KEY `idx_cr_assigned` (`assigned_to`), KEY `idx_cr_status_date` (`status`,`scheduled_date`),
 CONSTRAINT `fk_cr_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT `fk_cr_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
 CONSTRAINT `fk_cr_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `collection_items` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `collection_id` BIGINT UNSIGNED NOT NULL,
 `waste_type_id` BIGINT UNSIGNED NOT NULL,
 `weight` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
 `price_per_unit` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `subtotal` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `notes` TEXT DEFAULT NULL,
 `photo_url` VARCHAR(255) DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), KEY `idx_ci_collection` (`collection_id`), KEY `idx_ci_waste` (`waste_type_id`),
 CONSTRAINT `fk_ci_collection` FOREIGN KEY (`collection_id`) REFERENCES `collection_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `fk_ci_waste` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sales` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `code` VARCHAR(50) NOT NULL,
 `collection_id` BIGINT UNSIGNED DEFAULT NULL,
 `buyer_id` BIGINT UNSIGNED DEFAULT NULL,
 `total_weight` DECIMAL(12,3) NOT NULL DEFAULT 0.000,
 `total_amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `status` ENUM('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
 `payment_status` ENUM('unpaid','processing','paid','failed') NOT NULL DEFAULT 'unpaid',
 `bank_name` VARCHAR(50) DEFAULT NULL,
 `payment_method` VARCHAR(50) DEFAULT 'transfer_bank',
 `payment_proof` VARCHAR(255) DEFAULT NULL,
 `payment_note` TEXT DEFAULT NULL,
 `paid_at` DATETIME DEFAULT NULL,
 `notes` TEXT DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), UNIQUE KEY `uq_sales_code` (`code`), KEY `idx_sales_collection` (`collection_id`), KEY `idx_sales_buyer` (`buyer_id`), KEY `idx_sales_status` (`status`),
 CONSTRAINT `fk_sales_collection` FOREIGN KEY (`collection_id`) REFERENCES `collection_requests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
 CONSTRAINT `fk_sales_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `wallet_transactions` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` BIGINT UNSIGNED NOT NULL,
 `type` ENUM('credit','debit') NOT NULL,
 `amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `reference_type` VARCHAR(50) DEFAULT NULL,
 `reference_id` BIGINT UNSIGNED DEFAULT NULL,
 `description` TEXT DEFAULT NULL,
 `status` ENUM('success','pending','failed') NOT NULL DEFAULT 'success',
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), KEY `idx_wallet_user` (`user_id`), KEY `idx_wallet_ref` (`reference_type`,`reference_id`),
 CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` BIGINT UNSIGNED NOT NULL,
 `actor_user_id` BIGINT UNSIGNED DEFAULT NULL,
 `type` ENUM('info','success','warning','error') NOT NULL DEFAULT 'info',
 `title` VARCHAR(150) NOT NULL,
 `message` TEXT NOT NULL,
 `icon` VARCHAR(50) DEFAULT NULL,
 `reference_type` VARCHAR(50) DEFAULT NULL,
 `reference_id` BIGINT UNSIGNED DEFAULT NULL,
 `is_read` TINYINT(1) NOT NULL DEFAULT 0,
 `read_at` DATETIME DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), KEY `idx_notif_user_read` (`user_id`,`is_read`), KEY `idx_notif_actor` (`actor_user_id`),
 CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `fk_notif_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `documents` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `reference_type` VARCHAR(50) NOT NULL,
 `reference_id` BIGINT UNSIGNED NOT NULL,
 `document_type` ENUM('foto','nota','surat','bukti_timbang','bukti_transfer','lainnya') NOT NULL,
 `file_name` VARCHAR(255) NOT NULL,
 `file_path` VARCHAR(255) NOT NULL,
 `mime_type` VARCHAR(100) DEFAULT NULL,
 `file_size` BIGINT UNSIGNED DEFAULT NULL,
 `uploaded_by` BIGINT UNSIGNED DEFAULT NULL,
 `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), KEY `idx_doc_ref` (`reference_type`,`reference_id`), KEY `idx_doc_user` (`uploaded_by`),
 CONSTRAINT `fk_doc_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `withdrawal_requests` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` BIGINT UNSIGNED NOT NULL,
 `amount` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
 `bank_name` VARCHAR(50) DEFAULT NULL,
 `account_number` VARCHAR(50) DEFAULT NULL,
 `account_name` VARCHAR(100) DEFAULT NULL,
 `status` ENUM('pending','approved','rejected','paid') NOT NULL DEFAULT 'pending',
 `payment_proof` VARCHAR(255) DEFAULT NULL,
 `payment_note` TEXT DEFAULT NULL,
 `processed_by` BIGINT UNSIGNED DEFAULT NULL,
 `rejected_reason` TEXT DEFAULT NULL,
 `requested_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `processed_at` DATETIME DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `deleted_at` DATETIME DEFAULT NULL,
 PRIMARY KEY (`id`), KEY `idx_withdrawal_user` (`user_id`), KEY `idx_withdrawal_status` (`status`), KEY `idx_withdrawal_processed` (`processed_by`),
 CONSTRAINT `fk_withdrawal_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
 CONSTRAINT `fk_withdrawal_processed` FOREIGN KEY (`processed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `activity_logs` (
 `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
 `user_id` BIGINT UNSIGNED DEFAULT NULL,
 `action` VARCHAR(100) NOT NULL,
 `description` TEXT DEFAULT NULL,
 `ip_address` VARCHAR(45) DEFAULT NULL,
 `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`), KEY `idx_log_user` (`user_id`), KEY `idx_log_action` (`action`), KEY `idx_log_date` (`created_at`),
 CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATA MASTER
-- ============================================================
INSERT INTO roles(id,name,display_name,description,is_system,status) VALUES
(1,'superadmin','Super Admin','Akses penuh seluruh sistem.',1,'active'),
(2,'admin_pengelola','Admin Pengelola','Kelola master data, pengumpulan, penjualan dan laporan.',1,'active'),
(3,'petugas_pengumpulan','Petugas Pengumpulan','Pickup, penimbangan dan update status lapangan.',1,'active'),
(4,'nasabah','Nasabah','Mengajukan pickup dan mengelola transaksi/saldo.',1,'active');

INSERT INTO permissions(id,code,name,module,description,is_menu,parent_id,icon,sort_order,status) VALUES
(1,'dashboard.read','Lihat Dashboard','dashboard','Melihat dashboard.',1,NULL,'bi-speedometer2',1,'active'),
(2,'users.read','Lihat Pengguna','users','Melihat data pengguna.',1,NULL,'bi-people',10,'active'),
(3,'users.create','Tambah Pengguna','users','Menambah pengguna.',0,2,NULL,11,'active'),
(4,'users.update','Edit Pengguna','users','Mengubah pengguna.',0,2,NULL,12,'active'),
(5,'users.delete','Hapus Pengguna','users','Menghapus pengguna.',0,2,NULL,13,'active'),
(6,'roles.read','Lihat Role','roles','Melihat role dan permission.',1,NULL,'bi-shield-lock',20,'active'),
(7,'roles.manage','Kelola Role & Permission','roles','Mengatur role dan permission.',0,6,NULL,21,'active'),
(8,'waste.read','Lihat Jenis Sampah','waste','Melihat jenis sampah.',1,NULL,'bi-recycle',30,'active'),
(9,'waste.create','Tambah Jenis Sampah','waste','Menambah jenis sampah.',0,8,NULL,31,'active'),
(10,'waste.update','Edit Jenis Sampah','waste','Mengubah jenis sampah.',0,8,NULL,32,'active'),
(11,'waste.delete','Hapus Jenis Sampah','waste','Menghapus jenis sampah.',0,8,NULL,33,'active'),
(12,'waste.manage','Kelola Jenis Sampah','waste','Kelola penuh jenis sampah.',0,8,NULL,34,'active'),
(13,'collection.read','Lihat Pengumpulan','collection','Melihat permintaan pickup.',1,NULL,'bi-truck',40,'active'),
(14,'collection.create','Ajukan Pickup','collection','Mengajukan pickup.',0,13,NULL,41,'active'),
(15,'collection.update','Update Pengumpulan','collection','Mengubah data/status pickup.',0,13,NULL,42,'active'),
(16,'collection.manage','Kelola Pengumpulan','collection','Kelola proses pickup.',0,13,NULL,43,'active'),
(17,'collection.approve','Validasi Pengumpulan','collection','Validasi hasil pengumpulan.',0,13,NULL,44,'active'),
(18,'sales.read','Lihat Penjualan','sales','Melihat transaksi penjualan.',1,NULL,'bi-cart',50,'active'),
(19,'sales.create','Buat Penjualan','sales','Membuat transaksi penjualan.',0,18,NULL,51,'active'),
(20,'sales.update','Edit Penjualan','sales','Mengubah transaksi.',0,18,NULL,52,'active'),
(21,'sales.manage','Kelola Penjualan','sales','Kelola transaksi dan pembayaran.',0,18,NULL,53,'active'),
(22,'wallet.read','Lihat Saldo','wallet','Melihat saldo dan riwayat.',1,NULL,'bi-wallet2',60,'active'),
(23,'wallet.transaction','Transaksi Wallet','wallet','Memproses transaksi wallet.',0,22,NULL,61,'active'),
(24,'reports.read','Lihat Laporan','reports','Melihat laporan dan monitoring.',1,NULL,'bi-bar-chart',70,'active'),
(25,'notifications.read','Lihat Notifikasi','notifications','Melihat notifikasi.',1,NULL,'bi-bell',80,'active'),
(26,'notifications.manage','Kelola Notifikasi','notifications','Mengelola notifikasi.',0,25,NULL,81,'active'),
(27,'companies.read','Lihat Perusahaan','companies','Melihat perusahaan.',1,NULL,'bi-building',90,'active'),
(28,'companies.manage','Kelola Perusahaan','companies','Mengelola perusahaan.',0,27,NULL,91,'active'),
(29,'buyers.read','Lihat Pembeli','buyers','Melihat pembeli.',1,NULL,'bi-person-badge',100,'active'),
(30,'buyers.manage','Kelola Pembeli','buyers','Mengelola pembeli.',0,29,NULL,101,'active'),
(31,'documents.read','Lihat Dokumen','documents','Melihat dokumen.',0,NULL,'bi-file-earmark',110,'active'),
(32,'documents.manage','Kelola Dokumen','documents','Upload dan kelola dokumen.',0,31,NULL,111,'active'),
(33,'withdrawal.read','Lihat Penarikan','withdrawal','Melihat penarikan.',1,NULL,'bi-cash-stack',120,'active'),
(34,'withdrawal.manage','Kelola Penarikan','withdrawal','Memproses penarikan.',0,33,NULL,121,'active'),
(35,'activity.read','Lihat Log Aktivitas','activity','Melihat log aktivitas.',1,NULL,'bi-activity',130,'active');

INSERT INTO companies(id,name,address,phone,email,status) VALUES
(1,'Bank Sampah Terintegrasi','Jl. Lingkungan Bersih No. 1, Indonesia','021-00000001','info@banksampah.local','active'),
(2,'Unit Pengelola Sampah Mandiri','Jl. Daur Ulang No. 10, Indonesia','021-00000002','admin@pengelola.local','active');

INSERT INTO waste_types(id,code,name,category,unit,price_per_unit,treatment_method,is_hazardous,description,status) VALUES
(1,'ORG','Organik','organik','kg',500,'Pengomposan',0,'Sampah organik yang dapat diolah menjadi kompos.','active'),
(2,'PLS','Plastik','daur_ulang','kg',3000,'Daur ulang plastik',0,'Botol, kemasan dan plastik yang dapat didaur ulang.','active'),
(3,'KRT','Kertas','daur_ulang','kg',2500,'Daur ulang kertas',0,'Kertas dan kardus yang dapat didaur ulang.','active'),
(4,'LOG','Logam','daur_ulang','kg',7000,'Daur ulang logam',0,'Kaleng dan material logam yang dapat didaur ulang.','active'),
(5,'KCA','Kaca','daur_ulang','kg',1500,'Daur ulang kaca',0,'Botol dan material kaca.','active'),
(6,'B3','Limbah B3','b3','kg',0,'Penanganan limbah B3 khusus',1,'Limbah berbahaya dan beracun.','active');

INSERT INTO buyers(id,name,phone,email,address,company,type,npwp,status) VALUES
(1,'CV Daur Ulang Nusantara','081200000001','buyer1@local.test','Kawasan Industri Daur Ulang','CV Daur Ulang Nusantara','perusahaan','00.000.000.0-000.000','active'),
(2,'PT Hijau Lestari','081200000002','buyer2@local.test','Jl. Industri Hijau No. 20','PT Hijau Lestari','perusahaan','00.000.000.0-000.000','active'),
(3,'Pembeli Umum','081200000003','pembeli@local.test','Indonesia',NULL,'perorangan',NULL,'active');

-- Password demo semua = password
INSERT INTO users(id,username,email,password_hash,full_name,phone,address,status,wallet_balance) VALUES
(1,'admin','admin@aplikasisampah.local','$2b$12$U7qNyi8AkZzqc824HqoOduYCtNgwh0of3M6ZRhm1xdDT0FTxzMOCC','Super Administrator','081300000001','Kantor Pusat','active',0),
(2,'operator','operator@aplikasisampah.local','$2b$12$U7qNyi8AkZzqc824HqoOduYCtNgwh0of3M6ZRhm1xdDT0FTxzMOCC','Admin Pengelola','081300000002','Unit Pengelola','active',0),
(3,'petugas','petugas@aplikasisampah.local','$2b$12$U7qNyi8AkZzqc824HqoOduYCtNgwh0of3M6ZRhm1xdDT0FTxzMOCC','Petugas Pengumpulan','081300000003','Unit Lapangan','active',0),
(4,'nasabah','nasabah@aplikasisampah.local','$2b$12$U7qNyi8AkZzqc824HqoOduYCtNgwh0of3M6ZRhm1xdDT0FTxzMOCC','Nasabah Demo','081300000004','Jl. Contoh No. 15','active',125000),
(5,'budi','budi@aplikasisampah.local','$2b$12$U7qNyi8AkZzqc824HqoOduYCtNgwh0of3M6ZRhm1xdDT0FTxzMOCC','Budi Santoso','081300000005','Jl. Melati No. 8','active',75000);

INSERT INTO user_roles(user_id,role_id) VALUES (1,1),(2,2),(3,3),(4,4),(5,4);
INSERT INTO role_permissions(role_id,permission_id) SELECT 1,id FROM permissions;
INSERT INTO role_permissions(role_id,permission_id) SELECT 2,id FROM permissions WHERE code IN ('dashboard.read','users.read','users.create','users.update','waste.read','waste.create','waste.update','waste.delete','waste.manage','collection.read','collection.create','collection.update','collection.manage','collection.approve','sales.read','sales.create','sales.update','sales.manage','wallet.read','wallet.transaction','reports.read','notifications.read','notifications.manage','companies.read','companies.manage','buyers.read','buyers.manage','documents.read','documents.manage','withdrawal.read','withdrawal.manage','activity.read');
INSERT INTO role_permissions(role_id,permission_id) SELECT 3,id FROM permissions WHERE code IN ('dashboard.read','collection.read','collection.create','collection.update','waste.read','wallet.read','notifications.read','reports.read','documents.read','documents.manage');
INSERT INTO role_permissions(role_id,permission_id) SELECT 4,id FROM permissions WHERE code IN ('dashboard.read','collection.read','collection.create','waste.read','sales.read','sales.create','wallet.read','notifications.read','documents.read');

-- ============================================================
-- DATA TRANSAKSI DEMO
-- ============================================================
INSERT INTO collection_requests(id,code,user_id,company_id,address,latitude,longitude,scheduled_date,scheduled_time,request_note,status,assigned_to) VALUES
(1,'COL-DEMO-0001',4,1,'Jl. Contoh No. 15, Indonesia',-6.20000000,106.81666600,'2026-09-15','09:00:00','Mohon pickup pagi hari.','selesai',3),
(2,'COL-DEMO-0002',5,1,'Jl. Melati No. 8, Indonesia',-6.21000000,106.82000000,'2026-09-16','10:00:00','Sampah sudah dipilah.','dijadwalkan',3),
(3,'COL-DEMO-0003',4,2,'Jl. Contoh No. 15, Indonesia',-6.20000000,106.81666600,'2026-09-17','13:00:00','Ada plastik dan kertas.','diajukan',NULL),
(4,'COL-DEMO-0004',5,1,'Jl. Melati No. 8, Indonesia',-6.21000000,106.82000000,'2026-09-10','14:00:00','Permintaan dibatalkan.','dibatalkan',NULL);

INSERT INTO collection_items(id,collection_id,waste_type_id,weight,price_per_unit,subtotal,notes) VALUES
(1,1,2,12.500,3000,37500,'Botol plastik'),
(2,1,3,8.000,2500,20000,'Kardus dan kertas'),
(3,1,4,5.000,7000,35000,'Kaleng logam'),
(4,2,2,10.000,3000,30000,'Plastik terpilah'),
(5,2,3,5.500,2500,13750,'Kertas'),
(6,3,2,7.000,3000,21000,'Plastik');

INSERT INTO sales(id,code,collection_id,buyer_id,total_weight,total_amount,status,payment_status,paid_at,notes) VALUES
(1,'SAL-DEMO-0001',1,1,25.500,92500,'paid','paid','2026-09-15 12:30:00','Penjualan hasil pickup demo.'),
(2,'SAL-DEMO-0002',2,2,15.500,43750,'approved','processing',NULL,'Menunggu pembayaran.'),
(3,'SAL-DEMO-0003',3,1,7.000,21000,'pending','unpaid',NULL,'Menunggu validasi.');

INSERT INTO wallet_transactions(id,user_id,type,amount,reference_type,reference_id,description,status) VALUES
(1,4,'credit',92500,'sale',1,'Hasil penjualan SAL-DEMO-0001','success'),
(2,4,'credit',32500,'manual',NULL,'Saldo awal/demo nasabah','success'),
(3,5,'credit',75000,'manual',NULL,'Saldo awal/demo nasabah','success');

INSERT INTO notifications(id,user_id,actor_user_id,type,title,message,icon,reference_type,reference_id,is_read) VALUES
(1,4,3,'success','Pickup selesai','Pickup COL-DEMO-0001 telah selesai dan hasil penimbangan tercatat.','bi-check-circle','collection',1,0),
(2,4,3,'info','Pickup diajukan','Permintaan pickup COL-DEMO-0003 berhasil diajukan.','bi-truck','collection',3,0),
(3,5,3,'info','Pickup dijadwalkan','Pickup COL-DEMO-0002 dijadwalkan 16 September 2026 pukul 10:00.','bi-calendar-check','collection',2,0),
(4,1,4,'success','Transaksi selesai','Penjualan SAL-DEMO-0001 telah dibayar.','bi-cash-stack','sale',1,1);

INSERT INTO documents(id,reference_type,reference_id,document_type,file_name,file_path,mime_type,file_size,uploaded_by,is_primary) VALUES
(1,'collection',1,'foto','pickup-demo.jpg','/uploads/collections/pickup-demo.jpg','image/jpeg',125000,3,1),
(2,'collection_item',1,'bukti_timbang','timbang-demo.jpg','/uploads/collections/timbang-demo.jpg','image/jpeg',98000,3,1),
(3,'withdrawal',1,'bukti_transfer','transfer-demo.jpg','/uploads/withdrawals/transfer-demo.jpg','image/jpeg',110000,1,1);

INSERT INTO withdrawal_requests(id,user_id,amount,bank_name,account_number,account_name,status,requested_at,processed_at) VALUES
(1,4,50000,'BCA','1234567890','Nasabah Demo','approved','2026-09-14 10:00:00','2026-09-14 15:00:00'),
(2,5,25000,'BRI','9876543210','Budi Santoso','pending','2026-09-15 11:00:00',NULL);

INSERT INTO activity_logs(id,user_id,action,description,ip_address) VALUES
(1,1,'LOGIN','Super Administrator login ke sistem.','127.0.0.1'),
(2,4,'CREATE_COLLECTION','Nasabah membuat COL-DEMO-0001.','127.0.0.1'),
(3,3,'UPDATE_COLLECTION_STATUS','Petugas mengubah COL-DEMO-0001 menjadi selesai.','127.0.0.1'),
(4,2,'APPROVE_COLLECTION','Admin memvalidasi hasil COL-DEMO-0001.','127.0.0.1'),
(5,1,'PAY_SALE','SAL-DEMO-0001 telah dibayar.','127.0.0.1');

SET FOREIGN_KEY_CHECKS=1;

-- ============================================================
-- VIEW LAPORAN / EXPORT
-- ============================================================
CREATE VIEW `v_collection_report` AS
SELECT
 cr.id AS collection_id, cr.code AS collection_code, cr.user_id,
 u.full_name AS nasabah_name, u.username AS nasabah_username, u.phone AS nasabah_phone,
 cr.company_id, c.name AS company_name, cr.address, cr.latitude, cr.longitude,
 cr.scheduled_date, cr.scheduled_time, cr.request_note, cr.status, cr.rejected_reason,
 cr.assigned_to, collector.full_name AS collector_name, cr.created_at, cr.updated_at,
 ci.id AS item_id, ci.waste_type_id, wt.code AS waste_code, wt.name AS waste_name,
 wt.category AS waste_category, wt.unit AS waste_unit, ci.weight, ci.price_per_unit,
 ci.subtotal, ci.notes AS item_notes
FROM collection_requests cr
JOIN users u ON u.id=cr.user_id
LEFT JOIN companies c ON c.id=cr.company_id
LEFT JOIN users collector ON collector.id=cr.assigned_to
LEFT JOIN collection_items ci ON ci.collection_id=cr.id AND ci.deleted_at IS NULL
LEFT JOIN waste_types wt ON wt.id=ci.waste_type_id
WHERE cr.deleted_at IS NULL;

SELECT 'DATABASE APLIKASI SAMPAH SESUAI ERD SIAP DIGUNAKAN' AS status;
-- ============================================================
-- DEMO LOGIN: admin / password
--              operator / password
--              petugas / password
--              nasabah / password
-- ============================================================
