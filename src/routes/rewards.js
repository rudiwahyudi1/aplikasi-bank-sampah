const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");

const router = express.Router();

// GET /rewards
router.get("/", hasPermission("rewards.read"), async (req, res) => {
    try {
        const db = getPool();
        const userId = req.session.user.id;
        const isNasabah = req.session.user.role === "nasabah";
        const canManage = req.session.user.role === "superadmin" || (req.session.permissions && req.session.permissions.includes("rewards.manage"));

        const category = clean(req.query.category);

        // Fetch fresh wallet balance of current user
        const [[uRow]] = await db.query("SELECT wallet_balance FROM users WHERE id = ?", [userId]);
        const currentBalance = Number(uRow?.wallet_balance || 0);

        // Fetch available reward items
        let itemWhere = ["deleted_at IS NULL"];
        let itemParams = [];
        if (!canManage) {
            itemWhere.push("status = 'active'");
        }
        if (category && category !== "semua") {
            itemWhere.push("category = ?");
            itemParams.push(category);
        }
        const [items] = await db.query(
            `SELECT *, 
                    CASE 
                        WHEN status = 'expired' OR (expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE) THEN 1 
                        ELSE 0 
                    END AS is_expired
             FROM reward_items 
             WHERE ${itemWhere.join(" AND ")} 
             ORDER BY is_expired ASC, status ASC, points_cost ASC`,
            itemParams
        );

        // Fetch redemption history
        let redWhere = ["rr.deleted_at IS NULL"];
        let redParams = [];
        if (isNasabah) {
            redWhere.push("rr.user_id = ?");
            redParams.push(userId);
        }

        const [redemptions] = await db.query(
            `SELECT rr.*, ri.name AS reward_name, ri.unit AS reward_unit, ri.photo_url, u.full_name AS nasabah_name, u.phone AS nasabah_phone
             FROM reward_redemptions rr
             JOIN reward_items ri ON ri.id = rr.reward_id
             JOIN users u ON u.id = rr.user_id
             WHERE ${redWhere.join(" AND ")}
             ORDER BY rr.created_at DESC
             LIMIT 30`,
            redParams
        );

        // Summary stats (hanya klaim milik nasabah jika role nasabah)
        let statsSql = `SELECT 
                COUNT(DISTINCT id) AS total_items,
                COALESCE((SELECT COUNT(*) FROM reward_redemptions WHERE status = 'pending' ${isNasabah ? 'AND user_id = ?' : ''}), 0) AS pending_claims,
                COALESCE((SELECT COUNT(*) FROM reward_redemptions WHERE status = 'completed' ${isNasabah ? 'AND user_id = ?' : ''}), 0) AS completed_claims
             FROM reward_items WHERE deleted_at IS NULL`;
        let statsParams = isNasabah ? [userId, userId] : [];

        const [[stats]] = await db.query(statsSql, statsParams);

        res.render("rewards/index", {
            layout: "layout/layout",
            title: "Tukar Poin & Hadiah Sampah",
            currentUrl: "/rewards",
            items,
            redemptions,
            currentBalance,
            summary: {
                total_items: Number(stats?.total_items || 0),
                pending_claims: Number(stats?.pending_claims || 0),
                completed_claims: Number(stats?.completed_claims || 0)
            },
            filters: { category },
            isNasabah,
            canManage
        });
    } catch (e) {
        console.error("REWARDS ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat katalog reward: " + e.message
        });
    }
});

