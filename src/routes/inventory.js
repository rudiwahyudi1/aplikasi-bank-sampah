const express = require("express");
const { getPool } = require("../config/db");
const { hasPermission } = require("../middleware/auth");
const { page, limit, clean, num } = require("./_helpers");

const router = express.Router();

// GET /inventory
router.get("/", hasPermission("inventory.read"), async (req, res) => {
    try {
        const db = getPool();
        const keyword = clean(req.query.keyword);
        const category = clean(req.query.category);

        let p = page(req.query.page);
        let l = limit(req.query.limit);

        // Fetch waste types with dynamic stock calculation
        // Stock in: collection_items from completed collections + inventory logs (in) + adjustment positive
        // Stock out: sales items + processing inputs + inventory logs (out)
        const [wasteStocks] = await db.query(
            `SELECT wt.id, wt.code, wt.name, wt.category, wt.unit, wt.price_per_unit, wt.status,
                COALESCE((
                    SELECT SUM(ci.weight) 
                    FROM collection_items ci 
                    JOIN collection_requests cr ON cr.id = ci.collection_id 
                    WHERE ci.waste_type_id = wt.id AND cr.status = 'selesai' AND ci.deleted_at IS NULL
                ), 0) AS total_collected,
                COALESCE((
                    SELECT SUM(il.quantity) 
                    FROM waste_inventory_logs il 
                    WHERE il.waste_type_id = wt.id AND il.type = 'in' AND il.reference_type != 'collection'
                ), 0) AS manual_in,
                COALESCE((
                    SELECT SUM(il.quantity) 
                    FROM waste_inventory_logs il 
                    WHERE il.waste_type_id = wt.id AND il.type = 'out'
                ), 0) AS total_out,
                COALESCE((
                    SELECT SUM(il.quantity) 
                    FROM waste_inventory_logs il 
                    WHERE il.waste_type_id = wt.id AND il.type = 'adjustment'
                ), 0) AS total_adjustment
             FROM waste_types wt
             WHERE wt.deleted_at IS NULL
             ORDER BY wt.category ASC, wt.name ASC`
        );

        // Compute net stock and status for each item
        let grandTotalWeight = 0;
        let grandTotalValue = 0;
        let readyCount = 0;

        const inventoryList = wasteStocks.map(item => {
            const collected = Number(item.total_collected || 0);
            const manualIn = Number(item.manual_in || 0);
            const out = Number(item.total_out || 0);
            const adj = Number(item.total_adjustment || 0);
            const netStock = Math.max(0, (collected + manualIn + adj) - out);
            const estimatedValue = netStock * Number(item.price_per_unit || 0);

            grandTotalWeight += netStock;
            grandTotalValue += estimatedValue;
            if (netStock > 10) readyCount++;

            let stockStatus = "empty";
            let stockBadge = "bg-secondary";
            let stockLabel = "Kosong";

            if (netStock > 50) {
                stockStatus = "abundant";
                stockBadge = "bg-success";
                stockLabel = "Siap Jual (Banyak)";
            } else if (netStock > 10) {
                stockStatus = "ready";
                stockBadge = "bg-primary";
                stockLabel = "Tersedia";
            } else if (netStock > 0) {
                stockStatus = "low";
                stockBadge = "bg-warning text-dark";
                stockLabel = "Menipis";
            }

            return {
                ...item,
                netStock,
                estimatedValue,
                stockStatus,
                stockBadge,
                stockLabel
            };
        });

        // Filter inventoryList in memory if keyword or category is present
        const filteredInventory = inventoryList.filter(item => {
            let match = true;
            if (keyword) {
                const kw = keyword.toLowerCase();
                match = item.name.toLowerCase().includes(kw) || item.code.toLowerCase().includes(kw);
            }
            if (match && category && category !== "semua") {
                match = item.category === category;
            }
            return match;
        });

        // Fetch recent inventory mutation logs
        const [logs] = await db.query(
            `SELECT il.*, wt.name AS waste_name, wt.unit AS waste_unit, u.full_name AS recorder_name
             FROM waste_inventory_logs il
             JOIN waste_types wt ON wt.id = il.waste_type_id
             LEFT JOIN users u ON u.id = il.recorded_by
             ORDER BY il.created_at DESC
             LIMIT 15`
        );

        const canManage = req.session.user.role === "superadmin" || (req.session.permissions && req.session.permissions.includes("inventory.manage"));

        res.render("inventory/index", {
            layout: "layout/layout",
            title: "Gudang & Stok Sampah",
            currentUrl: "/inventory",
            inventory: filteredInventory,
            logs,
            summary: {
                total_weight: grandTotalWeight,
                total_value: grandTotalValue,
                ready_types: readyCount,
                total_types: inventoryList.length
            },
            filters: { keyword, category },
            canManage
        });
    } catch (e) {
        console.error("INVENTORY ERROR:", e);
        res.status(500).render("error", {
            layout: "layout/layout",
            title: "500",
            message: "Gagal memuat inventori gudang: " + e.message
        });
    }
});

// POST /inventory/adjust (Stock Opname)
router.post("/adjust", hasPermission("inventory.manage"), async (req, res) => {
    try {
        const db = getPool();
        const waste_type_id = num(req.body.waste_type_id);
        const adjustment_type = clean(req.body.type); // 'in', 'out', 'adjustment'
        const quantity = num(req.body.quantity);
        const notes = clean(req.body.notes) || "Penyesuaian stok gudang / Stock Opname";

        if (!waste_type_id || quantity <= 0) {
            throw new Error("Pilih jenis sampah dan masukkan jumlah berat (> 0 kg).");
        }

        await db.query(
            `INSERT INTO waste_inventory_logs 
             (waste_type_id, type, quantity, reference_type, notes, recorded_by) 
             VALUES (?, ?, ?, 'manual', ?, ?)`,
            [waste_type_id, adjustment_type, quantity, notes, req.session.user.id]
        );

        req.flash("success", "Penyesuaian stok (Stock Opname) berhasil dicatat!");
    } catch (e) {
        req.flash("error", e.message);
    }
    res.redirect("/inventory");
});

module.exports = router;
