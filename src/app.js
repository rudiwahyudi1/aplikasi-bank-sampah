// ================================================================
// APLIKASI SAMPAH TERINTEGRASI
// EXPRESS APP
// ================================================================

require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ================================================================
// DATABASE
// ================================================================

const { initDatabase, getPool } = require("./config/db");

// ================================================================
// APP
// ================================================================

const app = express();

const PORT = Number(process.env.PORT || 5000);

// ================================================================
// VIEW ENGINE EJS
// ================================================================

app.set(
    "views",
    path.join(__dirname, "views")
);

app.set(
    "view engine",
    "ejs"
);

// ================================================================
// EJS LAYOUT
// ================================================================

app.use(layouts);

app.set(
    "layout",
    "layout/layout"
);

// ================================================================
// BASIC CONFIG & SECURITY HEADERS
// ================================================================

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    message: "Terlalu banyak percobaan login. Silakan coba kembali beberapa saat lagi."
});

app.use("/login", loginLimiter);

// ================================================================
// BODY PARSER
// ================================================================

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);

app.use(
    express.json({
        limit: "10mb"
    })
);

// ================================================================
// METHOD OVERRIDE
// ================================================================

app.use(
    methodOverride("_method")
);

// ================================================================
// STATIC
// ================================================================

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

// ================================================================
// SESSION
// ================================================================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "sampah-terintegrasi-secret-2026",

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,

            maxAge:
                1000 *
                60 *
                60 *
                8
        }
    })
);

app.use((req, res, next) => {
    req.flash = function (type, message) {
        req.session.flash = {
            type,
            message
        };
    };

    res.locals.flash = req.session.flash || null;

    delete req.session.flash;

    next();
});

// ================================================================
// GLOBAL VARIABLES
// ================================================================

const { formatDate, formatDateTime, formatRupiah, formatWeight } = require("./routes/_exportHelper");

app.use(
    async (req, res, next) => {

        res.locals.user =
            req.session.user || null;

        res.locals.permissions =
            req.session.permissions || [];

        res.locals.currentPath =
            req.path;

        res.locals.appName =
            process.env.APP_NAME ||
            "Aplikasi Sampah Terintegrasi";

        res.locals.formatDate = formatDate;
        res.locals.formatDateTime = formatDateTime;
        res.locals.formatRupiah = formatRupiah;
        res.locals.formatWeight = formatWeight;

        next();

    }
);

// ================================================================
// AUTH
// ================================================================

const authRoutes =
    require("./routes/auth");

app.use(
    "/",
    authRoutes
);

// ================================================================
// DASHBOARD
// ================================================================

try {

    const dashboardRoutes =
        require("./routes/dashboard");

    app.use(
        "/dashboard",
        dashboardRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/dashboard.js tidak digunakan."
    );

}

// ================================================================
// WASTE
// ================================================================

try {

    const wasteRoutes =
        require("./routes/waste");

    app.use(
        "/waste",
        wasteRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/waste.js tidak ditemukan."
    );

}

// ================================================================
// COLLECTION
// ================================================================

try {

    const collectionRoutes =
        require("./routes/collection");

    app.use(
        "/collection",
        collectionRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/collection.js tidak ditemukan."
    );

}

// ================================================================
// SALES
// ================================================================

try {

    const salesRoutes =
        require("./routes/sales");

    app.use(
        "/sales",
        salesRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/sales.js tidak ditemukan."
    );

}

// ================================================================
// ADMIN
// ================================================================

try {

    const adminRoutes =
        require("./routes/admin");

    app.use(
        "/admin",
        adminRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/admin.js tidak ditemukan."
    );

}

// ================================================================
// COMPANIES
// ================================================================

try {

    const companyRoutes =
        require("./routes/companies");

    app.use(
        "/companies",
        companyRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/companies.js tidak ditemukan."
    );

}

// ================================================================
// BUYERS
// ================================================================

try {

    const buyerRoutes =
        require("./routes/buyers");

    app.use(
        "/buyers",
        buyerRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/buyers.js tidak ditemukan."
    );

}

// ================================================================
// WALLET
// ================================================================

