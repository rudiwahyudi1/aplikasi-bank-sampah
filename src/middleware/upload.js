// ================================================================
// UPLOAD MIDDLEWARE - MULTER CONFIGURATION
// Aplikasi Sampah Terintegrasi
// ================================================================

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan direktori upload tersedia
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Storage untuk Foto Pengumpulan Sampah
const collectionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetDir = path.join(__dirname, "../../public/uploads/collections");
        ensureDir(targetDir);
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueName = `pickup-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
        cb(null, uniqueName);
    }
});

// Storage untuk Bukti Pembayaran / Transfer Penjualan
const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetDir = path.join(__dirname, "../../public/uploads/payments");
        ensureDir(targetDir);
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `payment-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
        cb(null, uniqueName);
    }
});

// Filter file: hanya gambar dan PDF
const fileFilter = (req, file, cb) => {
    const allowedMime = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf"
    ];

    if (allowedMime.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Format file tidak didukung. Harap unggah file gambar (JPG, PNG, WEBP) atau PDF."), false);
    }
};

// Batas ukuran 5MB
const limits = {
    fileSize: 5 * 1024 * 1024
};

const uploadCollection = multer({
    storage: collectionStorage,
    fileFilter,
    limits
});

const uploadPayment = multer({
    storage: paymentStorage,
    fileFilter,
    limits
});

// Storage untuk Dokumen Umum & Bukti
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetDir = path.join(__dirname, "../../public/uploads/documents");
        ensureDir(targetDir);
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `doc-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
        cb(null, uniqueName);
    }
});

const uploadDocument = multer({
    storage: documentStorage,
    fileFilter,
    limits
});

// Storage untuk Lampiran Chat (Gambar & Dokumen)
const chatStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetDir = path.join(__dirname, "../../public/uploads/chat");
        ensureDir(targetDir);
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `chat-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
        cb(null, uniqueName);
    }
});

const uploadChat = multer({
    storage: chatStorage,
    fileFilter,
    limits
});

// Storage untuk Foto Pengaduan Sampah Liar
const complaintStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetDir = path.join(__dirname, "../../public/uploads/complaints");
        ensureDir(targetDir);
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `aduan-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
        cb(null, uniqueName);
    }
});

const uploadComplaint = multer({
    storage: complaintStorage,
    fileFilter,
    limits
});

module.exports = {
    uploadCollection,
    uploadPayment,
    uploadDocument,
    uploadChat,
    uploadComplaint
};


