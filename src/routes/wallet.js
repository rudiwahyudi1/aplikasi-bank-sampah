// ================================================================
// WALLET & SALDO DIGITAL ROUTES
// Aplikasi Sampah Terintegrasi
// ================================================================

const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { num, clean } = require("./_helpers");
const { uploadPayment } = require("../middleware/upload");
const { generateWalletExcel, formatDate, formatDateTime, formatRupiah } = require("./_exportHelper");
const realtime = require("../services/realtime");

const router = express.Router();

// ================================================================
// EXPORT EXCEL MUTASI WALLET
// ================================================================
router.get("/export/excel", hasPermission("wallet.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const isNasabah = u.role === "nasabah";
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const type = clean(req.query.type);

        let where = ["1=1"], params = [];

        if (isNasabah) {
            where.push("wt.user_id = ?");
            params.push(u.id);
        }
        if (startDate) {
            where.push("DATE(wt.created_at) >= ?");
            params.push(startDate);
        }
        if (endDate) {
            where.push("DATE(wt.created_at) <= ?");
            params.push(endDate);
        }
        if (type && ["credit", "debit"].includes(type)) {
            where.push("wt.type = ?");
            params.push(type);
        }

        const W = "WHERE " + where.join(" AND ");
        const [rows] = await db.query(
            `SELECT wt.*, u.full_name, u.username
             FROM wallet_transactions wt
             JOIN users u ON u.id = wt.user_id
             ${W}
             ORDER BY wt.created_at DESC`,
            params
        );

        const totalCredit = rows.filter(r => r.type === 'credit').reduce((a, b) => a + Number(b.amount || 0), 0);
        const totalDebit = rows.filter(r => r.type === 'debit').reduce((a, b) => a + Number(b.amount || 0), 0);

        let periodText = "Semua Waktu";
        if (startDate && endDate) periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        else if (startDate) periodText = `Mulai ${formatDate(startDate)}`;
        else if (endDate) periodText = `Sampai ${formatDate(endDate)}`;

        const workbook = await generateWalletExcel({
            title: isNasabah ? `Laporan Mutasi Saldo - ${u.full_name || u.username}` : "Laporan Mutasi Dompet Digital",
            periodText,
            rows,
            summary: { totalCredit, totalDebit }
        });

        const filename = `Mutasi_Wallet_${startDate || 'all'}_sd_${endDate || 'all'}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal mengunduh file Excel: " + err.message);
    }
});

// ================================================================
// PREVIEW PDF MUTASI WALLET
// ================================================================
router.get("/export/preview-pdf", hasPermission("wallet.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const isNasabah = u.role === "nasabah";
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const type = clean(req.query.type);

        let where = ["1=1"], params = [];

        if (isNasabah) {
            where.push("wt.user_id = ?");
            params.push(u.id);
        }
        if (startDate) {
            where.push("DATE(wt.created_at) >= ?");
            params.push(startDate);
        }
        if (endDate) {
            where.push("DATE(wt.created_at) <= ?");
            params.push(endDate);
        }
        if (type && ["credit", "debit"].includes(type)) {
            where.push("wt.type = ?");
            params.push(type);
        }

        const W = "WHERE " + where.join(" AND ");
        const [rows] = await db.query(
            `SELECT wt.*, u.full_name, u.username
             FROM wallet_transactions wt
             JOIN users u ON u.id = wt.user_id
             ${W}
             ORDER BY wt.created_at DESC`,
            params
        );

        const totalCredit = rows.filter(r => r.type === 'credit').reduce((a, b) => a + Number(b.amount || 0), 0);
        const totalDebit = rows.filter(r => r.type === 'debit').reduce((a, b) => a + Number(b.amount || 0), 0);

        let periodText = "Semua Waktu";
        if (startDate && endDate) periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        else if (startDate) periodText = `Mulai ${formatDate(startDate)}`;
        else if (endDate) periodText = `Sampai ${formatDate(endDate)}`;

        const excelUrl = `/wallet/export/excel?start_date=${encodeURIComponent(startDate || '')}&end_date=${encodeURIComponent(endDate || '')}&type=${encodeURIComponent(type || '')}`;

        res.render("wallet/export_pdf", {
            layout: false,
            title: isNasabah ? "Laporan Mutasi Saldo Nasabah" : "Laporan Mutasi Dompet Digital",
            appName: res.locals.appName || "Aplikasi Sampah Terintegrasi",
            periodText,
            rows,
            summary: { totalCredit, totalDebit },
            excelUrl,
            formatRupiah,
            formatDate,
            formatDateTime,
            printDate: formatDateTime(new Date()),
            printedBy: u.full_name || u.username || "Petugas"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menampilkan pratinjau PDF: " + err.message);
    }
});

// ================================================================
// GET /wallet - HALAMAN UTAMA WALLET & MUTASI
// ================================================================
router.get("/", hasPermission("wallet.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const isNasabah = u.role === "nasabah";
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const typeFilter = clean(req.query.type);

        // Ambil daftar user aktif untuk dropdown penyesuaian (hanya jika role admin/pengelola)
        let users = [];
        if (!isNasabah) {
            const [userRows] = await db.query(
                `SELECT id, username, full_name, wallet_balance 
                 FROM users 
                 WHERE status = 'active' AND deleted_at IS NULL 
                 ORDER BY full_name`
            );
            users = userRows;
        }

        // Saldo user yang login
        const [[me]] = await db.query(
            `SELECT wallet_balance, full_name, username FROM users WHERE id = ?`,
            [u.id]
        );
        const balance = Number(me?.wallet_balance || 0);

        // Filter mutasi
        let wtWhere = ["1=1"], wtParams = [];
        if (isNasabah) {
            wtWhere.push("wt.user_id = ?");
            wtParams.push(u.id);
        }
        if (startDate) {
            wtWhere.push("DATE(wt.created_at) >= ?");
            wtParams.push(startDate);
        }
        if (endDate) {
            wtWhere.push("DATE(wt.created_at) <= ?");
            wtParams.push(endDate);
        }
        if (typeFilter && ["credit", "debit"].includes(typeFilter)) {
            wtWhere.push("wt.type = ?");
            wtParams.push(typeFilter);
        }

        const [rows] = await db.query(
            `SELECT wt.*, usr.full_name, usr.username 
             FROM wallet_transactions wt 
             JOIN users usr ON usr.id = wt.user_id 
             WHERE ${wtWhere.join(" AND ")}
             ORDER BY wt.created_at DESC LIMIT 300`,
            wtParams
        );

        // Statistik Kredit, Debit, dan Saldo Nasabah
        const [stats] = await db.query(
            `SELECT 
                COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) AS total_credit,
                COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) AS total_debit,
                COUNT(id) AS total_trx
             FROM wallet_transactions
             WHERE ${isNasabah ? 'user_id = ?' : '1=1'}`,
            isNasabah ? [u.id] : []
        );

        // Daftar permintaan penarikan (withdrawal_requests)
        const [withdrawals] = await db.query(
            `SELECT wr.*, usr.full_name, usr.username, usr.phone, proc.full_name AS processor_name
             FROM withdrawal_requests wr
             JOIN users usr ON usr.id = wr.user_id
             LEFT JOIN users proc ON proc.id = wr.processed_by
             WHERE wr.deleted_at IS NULL ${isNasabah ? 'AND wr.user_id = ?' : ''}
             ORDER BY wr.created_at DESC LIMIT 100`,
            isNasabah ? [u.id] : []
        );

        // Total pending withdrawal
        const [[pendingInfo]] = await db.query(
            `SELECT COALESCE(SUM(amount), 0) AS total_pending, COUNT(id) AS count_pending
             FROM withdrawal_requests
             WHERE status = 'pending' AND deleted_at IS NULL ${isNasabah ? 'AND user_id = ?' : ''}`,
            isNasabah ? [u.id] : []
        );

        res.render("wallet/index", {
            layout: "layout/layout",
            title: "Saldo & Dompet Digital",
            users,
            rows,
            withdrawals,
            balance,
            stats: stats[0] || { total_credit: 0, total_debit: 0, total_trx: 0 },
            pendingSummary: pendingInfo || { total_pending: 0, count_pending: 0 },
            filters: { start_date: startDate || '', end_date: endDate || '', type: typeFilter || '' },
            canTransaction: u.role === "superadmin" || u.permissions?.includes("wallet.transaction") || isNasabah,
            canManageWithdrawal: ["superadmin", "admin_pengelola"].includes(u.role)
        });
    } catch (e) {
        console.error("Wallet Error:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: e.message
        });
    }
});

// ================================================================
// POST /wallet/withdraw - NASABAH MENGAJUKAN PENARIKAN SALDO
// ================================================================
router.post("/withdraw", hasPermission("wallet.read"), async (req, res) => {
    const db = getPool();
    const c = await db.getConnection();
    try {
        const u = req.session.user;
        const amount = num(req.body.amount);
        const bankName = clean(req.body.bank_name);
        const accountNumber = clean(req.body.account_number);
        const accountName = clean(req.body.account_name);

        if (!amount || amount < 10000) {
            throw new Error("Nominal penarikan minimum adalah Rp 10.000.");
        }
        if (!bankName || !accountNumber || !accountName) {
            throw new Error("Data bank, nomor rekening, dan nama pemilik rekening wajib diisi.");
        }

        await c.beginTransaction();

        // Kunci user untuk verifikasi saldo
        const [[userRow]] = await c.query(
            "SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE",
            [u.id]
        );

        if (!userRow || Number(userRow.wallet_balance) < amount) {
            throw new Error("Saldo Anda tidak mencukupi untuk melakukan penarikan ini.");
        }

        // Potong saldo sementara
        await c.query(
            "UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?",
            [amount, u.id]
        );

        // Catat pengajuan penarikan
        const [wdr] = await c.query(
            `INSERT INTO withdrawal_requests 
             (user_id, amount, bank_name, account_number, account_name, status, requested_at) 
             VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
            [u.id, amount, bankName, accountNumber, accountName]
        );

        // Catat ke wallet_transactions (status pending)
        await c.query(
            `INSERT INTO wallet_transactions 
             (user_id, type, amount, reference_type, reference_id, description, status) 
             VALUES (?, 'debit', ?, 'withdrawal', ?, ?, 'pending')`,
            [u.id, amount, wdr.insertId, `Penarikan saldo ke ${bankName.toUpperCase()} ${accountNumber} a.n ${accountName}`]
        );

        await c.commit();
        req.flash("success", `Pengajuan penarikan sebesar Rp ${amount.toLocaleString('id-ID')} berhasil diajukan. Menunggu proses transfer dari admin.`);
        realtime.notifyDataChange({
            entity: 'wallet',
            action: 'create',
            title: 'Pengajuan Penarikan Saldo',
            message: `${u.full_name || 'Nasabah'} mengajukan penarikan saldo sebesar Rp ${amount.toLocaleString('id-ID')}`,
            targetRoles: ['superadmin', 'admin_pengelola']
        });
    } catch (err) {
        await c.rollback();
        req.flash("error", err.message);
    } finally {
        c.release();
    }
    res.redirect("/wallet");
});

