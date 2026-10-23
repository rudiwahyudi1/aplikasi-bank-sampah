// ================================================================
// DOCUMENTS & EVIDENCE ROUTES (PUSAT DOKUMEN TERHUBUNG)
// Aplikasi Sampah Terintegrasi
// ================================================================

const express = require("express");
const path = require("path");
const fs = require("fs");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { num, clean } = require("./_helpers");
const { uploadDocument } = require("../middleware/upload");

const router = express.Router();

// ================================================================
// GET /documents - DAFTAR DOKUMEN TERHUBUNG
// ================================================================
router.get("/", hasPermission("documents.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const isNasabah = u.role === "nasabah";
        const typeFilter = clean(req.query.type);
        const refFilter = clean(req.query.ref);
        const keyword = clean(req.query.q);

        let where = ["d.deleted_at IS NULL"], params = [];

        // Role restriction: Nasabah hanya melihat dokumen transaksi miliknya
        if (isNasabah) {
            where.push(`(
                d.uploaded_by = ? OR 
                s_cr.user_id = ? OR 
                cr.user_id = ? OR 
                ci_u.id = ? OR 
                wr.user_id = ? OR
                wc.user_id = ?
            )`);
            params.push(u.id, u.id, u.id, u.id, u.id, u.id);
        }

        if (typeFilter) {
            where.push("d.document_type = ?");
            params.push(typeFilter);
        }
        if (refFilter) {
            where.push("d.reference_type = ?");
            params.push(refFilter);
        }
        if (keyword) {
            where.push("(d.file_name LIKE ? OR s.code LIKE ? OR cr.code LIKE ? OR ci_cr.code LIKE ?)");
            const kw = `%${keyword}%`;
            params.push(kw, kw, kw, kw);
        }

        const W = "WHERE " + where.join(" AND ");

        const [rows] = await db.query(
            `SELECT 
                d.*,
                u.full_name AS uploaded_name,
                u.username AS uploaded_username,
                -- Data Penjualan
                s.code AS sales_code,
                s.total_amount AS sales_amount,
                b.name AS buyer_name,
                -- Data Penjemputan
                cr.code AS collection_code,
                cr.address AS collection_address,
                cru.full_name AS collection_nasabah,
                -- Data Item Sampah
                ci_cr.code AS ci_collection_code,
                ci_wt.name AS ci_waste_name,
                ci.weight AS ci_weight,
                -- Data Penarikan
                wr.id AS wdr_id,
                wr.amount AS wdr_amount,
                wr.bank_name AS wdr_bank,
                wr.account_number AS wdr_account,
                wru.full_name AS wdr_nasabah,
                -- Data Aduan
                wc.ticket_code AS complaint_ticket
             FROM documents d
             LEFT JOIN users u ON u.id = d.uploaded_by
             -- Relasi Sales
             LEFT JOIN sales s ON d.reference_type = 'sales' AND s.id = d.reference_id
             LEFT JOIN buyers b ON b.id = s.buyer_id
             LEFT JOIN collection_requests s_cr ON s_cr.id = s.collection_id
             -- Relasi Collection
             LEFT JOIN collection_requests cr ON (d.reference_type = 'collection' OR d.reference_type = 'collection_request') AND cr.id = d.reference_id
             LEFT JOIN users cru ON cru.id = cr.user_id
             -- Relasi Collection Items
             LEFT JOIN collection_items ci ON d.reference_type = 'collection_item' AND ci.id = d.reference_id
             LEFT JOIN collection_requests ci_cr ON ci_cr.id = ci.collection_id
             LEFT JOIN users ci_u ON ci_u.id = ci_cr.user_id
             LEFT JOIN waste_types ci_wt ON ci_wt.id = ci.waste_type_id
             -- Relasi Withdrawal
             LEFT JOIN withdrawal_requests wr ON d.reference_type = 'withdrawal' AND wr.id = d.reference_id
             LEFT JOIN users wru ON wru.id = wr.user_id
             -- Relasi Aduan
             LEFT JOIN waste_complaints wc ON (d.reference_type = 'complaint' OR d.reference_type = 'waste_complaint') AND wc.id = d.reference_id
             ${W}
             ORDER BY d.created_at DESC LIMIT 300`,
            params
        );

        // Ambil daftar transaksi referensi untuk form modal upload dokumen (hanya data user bersangkutan jika nasabah)
        let salesListQuery = "SELECT id, code, total_amount FROM sales WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 50";
        let collectionListQuery = "SELECT id, code, address FROM collection_requests WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 50";
        let withdrawalListQuery = "SELECT id, amount, bank_name, account_number FROM withdrawal_requests WHERE deleted_at IS NULL ORDER BY id DESC LIMIT 50";
        let salesParams = [], collParams = [], wdrParams = [];

        if (isNasabah) {
            salesListQuery = `SELECT s.id, s.code, s.total_amount 
                              FROM sales s 
                              JOIN collection_requests cr ON cr.id = s.collection_id 
                              WHERE s.deleted_at IS NULL AND cr.user_id = ? 
                              ORDER BY s.id DESC LIMIT 50`;
            salesParams.push(u.id);

            collectionListQuery = `SELECT id, code, address 
                                   FROM collection_requests 
                                   WHERE deleted_at IS NULL AND user_id = ? 
                                   ORDER BY id DESC LIMIT 50`;
            collParams.push(u.id);

            withdrawalListQuery = `SELECT id, amount, bank_name, account_number 
                                   FROM withdrawal_requests 
                                   WHERE deleted_at IS NULL AND user_id = ? 
                                   ORDER BY id DESC LIMIT 50`;
            wdrParams.push(u.id);
        }

        const [salesList] = await db.query(salesListQuery, salesParams);
        const [collectionList] = await db.query(collectionListQuery, collParams);
        const [withdrawalList] = await db.query(withdrawalListQuery, wdrParams);

        res.render("documents/index", {
            layout: "layout/layout",
            title: "Dokumen & Bukti Transaksi",
            rows,
            salesList,
            collectionList,
            withdrawalList,
            filters: { type: typeFilter || '', ref: refFilter || '', q: keyword || '' },
            canManage: u.role === "superadmin" || u.permissions?.includes("documents.manage")
        });
    } catch (e) {
        console.error("Documents Error:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: e.message
        });
    }
});

