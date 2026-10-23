const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { auth, hasPermission } = require('../middleware/auth');
const { uploadComplaint } = require('../middleware/upload');

function checkPerm(req, perm) {
    if (!req.session || !req.session.user) return false;
    const perms = req.session.permissions || [];
    if (perms.includes('*') || req.session.user.role === 'superadmin') return true;
    return perms.includes(perm);
}

// ================================================================
// GET /complaints - DAFTAR PENGADUAN SAMPAH LIAR
// ================================================================
router.get('/', auth, hasPermission('complaints.read'), async (req, res) => {
    try {
        if (!checkPerm(req, 'complaints.read')) {
            return res.status(403).send('Akses ditolak: Anda tidak memiliki izin untuk melihat pengaduan.');
        }

        const pool = db.getPool();
        const canManage = checkPerm(req, 'complaints.manage');
        const isNasabah = req.session.user.role === 'nasabah';
        const userId = req.session.user.id;

        const { status, urgency, search } = req.query;

        let query = `
            SELECT c.*, u.full_name as officer_name
            FROM waste_complaints c
            LEFT JOIN users u ON c.officer_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Role restriction: Nasabah hanya melihat pengaduan yang dibuat oleh dirinya sendiri
        if (isNasabah) {
            query += ` AND c.user_id = ?`;
            params.push(userId);
        }

        if (status && status !== 'semua') {
            query += ` AND c.status = ?`;
            params.push(status);
        }

        if (urgency && urgency !== 'semua') {
            query += ` AND c.urgency_level = ?`;
            params.push(urgency);
        }

        if (search && search.trim() !== '') {
            query += ` AND (c.ticket_code LIKE ? OR c.reporter_name LIKE ? OR c.location_address LIKE ? OR c.neighborhood LIKE ? OR c.description LIKE ?)`;
            const kw = `%${search.trim()}%`;
            params.push(kw, kw, kw, kw, kw);
        }

        query += ` ORDER BY FIELD(c.urgency_level, 'darurat', 'tinggi', 'normal'), c.created_at DESC`;

        const [complaints] = await pool.query(query, params);

        // Summary metrics (hanya hitung milik nasabah bersangkutan jika role nasabah)
        const [statsRows] = await pool.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN status = 'in_progress' OR status = 'verified' THEN 1 ELSE 0 END) as in_progress_count,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
            FROM waste_complaints
            ${isNasabah ? 'WHERE user_id = ?' : ''}
        `, isNasabah ? [userId] : []);

        const summary = {
            total: Number(statsRows[0].total) || 0,
            pending: Number(statsRows[0].pending_count) || 0,
            in_progress: Number(statsRows[0].in_progress_count) || 0,
            resolved: Number(statsRows[0].resolved_count) || 0
        };

        // Ambil daftar petugas lapangan untuk penugasan (hanya untuk admin / pengelola)
        let officers = [];
        if (canManage) {
            const [officerRows] = await pool.query(`
                SELECT u.id, u.full_name, u.username
                FROM users u
                JOIN user_roles ur ON u.id = ur.user_id
                JOIN roles r ON ur.role_id = r.id
                WHERE r.name IN ('petugas_pengumpulan', 'admin_pengelola', 'superadmin')
                ORDER BY u.full_name ASC
            `);
            officers = officerRows;
        }

        res.render('complaints/index', {
            title: 'Lapor Sampah Liar & Pengaduan Lingkungan',
            complaints,
            summary,
            officers,
            filters: {
                status: status || '',
                urgency: urgency || '',
                search: search || ''
            },
            canManage,
            isNasabah,
            user: req.session.user
        });
    } catch (err) {
        console.error('Error GET /complaints:', err);
        res.status(500).send('Terjadi kesalahan server saat memuat halaman pengaduan.');
    }
});