// ================================================================
// POST /wallet/withdrawals/:id/approve - ADMIN KONFIRMASI TRANSFER
// ================================================================
router.post("/withdrawals/:id/approve", hasPermission("wallet.transaction"), uploadPayment.single("payment_proof"), async (req, res) => {
    const db = getPool();
    const c = await db.getConnection();
    try {
        const id = num(req.params.id);
        const note = clean(req.body.payment_note) || "Pencairan dana telah ditransfer";
        const adminUser = req.session.user;

        await c.beginTransaction();

        const [[wdr]] = await c.query(
            "SELECT * FROM withdrawal_requests WHERE id = ? AND status = 'pending' FOR UPDATE",
            [id]
        );
        if (!wdr) throw new Error("Permintaan penarikan tidak ditemukan atau sudah diproses.");

        let proofPath = null;
        if (req.file) {
            proofPath = "/uploads/payments/" + req.file.filename;
        }

        // Update withdrawal_requests
        await c.query(
            `UPDATE withdrawal_requests 
             SET status = 'paid', payment_proof = ?, payment_note = ?, processed_by = ?, processed_at = NOW() 
             WHERE id = ?`,
            [proofPath, note, adminUser.id, id]
        );

        // Update wallet_transactions status ke success
        await c.query(
            `UPDATE wallet_transactions 
             SET status = 'success' 
             WHERE reference_type = 'withdrawal' AND reference_id = ?`,
            [id]
        );

        // Catat ke documents jika ada bukti transfer
        if (proofPath) {
            await c.query(
                `INSERT INTO documents 
                 (reference_type, reference_id, document_type, file_name, file_path, mime_type, file_size, uploaded_by, is_primary) 
                 VALUES ('withdrawal', ?, 'bukti_transfer', ?, ?, ?, ?, ?, 1)`,
                [id, req.file.originalname || `bukti_pencairan_${id}.jpg`, proofPath, req.file.mimetype || 'image/jpeg', req.file.size || 0, adminUser.id]
            );
        }

        await c.commit();
        req.flash("success", "Pencairan saldo berhasil dikonfirmasi dan bukti transfer telah dicatat.");
        realtime.notifyDataChange({
            entity: 'wallet',
            action: 'update',
            title: 'Penarikan Saldo Berhasil',
            message: `Pencairan dana sebesar Rp ${Number(wdr.amount || 0).toLocaleString('id-ID')} telah berhasil ditransfer ke rekening Anda.`,
            affectedUserId: wdr.user_id,
            id
        });
    } catch (err) {
        await c.rollback();
        req.flash("error", err.message);
    } finally {
        c.release();
    }
    res.redirect("/wallet");
});

