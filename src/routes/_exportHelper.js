// ================================================================
// EXPORT HELPER (EXCEL .XLSX & PDF PREVIEW)
// Aplikasi Sampah Terintegrasi
// ================================================================

const ExcelJS = require("exceljs");

/**
 * Format angka ke Rupiah string
 */
function formatRupiah(val) {
    return "Rp " + Number(val || 0).toLocaleString("id-ID");
}

/**
 * Format berat ke kg string
 */
function formatWeight(val) {
    return Number(val || 0).toLocaleString("id-ID", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    }) + " kg";
}

/**
 * Format tanggal Indonesia
 */
function formatDate(dateVal) {
    if (!dateVal) return "-";
    try {
        const d = new Date(dateVal);
        if (Number.isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    } catch (_) {
        return String(dateVal);
    }
}

/**
 * Format datetime Indonesia
 */
function formatDateTime(dateVal) {
    if (!dateVal) return "-";
    try {
        const d = new Date(dateVal);
        if (Number.isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch (_) {
        return String(dateVal);
    }
}

/**
 * Buat Excel Workbook Penjualan dengan Styling Premium
 */
async function generateSalesExcel({ title, periodText, rows, summary }) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Aplikasi Sampah Terintegrasi";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Transaksi Penjualan", {
        pageSetup: {
            orientation: "landscape",
            paperSize: 9, // A4
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0
        },
        views: [{ showGridLines: true }]
    });

    // Color Palette
    const primaryGreen = "166534"; // Header dark green
    const accentGreen = "15803d";
    const lightGreen = "E9F8EF";
    const zebraRowColor = "F9FAFB";
    const borderColor = "D1D5DB";

    // 1. Title Banner
    sheet.mergeCells("A1:K1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "APLIKASI SAMPAH TERINTEGRASI";
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + primaryGreen }
    };
    sheet.getRow(1).height = 36;

    // Subtitle
    sheet.mergeCells("A2:K2");
    const subCell = sheet.getCell("A2");
    subCell.value = title || "Laporan Transaksi Penjualan";
    subCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    subCell.alignment = { horizontal: "center", vertical: "middle" };
    subCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + accentGreen }
    };
    sheet.getRow(2).height = 24;

    // Periode & Tanggal Cetak
    sheet.mergeCells("A3:K3");
    const metaCell = sheet.getCell("A3");
    metaCell.value = `Periode: ${periodText || "Semua Waktu"}   |   Tanggal Ekspor: ${formatDateTime(new Date())}`;
    metaCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF374151" } };
    metaCell.alignment = { horizontal: "center", vertical: "middle" };
    metaCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + lightGreen }
    };
    sheet.getRow(3).height = 22;

    // Blank row
    sheet.getRow(4).height = 10;

    // 2. Summary KPI Box
    sheet.getCell("B5").value = "Total Transaksi";
    sheet.getCell("B6").value = rows.length;
    sheet.getCell("D5").value = "Total Berat (kg)";
    sheet.getCell("D6").value = summary.totalWeight || 0;
    sheet.getCell("D6").numFmt = '#,##0.000 "kg"';
    sheet.getCell("F5").value = "Total Nilai Penjualan";
    sheet.getCell("F6").value = summary.totalAmount || 0;
    sheet.getCell("F6").numFmt = '"Rp "#,##0';
    sheet.getCell("H5").value = "Total Lunas";
    sheet.getCell("H6").value = summary.paidCount || 0;

    ["B", "D", "F", "H"].forEach(col => {
        sheet.getCell(`${col}5`).font = { bold: true, size: 9, color: { argb: "FF4B5563" } };
        sheet.getCell(`${col}5`).alignment = { horizontal: "center" };
        sheet.getCell(`${col}6`).font = { bold: true, size: 13, color: { argb: "FF111827" } };
        sheet.getCell(`${col}6`).alignment = { horizontal: "center" };
    });
    sheet.getRow(5).height = 18;
    sheet.getRow(6).height = 24;

    sheet.getRow(7).height = 10;

    // 3. Table Header
    const headers = [
        "No",
        "Kode Transaksi",
        "Kode Pickup",
        "Nasabah",
        "Pembeli / Buyer",
        "Berat Total",
        "Total Nilai",
        "Status Transaksi",
        "Metode Pembayaran",
        "Bank",
        "Tanggal Transaksi"
    ];

    const headerRow = sheet.getRow(8);
    headerRow.values = headers;
    headerRow.height = 28;

    headerRow.eachCell((cell, colNumber) => {
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF" + primaryGreen }
        };
        cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "medium", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF" + borderColor } },
            right: { style: "thin", color: { argb: "FF" + borderColor } }
        };
    });

    // 4. Data Rows
    let currentRowIndex = 9;
    rows.forEach((r, idx) => {
        const row = sheet.getRow(currentRowIndex);
        row.values = [
            idx + 1,
            r.code || "-",
            r.collection_code || "-",
            r.nasabah_name || "-",
            r.buyer_name || "-",
            Number(r.total_weight || 0),
            Number(r.total_amount || 0),
            (r.status || "-").toUpperCase(),
            r.payment_method ? (r.payment_method === "transfer_bank" ? "Transfer Bank" : r.payment_method) : "-",
            r.bank_name ? r.bank_name.toUpperCase() : "-",
            formatDateTime(r.created_at)
        ];

        row.height = 22;

        const isZebra = idx % 2 === 1;
        const rowBg = isZebra ? zebraRowColor : "FFFFFF";

        row.eachCell((cell, colNumber) => {
            cell.font = { name: "Calibri", size: 10 };
            cell.border = {
                top: { style: "thin", color: { argb: "FF" + borderColor } },
                bottom: { style: "thin", color: { argb: "FF" + borderColor } },
                left: { style: "thin", color: { argb: "FF" + borderColor } },
                right: { style: "thin", color: { argb: "FF" + borderColor } }
            };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF" + rowBg }
            };

            // Formatting
            if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 8 || colNumber === 10) {
                cell.alignment = { horizontal: "center", vertical: "middle" };
            } else if (colNumber === 6) {
                cell.numFmt = '#,##0.000 "kg"';
                cell.alignment = { horizontal: "right", vertical: "middle" };
            } else if (colNumber === 7) {
                cell.numFmt = '"Rp "#,##0';
                cell.alignment = { horizontal: "right", vertical: "middle" };
            } else {
                cell.alignment = { horizontal: "left", vertical: "middle" };
            }
        });

        currentRowIndex++;
    });

    // 5. Total Summary Row
    const totalRow = sheet.getRow(currentRowIndex);
    totalRow.getCell(1).value = "TOTAL KESELURUHAN";
    sheet.mergeCells(`A${currentRowIndex}:E${currentRowIndex}`);
    totalRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    totalRow.getCell(1).font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF111827" } };

    // Weight Total
    totalRow.getCell(6).value = Number(summary.totalWeight || 0);
    totalRow.getCell(6).numFmt = '#,##0.000 "kg"';
    totalRow.getCell(6).font = { bold: true };
    totalRow.getCell(6).alignment = { horizontal: "right", vertical: "middle" };

    // Amount Total
    totalRow.getCell(7).value = Number(summary.totalAmount || 0);
    totalRow.getCell(7).numFmt = '"Rp "#,##0';
    totalRow.getCell(7).font = { bold: true, color: { argb: "FF" + primaryGreen } };
    totalRow.getCell(7).alignment = { horizontal: "right", vertical: "middle" };

    totalRow.height = 26;

    for (let c = 1; c <= 11; c++) {
        const cell = totalRow.getCell(c);
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF" + lightGreen }
        };
        cell.border = {
            top: { style: "medium", color: { argb: "FF000000" } },
            bottom: { style: "double", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF" + borderColor } },
            right: { style: "thin", color: { argb: "FF" + borderColor } }
        };
    }

    // Column widths
    sheet.columns = [
        { key: "no", width: 6 },
        { key: "code", width: 20 },
        { key: "col_code", width: 18 },
        { key: "nasabah", width: 24 },
        { key: "buyer", width: 22 },
        { key: "weight", width: 16 },
        { key: "amount", width: 18 },
        { key: "status", width: 16 },
        { key: "method", width: 18 },
        { key: "bank", width: 14 },
        { key: "date", width: 20 }
    ];

    return workbook;
}

