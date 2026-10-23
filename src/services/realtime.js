// ================================================================
// PILAHKITA REALTIME ENGINE
// Server-Sent Events (SSE) Hub & Event Dispatcher
// ================================================================

class RealtimeService {
    constructor() {
        this.clients = new Set();
    }

    /**
     * Daftarkan koneksi stream SSE client
     */
    handleStream(req, res) {
        const user = req.session?.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Header SSE standar
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        });

        const initialPayload = JSON.stringify({
            status: "connected",
            userId: user.id,
            role: user.role,
            timestamp: Date.now()
        });
        res.write(`event: connected\ndata: ${initialPayload}\n\n`);

        const client = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            res,
            userId: Number(user.id),
            role: String(user.role || "").toLowerCase()
        };

        this.clients.add(client);

        req.on("close", () => {
            this.clients.delete(client);
        });

        req.on("error", () => {
            this.clients.delete(client);
        });
    }

    /**
     * Broadcast pesan SSE ke kumpulan client
     */
    broadcast(event, payload, filterFn = null) {
        const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
        for (const client of this.clients) {
            try {
                if (!filterFn || filterFn(client)) {
                    client.res.write(message);
                }
            } catch (err) {
                this.clients.delete(client);
            }
        }
    }

    /**
     * Broadcast pesan chat baru
     */
    notifyChat(chatMsg) {
        this.broadcast("chat_message", chatMsg, (client) => {
            // Jika pesan publik / ruang umum (receiver_id null atau 0)
            if (!chatMsg.receiver_id || chatMsg.receiver_id === 0) {
                return true;
            }
            // Direct message: hanya kirim ke pengirim dan penerima
            return client.userId === Number(chatMsg.receiver_id) || client.userId === Number(chatMsg.sender_id);
        });
    }

    /**
     * Broadcast penghapusan atau pembersihan chat
     */
    notifyChatClear(data) {
        this.broadcast("chat_clear", data, (client) => {
            if (data.isAll) {
                return client.userId === Number(data.clearedBy);
            }
            if (data.targetId === "0" || data.targetId === "general") {
                return true;
            }
            const targetIdNum = Number(data.targetId);
            return client.userId === targetIdNum || client.userId === Number(data.clearedBy);
        });
    }

    /**
     * Broadcast perubahan data (nambah/edit/hapus)
     */
    notifyDataChange({ entity, action = "update", title, message, affectedUserId = null, targetRoles = null, id = null, data = null }) {
        this.broadcast("data_change", {
            entity,
            action,
            title: title || `Pembaruan Data ${entity}`,
            message: message || `Data ${entity} telah diperbarui secara realtime.`,
            id,
            affectedUserId: affectedUserId ? Number(affectedUserId) : null,
            data,
            timestamp: Date.now()
        }, (client) => {
            // Jika ditujukan khusus untuk nasabah/user tertentu
            if (affectedUserId && client.userId === Number(affectedUserId)) {
                return true;
            }
            // Jika ditujukan untuk role tertentu (misal admin, petugas)
            if (targetRoles && Array.isArray(targetRoles)) {
                return targetRoles.map(r => String(r).toLowerCase()).includes(client.role);
            }
            // Jika broadcast umum (seperti perubahan harga atau penjemputan baru)
            if (!affectedUserId && !targetRoles) {
                return true;
            }
            return false;
        });
    }
}

// Inisialisasi singleton
const realtime = new RealtimeService();

// Heartbeat ping setiap 25 detik agar koneksi tetap stabil melalui reverse proxy / firewall
const heartbeat = setInterval(() => {
    for (const client of realtime.clients) {
        try {
            client.res.write(": ping\n\n");
        } catch (_) {
            realtime.clients.delete(client);
        }
    }
}, 25000);

if (heartbeat && typeof heartbeat.unref === "function") {
    heartbeat.unref();
}

module.exports = realtime;