// ================================================================
// POST /wallet/withdrawals/:id/reject - ADMIN MENOLAK PENARIKAN
// ================================================================
router.post("/withdrawals/:id/reject", hasPermission("wallet.transaction"), async (req, res) => {
    const db = getPool();
    const c = await db.getConnection();
    try {
        const id = num(req.params.id);
        const reason = clean(req.body.rejected_reason) || "Data rekening tidak valid";
        const adminUser = req.session.user;

        await c.beginTransaction();

        const [[wdr]] = await c.query(
            "SELECT * FROM withdrawal_requests WHERE id = ? AND status = 'pending' FOR UPDATE",
            [id]
        );
        if (!wdr) throw new Error("Permintaan penarikan tidak ditemukan atau sudah diproses.");

        // Kembalikan saldo nasabah
        await c.query(
            "UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?",
            [wdr.amount, wdr.user_id]
        );

        // Update status request ke rejected
        await c.query(
            `UPDATE withdrawal_requests 
             SET status = 'rejected', rejected_reason = ?, processed_by = ?, processed_at = NOW() 
             WHERE id = ?`,
            [reason, adminUser.id, id]
        );

        // Update status transaksi ke failed
        await c.query(
            `UPDATE wallet_transactions 
             SET status = 'failed', description = CONCAT(description, ' [Ditolak: ', ?, ']') 
             WHERE reference_type = 'withdrawal' AND reference_id = ?`,
            [reason, id]
        );

        await c.commit();
        req.flash("success", "Permintaan penarikan ditolak dan saldo telah dikembalikan ke nasabah.");
        realtime.notifyDataChange({
            entity: 'wallet',
            action: 'update',
            title: 'Penarikan Saldo Ditolak',
            message: `Pengajuan penarikan saldo Anda telah dibatalkan/ditolak. Saldo sebesar Rp ${Number(wdr.amount || 0).toLocaleString('id-ID')} telah dikembalikan.`,
            affectedUserId: wdr.user_id,
            id
        });
    } catch (err) {
        await c.rollback();
        req.flash("error", err.message);
    } finally {
        c.release();
    }
    res.redirect("/wallet");
});