/**
 * Buat Excel Workbook Pengumpulan Sampah dengan Styling Premium
 */
async function generateCollectionExcel({ title, periodText, rows, summary }) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Aplikasi Sampah Terintegrasi";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Pengumpulan Sampah", {
        pageSetup: {
            orientation: "landscape",
            paperSize: 9, // A4
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0
        },
        views: [{ showGridLines: true }]
    });

    const primaryGreen = "166534";
    const accentGreen = "15803d";
    const lightGreen = "E9F8EF";
    const zebraRowColor = "F9FAFB";
    const borderColor = "D1D5DB";

    // 1. Title Banner
    sheet.mergeCells("A1:J1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "APLIKASI SAMPAH TERINTEGRASI";
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + primaryGreen }
    };
    sheet.getRow(1).height = 36;

    sheet.mergeCells("A2:J2");
    const subCell = sheet.getCell("A2");
    subCell.value = title || "Rekapitulasi Pengumpulan Sampah";
    subCell.font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    subCell.alignment = { horizontal: "center", vertical: "middle" };
    subCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + accentGreen }
    };
    sheet.getRow(2).height = 24;

    sheet.mergeCells("A3:J3");
    const metaCell = sheet.getCell("A3");
    metaCell.value = `Periode: ${periodText || "Semua Waktu"}   |   Tanggal Ekspor: ${formatDateTime(new Date())}`;
    metaCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF374151" } };
    metaCell.alignment = { horizontal: "center", vertical: "middle" };
    metaCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF" + lightGreen }
    };
    sheet.getRow(3).height = 22;

    sheet.getRow(4).height = 10;

    // KPI box
    sheet.getCell("B5").value = "Total Permintaan";
    sheet.getCell("B6").value = rows.length;
    sheet.getCell("D5").value = "Total Berat (kg)";
    sheet.getCell("D6").value = summary.totalWeight || 0;
    sheet.getCell("D6").numFmt = '#,##0.000 "kg"';
    sheet.getCell("F5").value = "Total Nilai Sampah";
    sheet.getCell("F6").value = summary.totalValue || 0;
    sheet.getCell("F6").numFmt = '"Rp "#,##0';
    sheet.getCell("H5").value = "Selesai";
    sheet.getCell("H6").value = summary.completedCount || 0;

    ["B", "D", "F", "H"].forEach(col => {
        sheet.getCell(`${col}5`).font = { bold: true, size: 9, color: { argb: "FF4B5563" } };
        sheet.getCell(`${col}5`).alignment = { horizontal: "center" };
        sheet.getCell(`${col}6`).font = { bold: true, size: 13, color: { argb: "FF111827" } };
        sheet.getCell(`${col}6`).alignment = { horizontal: "center" };
    });
    sheet.getRow(5).height = 18;
    sheet.getRow(6).height = 24;

    sheet.getRow(7).height = 10;

    const headers = [
        "No",
        "Kode Pickup",
        "Nasabah",
        "Alamat",
        "Perusahaan",
        "Petugas Pengumpul",
        "Jadwal Pickup",
        "Berat Total",
        "Nilai Sampah",
        "Status"
    ];

    const headerRow = sheet.getRow(8);
    headerRow.values = headers;
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF" + primaryGreen }
        };
        cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "medium", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF" + borderColor } },
            right: { style: "thin", color: { argb: "FF" + borderColor } }
        };
    });

    let currentRowIndex = 9;
    rows.forEach((r, idx) => {
        const row = sheet.getRow(currentRowIndex);
        row.values = [
            idx + 1,
            r.code || "-",
            r.full_name || "-",
            r.address || "-",
            r.company_name || "-",
            r.collector_name || "-",
            r.scheduled_date ? `${formatDate(r.scheduled_date)} ${r.scheduled_time || ""}` : "-",
            Number(r.total_weight || 0),
            Number(r.total_value || 0),
            (r.status || "-").toUpperCase()
        ];
        row.height = 22;

        const isZebra = idx % 2 === 1;
        const rowBg = isZebra ? zebraRowColor : "FFFFFF";

        row.eachCell((cell, colNumber) => {
            cell.font = { name: "Calibri", size: 10 };
            cell.border = {
                top: { style: "thin", color: { argb: "FF" + borderColor } },
                bottom: { style: "thin", color: { argb: "FF" + borderColor } },
                left: { style: "thin", color: { argb: "FF" + borderColor } },
                right: { style: "thin", color: { argb: "FF" + borderColor } }
            };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF" + rowBg }
            };

            if (colNumber === 1 || colNumber === 2 || colNumber === 7 || colNumber === 10) {
                cell.alignment = { horizontal: "center", vertical: "middle" };
            } else if (colNumber === 8) {
                cell.numFmt = '#,##0.000 "kg"';
                cell.alignment = { horizontal: "right", vertical: "middle" };
            } else if (colNumber === 9) {
                cell.numFmt = '"Rp "#,##0';
                cell.alignment = { horizontal: "right", vertical: "middle" };
            } else {
                cell.alignment = { horizontal: "left", vertical: "middle" };
            }
        });

        currentRowIndex++;
    });

    // Total Row
    const totalRow = sheet.getRow(currentRowIndex);
    totalRow.getCell(1).value = "TOTAL KESELURUHAN";
    sheet.mergeCells(`A${currentRowIndex}:G${currentRowIndex}`);
    totalRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    totalRow.getCell(1).font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF111827" } };

    totalRow.getCell(8).value = Number(summary.totalWeight || 0);
    totalRow.getCell(8).numFmt = '#,##0.000 "kg"';
    totalRow.getCell(8).font = { bold: true };
    totalRow.getCell(8).alignment = { horizontal: "right", vertical: "middle" };

    totalRow.getCell(9).value = Number(summary.totalValue || 0);
    totalRow.getCell(9).numFmt = '"Rp "#,##0';
    totalRow.getCell(9).font = { bold: true, color: { argb: "FF" + primaryGreen } };
    totalRow.getCell(9).alignment = { horizontal: "right", vertical: "middle" };

    totalRow.height = 26;

    for (let c = 1; c <= 10; c++) {
        const cell = totalRow.getCell(c);
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF" + lightGreen }
        };
        cell.border = {
            top: { style: "medium", color: { argb: "FF000000" } },
            bottom: { style: "double", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF" + borderColor } },
            right: { style: "thin", color: { argb: "FF" + borderColor } }
        };
    }

    sheet.columns = [
        { key: "no", width: 6 },
        { key: "code", width: 18 },
        { key: "nasabah", width: 22 },
        { key: "address", width: 28 },
        { key: "company", width: 20 },
        { key: "collector", width: 20 },
        { key: "schedule", width: 22 },
        { key: "weight", width: 16 },
        { key: "value", width: 18 },
        { key: "status", width: 16 }
    ];

    return workbook;
}

