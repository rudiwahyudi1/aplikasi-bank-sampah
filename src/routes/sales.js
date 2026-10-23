// ================================================================
// SALES ROUTES - TRANSAKSI PENJUALAN
// Aplikasi Sampah Terintegrasi
// ================================================================

const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { num, clean } = require("./_helpers");
const { uploadPayment } = require("../middleware/upload");
const { generateSalesExcel, formatDate, formatDateTime, formatRupiah, formatWeight } = require("./_exportHelper");

const router = express.Router();

// ================================================================
// EXPORT EXCEL
// ================================================================
router.get("/export/excel", hasPermission("sales.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const own = u.role === 'nasabah';
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const status = clean(req.query.status);

        let where = ["s.deleted_at IS NULL"], params = [];

        if (own) {
            where.push("cr.user_id = ?");
            params.push(u.id);
        }
        if (startDate) {
            where.push("DATE(s.created_at) >= ?");
            params.push(startDate);
        }
        if (endDate) {
            where.push("DATE(s.created_at) <= ?");
            params.push(endDate);
        }
        if (status) {
            where.push("s.status = ?");
            params.push(status);
        }

        const W = "WHERE " + where.join(" AND ");
        const [rows] = await db.query(
            `SELECT s.*, b.name buyer_name, cr.code collection_code, cu.full_name nasabah_name,
                    COALESCE(s.total_weight, 0) total_weight
             FROM sales s
             LEFT JOIN buyers b ON b.id = s.buyer_id
             LEFT JOIN collection_requests cr ON cr.id = s.collection_id
             LEFT JOIN users cu ON cu.id = cr.user_id
             ${W}
             ORDER BY s.created_at DESC`,
            params
        );

        const totalWeight = rows.reduce((acc, r) => acc + Number(r.total_weight || 0), 0);
        const totalAmount = rows.reduce((acc, r) => acc + Number(r.total_amount || 0), 0);
        const paidCount = rows.filter(r => r.payment_status === 'paid' || r.status === 'paid').length;

        let periodText = "Semua Waktu";
        if (startDate && endDate) {
            periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        } else if (startDate) {
            periodText = `Mulai ${formatDate(startDate)}`;
        } else if (endDate) {
            periodText = `Sampai ${formatDate(endDate)}`;
        }

        const workbook = await generateSalesExcel({
            title: "Laporan Transaksi Penjualan",
            periodText,
            rows,
            summary: { totalWeight, totalAmount, paidCount }
        });

        const filename = `Penjualan_${startDate || 'all'}_sd_${endDate || 'all'}.xlsx`;
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
// PREVIEW PDF
// ================================================================
router.get("/export/preview-pdf", hasPermission("sales.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const own = u.role === 'nasabah';
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const status = clean(req.query.status);

        let where = ["s.deleted_at IS NULL"], params = [];

        if (own) {
            where.push("cr.user_id = ?");
            params.push(u.id);
        }
        if (startDate) {
            where.push("DATE(s.created_at) >= ?");
            params.push(startDate);
        }
        if (endDate) {
            where.push("DATE(s.created_at) <= ?");
            params.push(endDate);
        }
        if (status) {
            where.push("s.status = ?");
            params.push(status);
        }

        const W = "WHERE " + where.join(" AND ");
        const [rows] = await db.query(
            `SELECT s.*, b.name buyer_name, cr.code collection_code, cu.full_name nasabah_name,
                    COALESCE(s.total_weight, 0) total_weight
             FROM sales s
             LEFT JOIN buyers b ON b.id = s.buyer_id
             LEFT JOIN collection_requests cr ON cr.id = s.collection_id
             LEFT JOIN users cu ON cu.id = cr.user_id
             ${W}
             ORDER BY s.created_at DESC`,
            params
        );

        const totalWeight = rows.reduce((acc, r) => acc + Number(r.total_weight || 0), 0);
        const totalAmount = rows.reduce((acc, r) => acc + Number(r.total_amount || 0), 0);
        const paidCount = rows.filter(r => r.payment_status === 'paid' || r.status === 'paid').length;

        let periodText = "Semua Waktu";
        if (startDate && endDate) {
            periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        } else if (startDate) {
            periodText = `Mulai ${formatDate(startDate)}`;
        } else if (endDate) {
            periodText = `Sampai ${formatDate(endDate)}`;
        }

        const excelUrl = `/sales/export/excel?start_date=${encodeURIComponent(startDate || '')}&end_date=${encodeURIComponent(endDate || '')}&status=${encodeURIComponent(status || '')}`;

        res.render("sales/export_pdf", {
            layout: false,
            title: "Laporan Transaksi Penjualan",
            appName: res.locals.appName || "Aplikasi Sampah Terintegrasi",
            periodText,
            rows,
            summary: { totalWeight, totalAmount, paidCount },
            excelUrl,
            formatDate,
            formatDateTime,
            formatRupiah,
            formatWeight,
            printDate: formatDateTime(new Date()),
            printedBy: u.full_name || u.username || "Petugas"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menampilkan pratinjau PDF: " + err.message);
    }
});

// ================================================================
// GET /sales
// ================================================================
router.get("/", hasPermission("sales.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const own = u.role === 'nasabah';

        const [rows] = await db.query(
            `SELECT s.*, b.name buyer_name, cr.code collection_code, cu.full_name nasabah_name,
                    cu.phone nasabah_phone, cu.ktp_number nasabah_ktp, cu.age nasabah_age,
                    cu.bank_name nasabah_bank, cu.bank_account_number nasabah_account_number, cu.bank_account_holder nasabah_account_holder,
                    COALESCE(s.total_weight, 0) total_weight
             FROM sales s
             LEFT JOIN buyers b ON b.id = s.buyer_id
             LEFT JOIN collection_requests cr ON cr.id = s.collection_id
             LEFT JOIN users cu ON cu.id = cr.user_id
             WHERE s.deleted_at IS NULL ${own ? 'AND cr.user_id = ?' : ''}
             ORDER BY s.created_at DESC`,
            own ? [u.id] : []
        );

        const [buyers] = await db.query(
            `SELECT * FROM buyers WHERE status = 'active' AND deleted_at IS NULL ORDER BY name`
        );

        const [collections] = await db.query(
            `SELECT cr.id, cr.code, cr.user_id, u.full_name,
                    COALESCE(SUM(ci.weight), 0) total_weight,
                    COALESCE(SUM(ci.subtotal), 0) total_amount
             FROM collection_requests cr
             JOIN users u ON u.id = cr.user_id
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             WHERE cr.status = 'selesai' AND cr.deleted_at IS NULL ${own ? 'AND cr.user_id = ?' : ''}
             GROUP BY cr.id
             ORDER BY cr.created_at DESC`,
            own ? [u.id] : []
        );

        res.render('sales/index', {
            layout: 'layout/layout',
            title: 'Transaksi Penjualan',
            rows,
            buyers,
            collections,
            canCreate: req.session.permissions.includes('sales.create') || u.role === 'superadmin',
            canManage: req.session.permissions.includes('sales.manage') || u.role === 'superadmin'
        });
    } catch (e) {
        console.error(e);
        res.status(500).render('error', { layout: 'layout/layout', title: '500', message: e.message });
    }
});

// ================================================================
// POST /sales/create
// ================================================================
router.post('/create', hasPermission('sales.create'), async (req, res) => {
    try {
        const db = getPool(), cid = num(req.body.collection_id), bid = num(req.body.buyer_id);
        const [[cr]] = await db.query(
            `SELECT id, user_id FROM collection_requests WHERE id = ? AND status = 'selesai' AND deleted_at IS NULL`,
            [cid]
        );
        if (!cr) throw new Error('Pickup selesai tidak ditemukan.');
        if (req.session.user.role === 'nasabah' && cr.user_id !== req.session.user.id) {
            throw new Error('Tidak berhak membuat transaksi ini.');
        }

        const [[tot]] = await db.query(
            `SELECT COALESCE(SUM(weight), 0) total_weight, COALESCE(SUM(subtotal), 0) total_amount
             FROM collection_items WHERE collection_id = ? AND deleted_at IS NULL`,
            [cid]
        );
        if (num(tot.total_weight) <= 0) throw new Error('Belum ada hasil penimbangan.');

        const code = 'SAL-' + Date.now();
        await db.query(
            `INSERT INTO sales(code, collection_id, buyer_id, total_weight, total_amount, status, payment_status, notes)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [code, cid, bid || null, num(tot.total_weight), num(tot.total_amount), 'pending', 'unpaid', clean(req.body.notes) || null]
        );

        req.flash('success', `Transaksi ${code} berhasil dibuat.`);
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/sales');
});

// ================================================================
// POST /sales/:id/approve
// ================================================================
router.post('/:id/approve', hasPermission('sales.manage'), async (req, res) => {
    try {
        const db = getPool(), id = num(req.params.id);
        await db.query(
            `UPDATE sales SET status = 'approved', payment_status = 'processing'
             WHERE id = ? AND deleted_at IS NULL AND status = 'pending'`,
            [id]
        );
        req.flash('success', 'Transaksi disetujui.');
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/sales');
});

// ================================================================
// POST /sales/:id/pay (DENGAN PILIH BANK & BUKTI PEMBAYARAN)
// ================================================================
router.post('/:id/pay', hasPermission('sales.manage'), uploadPayment.single("payment_proof"), async (req, res) => {
    const db = getPool();
    const conn = await db.getConnection();
    try {
        const id = num(req.params.id);
        await conn.beginTransaction();

        const [[s]] = await conn.query(
            `SELECT s.*, cr.user_id, cr.code AS collection_code
             FROM sales s
             LEFT JOIN collection_requests cr ON cr.id = s.collection_id
             WHERE s.id = ? AND s.deleted_at IS NULL
             FOR UPDATE`,
            [id]
        );
        if (!s) throw new Error('Transaksi tidak ditemukan.');
        if (s.payment_status === 'paid') throw new Error('Transaksi sudah dibayar sebelumnya.');

        const paymentMethod = clean(req.body.payment_method) || 'transfer_bank';
        const bankName = clean(req.body.bank_name) || null;
        const paymentNote = clean(req.body.payment_note) || null;

        let paymentProof = null;
        if (req.file) {
            paymentProof = `/uploads/payments/${req.file.filename}`;
        }

        // Update sales record
        await conn.query(
            `UPDATE sales
             SET status = 'paid',
                 payment_status = 'paid',
                 paid_at = NOW(),
                 payment_method = ?,
                 bank_name = ?,
                 payment_proof = ?,
                 payment_note = ?
             WHERE id = ?`,
            [paymentMethod, bankName, paymentProof, paymentNote, id]
        );

        // Tambah saldo wallet nasabah jika transaksi terikat pada nasabah
        if (s.user_id) {
            await conn.query(
                `UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?`,
                [s.total_amount, s.user_id]
            );

            // Catat mutasi wallet
            const walletDesc = `Pembayaran transaksi ${s.code}` + (bankName ? ` via ${bankName.toUpperCase()}` : '');
            await conn.query(
                `INSERT INTO wallet_transactions(user_id, type, amount, reference_type, reference_id, description, status)
                 VALUES(?, ?, ?, ?, ?, ?, ?)`,
                [s.user_id, 'credit', s.total_amount, 'sale', s.id, walletDesc, 'success']
            );

            // Notifikasi ke nasabah
            const bankInfoText = bankName ? ` melalui Transfer ${bankName.toUpperCase()}` : '';
            const notifMsg = `Transaksi ${s.code} sebesar Rp ${Number(s.total_amount).toLocaleString('id-ID')} telah dibayar${bankInfoText}. Bukti pembayaran dapat Anda lihat pada menu Penjualan.`;
            await conn.query(
                `INSERT INTO notifications(user_id, actor_user_id, type, title, message, icon, reference_type, reference_id)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
                [s.user_id, req.session.user.id, 'success', 'Pembayaran Penjualan Diterima', notifMsg, 'bi-cash-stack', 'sale', s.id]
            );
        }

        // Simpan dokumen bukti transfer ke tabel documents jika ada file
        if (paymentProof && req.file) {
            await conn.query(
                `INSERT INTO documents(reference_type, reference_id, document_type, file_name, file_path, mime_type, file_size, uploaded_by, is_primary)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                ['sales', s.id, 'bukti_transfer', req.file.originalname, paymentProof, req.file.mimetype, req.file.size, req.session.user.id, 1]
            );
        }

        await conn.commit();
        const bankInfoText = bankName ? ` via ${bankName.toUpperCase()}` : '';
        req.flash('success', `Transaksi ${s.code} berhasil dibayar${bankInfoText}.`);
    } catch (e) {
        await conn.rollback();
        req.flash('error', e.message);
    } finally {
        conn.release();
    }
    res.redirect('/sales');
});

// ================================================================
// POST /sales/:id/cancel
// ================================================================
router.post('/:id/cancel', hasPermission('sales.manage'), async (req, res) => {
    try {
        await getPool().query(
            `UPDATE sales SET status = 'cancelled' WHERE id = ? AND status IN ('pending', 'approved')`,
            [num(req.params.id)]
        );
        req.flash('success', 'Transaksi dibatalkan.');
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/sales');
});

module.exports = router;
