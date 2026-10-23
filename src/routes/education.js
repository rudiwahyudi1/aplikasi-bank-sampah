const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { clean, num } = require("./_helpers");

const router = express.Router();

function slugify(text) {
    return (text || "")
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
}

// GET /education
router.get("/", hasPermission("education.read"), async (req, res) => {
    try {
        const db = getPool();
        const user = req.session.user;
        const canManage = user && (user.role === "superadmin" || user.role === "admin_pengelola" || (req.session.permissions && req.session.permissions.includes("education.manage")));

        const category = clean(req.query.category);
        const search = clean(req.query.search);

        let where = ["deleted_at IS NULL"];
        let params = [];

        if (category && category !== "semua") {
            where.push("category = ?");
            params.push(category);
        }
        if (search) {
            where.push("(title LIKE ? OR summary LIKE ? OR content LIKE ?)");
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const [articles] = await db.query(
            `SELECT * FROM education_articles WHERE ${where.join(" AND ")} ORDER BY created_at DESC`,
            params
        );

        res.render("education/index", {
            layout: "layout/layout",
            title: "Pusat Edukasi & Panduan 3R",
            currentUrl: "/education",
            articles,
            filters: { category, search },
            canManage
        });
    } catch (e) {
        console.error("EDUCATION ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat pusat edukasi: " + e.message
        });
    }
});

// GET /education/api/:id (Untuk modal baca detail berita profesional)
router.get("/api/:id", hasPermission("education.read"), async (req, res) => {
    try {
        const db = getPool();
        const [[article]] = await db.query(
            "SELECT * FROM education_articles WHERE id = ? AND deleted_at IS NULL",
            [req.params.id]
        );
        if (!article) return res.status(404).json({ success: false, message: "Artikel tidak ditemukan." });

        const dateFormatted = new Date(article.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        res.json({
            success: true,
            article: {
                ...article,
                dateFormatted
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// POST /education/create (Admin input artikel baru)
router.post("/create", async (req, res) => {
    try {
        const user = req.session.user;
        const canManage = user && (user.role === "superadmin" || user.role === "admin_pengelola" || (req.session.permissions && req.session.permissions.includes("education.manage")));
        if (!canManage) {
            req.flash("error", "Anda tidak memiliki hak akses untuk menambah artikel edukasi.");
            return res.redirect("/education");
        }

        const db = getPool();
        const title = clean(req.body.title);
        const category = clean(req.body.category) || "info_bank_sampah";
        const summary = clean(req.body.summary);
        const content = clean(req.body.content);
        const authorName = clean(req.body.author_name) || "Tim Redaksi PilahKita";
        const readingTime = Math.max(1, num(req.body.reading_time, 3));
        const thumbnailIcon = clean(req.body.thumbnail_icon) || "bi-newspaper";

        if (!title || !content) {
            req.flash("error", "Judul dan konten artikel wajib diisi.");
            return res.redirect("/education");
        }

        const slug = slugify(title) + "-" + Date.now();

        await db.query(
            `INSERT INTO education_articles 
             (title, slug, category, summary, content, thumbnail_icon, reading_time, author_name)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, slug, category, summary || title, content, thumbnailIcon, readingTime, authorName]
        );

        req.flash("success", `Artikel edukasi "${title}" berhasil diterbitkan!`);
    } catch (e) {
        console.error("CREATE ARTICLE ERROR:", e);
        req.flash("error", "Gagal menerbitkan artikel: " + e.message);
    }
    res.redirect("/education");
});

// POST /education/edit/:id (Admin edit artikel)
router.post("/edit/:id", async (req, res) => {
    try {
        const user = req.session.user;
        const canManage = user && (user.role === "superadmin" || user.role === "admin_pengelola" || (req.session.permissions && req.session.permissions.includes("education.manage")));
        if (!canManage) {
            req.flash("error", "Anda tidak memiliki hak akses untuk mengedit artikel.");
            return res.redirect("/education");
        }

        const db = getPool();
        const id = num(req.params.id);
        const title = clean(req.body.title);
        const category = clean(req.body.category);
        const summary = clean(req.body.summary);
        const content = clean(req.body.content);
        const authorName = clean(req.body.author_name) || "Tim Redaksi PilahKita";
        const readingTime = Math.max(1, num(req.body.reading_time, 3));
        const thumbnailIcon = clean(req.body.thumbnail_icon) || "bi-newspaper";

        if (!title || !content) {
            req.flash("error", "Judul dan isi konten tidak boleh kosong.");
            return res.redirect("/education");
        }

        await db.query(
            `UPDATE education_articles 
             SET title = ?, category = ?, summary = ?, content = ?, thumbnail_icon = ?, reading_time = ?, author_name = ?, updated_at = NOW()
             WHERE id = ? AND deleted_at IS NULL`,
            [title, category, summary, content, thumbnailIcon, readingTime, authorName, id]
        );

        req.flash("success", "Artikel berhasil diperbarui!");
    } catch (e) {
        console.error("EDIT ARTICLE ERROR:", e);
        req.flash("error", "Gagal memperbarui artikel: " + e.message);
    }
    res.redirect("/education");
});

// POST /education/delete/:id (Admin hapus artikel)
router.post("/delete/:id", async (req, res) => {
    try {
        const user = req.session.user;
        const canManage = user && (user.role === "superadmin" || user.role === "admin_pengelola" || (req.session.permissions && req.session.permissions.includes("education.manage")));
        if (!canManage) {
            req.flash("error", "Anda tidak memiliki hak akses untuk menghapus artikel.");
            return res.redirect("/education");
        }

        const db = getPool();
        const id = num(req.params.id);

        await db.query(
            "UPDATE education_articles SET deleted_at = NOW() WHERE id = ?",
            [id]
        );

        req.flash("success", "Artikel berhasil dihapus.");
    } catch (e) {
        console.error("DELETE ARTICLE ERROR:", e);
        req.flash("error", "Gagal menghapus artikel: " + e.message);
    }
    res.redirect("/education");
});

module.exports = router;