/**
 * Generate Excel Mutasi Dompet / Wallet
 */
async function generateWalletExcel({ title, periodText, rows = [], summary = {} }) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Aplikasi Sampah Terintegrasi";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Mutasi Dompet", {
        views: [{ showGridLines: true }],
        pageSetup: { orientation: "portrait", paperSize: 9 }
    });

    const primaryGreen = "047857";
    const lightGreen = "ECFDF5";
    const borderColor = "D1D5DB";

    // Title
    sheet.mergeCells("A1:G1");
    const tCell = sheet.getCell("A1");
    tCell.value = (title || "Laporan Mutasi Dompet Digital").toUpperCase();
    tCell.font = { name: "Calibri", size: 15, bold: true, color: { argb: "FF" + primaryGreen } };
    tCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 30;

    // Period
    sheet.mergeCells("A2:G2");
    const pCell = sheet.getCell("A2");
    pCell.value = `Periode: ${periodText || "Semua Waktu"} | Dicetak: ${formatDateTime(new Date())}`;
    pCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF4B5563" } };
    pCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(2).height = 20;

    // Headers
    const headers = ["No", "Tanggal & Waktu", "Nama Pengguna", "Tipe", "Nominal", "Keterangan", "Status"];
    const headerRow = sheet.addRow(headers);
    headerRow.height = 26;

    headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + primaryGreen } };
        cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "medium", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF" + borderColor } },
            right: { style: "thin", color: { argb: "FF" + borderColor } }
        };
    });

    let currentRow = 4;
    rows.forEach((r, idx) => {
        const isCredit = r.type === "credit";
        const sign = isCredit ? "+ " : "- ";
        const typeLabel = isCredit ? "Pemasukan (Kredit)" : "Pengeluaran (Debit)";
        const row = sheet.addRow([
            idx + 1,
            formatDateTime(r.created_at),
            r.full_name || r.username || "-",
            typeLabel,
            Number(r.amount || 0),
            r.description || "-",
            (r.status || "success").toUpperCase()
        ]);
        row.height = 22;

        const isEven = idx % 2 === 1;
        const bgArgb = isEven ? "FF" + lightGreen : "FFFFFFFF";

        row.eachCell((cell, colNum) => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } };
            cell.border = {
                top: { style: "thin", color: { argb: "FF" + borderColor } },
                bottom: { style: "thin", color: { argb: "FF" + borderColor } },
                left: { style: "thin", color: { argb: "FF" + borderColor } },
                right: { style: "thin", color: { argb: "FF" + borderColor } }
            };
            cell.font = { name: "Calibri", size: 10 };

            if (colNum === 1) cell.alignment = { horizontal: "center", vertical: "middle" };
            else if (colNum === 2) cell.alignment = { horizontal: "center", vertical: "middle" };
            else if (colNum === 4) {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: isCredit ? "FF16A34A" : "FFDC2626" } };
            }
            else if (colNum === 5) {
                cell.alignment = { horizontal: "right", vertical: "middle" };
                cell.numFmt = '"' + sign + 'Rp "#,##0';
                cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: isCredit ? "FF16A34A" : "FFDC2626" } };
            }
            else if (colNum === 7) cell.alignment = { horizontal: "center", vertical: "middle" };
            else cell.alignment = { horizontal: "left", vertical: "middle" };
        });
        currentRow++;
    });

    // Summary Row
    const totalRow = sheet.addRow([
        "TOTAL KREDIT: " + formatRupiah(summary.totalCredit || 0) + "  |  TOTAL DEBIT: " + formatRupiah(summary.totalDebit || 0),
        "", "", "",
        Number((summary.totalCredit || 0) - (summary.totalDebit || 0)),
        "", ""
    ]);
    sheet.mergeCells(`A${currentRow}:D${currentRow}`);
    totalRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    totalRow.getCell(1).font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF111827" } };

    totalRow.getCell(5).numFmt = '"Saldo Bersih: Rp "#,##0';
    totalRow.getCell(5).font = { bold: true, color: { argb: "FF" + primaryGreen } };
    totalRow.getCell(5).alignment = { horizontal: "right", vertical: "middle" };
    sheet.mergeCells(`E${currentRow}:G${currentRow}`);
    totalRow.height = 26;

    for (let c = 1; c <= 7; c++) {
        const cell = totalRow.getCell(c);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + lightGreen } };
        cell.border = {
            top: { style: "medium", color: { argb: "FF000000" } },
            bottom: { style: "double", color: { argb: "FF000000" } }
        };
    }

    sheet.columns = [
        { key: "no", width: 6 },
        { key: "date", width: 22 },
        { key: "user", width: 22 },
        { key: "type", width: 20 },
        { key: "amount", width: 20 },
        { key: "desc", width: 32 },
        { key: "status", width: 14 }
    ];

    return workbook;
}

