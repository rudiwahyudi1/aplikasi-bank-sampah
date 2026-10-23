// Idle timeout in milliseconds: 15 menit (900.000 ms)
const MAX_IDLE_TIME_MS = 15 * 60 * 1000;

function checkSessionActivity(req, res) {
    // 1. Anti-caching headers agar back button browser setelah logout tidak menampilkan data tersimpan
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    // 2. Cek apakah session dan user ada
    if (!req.session || !req.session.user) {
        if (req.xhr || req.headers.accept?.includes("application/json") || req.path.startsWith("/api/")) {
            res.status(401).json({ success: false, message: "Sesi tidak valid atau belum login", code: "UNAUTHORIZED" });
            return false;
        }
        res.redirect("/login");
        return false;
    }

    // 3. Cek apakah session sudah idle terlalu lama
    const now = Date.now();
    const lastActivity = req.session.lastActivity || now;

    if (now - lastActivity > MAX_IDLE_TIME_MS) {
        console.log(`[AUTH] Session timeout untuk user: ${req.session.user.username || req.session.user.id} (Idle > 15m)`);
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            if (req.xhr || req.headers.accept?.includes("application/json") || req.path.startsWith("/api/")) {
                res.status(401).json({ success: false, message: "Sesi telah berakhir karena tidak ada aktivitas", code: "SESSION_TIMEOUT" });
            } else {
                res.redirect("/login?timeout=1");
            }
        });
        return false;
    }

    // 4. Perbarui waktu aktivitas terakhir
    req.session.lastActivity = now;
    return true;
}

function auth(req, res, next) {
    if (!checkSessionActivity(req, res)) {
        return;
    }
    next();
}


/* =========================================================
   CEK PERMISSION
========================================================= */

function hasPermission(code) {

    return (req, res, next) => {

        if (!checkSessionActivity(req, res)) {
            return;
        }

        const user = req.session?.user || {};

        const role = String(
            user.role || ""
        ).trim();


        /*
         * Pastikan permissions selalu ARRAY.
         *
         * Prioritas:
         * 1. req.session.permissions
         * 2. req.session.user.permissions
         * 3. []
         */
        const permissions =
            Array.isArray(req.session?.permissions)
                ? req.session.permissions
                : (
                    Array.isArray(user.permissions)
                        ? user.permissions
                        : []
                );


        /* =================================================
           SUPERADMIN
        ================================================= */

        if (
            role === "superadmin" ||
            permissions.includes("*")
        ) {
            return next();
        }


        /* =================================================
           ADMIN PENGELOLA / OPERATOR
           
           Operator kamu login sebagai:
           
           ROLE: admin_pengelola
           
           Izinkan akses withdrawals.
        ================================================= */

        if (
            role === "admin_pengelola" &&
            (
                code === "withdrawals" ||
                code === "withdrawals.view" ||
                code === "withdrawals.read" ||
                code === "drop_points.read" ||
                code === "drop_points.manage"
            )
        ) {

            return next();
        }

        if (
            role === "petugas_pengumpulan" &&
            (
                code === "drop_points.read" ||
                code === "drop_points.manage" ||
                code === "inventory.manage"
            )
        ) {

            return next();
        }

        if (
            role === "nasabah" &&
            (
                code === "withdrawal.read" ||
                code === "drop_points.read"
            )
        ) {

            return next();
        }


        /* =================================================
           PERMISSION DATABASE
        ================================================= */

        if (
            permissions.includes(code)
        ) {

            return next();
        }


        /* =================================================
           DEBUG
        ================================================= */

        console.log(
            "========================================"
        );

        console.log(
            "[ACCESS DENIED]"
        );

        console.log(
            "USER       :",
            user.username || "-"
        );

        console.log(
            "ROLE       :",
            role || "-"
        );

        console.log(
            "REQUEST     :",
            req.originalUrl
        );

        console.log(
            "PERMISSION :",
            code
        );

        console.log(
            "SESSION PERMISSIONS:",
            permissions
        );

        console.log(
            "========================================"
        );


        /* =================================================
           FORBIDDEN
        ================================================= */

        return res.status(403).render(
            "error",
            {
                layout: "layout/layout",
                title: "Akses Ditolak",
                message:
                    "Anda tidak memiliki hak akses untuk menu ini."
            }
        );
    };
}


module.exports = {
    auth,
    hasPermission
};