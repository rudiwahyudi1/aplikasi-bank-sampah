require("dotenv").config();

const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function resetAdmin() {
    let connection;

    try {
        console.log("");
        console.log("==========================================");
        console.log(" RESET ADMIN - APLIKASI SAMPAH");
        console.log("==========================================");

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_NAME || "aplikasi_sampah"
        });

        console.log("✓ Berhasil terhubung ke database");

        /*
         * =====================================================
         * 1. BUAT / PASTIKAN ROLE SUPERADMIN
         * =====================================================
         */

        let [roles] = await connection.query(
            `
            SELECT id, name
            FROM roles
            WHERE LOWER(name) IN ('superadmin', 'super admin')
            LIMIT 1
            `
        );

        let roleId;

        if (roles.length === 0) {
            console.log("Role SUPERADMIN belum ada. Membuat...");

            const [roleResult] = await connection.query(
                `
                INSERT INTO roles
                (name)
                VALUES ('superadmin')
                `
            );

            roleId = roleResult.insertId;

            console.log(
                `✓ Role SUPERADMIN dibuat dengan ID ${roleId}`
            );
        } else {
            roleId = roles[0].id;

            console.log(
                `✓ Role SUPERADMIN ditemukan. ID: ${roleId}`
            );
        }

        /*
         * =====================================================
         * 2. BUAT HASH PASSWORD BARU
         * =====================================================
         */

        const password = "admin123";

        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        console.log("✓ Password hash berhasil dibuat");

        /*
         * =====================================================
         * 3. CARI USER ADMIN
         * =====================================================
         */

        const [users] = await connection.query(
            `
            SELECT id, username
            FROM users
            WHERE username = 'admin'
            LIMIT 1
            `
        );

        let userId;

        if (users.length === 0) {

            console.log(
                "User admin belum ada. Membuat user admin..."
            );

            const [userResult] = await connection.query(
                `
                INSERT INTO users
                (
                    username,
                    email,
                    password_hash,
                    full_name,
                    phone,
                    address,
                    status,
                    wallet_balance
                )
                VALUES
                (
                    'admin',
                    'admin@aplikasisampah.local',
                    ?,
                    'Administrator Sistem',
                    NULL,
                    NULL,
                    'active',
                    0
                )
                `,
                [passwordHash]
            );

            userId = userResult.insertId;

            console.log(
                `✓ User admin dibuat. ID: ${userId}`
            );

        } else {

            userId = users[0].id;

            console.log(
                `✓ User admin ditemukan. ID: ${userId}`
            );

            /*
             * =================================================
             * 4. RESET PASSWORD ADMIN
             * =================================================
             */

            await connection.query(
                `
                UPDATE users
                SET
                    password_hash = ?,
                    status = 'active',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [
                    passwordHash,
                    userId
                ]
            );

            console.log(
                "✓ Password admin berhasil di-reset"
            );
        }

        /*
         * =====================================================
         * 5. PASTIKAN ADMIN MEMILIKI ROLE
         * =====================================================
         */

        const [userRoles] = await connection.query(
            `
            SELECT user_id, role_id
            FROM user_roles
            WHERE user_id = ?
              AND role_id = ?
            LIMIT 1
            `,
            [
                userId,
                roleId
            ]
        );

        if (userRoles.length === 0) {

            await connection.query(
                `
                INSERT INTO user_roles
                (
                    user_id,
                    role_id
                )
                VALUES (?, ?)
                `,
                [
                    userId,
                    roleId
                ]
            );

            console.log(
                "✓ Role SUPERADMIN diberikan ke admin"
            );

        } else {

            console.log(
                "✓ Admin sudah memiliki role SUPERADMIN"
            );
        }

        /*
         * =====================================================
         * 6. VERIFIKASI PASSWORD
         * =====================================================
         */

        const [check] = await connection.query(
            `
            SELECT password_hash
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [userId]
        );

        const valid = await bcrypt.compare(
            password,
            check[0].password_hash
        );

        console.log("");

        console.log("==========================================");

        if (valid) {
            console.log(" ✓ PASSWORD BERHASIL DIVERIFIKASI");
        } else {
            console.log(" ✗ PASSWORD TIDAK VALID");
        }

        console.log("==========================================");

        console.log("");
        console.log("LOGIN ADMIN:");
        console.log("");
        console.log("Username : admin");
        console.log("Password : admin123");
        console.log("");

    } catch (error) {

        console.error("");
        console.error("==========================================");
        console.error(" RESET ADMIN GAGAL");
        console.error("==========================================");
        console.error(error);
        console.error("");

    } finally {

        if (connection) {
            await connection.end();
        }
    }
}

resetAdmin();