// ================================================================
// POST /documents/add - UNGGAH DOKUMEN BARU TERHUBUNG
// ================================================================
router.post("/add", hasPermission("documents.manage"), uploadDocument.single("file"), async (req, res) => {
    try {
        const db = getPool();
        const refType = clean(req.body.reference_type) || "umum";
        const refId = num(req.body.reference_id) || null;
        const docType = clean(req.body.document_type) || "lainnya";
        const fileName = clean(req.body.file_name) || (req.file ? req.file.originalname : "Dokumen");

        let filePath = clean(req.body.file_path);
        let mimeType = null;
        let fileSize = 0;

        if (req.file) {
            filePath = "/uploads/documents/" + req.file.filename;
            mimeType = req.file.mimetype;
            fileSize = req.file.size;
        }

        if (!filePath) {
            throw new Error("File dokumen wajib diunggah atau path file wajib ditentukan.");
        }

        await db.query(
            `INSERT INTO documents 
             (reference_type, reference_id, document_type, file_name, file_path, mime_type, file_size, uploaded_by, is_primary) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [refType, refId, docType, fileName, filePath, mimeType, fileSize, req.session.user.id]
        );

        req.flash("success", "Dokumen bukti berhasil diunggah dan terhubung ke sistem.");
    } catch (e) {
        console.error("Upload Document Error:", e);
        req.flash("error", e.message);
    }
    res.redirect("/documents");
});

// ================================================================
// POST /documents/:id/delete - HAPUS DOKUMEN (SOFT DELETE)
// ================================================================
router.post("/:id/delete", hasPermission("documents.manage"), async (req, res) => {
    try {
        await getPool().query(
            "UPDATE documents SET deleted_at = NOW() WHERE id = ?",
            [num(req.params.id)]
        );
        req.flash("success", "Dokumen berhasil dihapus.");
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/documents");
});

// ================================================================
// GET /documents/:id/download - UNDUH BERKAS DOKUMEN
// ================================================================
router.get("/:id/download", hasPermission("documents.read"), async (req, res) => {
    try {
        const db = getPool(), u = req.session.user;
        const isNasabah = u.role === "nasabah";
        const docId = num(req.params.id);

        const [[doc]] = await db.query(
            `SELECT d.*, 
                    s_cr.user_id AS s_user_id,
                    cr.user_id AS cr_user_id,
                    ci_cr.user_id AS ci_user_id,
                    wr.user_id AS wr_user_id,
                    wc.user_id AS wc_user_id
             FROM documents d
             LEFT JOIN sales s ON d.reference_type = 'sales' AND s.id = d.reference_id
             LEFT JOIN collection_requests s_cr ON s_cr.id = s.collection_id
             LEFT JOIN collection_requests cr ON (d.reference_type = 'collection' OR d.reference_type = 'collection_request') AND cr.id = d.reference_id
             LEFT JOIN collection_items ci ON d.reference_type = 'collection_item' AND ci.id = d.reference_id
             LEFT JOIN collection_requests ci_cr ON ci_cr.id = ci.collection_id
             LEFT JOIN withdrawal_requests wr ON d.reference_type = 'withdrawal' AND wr.id = d.reference_id
             LEFT JOIN waste_complaints wc ON (d.reference_type = 'complaint' OR d.reference_type = 'waste_complaint') AND wc.id = d.reference_id
             WHERE d.id = ? AND d.deleted_at IS NULL`,
            [docId]
        );

        if (!doc || !doc.file_path) {
            return res.status(404).send("File dokumen tidak ditemukan.");
        }

        // Jika nasabah, pastikan dokumen ini adalah miliknya
        if (isNasabah) {
            const isOwner = doc.uploaded_by === u.id ||
                            doc.s_user_id === u.id ||
                            doc.cr_user_id === u.id ||
                            doc.ci_user_id === u.id ||
                            doc.wr_user_id === u.id ||
                            doc.wc_user_id === u.id;
            if (!isOwner) {
                return res.status(403).send("Akses ditolak: Anda hanya dapat mengunduh dokumen milik Anda sendiri.");
            }
        }

        const safeRel = doc.file_path.replace(/^\//, "");
        const absPath = path.join(__dirname, "../../public", safeRel);

        if (fs.existsSync(absPath)) {
            return res.download(absPath, doc.file_name || path.basename(absPath));
        } else {
            return res.redirect(doc.file_path);
        }
    } catch (err) {
        res.status(500).send("Gagal mengunduh berkas: " + err.message);
    }
});

module.exports = router;
