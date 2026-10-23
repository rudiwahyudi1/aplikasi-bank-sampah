const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");

const router = express.Router();

const PROCESS_TYPES = ["kompos", "maggot", "cacah_plastik", "press_bal", "kerajinan", "lainnya"];
const STATUSES = ["direncanakan", "proses", "selesai", "gagal"];

// GET /processing
router.get("/", hasPermission("processing.read"), async (req, res) => {
    try {
        const db = getPool();
        const keyword = clean(req.query.keyword);
        const process_type = clean(req.query.process_type);
        const status = clean(req.query.status);

        let p = page(req.query.page);
        let l = limit(req.query.limit);
        let where = ["wp.deleted_at IS NULL"];
        let params = [];

        if (keyword) {
            where.push("(wp.code LIKE ? OR wp.output_product_name LIKE ? OR wt.name LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }
        if (PROCESS_TYPES.includes(process_type)) {
            where.push("wp.process_type = ?");
            params.push(process_type);
        }
        if (STATUSES.includes(status)) {
            where.push("wp.status = ?");
            params.push(status);
        }

        const W = "WHERE " + where.join(" AND ");

        // Count total
        const [[cnt]] = await db.query(
            `SELECT COUNT(*) AS total 
             FROM waste_processings wp 
             LEFT JOIN waste_types wt ON wt.id = wp.waste_type_id 
             ${W}`,
            params
        );
        const total = Number(cnt.total || 0);
        const pages = Math.max(1, Math.ceil(total / l));
        const cp = Math.min(p, pages);
        const off = (cp - 1) * l;

        // Fetch rows
        const [rows] = await db.query(
            `SELECT wp.*, 
                    wt.name AS waste_type_name, wt.category AS waste_category, wt.unit AS waste_unit,
                    u.full_name AS pic_name
             FROM waste_processings wp
             LEFT JOIN waste_types wt ON wt.id = wp.waste_type_id
             LEFT JOIN users u ON u.id = wp.pic_user_id
             ${W}
             ORDER BY wp.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, l, off]
        );

        // Fetch statistics summary
        const [[summary]] = await db.query(
            `SELECT 
                COUNT(*) AS total_batches,
                SUM(status = 'proses') AS in_progress,
                SUM(status = 'selesai') AS completed,
                COALESCE(SUM(input_weight), 0) AS total_input_weight,
                COALESCE(SUM(output_weight), 0) AS total_output_weight
             FROM waste_processings
             WHERE deleted_at IS NULL`
        );

        // Fetch master waste types for form dropdown
        const [wasteTypes] = await db.query(
            "SELECT id, code, name, category, unit FROM waste_types WHERE status = 'active' AND deleted_at IS NULL ORDER BY name ASC"
        );

        // Fetch operator / staff users for PIC dropdown
        const [picUsers] = await db.query(
            "SELECT id, full_name, username FROM users WHERE status = 'active' AND deleted_at IS NULL ORDER BY full_name ASC"
        );

        const canManage = req.session.user.role === "superadmin" || (req.session.permissions && req.session.permissions.includes("processing.manage"));

        res.render("processing/index", {
            layout: "layout/layout",
            title: "Pengolahan & Daur Ulang Sampah",
            currentUrl: "/processing",
            rows,
            summary: {
                total_batches: Number(summary?.total_batches || 0),
                in_progress: Number(summary?.in_progress || 0),
                completed: Number(summary?.completed || 0),
                total_input_weight: Number(summary?.total_input_weight || 0),
                total_output_weight: Number(summary?.total_output_weight || 0)
            },
            filters: { keyword, process_type, status },
            pagination: { page: cp, limit: l, total, totalPages: pages },
            wasteTypes,
            picUsers,
            canManage
        });
    } catch (e) {
        console.error("PROCESSING ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat data pengolahan sampah: " + e.message
        });
    }
});

// POST /processing/add
router.post("/add", hasPermission("processing.manage"), async (req, res) => {
    try {
        const db = getPool();
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(1000 + Math.random() * 9000);
        const code = clean(req.body.code) || `PRC-${dateStr}-${rand}`;
        
        const waste_type_id = num(req.body.waste_type_id);
        const process_type = clean(req.body.process_type);
        const input_weight = num(req.body.input_weight);
        const output_product_name = clean(req.body.output_product_name) || null;
        const start_date = clean(req.body.start_date) || new Date().toISOString().slice(0, 10);
        const pic_user_id = num(req.body.pic_user_id) || req.session.user.id;
        const notes = clean(req.body.notes) || null;

        if (!waste_type_id || !PROCESS_TYPES.includes(process_type) || input_weight <= 0) {
            throw new Error("Jenis sampah, metode olah, dan berat bahan baku (> 0 kg) wajib diisi.");
        }

        const [result] = await db.query(
            `INSERT INTO waste_processings 
             (code, waste_type_id, process_type, input_weight, output_product_name, start_date, status, pic_user_id, notes) 
             VALUES (?, ?, ?, ?, ?, ?, 'proses', ?, ?)`,
            [code, waste_type_id, process_type, input_weight, output_product_name, start_date, pic_user_id, notes]
        );

        // Record inventory log (out) for raw waste consumed by processing
        await db.query(
            `INSERT INTO waste_inventory_logs 
             (waste_type_id, type, quantity, reference_type, reference_id, notes, recorded_by) 
             VALUES (?, 'out', ?, 'processing', ?, ?, ?)`,
            [waste_type_id, input_weight, result.insertId, `Alokasi bahan baku batch ${code}`, req.session.user.id]
        );

        req.flash("success", `Batch pengolahan ${code} berhasil dibuat!`);
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/processing");
});

// POST /processing/:id/finish
router.post("/:id/finish", hasPermission("processing.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const status = clean(req.body.status) || "selesai";
        const output_product_name = clean(req.body.output_product_name);
        const output_weight = num(req.body.output_weight);
        const end_date = clean(req.body.end_date) || new Date().toISOString().slice(0, 10);
        const notes = clean(req.body.notes);

        if (status === "selesai" && (!output_product_name || output_weight <= 0)) {
            throw new Error("Nama produk jadi dan berat hasil panen (> 0 kg) wajib diisi untuk status selesai.");
        }

        await db.query(
            `UPDATE waste_processings 
             SET status = ?, output_product_name = ?, output_weight = ?, end_date = ?, notes = COALESCE(?, notes) 
             WHERE id = ? AND deleted_at IS NULL`,
            [status, output_product_name, output_weight, end_date, notes, id]
        );

        req.flash("success", `Status pengolahan berhasil diupdate menjadi: ${status.toUpperCase()}!`);
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/processing");
});

// POST /processing/:id/delete
router.post("/:id/delete", hasPermission("processing.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        await db.query("UPDATE waste_processings SET deleted_at = NOW() WHERE id = ?", [id]);
        req.flash("success", "Data pengolahan berhasil dihapus.");
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/processing");
});

module.exports = router;
