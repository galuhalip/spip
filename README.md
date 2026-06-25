# Sistem Informasi Pengaduan Pelanggaran Kampus (SIPP-K)

Aplikasi berbasis web "Vanilla" yang dirancang sebagai platform aman bagi mahasiswa untuk melaporkan berbagai tindakan pelanggaran, seperti bullying, pelecehan seksual, kecurangan akademik, dan pelanggaran tata tertib.

## 🌟 Latar Belakang

Proyek ini dibangun atas dasar empati terhadap maraknya kasus perundungan yang sering kali tidak terlaporkan. Fokus utama aplikasi ini adalah **Privasi** dan **Keamanan Data** untuk melindungi pelapor dari risiko intimidasi dengan prinsip **Anonymity by Design**.

## 🚀 Fitur Utama

- **Sistem Tanpa Framework**: Dibangun menggunakan teknologi web dasar (Pure HTML, CSS, JavaScript) untuk performa yang ringan.
- **Pelaporan Anonim**: Nama pelapor disamarkan pada halaman pengecekan status publik.
- **Lampiran Bukti**: Fitur unggah file (JPG, JPEG, PDF) menggunakan library **Multer**.
- **Notifikasi Email Otomatis**: Mengirimkan ID Laporan unik ke email pelapor secara otomatis menggunakan **Nodemailer**.
- **Monitoring Status**: Pelapor dapat memantau progres laporan hanya dengan memasukkan ID Laporan.

## 🛠️ Tech Stack & Library

- **Bahasa**: JavaScript (Node.js)
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript
- **Backend Runtime**: Node.js
- **Database**: MySQL
- **Library Pendukung**:
  - `express` (Minimalist web framework untuk Node.js)
  - `nodemailer` (Pengiriman Email)
  - `multer` (Proses Upload File)
  - `dotenv` (Manajemen Keamanan Variabel)

## 📦 Struktur Folder

sistem-pengaduan/
├── public/ # Asset statis (HTML, CSS, JS Browser)
├── uploads/ # Folder penyimpanan bukti laporan (Di-ignore)
├── .env # Variabel rahasia (Kunci Email & DB)
├── .gitignore # Daftar file rahasia agar tidak bocor
├── db.js # Logika koneksi Database
├── server.js # Server utama & Logika pengiriman email
└── package.json # Daftar library yang digunakan
