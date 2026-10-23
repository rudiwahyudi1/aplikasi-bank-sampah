#!/usr/bin/env node
/**
 * Database CLI Tool
 * Aplikasi Bank Sampah Terintegrasi
 */

require("dotenv").config();
const { initDatabase, getPool } = require("../src/config/db");

async function main() {
    const action = process.argv[2] || "status";

    console.log("==========================================");
    console.log("  BANK SAMPAH - DATABASE CLI TOOL");
    console.log("==========================================");

    try {
        await initDatabase();
        const db = getPool();

        if (action === "ping") {
            const start = Date.now();
            const [rows] = await db.query("SELECT VERSION() AS version, NOW() AS now");
            const duration = Date.now() - start;
            console.log(`✓ Status   : Terhubung (${duration} ms)`);
            console.log(`✓ Versi DB : ${rows[0].version}`);
            console.log(`✓ Waktu DB : ${rows[0].now}`);
        } else if (action === "status") {
            const [tables] = await db.query(
                "SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name",
                [process.env.DB_NAME || "aplikasi_sampah"]
            );

            console.log(`\nDatabase: ${process.env.DB_NAME || "aplikasi_sampah"} (${tables.length} tabel ditemukan)\n`);
            console.log("------------------------------------------");
            console.log(" Nama Tabel                 | Est. Baris ");
            console.log("------------------------------------------");
            tables.forEach(t => {
                const name = t.table_name || t.TABLE_NAME;
                const rows = t.table_rows || t.TABLE_ROWS || 0;
                console.log(` ${name.padEnd(26)} | ${String(rows).padStart(10)}`);
            });
            console.log("------------------------------------------");
        } else if (action === "check-admin") {
            const [users] = await db.query(
                "SELECT u.id, u.username, u.email, u.full_name, r.name AS role FROM users u LEFT JOIN roles r ON r.id = u.role_id WHERE u.username = 'admin'"
            );
            if (users.length > 0) {
                console.log("✓ Akun Superadmin ditemukan:", users[0]);
            } else {
                console.warn("⚠️ Akun admin belum ditemukan.");
            }
        } else {
            console.log(`Perintah tidak dikenal: '${action}'`);
            console.log("Pilihan yang tersedia: ping | status | check-admin");
        }
    } catch (err) {
        console.error("❌ Gagal terhubung ke database:", err.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();
