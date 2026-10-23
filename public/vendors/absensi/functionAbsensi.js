  document.addEventListener("DOMContentLoaded", function () {
    // Badge warna status
    document.querySelectorAll(".status-absen").forEach((cell) => {
      const text = cell.textContent.trim().toLowerCase();
      cell.innerHTML = ""; // kosongkan isi lama

      const badge = document.createElement("span");
      badge.classList.add("badge", "px-3", "py-2", "fw-semibold");

      if (text === "tepat waktu") {
        badge.style.backgroundColor = "#0d6efd"
        badge.textContent = "Tepat Waktu";
      } else if (text === "terlambat") {
        badge.classList.add("bg-warning", "text-dark");
        badge.textContent = "Terlambat";
      } else if (text === "tidak hadir") {
        badge.classList.add("bg-danger");
        badge.textContent = "Tidak Hadir";
      } else {
        badge.classList.add("bg-secondary");
        badge.textContent = text || "-";
      }

      cell.appendChild(badge);
    });

    // ================== FITUR PENCARIAN ==================
    const searchInput = document.getElementById("searchInput");
    const tableRows = document.querySelectorAll("#tabelData tr");
    const noDataMessage = document.getElementById("noDataMessage");

    searchInput.addEventListener("input", function () {
      const keyword = searchInput.value.toLowerCase().trim();
      let visibleCount = 0;

      tableRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(keyword)) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      noDataMessage.classList.toggle("d-none", visibleCount > 0);
    });

    // ================== FITUR DOWNLOAD EXCEL ==================
    const downloadBtn = document.getElementById("downloadExcel");

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const table = document.querySelector("#areaCetak table");
        if (!table) {
          alert("Tabel tidak ditemukan!");
          return;
        }

        try {
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.table_to_sheet(table, { raw: true });
          XLSX.utils.book_append_sheet(wb, ws, "Laporan Absensi");

          const today = new Date();
          const tanggal = today.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replace(/\//g, "-");

          const fileName = `Laporan_Absensi_${tanggal}.xlsx`;
          XLSX.writeFile(wb, fileName);
        } catch (error) {
          console.error("Gagal mengunduh file Excel:", error);
          alert("Terjadi kesalahan saat membuat file Excel.");
        }
      });
    }
  });