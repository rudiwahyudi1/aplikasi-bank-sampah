const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { num, clean, page, limit } = require("./_helpers");

const router = express.Router();

// GET /withdrawals
router.get("/", hasPermission("withdrawal.read"), async (req, res) => {
    try {
        const db = getPool();
        const u = req.session.user;
        const isNasabah = u.role === "nasabah";
        const keyword = clean(req.query.keyword);
        const status = clean(req.query.status);

        let p = page(req.query.page);
        let l = limit(req.query.limit, 12);

        let where = ["wr.deleted_at IS NULL"];
        let params = [];

        if (isNasabah) {
            where.push("wr.user_id = ?");
            params.push(u.id);
        }

        if (keyword) {
            where.push("(u.full_name LIKE ? OR wr.bank_name LIKE ? OR wr.account_number LIKE ? OR wr.account_name LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        if (status && status !== "semua") {
            where.push("wr.status = ?");
            params.push(status);
        }

        const W = "WHERE " + where.join(" AND ");

        // Total count
        const [[cnt]] = await db.query(
            `SELECT COUNT(*) AS total 
             FROM withdrawal_requests wr 
             JOIN users u ON u.id = wr.user_id 
             ${W}`,
            params
        );
        const total = Number(cnt?.total || 0);
        const pages = Math.max(1, Math.ceil(total / l));
        const cp = Math.min(p, pages);
        const off = (cp - 1) * l;

        // Fetch requests
        const [rows] = await db.query(
            `SELECT wr.*, u.full_name, u.username, u.phone AS user_phone, u.wallet_balance AS user_current_balance
             FROM withdrawal_requests wr 
             JOIN users u ON u.id = wr.user_id 
             ${W} 
             ORDER BY 
                CASE WHEN wr.status = 'pending' THEN 1 WHEN wr.status = 'approved' THEN 2 ELSE 3 END,
                wr.created_at DESC 
             LIMIT ? OFFSET ?`,
            [...params, l, off]
        );

        // Fetch fresh wallet balance
        const [[uRow]] = await db.query("SELECT wallet_balance FROM users WHERE id = ?", [u.id]);
        const currentBalance = Number(uRow?.wallet_balance || 0);

        // Fetch summary statistics
        let sumWhere = "WHERE deleted_at IS NULL";
        let sumParams = [];
        if (isNasabah) {
            sumWhere += " AND user_id = ?";
            sumParams.push(u.id);
        }

        const [[sum]] = await db.query(
            `SELECT 
                COUNT(*) AS total_requests,
                SUM(status = 'pending') AS pending_count,
                SUM(status = 'approved') AS approved_count,
                SUM(status = 'paid') AS paid_count,
                COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS total_paid_amount,
                COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS total_pending_amount
             FROM withdrawal_requests 
             ${sumWhere}`,
            sumParams
        );

        const canManage = u.role === "superadmin" || 
                          u.role === "admin_pengelola" || 
                          (req.session.permissions && req.session.permissions.includes("withdrawal.manage"));

        res.render("withdrawals/index", {
            layout: "layout/layout",
            title: "Penarikan Saldo",
            currentUrl: "/withdrawals",
            rows,
            balance: currentBalance,
            summary: {
                total_requests: Number(sum?.total_requests || 0),
                pending_count: Number(sum?.pending_count || 0),
                approved_count: Number(sum?.approved_count || 0),
                paid_count: Number(sum?.paid_count || 0),
                total_paid_amount: Number(sum?.total_paid_amount || 0),
                total_pending_amount: Number(sum?.total_pending_amount || 0)
            },
            filters: { keyword, status },
            pagination: { page: cp, limit: l, total, totalPages: pages },
            canManage,
            isNasabah,
            userRole: u.role
        });
    } catch (e) {
        console.error("WITHDRAWALS ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: e.message
        });
    }
});

// POST /withdrawals/request
router.post("/request", hasPermission("wallet.read"), async (req, res) => {
    try {
        const db = getPool();
        const u = req.session.user;
        const amount = num(req.body.amount);

        const [[freshUser]] = await db.query("SELECT wallet_balance FROM users WHERE id = ?", [u.id]);
        const currentBalance = Number(freshUser?.wallet_balance || 0);

        if (amount <= 0 || amount > currentBalance) {
            throw new Error("Nominal penarikan tidak valid atau melebihi saldo tabungan Anda.");
        }

        const bank_name = clean(req.body.bank_name);
        const account_number = clean(req.body.account_number);
        const account_name = clean(req.body.account_name);

        if (!bank_name || !account_number || !account_name) {
            throw new Error("Nama bank/e-wallet, nomor rekening, dan nama pemilik rekening wajib diisi.");
        }

        await db.query(
            `INSERT INTO withdrawal_requests 
             (user_id, amount, bank_name, account_number, account_name, status) 
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [u.id, amount, bank_name, account_number, account_name]
        );

        req.flash("success", `Pengajuan penarikan dana Rp ${amount.toLocaleString('id-ID')} berhasil dibuat dan sedang menunggu verifikasi.`);
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/withdrawals");
});

// POST /withdrawals/:id/status
router.post("/:id/status", hasPermission("withdrawal.manage"), async (req, res) => {
    const db = getPool();
    const c = await db.getConnection();
    try {
        const id = num(req.params.id);
        const status = ["approved", "rejected", "paid"].includes(req.body.status) ? req.body.status : "pending";

        await c.beginTransaction();

        const [[w]] = await c.query("SELECT * FROM withdrawal_requests WHERE id = ? AND deleted_at IS NULL FOR UPDATE", [id]);
        if (!w) throw new Error("Permintaan penarikan tidak ditemukan.");

        if (status === "paid" && w.status !== "paid") {
            const [[u]] = await c.query("SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE", [w.user_id]);
            if (Number(u.wallet_balance) < Number(w.amount)) {
                throw new Error("Saldo user tidak mencukupi untuk dicairkan.");
            }

            await c.query("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?", [w.amount, w.user_id]);
            await c.query(
                `INSERT INTO wallet_transactions 
                 (user_id, type, amount, reference_type, reference_id, description, status) 
                 VALUES (?, 'debit', ?, 'withdrawal', ?, 'Penarikan saldo tunai / transfer', 'success')`,
                [w.user_id, w.amount, id]
            );
        }

        await c.query(
            `UPDATE withdrawal_requests 
             SET status = ?, 
                 processed_at = IF(? IN ('approved', 'rejected', 'paid'), NOW(), processed_at), 
                 rejected_reason = ? 
             WHERE id = ?`,
            [status, status, status === "rejected" ? clean(req.body.rejected_reason) : null, id]
        );

        await c.commit();
        req.flash("success", `Status penarikan berhasil diperbarui menjadi: ${status.toUpperCase()}.`);
    } catch (e) {
        await c.rollback();
        req.flash("error", e.message);
    } finally {
        c.release();
    }
    res.redirect("/withdrawals");
});

module.exports = router;
