// ================================================================
// DATABASE CONFIG - APLIKASI SAMPAH TERINTEGRASI
// Sesuai ERD
// ================================================================

require("dotenv").config();

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// ================================================================
// CONFIG
// ================================================================

const config = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "aplikasi_sampah",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    charset: "utf8mb4"
};

let pool = null;

// ================================================================
// TABLE EXISTS
// ================================================================

async function tableExists(tableName) {

    const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM information_schema.tables
        WHERE table_schema = ?
          AND table_name = ?
        `,
        [
            config.database,
            tableName
        ]
    );

    return Number(rows[0]?.total || 0) > 0;
}

// ================================================================
// COLUMN EXISTS
// ================================================================

async function columnExists(tableName, columnName) {

    const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM information_schema.columns
        WHERE table_schema = ?
          AND table_name = ?
          AND column_name = ?
        `,
        [
            config.database,
            tableName,
            columnName
        ]
    );

    return Number(rows[0]?.total || 0) > 0;
}

// ================================================================
// INSTALL SCHEMA
// ================================================================

async function installSchema() {

    const schemaPath = path.join(
        __dirname,
        "../../database/schema.sql"
    );

    if (!fs.existsSync(schemaPath)) {

        throw new Error(
            `File schema.sql tidak ditemukan:\n${schemaPath}`
        );

    }

    const sql = fs.readFileSync(
        schemaPath,
        "utf8"
    );

    /*
     * Schema hanya dipasang ketika tabel users belum ada.
     * Jadi database yang sudah berisi data TIDAK akan di-drop
     * setiap kali npm start.
     */

    const statements = sql
        .split(/;\s*(?:\r?\n|$)/)
        .map(s => s.trim())
        .filter(Boolean);

    for (const statement of statements) {

        const clean = statement
            .replace(/--.*$/gm, "")
            .trim();

        if (!clean) continue;

        try {

            await pool.query(statement);

        } catch (err) {

            /*
             * Beberapa statement seperti DROP VIEW / CREATE VIEW
             * dapat bergantung pada urutan schema.
             */

            console.error(
                "\nGagal menjalankan SQL:"
            );

            console.error(statement.substring(0, 300));

            throw err;

        }

    }

}

// ================================================================
// VALIDATE DATABASE
// ================================================================

