const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");

const router = express.Router();

const CATEGORIES = [
    "unit_bank_sampah",
    "dropbox_publik",
    "tps3r_induk",
    "sekolah_kampus",
    "kantor_mitra"
];

const STATUSES = ["aktif", "hampir_penuh", "penuh", "pemeliharaan", "nonaktif"];

// GET /drop-points
router.get("/", hasPermission("drop_points.read"), async (req, res) => {
    try {
        const db = getPool();
        const user = req.session.user;
        const keyword = clean(req.query.keyword);
        const category = clean(req.query.category);
        const status = clean(req.query.status);

        let p = page(req.query.page);
        let l = limit(req.query.limit, 12);
        let where = ["dp.deleted_at IS NULL"];
        let params = [];

        if (keyword) {
            where.push("(dp.code LIKE ? OR dp.name LIKE ? OR dp.district LIKE ? OR dp.address LIKE ? OR dp.accepted_waste_types LIKE ? OR dp.pic_name LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }
        if (CATEGORIES.includes(category)) {
            where.push("dp.category = ?");
            params.push(category);
        }
        if (STATUSES.includes(status)) {
            where.push("dp.status = ?");
            params.push(status);
        }

        const W = "WHERE " + where.join(" AND ");

        // Total count
        const [[cnt]] = await db.query(
            `SELECT COUNT(*) AS total FROM drop_points dp ${W}`,
            params
        );
        const total = Number(cnt.total || 0);
        const pages = Math.max(1, Math.ceil(total / l));
        const cp = Math.min(p, pages);
        const off = (cp - 1) * l;

        // Fetch drop point rows
        const [rows] = await db.query(
            `SELECT dp.*,
                    ROUND((dp.current_load_kg / GREATEST(dp.capacity_kg, 1)) * 100, 1) AS load_percentage,
                    (SELECT COUNT(*) FROM drop_point_logs dpl WHERE dpl.drop_point_id = dp.id) AS total_emptied_runs
             FROM drop_points dp
             ${W}
             ORDER BY 
                CASE 
                    WHEN dp.status = 'penuh' THEN 1
                    WHEN dp.status = 'hampir_penuh' THEN 2
                    WHEN dp.status = 'aktif' THEN 3
                    ELSE 4
                END,
                dp.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, l, off]
        );

        // Fetch statistics summary
        const [[summary]] = await db.query(
            `SELECT 
                COUNT(*) AS total_points,
                SUM(status = 'aktif') AS active_points,
                SUM(status IN ('hampir_penuh', 'penuh')) AS warning_points,
                SUM(status = 'penuh') AS full_points,
                COALESCE(SUM(capacity_kg), 0) AS total_capacity_kg,
                COALESCE(SUM(current_load_kg), 0) AS total_load_kg
             FROM drop_points
             WHERE deleted_at IS NULL`
        );

        // Fetch recent drop point emptying logs
        const [recentLogs] = await db.query(
            `SELECT dpl.*, dp.name AS drop_point_name, dp.code AS drop_point_code, u.full_name AS officer_name
             FROM drop_point_logs dpl
             JOIN drop_points dp ON dp.id = dpl.drop_point_id
             LEFT JOIN users u ON u.id = dpl.emptied_by
             ORDER BY dpl.collection_date DESC, dpl.id DESC
             LIMIT 10`
        );

        // Fetch staff users for PIC / officer dropdown
        const [officers] = await db.query(
            "SELECT id, full_name, username FROM users WHERE status = 'active' AND deleted_at IS NULL ORDER BY full_name ASC"
        );

        const canManage = user.role === "superadmin" || 
                          user.role === "admin_pengelola" || 
                          user.role === "petugas_pengumpulan" || 
                          (req.session.permissions && req.session.permissions.includes("drop_points.manage"));

        const isAdmin = user.role === "superadmin" || user.role === "admin_pengelola";

        res.render("drop_points/index", {
            layout: "layout/layout",
            title: "Pos Drop Point & Setor Mandiri",
            currentUrl: "/drop-points",
            rows,
            summary: {
                total_points: Number(summary?.total_points || 0),
                active_points: Number(summary?.active_points || 0),
                warning_points: Number(summary?.warning_points || 0),
                full_points: Number(summary?.full_points || 0),
                total_capacity_kg: Number(summary?.total_capacity_kg || 0),
                total_load_kg: Number(summary?.total_load_kg || 0)
            },
            recentLogs,
            officers,
            filters: { keyword, category, status },
            pagination: { page: cp, limit: l, total, totalPages: pages },
            canManage,
            isAdmin,
            userRole: user.role
        });
    } catch (e) {
        console.error("DROP POINTS ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat data pos drop point: " + e.message
        });
    }
});

// POST /drop-points/add
router.post("/add", hasPermission("drop_points.manage"), async (req, res) => {
    try {
        const db = getPool();
        const rand = Math.floor(100 + Math.random() * 900);
        const defaultCode = `DP-POS-${rand}`;
        const code = clean(req.body.code) || defaultCode;
        const name = clean(req.body.name);
        const category = clean(req.body.category) || "unit_bank_sampah";
        const address = clean(req.body.address);
        const district = clean(req.body.district) || null;
        const latitude = req.body.latitude ? Number(req.body.latitude) : null;
        const longitude = req.body.longitude ? Number(req.body.longitude) : null;
        const operational_hours = clean(req.body.operational_hours) || "08:00 - 16:00 WIB";
        const operational_days = clean(req.body.operational_days) || "Senin - Sabtu";
        const accepted_waste_types = clean(req.body.accepted_waste_types) || "Organik, Plastik, Kertas, Logam";
        const capacity_kg = num(req.body.capacity_kg) || 500;
        const current_load_kg = num(req.body.current_load_kg) || 0;
        const pic_name = clean(req.body.pic_name) || null;
        const pic_phone = clean(req.body.pic_phone) || null;
        const notes = clean(req.body.notes) || null;

        let status = clean(req.body.status) || "aktif";
        if (current_load_kg >= capacity_kg) {
            status = "penuh";
        } else if (current_load_kg >= capacity_kg * 0.8) {
            status = "hampir_penuh";
        }

        if (!name || !address || capacity_kg <= 0) {
            throw new Error("Nama pos, alamat lengkap, dan kapasitas (> 0 kg) wajib diisi.");
        }

        await db.query(
            `INSERT INTO drop_points 
             (code, name, category, address, district, latitude, longitude, operational_hours, operational_days, accepted_waste_types, capacity_kg, current_load_kg, pic_name, pic_phone, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, name, category, address, district, latitude, longitude, operational_hours, operational_days, accepted_waste_types, capacity_kg, current_load_kg, pic_name, pic_phone, status, notes]
        );

        req.flash("success", `Pos Drop Point "${name}" (${code}) berhasil didaftarkan!`);
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/drop-points");
});

// POST /drop-points/:id/update-load
router.post("/:id/update-load", hasPermission("drop_points.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const actionType = clean(req.body.action_type) || "update_load";
        const newLoad = num(req.body.current_load_kg);
        const emptiedWeight = num(req.body.weight_collected_kg);
        const notes = clean(req.body.notes);
        const collectionDate = clean(req.body.collection_date) || new Date().toISOString().slice(0, 10);
        const officerId = num(req.body.emptied_by) || req.session.user.id;

        const [[dp]] = await db.query("SELECT * FROM drop_points WHERE id = ? AND deleted_at IS NULL", [id]);
        if (!dp) throw new Error("Pos drop point tidak ditemukan.");

        if (actionType === "empty_load") {
            const weightToEmpty = emptiedWeight > 0 ? emptiedWeight : Number(dp.current_load_kg);
            if (weightToEmpty <= 0) {
                throw new Error("Muatan pos saat ini sudah 0 kg atau berat angkut tidak valid.");
            }

            // Record drop point log
            await db.query(
                `INSERT INTO drop_point_logs 
                 (drop_point_id, emptied_by, weight_collected_kg, collection_date, notes) 
                 VALUES (?, ?, ?, ?, ?)`,
                [id, officerId, weightToEmpty, collectionDate, notes || `Pengangkutan sampah dari ${dp.name} ke gudang induk`]
            );

            // Update drop point load
            const updatedLoad = Math.max(0, Number(dp.current_load_kg) - weightToEmpty);
            let updatedStatus = "aktif";
            if (updatedLoad >= dp.capacity_kg) {
                updatedStatus = "penuh";
            } else if (updatedLoad >= dp.capacity_kg * 0.8) {
                updatedStatus = "hampir_penuh";
            }

            await db.query(
                "UPDATE drop_points SET current_load_kg = ?, status = ? WHERE id = ?",
                [updatedLoad, updatedStatus, id]
            );

            req.flash("success", `Pengangkutan ${weightToEmpty} kg dari ${dp.name} berhasil dicatat. Kontainer kini siap menerima sampah kembali!`);
        } else {
            // Simple load update
            let updatedStatus = clean(req.body.status);
            if (!updatedStatus) {
                if (newLoad >= dp.capacity_kg) {
                    updatedStatus = "penuh";
                } else if (newLoad >= dp.capacity_kg * 0.8) {
                    updatedStatus = "hampir_penuh";
                } else {
                    updatedStatus = "aktif";
                }
            }

            await db.query(
                "UPDATE drop_points SET current_load_kg = ?, status = ?, notes = COALESCE(?, notes) WHERE id = ?",
                [newLoad, updatedStatus, notes, id]
            );

            req.flash("success", `Muatan pos ${dp.name} berhasil diperbarui menjadi ${newLoad} kg (${updatedStatus.toUpperCase()}).`);
        }
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/drop-points");
});

// POST /drop-points/:id/update
router.post("/:id/update", hasPermission("drop_points.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const name = clean(req.body.name);
        const category = clean(req.body.category);
        const address = clean(req.body.address);
        const district = clean(req.body.district) || null;
        const latitude = req.body.latitude ? Number(req.body.latitude) : null;
        const longitude = req.body.longitude ? Number(req.body.longitude) : null;
        const operational_hours = clean(req.body.operational_hours);
        const operational_days = clean(req.body.operational_days);
        const accepted_waste_types = clean(req.body.accepted_waste_types);
        const capacity_kg = num(req.body.capacity_kg);
        const pic_name = clean(req.body.pic_name) || null;
        const pic_phone = clean(req.body.pic_phone) || null;
        const status = clean(req.body.status) || "aktif";
        const notes = clean(req.body.notes) || null;

        if (!name || !address || capacity_kg <= 0) {
            throw new Error("Nama pos, alamat lengkap, dan kapasitas (> 0 kg) wajib diisi.");
        }

        await db.query(
            `UPDATE drop_points 
             SET name = ?, category = ?, address = ?, district = ?, latitude = ?, longitude = ?, 
                 operational_hours = ?, operational_days = ?, accepted_waste_types = ?, capacity_kg = ?, 
                 pic_name = ?, pic_phone = ?, status = ?, notes = ?
             WHERE id = ? AND deleted_at IS NULL`,
            [name, category, address, district, latitude, longitude, operational_hours, operational_days, accepted_waste_types, capacity_kg, pic_name, pic_phone, status, notes, id]
        );

        req.flash("success", `Informasi pos drop point "${name}" berhasil diperbarui!`);
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/drop-points");
});

// POST /drop-points/:id/delete
router.post("/:id/delete", hasPermission("drop_points.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        await db.query("UPDATE drop_points SET deleted_at = NOW() WHERE id = ?", [id]);
        req.flash("success", "Pos drop point berhasil dinonaktifkan.");
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/drop-points");
});

module.exports = router;
