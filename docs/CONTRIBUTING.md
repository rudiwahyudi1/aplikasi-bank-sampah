# Contributing Guide — Aplikasi Bank Sampah Terintegrasi

Terima kasih atas minat Anda untuk berkontribusi! Dokumen ini menetapkan standar dan konvensi yang **wajib** diikuti oleh seluruh kontributor.

---

## Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Setup Lokal](#setup-lokal)
3. [Branching Strategy](#branching-strategy)
4. [Conventional Commits](#conventional-commits)
5. [Pull Request Workflow](#pull-request-workflow)
6. [Code Review Guidelines](#code-review-guidelines)
7. [Standar Kode](#standar-kode)
8. [Testing](#testing)

---

## Prasyarat

Pastikan Anda telah menginstal:

- **Node.js** >= 20.x LTS
- **npm** >= 10.x
- **Docker** >= 24.x & **Docker Compose** >= 2.x
- **MySQL** 8.0 (atau gunakan Docker)
- **Git** >= 2.40

---

## Setup Lokal

```bash
# 1. Clone repository
git clone https://github.com/<org>/aplikasi-bank-sampah.git
cd aplikasi-bank-sampah

# 2. Copy environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi lokal Anda

# 3. Install dependencies
npm install

# 4. Jalankan dengan Docker Compose
docker compose up -d

# 5. Jalankan migration & seed
npm run db:migrate
npm run db:seed

# 6. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## Branching Strategy

Kami menggunakan model branching **GitHub Flow** yang disederhanakan dengan tiga branch utama:

```
main (produksi)
 │
 ├── staging (testing terintegrasi)
 │    │
 │    ├── feature/123-add-pickup-form
 │    ├── feature/456-wallet-transactions
 │    ├── fix/789-jwt-expiration
 │    └── ...
 │
 └── hotfix/critical-security-patch (langsung dari main, jika urgent)
```

### Branch Utama

| Branch | Tujuan | Dilindungi? | Deploy ke |
|---|---|---|---|
| `main` | Kode produksi, siap release | ✅ Ya | Production VPS |
| `staging` | Testing terintegrasi & QA | ✅ Ya | Staging environment |

### Branch Kerja

Semua pengembangan dilakukan di branch terpisah yang dibuat **dari `staging`**.

**Format penamaan:**

```
<tipe>/<nomor-issue>-<deskripsi-singkat>
```

**Contoh:**

| Tipe Branch | Contoh | Keterangan |
|---|---|---|
| `feature/` | `feature/12-pickup-request-form` | Fitur baru berdasarkan issue #12 |
| `fix/` | `fix/45-jwt-token-expired` | Perbaikan bug berdasarkan issue #45 |
| `refactor/` | `refactor/30-extract-auth-service` | Refactoring tanpa perubahan fungsional |
| `docs/` | `docs/8-api-documentation` | Perubahan dokumentasi |
| `ci/` | `ci/6-docker-pipeline` | Perubahan CI/CD |
| `hotfix/` | `hotfix/99-sql-injection-fix` | Perbaikan urgent langsung dari `main` |

### Aturan Branching

1. **Jangan pernah** commit langsung ke `main` atau `staging`.
2. Semua perubahan masuk melalui **Pull Request**.
3. Branch `feature/` dan `fix/` dibuat dari `staging`.
4. Branch `hotfix/` dibuat dari `main` dan di-merge ke `main` + `staging`.
5. Hapus branch setelah PR di-merge.

---

## Conventional Commits

Seluruh commit message **wajib** mengikuti spesifikasi [Conventional Commits v1.0.0](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Tipe Commit

| Type | Deskripsi | Contoh |
|---|---|---|
| `feat` | Fitur baru | `feat(pickup): add collection request form` |
| `fix` | Perbaikan bug | `fix(auth): resolve JWT expiration issue` |
| `docs` | Perubahan dokumentasi | `docs(readme): update installation steps` |
| `style` | Formatting, tanpa perubahan logika | `style(views): fix indentation in dashboard` |
| `refactor` | Refactoring tanpa perubahan fungsional | `refactor(wallet): extract calculation service` |
| `test` | Penambahan/perbaikan test | `test(pickup): add unit tests for status transition` |
| `ci` | Perubahan CI/CD pipeline | `ci(docker): update multi-stage build` |
| `chore` | Maintenance tasks | `chore(deps): update express to v4.19` |
| `perf` | Perbaikan performa | `perf(query): optimize pickup list query with index` |
| `build` | Perubahan build system | `build(tailwind): configure purge for production` |
| `revert` | Revert commit sebelumnya | `revert: revert feat(pickup): add form validation` |

### Scope yang Digunakan

| Scope | Area |
|---|---|
| `auth` | Autentikasi & otorisasi |
| `pickup` | Modul pickup request |
| `collection` | Modul pengumpulan & timbangan |
| `wallet` | Modul wallet & transaksi |
| `b2b` | Modul penjualan ke buyer |
| `notification` | Notifikasi (email, WhatsApp) |
| `payment` | Payment gateway |
| `maps` | Google Maps & GPS |
| `dashboard` | Dashboard & laporan |
| `master-data` | Master data (jenis sampah, harga) |
| `db` | Database, migrations, seeds |
| `docker` | Docker & Docker Compose |
| `api` | REST API endpoints |
| `ui` | User interface |
| `deps` | Dependencies |

### Contoh Commit Messages

```bash
# Fitur baru
feat(pickup): add collection request form with waste type selection

Implement pickup request form allowing nasabah to select waste types,
estimate weight, and schedule preferred pickup date.

Closes #12

# Perbaikan bug
fix(auth): resolve JWT expiration causing premature logout

JWT was using seconds instead of milliseconds for expiration calculation,
causing tokens to expire immediately after creation.

Fixes #45

# Breaking change
feat(api)!: change pickup response structure to include status history

BREAKING CHANGE: The pickup response now includes a nested `statusHistory`
array. Clients relying on the flat structure must be updated.

# CI/CD
ci(docker): update multi-stage build to reduce image size by 60%

Switch from node:18 to node:20-alpine and implement proper layer caching
for node_modules.
```

### Aturan Commit

1. **Subject line** maksimal 72 karakter.
2. Gunakan **imperative mood** ("add feature", bukan "added feature").
3. **Jangan** akhiri subject dengan titik.
4. Pisahkan subject dan body dengan baris kosong.
5. Sertakan **nomor issue** di footer: `Closes #<nomor>` atau `Fixes #<nomor>`.
6. Untuk **breaking changes**, tambahkan `!` setelah type/scope dan jelaskan di footer `BREAKING CHANGE:`.

---

## Pull Request Workflow

### Membuat Pull Request

1. Pastikan branch Anda up-to-date dengan `staging`:
   ```bash
   git checkout staging
   git pull origin staging
   git checkout feature/12-pickup-request-form
   git rebase staging
   ```

2. Push branch dan buat Pull Request di GitHub.

3. Isi template PR:
   ```markdown
   ## Deskripsi
   <!-- Jelaskan perubahan yang dilakukan -->

   ## Tipe Perubahan
   - [ ] 🆕 Fitur baru (non-breaking)
   - [ ] 🐛 Perbaikan bug
   - [ ] 💥 Breaking change
   - [ ] 📝 Dokumentasi
   - [ ] ♻️ Refactoring
   - [ ] 🧪 Testing

   ## Issue Terkait
   Closes #<nomor>

   ## Checklist
   - [ ] Kode mengikuti coding standards proyek
   - [ ] Self-review telah dilakukan
   - [ ] Comment ditambahkan pada kode yang kompleks
   - [ ] Dokumentasi telah diperbarui
   - [ ] Perubahan tidak menghasilkan warning baru
   - [ ] Test telah ditambahkan/diperbarui
   - [ ] Semua test lulus secara lokal
   - [ ] Commit messages mengikuti Conventional Commits

   ## Screenshots (jika ada perubahan UI)
   <!-- Tambahkan screenshot -->
   ```

### Aturan Merge

| Target Branch | Syarat Merge |
|---|---|
| `staging` | Minimal 1 approval + CI lulus |
| `main` | Minimal 2 approvals + CI lulus + QA sign-off |

---

## Code Review Guidelines

### Untuk Reviewer

- Review dalam **24 jam** (hari kerja) setelah PR dibuat.
- Berikan feedback yang **konstruktif dan spesifik**.
- Gunakan GitHub suggestion blocks untuk perubahan kecil.
- Approve hanya jika yakin kode siap di-merge.

### Untuk Author

- PR harus **kecil dan fokus** (idealnya < 400 baris perubahan).
- Jelaskan **konteks dan alasan** di deskripsi PR, bukan hanya "apa" yang berubah.
- Responsif terhadap review comments.
- Jangan force-push setelah review dimulai kecuali diminta.

---

## Standar Kode

### JavaScript / Node.js

- **ESLint** untuk linting — konfigurasi sudah disediakan di `.eslintrc.js`.
- **Prettier** untuk formatting — konfigurasi di `.prettierrc`.
- Gunakan **async/await** — hindari callback pyramid.
- Gunakan **const** secara default, **let** jika perlu reassign, **jangan** gunakan **var**.
- Nama variabel dan fungsi menggunakan **camelCase**.
- Nama class menggunakan **PascalCase**.
- Nama konstanta global menggunakan **UPPER_SNAKE_CASE**.
- Nama file menggunakan **kebab-case** (contoh: `pickup-controller.js`).

### SQL / Database

- Nama tabel menggunakan **snake_case** dan **plural** (contoh: `pickup_requests`).
- Nama kolom menggunakan **snake_case** (contoh: `created_at`).
- Primary key selalu `id` (unsigned integer, auto-increment).
- Foreign key mengikuti format `<tabel_singular>_id` (contoh: `user_id`).
- Selalu gunakan **migration** untuk perubahan skema — jangan edit database langsung.

### EJS Templates

- Gunakan **layout dan partials** untuk menghindari duplikasi.
- Pisahkan logika dari template — template hanya untuk presentasi.
- Escape semua user input dengan `<%= %>` (default EJS escaping).

---

## Testing

### Struktur Test

```
tests/
├── unit/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── integration/
│   ├── routes/
│   └── database/
└── fixtures/
    └── test-data.js
```

### Menjalankan Test

```bash
# Semua test
npm test

# Dengan coverage
npm run test:coverage

# Watch mode (development)
npm run test:watch

# Test spesifik
npm test -- --grep "pickup"
```

### Aturan Testing

1. Setiap fitur baru **wajib** disertai unit test.
2. Target coverage minimal **80%** untuk business logic layer (services).
3. Gunakan **fixtures** untuk data test, jangan hardcode.
4. Test harus **independen** — tidak bergantung pada urutan eksekusi.
5. Nama test menggunakan pola: `should <expected behavior> when <condition>`.

---

## Pertanyaan?

Jika ada pertanyaan tentang konvensi ini, silakan buka issue dengan label `question` atau diskusikan di channel tim engineering.
