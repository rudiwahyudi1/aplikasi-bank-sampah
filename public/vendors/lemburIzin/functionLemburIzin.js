document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // PREVIEW FOTO INPUT
  // =========================
  window.previewFoto = function (event) {
    const input = event.target;
    const preview = document.getElementById('previewImage');

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = e => {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  // =========================
  // PREVIEW MODAL GAMBAR
  // =========================
  window.setPreview = function (src) {
    document.getElementById("previewImg").src = src;
  };

  // =========================
  // APPROVE IZIN (TOGGLE)
  // =========================

    window.toggleIzin = async function (id) {
    const btn = document.getElementById(`btn-status-${id}`);
    const container = document.getElementById("alertContainer");

    // ALERT LOADING
    container.innerHTML = `
        <div class="alert alert-info d-flex align-items-center" role="alert">
        <div class="spinner-border spinner-border-sm me-2"></div>
        Memproses persetujuan izin...
        </div>
    `;

    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
    btn.disabled = true;

    try {
        const res = await fetch(`/admin_Hrd/lembur_izin/approve/${id}`, {
        method: "POST"
        });

        const result = await res.json();

        if (result.success) {
        // UPDATE BUTTON
        btn.classList.remove("btn-info");
        btn.classList.add("btn-success");
        btn.innerHTML = `<i class="bi bi-check-circle"></i> Disetujui`;

        // ALERT SUCCESS
        container.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Berhasil!</strong> Izin telah disetujui.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // AUTO HILANG
        setTimeout(() => {
            container.innerHTML = "";
        }, 2000);

        } else {
        throw new Error(result.message);
        }

    } catch (err) {
        btn.classList.remove("btn-info");
        btn.classList.add("btn-danger");
        btn.innerHTML = `<i class="bi bi-x-circle"></i> Gagal`;
        btn.disabled = false;

        // ALERT ERROR
        container.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error!</strong> ${err.message || "Gagal approve izin."}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        `;
    }
    };

  // =========================
  // SEARCH TABLE
  // =========================
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      let filter = this.value.toLowerCase();
      let rows = document.querySelectorAll("#izinTable tbody tr.data-row");
      let visibleCount = 0;

      rows.forEach(row => {
        let text = row.innerText.toLowerCase();

        if (text.includes(filter)) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      let noData = document.getElementById("noDataMessage");

      if (visibleCount === 0) {
        noData.classList.remove("d-none");
      } else {
        noData.classList.add("d-none");
      }
    });
  }

});