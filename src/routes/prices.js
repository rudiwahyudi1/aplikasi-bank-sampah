const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");
const realtime = require("../services/realtime");

const router = express.Router();

const VALID_CATEGORIES = ["organik", "anorganik", "daur_ulang", "b3", "lainnya"];
const VALID_TRENDS = ["naik", "stabil", "turun"];

function checkManagePriceAccess(req) {
    if (!req.session || !req.session.user) return false;
    const role = req.session.user.role;
    if (role === "superadmin" || role === "admin_pengelola") return true;
    const perms = req.session.permissions || [];
    return perms.includes("waste.manage") || perms.includes("settings.manage");
}

// ================================================================
// GET /prices - Papan Informasi Harga Sampah & Panduan Bersih Pilah
// ================================================================
router.get("/", async (req, res) => {
    try {
        const db = getPool();
        const canManage = checkManagePriceAccess(req);

        const keyword = clean(req.query.keyword);
        const category = clean(req.query.category);
        const trend = clean(req.query.trend);

        let p = page(req.query.page);
        let l = limit(req.query.limit, 12);

        let where = ["deleted_at IS NULL", "status = 'active'"];
        let params = [];

        if (keyword) {
            where.push("(code LIKE ? OR name LIKE ? OR cleanliness_spec LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        if (VALID_CATEGORIES.includes(category)) {
            where.push("category = ?");
            params.push(category);
        }

        if (VALID_TRENDS.includes(trend)) {
            where.push("price_trend = ?");
            params.push(trend);
        }

        const W = "WHERE " + where.join(" AND ");

        const [[cnt]] = await db.query(
            `SELECT COUNT(*) as total FROM waste_types ${W}`,
            params
        );
        const total = Number(cnt.total || 0);
        const pages = Math.max(1, Math.ceil(total / l));
        const cp = Math.min(p, pages);
        const off = (cp - 1) * l;

        const [rows] = await db.query(
            `SELECT * FROM waste_types ${W} 
             ORDER BY 
                CASE 
                    WHEN category = 'daur_ulang' THEN 1 
                    WHEN category = 'anorganik' THEN 2
                    WHEN category = 'organik' THEN 3
                    ELSE 4 
                END, 
                price_per_unit DESC 
             LIMIT ? OFFSET ?`,
            [...params, l, off]
        );

        // Ringkasan Metrik Statistik
        const [[summary]] = await db.query(`
            SELECT 
                COUNT(*) as total_commodities,
                COALESCE(MAX(price_per_unit), 0) as max_price,
                COALESCE(AVG(price_per_unit), 0) as avg_price,
                COALESCE(MAX(last_price_updated_at), NOW()) as last_update,
                SUM(CASE WHEN price_trend = 'naik' THEN 1 ELSE 0 END) as count_naik,
                SUM(CASE WHEN price_trend = 'stabil' THEN 1 ELSE 0 END) as count_stabil,
                SUM(CASE WHEN price_trend = 'turun' THEN 1 ELSE 0 END) as count_turun
            FROM waste_types 
            WHERE deleted_at IS NULL AND status = 'active'
        `);

        // Daftar kategori unik untuk dropdown
        const [categories] = await db.query(`
            SELECT DISTINCT category, COUNT(*) as count 
            FROM waste_types 
            WHERE deleted_at IS NULL AND status = 'active'
            GROUP BY category
        `);

        res.render("prices/index", {
            layout: "layout/layout",
            title: "Papan Harga Sampah & Tips Pilah",
            rows,
            summary: summary || {
                total_commodities: 0,
                max_price: 0,
                avg_price: 0,
                last_update: new Date(),
                count_naik: 0,
                count_stabil: 0,
                count_turun: 0
            },
            categories: categories || [],
            filters: { keyword, category, trend },
            pagination: { page: cp, limit: l, total, totalPages: pages },
            canManage
        });

    } catch (err) {
        console.error("Error in GET /prices:", err);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500 - Kesalahan Server",
            message: "Gagal memuat papan harga sampah: " + err.message
        });
    }
});

