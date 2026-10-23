const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");

const router = express.Router();

/* =========================================================
   DASHBOARD
   GET /dashboard
========================================================= */
router.get("/", hasPermission("dashboard.read"), async (req, res) => {
    try {
        const db = getPool();
        const user = req.session.user;

        if (!user) {
            return res.redirect("/login");
        }

        const userId = Number(user.id);
        const isNasabah = String(user.role || "").toLowerCase() === "nasabah";

        /* =====================================================
           USER DETAIL (LENGKAP DENGAN KTP & REKENING)
        ===================================================== */
        const [[currentUser]] = await db.query(
            `SELECT id, username, email, full_name, phone, ktp_number, age, address, 
                    bank_name, bank_account_number, bank_account_holder, wallet_balance, status 
             FROM users WHERE id = ? AND deleted_at IS NULL`,
            [userId]
        );

        /* =====================================================
           METRIK UTAMA (ENTERPRISE OPERATIONAL METRICS)
        ===================================================== */
        const userFilter = isNasabah ? "WHERE cr.user_id = ?" : "";

        // 1. Total Pengguna
        const [[usersCountRow]] = await db.query(
            "SELECT COUNT(*) AS total_users, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_users FROM users WHERE deleted_at IS NULL"
        );

        // 2. Logistik Pickup
        const [[collectionStats]] = await db.query(
            `SELECT 
                COUNT(*) AS total_pickups,
                SUM(CASE WHEN cr.status IN ('diajukan', 'dijadwalkan') THEN 1 ELSE 0 END) AS pending_pickups,
                SUM(CASE WHEN cr.status = 'selesai' THEN 1 ELSE 0 END) AS completed_pickups,
                COALESCE(SUM(ci.weight), 0) AS total_weight_kg
             FROM collection_requests cr
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             ${userFilter}
             ${isNasabah ? "AND" : "WHERE"} cr.deleted_at IS NULL`,
            isNasabah ? [userId] : []
        );

        // 3. Penjualan Kasir / Sales
        const [[salesStats]] = await db.query(
            `SELECT 
                COUNT(*) AS total_sales_count,
                COALESCE(SUM(s.total_amount), 0) AS total_sales_amount,
                COALESCE(SUM(s.total_weight), 0) AS total_sales_weight,
                SUM(CASE WHEN s.payment_status = 'paid' THEN 1 ELSE 0 END) AS paid_sales_count,
                SUM(CASE WHEN s.payment_status = 'unpaid' OR s.status = 'pending' THEN 1 ELSE 0 END) AS pending_sales_count
             FROM sales s
             LEFT JOIN collection_requests cr ON cr.id = s.collection_id
             WHERE s.deleted_at IS NULL
             ${isNasabah ? "AND cr.user_id = ?" : ""}`,
            isNasabah ? [userId] : []
        );

        // 4. Biaya Operasional & Kas Kecil
        const [[expenseStats]] = await db.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_expenses, COUNT(*) AS expense_count 
             FROM operational_expenses WHERE deleted_at IS NULL`
        );

        // 5. Saldo Dompet & Penarikan
        let walletBalance = Number(currentUser?.wallet_balance || 0);
        let totalWalletLiability = 0;
        if (!isNasabah) {
            const [[walletRow]] = await db.query(
                "SELECT COALESCE(SUM(wallet_balance), 0) AS total_liability FROM users WHERE deleted_at IS NULL"
            );
            totalWalletLiability = Number(walletRow?.total_liability || 0);
        }

        const [[withdrawalStats]] = await db.query(
            `SELECT 
                COUNT(*) AS total_withdrawals,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_withdrawals
             FROM withdrawal_requests
             WHERE deleted_at IS NULL
             ${isNasabah ? "AND user_id = ?" : ""}`,
            isNasabah ? [userId] : []
        );

        // 6. Pengolahan Sampah & Kompos
        const [[processingStats]] = await db.query(
            `SELECT 
                COUNT(*) AS total_processings,
                COALESCE(SUM(input_weight), 0) AS total_input_weight,
                COALESCE(SUM(output_weight), 0) AS total_output_weight,
                COALESCE(SUM(CASE WHEN process_type = 'kompos' THEN output_weight ELSE 0 END), 0) AS compost_weight
             FROM waste_processings 
             WHERE deleted_at IS NULL`
        );

        // 7. Aduan Sampah Liar
        const [[complaintStats]] = await db.query(
            `SELECT 
                COUNT(*) AS total_complaints,
                SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END) AS pending_complaints,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_complaints
             FROM waste_complaints
             ${isNasabah ? "WHERE user_id = ?" : ""}`,
            isNasabah ? [userId] : []
        );

        // 8. Jadwal Armada
        const [[scheduleStats]] = await db.query(
            "SELECT COUNT(*) AS total_schedules, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_schedules FROM pickup_schedules WHERE deleted_at IS NULL"
        );

        /* =====================================================
           DISTRIBUSI KATEGORI SAMPAH
        ===================================================== */
        const categorySql = `
            SELECT 
                wt.category,
                COUNT(ci.id) AS total_items,
                COALESCE(SUM(ci.weight), 0) AS total_weight
            FROM waste_types wt
            LEFT JOIN collection_items ci ON ci.waste_type_id = wt.id AND ci.deleted_at IS NULL
            LEFT JOIN collection_requests cr ON cr.id = ci.collection_id AND cr.deleted_at IS NULL
            ${isNasabah ? "AND cr.user_id = ?" : ""}
            WHERE wt.deleted_at IS NULL
            GROUP BY wt.category
            ORDER BY total_weight DESC
        `;
        const [categoryRows] = await db.query(
            categorySql,
            isNasabah ? [userId] : []
        );

        /* =====================================================
           TREN BULANAN
        ===================================================== */
        const trendSql = `
            SELECT 
                DATE_FORMAT(cr.scheduled_date, '%b %Y') AS label,
                DATE_FORMAT(cr.scheduled_date, '%Y-%m') AS ym,
                COUNT(DISTINCT cr.id) AS total_collections,
                COALESCE(SUM(ci.weight), 0) AS total_kg,
                COALESCE(SUM(ci.subtotal), 0) AS total_value
            FROM collection_requests cr
            LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
            WHERE cr.deleted_at IS NULL
            AND cr.scheduled_date IS NOT NULL
            ${isNasabah ? "AND cr.user_id = ?" : ""}
            GROUP BY ym, label
            ORDER BY ym ASC
            LIMIT 6
        `;
        const [trendRows] = await db.query(
            trendSql,
            isNasabah ? [userId] : []
        );

        /* =====================================================
           AKTIVITAS PENGUMPULAN TERKINI
        ===================================================== */
        const recentSql = `
            SELECT
                cr.id,
                cr.code,
                cr.status,
                cr.scheduled_date,
                cr.scheduled_time,
                u.full_name,
                u.phone,
                u.bank_name,
                u.bank_account_number,
                c.name AS company_name,
                COALESCE(SUM(ci.weight), 0) AS total_weight,
                COALESCE(SUM(ci.subtotal), 0) AS total_value
            FROM collection_requests cr
            INNER JOIN users u ON u.id = cr.user_id
            LEFT JOIN companies c ON c.id = cr.company_id
            LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
            WHERE cr.deleted_at IS NULL
            ${isNasabah ? "AND cr.user_id = ?" : ""}
            GROUP BY
                cr.id,
                cr.code,
                cr.status,
                cr.scheduled_date,
                cr.scheduled_time,
                u.full_name,
                u.phone,
                u.bank_name,
                u.bank_account_number,
                c.name
            ORDER BY cr.created_at DESC
            LIMIT 6
        `;
        const [recentCollections] = await db.query(
            recentSql,
            isNasabah ? [userId] : []
        );

        /* =====================================================
           TRANSAKSI PENJUALAN KASIR TERKINI
        ===================================================== */
        const [latestSales] = await db.query(
            `SELECT s.id, s.code, s.total_weight, s.total_amount, s.status, s.payment_status, 
                    s.bank_name, s.payment_method, s.payment_proof, s.created_at, s.paid_at,
                    b.name AS buyer_name, cu.full_name AS nasabah_name, cu.bank_name AS nasabah_bank, 
                    cu.bank_account_number AS nasabah_account_number
             FROM sales s
             LEFT JOIN buyers b ON b.id = s.buyer_id
             LEFT JOIN collection_requests cr ON cr.id = s.collection_id
             LEFT JOIN users cu ON cu.id = cr.user_id
             WHERE s.deleted_at IS NULL
             ${isNasabah ? "AND cr.user_id = ?" : ""}
             ORDER BY s.created_at DESC
             LIMIT 5`,
            isNasabah ? [userId] : []
        );

        /* =====================================================
           ADUAN SAMPAH LIAR TERKINI
        ===================================================== */
        const [latestComplaints] = await db.query(
            `SELECT id, ticket_code, reporter_name, location_address, neighborhood, 
                    urgency_level, status, photo_url, created_at
             FROM waste_complaints
             ${isNasabah ? "WHERE user_id = ?" : ""}
             ORDER BY created_at DESC
             LIMIT 4`,
            isNasabah ? [userId] : []
        );

        /* =====================================================
           JADWAL ARMADA AKTIF
        ===================================================== */
        const [activeSchedules] = await db.query(
            `SELECT id, zone_name, coverage_area, day_of_week, start_time, end_time, 
                    vehicle_type, driver_name, target_capacity_kg, status
             FROM pickup_schedules
             WHERE deleted_at IS NULL AND status = 'active'
             ORDER BY id ASC
             LIMIT 4`
        );

        /* =====================================================
           PERHITUNGAN KELENGKAPAN IDENTITAS PROFIL
        ===================================================== */
        const profileFields = [
            currentUser?.full_name,
            currentUser?.username,
            currentUser?.email,
            currentUser?.phone,
            currentUser?.ktp_number,
            currentUser?.age,
            currentUser?.address,
            currentUser?.bank_name,
            currentUser?.bank_account_number,
            currentUser?.bank_account_holder
        ];
        const filledFields = profileFields.filter(f => f && String(f).trim().length > 0).length;
        const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

        return res.render("dashboard", {
            layout: "layout/layout",
            title: "Dashboard Ekosistem Sampah",
            isNasabah,
            currentUser: currentUser || user,
            profileCompletion,
            metrics: {
                users: Number(usersCountRow?.total_users || 0),
                activeUsers: Number(usersCountRow?.active_users || 0),
                totalPickups: Number(collectionStats?.total_pickups || 0),
                pendingPickups: Number(collectionStats?.pending_pickups || 0),
                completedPickups: Number(collectionStats?.completed_pickups || 0),
                totalKg: Number(collectionStats?.total_weight_kg || 0),
                totalSales: Number(salesStats?.total_sales_amount || 0),
                paidSalesCount: Number(salesStats?.paid_sales_count || 0),
                pendingSalesCount: Number(salesStats?.pending_sales_count || 0),
                totalExpenses: Number(expenseStats?.total_expenses || 0),
                netCash: Number(salesStats?.total_sales_amount || 0) - Number(expenseStats?.total_expenses || 0),
                walletBalance: isNasabah ? walletBalance : totalWalletLiability,
                pendingWithdrawals: Number(withdrawalStats?.pending_withdrawals || 0),
                processedKg: Number(processingStats?.total_input_weight || 0),
                compostKg: Number(processingStats?.compost_weight || 0),
                totalComplaints: Number(complaintStats?.total_complaints || 0),
                pendingComplaints: Number(complaintStats?.pending_complaints || 0),
                activeSchedules: Number(scheduleStats?.active_schedules || 0)
            },
            categories: categoryRows || [],
            trend: trendRows || [],
            recentCollections: recentCollections || [],
            latestSales: latestSales || [],
            latestComplaints: latestComplaints || [],
            activeSchedules: activeSchedules || []
        });

    } catch (error) {
        console.error("DASHBOARD ERROR:", error);
        return res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: error.message
        });
    }
});

module.exports = router;