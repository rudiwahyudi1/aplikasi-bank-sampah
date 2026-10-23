document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // Fokus input pertama saat modal terbuka
  // ===============================
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('shown.bs.modal', function () {
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    });
  });

  // ===============================
  // Pencarian Nama Departemen
  // ===============================
  const searchDeptInput = document.getElementById('searchDept');
  const noDataMessage = document.getElementById('noDataMessage');

  if (searchDeptInput) {
    searchDeptInput.addEventListener('keyup', function () {


      const filter = this.value.toLowerCase();
      const rows = document.querySelectorAll('#tableDept tbody tr');

      let visibleCount = 0;

      rows.forEach(row => {

        // skip baris "no data manual"
        if (row.classList.contains('no-data')) return;

        const namaDept = row.querySelector('.dept-nama');

        if (namaDept) {
          const text = namaDept.textContent.toLowerCase();

          if (text.includes(filter)) {
            row.style.display = '';
            visibleCount++;
          } else {
            row.style.display = 'none';
          }
        }
      });

      // ===============================
      // Tampilkan / sembunyikan pesan
      // ===============================
      if (noDataMessage) {
        if (visibleCount === 0) {
          noDataMessage.classList.remove('d-none');
        } else {
          noDataMessage.classList.add('d-none');
        }
      }

    });
  }

});