// ================================================================
// POST /wallet/adjust - PENYESUAIAN SALDO MANUAL (ADMIN)
// ================================================================
router.post("/adjust", hasPermission("wallet.transaction"), async (req, res) => {
    const db = getPool();
    const c = await db.getConnection();
    try {
        const uid = num(req.body.user_id);
        const type = req.body.type === "debit" ? "debit" : "credit";
        const amount = num(req.body.amount);
        const desc = clean(req.body.description) || "Penyesuaian wallet manual";

        if (!uid || amount <= 0) throw new Error("Pengguna dan nominal wajib valid.");

        await c.beginTransaction();

        const [[u]] = await c.query(
            "SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE",
            [uid]
        );
        if (!u) throw new Error("Pengguna tidak ditemukan.");

        if (type === "debit" && Number(u.wallet_balance) < amount) {
            throw new Error("Saldo pengguna tidak mencukupi untuk pengurangan ini.");
        }

        const delta = type === "credit" ? amount : -amount;
        await c.query(
            "UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?",
            [delta, uid]
        );

        await c.query(
            `INSERT INTO wallet_transactions 
             (user_id, type, amount, reference_type, description, status) 
             VALUES (?, ?, ?, 'manual', ?, 'success')`,
            [uid, type, amount, desc]
        );

        await c.commit();
        req.flash("success", "Penyesuaian saldo pengguna berhasil dilakukan.");
        realtime.notifyDataChange({
            entity: 'wallet',
            action: 'update',
            title: 'Saldo Dompet Diperbarui',
            message: `Saldo tabungan Anda telah ${type === 'credit' ? 'ditambahkan' : 'dikurangi'} sebesar Rp ${amount.toLocaleString('id-ID')}`,
            affectedUserId: uid
        });
    } catch (e) {
        await c.rollback();
        req.flash("error", e.message);
    } finally {
        c.release();
    }
    res.redirect("/wallet");
});

module.exports = router;