async function validateSchema() {

    /*
     * PENTING:
     *
     * collection_requests menggunakan:
     *
     * address
     *
     * BUKAN:
     *
     * pickup_address
     *
     *
     * sales juga TIDAK mempunyai seller_id.
     *
     */

    const required = {

        // ----------------------------------------------------------
        // USERS
        // ----------------------------------------------------------

        users: [
            "id",
            "username",
            "email",
            "password_hash",
            "full_name",
            "phone",
            "address",
            "photo_url",
            "status",
            "wallet_balance",
            "email_verified_at",
            "last_login_at",
            "created_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // ROLES
        // ----------------------------------------------------------

        roles: [
            "id",
            "name",
            "display_name",
            "description",
            "is_system",
            "status",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // USER ROLES
        // ----------------------------------------------------------

        user_roles: [
            "id",
            "user_id",
            "role_id",
            "created_at"
        ],

        // ----------------------------------------------------------
        // PERMISSIONS
        // ----------------------------------------------------------

        permissions: [
            "id",
            "code",
            "name",
            "module",
            "description",
            "is_menu",
            "parent_id",
            "icon",
            "sort_order",
            "status",
            "created_at",
            "updated_at"
        ],

        // ----------------------------------------------------------
        // ROLE PERMISSIONS
        // ----------------------------------------------------------

        role_permissions: [
            "id",
            "role_id",
            "permission_id",
            "created_at"
        ],

        // ----------------------------------------------------------
        // COMPANIES
        // ----------------------------------------------------------

        companies: [
            "id",
            "name",
            "address",
            "phone",
            "email",
            "logo_url",
            "tax_number",
            "status",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // WASTE TYPES
        // ----------------------------------------------------------

        waste_types: [
            "id",
            "code",
            "name",
            "category",
            "unit",
            "price_per_unit",
            "treatment_method",
            "is_hazardous",
            "description",
            "status",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // BUYERS
        // ----------------------------------------------------------

        buyers: [
            "id",
            "name",
            "phone",
            "email",
            "address",
            "company",
            "type",
            "npwp",
            "status",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // COLLECTION REQUESTS
        // ----------------------------------------------------------

        collection_requests: [
            "id",
            "code",
            "user_id",
            "company_id",

            // !!! INI YANG BENAR !!!
            "address",

            "latitude",
            "longitude",
            "scheduled_date",
            "scheduled_time",
            "request_note",
            "status",
            "rejected_reason",
            "assigned_to",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // COLLECTION ITEMS
        // ----------------------------------------------------------

        collection_items: [
            "id",
            "collection_id",
            "waste_type_id",
            "weight",
            "price_per_unit",
            "subtotal",
            "notes",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // SALES
        // ----------------------------------------------------------

        sales: [
            "id",
            "code",
            "collection_id",
            "buyer_id",
            "total_weight",
            "total_amount",
            "status",
            "payment_status",
            "paid_at",
            "notes",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // WALLET TRANSACTIONS
        // ----------------------------------------------------------

        wallet_transactions: [
            "id",
            "user_id",
            "type",
            "amount",
            "reference_type",
            "reference_id",
            "description",
            "status",
            "updated_at",
            "created_at"
        ],

        // ----------------------------------------------------------
        // NOTIFICATIONS
        // ----------------------------------------------------------

        notifications: [
            "id",
            "user_id",
            "actor_user_id",
            "type",
            "title",
            "message",
            "icon",
            "reference_type",
            "reference_id",
            "is_read",
            "read_at",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // DOCUMENTS
        // ----------------------------------------------------------

        documents: [
            "id",
            "reference_type",
            "reference_id",
            "document_type",
            "file_name",
            "file_path",
            "mime_type",
            "file_size",
            "uploaded_by",
            "is_primary",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // WITHDRAWAL
        // ----------------------------------------------------------

        withdrawal_requests: [
            "id",
            "user_id",
            "amount",
            "bank_name",
            "account_number",
            "account_name",
            "status",
            "rejected_reason",
            "requested_at",
            "processed_at",
            "created_at",
            "updated_at",
            "deleted_at"
        ],

        // ----------------------------------------------------------
        // ACTIVITY LOGS
        // ----------------------------------------------------------

        activity_logs: [
            "id",
            "user_id",
            "action",
            "description",
            "ip_address",
            "created_at"
        ]

    };

    // ============================================================
    // CHECK TABLE + COLUMN
    // ============================================================

    for (const [table, columns] of Object.entries(required)) {

        const exists = await tableExists(table);

        if (!exists) {

            throw new Error(
                `Tabel "${table}" belum ada. ` +
                `Silakan import database/aplikasi_sampah.sql terlebih dahulu.`
            );

        }

        const [rows] = await pool.query(
            `
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = ?
              AND table_name = ?
            `,
            [
                config.database,
                table
            ]
        );

        const existingColumns = new Set(
            rows.map(row => row.column_name)
        );

        const missing = columns.filter(
            column => !existingColumns.has(column)
        );

        if (missing.length > 0) {

            throw new Error(
                `Struktur tabel "${table}" tidak sesuai ERD. ` +
                `Kolom kurang: ${missing.join(", ")}`
            );

        }

    }

    console.log("✓ Struktur database ERD valid");

}

// ================================================================
// INIT DATABASE
// ================================================================

async function initDatabase() {

    let serverConnection = null;

    try {

        // ----------------------------------------------------------
        // CONNECT WITHOUT DATABASE
        // ----------------------------------------------------------

        serverConnection = await mysql.createConnection({

            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password

        });

        // ----------------------------------------------------------
        // CREATE DATABASE IF NOT EXISTS
        // ----------------------------------------------------------

        const databaseName = config.database
            .replace(/`/g, "");

        await serverConnection.query(
            `
            CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
            CHARACTER SET utf8mb4
            COLLATE utf8mb4_unicode_ci
            `
        );

        await serverConnection.end();

        serverConnection = null;

        // ----------------------------------------------------------
        // CREATE POOL
        // ----------------------------------------------------------

        pool = mysql.createPool(config);

        // ----------------------------------------------------------
        // TEST
        // ----------------------------------------------------------

        await pool.query("SELECT 1");

        console.log(
            `✓ Terhubung ke database: ${config.database}`
        );

        // ----------------------------------------------------------
        // INSTALL SCHEMA ONLY IF EMPTY
        // ----------------------------------------------------------

        const usersExists = await tableExists("users");

        if (!usersExists) {

            console.log(
                "✓ Database belum memiliki tabel."
            );

            console.log(
                "✓ Memasang schema ERD..."
            );

            await installSchema();

        }

        // ----------------------------------------------------------
        // VALIDATE
        // ----------------------------------------------------------

        await validateSchema();

        return pool;

    } catch (error) {

        if (serverConnection) {

            try {

                await serverConnection.end();

            } catch (_) {}

        }

        if (pool) {

            try {

                await pool.end();

            } catch (_) {}

        }

        pool = null;

        throw error;

    }

}

// ================================================================
// GET POOL
// ================================================================

function getPool() {

    if (!pool) {

        throw new Error(
            "Database pool belum diinisialisasi."
        );

    }

    return pool;

}

// ================================================================
// EXPORT
// ================================================================

module.exports = {

    initDatabase,
    getPool

};