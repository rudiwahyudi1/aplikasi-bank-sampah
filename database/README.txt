DATABASE APLIKASI SAMPAH TERINTEGRASI

File utama untuk phpMyAdmin:
aplikasi_sampah.sql

Cara import:
1. Jalankan XAMPP -> MySQL.
2. Buka http://localhost/phpmyadmin
3. Klik Import.
4. Pilih database/aplikasi_sampah.sql.
5. Klik Go/Kirim.

Database: aplikasi_sampah
User demo:
admin / admin123
nasabah / nasabah123

Catatan: password pada file SQL menggunakan hash bcrypt. Pastikan kode login memakai bcryptjs.compare().
