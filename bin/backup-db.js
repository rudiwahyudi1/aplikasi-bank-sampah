#!/usr/bin/env node
/**
 * Automated Database Backup Utility
 * Aplikasi Bank Sampah Terintegrasi
 */

require("dotenv").config();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const host = process.env.DB_HOST || "127.0.0.1";
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "aplikasi_sampah";

const backupDir = path.join(__dirname, "../backups");
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, "-");
const filename = `backup-${database}-${timestamp}.sql`;
const filepath = path.join(backupDir, filename);

const passwordFlag = password ? `-p"${password}"` : "";
const cmd = `mysqldump -h ${host} -P ${port} -u ${user} ${passwordFlag} ${database} > "${filepath}"`;

console.log(`[Backup] Memulai backup database '${database}'...`);

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`[Backup ERROR]: ${error.message}`);
        return process.exit(1);
    }

    const stats = fs.statSync(filepath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`[Backup SUKSES] File tersimpan di: ${filepath} (${sizeKB} KB)`);

    // Rotasi: Simpan maksimal 7 file backup terbaru
    try {
        const files = fs.readdirSync(backupDir)
            .filter(f => f.startsWith(`backup-${database}-`) && f.endsWith(".sql"))
            .map(f => ({
                name: f,
                time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        const MAX_BACKUPS = 7;
        if (files.length > MAX_BACKUPS) {
            const filesToDelete = files.slice(MAX_BACKUPS);
            filesToDelete.forEach(file => {
                const p = path.join(backupDir, file.name);
                fs.unlinkSync(p);
                console.log(`[Rotasi Backup] Menghapus backup lama: ${file.name}`);
            });
        }
    } catch (cleanErr) {
        console.warn(`[Peringatan Rotasi]: ${cleanErr.message}`);
    }
});
