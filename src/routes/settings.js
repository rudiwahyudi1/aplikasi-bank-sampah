const express = require("express");
const { getPool } = require("../config/db");
const { clean, num } = require("./_helpers");

const router = express.Router();

function checkAdminAccess(req, res, next) {
    const u = req.session.user;
    if (!u) {
        return res.redirect("/login");
    }
    const isAllowed = u.role === "superadmin" || 
                      u.role === "admin_pengelola" || 
                      (Array.isArray(u.roles) && (u.roles.includes("superadmin") || u.roles.includes("admin_pengelola"))) ||
                      (Array.isArray(req.session.permissions) && req.session.permissions.includes("settings.manage"));

    if (!isAllowed) {
        req.flash("error", "Akses ditolak: Menu Pengaturan hanya dapat diakses oleh Admin Pengelola / Superadmin.");
        return res.redirect("/dashboard");
    }
    next();
}

// GET /settings
router.get("/", checkAdminAccess, async (req, res) => {
    try {
        const db = getPool();
        const [rows] = await db.query("SELECT * FROM system_settings ORDER BY setting_group, setting_key ASC");

        const settings = {};
        rows.forEach(r => {
            settings[r.setting_key] = r.setting_value;
        });

        // Summary metrics
        const summary = {
            bank_name: settings.bank_name || "Bank Sampah",
            min_withdrawal: Number(settings.min_withdrawal || 10000),
            whatsapp: settings.contact_whatsapp || "-",
            operational: settings.operational_hours || "08:00 - 16:00"
        };

        res.render("settings/index", {
            layout: "layout/layout",
            title: "Pengaturan Profil Bank Sampah",
            settings,
            rows,
            summary,
            currentUser: req.session.user
        });
    } catch (err) {
        console.error("Error in /settings:", err);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500 - Kesalahan Server",
            message: "Gagal memuat pengaturan: " + err.message
        });
    }
});

// POST /settings/update
router.post("/update", checkAdminAccess, async (req, res) => {
    try {
        const db = getPool();
        const body = req.body;

        const updateKeys = [
            "bank_name",
            "office_address",
            "contact_phone",
            "contact_whatsapp",
            "contact_email",
            "min_withdrawal",
            "operational_hours",
            "system_announcement"
        ];

        for (const key of updateKeys) {
            if (body[key] !== undefined) {
                const val = clean(body[key]);
                await db.query(
                    `INSERT INTO system_settings (setting_key, setting_value)
                     VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()`,
                    [key, val]
                );
            }
        }

        // Try logging activity
        try {
            await db.query(
                `INSERT INTO activity_logs (user_id, action, description, ip_address)
                 VALUES (?, 'UPDATE_SETTINGS', 'Memperbarui profil bank sampah & parameter sistem', ?)`,
                [req.session.user.id, req.ip || null]
            );
        } catch (e) {}

        req.flash("success", "Pengaturan profil bank sampah & parameter operasional berhasil disimpan!");
        res.redirect("/settings");
    } catch (err) {
        console.error("Error updating settings:", err);
        req.flash("error", "Gagal menyimpan pengaturan: " + err.message);
        res.redirect("/settings");
    }
});

module.exports = router;