/**
 * Generate Excel Laporan Analitik & Monitoring
 */
async function generateReportsExcel({ title, periodText, byWaste = [], byCompany = [], stats = {} }) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Aplikasi Sampah Terintegrasi";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Rekap Sampah", {
        views: [{ showGridLines: true }],
        pageSetup: { orientation: "portrait", paperSize: 9 }
    });

    const primaryGreen = "047857";
    const lightGreen = "ECFDF5";
    const borderColor = "D1D5DB";

    // Title
    sheet.mergeCells("A1:E1");
    const tCell = sheet.getCell("A1");
    tCell.value = (title || "Laporan & Monitoring Pengelolaan Sampah").toUpperCase();
    tCell.font = { name: "Calibri", size: 15, bold: true, color: { argb: "FF" + primaryGreen } };
    tCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 30;

    // Period
    sheet.mergeCells("A2:E2");
    const pCell = sheet.getCell("A2");
    pCell.value = `Periode: ${periodText || "Semua Waktu"} | Dicetak: ${formatDateTime(new Date())}`;
    pCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF4B5563" } };
    pCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(2).height = 20;

    // KPI Box
    sheet.mergeCells("A4:E4");
    sheet.getCell("A4").value = `RINGKASAN KPI: Total Penjemputan: ${stats.collections || 0} | Selesai: ${stats.completed || 0} | Total Berat: ${formatWeight(stats.weight || 0)} | Total Nilai Sampah: ${formatRupiah(stats.value || 0)} | Omset Penjualan: ${formatRupiah(stats.sales_value || 0)}`;
    sheet.getCell("A4").font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF065F46" } };
    sheet.getCell("A4").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + lightGreen } };
    sheet.getCell("A4").alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(4).height = 24;

    // Waste Table Header
    sheet.mergeCells("A6:E6");
    sheet.getCell("A6").value = "1. REKAPITULASI BERDASARKAN JENIS & KATEGORI SAMPAH";
    sheet.getCell("A6").font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF111827" } };
    sheet.getRow(6).height = 22;

    const wHeaders = ["No", "Jenis Sampah", "Kategori", "Total Berat (kg)", "Total Nilai Ekonomi (Rp)"];
    const wHeaderRow = sheet.addRow(wHeaders);
    wHeaderRow.height = 24;
    wHeaderRow.eachCell(cell => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + primaryGreen } };
        cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    byWaste.forEach((w, idx) => {
        const row = sheet.addRow([
            idx + 1,
            w.name || "-",
            (w.category || "-").toUpperCase(),
            Number(w.weight || 0),
            Number(w.value || 0)
        ]);
        row.height = 20;
        row.getCell(1).alignment = { horizontal: "center" };
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(4).numFmt = '#,##0.000 "kg"';
        row.getCell(4).alignment = { horizontal: "right" };
        row.getCell(5).numFmt = '"Rp "#,##0';
        row.getCell(5).alignment = { horizontal: "right" };
        row.eachCell(c => {
            c.border = {
                top: { style: "thin", color: { argb: "FF" + borderColor } },
                bottom: { style: "thin", color: { argb: "FF" + borderColor } },
                left: { style: "thin", color: { argb: "FF" + borderColor } },
                right: { style: "thin", color: { argb: "FF" + borderColor } }
            };
        });
    });

    sheet.columns = [
        { key: "no", width: 6 },
        { key: "col2", width: 26 },
        { key: "col3", width: 20 },
        { key: "col4", width: 22 },
        { key: "col5", width: 26 }
    ];

    return workbook;
}

module.exports = {
    generateSalesExcel,
    generateCollectionExcel,
    generateWalletExcel,
    generateReportsExcel,
    formatRupiah,
    formatWeight,
    formatDate,
    formatDateTime
};
