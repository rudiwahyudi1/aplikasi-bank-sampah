const express = require("express");
const bcrypt = require("bcryptjs");
const { getPool } = require("../config/db");
const { clean, num } = require("./_helpers");

const router = express.Router();

// GET /members
router.get("/", async (req, res) => {
    try {
        const db = getPool();
        const currentUser = req.session.user;
        if (!currentUser) {
            return res.redirect("/login");
        }
        const keyword = clean(req.query.keyword);
        const status = clean(req.query.status);
        const roleFilter = clean(req.query.role);
        const isNasabah = String(currentUser?.role || "").toLowerCase() === 'nasabah';
        const canManage = currentUser && ['superadmin', 'admin_pengelola', 'petugas_pengumpulan'].includes(currentUser.role);

        let where = ["u.deleted_at IS NULL"];
        let params = [];

        // Role restriction: Nasabah hanya melihat kartu anggota miliknya sendiri
        if (isNasabah) {
            where.push("u.id = ?");
            params.push(currentUser.id);
        }

        if (keyword) {
            where.push("(u.full_name LIKE ? OR u.username LIKE ? OR u.phone LIKE ? OR u.address LIKE ? OR u.id = ?)");
            const parsedId = parseInt(keyword.replace(/\D/g, ''), 10) || 0;
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, parsedId);
        }

        if (status) {
            where.push("u.status = ?");
            params.push(status);
        }

        if (roleFilter) {
            where.push("r.name = ?");
            params.push(roleFilter);
        }

        const [members] = await db.query(
            `SELECT 
                u.id, 
                u.username, 
                u.email, 
                u.full_name, 
                u.phone, 
                u.address, 
                u.status, 
                u.wallet_balance, 
                u.created_at,
                COALESCE((
                    SELECT SUM(ci.weight) 
                    FROM collection_requests cr 
                    JOIN collection_items ci ON ci.collection_id = cr.id 
                    WHERE cr.user_id = u.id AND cr.status = 'completed'
                ), 0) AS total_kg,
                GROUP_CONCAT(DISTINCT r.display_name SEPARATOR ', ') AS role_display,
                GROUP_CONCAT(DISTINCT r.name SEPARATOR ', ') AS role_names
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE ${where.join(" AND ")}
            GROUP BY u.id
            ORDER BY u.created_at DESC`,
            params
        );

        // Summary statistics (hanya data nasabah bersangkutan jika role nasabah)
        let statsQuery = `
            SELECT 
                COUNT(DISTINCT u.id) AS total_members,
                SUM(CASE WHEN u.status = 'active' THEN 1 ELSE 0 END) AS active_members,
                COALESCE(SUM(u.wallet_balance), 0) AS total_balance,
                COALESCE((
                    SELECT SUM(ci.weight) 
                    FROM collection_requests cr 
                    JOIN collection_items ci ON ci.collection_id = cr.id 
                    WHERE cr.status = 'completed'
                ), 0) AS total_deposited_kg
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.deleted_at IS NULL
        `;
        let statsParams = [];

        if (isNasabah) {
            statsQuery = `
                SELECT 
                    1 AS total_members,
                    1 AS active_members,
                    u.wallet_balance AS total_balance,
                    COALESCE((
                        SELECT SUM(ci.weight) 
                        FROM collection_requests cr 
                        JOIN collection_items ci ON ci.collection_id = cr.id 
                        WHERE cr.user_id = u.id AND cr.status = 'completed'
                    ), 0) AS total_deposited_kg
                FROM users u
                WHERE u.id = ?
            `;
            statsParams.push(currentUser.id);
        }

        const [[stats]] = await db.query(statsQuery, statsParams);

        // Find current user's member card info
        let myCard = null;
        if (currentUser) {
            myCard = members.find(m => m.id === currentUser.id);
            if (!myCard) {
                const [cur] = await db.query(`
                    SELECT 
                        u.id, u.username, u.email, u.full_name, u.phone, u.address, u.status, u.wallet_balance, u.created_at,
                        COALESCE((
                            SELECT SUM(ci.weight) 
                            FROM collection_requests cr 
                            JOIN collection_items ci ON ci.collection_id = cr.id 
                            WHERE cr.user_id = u.id AND cr.status = 'completed'
                        ), 0) AS total_kg
                    FROM users u 
                    WHERE u.id = ?
                `, [currentUser.id]);
                if (cur.length > 0) myCard = cur[0];
            }
        }

        // Format Member ID codes BS-2026-XXXX
        const formattedMembers = members.map(m => ({
            ...m,
            member_code: `BS-${new Date(m.created_at).getFullYear()}-${String(m.id).padStart(4, '0')}`
        }));

        const formattedMyCard = myCard ? {
            ...myCard,
            member_code: `BS-${new Date(myCard.created_at).getFullYear()}-${String(myCard.id).padStart(4, '0')}`
        } : null;

        // List of active users for dropdown selector (hanya untuk admin / pengelola)
        let formattedUserList = [];
        if (canManage) {
            const [userList] = await db.query(`
                SELECT u.id, u.username, u.full_name, u.email, u.phone, u.address, u.wallet_balance, u.status, u.created_at,
                       COALESCE((
                           SELECT SUM(ci.weight) 
                           FROM collection_requests cr 
                           JOIN collection_items ci ON ci.collection_id = cr.id 
                           WHERE cr.user_id = u.id AND cr.status = 'completed'
                       ), 0) AS total_kg
                FROM users u
                WHERE u.deleted_at IS NULL
                ORDER BY u.full_name ASC
            `);

            formattedUserList = userList.map(u => ({
                ...u,
                member_code: `BS-${new Date(u.created_at).getFullYear()}-${String(u.id).padStart(4, '0')}`
            }));
        } else if (formattedMyCard) {
            formattedUserList = [formattedMyCard];
        }

        res.render("members/index", {
            layout: "layout/layout",
            title: isNasabah ? "Kartu Anggota Digital Saya" : "Kartu Anggota Digital & Direktori Nasabah",
            members: formattedMembers,
            summary: stats || { total_members: 0, active_members: 0, total_balance: 0, total_deposited_kg: 0 },
            myCard: formattedMyCard,
            userList: formattedUserList,
            autoOpenCardId: req.query.card_id || null,
            filters: { keyword, status, role: roleFilter },
            currentUser,
            isNasabah,
            canManage
        });
    } catch (err) {
        console.error("Error in /members:", err);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500 - Kesalahan Server",
            message: "Gagal memuat direktori kartu anggota: " + err.message
        });
    }
});