try {

    const walletRoutes =
        require("./routes/wallet");

    app.use(
        "/wallet",
        walletRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/wallet.js tidak ditemukan."
    );

}

// ================================================================
// WITHDRAWALS
// ================================================================

try {

    const withdrawalRoutes =
        require("./routes/withdrawals");

    app.use(
        "/withdrawals",
        withdrawalRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/withdrawals.js tidak ditemukan."
    );

}

// ================================================================
// REPORTS
// ================================================================

try {

    const reportRoutes =
        require("./routes/reports");

    app.use(
        "/reports",
        reportRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/reports.js tidak ditemukan."
    );

}

// ================================================================
// DOCUMENTS
// ================================================================

try {

    const documentRoutes =
        require("./routes/documents");

    app.use(
        "/documents",
        documentRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/documents.js tidak ditemukan."
    );

}

// ================================================================
// ACTIVITY
// ================================================================

try {

    const activityRoutes =
        require("./routes/activity");

    app.use(
        "/activity",
        activityRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/activity.js tidak ditemukan."
    );

}

// ================================================================
// NOTIFICATIONS
// ================================================================

try {

    const notificationRoutes =
        require("./routes/notifications");

    app.use(
        "/notifications",
        notificationRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/notifications.js tidak ditemukan."
    );

}

// ================================================================
// LIVE CHAT
// ================================================================