// POST /rewards/redeem (Nasabah menukar reward)
router.post("/redeem", hasPermission("rewards.read"), async (req, res) => {
    const db = getPool();
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const userId = req.session.user.id;
        const rewardId = num(req.body.reward_id);
        const quantity = Math.max(1, num(req.body.quantity, 1));
        const notes = clean(req.body.notes);

        // Fetch reward item with lock
        const [[item]] = await conn.query(
            "SELECT * FROM reward_items WHERE id = ? AND deleted_at IS NULL FOR UPDATE",
            [rewardId]
        );
        if (!item) throw new Error("Barang reward tidak ditemukan.");
        if (item.status === "inactive") throw new Error("Barang reward ini sedang dinonaktifkan.");
        if (item.status === "expired" || (item.expiry_date && new Date(item.expiry_date) < new Date())) {
            throw new Error("Barang reward ini sudah kadaluarsa dan tidak dapat ditukarkan.");
        }
        if (item.stock < quantity) throw new Error(`Stok barang tidak mencukupi (sisa: ${item.stock} ${item.unit}).`);

        const totalCost = Number(item.points_cost) * quantity;

        // Fetch user wallet balance with lock
        const [[user]] = await conn.query(
            "SELECT wallet_balance, full_name FROM users WHERE id = ? FOR UPDATE",
            [userId]
        );
        const userBalance = Number(user.wallet_balance || 0);

        if (userBalance < totalCost) {
            throw new Error(`Saldo tabungan Anda (Rp ${userBalance.toLocaleString('id-ID')}) tidak mencukupi untuk penukaran ini (Dibutuhkan: Rp ${totalCost.toLocaleString('id-ID')}).`);
        }

        // Deduct user wallet
        await conn.query(
            "UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?",
            [totalCost, userId]
        );

        // Decrement item stock
        await conn.query(
            "UPDATE reward_items SET stock = stock - ? WHERE id = ?",
            [quantity, rewardId]
        );

        // Generate redemption code
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(1000 + Math.random() * 9000);
        const code = `RWD-${dateStr}-${rand}`;

        // Insert redemption record
        const [redRes] = await conn.query(
            `INSERT INTO reward_redemptions (code, user_id, reward_id, quantity, total_points, status, notes) 
             VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
            [code, userId, rewardId, quantity, totalCost, notes || `Penukaran ${item.name} (${quantity} ${item.unit})`]
        );

        // Insert wallet transaction record
        await conn.query(
            `INSERT INTO wallet_transactions (user_id, type, amount, reference_type, reference_id, description, status) 
             VALUES (?, 'debit', ?, 'reward_redemption', ?, ?, 'success')`,
            [userId, totalCost, redRes.insertId, `Tukar reward ${item.name} [${code}]`]
        );

        // Insert notification
        await conn.query(
            `INSERT INTO notifications (user_id, type, title, message, icon, reference_type, reference_id) 
             VALUES (?, 'success', 'Penukaran Hadiah Diajukan', ?, 'bi-stars', 'reward', ?)`,
            [userId, `Penukaran ${quantity}x ${item.name} (${code}) berhasil diajukan. Silakan ambil di kantor bank sampah saat status 'Siap Diambil'.`, redRes.insertId]
        );

        await conn.commit();

        // Update session user balance
        req.session.user.wallet_balance = userBalance - totalCost;

        req.flash("success", `Berhasil menukarkan ${quantity} ${item.unit} ${item.name}! Kode penukaran Anda: ${code}`);
    } catch (e) {
        await conn.rollback();
        req.flash("error", e.message);
    } finally {
        conn.release();
    }
    res.redirect("/rewards");
});

// POST /rewards/status (Admin mengubah status penukaran)
router.post("/status/:id", hasPermission("rewards.manage"), async (req, res) => {
    const db = getPool();
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const redId = num(req.params.id);
        const newStatus = clean(req.body.status); // 'ready', 'completed', 'rejected'

        const [[red]] = await conn.query(
            "SELECT rr.*, ri.name AS reward_name, ri.unit FROM reward_redemptions rr JOIN reward_items ri ON ri.id = rr.reward_id WHERE rr.id = ? FOR UPDATE",
            [redId]
        );
        if (!red) throw new Error("Data penukaran tidak ditemukan.");

        if (newStatus === "rejected" && red.status !== "rejected") {
            // Refund points/balance to user
            await conn.query("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?", [red.total_points, red.user_id]);
            // Return stock
            await conn.query("UPDATE reward_items SET stock = stock + ? WHERE id = ?", [red.quantity, red.reward_id]);
            // Wallet transaction refund
            await conn.query(
                `INSERT INTO wallet_transactions (user_id, type, amount, reference_type, reference_id, description, status) 
                 VALUES (?, 'credit', ?, 'reward_refund', ?, ?, 'success')`,
                [red.user_id, red.total_points, red.id, `Pengembalian saldo pembatalan tukar reward ${red.code}`]
            );
        }

        await conn.query(
            "UPDATE reward_redemptions SET status = ?, processed_by = ?, updated_at = NOW() WHERE id = ?",
            [newStatus, req.session.user.id, redId]
        );

        // Send notification to user
        let notifTitle = "Update Penukaran Hadiah";
        let notifMsg = `Status penukaran ${red.code} (${red.reward_name}) kini: ${newStatus.toUpperCase()}.`;
        if (newStatus === "ready") {
            notifMsg = `Barang ${red.reward_name} sudah disiapkan dan siap diambil di kantor Bank Sampah!`;
        } else if (newStatus === "completed") {
            notifMsg = `Barang ${red.reward_name} telah berhasil diserahkan kepada Anda. Terima kasih!`;
        } else if (newStatus === "rejected") {
            notifMsg = `Penukaran ${red.code} ditolak/dibatalkan. Saldo tabungan Anda telah dikembalikan secara utuh.`;
        }

        await conn.query(
            `INSERT INTO notifications (user_id, type, title, message, icon, reference_type, reference_id) 
             VALUES (?, 'info', ?, ?, 'bi-stars', 'reward', ?)`,
            [red.user_id, notifTitle, notifMsg, redId]
        );

        await conn.commit();
        req.flash("success", `Status penukaran berhasil diubah menjadi ${newStatus.toUpperCase()}`);
    } catch (e) {
        await conn.rollback();
        req.flash("error", e.message);
    } finally {
        conn.release();
    }
    res.redirect("/rewards");
});

// POST /rewards/item/create (Admin input barang hadiah baru)
router.post("/item/create", hasPermission("rewards.manage"), async (req, res) => {
    try {
        const db = getPool();
        const name = clean(req.body.name);
        const category = clean(req.body.category) || "sembako";
        const pointsCost = Math.max(0, num(req.body.points_cost));
        const stock = Math.max(0, parseInt(req.body.stock || "0", 10));
        const unit = clean(req.body.unit) || "pcs";
        const photoUrl = clean(req.body.photo_url) || "/images/rewards/default.png";
        const expiryDate = clean(req.body.expiry_date) || null;
        const description = clean(req.body.description);
        const status = clean(req.body.status) || "active";

        if (!name || pointsCost <= 0) {
            req.flash("error", "Nama barang dan harga poin/rupiah wajib diisi valid.");
            return res.redirect("/rewards");
        }

        const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, "");
        const rand = Math.floor(100 + Math.random() * 900);
        const code = `RWD-${category.substring(0, 3).toUpperCase()}-${dateCode}${rand}`;

        await db.query(
            `INSERT INTO reward_items (code, name, category, points_cost, stock, unit, photo_url, expiry_date, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, name, category, pointsCost, stock, unit, photoUrl, expiryDate, description, status]
        );

        req.flash("success", `Barang hadiah "${name}" berhasil ditambahkan ke katalog!`);
    } catch (e) {
        console.error("CREATE REWARD ITEM ERROR:", e);
        req.flash("error", "Gagal menambah barang hadiah: " + e.message);
    }
    res.redirect("/rewards");
});

