// ================================================================
// WHATSAPP NOTIFICATION SERVICE & DEEP LINK GENERATOR
// Aplikasi Bank Sampah Terintegrasi
// ================================================================

/**
 * Format nomor telepon Indonesia menjadi format internasional (misal: 08123 -> 628123)
 */
function formatPhoneNumber(phone) {
    if (!phone) return "";
    let cleaned = String(phone).replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.slice(1);
    } else if (cleaned.startsWith("8")) {
        cleaned = "62" + cleaned;
    }
    return cleaned;
}

/**
 * Menghasilkan link WhatsApp (Click-to-Chat)
 */
function createWhatsAppLink(phone, message) {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone) return "";
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Template notifikasi untuk berbagai event operasional
 */
const templates = {
    pickupAccepted: ({ nasabahName, requestCode, officerName, scheduleDate }) => {
        return (
            `🌱 *BANK SAMPAH TERINTEGRASI*\n\n` +
            `Halo *${nasabahName}*,\n` +
            `Permintaan penjemputan sampah Anda (*#${requestCode}*) telah *DISETUJUI*.\n\n` +
            `👤 Petugas Armada : ${officerName || "Petugas Lapangan"}\n` +
            `📅 Jadwal Jemput   : ${scheduleDate || "Hari Ini"}\n\n` +
            `Mohon siapkan sampah yang telah dipilah. Terima kasih atas partisipasi Anda menjaga lingkungan bersih!`
        );
    },

    pickupCompleted: ({ nasabahName, requestCode, totalWeight, totalAmount, currentBalance }) => {
        return (
            `💰 *SETORAN SAMPAH BERHASIL*\n\n` +
            `Halo *${nasabahName}*,\n` +
            `Setoran sampah Anda (*#${requestCode}*) telah selesai ditimbang dan divalidasi.\n\n` +
            `⚖️ Total Berat : ${totalWeight}\n` +
            `💵 Tambahan Saldo : ${totalAmount}\n` +
            (currentBalance ? `💳 Saldo Tabungan : ${currentBalance}\n\n` : `\n`) +
            `Cek riwayat tabungan Anda di dashboard aplikasi. Terima kasih!`
        );
    },

    withdrawalApproved: ({ nasabahName, amount, bankName, accountNumber }) => {
        return (
            `💸 *PENARIKAN SALDO BERHASIL*\n\n` +
            `Halo *${nasabahName}*,\n` +
            `Permohonan penarikan saldo tabungan Anda sebesar *${amount}* telah *SELESAI DIPROSES*.\n\n` +
            `🏦 Bank/Tujuan : ${bankName || "-"}\n` +
            `🔢 No. Rekening: ${accountNumber || "-"}\n\n` +
            `Dana telah dikirimkan ke rekening tujuan. Terima kasih!`
        );
    },

    complaintUpdate: ({ userName, ticketNumber, status, feedback }) => {
        return (
            `📢 *STATUS PENGADUAN / LAPORAN*\n\n` +
            `Halo *${userName}*,\n` +
            `Laporan/pengaduan Anda (*#${ticketNumber}*) saat ini berstatus: *${status.toUpperCase()}*.\n\n` +
            `💬 Catatan Petugas: ${feedback || "Sedang ditindaklanjuti oleh tim lapangan."}\n\n` +
            `Terima kasih atas kepedulian Anda terhadap kebersihan lingkungan.`
        );
    }
};

/**
 * Mengirim pesan WhatsApp via Gateway HTTP jika terkonfigurasi di .env
 * (Mendukung Fonnte / generic API gateway)
 */
async function sendWhatsAppMessage(phone, message) {
    const formattedPhone = formatPhoneNumber(phone);
    const token = process.env.WA_API_TOKEN || process.env.FONNTE_TOKEN;
    const apiUrl = process.env.WA_API_URL || "https://api.fonnte.com/send";

    if (!token || !formattedPhone) {
        // Fallback jika belum pasang API Token gateway
        return {
            success: false,
            fallbackUrl: createWhatsAppLink(phone, message),
            reason: "API gateway token not configured. Use fallbackUrl."
        };
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                target: formattedPhone,
                message: message
            })
        });

        const data = await response.json();
        return {
            success: true,
            data
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            fallbackUrl: createWhatsAppLink(phone, message)
        };
    }
}

module.exports = {
    formatPhoneNumber,
    createWhatsAppLink,
    templates,
    sendWhatsAppMessage
};