try {

    const chatRoutes =
        require("./routes/chat");

    app.use(
        "/chat",
        chatRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/chat.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// PENGOLAHAN & DAUR ULANG
// ================================================================

try {

    const processingRoutes =
        require("./routes/processing");

    app.use(
        "/processing",
        processingRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/processing.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// POS DROP POINT & SETOR MANDIRI
// ================================================================

try {

    const dropPointRoutes =
        require("./routes/dropPoints");

    app.use(
        "/drop-points",
        dropPointRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/dropPoints.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// INVENTORI GUDANG & STOK
// ================================================================

try {

    const inventoryRoutes =
        require("./routes/inventory");

    app.use(
        "/inventory",
        inventoryRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/inventory.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// REWARDS & TUKAR SEMBAKO
// ================================================================

try {

    const rewardRoutes =
        require("./routes/rewards");

    app.use(
        "/rewards",
        rewardRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/rewards.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// EDUKASI & PANDUAN 3R
// ================================================================

try {

    const educationRoutes =
        require("./routes/education");

    app.use(
        "/education",
        educationRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/education.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// JADWAL & RUTE WILAYAH
// ================================================================

try {

    const scheduleRoutes =
        require("./routes/schedules");

    app.use(
        "/schedules",
        scheduleRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/schedules.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// PENGADUAN & LAPOR SAMPAH LIAR
// ================================================================

try {

    const complaintRoutes =
        require("./routes/complaints");

    app.use(
        "/complaints",
        complaintRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/complaints.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// KALKULATOR & DAMPAK LINGKUNGAN
// ================================================================

try {

    const calculatorRoutes =
        require("./routes/calculator");

    app.use(
        "/calculator",
        calculatorRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/calculator.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// KARTU ANGGOTA DIGITAL & DIREKTORI NASABAH
// ================================================================

try {

    const memberRoutes =
        require("./routes/members");

    app.use(
        "/members",
        memberRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/members.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// PERINGKAT WARGA & LENCANA LINGKUNGAN
// ================================================================

try {

    const leaderboardRoutes =
        require("./routes/leaderboard");

    app.use(
        "/leaderboard",
        leaderboardRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/leaderboard.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// PENGATURAN PROFIL & PARAMETER BANK SAMPAH
// ================================================================

try {

    const settingRoutes =
        require("./routes/settings");

    app.use(
        "/settings",
        settingRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/settings.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// PAPAN HARGA SAMPAH & TIPS PILAH
// ================================================================

try {

    const priceRoutes =
        require("./routes/prices");

    app.use(
        "/prices",
        priceRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/prices.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// BIAYA OPERASIONAL & KAS KECIL
// ================================================================

try {

    const expenseRoutes =
        require("./routes/expenses");

    app.use(
        "/expenses",
        expenseRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/expenses.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// PROFIL PENGGUNA & REKENING PEMBAYARAN
// ================================================================

try {

    const profileRoutes =
        require("./routes/profile");

    app.use(
        "/profile",
        profileRoutes
    );

} catch (err) {

    console.log(
        "INFO: routes/profile.js tidak ditemukan atau gagal:",
        err.message
    );

}

// ================================================================
// REALTIME SSE STREAM (SERVER-SENT EVENTS)
// ================================================================

try {
    const realtime = require("./services/realtime");
    app.get("/api/realtime/stream", (req, res) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ success: false, message: "Belum login" });
        }
        realtime.handleStream(req, res);
    });
} catch (err) {
    console.log("INFO: services/realtime.js gagal dimuat:", err.message);
}

// HEALTH CHECK
// ================================================================

app.get(
    "/health",
    async (req, res) => {

        try {

            const db =
                getPool();

            await db.query(
                "SELECT 1"
            );

            res.json({
                success: true,
                database: "connected"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                database: "error",
                message: error.message
            });

        }

    }
);

// ================================================================
// ROOT
// ================================================================

app.get(
    "/",
    (req, res) => {

        if (req.session.user) {

            return res.redirect(
                "/dashboard"
            );

        }

        return res.redirect(
            "/login"
        );

    }
);

// ================================================================
// 404
// ================================================================

app.use(
    (req, res) => {

        res.status(404);

        try {

            return res.render(
                "error",
                {
                    title: "Halaman Tidak Ditemukan",

                    message:
                        "Halaman yang Anda cari tidak ditemukan."
                }
            );

        } catch (error) {

            return res.send(
                `
                <h1>404</h1>
                <p>Halaman tidak ditemukan.</p>
                `
            );

        }

    }
);

// ================================================================
// ERROR HANDLER
// ================================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "\n=================================================="
        );

        console.error(
            "EXPRESS ERROR"
        );

        console.error(
            "=================================================="
        );

        console.error(
            err
        );

        console.error(
            "==================================================\n"
        );

        if (res.headersSent) {

            return next(err);

        }

        const status =
            err.status ||
            500;

        res.status(status);

        try {

            return res.render(
                "error",
                {
                    title: "Terjadi Kesalahan",

                    message:
                        process.env.NODE_ENV === "development"
                            ? err.message
                            : "Terjadi kesalahan pada server."
                }
            );

        } catch (renderError) {

            return res.send(
                `
                <h1>Server Error</h1>
                <p>${err.message}</p>
                `
            );

        }

    }
);

// ================================================================
// START SERVER
// ================================================================

async function startServer() {

    try {

        // ----------------------------------------------------------
        // DATABASE
        // ----------------------------------------------------------

        await initDatabase();

        console.log(
            "✓ Database siap digunakan"
        );

        // ----------------------------------------------------------
        // SERVER
        // ----------------------------------------------------------

        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    "\n=============================================="
                );

                console.log(
                    "  APLIKASI SAMPAH TERINTEGRASI"
                );

                console.log(
                    "=============================================="
                );

                console.log(
                    `✓ Server : http://localhost:${PORT}`
                );

                console.log(
                    `✓ Login  : http://localhost:${PORT}/login`
                );

                console.log(
                    `✓ Health : http://localhost:${PORT}/health`
                );

                console.log(
                    "=============================================="
                );

                console.log(
                    "DEMO ACCOUNT"
                );

                console.log(
                    "ADMIN   : admin / admin123"
                );

                console.log(
                    "NASABAH : nasabah / nasabah123"
                );

                console.log(
                    "==============================================\n"
                );

            }
        );

    } catch (error) {

        console.error(
            "\nDATABASE ERROR:"
        );

        console.error(
            error
        );

        console.error(
            "\nSERVER GAGAL START"
        );

        process.exit(1);

    }

}

// ================================================================
// START
// ================================================================

if (process.env.NODE_ENV !== "test") {
    startServer();
}

// ================================================================
// EXPORT
// ================================================================

app.startServer = startServer;
module.exports = app;
