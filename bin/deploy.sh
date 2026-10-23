#!/usr/bin/env bash
# ================================================================
# Automated Production Deployment Script
# Aplikasi Bank Sampah Terintegrasi
# ================================================================

set -e

echo "🚀 [Deploy] Memulai update aplikasi..."

# 1. Fetch latest changes from Git
echo "📥 [1/4] Mengambil commit terbaru dari git..."
git fetch origin main
git reset --hard origin/main

# 2. Install production dependencies
echo "📦 [2/4] Menginstall dependencies..."
npm ci --omit=dev

# 3. Jalankan backup database sebelum reload
echo "💾 [3/4] Menjalankan auto-backup database..."
node bin/backup-db.js || true

# 4. Reload proses di PM2
echo "🔄 [4/4] Melakukan reload zero-downtime aplikasi via PM2..."
if command -v pm2 >/dev/null 2>&1; then
    pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
    echo "✅ PM2 reload berhasil!"
else
    echo "⚠️ PM2 tidak terdeteksi. Silakan restart proses Node.js secara manual."
fi

echo "🎉 [Deploy SUKSES] Aplikasi telah diperbarui ke versi terbaru!"
