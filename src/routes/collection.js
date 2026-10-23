const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");
const { uploadCollection } = require("../middleware/upload");
const { generateCollectionExcel, formatDate, formatDateTime, formatRupiah, formatWeight } = require("./_exportHelper");
const realtime = require("../services/realtime");

const router = express.Router();
const STATUS = ['diajukan', 'dijadwalkan', 'diambil', 'ditimbang', 'selesai', 'ditolak', 'dibatalkan'];

function canManage(u) {
    return ['superadmin', 'admin_pengelola', 'petugas_pengumpulan'].includes(u?.role);
}

// ================================================================
// EXPORT EXCEL
// ================================================================
router.get("/export/excel", hasPermission("collection.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const status = clean(req.query.status);

        let where = ["cr.deleted_at IS NULL"], params = [];

        if (u.role === 'nasabah') {
            where.push('cr.user_id = ?');
            params.push(u.id);
        }
        if (startDate) {
            where.push('DATE(cr.created_at) >= ?');
            params.push(startDate);
        }
        if (endDate) {
            where.push('DATE(cr.created_at) <= ?');
            params.push(endDate);
        }
        if (STATUS.includes(status)) {
            where.push('cr.status = ?');
            params.push(status);
        }

        const W = 'WHERE ' + where.join(' AND ');
        const [rows] = await db.query(
            `SELECT cr.*, usr.full_name, usr.phone, usr.email, c.name company_name, ass.full_name collector_name,
                    COALESCE(SUM(ci.weight), 0) total_weight, COALESCE(SUM(ci.subtotal), 0) total_value, COUNT(ci.id) item_count
             FROM collection_requests cr
             JOIN users usr ON usr.id = cr.user_id
             LEFT JOIN companies c ON c.id = cr.company_id
             LEFT JOIN users ass ON ass.id = cr.assigned_to
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             ${W}
             GROUP BY cr.id
             ORDER BY cr.created_at DESC`,
            params
        );

        const totalWeight = rows.reduce((acc, r) => acc + Number(r.total_weight || 0), 0);
        const totalValue = rows.reduce((acc, r) => acc + Number(r.total_value || 0), 0);
        const completedCount = rows.filter(r => r.status === 'selesai').length;

        let periodText = "Semua Waktu";
        if (startDate && endDate) {
            periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        } else if (startDate) {
            periodText = `Mulai ${formatDate(startDate)}`;
        } else if (endDate) {
            periodText = `Sampai ${formatDate(endDate)}`;
        }

        const workbook = await generateCollectionExcel({
            title: "Rekapitulasi Pengumpulan Sampah",
            periodText,
            rows,
            summary: { totalWeight, totalValue, completedCount }
        });

        const filename = `Pengumpulan_Sampah_${startDate || 'all'}_sd_${endDate || 'all'}.xlsx`;
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
router.get("/export/preview-pdf", hasPermission("collection.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const startDate = clean(req.query.start_date);
        const endDate = clean(req.query.end_date);
        const status = clean(req.query.status);

        let where = ["cr.deleted_at IS NULL"], params = [];

        if (u.role === 'nasabah') {
            where.push('cr.user_id = ?');
            params.push(u.id);
        }
        if (startDate) {
            where.push('DATE(cr.created_at) >= ?');
            params.push(startDate);
        }
        if (endDate) {
            where.push('DATE(cr.created_at) <= ?');
            params.push(endDate);
        }
        if (STATUS.includes(status)) {
            where.push('cr.status = ?');
            params.push(status);
        }

        const W = 'WHERE ' + where.join(' AND ');
        const [rows] = await db.query(
            `SELECT cr.*, usr.full_name, usr.phone, usr.email, c.name company_name, ass.full_name collector_name,
                    COALESCE(SUM(ci.weight), 0) total_weight, COALESCE(SUM(ci.subtotal), 0) total_value, COUNT(ci.id) item_count
             FROM collection_requests cr
             JOIN users usr ON usr.id = cr.user_id
             LEFT JOIN companies c ON c.id = cr.company_id
             LEFT JOIN users ass ON ass.id = cr.assigned_to
             LEFT JOIN collection_items ci ON ci.collection_id = cr.id AND ci.deleted_at IS NULL
             ${W}
             GROUP BY cr.id
             ORDER BY cr.created_at DESC`,
            params
        );

        const totalWeight = rows.reduce((acc, r) => acc + Number(r.total_weight || 0), 0);
        const totalValue = rows.reduce((acc, r) => acc + Number(r.total_value || 0), 0);
        const completedCount = rows.filter(r => r.status === 'selesai').length;

        let periodText = "Semua Waktu";
        if (startDate && endDate) {
            periodText = `${formatDate(startDate)} s/d ${formatDate(endDate)}`;
        } else if (startDate) {
            periodText = `Mulai ${formatDate(startDate)}`;
        } else if (endDate) {
            periodText = `Sampai ${formatDate(endDate)}`;
        }

        const excelUrl = `/collection/export/excel?start_date=${encodeURIComponent(startDate || '')}&end_date=${encodeURIComponent(endDate || '')}&status=${encodeURIComponent(status || '')}`;

        res.render("collection/export_pdf", {
            layout: false,
            title: "Laporan Pengumpulan Sampah",
            appName: res.locals.appName || "Aplikasi Sampah Terintegrasi",
            periodText,
            rows,
            summary: { totalWeight, totalValue, completedCount },
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
// GET /collection
// ================================================================
router.get("/", hasPermission("collection.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const keyword = clean(req.query.keyword), status = clean(req.query.status), date = clean(req.query.date);
        let p = page(req.query.page), l = limit(req.query.limit), where = ["cr.deleted_at IS NULL"], params = [];

        if (u.role === 'nasabah') {
            where.push('cr.user_id=?');
            params.push(u.id);
        }
        if (keyword) {
            where.push('(cr.code LIKE ? OR usr.full_name LIKE ? OR cr.address LIKE ? OR cr.request_note LIKE ?)');
            const s = `%${keyword}%`;
            params.push(s, s, s, s);
        }
        if (STATUS.includes(status)) {
            where.push('cr.status=?');
            params.push(status);
        }
        if (date) {
            where.push('cr.scheduled_date=?');
            params.push(date);
        }

        const W = 'WHERE ' + where.join(' AND ');
        const [[cnt]] = await db.query(`SELECT COUNT(*) total FROM collection_requests cr JOIN users usr ON usr.id=cr.user_id ${W}`, params);
        const total = Number(cnt.total || 0), pages = Math.max(1, Math.ceil(total / l)), cp = Math.min(p, pages), off = (cp - 1) * l;

        const [rows] = await db.query(
            `SELECT cr.*, usr.full_name, usr.phone, usr.email, c.name company_name, ass.full_name collector_name,
                    COALESCE(SUM(ci.weight), 0) total_weight, COALESCE(SUM(ci.subtotal), 0) total_value, COUNT(ci.id) item_count
             FROM collection_requests cr
             JOIN users usr ON usr.id=cr.user_id
             LEFT JOIN companies c ON c.id=cr.company_id
             LEFT JOIN users ass ON ass.id=cr.assigned_to
             LEFT JOIN collection_items ci ON ci.collection_id=cr.id AND ci.deleted_at IS NULL
             ${W}
             GROUP BY cr.id
             ORDER BY cr.created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, l, off]
        );

        // Fetch all collection items for detail/tracking display
        const [allItems] = await db.query(
            `SELECT ci.*, wt.name waste_name, wt.unit, wt.category
             FROM collection_items ci
             JOIN waste_types wt ON wt.id=ci.waste_type_id
             WHERE ci.deleted_at IS NULL
             ORDER BY ci.created_at ASC`
        );
        const itemsMap = {};
        allItems.forEach(it => {
            if (!itemsMap[it.collection_id]) itemsMap[it.collection_id] = [];
            itemsMap[it.collection_id].push(it);
        });
        rows.forEach(r => {
            r.items = itemsMap[r.id] || [];
        });

        const [types] = await db.query(`SELECT * FROM waste_types WHERE status='active' AND deleted_at IS NULL ORDER BY category,name`);
        const [companies] = await db.query(`SELECT id,name FROM companies WHERE status='active' AND deleted_at IS NULL ORDER BY name`);
        const [collectors] = await db.query(`SELECT id,full_name FROM users WHERE status='active' AND deleted_at IS NULL AND id<>? ORDER BY full_name`, [u.id]);

        const [[sum]] = await db.query(
            `SELECT COUNT(*) total,
                    SUM(status='diajukan') diajukan,
                    SUM(status='dijadwalkan') dijadwalkan,
                    SUM(status='diambil') diambil,
                    SUM(status='ditimbang') ditimbang,
                    SUM(status='selesai') selesai,
                    SUM(status='ditolak') ditolak,
                    SUM(status='dibatalkan') dibatalkan
             FROM collection_requests cr
             WHERE cr.deleted_at IS NULL ${u.role === 'nasabah' ? 'AND cr.user_id=?' : ''}`,
            u.role === 'nasabah' ? [u.id] : []
        );

        res.render("collection/index", {
            layout: "layout/layout",
            title: "Pengumpulan Sampah",
            rows,
            types,
            companies,
            collectors,
            statusList: STATUS,
            filters: { keyword, status, date },
            pagination: { page: cp, limit: l, total, totalPages: pages },
            summary: Object.fromEntries(Object.entries(sum).map(([k, v]) => [k, Number(v || 0)])),
            canManage: canManage(u)
        });
    } catch (err) {
        console.error(err);
        res.status(500).render("error", { layout: "layout/layout", title: "500", message: err.message });
    }
});

// ================================================================
// SMART COORDINATE RESOLVER (GEOCODING INDONESIA)
// ================================================================
function resolveCoordinates(address, userLat, userLng) {
    const numLat = parseFloat(userLat);
    const numLng = parseFloat(userLng);
    if (!isNaN(numLat) && !isNaN(numLng) && numLat !== 0 && numLng !== 0) {
        return { latitude: numLat, longitude: numLng };
    }

    if (!address) {
        return { latitude: -6.2088, longitude: 106.8456 }; // Default Jakarta Pusat
    }

    const addrLower = String(address).toLowerCase();

    // Kamus geolokasi kota & kabupaten Indonesia
    const cityCoords = [
        { keys: ['cirebon', 'kesambi', 'harjamukti', 'kejaksan', 'pekalipan', 'lemwungkuk', 'plumbon', 'kedawung', 'weru', 'sumber', 'klayan', 'gunung jati', 'gunung laya', 'mundu', 'astana'], lat: -6.7320, lng: 108.5523 },
        { keys: ['bandung', 'cimahi', 'dago', 'buahbatu', 'lembang', 'padalarang'], lat: -6.9175, lng: 107.6191 },
        { keys: ['jakarta', 'jakpus', 'jaksel', 'jaktim', 'jakbar', 'jakut', 'monas', 'kemang', 'sudirman'], lat: -6.2088, lng: 106.8456 },
        { keys: ['surabaya', 'rungkut', 'gubeng', 'wonokromo', 'tegalsari'], lat: -7.2575, lng: 112.7521 },
        { keys: ['semarang', 'simpang lima', 'tembalang', 'banyumanik'], lat: -6.9667, lng: 110.4167 },
        { keys: ['yogyakarta', 'jogja', 'malioboro', 'sleman', 'bantul'], lat: -7.7956, lng: 110.3695 },
        { keys: ['solo', 'surakarta'], lat: -7.5755, lng: 110.8243 },
        { keys: ['bogor', 'cibinong'], lat: -6.5971, lng: 106.8060 },
        { keys: ['depok', 'margonda'], lat: -6.4025, lng: 106.7942 },
        { keys: ['tangerang', 'bsd', 'karawaci', 'serpong', 'ciputat'], lat: -6.1783, lng: 106.6319 },
        { keys: ['bekasi', 'cikarang', 'tambun'], lat: -6.2383, lng: 106.9756 },
        { keys: ['kuningan'], lat: -6.9765, lng: 108.4831 },
        { keys: ['majalengka'], lat: -6.8361, lng: 108.2274 },
        { keys: ['indramayu'], lat: -6.3264, lng: 108.3200 },
        { keys: ['tegal'], lat: -6.8694, lng: 109.1402 },
        { keys: ['brebes'], lat: -6.8706, lng: 109.0435 },
        { keys: ['pekalongan'], lat: -6.8886, lng: 109.6753 },
        { keys: ['malang', 'batu'], lat: -7.9666, lng: 112.6326 },
        { keys: ['denpasar', 'bali', 'kuta', 'ubud', 'sanur'], lat: -8.6705, lng: 115.2126 },
        { keys: ['medan'], lat: 3.5952, lng: 98.6722 },
        { keys: ['palembang'], lat: -2.9761, lng: 104.7754 },
        { keys: ['makassar'], lat: -5.1477, lng: 119.4327 },
        { keys: ['balikpapan'], lat: -1.2379, lng: 116.8529 }
    ];

    for (const city of cityCoords) {
        if (city.keys.some(k => addrLower.includes(k))) {
            return { latitude: city.lat, longitude: city.lng };
        }
    }

    return { latitude: -6.2088, longitude: 106.8456 };
}

// ================================================================
// POST /collection/request
// ================================================================
router.post("/request", hasPermission("collection.create"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const address = clean(req.body.address), date = clean(req.body.scheduled_date), time = clean(req.body.scheduled_time), note = clean(req.body.request_note);
        if (!address) throw new Error('Alamat pickup wajib diisi.');
        const coords = resolveCoordinates(address, req.body.latitude, req.body.longitude);
        const code = 'COL-' + Date.now();
        await db.query(
            `INSERT INTO collection_requests(code,user_id,company_id,address,latitude,longitude,scheduled_date,scheduled_time,request_note,status) VALUES(?,?,?,?,?,?,?,?,?,?)`,
            [code, u.id, num(req.body.company_id) || null, address, coords.latitude, coords.longitude, date || null, time || null, note || null, 'diajukan']
        );
        await db.query(
            `INSERT INTO notifications(user_id,actor_user_id,type,title,message,icon,reference_type,reference_id) VALUES(?,?,?,?,?,?,?,LAST_INSERT_ID())`,
            [u.id, u.id, 'info', 'Pickup diajukan', `Permintaan ${code} berhasil diajukan.`, 'bi-truck', 'collection']
        );
        req.flash('success', `Pickup ${code} berhasil diajukan.`);
        realtime.notifyDataChange({
            entity: 'collection',
            action: 'create',
            title: 'Permintaan Pickup Baru',
            message: `${u.full_name || 'Nasabah'} mengajukan penjemputan baru (${code})`,
            id: code
        });
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/collection');
});

// ================================================================
// POST /collection/:id/items (TAMBAH HASIL TIMBANG & FOTO SAMPAH)
// ================================================================
router.post("/:id/items", hasPermission("collection.update"), uploadCollection.single("waste_photo"), async (req, res) => {
    try {
        const db = getPool(), id = num(req.params.id);
        const [[cr]] = await db.query(`SELECT * FROM collection_requests WHERE id=? AND deleted_at IS NULL`, [id]);
        if (!cr) throw new Error('Permintaan tidak ditemukan.');

        const wt = num(req.body.waste_type_id), weight = num(req.body.weight), price = num(req.body.price_per_unit);
        if (!wt || weight <= 0) throw new Error('Jenis sampah dan berat wajib valid.');

        let p = price;
        if (p <= 0) {
            const [[w]] = await db.query(`SELECT price_per_unit FROM waste_types WHERE id=?`, [wt]);
            p = num(w?.price_per_unit);
        }

        let photoUrl = null;
        if (req.file) {
            photoUrl = `/uploads/collections/${req.file.filename}`;
        }

        const [itemResult] = await db.query(
            `INSERT INTO collection_items(collection_id,waste_type_id,weight,price_per_unit,subtotal,notes,photo_url) VALUES(?,?,?,?,?,?,?)`,
            [id, wt, weight, p, weight * p, clean(req.body.notes) || null, photoUrl]
        );

        // Jika ada foto, simpan juga ke tabel documents
        if (photoUrl) {
            await db.query(
                `INSERT INTO documents(reference_type,reference_id,document_type,file_name,file_path,mime_type,file_size,uploaded_by,is_primary)
                 VALUES(?,?,?,?,?,?,?,?,?)`,
                ['collection_item', itemResult.insertId, 'bukti_timbang', req.file.originalname, photoUrl, req.file.mimetype, req.file.size, req.session.user?.id || null, 1]
            );

            // Update photo_url pada collection_requests jika belum ada
            await db.query(
                `UPDATE collection_requests SET photo_url = COALESCE(photo_url, ?) WHERE id=?`,
                [photoUrl, id]
            );
        }

        await db.query(`UPDATE collection_requests SET status=IF(status='diajukan', 'ditimbang', status) WHERE id=?`, [id]);
        req.flash('success', 'Item penimbangan dan foto berhasil ditambahkan.');
        realtime.notifyDataChange({
            entity: 'collection',
            action: 'update',
            title: 'Hasil Timbang Sampah',
            message: `Hasil timbang sampah baru dicatat pada penjemputan #${id}`,
            affectedUserId: cr.user_id,
            id
        });
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/collection');
});

// ================================================================
// POST /collection/:id/photo (DOKUMENTASI FOTO UMUM PICKUP)
// ================================================================
router.post("/:id/photo", hasPermission("collection.update"), uploadCollection.single("collection_photo"), async (req, res) => {
    try {
        const db = getPool(), id = num(req.params.id);
        const [[cr]] = await db.query(`SELECT * FROM collection_requests WHERE id=? AND deleted_at IS NULL`, [id]);
        if (!cr) throw new Error('Data pengumpulan tidak ditemukan.');

        if (!req.file) throw new Error('Harap pilih file foto yang akan diunggah.');

        const photoUrl = `/uploads/collections/${req.file.filename}`;
        await db.query(`UPDATE collection_requests SET photo_url=? WHERE id=?`, [photoUrl, id]);

        await db.query(
            `INSERT INTO documents(reference_type,reference_id,document_type,file_name,file_path,mime_type,file_size,uploaded_by,is_primary)
             VALUES(?,?,?,?,?,?,?,?,?)`,
            ['collection', id, 'foto', req.file.originalname, photoUrl, req.file.mimetype, req.file.size, req.session.user?.id || null, 1]
        );

        req.flash('success', 'Foto dokumentasi pengumpulan sampah berhasil diunggah.');
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/collection');
});

// ================================================================
// POST /collection/:id/status
// ================================================================
router.post("/:id/status", hasPermission("collection.update"), async (req, res) => {
    try {
        const db = getPool(), id = num(req.params.id), status = clean(req.body.status);
        if (!STATUS.includes(status)) throw new Error('Status tidak valid.');
        const reason = clean(req.body.rejected_reason) || null, assigned = num(req.body.assigned_to) || null;
        await db.query(
            `UPDATE collection_requests SET status=?,rejected_reason=?,assigned_to=COALESCE(?,assigned_to) WHERE id=? AND deleted_at IS NULL`,
            [status, reason, assigned, id]
        );
        const [[cr]] = await db.query(`SELECT user_id,code FROM collection_requests WHERE id=?`, [id]);
        if (cr) {
            await db.query(
                `INSERT INTO notifications(user_id,actor_user_id,type,title,message,icon,reference_type,reference_id) VALUES(?,?,?,?,?,?,?,?)`,
                [cr.user_id, req.session.user.id, status === 'selesai' ? 'success' : status === 'ditolak' ? 'warning' : 'info', `Status pickup ${cr.code}`, `Status pickup ${cr.code} diubah menjadi ${status}.`, 'bi-truck', 'collection', id]
            );
            realtime.notifyDataChange({
                entity: 'collection',
                action: 'update',
                title: 'Status Penjemputan Diperbarui',
                message: `Status penjemputan ${cr.code} diubah menjadi "${status}"`,
                affectedUserId: cr.user_id,
                id
            });
        }
        req.flash('success', 'Status pengumpulan berhasil diperbarui.');
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/collection');
});

// ================================================================
// POST /collection/:id/edit
// ================================================================
router.post("/:id/edit", hasPermission("collection.update"), async (req, res) => {
    try {
        const db = getPool(), id = num(req.params.id), u = req.session.user;
        const [[cr]] = await db.query(`SELECT user_id,status FROM collection_requests WHERE id=? AND deleted_at IS NULL`, [id]);
        if (!cr) throw new Error('Data tidak ditemukan.');
        if (u.role === 'nasabah' && cr.user_id !== u.id) throw new Error('Tidak berhak mengubah data ini.');
        const address = clean(req.body.address) || '';
        const coords = resolveCoordinates(address, req.body.latitude, req.body.longitude);
        await db.query(
            `UPDATE collection_requests SET address=?,company_id=?,scheduled_date=?,scheduled_time=?,request_note=?,latitude=?,longitude=? WHERE id=?`,
            [address, num(req.body.company_id) || null, clean(req.body.scheduled_date) || null, clean(req.body.scheduled_time) || null, clean(req.body.request_note) || null, coords.latitude, coords.longitude, id]
        );
        req.flash('success', `Data pickup berhasil diperbarui. Lokasi terpetakan pada koordinat (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}).`);
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/collection');
});

// ================================================================
// POST /collection/:id/delete
// ================================================================
router.post("/:id/delete", hasPermission("collection.update"), async (req, res) => {
    try {
        const db = getPool(), id = num(req.params.id), u = req.session.user;
        const [[cr]] = await db.query(`SELECT user_id,status,code FROM collection_requests WHERE id=? AND deleted_at IS NULL`, [id]);
        if (!cr) throw new Error('Data tidak ditemukan.');
        if (u.role === 'nasabah' && cr.user_id !== u.id) throw new Error('Tidak berhak menghapus data ini.');
        if (cr.status === 'selesai') throw new Error('Pickup selesai tidak dapat dihapus.');
        await db.query(`UPDATE collection_requests SET deleted_at=NOW() WHERE id=?`, [id]);
        req.flash('success', `Pickup ${cr.code} dihapus.`);
    } catch (e) {
        req.flash('error', e.message);
    }
    res.redirect('/collection');
});

// ================================================================
// GET /collection/api/receipt/:id - Data Struk Nota Timbangan
// ================================================================
router.get("/api/receipt/:id", async (req, res) => {
    try {
        const db = getPool();
        const id = num(req.params.id);
        const [[cr]] = await db.query(
            `SELECT cr.*, usr.full_name as customer_name, usr.phone as customer_phone, 
                    usr.email as customer_email,
                    COALESCE((SELECT SUM(CASE WHEN type='credit' THEN amount ELSE -amount END) FROM wallet_transactions WHERE user_id = usr.id), 0) as customer_balance,
                    c.name as company_name, ass.full_name as collector_name
             FROM collection_requests cr
             JOIN users usr ON usr.id = cr.user_id
             LEFT JOIN companies c ON c.id = cr.company_id
             LEFT JOIN users ass ON ass.id = cr.assigned_to
             WHERE cr.id = ? AND cr.deleted_at IS NULL`,
            [id]
        );

        if (!cr) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan." });
        }

        const [items] = await db.query(
            `SELECT ci.*, wt.name as waste_name, wt.code as waste_code, wt.unit as waste_unit
             FROM collection_items ci
             LEFT JOIN waste_types wt ON wt.id = ci.waste_type_id
             WHERE ci.collection_id = ? AND ci.deleted_at IS NULL`,
            [id]
        );

        // Ambil profil bank sampah
        let settings = {};
        try {
            const [settingsRows] = await db.query("SELECT setting_key, setting_value FROM system_settings");
            for (const s of settingsRows) settings[s.setting_key] = s.setting_value;
        } catch (_) {}

        res.json({
            success: true,
            receipt: {
                ...cr,
                items,
                settings: {
                    bank_name: settings.bank_name || "Aplikasi Sampah Terintegrasi (PilahKita)",
                    office_address: settings.office_address || "Jl.Gununglaya RT004/RW001 Ds. Klayan Kec. Gunung Jati, Kab. Cirebon",
                    contact_phone: settings.contact_phone || "021-5558901",
                    contact_whatsapp: settings.contact_whatsapp || "081234567890"
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
