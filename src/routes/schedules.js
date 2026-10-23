const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { clean, num } = require("./_helpers");

const router = express.Router();

// GET /schedules
router.get("/", hasPermission("schedules.read"), async (req, res) => {
    try {
        const db = getPool();
        const user = req.session.user;
        const canManage = user && (user.role === "superadmin" || user.role === "admin_pengelola" || (req.session.permissions && req.session.permissions.includes("schedules.manage")));

        const keyword = clean(req.query.keyword);
        const day = clean(req.query.day);
        const status = clean(req.query.status);

        let where = ["s.deleted_at IS NULL"];
        let params = [];

        if (keyword) {
            where.push("(s.zone_name LIKE ? OR s.coverage_area LIKE ? OR s.driver_name LIKE ? OR s.vehicle_type LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }
        if (day && day !== "semua") {
            where.push("s.day_of_week LIKE ?");
            params.push(`%${day}%`);
        }
        if (status && status !== "semua") {
            where.push("s.status = ?");
            params.push(status);
        }

        const [schedules] = await db.query(
            `SELECT s.*, 
                    (SELECT COUNT(*) FROM pickup_schedule_logs psl WHERE psl.schedule_id = s.id) AS total_runs,
                    (SELECT COALESCE(SUM(actual_weight_kg), 0) FROM pickup_schedule_logs psl WHERE psl.schedule_id = s.id) AS total_collected_kg
             FROM pickup_schedules s 
             WHERE ${where.join(" AND ")} 
             ORDER BY s.id ASC`,
            params
        );

        // Fetch execution logs (like mutation logs in inventory)
        const [logs] = await db.query(
            `SELECT psl.*, s.zone_name, s.vehicle_type, s.target_capacity_kg, u.full_name AS officer_name
             FROM pickup_schedule_logs psl
             JOIN pickup_schedules s ON s.id = psl.schedule_id
             LEFT JOIN users u ON u.id = psl.recorded_by
             ORDER BY psl.execution_date DESC, psl.id DESC
             LIMIT 40`
        );

        // Summary Statistics
        const [[stats]] = await db.query(
            `SELECT 
                COUNT(*) AS total_routes,
                COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active_routes,
                COALESCE(SUM(target_capacity_kg), 0) AS total_target_kg,
                (SELECT COUNT(*) FROM pickup_schedule_logs) AS total_executions
             FROM pickup_schedules 
             WHERE deleted_at IS NULL`
        );

        res.render("schedules/index", {
            layout: "layout/layout",
            title: "Jadwal & Rute Penjemputan Wilayah",
            currentUrl: "/schedules",
            schedules,
            logs,
            summary: {
                total_routes: Number(stats?.total_routes || 0),
                active_routes: Number(stats?.active_routes || 0),
                total_target_kg: Number(stats?.total_target_kg || 0),
                total_executions: Number(stats?.total_executions || 0)
            },
            filters: { keyword, day, status },
            canManage
        });
    } catch (e) {
        console.error("SCHEDULES ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat jadwal & rute penjemputan: " + e.message
        });
    }
});

// POST /schedules/create (Admin tambah rute wilayah baru)
router.post("/create", hasPermission("schedules.manage"), async (req, res) => {
    try {
        const db = getPool();
        const zoneName = clean(req.body.zone_name);
        const coverageArea = clean(req.body.coverage_area);
        const dayOfWeek = clean(req.body.day_of_week) || "Senin & Kamis";
        const startTime = clean(req.body.start_time) || "08:00";
        const endTime = clean(req.body.end_time) || "12:00";
        const vehicleType = clean(req.body.vehicle_type) || "Motor Tossa Roda Tiga";
        const driverName = clean(req.body.driver_name) || "Petugas Lapangan";
        const targetCapacityKg = Math.max(0, num(req.body.target_capacity_kg, 300));
        const status = clean(req.body.status) || "active";
        const notes = clean(req.body.notes);

        if (!zoneName || !coverageArea) {
            req.flash("error", "Nama wilayah dan cakupan rute wajib diisi.");
            return res.redirect("/schedules");
        }

        await db.query(
            `INSERT INTO pickup_schedules 
             (zone_name, coverage_area, day_of_week, start_time, end_time, vehicle_type, driver_name, target_capacity_kg, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [zoneName, coverageArea, dayOfWeek, startTime, endTime, vehicleType, driverName, targetCapacityKg, status, notes]
        );

        req.flash("success", `Rute wilayah "${zoneName}" berhasil ditambahkan ke jadwal operasional!`);
    } catch (e) {
        console.error("CREATE SCHEDULE ERROR:", e);
        req.flash("error", "Gagal menambah rute: " + e.message);
    }
    res.redirect("/schedules");
});

// POST /schedules/edit/:id (Admin edit rute wilayah)
router.post("/edit/:id", hasPermission("schedules.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const zoneName = clean(req.body.zone_name);
        const coverageArea = clean(req.body.coverage_area);
        const dayOfWeek = clean(req.body.day_of_week);
        const startTime = clean(req.body.start_time);
        const endTime = clean(req.body.end_time);
        const vehicleType = clean(req.body.vehicle_type);
        const driverName = clean(req.body.driver_name);
        const targetCapacityKg = Math.max(0, num(req.body.target_capacity_kg));
        const status = clean(req.body.status) || "active";
        const notes = clean(req.body.notes);

        if (!zoneName || !coverageArea) {
            req.flash("error", "Nama wilayah dan cakupan rute tidak boleh kosong.");
            return res.redirect("/schedules");
        }

        await db.query(
            `UPDATE pickup_schedules 
             SET zone_name = ?, coverage_area = ?, day_of_week = ?, start_time = ?, end_time = ?, 
                 vehicle_type = ?, driver_name = ?, target_capacity_kg = ?, status = ?, notes = ?, updated_at = NOW()
             WHERE id = ? AND deleted_at IS NULL`,
            [zoneName, coverageArea, dayOfWeek, startTime, endTime, vehicleType, driverName, targetCapacityKg, status, notes, id]
        );

        req.flash("success", `Jadwal rute "${zoneName}" berhasil diperbarui!`);
    } catch (e) {
        console.error("EDIT SCHEDULE ERROR:", e);
        req.flash("error", "Gagal memperbarui rute: " + e.message);
    }
    res.redirect("/schedules");
});

// POST /schedules/delete/:id (Admin hapus rute)
router.post("/delete/:id", hasPermission("schedules.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);

        await db.query("UPDATE pickup_schedules SET deleted_at = NOW() WHERE id = ?", [id]);
        req.flash("success", "Rute wilayah berhasil dinonaktifkan / dihapus.");
    } catch (e) {
        console.error("DELETE SCHEDULE ERROR:", e);
        req.flash("error", "Gagal menghapus rute: " + e.message);
    }
    res.redirect("/schedules");
});

// POST /schedules/log (Catat realisasi pelaksanaan penjemputan harian)
router.post("/log", hasPermission("schedules.manage"), async (req, res) => {
    try {
        const db = getPool();
        const scheduleId = num(req.body.schedule_id);
        const executionDate = clean(req.body.execution_date) || new Date().toISOString().slice(0, 10);
        const householdsServed = Math.max(0, parseInt(req.body.households_served || "0", 10));
        const actualWeightKg = Math.max(0, num(req.body.actual_weight_kg));
        const officerNotes = clean(req.body.officer_notes);
        const recordedBy = req.session.user ? req.session.user.id : null;

        if (!scheduleId || actualWeightKg <= 0) {
            req.flash("error", "Pilih rute wilayah dan masukkan berat sampah riil yang terangkut.");
            return res.redirect("/schedules");
        }

        await db.query(
            `INSERT INTO pickup_schedule_logs 
             (schedule_id, execution_date, households_served, actual_weight_kg, officer_notes, recorded_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [scheduleId, executionDate, householdsServed, actualWeightKg, officerNotes, recordedBy]
        );

        req.flash("success", `Realisasi penjemputan seberat ${actualWeightKg.toLocaleString('id-ID')} kg berhasil dicatat ke sistem!`);
    } catch (e) {
        console.error("RECORD SCHEDULE LOG ERROR:", e);
        req.flash("error", "Gagal mencatat log pelaksanaan rute: " + e.message);
    }
    res.redirect("/schedules");
});

module.exports = router;
