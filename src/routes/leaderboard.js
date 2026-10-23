const express = require("express");
const { getPool } = require("../config/db");
const { clean } = require("./_helpers");

const router = express.Router();

function getBadge(kg = 0) {
    const weight = Number(kg);
    if (weight >= 100) {
        return { name: "Pendekar Daur Ulang", tier: "gold", icon: "bi-trophy-fill", color: "#f59e0b", badgeClass: "bg-warning text-dark", desc: "Setoran > 100 kg" };
    }
    if (weight >= 50) {
        return { name: "Pahlawan Lingkungan", tier: "silver", icon: "bi-award-fill", color: "#64748b", badgeClass: "bg-secondary text-white", desc: "Setoran > 50 kg" };
    }
    if (weight >= 20) {
        return { name: "Pejuang Pemilah", tier: "bronze", icon: "bi-patch-check-fill", color: "#0284c7", badgeClass: "bg-info text-dark", desc: "Setoran > 20 kg" };
    }
    if (weight >= 5) {
        return { name: "Sahabat Hijau", tier: "green", icon: "bi-tree-fill", color: "#16a34a", badgeClass: "bg-success text-white", desc: "Setoran > 5 kg" };
    }
    return { name: "Pemula Peduli", tier: "starter", icon: "bi-recycle", color: "#9ca3af", badgeClass: "bg-light text-dark border", desc: "Memulai pilah sampah" };
}

// GET /leaderboard
router.get("/", async (req, res) => {
    try {
        const db = getPool();
        const currentUser = req.session.user;
        const keyword = clean(req.query.keyword);
        const tierFilter = clean(req.query.tier);

        let where = ["u.deleted_at IS NULL"];
        let params = [];

        if (keyword) {
            where.push("(u.full_name LIKE ? OR u.username LIKE ? OR u.address LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        const [rows] = await db.query(
            `SELECT 
                u.id,
                u.username,
                u.full_name,
                u.phone,
                u.address,
                u.wallet_balance,
                u.created_at,
                COALESCE((
                    SELECT SUM(ci.weight)
                    FROM collection_requests cr
                    JOIN collection_items ci ON ci.collection_id = cr.id
                    WHERE cr.user_id = u.id AND cr.status = 'completed'
                ), 0) AS total_kg,
                COALESCE((
                    SELECT COUNT(DISTINCT cr.id)
                    FROM collection_requests cr
                    WHERE cr.user_id = u.id AND cr.status = 'completed'
                ), 0) AS total_collections
            FROM users u
            WHERE ${where.join(" AND ")}
            GROUP BY u.id
            ORDER BY total_kg DESC, total_collections DESC, u.created_at ASC`,
            params
        );

        // Map ranking and badges
        let rankedList = rows.map((r, index) => {
            const badge = getBadge(r.total_kg);
            const co2Saved = (Number(r.total_kg) * 1.5).toFixed(1);
            return {
                ...r,
                rank: index + 1,
                badge,
                co2_saved: co2Saved,
                member_code: `BS-${new Date(r.created_at).getFullYear()}-${String(r.id).padStart(4, '0')}`
            };
        });

        if (tierFilter) {
            rankedList = rankedList.filter(item => item.badge.tier === tierFilter);
        }

        // Summary metrics
        const totalKgAll = rows.reduce((acc, curr) => acc + Number(curr.total_kg || 0), 0);
        const totalCo2All = (totalKgAll * 1.5).toFixed(1);
        const topNasabah = rows.length > 0 ? rows[0] : null;

        const summary = {
            total_participants: rows.length,
            total_kg_all: totalKgAll,
            total_co2_all: totalCo2All,
            top_winner_name: topNasabah ? topNasabah.full_name : "Belum Ada",
            top_winner_kg: topNasabah ? Number(topNasabah.total_kg).toFixed(1) : 0
        };

        res.render("leaderboard/index", {
            layout: "layout/layout",
            title: "Peringkat Warga & Lencana Lingkungan",
            leaderboard: rankedList,
            summary,
            filters: { keyword, tier: tierFilter },
            currentUser
        });
    } catch (err) {
        console.error("Error in /leaderboard:", err);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500 - Kesalahan Server",
            message: "Gagal memuat papan peringkat warga: " + err.message
        });
    }
});

module.exports = router;
