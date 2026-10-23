const express = require("express");
const { getPool } = require("../config/db");
const { auth } = require("../middleware/auth");
const { uploadChat } = require("../middleware/upload");
const realtime = require("../services/realtime");

const router = express.Router();

router.use(auth);

/* =========================================================
   GET /chat
   Halaman Utama Live Chat
========================================================= */
router.get("/", async (req, res) => {
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;

        const isNasabah = String(req.session.user?.role || "").toLowerCase() === "nasabah";
        const roleFilter = isNasabah ? " AND r.name IN ('superadmin', 'admin_pengelola', 'petugas_pengumpulan')" : "";

        // Ambil kontak aktif (kecuali user sendiri, dan jika nasabah hanya hubungi pengelola/petugas)
        const [users] = await db.query(
            `SELECT 
                u.id, 
                u.username, 
                u.full_name, 
                u.phone, 
                u.status,
                r.name AS role_name,
                (
                    SELECT message 
                    FROM chat_messages 
                    WHERE ((sender_id = u.id AND receiver_id = ?) 
                       OR (sender_id = ? AND receiver_id = u.id))
                      AND deleted_at IS NULL
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) AS last_message,
                (
                    SELECT created_at 
                    FROM chat_messages 
                    WHERE ((sender_id = u.id AND receiver_id = ?) 
                       OR (sender_id = ? AND receiver_id = u.id))
                      AND deleted_at IS NULL
                    ORDER BY created_at DESC 
                    LIMIT 1
                ) AS last_message_time,
                (
                    SELECT COUNT(*) 
                    FROM chat_messages 
                    WHERE sender_id = u.id 
                      AND receiver_id = ? 
                      AND is_read = 0
                      AND deleted_at IS NULL
                ) AS unread_count
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.id != ? 
              AND u.deleted_at IS NULL
              ${roleFilter}
            ORDER BY 
                unread_count DESC, 
                last_message_time DESC, 
                u.full_name ASC`,
            [currentUserId, currentUserId, currentUserId, currentUserId, currentUserId, currentUserId]
        );

        // Ambil pesan terakhir di ruang publik/umum
        const [[publicInfo]] = await db.query(
            `SELECT 
                m.message AS last_message,
                m.created_at AS last_message_time,
                u.full_name AS last_sender_name
            FROM chat_messages m
            LEFT JOIN users u ON u.id = m.sender_id
            WHERE m.receiver_id IS NULL AND m.deleted_at IS NULL
            ORDER BY m.created_at DESC
            LIMIT 1`
        );

        return res.render("chat/index", {
            layout: "layout/layout",
            title: "Live Chat Interaktif",
            currentUrl: "/chat",
            users: users || [],
            publicInfo: publicInfo || null,
            currentUser: req.session.user
        });

    } catch (err) {
        console.error("CHAT ROUTE ERROR:", err);
        return res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat halaman live chat: " + err.message
        });
    }
});

