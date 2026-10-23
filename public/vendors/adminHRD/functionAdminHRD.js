   $(document).ready(function () {
      $('.table-data').DataTable({
        scrollX: true,
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
          paginate: {
            previous: "Sebelumnya",
            next: "Berikutnya"
          },
          lengthMenu: "Tampilkan _MENU_ data per halaman",
          zeroRecords: "Tidak ada data ditemukan",
          info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
          infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
          search: "Cari:"
        }
      });


      // ====== 2. Isi Tahun Otomatis ======
      const tahunSekarang = document.getElementById("tahunSekarang");
      if (tahunSekarang) {
        tahunSekarang.textContent = new Date().getFullYear();
      }

      // ====== 3. Export PDF ======
      const btnPDF = document.getElementById('exportPDF');
      if (btnPDF) {
        btnPDF.addEventListener('click', function () {
          const { jsPDF } = window.jspdf;
          const area = document.getElementById('areaCetak');

          if (!area) {
            alert('Elemen areaCetak tidak ditemukan.');
            return;
          }

          html2canvas(area, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = canvas.height * imgWidth / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
            pdf.autoPrint();
            window.open(pdf.output('bloburl'), '_blank');
          }).catch(err => {
            console.error('Gagal mencetak PDF:', err);
            alert('Gagal mencetak PDF. Pastikan elemen yang akan dicetak benar.');
          });
        });
      }

      // ====== 4. Export CSV ======
      const btnCSV = document.getElementById('exportCSV');
      if (btnCSV) {
        btnCSV.addEventListener('click', function () {
          let table = document.querySelector("#tableUnit");
          if (!table) return;

          let rows = table.querySelectorAll("tr");
          let csv = [];
          rows.forEach(row => {
            let cols = row.querySelectorAll("td, th");
            let data = Array.from(cols).map(col => `"${col.innerText}"`).join(",");
            csv.push(data);
          });

          let blob = new Blob([csv.join("\n")], { type: 'text/csv' });
          let link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "Daftar-Unit-Karoseri.csv";
          link.click();
        });
      }

      // ====== 5. Export Excel ======
      const btnExcel = document.getElementById('exportExcel');
      if (btnExcel) {
        btnExcel.addEventListener('click', function () {
          let table = document.querySelector("#tableUnit");
          if (!table) return;

          let html = table.outerHTML;
          let blob = new Blob(["\ufeff" + html], { type: 'application/vnd.ms-excel' });
          let link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = 'Daftar-Unit-Karoseri.xls';
          link.click();
        });
      }

      // ====== 6. Tambah Proses Produksi ke Tabel ======
      const filterUnit = document.getElementById("filterUnit");
      const inputProses = document.getElementById("inputProsesProduksi");
      const btnSimpan = document.getElementById("btnTambahProses");
      const tabelBody = document.getElementById("tabelBody");

      let nomor = 2; // karena baris pertama dianggap sudah ada

      if (filterUnit && inputProses && btnSimpan && tabelBody) {
        // Aktifkan input saat unit dipilih
        filterUnit.addEventListener("change", function () {
          const selected = this.value;
          inputProses.disabled = !selected;
          btnSimpan.disabled = !selected;
          if (!selected) inputProses.value = "";
        });

        // Tambah data ke tabel
        btnSimpan.addEventListener("click", function () {
          const unit = filterUnit.value;
          const proses = inputProses.value.trim();

          if (!unit || !proses) {
            alert("Mohon lengkapi semua kolom.");
            return;
          }

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${nomor++}.</td>
            <td>${unit}</td>
            <td>-</td>
            <td>${proses}</td>
            <td>${new Date().toLocaleDateString("id-ID")}</td>
            <td><span class="badge bg-warning text-dark">Proses</span></td>
            <td>
              <button class="btn btn-info btn-sm mb-1" data-bs-toggle="modal" data-bs-target="#modalDetailRiwayat">
                <i class="bi bi-list-ul me-1"></i> Detail
              </button>
              <button class="btn btn-danger btn-sm mb-1" data-bs-toggle="modal" data-bs-target="#modalHapus">
                <i class="bi bi-trash me-1"></i> Hapus
              </button>
            </td>
          `;

          tabelBody.appendChild(row);

          // Reset form
          inputProses.value = "";
          filterUnit.value = "";
          inputProses.disabled = true;
          btnSimpan.disabled = true;
        });
      }
    });

    function toggleInput() {
      var select = document.getElementById("jenis");
      var input = document.getElementById("jenisLainnya");
      if (select.value === "lainnya") {
        input.style.display = "block";
        input.required = true;
      } else {
        input.style.display = "none";
        input.required = false;
      }
    }

    function tolakPelamar(button) {
      const row = button.closest('tr');
      const statusCell = row.querySelector('.status-cell');
      statusCell.innerHTML = `
        <span class="badge bg-danger">✘ Telah Ditolak</span>
      `;

      // Optional: disable tombol setelah ditolak
      const buttons = row.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.disabled = true;
      });
    }

    function terimaPelamar(button) {
      const row = button.closest('tr');
      const statusCell = row.querySelector('.status-cell');
      statusCell.innerHTML = `
        <span class="badge bg-success">✓ Diterima</span>
      `;

      // Optional: disable tombol setelah diterima
      const buttons = row.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.disabled = true;
      });
    }

  document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector("body");
    const minimized = localStorage.getItem("sidebarMinimized");

    if (minimized === "true") {
      body.classList.add("sidebar-icon-only");
    }

    const toggleButton = document.querySelector('[data-toggle="minimize"]');
    if (toggleButton) {
      toggleButton.addEventListener("click", function () {
        body.classList.toggle("sidebar-icon-only");
        localStorage.setItem("sidebarMinimized", body.classList.contains("sidebar-icon-only"));
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.status-toggle').forEach(function (el) {
      el.addEventListener('click', function () {
        const currentStatus = this.dataset.status;
        let newStatus;

        if (currentStatus === 'Menunggu Persetujuan') {
          newStatus = 'Lembur Disetujui';
        } else if (currentStatus === 'Lembur Disetujui') {
          newStatus = 'Lembur Ditolak';
        } else {
          newStatus = 'Menunggu Persetujuan';
        }

        // update tampilan
        this.innerText = newStatus;
        this.dataset.status = newStatus;

        this.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'text-dark');
        if (newStatus === 'Lembur Disetujui') {
          this.classList.add('bg-success');
        } else if (newStatus === 'Menunggu Persetujuan') {
          this.classList.add('bg-warning', 'text-dark');
        } else {
          this.classList.add('bg-danger');
        }
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.status-cuti').forEach(function (el) {
      el.addEventListener('click', function () {
        const currentStatus = this.dataset.status;
        let newStatus;

        if (currentStatus === 'Menunggu Persetujuan') {
          newStatus = 'Cuti Disetujui';
        } else if (currentStatus === 'Cuti Disetujui') {
          newStatus = 'Cuti Ditolak';
        } else {
          newStatus = 'Menunggu Persetujuan';
        }

        // update tampilan
        this.innerText = newStatus;
        this.dataset.status = newStatus;

        this.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'text-dark');
        if (newStatus === 'Cuti Disetujui') {
          this.classList.add('bg-success');
        } else if (newStatus === 'Menunggu Persetujuan') {
          this.classList.add('bg-warning', 'text-dark');
        } else {
          this.classList.add('bg-danger');
        }
      });
    });
  });

  const ctx = document.getElementById('hrdReportChart').getContext('2d');
  const hrdChart = new Chart(ctx, {
    type: 'bar', // atau 'line', 'pie', dll
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [{
        label: 'Kehadiran',
        data: [120, 130, 125, 140, 135, 138],
        backgroundColor: '#0d6efd'
      }, {
        label: 'Cuti',
        data: [8, 6, 10, 5, 7, 4],
        backgroundColor: '#ffc107'
      }, {
        label: 'Lembur',
        data: [12, 15, 10, 14, 13, 12],
        backgroundColor: '#198754'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Laporan Aktivitas Karyawan (6 Bulan Terakhir)'
        }
      }
    }
  });