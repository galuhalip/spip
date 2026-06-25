# PROMPT REFERENSI - Sistem Pengaduan Pelanggaran Pendidikan

> File ini berisi seluruh konteks, arsitektur, kode, dan solusi dari proyek **Sistem Pengaduan Pelanggaran Pendidikan**.
> Berguna sebagai referensi saat ingin mengulang, merevisi, atau mengembangkan fitur baru.

---

## Tujuan Proyek

Membangun aplikasi web pengaduan pelanggaran di lingkungan pendidikan dengan fitur:

- Mahasiswa dapat membuat laporan (dengan upload bukti)
- Mahasiswa dapat cek status laporan (pakai ID laporan + NIM)
- Mahasiswa dapat melihat riwayat laporan sendiri
- Admin dapat login dan mengelola semua laporan
- Admin dapat mengubah status laporan (Menunggu → Diproses → Selesai/Ditolak)
- Admin dapat menghapus laporan
- Dashboard statistik untuk admin
- Dark mode / Light mode (toggle)
- Email otomatis ke pelapor setelah laporan dibuat

---

## Teknologi yang Digunakan

| Komponen       | Teknologi                        |
| -------------- | -------------------------------- |
| Backend        | Node.js + Express.js             |
| Database       | MariaDB (XAMPP)                  |
| Frontend       | HTML5, CSS3, Vanilla JavaScript  |
| Upload File    | Multer                           |
| Autentikasi    | Express Session                  |
| Email Otomatis | Nodemailer + Google App Password |
| Dark Mode      | CSS + localStorage               |

---

## Struktur Folder

sistem-pengaduan/
├── server.js
├── db.js
├── .env
├── uploads/
└── public/
├── index.html
├── admin.html
├── style.css
└── app.js

---

## Cara Menjalankan Proyek

```bash
# 1. Clone / masuk ke folder proyek
cd sistem-pengaduan

# 2. Install dependencies
npm install

# 3. Buat database di phpMyAdmin (lihat SQL di bawah)
-- Buat database
CREATE DATABASE db_pengaduan;
USE db_pengaduan;

-- Tabel users (admin)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabel pengaduan
CREATE TABLE pengaduan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id VARCHAR(50) UNIQUE NOT NULL,
    reporter_name VARCHAR(100) NOT NULL,
    reporter_id VARCHAR(50) NOT NULL,
    reporter_role VARCHAR(50) NOT NULL,
    reporter_email VARCHAR(100) NOT NULL,
    violation_type VARCHAR(100) NOT NULL,
    violation_date DATE NOT NULL,
    violation_time VARCHAR(10),
    violation_location VARCHAR(255) NOT NULL,
    violation_description TEXT NOT NULL,
    file_name VARCHAR(255),
    status ENUM('submitted','process','completed','rejected') DEFAULT 'submitted',
    status_notes TEXT,
    submission_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin default
INSERT INTO users (username, password) VALUES ('admin', 'admin123');

# 4. Buat file .env (lihat contoh di bawah)
EMAIL_USER=emailkamu@gmail.com
EMAIL_PASS=ielswxsdqnaszmss



# 5. Jalankan server
npm start
```