/* =========================================================
   GET /chat/api/messages/:targetId
   Ambil riwayat pesan
========================================================= */
router.get("/api/messages/:targetId", async (req, res) => {
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;
        const targetId = req.params.targetId;

        let messages = [];

        if (targetId === "0" || targetId === "general") {
            // Pesan Publik / Ruang Diskusi Umum
            [messages] = await db.query(
                `SELECT 
                    m.id, 
                    m.sender_id, 
                    m.receiver_id, 
                    m.message, 
                    m.attachment_url,
                    m.is_read, 
                    m.created_at,
                    u.full_name AS sender_name,
                    u.username AS sender_username,
                    r.name AS sender_role
                FROM chat_messages m
                INNER JOIN users u ON u.id = m.sender_id
                LEFT JOIN user_roles ur ON ur.user_id = u.id
                LEFT JOIN roles r ON r.id = ur.role_id
                WHERE m.receiver_id IS NULL 
                  AND m.deleted_at IS NULL
                ORDER BY m.created_at ASC
                LIMIT 150`
            );
        } else {
            const parsedTargetId = Number(targetId);
            if (!parsedTargetId) {
                return res.status(400).json({ success: false, message: "Target ID tidak valid" });
            }

            // Tandai pesan sebagai telah dibaca
            await db.query(
                `UPDATE chat_messages 
                SET is_read = 1 
                WHERE sender_id = ? 
                  AND receiver_id = ? 
                  AND is_read = 0`,
                [parsedTargetId, currentUserId]
            );

            // Ambil percakapan direct message
            [messages] = await db.query(
                `SELECT 
                    m.id, 
                    m.sender_id, 
                    m.receiver_id, 
                    m.message, 
                    m.attachment_url,
                    m.is_read, 
                    m.created_at,
                    u.full_name AS sender_name,
                    u.username AS sender_username,
                    r.name AS sender_role
                FROM chat_messages m
                INNER JOIN users u ON u.id = m.sender_id
                LEFT JOIN user_roles ur ON ur.user_id = u.id
                LEFT JOIN roles r ON r.id = ur.role_id
                WHERE ((m.sender_id = ? AND m.receiver_id = ?) 
                    OR (m.sender_id = ? AND m.receiver_id = ?))
                  AND m.deleted_at IS NULL
                ORDER BY m.created_at ASC
                LIMIT 150`,
                [currentUserId, parsedTargetId, parsedTargetId, currentUserId]
            );
        }

        return res.json({
            success: true,
            currentUserId,
            messages
        });

    } catch (err) {
        console.error("GET MESSAGES ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

/* =========================================================
   POST /chat/api/upload
   Upload lampiran file obrolan (Gambar / PDF)
========================================================= */
router.post("/api/upload", (req, res) => {
    uploadChat.single("file")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "Gagal mengunggah file"
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Tidak ada file yang dipilih"
            });
        }
        const fileUrl = `/uploads/chat/${req.file.filename}`;
        return res.json({
            success: true,
            fileUrl,
            filename: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    });
});

