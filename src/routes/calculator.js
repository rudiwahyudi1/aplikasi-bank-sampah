const express = require("express");
const { getPool } = require("../config/db");
const { clean } = require("./_helpers");

const router = express.Router();

// Helper to determine ecological factors based on category or waste name
function getEcoFactors(category = "", name = "") {
    const cat = category.toLowerCase();
    const nm = name.toLowerCase();

    if (cat.includes("plastik") || nm.includes("plastik") || nm.includes("botol") || nm.includes("gelas")) {
        return { co2: 1.5, tree: 0.002, label: "Plastik Daur Ulang", icon: "bi-cup-straw" };
    }
    if (cat.includes("kertas") || cat.includes("karton") || nm.includes("kertas") || nm.includes("kardus") || nm.includes("arsip")) {
        return { co2: 1.2, tree: 0.017, label: "Kertas & Kardus", icon: "bi-newspaper" };
    }
    if (cat.includes("logam") || cat.includes("besi") || nm.includes("besi") || nm.includes("kaleng") || nm.includes("tembaga") || nm.includes("aluminium")) {
        return { co2: 4.0, tree: 0.005, label: "Logam & Kaleng", icon: "bi-hammer" };
    }
    if (cat.includes("kaca") || nm.includes("kaca") || nm.includes("beling")) {
        return { co2: 0.3, tree: 0.001, label: "Kaca & Beling", icon: "bi-disc" };
    }
    if (cat.includes("organik") || nm.includes("organik") || nm.includes("daun") || nm.includes("makanan") || nm.includes("sayur")) {
        return { co2: 0.5, tree: 0.0008, label: "Kompos Organik", icon: "bi-flower1" };
    }
    if (cat.includes("elektronik") || nm.includes("elektronik") || nm.includes("baterai") || nm.includes("hp")) {
        return { co2: 3.5, tree: 0.008, label: "Limbah Elektronik (E-Waste)", icon: "bi-cpu" };
    }

    return { co2: 1.1, tree: 0.002, label: "Anorganik Lainnya", icon: "bi-recycle" };
}

// GET /calculator
router.get("/", async (req, res) => {
    try {
        const db = getPool();
        const categoryFilter = clean(req.query.category);
        const keyword = clean(req.query.keyword);

        let where = ["deleted_at IS NULL", "status = 'active'"];
        let params = [];

        if (categoryFilter) {
            where.push("category = ?");
            params.push(categoryFilter);
        }
        if (keyword) {
            where.push("(name LIKE ? OR code LIKE ? OR description LIKE ?)");
            params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
        }

        const [wasteTypes] = await db.query(
            `SELECT * FROM waste_types WHERE ${where.join(" AND ")} ORDER BY category ASC, price_per_unit DESC`,
            params
        );

        // Summary metrics
        const [[summary]] = await db.query(`
            SELECT 
                COUNT(*) AS total_types,
                COALESCE(AVG(price_per_unit), 0) AS avg_price,
                COALESCE(MAX(price_per_unit), 0) AS max_price,
                COUNT(DISTINCT category) AS total_categories
            FROM waste_types
            WHERE deleted_at IS NULL AND status = 'active'
        `);

        // Distinct categories for filter dropdown
        const [categories] = await db.query(`
            SELECT DISTINCT category 
            FROM waste_types 
            WHERE deleted_at IS NULL AND status = 'active' 
            ORDER BY category ASC
        `);

        // Attach eco factors to each item
        const itemsWithEco = wasteTypes.map(w => {
            const eco = getEcoFactors(w.category, w.name);
            const estPoints = Math.floor(Number(w.price_per_unit || 0) / 100);
            return {
                ...w,
                co2_factor: eco.co2,
                tree_factor: eco.tree,
                eco_label: eco.label,
                eco_icon: eco.icon,
                est_points: estPoints
            };
        });

        res.render("calculator/index", {
            layout: "layout/layout",
            title: "Kalkulator & Dampak Lingkungan",
            wasteTypes: itemsWithEco,
            categories: categories.map(c => c.category),
            summary: summary || { total_types: 0, avg_price: 0, max_price: 0, total_categories: 0 },
            filters: { category: categoryFilter, keyword },
            user: req.session.user || null
        });
    } catch (err) {
        console.error("Error in /calculator:", err);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500 - Kesalahan Server",
            message: "Gagal memuat kalkulator sampah: " + err.message
        });
    }
});

module.exports = router;