// POST /members/create - Penerbitan kartu nasabah (Bisa via dropdown users atau buat baru)
router.post("/create", async (req, res) => {
    try {
        const currentUser = req.session.user;
        const canManage = currentUser && ['superadmin', 'admin_pengelola', 'petugas_pengumpulan'].includes(currentUser.role);
        if (!canManage) {
            req.flash("error", "Akses ditolak: Anda tidak memiliki wewenang untuk menerbitkan kartu anggota.");
            return res.redirect("/members");
        }
        const db = getPool();
        const mode = clean(req.body.entry_mode) || "existing";
        const selectedUserId = num(req.body.selected_user_id);

        // 1. JIKA PILIH DARI DROPDOWN USERS
        if (mode === "existing" && selectedUserId) {
            const [u] = await db.query(
                "SELECT id, full_name, created_at FROM users WHERE id = ? AND deleted_at IS NULL",
                [selectedUserId]
            );
            if (u.length === 0) {
                req.flash("error", "Pengguna yang dipilih tidak ditemukan.");
                return res.redirect("/members");
            }

            // Pastikan role nasabah terpasang jika belum ada
            const [hasRole] = await db.query(
                "SELECT ur.id FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = ? AND r.name = 'nasabah'",
                [selectedUserId]
            );
            if (hasRole.length === 0) {
                const [nasabahRole] = await db.query("SELECT id FROM roles WHERE name = 'nasabah' LIMIT 1");
                if (nasabahRole.length > 0) {
                    await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [selectedUserId, nasabahRole[0].id]);
                }
            }

            const memberCode = `BS-${new Date(u[0].created_at).getFullYear()}-${String(u[0].id).padStart(4, "0")}`;
            req.flash("success", `Kartu Anggota Digital untuk ${u[0].full_name} (${memberCode}) berhasil dibuka & diterbitkan!`);
            return res.redirect(`/members?card_id=${u[0].id}`);
        }

        // 2. JIKA INPUT WARGA BARU MANUAL
        const fullName = clean(req.body.full_name);
        let username = clean(req.body.username);
        let email = clean(req.body.email);
        const phone = clean(req.body.phone);
        const address = clean(req.body.address);
        const rawPassword = clean(req.body.password) || "nasabah123";

        if (!fullName) {
            req.flash("error", "Silakan pilih nama pengguna dari dropdown atau ketik nama lengkap baru.");
            return res.redirect("/members");
        }

        if (!username) {
            username = fullName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) + Math.floor(100 + Math.random() * 900);
        }
        if (!email) {
            email = `${username}@banksampah.id`;
        }

        const [exist] = await db.query(
            "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
            [username, email]
        );
        if (exist.length > 0) {
            username = username + Math.floor(10 + Math.random() * 90);
            email = `${username}@banksampah.id`;
        }

        const passwordHash = await bcrypt.hash(rawPassword, 10);
        const [userResult] = await db.query(
            `INSERT INTO users (username, email, password_hash, full_name, phone, address, status, wallet_balance)
             VALUES (?, ?, ?, ?, ?, ?, 'active', 0)`,
            [username, email, passwordHash, fullName, phone || null, address || null]
        );

        const newUserId = userResult.insertId;
        const [nasabahRole] = await db.query("SELECT id FROM roles WHERE name = 'nasabah' LIMIT 1");
        if (nasabahRole.length > 0) {
            await db.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
                [newUserId, nasabahRole[0].id]
            );
        }

        const memberCode = `BS-${new Date().getFullYear()}-${String(newUserId).padStart(4, "0")}`;
        req.flash("success", `Nasabah baru ${fullName} berhasil didaftarkan! Nomor Kartu: ${memberCode}. Password login: ${rawPassword}`);
        res.redirect(`/members?card_id=${newUserId}`);
    } catch (err) {
        console.error("Error creating member:", err);
        req.flash("error", "Gagal menerbitkan kartu nasabah: " + err.message);
        res.redirect("/members");
    }
});

// GET /members/:id/card - Quick API data for scanning
router.get("/api/card/:id", async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const [rows] = await db.query(`
            SELECT 
                u.id, u.username, u.full_name, u.phone, u.address, u.status, u.wallet_balance, u.created_at,
                COALESCE((
                    SELECT SUM(ci.weight) 
                    FROM collection_requests cr 
                    JOIN collection_items ci ON ci.collection_id = cr.id 
                    WHERE cr.user_id = u.id AND cr.status = 'completed'
                ), 0) AS total_kg
            FROM users u
            WHERE u.id = ? AND u.deleted_at IS NULL
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Nasabah tidak ditemukan." });
        }

        const user = rows[0];
        const member_code = `BS-${new Date(user.created_at).getFullYear()}-${String(user.id).padStart(4, '0')}`;
        res.json({ success: true, user: { ...user, member_code } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