/* =========================================================
   POST /chat/api/send
   Kirim pesan baru
========================================================= */
router.post("/api/send", async (req, res) => {
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;
        const currentUserName = req.session.user.full_name || req.session.user.username;
        let { receiver_id, message, attachment_url } = req.body;

        let trimmedMessage = message ? String(message).trim() : "";
        if (!trimmedMessage && !attachment_url) {
            return res.status(400).json({ success: false, message: "Pesan atau lampiran tidak boleh kosong" });
        }

        if (!trimmedMessage && attachment_url) {
            trimmedMessage = "Mengirim lampiran";
        }

        let targetReceiverId = null;
        if (receiver_id && receiver_id !== "0" && receiver_id !== "general") {
            targetReceiverId = Number(receiver_id);
            if (!targetReceiverId) {
                return res.status(400).json({ success: false, message: "Penerima pesan tidak valid" });
            }
        }

        // Insert ke database
        const [result] = await db.query(
            `INSERT INTO chat_messages (sender_id, receiver_id, message, attachment_url, is_read) 
            VALUES (?, ?, ?, ?, 0)`,
            [currentUserId, targetReceiverId, trimmedMessage, attachment_url || null]
        );

        // Jika direct message, buat notifikasi ke penerima
        if (targetReceiverId) {
            await db.query(
                `INSERT INTO notifications (user_id, actor_user_id, type, title, message, icon, reference_type, reference_id) 
                VALUES (?, ?, 'info', 'Pesan Baru', ?, 'bi-chat-dots-fill', 'chat', ?)`,
                [
                    targetReceiverId,
                    currentUserId,
                    `${currentUserName}: ${trimmedMessage.substring(0, 80)}${trimmedMessage.length > 80 ? '...' : ''}`,
                    result.insertId
                ]
            );
        }

        const chatMessagePayload = {
            id: result.insertId,
            sender_id: currentUserId,
            receiver_id: targetReceiverId,
            message: trimmedMessage,
            attachment_url: attachment_url || null,
            is_read: 0,
            created_at: new Date().toISOString(),
            sender_name: currentUserName,
            sender_role: req.session.user.role || "User"
        };

        // Broadcast realtime ke SSE client
        realtime.notifyChat(chatMessagePayload);

        return res.json({
            success: true,
            message: chatMessagePayload
        });

    } catch (err) {
        console.error("SEND MESSAGE ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

/* =========================================================
   DELETE /chat/api/messages/:id
   Hapus pesan sendiri (soft delete)
========================================================= */
router.delete("/api/messages/:id", async (req, res) => {
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;
        const messageId = Number(req.params.id);

        if (!messageId) {
            return res.status(400).json({ success: false, message: "ID pesan tidak valid" });
        }

        const [result] = await db.query(
            `UPDATE chat_messages 
             SET deleted_at = NOW() 
             WHERE id = ? AND sender_id = ?`,
            [messageId, currentUserId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Pesan tidak ditemukan atau Anda tidak memiliki hak akses" });
        }

        realtime.broadcast("chat_delete", { messageId, deletedBy: currentUserId });

        return res.json({ success: true, message: "Pesan berhasil dihapus" });
    } catch (err) {
        console.error("DELETE MESSAGE ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

/* =========================================================
   DELETE & POST /chat/api/conversation/:targetId
   Hapus semua pesan dalam satu percakapan aktif
========================================================= */
router.all("/api/conversation/:targetId", async (req, res) => {
    if (req.method !== "DELETE" && req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;
        const userRole = String(req.session.user.role || "").toLowerCase();
        const targetId = req.params.targetId;

        if (targetId === "0" || targetId === "general") {
            if (userRole === "superadmin" || userRole === "admin_pengelola") {
                await db.query(
                    `UPDATE chat_messages 
                     SET deleted_at = NOW() 
                     WHERE receiver_id IS NULL AND deleted_at IS NULL`
                );
            } else {
                await db.query(
                    `UPDATE chat_messages 
                     SET deleted_at = NOW() 
                     WHERE receiver_id IS NULL AND sender_id = ? AND deleted_at IS NULL`,
                    [currentUserId]
                );
            }
        } else {
            const parsedTargetId = Number(targetId);
            if (!parsedTargetId) {
                return res.status(400).json({ success: false, message: "Target percakapan tidak valid" });
            }

            await db.query(
                `UPDATE chat_messages 
                 SET deleted_at = NOW() 
                 WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
                   AND deleted_at IS NULL`,
                [currentUserId, parsedTargetId, parsedTargetId, currentUserId]
            );
        }

        realtime.notifyChatClear({ targetId, clearedBy: currentUserId, isAll: false });

        return res.json({ success: true, message: "Percakapan berhasil dibersihkan" });
    } catch (err) {
        console.error("CLEAR CONVERSATION ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

/* =========================================================
   DELETE & POST /chat/api/clear-all
   Hapus seluruh riwayat percakapan milik user saat ini
========================================================= */
router.all("/api/clear-all", async (req, res) => {
    if (req.method !== "DELETE" && req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;

        await db.query(
            `UPDATE chat_messages 
             SET deleted_at = NOW() 
             WHERE (sender_id = ? OR receiver_id = ?) 
               AND deleted_at IS NULL`,
            [currentUserId, currentUserId]
        );

        realtime.notifyChatClear({ targetId: null, clearedBy: currentUserId, isAll: true });

        return res.json({ success: true, message: "Semua riwayat chat berhasil dibersihkan" });
    } catch (err) {
        console.error("CLEAR ALL CHATS ERROR:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
});


/* =========================================================
   GET /chat/api/unread-count
   Ambil total pesan belum dibaca
========================================================= */
router.get("/api/unread-count", async (req, res) => {
    try {
        const db = getPool();
        const currentUserId = req.session.user.id;

        const [[row]] = await db.query(
            `SELECT COUNT(*) AS total_unread 
            FROM chat_messages 
            WHERE receiver_id = ? 
              AND is_read = 0 
              AND deleted_at IS NULL`,
            [currentUserId]
        );

        return res.json({
            success: true,
            total_unread: Number(row?.total_unread || 0)
        });

    } catch (err) {
        return res.status(500).json({ success: false, total_unread: 0 });
    }
});

module.exports = router;