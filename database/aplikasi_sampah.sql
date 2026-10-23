-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2026 at 06:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aplikasi_sampah`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `created_at`) VALUES
(169, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-19 17:09:27'),
(170, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-19 17:10:04'),
(171, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:03:25'),
(172, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:04:51'),
(173, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:08:32'),
(174, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:16:44'),
(175, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:21:36'),
(176, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:22:02'),
(177, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:23:15'),
(178, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:23:33'),
(179, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:23:50'),
(180, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:24:47'),
(181, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:34:18'),
(182, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:34:33'),
(183, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:34:35'),
(184, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:38:57'),
(185, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:41:12'),
(186, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:41:35'),
(187, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:48:42'),
(188, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:49:06'),
(189, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:53:45'),
(190, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:54:04'),
(191, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:55:46'),
(192, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:57:11'),
(193, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 00:58:34'),
(194, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:03:07'),
(195, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:03:09'),
(196, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:03:44'),
(197, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:04:25'),
(198, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:04:29'),
(199, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:05:27'),
(200, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:05:57'),
(201, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:08:43'),
(202, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:13:16'),
(203, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:13:34'),
(204, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:13:49'),
(205, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:23:25'),
(206, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:23:30'),
(207, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:23:47'),
(208, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:24:17'),
(209, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:25:11'),
(210, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:29:52'),
(211, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:29:56'),
(212, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:32:36'),
(213, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:32:36'),
(214, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:33:37'),
(215, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:39:31'),
(216, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:40:18'),
(217, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:43:37'),
(218, 1, 'UPDATE_SETTINGS', 'Memperbarui profil bank sampah & parameter sistem', '127.0.0.1', '2026-09-20 01:43:37'),
(219, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:44:11'),
(220, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 01:56:28'),
(221, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 02:13:23'),
(222, 1, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 02:17:38'),
(223, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:18:42'),
(224, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:18:43'),
(225, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:19:18'),
(226, 1, 'UPDATE_SETTINGS', 'Memperbarui profil bank sampah & parameter sistem', '127.0.0.1', '2026-09-20 02:21:29'),
(227, 1, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 02:22:05'),
(228, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:24:10'),
(229, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:24:38'),
(230, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:25:01'),
(231, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:25:32'),
(232, 1, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 02:26:04'),
(233, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:41:41'),
(234, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:42:03'),
(235, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:42:08'),
(236, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:42:09'),
(237, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:42:29'),
(238, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:42:30'),
(239, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:42:41'),
(240, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:44:57'),
(241, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:44:57'),
(242, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:45:37'),
(243, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:48:46'),
(244, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 02:51:44'),
(245, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:04:44'),
(246, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:04:58'),
(247, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:46:05'),
(248, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:46:32'),
(249, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:46:32'),
(250, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:46:33'),
(251, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:47:00'),
(252, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:47:06'),
(253, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:47:08'),
(254, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 03:48:09'),
(255, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 03:58:38'),
(256, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 04:00:29'),
(257, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:00:41'),
(258, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:02:38'),
(259, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:03:48'),
(260, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:04:04'),
(261, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:04:53'),
(262, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 04:05:32'),
(263, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:12:50'),
(264, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:12:54'),
(265, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:12:56'),
(266, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:13:29'),
(267, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:13:30'),
(268, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:13:51'),
(269, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:13:53'),
(270, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 04:14:36'),
(271, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:15:12'),
(272, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:15:54'),
(273, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:15:54'),
(274, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:16:15'),
(275, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:16:19'),
(276, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:16:20'),
(277, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:16:50'),
(278, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:19:56'),
(279, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 04:24:06'),
(280, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:30:10'),
(281, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:43:25'),
(282, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 04:44:13'),
(283, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:44:22'),
(284, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:44:31'),
(285, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:45:37'),
(286, 4, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:47:53'),
(287, 1, 'LOGIN', 'Login berhasil', '127.0.0.1', '2026-09-20 04:50:29'),
(288, 4, 'LOGIN', 'Login berhasil', '192.168.1.6', '2026-09-20 04:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `buyers`
--

CREATE TABLE `buyers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `type` enum('perorangan','perusahaan') NOT NULL DEFAULT 'perorangan',
  `npwp` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buyers`
--

INSERT INTO `buyers` (`id`, `name`, `phone`, `email`, `address`, `company`, `type`, `npwp`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'CV Daur Ulang Nusantara', '081200000001', 'buyer1@local.test', 'Kawasan Industri Daur Ulang', 'CV Daur Ulang Nusantara', 'perusahaan', '00.000.000.0-000.000', 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL),
(2, 'PT Hijau Lestari', '081200000002', 'buyer2@local.test', 'Jl. Industri Hijau No. 20', 'PT Hijau Lestari', 'perusahaan', '00.000.000.0-000.000', 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL),
(3, 'Pembeli Umum', '081200000003', 'pembeli@local.test', 'Indonesia', NULL, 'perorangan', NULL, 'inactive', '2026-09-15 00:53:52', '2026-09-15 03:53:58', '2026-09-15 10:53:58');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED DEFAULT NULL,
  `message` text NOT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collection_items`
--

CREATE TABLE `collection_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `collection_id` bigint(20) UNSIGNED NOT NULL,
  `waste_type_id` bigint(20) UNSIGNED NOT NULL,
  `weight` decimal(12,3) NOT NULL DEFAULT 0.000,
  `price_per_unit` decimal(14,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(14,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collection_items`
--