// ================================================================
// GET /prices/api/detail/:id - Detail JSON Komoditas & Tips
// ================================================================
router.get("/api/detail/:id", async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const [[item]] = await db.query(
            "SELECT * FROM waste_types WHERE id = ? AND deleted_at IS NULL",
            [id]
        );

        if (!item) {
            return res.status(404).json({ success: false, message: "Komoditas tidak ditemukan." });
        }

        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ================================================================
// POST /prices/:id/update - Update Harga & Panduan Sortir (Admin)
// ================================================================
router.post("/:id/update", async (req, res) => {
    try {
        if (!checkManagePriceAccess(req)) {
            req.flash("error", "Anda tidak memiliki wewenang untuk mengubah harga komoditas.");
            return res.redirect("/prices");
        }

        const db = getPool();
        const id = num(req.params.id);

        const price_per_unit = num(req.body.price_per_unit);
        const sell_price_per_unit = num(req.body.sell_price_per_unit) || 0;
        const price_trend = clean(req.body.price_trend) || "stabil";
        const cleanliness_spec = clean(req.body.cleanliness_spec) || "Kering & Bersih";
        const sorting_tips = clean(req.body.sorting_tips) || null;

        await db.query(
            `UPDATE waste_types SET 
                price_per_unit = ?, 
                sell_price_per_unit = ?, 
                price_trend = ?, 
                cleanliness_spec = ?, 
                sorting_tips = ?,
                last_price_updated_at = NOW() 
             WHERE id = ? AND deleted_at IS NULL`,
            [price_per_unit, sell_price_per_unit, price_trend, cleanliness_spec, sorting_tips, id]
        );

        // Catat di log aktivitas jika tabel tersedia
        try {
            const [[user]] = await db.query("SELECT username FROM users WHERE id = ?", [req.session.user.id]);
            await db.query(
                `INSERT INTO activity_logs (user_id, action, module, description, ip_address) 
                 VALUES (?, 'UPDATE_PRICE', 'prices', ?, ?)`,
                [req.session.user.id, `Memperbarui harga komoditas ID #${id} menjadi Rp ${price_per_unit}`, req.ip || "127.0.0.1"]
            );
        } catch (_) {}

        req.flash("success", "Harga komoditas dan panduan sortir berhasil diperbarui.");
        realtime.notifyDataChange({
            entity: 'prices',
            action: 'update',
            title: 'Harga Sampah Diperbarui',
            message: `Harga beli komoditas sampah #${id} telah diperbarui menjadi Rp ${price_per_unit.toLocaleString('id-ID')}/kg`,
            id
        });
        res.redirect("/prices");
    } catch (err) {
        console.error("Error updating price:", err);
        req.flash("error", "Gagal memperbarui harga: " + err.message);
        res.redirect("/prices");
    }
});

// ================================================================
// POST /prices/add - Tambah Komoditas Baru (Admin)
// ================================================================
router.post("/add", async (req, res) => {
    try {
        if (!checkManagePriceAccess(req)) {
            req.flash("error", "Akses ditolak.");
            return res.redirect("/prices");
        }

        const db = getPool();
        const code = clean(req.body.code).toUpperCase();
        const name = clean(req.body.name);
        const category = clean(req.body.category) || "daur_ulang";
        const unit = clean(req.body.unit) || "kg";
        const price_per_unit = num(req.body.price_per_unit);
        const sell_price_per_unit = num(req.body.sell_price_per_unit) || 0;
        const price_trend = clean(req.body.price_trend) || "stabil";
        const cleanliness_spec = clean(req.body.cleanliness_spec) || "Kering & Bersih";
        const sorting_tips = clean(req.body.sorting_tips) || null;

        if (!code || !name) {
            throw new Error("Kode dan nama komoditas wajib diisi.");
        }

        await db.query(
            `INSERT INTO waste_types (code, name, category, unit, price_per_unit, sell_price_per_unit, price_trend, cleanliness_spec, sorting_tips, status, last_price_updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())`,
            [code, name, category, unit, price_per_unit, sell_price_per_unit, price_trend, cleanliness_spec, sorting_tips]
        );

        req.flash("success", `Komoditas ${name} (${code}) berhasil ditambahkan ke katalog.`);
        res.redirect("/prices");
    } catch (err) {
        console.error("Error adding price item:", err);
        req.flash("error", err.code === "ER_DUP_ENTRY" ? "Kode komoditas sudah digunakan." : err.message);
        res.redirect("/prices");
    }
});

module.exports = router;