// POST /rewards/item/edit/:id (Admin update barang hadiah, stok, & kadaluarsa)
router.post("/item/edit/:id", hasPermission("rewards.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const name = clean(req.body.name);
        const category = clean(req.body.category);
        const pointsCost = Math.max(0, num(req.body.points_cost));
        const stock = Math.max(0, parseInt(req.body.stock || "0", 10));
        const unit = clean(req.body.unit) || "pcs";
        const photoUrl = clean(req.body.photo_url);
        const expiryDate = clean(req.body.expiry_date) || null;
        const description = clean(req.body.description);
        const status = clean(req.body.status) || "active";

        if (!name || pointsCost <= 0) {
            req.flash("error", "Nama barang dan harga poin/rupiah tidak boleh kosong.");
            return res.redirect("/rewards");
        }

        await db.query(
            `UPDATE reward_items 
             SET name = ?, category = ?, points_cost = ?, stock = ?, unit = ?, photo_url = ?, expiry_date = ?, description = ?, status = ?, updated_at = NOW()
             WHERE id = ? AND deleted_at IS NULL`,
            [name, category, pointsCost, stock, unit, photoUrl, expiryDate, description, status, id]
        );

        req.flash("success", `Barang hadiah "${name}" berhasil diperbarui!`);
    } catch (e) {
        console.error("EDIT REWARD ITEM ERROR:", e);
        req.flash("error", "Gagal memperbarui barang hadiah: " + e.message);
    }
    res.redirect("/rewards");
});

// POST /rewards/item/delete/:id (Admin hapus barang hadiah)
router.post("/item/delete/:id", hasPermission("rewards.manage"), async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);

        await db.query("UPDATE reward_items SET deleted_at = NOW() WHERE id = ?", [id]);
        req.flash("success", "Barang hadiah berhasil dihapus dari katalog.");
    } catch (e) {
        console.error("DELETE REWARD ITEM ERROR:", e);
        req.flash("error", "Gagal menghapus barang hadiah: " + e.message);
    }
    res.redirect("/rewards");
});

module.exports = router;
