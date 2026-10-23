// ================================================================
// REPORTS & MONITORING ROUTES
// Aplikasi Sampah Terintegrasi
// ================================================================

const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { clean } = require("./_helpers");
const { generateReportsExcel, formatDate, formatDateTime, formatRupiah, formatWeight } = require("./_exportHelper");

const router = express.Router();

// ================================================================
// EXPORT EXCEL LAPORAN & MONITORING
// ================================================================
router.get("/export/excel", hasPermission("reports.read"), async (req, res) => {
    try {
        const db = getPool();
        const u = req.session.user;
        const isNasabah = String(u?.role || "").toLowerCase() === "nasabah";
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);

        let crDateFilter = "";
        let sDateFilter = "";
        let params = [];

        if (isNasabah) {
            crDateFilter += " AND cr.user_id = ?";
            sDateFilter += " AND s.collection_id IN (SELECT id FROM collection_requests WHERE user_id = ?)";
            params.push(u.id);
        }

        if (startDate && endDate) {
            crDateFilter += " AND DATE(cr.created_at) BETWEEN ? AND ?";
            sDateFilter += " AND DATE(s.created_at) BETWEEN ? AND ?";
            params.push(startDate, endDate);
        } else if (startDate) {
            crDateFilter += " AND DATE(cr.created_at) >= ?";
            sDateFilter += " AND DATE(s.created_at) >= ?";
            params.push(startDate);
        } else if (endDate) {
            crDateFilter += " AND DATE(cr.created_at) <= ?";
            sDateFilter += " AND DATE(s.created_at) <= ?";
            params.push(endDate);
        }

        const [[stats]] = await db.query(
            `SELECT 
                COUNT(DISTINCT cr.id) AS collections,
                COALESCE(SUM(ci.weight), 0) AS weight,
                COALESCE(SUM(ci.subtotal), 0) AS value,
                COUNT(DISTINCT CASE WHEN cr.status = 'selesai' THEN cr.id END) AS completed,
                (SELECT COUNT(id) FROM sales s WHERE s.deleted_at IS NULL ${sDateFilter}) AS sales_count,
                (SELECT COALESCE(SUM(total_amount), 0) FROM sales s WHERE s.deleted_at IS NULL ${sDateFilter}) AS sales_value
             FROM collection_requests cr
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.deleted_at IS NULL ${crDateFilter}`,
            [...params, ...params, ...params]
        );

        const [byWaste] = await db.query(
            `SELECT wt.name, wt.category, wt.unit,
                    COALESCE(SUM(ci.weight), 0) AS weight,
                    COALESCE(SUM(ci.subtotal), 0) AS value
             FROM collection_items ci
             JOIN waste_types wt ON wt.id = ci.waste_type_id
             JOIN collection_requests cr ON cr.id = ci.collection_id
             WHERE ci.deleted_at IS NULL AND cr.deleted_at IS NULL ${crDateFilter}
             GROUP BY wt.id
             ORDER BY weight DESC`,
            params
        );

        const [byCompany] = await db.query(
            `SELECT COALESCE(c.name, 'Kemitraan Perorangan') AS company,
                    COUNT(DISTINCT cr.id) AS collections,
                    COALESCE(SUM(ci.weight), 0) AS weight,
                    COALESCE(SUM(ci.subtotal), 0) AS value
             FROM collection_requests cr
             LEFT JOIN companies c ON c.id = cr.company_id
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.deleted_at IS NULL ${crDateFilter}
             GROUP BY c.id
             ORDER BY collections DESC`,
            params
        );

        let periodText = "Semua Waktu";
        if (startDate && endDate) periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        else if (startDate) periodText = `Mulai ${formatDate(startDate)}`;
        else if (endDate) periodText = `Sampai ${formatDate(endDate)}`;

        const workbook = await generateReportsExcel({
            title: "Laporan & Monitoring Pengelolaan Sampah",
            periodText,
            byWaste,
            byCompany,
            stats: stats || {}
        });

        const filename = `Laporan_Sampah_${startDate || 'all'}_sd_${endDate || 'all'}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Reports Excel Error:", err);
        res.status(500).send("Gagal mengunduh file Excel: " + err.message);
    }
});

// ================================================================
// PREVIEW PDF LAPORAN & MONITORING
// ================================================================
router.get("/export/preview-pdf", hasPermission("reports.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const isNasabah = String(u?.role || "").toLowerCase() === "nasabah";
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);

        let crDateFilter = "";
        let sDateFilter = "";
        let params = [];

        if (isNasabah) {
            crDateFilter += " AND cr.user_id = ?";
            sDateFilter += " AND s.collection_id IN (SELECT id FROM collection_requests WHERE user_id = ?)";
            params.push(u.id);
        }

        if (startDate && endDate) {
            crDateFilter += " AND DATE(cr.created_at) BETWEEN ? AND ?";
            sDateFilter += " AND DATE(s.created_at) BETWEEN ? AND ?";
            params.push(startDate, endDate);
        } else if (startDate) {
            crDateFilter += " AND DATE(cr.created_at) >= ?";
            sDateFilter += " AND DATE(s.created_at) >= ?";
            params.push(startDate);
        } else if (endDate) {
            crDateFilter += " AND DATE(cr.created_at) <= ?";
            sDateFilter += " AND DATE(s.created_at) <= ?";
            params.push(endDate);
        }

        const [[stats]] = await db.query(
            `SELECT 
                COUNT(DISTINCT cr.id) AS collections,
                COALESCE(SUM(ci.weight), 0) AS weight,
                COALESCE(SUM(ci.subtotal), 0) AS value,
                COUNT(DISTINCT CASE WHEN cr.status = 'selesai' THEN cr.id END) AS completed,
                (SELECT COUNT(id) FROM sales s WHERE s.deleted_at IS NULL ${sDateFilter}) AS sales_count,
                (SELECT COALESCE(SUM(total_amount), 0) FROM sales s WHERE s.deleted_at IS NULL ${sDateFilter}) AS sales_value
             FROM collection_requests cr
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.deleted_at IS NULL ${crDateFilter}`,
            [...params, ...params, ...params]
        );

        const [byWaste] = await db.query(
            `SELECT wt.name, wt.category, wt.unit,
                    COALESCE(SUM(ci.weight), 0) AS weight,
                    COALESCE(SUM(ci.subtotal), 0) AS value
             FROM collection_items ci
             JOIN waste_types wt ON wt.id = ci.waste_type_id
             JOIN collection_requests cr ON cr.id = ci.collection_id
             WHERE ci.deleted_at IS NULL AND cr.deleted_at IS NULL ${crDateFilter}
             GROUP BY wt.id
             ORDER BY weight DESC`,
            params
        );

        const [byCompany] = await db.query(
            `SELECT COALESCE(c.name, 'Kemitraan Perorangan') AS company,
                    COUNT(DISTINCT cr.id) AS collections,
                    COALESCE(SUM(ci.weight), 0) AS weight,
                    COALESCE(SUM(ci.subtotal), 0) AS value
             FROM collection_requests cr
             LEFT JOIN companies c ON c.id = cr.company_id
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.deleted_at IS NULL ${crDateFilter}
             GROUP BY c.id
             ORDER BY collections DESC`,
            params
        );

        let periodText = "Semua Waktu";
        if (startDate && endDate) periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        else if (startDate) periodText = `Mulai ${formatDate(startDate)}`;
        else if (endDate) periodText = `Sampai ${formatDate(endDate)}`;

        const excelUrl = `/reports/export/excel?start_date=${encodeURIComponent(startDate || '')}&end_date=${encodeURIComponent(endDate || '')}`;

        res.render("reports/export_pdf", {
            layout: false,
            title: "Laporan & Monitoring Pengelolaan Sampah",
            appName: res.locals.appName || "Aplikasi Sampah Terintegrasi",
            periodText,
            stats: stats || {},
            byWaste,
            byCompany,
            excelUrl,
            formatRupiah,
            formatWeight,
            formatDate,
            formatDateTime,
            printDate: formatDateTime(new Date()),
            printedBy: u.full_name || u.username || "Petugas"
        });
    } catch (err) {
        console.error("Reports PDF Error:", err);
        res.status(500).send("Gagal menampilkan pratinjau PDF: " + err.message);
    }
});

// ================================================================
// GET /reports - HALAMAN UTAMA LAPORAN & MONITORING
// ================================================================
router.get("/", hasPermission("reports.read"), async (req, res) => {
    try {
        const db = getPool();
        const u = req.session.user;
        const isNasabah = String(u?.role || "").toLowerCase() === "nasabah";
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);

        let crDateFilter = "";
        let sDateFilter = "";
        let params = [];

        if (isNasabah) {
            crDateFilter += " AND cr.user_id = ?";
            sDateFilter += " AND s.collection_id IN (SELECT id FROM collection_requests WHERE user_id = ?)";
            params.push(u.id);
        }

        if (startDate && endDate) {
            crDateFilter += " AND DATE(cr.created_at) BETWEEN ? AND ?";
            sDateFilter += " AND DATE(s.created_at) BETWEEN ? AND ?";
            params.push(startDate, endDate);
        } else if (startDate) {
            crDateFilter += " AND DATE(cr.created_at) >= ?";
            sDateFilter += " AND DATE(s.created_at) >= ?";
            params.push(startDate);
        } else if (endDate) {
            crDateFilter += " AND DATE(cr.created_at) <= ?";
            sDateFilter += " AND DATE(s.created_at) <= ?";
            params.push(endDate);
        }

        const [[stats]] = await db.query(
            `SELECT 
                COUNT(DISTINCT cr.id) AS collections,
                COALESCE(SUM(ci.weight), 0) AS weight,
                COALESCE(SUM(ci.subtotal), 0) AS value,
                COUNT(DISTINCT CASE WHEN cr.status = 'selesai' THEN cr.id END) AS completed,
                (SELECT COUNT(id) FROM sales s WHERE s.deleted_at IS NULL ${sDateFilter}) AS sales_count,
                (SELECT COALESCE(SUM(total_amount), 0) FROM sales s WHERE s.deleted_at IS NULL ${sDateFilter}) AS sales_value
             FROM collection_requests cr
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.deleted_at IS NULL ${crDateFilter}`,
            [...params, ...params, ...params]
        );

        const [byWaste] = await db.query(
            `SELECT wt.name, wt.category, wt.unit,
                    COALESCE(SUM(ci.weight), 0) AS weight,
                    COALESCE(SUM(ci.subtotal), 0) AS value
             FROM collection_items ci
             JOIN waste_types wt ON wt.id = ci.waste_type_id
             JOIN collection_requests cr ON cr.id = ci.collection_id
             WHERE ci.deleted_at IS NULL AND cr.deleted_at IS NULL ${crDateFilter}
             GROUP BY wt.id
             ORDER BY weight DESC`,
            params
        );

        const [byCompany] = await db.query(
            `SELECT COALESCE(c.name, 'Kemitraan Perorangan') AS company,
                    COUNT(DISTINCT cr.id) AS collections,
                    COALESCE(SUM(ci.weight), 0) AS weight,
                    COALESCE(SUM(ci.subtotal), 0) AS value
             FROM collection_requests cr
             LEFT JOIN companies c ON c.id = cr.company_id
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.deleted_at IS NULL ${crDateFilter}
             GROUP BY c.id
             ORDER BY collections DESC`,
            params
        );

        // Rekap Penjualan ke Pembeli / Pabrik Daur Ulang
        const [byBuyer] = await db.query(
            `SELECT b.name AS buyer_name,
                    COUNT(s.id) AS sales_count,
                    COALESCE(SUM(s.total_weight), 0) AS total_weight,
                    COALESCE(SUM(s.total_amount), 0) AS total_amount
             FROM sales s
             LEFT JOIN buyers b ON b.id = s.buyer_id
             WHERE s.deleted_at IS NULL ${sDateFilter}
             GROUP BY s.buyer_id
             ORDER BY total_amount DESC`,
            params
        );

        res.render("reports/index", {
            layout: "layout/layout",
            title: "Laporan & Monitoring",
            stats: stats || {},
            byWaste: byWaste || [],
            byCompany: byCompany || [],
            byBuyer: byBuyer || [],
            filters: { start_date: startDate || '', end_date: endDate || '' }
        });
    } catch (e) {
        console.error("Reports Router Error:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: e.message
        });
    }
});

module.exports = router;
