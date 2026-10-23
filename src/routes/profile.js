const express = require("express");
const bcrypt = require("bcryptjs");
const { getPool } = require("../config/db");
const { auth } = require("../middleware/auth");
const { num, clean } = require("./_helpers");

const router = express.Router();

// ================================================================
// GET /profile (PROFIL PENGGUNA)
// ================================================================
router.get("/", auth, async (req, res) => {
    try {
        const db = getPool();
        const userId = req.session.user.id;

        const [[u]] = await db.query(
            `SELECT u.*, GROUP_CONCAT(r.display_name ORDER BY r.id SEPARATOR ', ') roles
             FROM users u
             LEFT JOIN user_roles ur ON ur.user_id = u.id
             LEFT JOIN roles r ON r.id = ur.role_id
             WHERE u.id = ? AND u.deleted_at IS NULL
             GROUP BY u.id`,
            [userId]
        );

        if (!u) {
            req.flash("error", "Pengguna tidak ditemukan.");
            return res.redirect("/dashboard");
        }

        // Get collection and sales stats for user
        const [[stats]] = await db.query(
            `SELECT 
                (SELECT COUNT(*) FROM collection_requests WHERE user_id = ? AND deleted_at IS NULL) total_pickups,
                (SELECT COUNT(*) FROM collection_requests WHERE user_id = ? AND status = 'selesai' AND deleted_at IS NULL) finished_pickups,
                (SELECT COALESCE(SUM(ci.weight), 0) FROM collection_requests cr JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL WHERE cr.user_id = ? AND cr.status = 'selesai' AND cr.deleted_at IS NULL) total_waste_kg,
                (SELECT COUNT(*) FROM sales s JOIN collection_requests cr ON cr.id = s.collection_id WHERE cr.user_id = ? AND s.deleted_at IS NULL) total_sales
            `,
            [userId, userId, userId, userId]
        );

        // Calculate profile completion score
        const profileFields = [
            u.full_name,
            u.username,
            u.email,
            u.phone,
            u.ktp_number,
            u.age,
            u.address,
            u.bank_name,
            u.bank_account_number,
            u.bank_account_holder
        ];
        const filledFields = profileFields.filter(f => f && String(f).trim().length > 0).length;
        const completionPct = Math.round((filledFields / profileFields.length) * 100);

        res.render("profile/index", {
            layout: "layout/layout",
            title: "Profil Pengguna",
            u,
            stats: stats || {},
            completionPct
        });
    } catch (e) {
        console.error("GET /profile error:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: e.message
        });
    }
});

// ================================================================
// POST /profile/update (UPDATE PROFIL PENGGUNA)
// ================================================================
router.post("/update", auth, async (req, res) => {
    try {
        const db = getPool();
        const userId = req.session.user.id;

        const fullName = clean(req.body.full_name);
        const phone = clean(req.body.phone) || null;
        const ktpNumber = clean(req.body.ktp_number) || null;
        const age = num(req.body.age) || null;
        const address = clean(req.body.address) || null;
        const bankName = clean(req.body.bank_name) || null;
        const bankAccountNumber = clean(req.body.bank_account_number) || null;
        const bankAccountHolder = clean(req.body.bank_account_holder) || null;
        const password = clean(req.body.password);

        if (!fullName) {
            throw new Error("Nama lengkap wajib diisi.");
        }

        if (ktpNumber && ktpNumber.length < 10) {
            throw new Error("Nomor KTP minimal 10 digit.");
        }

        // Update basic fields
        await db.query(
            `UPDATE users
             SET full_name = ?,
                 phone = ?,
                 ktp_number = ?,
                 age = ?,
                 address = ?,
                 bank_name = ?,
                 bank_account_number = ?,
                 bank_account_holder = ?
             WHERE id = ? AND deleted_at IS NULL`,
            [fullName, phone, ktpNumber, age, address, bankName, bankAccountNumber, bankAccountHolder, userId]
        );

        // Optional password update
        if (password && password.length >= 6) {
            const hash = await bcrypt.hash(password, 12);
            await db.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [hash, userId]);
        }

        // Refresh session
        req.session.user.full_name = fullName;
        if (phone) req.session.user.phone = phone;

        req.flash("success", "Profil Anda dan data rekening berhasil diperbarui.");
    } catch (e) {
        console.error("POST /profile/update error:", e);
        req.flash("error", e.message);
    }
    res.redirect("/profile");
});

module.exports = router;