INSERT INTO `collection_items` (`id`, `collection_id`, `waste_type_id`, `weight`, `price_per_unit`, `subtotal`, `notes`, `photo_url`, `created_at`, `updated_at`, `deleted_at`) VALUES
(8, 9, 2, 50.000, 35000.00, 1750000.00, 'berat bersih', '/uploads/collections/pickup-1789874798407-8109.jpg', '2026-09-20 03:26:38', '2026-09-20 03:26:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `collection_requests`
--

CREATE TABLE `collection_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `scheduled_time` time DEFAULT NULL,
  `request_note` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `status` enum('diajukan','dijadwalkan','diambil','ditimbang','selesai','ditolak','dibatalkan') NOT NULL DEFAULT 'diajukan',
  `rejected_reason` text DEFAULT NULL,
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `collection_requests`
--

INSERT INTO `collection_requests` (`id`, `code`, `user_id`, `company_id`, `address`, `latitude`, `longitude`, `scheduled_date`, `scheduled_time`, `request_note`, `photo_url`, `status`, `rejected_reason`, `assigned_to`, `created_at`, `updated_at`, `deleted_at`) VALUES
(9, 'COL-1789874558789', 4, 1, 'Jl. Gunung Laya RT001/RW002 Ds. Klayan', -6.73200000, 108.55230000, '2026-09-20', '10:22:00', '-', '/uploads/collections/pickup-1789874798407-8109.jpg', 'selesai', NULL, NULL, '2026-09-20 03:22:38', '2026-09-20 03:27:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `tax_number` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `address`, `phone`, `email`, `logo_url`, `tax_number`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Bank Sampah Terintegrasi', 'Jl. Lingkungan Bersih No. 1, Indonesia', '021-00000001', 'info@banksampah.local', NULL, NULL, 'active', '2026-09-15 00:53:52', '2026-09-15 11:32:24', NULL),
(2, 'Unit Pengelola Sampah Mandiri', 'Jl. Daur Ulang No. 10, Indonesia', '021-00000002', 'admin@pengelola.local', NULL, NULL, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference_type` varchar(50) NOT NULL,
  `reference_id` bigint(20) UNSIGNED NOT NULL,
  `document_type` enum('foto','nota','surat','bukti_timbang','bukti_transfer','lainnya') NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` bigint(20) UNSIGNED DEFAULT NULL,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `reference_type`, `reference_id`, `document_type`, `file_name`, `file_path`, `mime_type`, `file_size`, `uploaded_by`, `is_primary`, `created_at`, `updated_at`, `deleted_at`) VALUES
(9, 'collection_item', 7, 'bukti_timbang', 'Screenshot 2026-07-24 105857.png', '/uploads/collections/pickup-1789837381560-9844.png', 'image/png', 103388, 1, 1, '2026-09-19 17:03:01', '2026-09-20 03:20:47', '2026-09-20 10:20:47'),
(10, 'sales', 15, 'bukti_transfer', 'approval-1.png', '/uploads/payments/payment-1789837509281-4620.png', 'image/png', 364342, 1, 1, '2026-09-19 17:05:09', '2026-09-20 03:20:43', '2026-09-20 10:20:43'),
(11, 'collection_item', 8, 'bukti_timbang', 'images.jpg', '/uploads/collections/pickup-1789874798407-8109.jpg', 'image/jpeg', 49776, 1, 1, '2026-09-20 03:26:38', '2026-09-20 03:26:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `drop_points`
--

CREATE TABLE `drop_points` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` enum('unit_bank_sampah','dropbox_publik','tps3r_induk','sekolah_kampus','kantor_mitra') NOT NULL DEFAULT 'unit_bank_sampah',
  `address` text NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `operational_hours` varchar(100) DEFAULT '08:00 - 16:00 WIB',
  `operational_days` varchar(100) DEFAULT 'Senin - Sabtu',
  `accepted_waste_types` varchar(255) DEFAULT 'Organik, Plastik, Kertas, Logam',
  `capacity_kg` decimal(10,2) NOT NULL DEFAULT 500.00,
  `current_load_kg` decimal(10,2) NOT NULL DEFAULT 0.00,
  `pic_name` varchar(120) DEFAULT NULL,
  `pic_phone` varchar(30) DEFAULT NULL,
  `status` enum('aktif','hampir_penuh','penuh','pemeliharaan','nonaktif') NOT NULL DEFAULT 'aktif',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drop_points`
--

INSERT INTO `drop_points` (`id`, `code`, `name`, `category`, `address`, `district`, `latitude`, `longitude`, `operational_hours`, `operational_days`, `accepted_waste_types`, `capacity_kg`, `current_load_kg`, `pic_name`, `pic_phone`, `status`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'DP-JKT-001', 'Drop Point Sentra RW 05 Cilandak', 'unit_bank_sampah', 'Jl. Melati Indah No. 12, RT 05 / RW 05', 'Cilandak', -6.29210000, 106.80420000, '08:00 - 15:00 WIB', 'Senin - Sabtu', 'Plastik, Kertas/Kardus, Logam, Minyak Jelantah', 500.00, 320.00, 'Bambang Irawan', '081298765432', 'aktif', 'Pos penimbangan mandiri warga RW 05 dengan timbangan digital.', '2026-09-20 03:43:13', '2026-09-20 03:43:13', NULL),
(2, 'DP-JKT-002', 'Smart Dropbox Botol Plastik Stasiun MRT', 'dropbox_publik', 'Plaza Pintu Barat Stasiun MRT Fatmawati', 'Cilandak Barat', -6.29520000, 106.79380000, '06:00 - 22:00 WIB', 'Setiap Hari', 'Botol Plastik PET Bening, Kaleng Minuman', 200.00, 185.00, 'Dedi Suhendar (Petugas Stasiun)', '081311223344', 'hampir_penuh', 'Dropbox otomatis dengan reward poin langsung ke akun PilahKita.', '2026-09-20 03:43:13', '2026-09-20 03:43:13', NULL),
(3, 'DP-JKT-003', 'TPS3R Induk PilahKita Mandiri', 'tps3r_induk', 'Komplek Hanggar Pengolahan Sampah Terpadu No. 1', 'Pasar Minggu', -6.28450000, 106.82890000, '07:30 - 17:00 WIB', 'Senin - Minggu', 'Semua Jenis Sampah (Organik, Anorganik & B3)', 2000.00, 1150.00, 'Ahmad Fauzi (Supervisor TPS3R)', '081199887766', 'aktif', 'Fasilitas pusat pencacahan plastik, rumah pengomposan aerobik dan maggot BSF.', '2026-09-20 03:43:13', '2026-09-20 03:43:13', NULL),
(4, 'DP-JKT-004', 'Eco-Corner Kampus Terpadu Nusantara', 'sekolah_kampus', 'Gedung Rektorat Lt. 1, Universitas Nusantara', 'Kebayoran Lama', -6.24100000, 106.78200000, '08:00 - 17:00 WIB', 'Senin - Jumat', 'Kertas HVS, Kardus Buku, Botol Kemasan, Tutup Botol', 350.00, 90.00, 'Siti Rahma (Green Campus Ambassador)', '081577889900', 'aktif', 'Drop point edukasi pemilahan sampah civitas akademika.', '2026-09-20 03:43:13', '2026-09-20 03:43:13', NULL),
(5, 'DP-JKT-005', 'Drop Point Mall Hijau Lestari', 'kantor_mitra', 'Loading Dock B Ground Floor, Mall Hijau Lestari', 'Pancoran', -6.25050000, 106.84000000, '10:00 - 20:00 WIB', 'Setiap Hari', 'Kardus Packaging, Plastik Wrapping, Kaleng Logam', 800.00, 780.00, 'Hendra Gunawan (Facility Manager)', '081822334455', 'penuh', 'Memerlukan armada pengangkutan segera karena muatan sudah mencapai 97%.', '2026-09-20 03:43:13', '2026-09-20 03:43:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `drop_point_logs`
--

CREATE TABLE `drop_point_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `drop_point_id` bigint(20) UNSIGNED NOT NULL,
  `emptied_by` bigint(20) UNSIGNED DEFAULT NULL,
  `weight_collected_kg` decimal(10,2) NOT NULL DEFAULT 0.00,
  `collection_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drop_point_logs`
--

INSERT INTO `drop_point_logs` (`id`, `drop_point_id`, `emptied_by`, `weight_collected_kg`, `collection_date`, `notes`, `created_at`) VALUES
(1, 1, 3, 240.00, '2026-09-18', 'Pengangkutan rutin mingguan muatan plastik dan kardus ke gudang induk.', '2026-09-20 03:43:13'),
(2, 3, 3, 500.00, '2026-09-19', 'Pemindahan bahan baku organik terpilah ke hangar pengomposan.', '2026-09-20 03:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `education_articles`
--

CREATE TABLE `education_articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `category` enum('pilah_organik','pilah_plastik','pilah_kertas_logam','limbah_b3','kompos_mandiri','info_bank_sampah') NOT NULL,
  `summary` text NOT NULL,
  `content` longtext NOT NULL,
  `thumbnail_icon` varchar(50) DEFAULT 'bi-recycle',
  `reading_time` int(11) NOT NULL DEFAULT 3,
  `author_name` varchar(100) DEFAULT 'Tim Redaksi PilahKita',
  `cover_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `education_articles`
--

INSERT INTO `education_articles` (`id`, `title`, `slug`, `category`, `summary`, `content`, `thumbnail_icon`, `reading_time`, `author_name`, `cover_image`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Cara Tepat Memilah Sampah Plastik agar Bernilai Jual Tinggi', 'cara-tepat-memilah-sampah-plastik', 'pilah_plastik', 'Pelajari cara membersihkan, mengeringkan, dan membedakan jenis plastik (PET, HDPE) agar dihargai maksimal oleh Bank Sampah.', '### 1. Pisahkan Berdasarkan Jenis Plastik\nTidak semua plastik bernilai sama. Plastik PET (seperti botol air mineral bening) memiliki harga jual lebih tinggi dibandingkan plastik multilayer (kemasan sachet).\n\n### 2. Cuci dan Keringkan\nBotol atau wadah plastik yang kotor terkena sisa minuman/minyak akan menurunkan kualitas daur ulang. Bilas sebentar dengan air dan tiriskan hingga kering.\n\n### 3. Lepas Tutup dan Label\nTutup botol umumnya berbahan HDPE/PP sedangkan botolnya berbahan PET. Memisahkan keduanya mempermudah petugas daur ulang dan menaikkan timbangan bersih.\n\n### 4. Remas atau Pipihkan\nPipihkan botol atau kardus sebelum dikumpulkan untuk menghemat ruang penyimpanan di rumah Anda.', 'bi-recycle', 3, 'Tim Redaksi PilahKita', NULL, '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(2, 'Panduan Praktis Membuat Kompos Sendiri di Rumah (Metode Takakura & Ember Tumpuk)', 'panduan-membuat-kompos-mandiri', 'kompos_mandiri', 'Ubah sisa sayuran, kulit buah, dan daun kering menjadi pupuk organik subur untuk tanaman pekarangan.', '### Bahan yang Dibutuhkan:\n- Ember atau keranjang berlubang ventilasi\n- Sampah organik basah (sisa sayur, kulit buah, ampas kopi/teh)\n- Sampah cokelat kering (daun kering, serbuk gergaji, sekam)\n- Bio-aktivator (cairan EM4 atau sedikit kompos jadi)\n\n### Langkah Pengerjaan:\n1. **Lapisan Dasar**: Letakkan sampah cokelat kering di dasar ember setebal 5 cm.\n2. **Masukkan Sampah Organik**: Potong kecil sisa sayur/buah agar cepat terurai, lalu masukkan ke dalam wadah.\n3. **Taburi Bioaktivator**: Percikkan cairan EM4 yang telah diencerkan dengan air gula.\n4. **Tutup Rapat**: Jaga kelembaban sekitar 50% (tidak terlalu becek dan tidak kering). Aduk seminggu sekali.\n5. **Panen**: Dalam waktu 3-4 minggu, kompos akan berwarna kehitaman seperti tanah gembur dan tidak berbau busuk. Kompos siap dipakai!', 'bi-flower1', 4, 'Tim Redaksi PilahKita', NULL, '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(3, 'Mengenal Limbah B3 Rumah Tangga dan Bahayanya', 'mengenal-limbah-b3-rumah-tangga', 'limbah_b3', 'Baterai bekas, lampu neon, botol aerosol, dan obat kedaluwarsa tidak boleh dibuang ke tempat sampah biasa!', '### Apa Itu Limbah B3 Rumah Tangga?\nLimbah Bahan Berbahaya dan Beracun (B3) adalah limbah yang mengandung zat beracun, mudah terbakar, atau korosif.\n\n### Contoh Limbah B3 Sehari-hari:\n- Baterai bekas dan aki kendaraan\n- Lampu tabung (TL/neon) yang mengandung uap merkuri\n- Kaleng aerosol (semprotan nyamuk, hairspray, cat pylox)\n- Wadah sisa pemutih dan pembersih lantai kimiawi\n- Obat-obatan kedaluwarsa dan jarum suntik\n\n### Bahaya Pembuangan Sembarangan:\nJika dibuang ke TPA atau sungai, logam berat seperti timbal, raksa, dan kadmium dapat meresap ke dalam air tanah yang dikonsumsi masyarakat.\n\n### Solusi Penanganan:\nSimpan limbah B3 di wadah terpisah yang kering dan berlabel khusus, lalu serahkan ke TPS3R PilahKita yang memiliki fasilitas drop point B3 berizin.', 'bi-radioactive', 5, 'Tim Redaksi PilahKita', NULL, '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(4, 'Cara Memaksimalkan Saldo Tabungan Bank Sampah PilahKita', 'memaksimalkan-saldo-tabungan-bank-sampah', 'info_bank_sampah', 'Tips dan trik mengumpulkan sampah terpilah secara rutin agar tabungan cepat bertambah untuk ditukar sembako.', '### 1. Buat Sudut Pemilahan di Dapur\nSediakan 3 wadah terpisah di rumah: Organik, Anorganik Daur Ulang (kertas, plastik, logam), dan Residu.\n\n### 2. Kumpulkan Kardus & Kaleng Bekas Belanja Online\nKardus packing dan kaleng susu memiliki bobot timbangan yang solid dan harga per kg yang stabil.\n\n### 3. Manfaatkan Jadwal Jemput Rutin (Pickup)\nGunakan fitur Pengumpulan di aplikasi PilahKita. Petugas kami akan datang langsung ke alamat rumah Anda, menimbang di tempat, dan saldo otomatis masuk ke dompet digital Anda.\n\n### 4. Tukarkan Saldo dengan Sembako Hemat\nGunakan menu Reward di PilahKita untuk menukarkan saldo Anda dengan Beras 5kg, Minyak Goreng, atau Token Listrik tanpa biaya admin!', 'bi-wallet2', 3, 'Tim Redaksi PilahKita', NULL, '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(5, 'Inovasi Biopori & Pemilahan Organik Berkah', 'inovasi-biopori-pemilahan-organik-berkah-1789865323047', 'kompos_mandiri', 'Mengubah sisa organik dapur menjadi kompos bernutrisi tinggi dan mencegah banjir dengan lubang biopori.', '1. Siapkan lubang biopori sedalam 80-100 cm di pekarangan rumah.\n2. Masukkan sampah organik daun dan sisa sayuran setiap hari.\n3. Siram sedikit air lindi atau mikroorganisme lokal.\n4. Panen kompos matang setiap 2-3 bulan.', 'bi-newspaper', 4, 'Redaksi Ahli Lingkungan PilahKita', NULL, '2026-09-20 00:48:43', '2026-09-20 00:48:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `actor_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('info','success','warning','error') NOT NULL DEFAULT 'info',
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `actor_user_id`, `type`, `title`, `message`, `icon`, `reference_type`, `reference_id`, `is_read`, `read_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(45, 4, 4, 'info', 'Pickup diajukan', 'Permintaan COL-1789874558789 berhasil diajukan.', 'bi-truck', 'collection', 9, 1, '2026-09-20 10:24:11', '2026-09-20 03:22:38', '2026-09-20 03:24:11', NULL),
(46, 4, 1, 'info', 'Status pickup COL-1789874558789', 'Status pickup COL-1789874558789 diubah menjadi dijadwalkan.', 'bi-truck', 'collection', 9, 1, '2026-09-20 10:24:09', '2026-09-20 03:23:08', '2026-09-20 03:24:09', NULL),
(47, 4, 1, 'info', 'Status pickup COL-1789874558789', 'Status pickup COL-1789874558789 diubah menjadi diambil.', 'bi-truck', 'collection', 9, 0, NULL, '2026-09-20 03:24:31', '2026-09-20 03:24:31', NULL),
(48, 4, 1, 'info', 'Status pickup COL-1789874558789', 'Status pickup COL-1789874558789 diubah menjadi ditimbang.', 'bi-truck', 'collection', 9, 0, NULL, '2026-09-20 03:24:40', '2026-09-20 03:24:40', NULL),
(49, 4, 1, 'success', 'Status pickup COL-1789874558789', 'Status pickup COL-1789874558789 diubah menjadi selesai.', 'bi-truck', 'collection', 9, 0, NULL, '2026-09-20 03:27:05', '2026-09-20 03:27:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `operational_expenses`
--

CREATE TABLE `operational_expenses` (
  `id` int(11) NOT NULL,
  `expense_code` varchar(50) NOT NULL,
  `category` enum('armada_bensin','karung_tali','pemeliharaan_alat','konsumsi_lembur','listrik_air','lainnya') NOT NULL DEFAULT 'lainnya',
  `title` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `expense_date` date NOT NULL,
  `pic_name` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `operational_expenses`
--

INSERT INTO `operational_expenses` (`id`, `expense_code`, `category`, `title`, `amount`, `expense_date`, `pic_name`, `notes`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'BOP-2026-0001', 'armada_bensin', 'BBM Pertalite Motor Roda Tiga Viar Armada 1', 50000.00, '2026-09-20', 'Budi Santoso', 'Pengisian 5 liter bensin penjemputan zona RW 03', NULL, '2026-09-20 09:23:09', NULL, NULL),
(2, 'BOP-2026-0002', 'karung_tali', 'Beli 20 Lembar Karung Goni & 1 Gulung Tali Rafia', 65000.00, '2026-09-20', 'Ahmad Fauzi', 'Perlengkapan sortir gudang timbangan', NULL, '2026-09-20 09:23:09', NULL, NULL),
(3, 'BOP-2026-0003', 'pemeliharaan_alat', 'Oli Mesin & Servis Timbangan Gantung Digital', 75000.00, '2026-09-20', 'Budi Santoso', 'Kalibrasi rutin timbangan 100 kg', NULL, '2026-09-20 09:23:09', NULL, NULL),
(4, 'BOP-2026-0004', 'konsumsi_lembur', 'Air Mineral Galon & Snack Petugas Timbang', 35000.00, '2026-09-20', 'Siti Rahma', 'Konsumsi posko penimbangan mingguan', NULL, '2026-09-20 09:23:09', NULL, NULL),
(5, 'BOP-2026-0005', 'armada_bensin', 'Bensin Tes Sistem', 25000.00, '2026-09-20', 'Tester', NULL, 1, '2026-09-20 09:24:10', NULL, NULL),
(6, 'BOP-2026-0006', 'armada_bensin', 'Bensin Tes Sistem', 25000.00, '2026-09-20', 'Tester', NULL, 1, '2026-09-20 09:25:01', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(120) NOT NULL,
  `module` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `is_menu` tinyint(1) NOT NULL DEFAULT 1,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `code`, `name`, `module`, `description`, `is_menu`, `parent_id`, `icon`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'dashboard.read', 'Lihat Dashboard', 'dashboard', 'Melihat dashboard.', 1, NULL, 'bi-speedometer2', 1, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(2, 'users.read', 'Lihat Pengguna', 'users', 'Melihat data pengguna.', 1, NULL, 'bi-people', 10, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(3, 'users.create', 'Tambah Pengguna', 'users', 'Menambah pengguna.', 0, 2, NULL, 11, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(4, 'users.update', 'Edit Pengguna', 'users', 'Mengubah pengguna.', 0, 2, NULL, 12, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(5, 'users.delete', 'Hapus Pengguna', 'users', 'Menghapus pengguna.', 0, 2, NULL, 13, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(6, 'roles.read', 'Lihat Role', 'roles', 'Melihat role dan permission.', 1, NULL, 'bi-shield-lock', 20, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(7, 'roles.manage', 'Kelola Role & Permission', 'roles', 'Mengatur role dan permission.', 0, 6, NULL, 21, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(8, 'waste.read', 'Lihat Jenis Sampah', 'waste', 'Melihat jenis sampah.', 1, NULL, 'bi-recycle', 30, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(9, 'waste.create', 'Tambah Jenis Sampah', 'waste', 'Menambah jenis sampah.', 0, 8, NULL, 31, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(10, 'waste.update', 'Edit Jenis Sampah', 'waste', 'Mengubah jenis sampah.', 0, 8, NULL, 32, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(11, 'waste.delete', 'Hapus Jenis Sampah', 'waste', 'Menghapus jenis sampah.', 0, 8, NULL, 33, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(12, 'waste.manage', 'Kelola Jenis Sampah', 'waste', 'Kelola penuh jenis sampah.', 0, 8, NULL, 34, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(13, 'collection.read', 'Lihat Pengumpulan', 'collection', 'Melihat permintaan pickup.', 1, NULL, 'bi-truck', 40, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(14, 'collection.create', 'Ajukan Pickup', 'collection', 'Mengajukan pickup.', 0, 13, NULL, 41, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(15, 'collection.update', 'Update Pengumpulan', 'collection', 'Mengubah data/status pickup.', 0, 13, NULL, 42, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(16, 'collection.manage', 'Kelola Pengumpulan', 'collection', 'Kelola proses pickup.', 0, 13, NULL, 43, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(17, 'collection.approve', 'Validasi Pengumpulan', 'collection', 'Validasi hasil pengumpulan.', 0, 13, NULL, 44, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(18, 'sales.read', 'Lihat Penjualan', 'sales', 'Melihat transaksi penjualan.', 1, NULL, 'bi-cart', 50, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(19, 'sales.create', 'Buat Penjualan', 'sales', 'Membuat transaksi penjualan.', 0, 18, NULL, 51, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(20, 'sales.update', 'Edit Penjualan', 'sales', 'Mengubah transaksi.', 0, 18, NULL, 52, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(21, 'sales.manage', 'Kelola Penjualan', 'sales', 'Kelola transaksi dan pembayaran.', 0, 18, NULL, 53, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(22, 'wallet.read', 'Lihat Saldo', 'wallet', 'Melihat saldo dan riwayat.', 1, NULL, 'bi-wallet2', 60, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(23, 'wallet.transaction', 'Transaksi Wallet', 'wallet', 'Memproses transaksi wallet.', 0, 22, NULL, 61, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(24, 'reports.read', 'Lihat Laporan', 'reports', 'Melihat laporan dan monitoring.', 1, NULL, 'bi-bar-chart', 70, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(25, 'notifications.read', 'Lihat Notifikasi', 'notifications', 'Melihat notifikasi.', 1, NULL, 'bi-bell', 80, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(26, 'notifications.manage', 'Kelola Notifikasi', 'notifications', 'Mengelola notifikasi.', 0, 25, NULL, 81, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(27, 'companies.read', 'Lihat Perusahaan', 'companies', 'Melihat perusahaan.', 1, NULL, 'bi-building', 90, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(28, 'companies.manage', 'Kelola Perusahaan', 'companies', 'Mengelola perusahaan.', 0, 27, NULL, 91, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(29, 'buyers.read', 'Lihat Pembeli', 'buyers', 'Melihat pembeli.', 1, NULL, 'bi-person-badge', 100, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(30, 'buyers.manage', 'Kelola Pembeli', 'buyers', 'Mengelola pembeli.', 0, 29, NULL, 101, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(31, 'documents.read', 'Lihat Dokumen', 'documents', 'Melihat dokumen.', 0, NULL, 'bi-file-earmark', 110, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(32, 'documents.manage', 'Kelola Dokumen', 'documents', 'Upload dan kelola dokumen.', 0, 31, NULL, 111, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(33, 'withdrawal.read', 'Lihat Penarikan', 'withdrawal', 'Melihat penarikan.', 1, NULL, 'bi-cash-stack', 120, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(34, 'withdrawal.manage', 'Kelola Penarikan', 'withdrawal', 'Memproses penarikan.', 0, 33, NULL, 121, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(35, 'activity.read', 'Lihat Log Aktivitas', 'activity', 'Melihat log aktivitas.', 1, NULL, 'bi-activity', 130, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52'),
(40, 'processing.read', 'Lihat Pengolahan', 'processing', 'Melihat daftar dan progres pengolahan sampah', 1, NULL, 'bi-gear-wide-connected', 45, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(41, 'processing.manage', 'Kelola Pengolahan', 'processing', 'Membuat batch dan panen hasil pengolahan', 0, NULL, NULL, 46, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(42, 'inventory.read', 'Lihat Stok Gudang', 'inventory', 'Melihat stok gudang dan mutasi sampah', 1, NULL, 'bi-boxes', 47, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(43, 'inventory.manage', 'Kelola Stok Gudang', 'inventory', 'Melakukan stock opname dan penyesuaian stok', 0, NULL, NULL, 48, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(44, 'rewards.read', 'Lihat Hadiah & Sembako', 'rewards', 'Melihat katalog reward dan riwayat penukaran', 1, NULL, 'bi-gift', 65, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(45, 'rewards.manage', 'Kelola Hadiah & Sembako', 'rewards', 'Mengelola stok hadiah dan verifikasi penukaran', 0, NULL, NULL, 66, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(46, 'education.read', 'Lihat Edukasi 3R', 'education', 'Membaca panduan pemilahan sampah dan artikel 3R', 1, NULL, 'bi-book-half', 140, 'active', '2026-09-20 00:32:00', '2026-09-20 00:32:00'),
(47, 'education.manage', 'Kelola Edukasi 3R', 'education', 'Menambah, mengedit, dan menghapus artikel edukasi', 0, NULL, NULL, 141, 'active', '2026-09-20 00:44:27', '2026-09-20 00:44:27'),
(48, 'schedules.read', 'Lihat Jadwal & Rute', 'schedules', 'Melihat jadwal rutin penjemputan sampah per wilayah', 1, NULL, 'bi-calendar2-week', 38, 'active', '2026-09-20 00:52:01', '2026-09-20 00:52:01'),
(49, 'schedules.manage', 'Kelola Jadwal & Rute', 'schedules', 'Mengatur rute, jadwal penjemputan, dan catatan realisasi', 0, NULL, NULL, 39, 'active', '2026-09-20 00:52:01', '2026-09-20 00:52:01'),
(50, 'complaints.read', 'Lihat Pengaduan', 'complaints', 'Melihat tiket pengaduan sampah liar.', 1, NULL, NULL, 0, 'active', '2026-09-20 01:01:00', '2026-09-20 01:01:00'),
(51, 'complaints.create', 'Buat Pengaduan', 'complaints', 'Membuat laporan pengaduan sampah baru.', 1, NULL, NULL, 0, 'active', '2026-09-20 01:01:00', '2026-09-20 01:01:00'),
(52, 'complaints.manage', 'Kelola Pengaduan', 'complaints', 'Memproses status dan tindak lanjut aduan.', 1, NULL, NULL, 0, 'active', '2026-09-20 01:01:00', '2026-09-20 01:01:00'),
(60, 'drop_points.read', 'Lihat Pos Drop Point', 'drop_points', 'Melihat direktori dan lokasi pos drop point', 1, NULL, 'bi-geo-alt', 44, 'active', '2026-09-20 03:43:13', '2026-09-20 03:43:13'),
(61, 'drop_points.manage', 'Kelola Pos Drop Point', 'drop_points', 'Mengatur data pos drop point dan update muatan kontainer', 0, NULL, NULL, 45, 'active', '2026-09-20 03:43:13', '2026-09-20 03:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `pickup_schedules`
--

CREATE TABLE `pickup_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `zone_name` varchar(150) NOT NULL,
  `coverage_area` varchar(255) NOT NULL,
  `day_of_week` varchar(100) NOT NULL,
  `start_time` varchar(10) NOT NULL DEFAULT '08:00',
  `end_time` varchar(10) NOT NULL DEFAULT '12:00',
  `vehicle_type` varchar(100) NOT NULL DEFAULT 'Tossa Roda Tiga',
  `driver_name` varchar(100) NOT NULL,
  `target_capacity_kg` decimal(10,2) NOT NULL DEFAULT 300.00,
  `status` enum('active','inactive','maintenance') NOT NULL DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pickup_schedules`
--

INSERT INTO `pickup_schedules` (`id`, `zone_name`, `coverage_area`, `day_of_week`, `start_time`, `end_time`, `vehicle_type`, `driver_name`, `target_capacity_kg`, `status`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Zona 1 - RW 01 & 02 Kelurahan Asri', 'RT 01 s/d RT 08 Jl. Merdeka & Jl. Cempaka', 'Senin & Kamis', '08:00', '11:30', 'Motor Tossa 01 (B 4512 SP)', 'Pak Budi & Tim', 350.00, 'active', 'Fokus sampah anorganik botol plastik dan kardus.', '2026-09-20 00:52:01', '2026-09-20 00:52:01', NULL),
(2, 'Zona 2 - Kawasan Perumahan Griya Indah', 'Blok A, B, C, D dan Ruko Niaga', 'Selasa & Jumat', '08:30', '12:00', 'Pickup L300 (B 9821 TTR)', 'Pak Joko Santoso', 500.00, 'active', 'Warga dimohon menaruh karung sampah terpilah di depan pagar.', '2026-09-20 00:52:01', '2026-09-20 00:52:01', NULL),
(3, 'Zona 3 - RW 03 & Sentra Pasar Tradisional', 'Kompleks Kios Buah & Pertokoan Timur', 'Rabu & Sabtu', '07:30', '11:00', 'Motor Tossa 02 (B 3320 TTR)', 'Pak Hendra Gunawan', 400.00, 'active', 'Pengangkutan sampah organik basah langsung dibawa ke pengolahan maggot.', '2026-09-20 00:52:01', '2026-09-20 00:52:01', NULL),
(4, 'Zona 4 - RW 04 Kampung Hijau Mandiri', 'RT 01 s/d RT 05 Bantaran Bersih', 'Rabu & Sabtu', '13:00', '16:00', 'Motor Tossa 01 (B 4512 SP)', 'Pak Budi & Tim', 250.00, 'active', 'Jadwal sore hari setelah warga memilah dari rumah.', '2026-09-20 00:52:01', '2026-09-20 00:52:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pickup_schedule_logs`
--

CREATE TABLE `pickup_schedule_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `schedule_id` bigint(20) UNSIGNED NOT NULL,
  `execution_date` date NOT NULL,
  `households_served` int(11) NOT NULL DEFAULT 0,
  `actual_weight_kg` decimal(10,2) NOT NULL DEFAULT 0.00,
  `officer_notes` text DEFAULT NULL,
  `recorded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pickup_schedule_logs`
--

INSERT INTO `pickup_schedule_logs` (`id`, `schedule_id`, `execution_date`, `households_served`, `actual_weight_kg`, `officer_notes`, `recorded_by`, `created_at`) VALUES
(1, 1, '2026-09-18', 45, 342.50, 'Rute lancar, warga antusias menyetor sampah plastik bersih.', 1, '2026-09-20 00:52:01'),
(2, 2, '2026-09-19', 60, 485.00, 'Volume kardus dan kaleng cukup tinggi di blok ruko niaga.', 1, '2026-09-20 00:52:01'),
(3, 3, '2026-09-20', 35, 388.00, 'Organik sayuran segar terkumpul penuh untuk biokonversi maggot.', 1, '2026-09-20 00:52:01');

-- --------------------------------------------------------

--
-- Table structure for table `reward_items`
--

CREATE TABLE `reward_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(120) NOT NULL,
  `category` enum('sembako','voucher','merchandise','bibit_pupuk') NOT NULL DEFAULT 'sembako',
  `points_cost` decimal(14,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `unit` varchar(30) NOT NULL DEFAULT 'pcs',
  `photo_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive','expired') NOT NULL DEFAULT 'active',
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reward_items`
--

INSERT INTO `reward_items` (`id`, `code`, `name`, `category`, `points_cost`, `stock`, `unit`, `photo_url`, `description`, `status`, `expiry_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'RWD-SBK-01', 'Beras Premium 5 Kg', 'sembako', 75000.00, 25, 'sak', '/images/rewards/beras.png', 'Beras putih pulen kualitas premium kemasan 5 kg.', 'active', '2027-03-20', '2026-09-20 00:32:00', '2026-09-20 00:44:27', NULL),
(2, 'RWD-SBK-02', 'Minyak Goreng 2 Liter', 'sembako', 35000.00, 30, 'pouch', '/images/rewards/minyak.png', 'Minyak goreng kelapa sawit higienis kemasan pouch 2 liter.', 'active', '2027-03-20', '2026-09-20 00:32:00', '2026-09-20 00:44:27', NULL),
(3, 'RWD-SBK-03', 'Gula Pasir 1 Kg', 'sembako', 18000.00, 39, 'bungkus', '/images/rewards/gula.png', 'Gula pasir murni kristal putih kemasan 1 kg.', 'active', '2027-03-20', '2026-09-20 00:32:00', '2026-09-20 00:44:27', NULL),
(4, 'RWD-MRC-01', 'Tumbler Stainless PilahKita', 'merchandise', 45000.00, 15, 'pcs', '/images/rewards/tumbler.png', 'Tumbler termos ramah lingkungan tahan panas/dingin 12 jam (500ml).', 'active', '2027-03-20', '2026-09-20 00:32:00', '2026-09-20 00:44:27', NULL),
(5, 'RWD-BIB-01', 'Pupuk Kompos Organik 5 Kg', 'bibit_pupuk', 20000.00, 50, 'kantong', '/images/rewards/kompos.png', 'Pupuk organik padat kaya nutrisi hasil daur ulang Bank Sampah PilahKita.', 'active', '2027-03-20', '2026-09-20 00:32:00', '2026-09-20 00:44:27', NULL),
(6, 'RWD-VCR-01', 'Token Listrik PLN Rp 50.000', 'voucher', 52000.00, 100, 'voucher', '/images/rewards/pln.png', 'Voucher isi ulang token listrik PLN prabayar nominal Rp 50.000.', 'active', '2027-03-20', '2026-09-20 00:32:00', '2026-09-20 00:44:27', NULL),
(7, 'RWD-VOU-260920394', 'Voucher Listrik PLN Rp 20.000', 'voucher', 21000.00, 50, 'token', '/images/rewards/default.png', 'Token listrik prabayar PLN 20 ribu langsung dikirim via chat atau WhatsApp.', 'active', '2026-12-31', '2026-09-20 00:48:43', '2026-09-20 00:48:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reward_redemptions`
--

CREATE TABLE `reward_redemptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reward_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_points` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','ready','completed','rejected') NOT NULL DEFAULT 'pending',
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reward_redemptions`
--

INSERT INTO `reward_redemptions` (`id`, `code`, `user_id`, `reward_id`, `quantity`, `total_points`, `status`, `processed_by`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'RWD-20260920-6156', 4, 3, 1, 18000.00, 'ready', 1, 'Tukar gula untuk konsumsi demo', '2026-09-20 00:34:35', '2026-09-20 00:37:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(60) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `is_system`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'superadmin', 'Super Admin', 'Akses penuh seluruh sistem.', 1, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL),
(2, 'admin_pengelola', 'Admin Pengelola', 'Kelola master data, pengumpulan, penjualan dan laporan.', 1, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL),
(3, 'petugas_pengumpulan', 'Petugas Pengumpulan', 'Pickup, penimbangan dan update status lapangan.', 1, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL),
(4, 'nasabah', 'Nasabah', 'Mengajukan pickup dan mengelola transaksi/saldo.', 1, 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES
(1, 1, 1, '2026-09-15 00:53:52'),
(2, 1, 2, '2026-09-15 00:53:52'),
(3, 1, 6, '2026-09-15 00:53:52'),
(4, 1, 8, '2026-09-15 00:53:52'),
(5, 1, 13, '2026-09-15 00:53:52'),
(6, 1, 18, '2026-09-15 00:53:52'),
(7, 1, 22, '2026-09-15 00:53:52'),
(8, 1, 24, '2026-09-15 00:53:52'),
(9, 1, 25, '2026-09-15 00:53:52'),
(10, 1, 27, '2026-09-15 00:53:52'),
(11, 1, 29, '2026-09-15 00:53:52'),
(12, 1, 31, '2026-09-15 00:53:52'),
(13, 1, 33, '2026-09-15 00:53:52'),
(14, 1, 35, '2026-09-15 00:53:52'),
(15, 1, 3, '2026-09-15 00:53:52'),
(16, 1, 4, '2026-09-15 00:53:52'),
(17, 1, 5, '2026-09-15 00:53:52'),
(18, 1, 7, '2026-09-15 00:53:52'),
(19, 1, 9, '2026-09-15 00:53:52'),
(20, 1, 10, '2026-09-15 00:53:52'),
(21, 1, 11, '2026-09-15 00:53:52'),
(22, 1, 12, '2026-09-15 00:53:52'),
(23, 1, 14, '2026-09-15 00:53:52'),
(24, 1, 15, '2026-09-15 00:53:52'),
(25, 1, 16, '2026-09-15 00:53:52'),
(26, 1, 17, '2026-09-15 00:53:52'),
(27, 1, 19, '2026-09-15 00:53:52'),
(28, 1, 20, '2026-09-15 00:53:52'),
(29, 1, 21, '2026-09-15 00:53:52'),
(30, 1, 23, '2026-09-15 00:53:52'),
(31, 1, 26, '2026-09-15 00:53:52'),
(32, 1, 28, '2026-09-15 00:53:52'),
(33, 1, 30, '2026-09-15 00:53:52'),
(34, 1, 32, '2026-09-15 00:53:52'),
(35, 1, 34, '2026-09-15 00:53:52'),
(64, 2, 35, '2026-09-15 00:53:52'),
(65, 2, 30, '2026-09-15 00:53:52'),
(66, 2, 29, '2026-09-15 00:53:52'),
(67, 2, 17, '2026-09-15 00:53:52'),
(68, 2, 14, '2026-09-15 00:53:52'),
(69, 2, 16, '2026-09-15 00:53:52'),
(70, 2, 13, '2026-09-15 00:53:52'),
(71, 2, 15, '2026-09-15 00:53:52'),
(72, 2, 28, '2026-09-15 00:53:52'),
(73, 2, 27, '2026-09-15 00:53:52'),
(74, 2, 1, '2026-09-15 00:53:52'),
(75, 2, 32, '2026-09-15 00:53:52'),
(76, 2, 31, '2026-09-15 00:53:52'),
(77, 2, 26, '2026-09-15 00:53:52'),
(78, 2, 25, '2026-09-15 00:53:52'),
(79, 2, 24, '2026-09-15 00:53:52'),
(80, 2, 19, '2026-09-15 00:53:52'),
(81, 2, 21, '2026-09-15 00:53:52'),
(82, 2, 18, '2026-09-15 00:53:52'),
(83, 2, 20, '2026-09-15 00:53:52'),
(84, 2, 3, '2026-09-15 00:53:52'),
(85, 2, 2, '2026-09-15 00:53:52'),
(86, 2, 4, '2026-09-15 00:53:52'),
(87, 2, 22, '2026-09-15 00:53:52'),
(88, 2, 23, '2026-09-15 00:53:52'),
(89, 2, 9, '2026-09-15 00:53:52'),
(90, 2, 11, '2026-09-15 00:53:52'),
(91, 2, 12, '2026-09-15 00:53:52'),
(92, 2, 8, '2026-09-15 00:53:52'),
(93, 2, 10, '2026-09-15 00:53:52'),
(94, 2, 34, '2026-09-15 00:53:52'),
(95, 2, 33, '2026-09-15 00:53:52'),
(127, 3, 14, '2026-09-15 00:53:52'),
(128, 3, 13, '2026-09-15 00:53:52'),
(129, 3, 15, '2026-09-15 00:53:52'),
(130, 3, 1, '2026-09-15 00:53:52'),
(131, 3, 32, '2026-09-15 00:53:52'),
(132, 3, 31, '2026-09-15 00:53:52'),
(133, 3, 25, '2026-09-15 00:53:52'),
(134, 3, 24, '2026-09-15 00:53:52'),
(135, 3, 22, '2026-09-15 00:53:52'),
(136, 3, 8, '2026-09-15 00:53:52'),
(142, 4, 14, '2026-09-15 00:53:52'),
(143, 4, 13, '2026-09-15 00:53:52'),
(144, 4, 1, '2026-09-15 00:53:52'),
(145, 4, 31, '2026-09-15 00:53:52'),
(146, 4, 25, '2026-09-15 00:53:52'),
(147, 4, 19, '2026-09-15 00:53:52'),
(148, 4, 18, '2026-09-15 00:53:52'),
(149, 4, 22, '2026-09-15 00:53:52'),
(150, 4, 8, '2026-09-15 00:53:52'),
(151, 1, 40, '2026-09-20 00:32:00'),
(152, 1, 41, '2026-09-20 00:32:00'),
(153, 1, 42, '2026-09-20 00:32:00'),
(154, 1, 43, '2026-09-20 00:32:00'),
(155, 1, 44, '2026-09-20 00:32:00'),
(156, 1, 45, '2026-09-20 00:32:00'),
(157, 1, 46, '2026-09-20 00:32:00'),
(158, 2, 40, '2026-09-20 00:32:00'),
(159, 2, 41, '2026-09-20 00:32:00'),
(160, 2, 42, '2026-09-20 00:32:00'),
(161, 2, 43, '2026-09-20 00:32:00'),
(162, 2, 44, '2026-09-20 00:32:00'),
(163, 2, 45, '2026-09-20 00:32:00'),
(164, 2, 46, '2026-09-20 00:32:00'),
(165, 3, 46, '2026-09-20 00:32:00'),
(166, 3, 42, '2026-09-20 00:32:00'),
(167, 3, 41, '2026-09-20 00:32:00'),
(168, 3, 40, '2026-09-20 00:32:00'),
(169, 3, 44, '2026-09-20 00:32:00'),
(172, 4, 46, '2026-09-20 00:32:00'),
(173, 4, 44, '2026-09-20 00:32:00'),
(175, 1, 47, '2026-09-20 00:44:27'),
(176, 2, 47, '2026-09-20 00:44:27'),
(177, 1, 48, '2026-09-20 00:52:01'),
(178, 1, 49, '2026-09-20 00:52:01'),
(179, 2, 48, '2026-09-20 00:52:01'),
(180, 2, 49, '2026-09-20 00:52:01'),
(181, 3, 48, '2026-09-20 00:52:01'),
(182, 3, 49, '2026-09-20 00:52:01'),
(183, 4, 48, '2026-09-20 00:52:01'),
(184, 1, 50, '2026-09-20 01:01:00'),
(185, 1, 51, '2026-09-20 01:01:00'),
(186, 1, 52, '2026-09-20 01:01:00'),
(187, 2, 50, '2026-09-20 01:01:00'),
(188, 2, 51, '2026-09-20 01:01:00'),
(189, 2, 52, '2026-09-20 01:01:00'),
(190, 3, 50, '2026-09-20 01:01:00'),
(191, 3, 52, '2026-09-20 01:01:00'),
(192, 4, 50, '2026-09-20 01:01:00'),
(193, 4, 51, '2026-09-20 01:01:00'),
(194, 1, 60, '2026-09-20 03:43:13'),
(195, 1, 61, '2026-09-20 03:43:13'),
(197, 2, 61, '2026-09-20 03:43:13'),
(198, 2, 60, '2026-09-20 03:43:13'),
(199, 2, 6, '2026-09-20 03:43:13'),
(200, 3, 61, '2026-09-20 03:43:13'),
(201, 3, 60, '2026-09-20 03:43:13'),
(202, 3, 43, '2026-09-20 03:43:13'),
(203, 4, 60, '2026-09-20 03:43:13'),
(204, 4, 33, '2026-09-20 03:43:13');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `collection_id` bigint(20) UNSIGNED DEFAULT NULL,
  `buyer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `total_weight` decimal(12,3) NOT NULL DEFAULT 0.000,
  `total_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','approved','paid','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('unpaid','processing','paid','failed') NOT NULL DEFAULT 'unpaid',
  `bank_name` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT 'transfer_bank',
  `payment_proof` varchar(255) DEFAULT NULL,
  `payment_note` text DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `code`, `collection_id`, `buyer_id`, `total_weight`, `total_amount`, `status`, `payment_status`, `bank_name`, `payment_method`, `payment_proof`, `payment_note`, `paid_at`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(18, 'SAL-1789874930942', 9, 1, 50.000, 1750000.00, 'pending', 'unpaid', NULL, 'transfer_bank', NULL, NULL, NULL, 'barang anda telah terjual', '2026-09-20 03:28:50', '2026-09-20 03:28:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_group` varchar(50) DEFAULT 'general',
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_group`, `description`, `updated_at`) VALUES
('bank_name', 'Aplikasi Sampah Terintegrasi (PilahKita)', 'profile', 'Nama Resmi Lembaga / Bank Sampah', '2026-09-20 03:12:53'),
('contact_email', 'layanan@banksampah.id', 'contact', 'Email Resmi Bank Sampah', '2026-09-20 02:21:29'),
('contact_phone', '081234567890', 'contact', 'Nomor Telepon Kantor', '2026-09-20 02:21:29'),
('contact_whatsapp', '089513962552', 'contact', 'Nomor WhatsApp Layanan CS Resmi', '2026-09-20 02:21:29'),
('min_withdrawal', '15000', 'finance', 'Batas Minimal Penarikan Saldo (Rp)', '2026-09-20 02:21:29'),
('office_address', 'Jl.Gununglaya RT004/RW001 Ds. Klayan Kec. Gunung Jati, Kab. Cirebon', 'profile', 'Alamat Kantor & Gudang Induk', '2026-09-20 03:12:53'),
('operational_hours', 'Senin-Jumat 08-16 WIB', 'operational', 'Jadwal Jam Operasional', '2026-09-20 02:21:29'),
('system_announcement', 'Pilah sampah sekarang!', 'general', 'Pengumuman / Motto Sistem', '2026-09-20 02:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(105) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `ktp_number` varchar(30) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `bank_name` varchar(50) DEFAULT NULL,
  `bank_account_number` varchar(50) DEFAULT NULL,
  `bank_account_holder` varchar(100) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `wallet_balance` decimal(14,2) NOT NULL DEFAULT 0.00,
  `email_verified_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `ktp_number`, `age`, `address`, `bank_name`, `bank_account_number`, `bank_account_holder`, `photo_url`, `status`, `wallet_balance`, `email_verified_at`, `last_login_at`, `created_at`, `deleted_at`) VALUES
(1, 'admin', 'admin@aplikasisampah.local', '$2b$12$edumKcQINWuMTqq5XSSaDugMyOxhprN4c0OrSfw2HXOenTQaz2V/i', 'Super Administrator', '081300000001', NULL, NULL, 'Kantor Pusat', NULL, NULL, NULL, NULL, 'active', 0.00, NULL, '2026-09-20 11:50:29', '2026-09-15 00:53:52', NULL),
(2, 'operator', 'operator@aplikasisampah.local', '$2b$12$Fu3zwKiZ0fbIYOtc71J0Ou7sHkuZ4VGrEX4tw4VleggqTARNaz5qC', 'Admin Pengelola', '081300000002', NULL, NULL, 'Unit Pengelola', NULL, NULL, NULL, NULL, 'active', 0.00, NULL, '2026-09-19 22:16:35', '2026-09-15 00:53:52', NULL),
(3, 'petugas', 'petugas@aplikasisampah.local', '$2b$12$SXZ1MOnNkjQ/cAc.KO1RDOmbZ65V766jmRroSaKQ9sNfqsmEG712C', 'Petugas Pengumpulan', '081300000003', NULL, NULL, 'Unit Lapangan', NULL, NULL, NULL, NULL, 'active', 0.00, NULL, '2026-09-19 22:16:18', '2026-09-15 00:53:52', NULL),
(4, 'nasabah', 'nasabah@aplikasisampah.local', '$2b$12$ZvpUt61cdu216i8in6X72.8bJQREATLn7ilMTVz1pxP1Lz1q6P2xK', 'Novan A. (Nasabah)', '081298765432', '3201998877660002', 24, 'Jl. Dahlia Indah No. 45, RT 03/RW 08', 'BCA', '8830192831', 'Novan Abaytulrohman', NULL, 'active', 757665.00, NULL, '2026-09-20 11:51:22', '2026-09-15 00:53:52', NULL),
(6, 'budisantoso626', 'budisantoso626@banksampah.id', '$2b$10$Zui2ZTUswrk4./EzoaR9veKN9m7Z2nzE/whm7n3llQ.CR5FcEt54O', 'Budi Santoso', '081987654321', NULL, NULL, 'Jl. Merak RT 04/RW 01', NULL, NULL, NULL, NULL, 'inactive', 0.00, NULL, NULL, '2026-09-20 01:29:53', '2026-09-20 09:10:27');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`, `created_at`) VALUES
(6, 2, 2, '2026-09-15 01:29:06'),
(8, 3, 3, '2026-09-15 01:35:51'),
(9, 1, 1, '2026-09-15 01:55:50'),
(11, 4, 4, '2026-09-19 16:56:45'),
(12, 6, 4, '2026-09-20 01:29:53');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_collection_report`
-- (See below for the actual view)
--
CREATE TABLE `v_collection_report` (
`collection_id` bigint(20) unsigned
,`collection_code` varchar(50)
,`user_id` bigint(20) unsigned
,`nasabah_name` varchar(105)
,`nasabah_username` varchar(50)
,`nasabah_phone` varchar(30)
,`company_id` bigint(20) unsigned
,`company_name` varchar(100)
,`address` text
,`latitude` decimal(10,8)
,`longitude` decimal(11,8)
,`scheduled_date` date
,`scheduled_time` time
,`request_note` text
,`status` enum('diajukan','dijadwalkan','diambil','ditimbang','selesai','ditolak','dibatalkan')
,`rejected_reason` text
,`assigned_to` bigint(20) unsigned
,`collector_name` varchar(105)
,`created_at` timestamp
,`updated_at` timestamp
,`item_id` bigint(20) unsigned
,`waste_type_id` bigint(20) unsigned
,`waste_code` varchar(50)
,`waste_name` varchar(100)
,`waste_category` enum('organik','anorganik','daur_ulang','b3','lainnya')
,`waste_unit` varchar(20)
,`weight` decimal(12,3)
,`price_per_unit` decimal(14,2)
,`subtotal` decimal(14,2)
,`item_notes` text
);

-- --------------------------------------------------------

--
-- Table structure for table `wallet_transactions`
--

CREATE TABLE `wallet_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('success','pending','failed') NOT NULL DEFAULT 'success',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `waste_complaints`
--

CREATE TABLE `waste_complaints` (
  `id` int(11) NOT NULL,
  `ticket_code` varchar(30) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reporter_name` varchar(100) NOT NULL,
  `reporter_phone` varchar(30) DEFAULT NULL,
  `location_address` varchar(255) NOT NULL,
  `neighborhood` varchar(100) DEFAULT NULL,
  `waste_estimate` varchar(100) DEFAULT NULL,
  `urgency_level` enum('normal','tinggi','darurat') DEFAULT 'normal',
  `description` text NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','in_progress','resolved','rejected') DEFAULT 'pending',
  `officer_id` int(11) DEFAULT NULL,
  `officer_notes` text DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `reward_points_awarded` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waste_complaints`
--

INSERT INTO `waste_complaints` (`id`, `ticket_code`, `user_id`, `reporter_name`, `reporter_phone`, `location_address`, `neighborhood`, `waste_estimate`, `urgency_level`, `description`, `photo_url`, `status`, `officer_id`, `officer_notes`, `resolved_at`, `reward_points_awarded`, `created_at`, `updated_at`) VALUES
(1, 'LAP-202609-001', 4, 'Novan', '081234567890', 'Jl. Merpati No. 14, Depan Pos Ronda', 'RW 03 Sukajadi', 'Sekitar 3 Karung Plastik & Ranting', 'darurat', 'Tumpukan sampah plastik liar menyumbat selokan drainase utama menjelang musim hujan.', NULL, 'in_progress', NULL, NULL, NULL, 0, '2026-09-20 08:01:00', '2026-09-20 08:01:00'),
(2, 'LAP-202609-002', 4, 'Novan', '081234567890', 'Lahan Kosong Samping Masjid Al-Hidayah', 'RW 05 Cibeunying', '1 Gerobak Sampah Campur', 'tinggi', 'Banyak sampah sisa acara hajatan belum terangkut dan mulai menimbulkan bau tidak sedap.', NULL, 'verified', NULL, NULL, NULL, 0, '2026-09-20 08:01:00', '2026-09-20 08:01:00'),
(3, 'LAP-202609-003', NULL, 'Warga Anonim', '085711223344', 'Pertigaan Lampu Merah Jl. Cempaka', 'RW 01 Melati', '2 Karung Botol Bekas & Kardus', 'normal', 'Ada karung botol dan kardus rusak tercecer di trotoar pejalan kaki.', NULL, 'resolved', NULL, NULL, NULL, 2500, '2026-09-20 08:01:00', '2026-09-20 08:01:00'),
(4, 'LAP-202609-004', 4, 'Novan Uji', '081299887766', 'Jl. Mawar No. 8', 'RW 07', '2 Karung', 'darurat', 'Tumpukan sampah plastik menyumbat gorong-gorong depan gapura', NULL, 'pending', NULL, NULL, NULL, 0, '2026-09-20 08:04:26', '2026-09-20 08:04:26'),
(5, 'LAP-202609-005', 4, 'Novan Upload Test', '081234567890', 'Jl. Dahlia No. 5', 'RW 02', '2 Karung', 'tinggi', 'Tumpukan sampah plastik di selokan dengan foto bukti', '/uploads/complaints/aduan-1789866814595-5774.jpg', 'pending', NULL, NULL, NULL, 0, '2026-09-20 08:13:34', '2026-09-20 08:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `waste_complaint_logs`
--

CREATE TABLE `waste_complaint_logs` (
  `id` int(11) NOT NULL,
  `complaint_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waste_complaint_logs`
--

INSERT INTO `waste_complaint_logs` (`id`, `complaint_id`, `user_id`, `action`, `notes`, `created_at`) VALUES
(1, 4, 4, 'created', 'Pengaduan baru diajukan oleh warga/nasabah.', '2026-09-20 08:04:26'),
(2, 5, 4, 'created', 'Pengaduan baru diajukan oleh warga/nasabah.', '2026-09-20 08:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `waste_inventory_logs`
--

CREATE TABLE `waste_inventory_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `waste_type_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('in','out','adjustment') NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `reference_type` varchar(50) DEFAULT 'manual',
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `recorded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `waste_inventory_logs`
--

INSERT INTO `waste_inventory_logs` (`id`, `waste_type_id`, `type`, `quantity`, `reference_type`, `reference_id`, `notes`, `recorded_by`, `created_at`) VALUES
(1, 2, 'in', 50.000, 'collection', 1, 'Masuk dari pengumpulan COL-DEMO-0001', 3, '2026-09-20 00:32:00'),
(2, 3, 'in', 35.000, 'collection', 1, 'Masuk dari pengumpulan COL-DEMO-0001', 3, '2026-09-20 00:32:00'),
(3, 4, 'in', 20.000, 'collection', 1, 'Masuk dari pengumpulan COL-DEMO-0001', 3, '2026-09-20 00:32:00'),
(4, 2, 'out', 25.500, 'sale', 1, 'Keluar untuk transaksi penjualan SAL-DEMO-0001', 1, '2026-09-20 00:32:00'),
(5, 1, 'in', 250.000, 'manual', NULL, 'Penerimaan sampah organik basah pasar', 3, '2026-09-20 00:32:00'),
(6, 1, 'out', 150.000, 'processing', 1, 'Dialokasikan ke batch kompos PRC-2026-001', 3, '2026-09-20 00:32:00'),
(7, 2, 'in', 15.500, 'manual', NULL, 'Uji penambahan fisik botol plastik', 1, '2026-09-20 00:34:34');

-- --------------------------------------------------------

--
-- Table structure for table `waste_processings`
--

CREATE TABLE `waste_processings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `waste_type_id` bigint(20) UNSIGNED NOT NULL,
  `process_type` enum('kompos','maggot','cacah_plastik','press_bal','kerajinan','lainnya') NOT NULL,
  `input_weight` decimal(12,3) NOT NULL DEFAULT 0.000,
  `output_product_name` varchar(150) DEFAULT NULL,
  `output_weight` decimal(12,3) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('direncanakan','proses','selesai','gagal') NOT NULL DEFAULT 'proses',
  `pic_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `waste_processings`
--

INSERT INTO `waste_processings` (`id`, `code`, `waste_type_id`, `process_type`, `input_weight`, `output_product_name`, `output_weight`, `start_date`, `end_date`, `status`, `pic_user_id`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'PRC-2026-001', 1, 'kompos', 150.000, 'Pupuk Kompos Organik PilahKita', 75.000, '2026-09-01', '2026-09-18', 'selesai', 3, 'Proses pengomposan aerobik 18 hari selesai sempurna.', '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(2, 'PRC-2026-002', 2, 'cacah_plastik', 85.000, 'Flakes Cacahan PET Bening', 82.500, '2026-09-10', '2026-09-11', 'selesai', 3, 'Pencacahan botol plastik bening siap supply pabrik daur ulang.', '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(3, 'PRC-2026-003', 1, 'maggot', 200.000, 'Pakan Maggot BSF Kering', NULL, '2026-09-16', NULL, 'proses', 3, 'Biokonversi sisa makanan organik menggunakan larva Black Soldier Fly (BSF).', '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL),
(4, 'PRC-2026-004', 3, 'press_bal', 120.000, 'Kardus Press Padat (Bal)', NULL, '2026-09-19', NULL, 'proses', 3, 'Pemadatan kardus terpilah dengan mesin press hidrolik.', '2026-09-20 00:32:00', '2026-09-20 00:32:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `waste_types`
--

CREATE TABLE `waste_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('organik','anorganik','daur_ulang','b3','lainnya') NOT NULL,
  `unit` varchar(20) NOT NULL DEFAULT 'kg',
  `price_per_unit` decimal(14,2) NOT NULL DEFAULT 0.00,
  `price_trend` varchar(20) NOT NULL DEFAULT 'stabil',
  `sell_price_per_unit` decimal(12,2) NOT NULL DEFAULT 0.00,
  `treatment_method` varchar(200) DEFAULT NULL,
  `cleanliness_spec` varchar(255) DEFAULT 'Kering & Bersih',
  `sorting_tips` text DEFAULT NULL,
  `last_price_updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_hazardous` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `waste_types`
--

INSERT INTO `waste_types` (`id`, `code`, `name`, `category`, `unit`, `price_per_unit`, `price_trend`, `sell_price_per_unit`, `treatment_method`, `cleanliness_spec`, `sorting_tips`, `last_price_updated_at`, `is_hazardous`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ORG', 'Sampah Organik Rumah Tangga', 'organik', 'kg', 500.00, 'stabil', 1200.00, 'Pengomposan', 'Bebas plastik, puntung rokok, & beling', '1. Khusus sisa sayuran, buah busuk, kulit telur, dan daun rontok.\n2. Jangan campur tulang sapi besar atau minyak jelantah kotor.\n3. Tiriskan air sisa cucian agar tidak terlalu becek.', '2026-09-20 09:17:15', 0, 'Sampah organik yang dapat diolah menjadi kompos.', 'active', '2026-09-15 00:53:52', '2026-09-20 02:17:15', NULL),
(2, 'PLS', 'Plastik PET (Botol Bening)', 'daur_ulang', 'kg', 3500.00, 'naik', 5200.00, 'Daur ulang plastik', 'Bening bersih, tanpa label & tutup', '1. Lepaskan segel plastik merek dan tutup botol.\n2. Bilas dari sisa teh/kopi/manis agar tidak mengundang semut.\n3. Injak botol hingga pipih untuk menghemat kapasitas karung simpan.', '2026-09-20 09:17:15', 0, 'Botol, kemasan dan plastik yang dapat didaur ulang.', 'active', '2026-09-15 00:53:52', '2026-09-20 02:17:15', NULL),
(3, 'KRT', 'Kardus & Kertas Box', 'daur_ulang', 'kg', 2200.00, 'stabil', 3400.00, 'Daur ulang kertas', 'Kering, bebas air & minyak', '1. Buka lipatan kardus hingga lembaran rata.\n2. Lepaskan isolasi lakban cokelat yang berlebih.\n3. Ikat rapi dengan tali rafia per tumpukan 10-15 kg.', '2026-09-20 09:17:15', 0, 'Kertas dan kardus yang dapat didaur ulang.', 'active', '2026-09-15 00:53:52', '2026-09-20 02:17:15', NULL),
(4, 'LOG', 'Logam Besi & Kaleng', 'daur_ulang', 'kg', 4500.00, 'naik', 6800.00, 'Daur ulang logam', 'Kering, bebas karat tebal', '1. Buang sisa makanan/cairan dari kaleng susu/sarden.\n2. Pipihkan kaleng agar ringkas.\n3. Pisahkan antara besi padat dengan seng tipis.', '2026-09-20 09:17:15', 0, 'Kaleng dan material logam yang dapat didaur ulang.', 'active', '2026-09-15 00:53:52', '2026-09-20 02:17:15', NULL),
(5, 'KCA', 'Kaca & Botol Beling', 'daur_ulang', 'kg', 1200.00, 'stabil', 2100.00, 'Daur ulang kaca', 'Utuh, tidak pecah berserak', '1. Utamakan botol utuh (sirup, kecap, saus).\n2. Lepas tutup logam atau plastik.\n3. Taruh di kardus terpisah agar aman bagi petugas penjemput.', '2026-09-20 09:17:15', 0, 'Botol dan material kaca.', 'active', '2026-09-15 00:53:52', '2026-09-20 02:17:15', NULL),
(6, 'B3', 'Limbah B3', 'b3', 'kg', 0.00, 'stabil', 0.00, 'Penanganan limbah B3 khusus', 'Kering & Bersih', NULL, '2026-09-20 09:17:15', 1, 'Limbah berbahaya dan beracun.', 'active', '2026-09-15 00:53:52', '2026-09-15 00:53:52', NULL),
(7, 'ALU', 'Kaleng Aluminium Minuman', 'daur_ulang', 'kg', 12500.00, 'naik', 17000.00, NULL, 'Aluminium murni, kaleng soda gepeng', '1. Uji dengan magnet, aluminium tidak menempel pada magnet.\n2. Cuci bersih dari sisa sirup atau soda.\n3. Injak sampai gepeng.', '2026-09-20 09:17:15', 0, NULL, 'active', '2026-09-20 02:17:15', '2026-09-20 02:17:15', NULL),
(8, 'JLT', 'Minyak Jelantah (UCO)', 'anorganik', 'liter', 6500.00, 'naik', 9000.00, NULL, 'Tersaring, tanpa air atau endapan bumbu', '1. Diamkan minyak bekas hingga dingin.\n2. Saring menggunakan saringan halus agar bebas remah gorengan.\n3. Masukkan ke dalam jeriken atau botol minyak tertutup rapat.', '2026-09-20 09:17:15', 0, NULL, 'active', '2026-09-20 02:17:15', '2026-09-20 02:17:15', NULL),
(9, 'HVS', 'Kertas HVS & Dokumen Putih', 'daur_ulang', 'kg', 2800.00, 'stabil', 4200.00, NULL, 'Putih bersih, bebas staples logam', '1. Pisahkan dari kertas cokelat atau majalah glossy.\n2. Lepaskan staples logam atau penjepit klip.\n3. Tumpuk rapi dan ikat dengan tali.', '2026-09-20 09:17:15', 0, NULL, 'active', '2026-09-20 02:17:15', '2026-09-20 02:17:15', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `withdrawal_requests`
--

CREATE TABLE `withdrawal_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bank_name` varchar(50) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','rejected','paid') NOT NULL DEFAULT 'pending',
  `payment_proof` varchar(255) DEFAULT NULL,
  `payment_note` text DEFAULT NULL,
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `rejected_reason` text DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure for view `v_collection_report`
--
DROP TABLE IF EXISTS `v_collection_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_collection_report`  AS SELECT `cr`.`id` AS `collection_id`, `cr`.`code` AS `collection_code`, `cr`.`user_id` AS `user_id`, `u`.`full_name` AS `nasabah_name`, `u`.`username` AS `nasabah_username`, `u`.`phone` AS `nasabah_phone`, `cr`.`company_id` AS `company_id`, `c`.`name` AS `company_name`, `cr`.`address` AS `address`, `cr`.`latitude` AS `latitude`, `cr`.`longitude` AS `longitude`, `cr`.`scheduled_date` AS `scheduled_date`, `cr`.`scheduled_time` AS `scheduled_time`, `cr`.`request_note` AS `request_note`, `cr`.`status` AS `status`, `cr`.`rejected_reason` AS `rejected_reason`, `cr`.`assigned_to` AS `assigned_to`, `collector`.`full_name` AS `collector_name`, `cr`.`created_at` AS `created_at`, `cr`.`updated_at` AS `updated_at`, `ci`.`id` AS `item_id`, `ci`.`waste_type_id` AS `waste_type_id`, `wt`.`code` AS `waste_code`, `wt`.`name` AS `waste_name`, `wt`.`category` AS `waste_category`, `wt`.`unit` AS `waste_unit`, `ci`.`weight` AS `weight`, `ci`.`price_per_unit` AS `price_per_unit`, `ci`.`subtotal` AS `subtotal`, `ci`.`notes` AS `item_notes` FROM (((((`collection_requests` `cr` join `users` `u` on(`u`.`id` = `cr`.`user_id`)) left join `companies` `c` on(`c`.`id` = `cr`.`company_id`)) left join `users` `collector` on(`collector`.`id` = `cr`.`assigned_to`)) left join `collection_items` `ci` on(`ci`.`collection_id` = `cr`.`id` and `ci`.`deleted_at` is null)) left join `waste_types` `wt` on(`wt`.`id` = `ci`.`waste_type_id`)) WHERE `cr`.`deleted_at` is null ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_log_user` (`user_id`),
  ADD KEY `idx_log_action` (`action`),
  ADD KEY `idx_log_date` (`created_at`);

--
-- Indexes for table `buyers`
--
ALTER TABLE `buyers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_buyer_status` (`status`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_receiver` (`receiver_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `collection_items`
--
ALTER TABLE `collection_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ci_collection` (`collection_id`),
  ADD KEY `idx_ci_waste` (`waste_type_id`);

--
-- Indexes for table `collection_requests`
--
ALTER TABLE `collection_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_collection_code` (`code`),
  ADD KEY `idx_cr_user` (`user_id`),
  ADD KEY `idx_cr_company` (`company_id`),
  ADD KEY `idx_cr_assigned` (`assigned_to`),
  ADD KEY `idx_cr_status_date` (`status`,`scheduled_date`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company_status` (`status`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_doc_ref` (`reference_type`,`reference_id`),
  ADD KEY `idx_doc_user` (`uploaded_by`);

--
-- Indexes for table `drop_points`
--
ALTER TABLE `drop_points`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_dp_code` (`code`),
  ADD KEY `idx_dp_category` (`category`),
  ADD KEY `idx_dp_status` (`status`);

--
-- Indexes for table `drop_point_logs`
--
ALTER TABLE `drop_point_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dpl_dp` (`drop_point_id`),
  ADD KEY `idx_dpl_user` (`emptied_by`);

--
-- Indexes for table `education_articles`
--
ALTER TABLE `education_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_ea_slug` (`slug`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_user_read` (`user_id`,`is_read`),
  ADD KEY `idx_notif_actor` (`actor_user_id`);

--
-- Indexes for table `operational_expenses`
--
ALTER TABLE `operational_expenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `expense_code` (`expense_code`),
  ADD KEY `idx_expense_date` (`expense_date`),
  ADD KEY `idx_category` (`category`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_permissions_code` (`code`),
  ADD KEY `idx_perm_parent` (`parent_id`),
  ADD KEY `idx_perm_module` (`module`);

--
-- Indexes for table `pickup_schedules`
--
ALTER TABLE `pickup_schedules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pickup_schedule_logs`
--
ALTER TABLE `pickup_schedule_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_psl_schedule` (`schedule_id`),
  ADD KEY `idx_psl_recorded` (`recorded_by`);

--
-- Indexes for table `reward_items`
--
ALTER TABLE `reward_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_ri_code` (`code`);

--
-- Indexes for table `reward_redemptions`
--
ALTER TABLE `reward_redemptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_rr_code` (`code`),
  ADD KEY `idx_rr_user` (`user_id`),
  ADD KEY `idx_rr_reward` (`reward_id`),
  ADD KEY `fk_rr_processed` (`processed_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_roles_name` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_role_perm` (`role_id`,`permission_id`),
  ADD KEY `idx_rp_perm` (`permission_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_sales_code` (`code`),
  ADD KEY `idx_sales_collection` (`collection_id`),
  ADD KEY `idx_sales_buyer` (`buyer_id`),
  ADD KEY `idx_sales_status` (`status`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_roles` (`user_id`,`role_id`),
  ADD KEY `idx_ur_role` (`role_id`);

--
-- Indexes for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_wallet_user` (`user_id`),
  ADD KEY `idx_wallet_ref` (`reference_type`,`reference_id`);

--
-- Indexes for table `waste_complaints`
--
ALTER TABLE `waste_complaints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_urgency` (`urgency_level`);

--
-- Indexes for table `waste_complaint_logs`
--
ALTER TABLE `waste_complaint_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_complaint` (`complaint_id`);

--
-- Indexes for table `waste_inventory_logs`
--
ALTER TABLE `waste_inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inv_waste` (`waste_type_id`),
  ADD KEY `idx_inv_recorded` (`recorded_by`);

--
-- Indexes for table `waste_processings`
--
ALTER TABLE `waste_processings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_wp_code` (`code`),
  ADD KEY `idx_wp_waste` (`waste_type_id`),
  ADD KEY `idx_wp_pic` (`pic_user_id`);

--
-- Indexes for table `waste_types`
--
ALTER TABLE `waste_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_waste_code` (`code`),
  ADD KEY `idx_waste_category` (`category`),
  ADD KEY `idx_waste_status` (`status`);

--
-- Indexes for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_withdrawal_user` (`user_id`),
  ADD KEY `idx_withdrawal_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=289;

--
-- AUTO_INCREMENT for table `buyers`
--
ALTER TABLE `buyers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `collection_items`
--
ALTER TABLE `collection_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `collection_requests`
--
ALTER TABLE `collection_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `drop_points`
--
ALTER TABLE `drop_points`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `drop_point_logs`
--
ALTER TABLE `drop_point_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `education_articles`
--
ALTER TABLE `education_articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `operational_expenses`
--
ALTER TABLE `operational_expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `pickup_schedules`
--
ALTER TABLE `pickup_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pickup_schedule_logs`
--
ALTER TABLE `pickup_schedule_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reward_items`
--
ALTER TABLE `reward_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reward_redemptions`
--
ALTER TABLE `reward_redemptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `waste_complaints`
--
ALTER TABLE `waste_complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `waste_complaint_logs`
--
ALTER TABLE `waste_complaint_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `waste_inventory_logs`
--
ALTER TABLE `waste_inventory_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `waste_processings`
--
ALTER TABLE `waste_processings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `waste_types`
--
ALTER TABLE `waste_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `collection_items`
--
ALTER TABLE `collection_items`
  ADD CONSTRAINT `fk_ci_collection` FOREIGN KEY (`collection_id`) REFERENCES `collection_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ci_waste` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `collection_requests`
--
ALTER TABLE `collection_requests`
  ADD CONSTRAINT `fk_cr_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cr_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `fk_doc_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `drop_point_logs`
--
ALTER TABLE `drop_point_logs`
  ADD CONSTRAINT `fk_dpl_dp` FOREIGN KEY (`drop_point_id`) REFERENCES `drop_points` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dpl_user` FOREIGN KEY (`emptied_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notif_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `fk_perm_parent` FOREIGN KEY (`parent_id`) REFERENCES `permissions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pickup_schedule_logs`
--
ALTER TABLE `pickup_schedule_logs`
  ADD CONSTRAINT `fk_psl_recorded` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_psl_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `pickup_schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reward_redemptions`
--
ALTER TABLE `reward_redemptions`
  ADD CONSTRAINT `fk_rr_processed` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rr_reward` FOREIGN KEY (`reward_id`) REFERENCES `reward_items` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `fk_sales_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sales_collection` FOREIGN KEY (`collection_id`) REFERENCES `collection_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `waste_inventory_logs`
--
ALTER TABLE `waste_inventory_logs`
  ADD CONSTRAINT `fk_inv_recorded` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inv_waste` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `waste_processings`
--
ALTER TABLE `waste_processings`
  ADD CONSTRAINT `fk_wp_pic` FOREIGN KEY (`pic_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_wp_waste` FOREIGN KEY (`waste_type_id`) REFERENCES `waste_types` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `withdrawal_requests`
--
ALTER TABLE `withdrawal_requests`
  ADD CONSTRAINT `fk_withdrawal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
