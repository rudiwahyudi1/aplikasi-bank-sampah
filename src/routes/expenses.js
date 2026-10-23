const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");

const router = express.Router();

const VALID_CATEGORIES = [
    "armada_bensin",
    "karung_tali",
    "pemeliharaan_alat",
    "konsumsi_lembur",
    "listrik_air",
    "lainnya"
];

function checkManagerAccess(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }
    const role = req.session.user.role;
    if (["superadmin", "admin_pengelola", "petugas_pengumpulan"].includes(role)) {
        return next();
    }
    req.flash("error", "Akses terbatas untuk pengelola dan staf operasional.");
    return res.redirect("/dashboard");
}

// ================================================================
// GET /expenses - Daftar Biaya Operasional & Kas Kecil
// ================================================================
router.get("/", checkManagerAccess, async (req, res) => {
    try {
        const db = getPool();
        const keyword = clean(req.query.keyword);
        const category = clean(req.query.category);
        const date_start = clean(req.query.date_start);
        const date_end = clean(req.query.date_end);

        let p = page(req.query.page);
        let l = limit(req.query.limit, 12);

        let where = ["deleted_at IS NULL"];
        let params = [];

        if (keyword) {
            where.push("(expense_code LIKE ? OR title LIKE ? OR pic_name LIKE ? OR notes LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        if (VALID_CATEGORIES.includes(category)) {
            where.push("category = ?");
            params.push(category);
        }

        if (date_start) {
            where.push("expense_date >= ?");
            params.push(date_start);
        }

        if (date_end) {
            where.push("expense_date <= ?");
            params.push(date_end);
        }

        const W = "WHERE " + where.join(" AND ");

        const [[cnt]] = await db.query(
            `SELECT COUNT(*) as total FROM operational_expenses ${W}`,
            params
        );
        const total = Number(cnt.total || 0);
        const pages = Math.max(1, Math.ceil(total / l));
        const cp = Math.min(p, pages);
        const off = (cp - 1) * l;

        const [rows] = await db.query(
            `SELECT * FROM operational_expenses ${W} 
             ORDER BY expense_date DESC, id DESC 
             LIMIT ? OFFSET ?`,
            [...params, l, off]
        );

        // Ringkasan Metrik Statistik
        const [[summary]] = await db.query(`
            SELECT 
                COALESCE(SUM(amount), 0) as total_expenses,
                COALESCE(SUM(CASE WHEN category = 'armada_bensin' THEN amount ELSE 0 END), 0) as bensin_expenses,
                COALESCE(SUM(CASE WHEN category IN ('karung_tali', 'pemeliharaan_alat') THEN amount ELSE 0 END), 0) as alat_expenses,
                COUNT(*) as count_transactions
            FROM operational_expenses 
            WHERE deleted_at IS NULL
        `);

        res.render("expenses/index", {
            layout: "layout/layout",
            title: "Biaya Operasional & Kas Kecil",
            rows,
            summary: summary || {
                total_expenses: 0,
                bensin_expenses: 0,
                alat_expenses: 0,
                count_transactions: 0
            },
            filters: { keyword, category, date_start, date_end },
            pagination: { page: cp, limit: l, total, totalPages: pages },
            canManage: ["superadmin", "admin_pengelola"].includes(req.session.user.role)
        });

    } catch (err) {
        console.error("Error in GET /expenses:", err);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500 - Kesalahan Server",
            message: "Gagal memuat biaya operasional: " + err.message
        });
    }
});

// ================================================================
// POST /expenses/add - Catat Pengeluaran Kas Baru
// ================================================================
router.post("/add", checkManagerAccess, async (req, res) => {
    try {
        const db = getPool();
        const title = clean(req.body.title);
        const category = clean(req.body.category) || "lainnya";
        const amount = num(req.body.amount);
        const expense_date = clean(req.body.expense_date) || new Date().toISOString().slice(0, 10);
        const pic_name = clean(req.body.pic_name) || req.session.user.username;
        const notes = clean(req.body.notes) || null;

        if (!title || amount <= 0) {
            throw new Error("Keterangan pengeluaran dan nominal biaya wajib valid.");
        }

        // Generate nomor kode BOP-YYYY-XXXX
        const year = new Date().getFullYear();
        const [[maxRow]] = await db.query(
            "SELECT COUNT(*) as count FROM operational_expenses WHERE YEAR(expense_date) = ?",
            [year]
        );
        const seq = String(Number(maxRow.count || 0) + 1).padStart(4, "0");
        const expense_code = `BOP-${year}-${seq}`;

        await db.query(`
            INSERT INTO operational_expenses (expense_code, category, title, amount, expense_date, pic_name, notes, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [expense_code, category, title, amount, expense_date, pic_name, notes, req.session.user.id]);

        req.flash("success", `Pengeluaran kas ${expense_code} senilai Rp ${amount.toLocaleString('id-ID')} berhasil dicatat.`);
        res.redirect("/expenses");
    } catch (err) {
        console.error("Error adding expense:", err);
        req.flash("error", "Gagal mencatat pengeluaran: " + err.message);
        res.redirect("/expenses");
    }
});

// ================================================================
// POST /expenses/:id/update - Edit Pengeluaran Kas
// ================================================================
router.post("/:id/update", checkManagerAccess, async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const title = clean(req.body.title);
        const category = clean(req.body.category) || "lainnya";
        const amount = num(req.body.amount);
        const expense_date = clean(req.body.expense_date);
        const pic_name = clean(req.body.pic_name);
        const notes = clean(req.body.notes);

        await db.query(`
            UPDATE operational_expenses SET 
                title = ?, 
                category = ?, 
                amount = ?, 
                expense_date = ?, 
                pic_name = ?, 
                notes = ?,
                updated_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `, [title, category, amount, expense_date, pic_name, notes, id]);

        req.flash("success", "Catatan pengeluaran operasional berhasil diperbarui.");
        res.redirect("/expenses");
    } catch (err) {
        console.error("Error updating expense:", err);
        req.flash("error", "Gagal memperbarui: " + err.message);
        res.redirect("/expenses");
    }
});

// ================================================================
// POST /expenses/:id/delete - Hapus Pengeluaran Kas
// ================================================================
router.post("/:id/delete", checkManagerAccess, async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);

        await db.query(
            "UPDATE operational_expenses SET deleted_at = NOW() WHERE id = ?",
            [id]
        );

        req.flash("success", "Pengeluaran kas berhasil dihapus.");
        res.redirect("/expenses");
    } catch (err) {
        console.error("Error deleting expense:", err);
        req.flash("error", err.message);
        res.redirect("/expenses");
    }
});

module.exports = router;