// ================================================================
// POST /complaints/create - BUAT LAPORAN PENGADUAN BARU
// ================================================================
router.post('/create', auth, uploadComplaint.single('photo'), async (req, res) => {
    try {
        if (!checkPerm(req, 'complaints.create')) {
            return res.status(403).send('Akses ditolak: Anda tidak memiliki izin untuk membuat pengaduan.');
        }

        const pool = db.getPool();
        const {
            reporter_name,
            reporter_phone,
            location_address,
            neighborhood,
            waste_estimate,
            urgency_level,
            description
        } = req.body;

        if (!location_address || !description) {
            return res.status(400).send('Alamat lokasi dan detail pengaduan wajib diisi.');
        }

        // Handle uploaded photo
        let photo_url = null;
        if (req.file) {
            photo_url = '/uploads/complaints/' + req.file.filename;
        }

        // Generate Ticket Code
        const now = new Date();
        const yyyymm = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0');
        const [lastRow] = await pool.query(
            'SELECT ticket_code FROM waste_complaints WHERE ticket_code LIKE ? ORDER BY id DESC LIMIT 1',
            [`LAP-${yyyymm}-%`]
        );

        let nextSeq = 1;
        if (lastRow.length > 0) {
            const parts = lastRow[0].ticket_code.split('-');
            if (parts.length === 3) {
                nextSeq = parseInt(parts[2], 10) + 1;
            }
        }
        const ticket_code = `LAP-${yyyymm}-${String(nextSeq).padStart(3, '0')}`;

        const userId = req.session.user ? req.session.user.id : null;
        const repName = reporter_name || (req.session.user ? req.session.user.full_name : 'Warga Anonim');
        const repPhone = reporter_phone || (req.session.user ? req.session.user.phone : '');

        const [insertRes] = await pool.query(`
            INSERT INTO waste_complaints 
            (ticket_code, user_id, reporter_name, reporter_phone, location_address, neighborhood, waste_estimate, urgency_level, description, photo_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [
            ticket_code,
            userId,
            repName,
            repPhone,
            location_address,
            neighborhood || '',
            waste_estimate || 'Belum diestimasi',
            urgency_level || 'normal',
            description,
            photo_url
        ]);

        // Insert log awal
        await pool.query(`
            INSERT INTO waste_complaint_logs (complaint_id, user_id, action, notes)
            VALUES (?, ?, 'created', 'Pengaduan baru diajukan oleh warga/nasabah.')
        `, [insertRes.insertId, userId]);

        res.redirect('/complaints?created=true');
    } catch (err) {
        console.error('Error POST /complaints/create:', err);
        res.status(500).send('Terjadi kesalahan server saat membuat laporan pengaduan.');
    }
});

// ================================================================
// POST /complaints/update-status/:id - UPDATE STATUS & TINDAK LANJUT
// ================================================================
router.post('/update-status/:id', auth, async (req, res) => {
    try {
        if (!checkPerm(req, 'complaints.manage')) {
            return res.status(403).send('Akses ditolak: Anda tidak berwenang mengelola status pengaduan.');
        }

        const pool = db.getPool();
        const id = req.params.id;
        const { status, officer_id, officer_notes, reward_points } = req.body;

        const [currRows] = await pool.query('SELECT * FROM waste_complaints WHERE id = ?', [id]);
        if (currRows.length === 0) {
            return res.status(404).send('Data pengaduan tidak ditemukan.');
        }
        const curr = currRows[0];

        let resolved_at = curr.resolved_at;
        if (status === 'resolved' && !resolved_at) {
            resolved_at = new Date();
        }

        const points = parseInt(reward_points, 10) || 0;

        await pool.query(`
            UPDATE waste_complaints
            SET status = ?, officer_id = ?, officer_notes = ?, resolved_at = ?, reward_points_awarded = ?
            WHERE id = ?
        `, [
            status,
            officer_id ? parseInt(officer_id, 10) : curr.officer_id,
            officer_notes || curr.officer_notes,
            resolved_at,
            points > 0 ? points : curr.reward_points_awarded,
            id
        ]);

        // Berikan Reward Poin Lingkungan jika diselesaikan & ada user_id
        if (status === 'resolved' && points > 0 && curr.user_id && curr.reward_points_awarded === 0) {
            try {
                // Catat transaksi wallet
                const [lastTx] = await pool.query(
                    'SELECT transaction_code FROM wallet_transactions ORDER BY id DESC LIMIT 1'
                );
                let txSeq = 1;
                if (lastTx.length > 0) {
                    const match = lastTx[0].transaction_code.match(/\d+$/);
                    if (match) txSeq = parseInt(match[0], 10) + 1;
                }
                const txCode = `WTX-REW-${String(txSeq).padStart(4, '0')}`;

                await pool.query(`
                    INSERT INTO wallet_transactions 
                    (transaction_code, user_id, type, amount, status, notes)
                    VALUES (?, ?, 'credit', ?, 'completed', ?)
                `, [
                    txCode,
                    curr.user_id,
                    points,
                    `Apresiasi Warga Peduli Lingkungan: Penanganan Pengaduan ${curr.ticket_code}`
                ]);
            } catch (wErr) {
                console.warn('Gagal menambahkan wallet reward points:', wErr);
            }
        }

        // Catat log tindakan
        await pool.query(`
            INSERT INTO waste_complaint_logs (complaint_id, user_id, action, notes)
            VALUES (?, ?, ?, ?)
        `, [
            id,
            req.session.user.id,
            `status_to_${status}`,
            officer_notes || `Status diubah menjadi ${status}`
        ]);

        res.redirect('/complaints?updated=true');
    } catch (err) {
        console.error('Error POST /complaints/update-status/:id:', err);
        res.status(500).send('Terjadi kesalahan server saat memperbarui status pengaduan.');
    }
});

// ================================================================
// POST /complaints/delete/:id - HAPUS PENGADUAN
// ================================================================
router.post('/delete/:id', auth, async (req, res) => {
    try {
        if (!checkPerm(req, 'complaints.manage')) {
            return res.status(403).send('Akses ditolak: Anda tidak memiliki izin untuk menghapus pengaduan.');
        }

        const pool = db.getPool();
        const id = req.params.id;

        await pool.query('DELETE FROM waste_complaint_logs WHERE complaint_id = ?', [id]);
        await pool.query('DELETE FROM waste_complaints WHERE id = ?', [id]);

        res.redirect('/complaints?deleted=true');
    } catch (err) {
        console.error('Error POST /complaints/delete/:id:', err);
        res.status(500).send('Terjadi kesalahan server saat menghapus pengaduan.');
    }
});

module.exports = router;
