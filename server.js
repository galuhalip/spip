const express = require("express");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();
// app.use(express.static("public"));
const nodemailer = require("nodemailer");
require("dotenv").config();

// konf email
const emailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Pakai domain resmi agar sertifikat SSL-nya valid dan masuk inbox
  port: 465, // Gunakan port SSL yang aman
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Tambahkan ini untuk mem-bypass error network IPv4/IPv6 di localhost kamu
  tls: {
    rejectUnauthorized: false,
  },
});

//kirim email
async function sendConfirmationEmail(userEmail, reportData) {
  const {
    report_id,
    reporter_name,
    violation_type,
    violation_date,
    violation_location,
    violation_description,
    submission_date,
  } = reportData;

  const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f8f9fa;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-top: none;
                    border-radius: 0 0 10px 10px;
                }
                .info-box {
                    background: white;
                    border-left: 4px solid #3498db;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .info-row {
                    margin-bottom: 10px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #eee;
                }
                .label {
                    font-weight: 600;
                    color: #2c3e50;
                    width: 140px;
                    display: inline-block;
                }
                .value {
                    color: #555;
                }
                .status-badge {
                    display: inline-block;
                    background: #fff3e0;
                    color: #f39c12;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                    font-size: 12px;
                    color: #888;
                }
                .note {
                    background: #e8f5e9;
                    color: #2e7d32;
                    padding: 12px;
                    border-radius: 8px;
                    margin: 15px 0;
                    font-weight: 500;
                    text-align: center;
                }
                button {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Sistem Pengaduan Pelanggaran Pendidikan</h2>
                <p>Unit Penanganan Pelanggaran</p>
            </div>
            <div class="content">
                <p>Yth. <strong>${reporter_name}</strong>,</p>
                <p>Kami telah menerima laporan pengaduan yang Anda sampaikan melalui Sistem Pengaduan Pelanggaran Pendidikan. Berikut adalah detail laporan Anda:</p>
                
                <div class="info-box">
                    <div class="info-row">
                        <span class="label">ID Laporan:</span>
                        <span class="value"><strong>${report_id}</strong></span>
                    </div>
                    <div class="info-row">
                        <span class="label">Jenis Pelanggaran:</span>
                        <span class="value">${violation_type}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Tanggal Kejadian:</span>
                        <span class="value">${new Date(violation_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Lokasi Kejadian:</span>
                        <span class="value">${violation_location}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Status Laporan:</span>
                        <span class="value"><span class="status-badge">Diajukan</span></span>
                    </div>
                    <div class="info-row">
                        <span class="label">Tanggal Pengajuan:</span>
                        <span class="value">${new Date(submission_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                </div>
                
                <div class="note">
                    <strong>Catatan Penting:</strong><br>
                    Harap catat dan simpan <strong>ID Laporan: ${report_id}</strong> Anda.<br>
                    Gunakan ID tersebut untuk melakukan pengecekan status laporan Anda secara berkala.
                </div>
                
                <p>Deskripsi laporan yang Anda sampaikan:</p>
                <div class="info-box">
                    <em>"${violation_description}"</em>
                </div>
                
                <p>Laporan Anda akan kami proses dalam waktu 1x24 jam. Tim kami akan segera menindaklanjuti dan memberikan pembaruan status melalui sistem ini.</p>
                
                <p>Terima kasih atas partisipasi Anda dalam menjaga integritas lingkungan pendidikan.</p>
                
                <hr>
                <p style="font-size: 12px; color: #888;">
                    <strong>Hormat kami,</strong><br>
                    Unit Penanganan Pelanggaran<br>
                    <em>Sistem Pengaduan Pelanggaran Pendidikan</em>
                </p>
            </div>
            <div class="footer">
                <p>&copy; 2026 Sistem Pengaduan Pelanggaran Pendidikan. All rights reserved.</p>
                <p>Email ini dikirim secara otomatis, mohon tidak membalas langsung ke email ini.</p>
            </div>
        </body>
        </html>
    `;

  const mailOptions = {
    from: '"Unit Penanganan Pelanggaran" <pengaduan@kampuspendidikan.ac.id>',
    to: userEmail,
    subject: `Konfirmasi Laporan Pengaduan - ${report_id}`,
    html: emailHtml,
  };

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log(`Email konfirmasi terkirim ke ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return false;
  }
}

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Session
app.use(
  session({
    secret: "rahasia_admin_pengaduan",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  }),
);

// Setup upload folder
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Hanya file gambar, PDF, dan Word yang diperbolehkan"));
    }
  },
});

// PUBLIC API (Mahasiswa)
// GET semua pengaduan
app.get("/api/pengaduan", async (req, res) => {
  try {
    const { reporter_id } = req.query;
    let query = "SELECT * FROM pengaduan ORDER BY created_at DESC";
    let params = [];

    if (reporter_id) {
      query =
        "SELECT * FROM pengaduan WHERE reporter_id = ? ORDER BY created_at DESC";
      params = [reporter_id];
    }

    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET pengaduan by ID
app.get("/api/pengaduan/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { reporter_id } = req.query;

    let query = "SELECT * FROM pengaduan WHERE report_id = ?";
    let params = [reportId];

    if (reporter_id) {
      query += " AND reporter_id = ?";
      params.push(reporter_id);
    }

    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Laporan tidak ditemukan" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST laporan baru (DENGAN UPLOAD FILE)
app.post("/api/pengaduan", upload.single("file"), async (req, res) => {
  console.log("Menerima laporan baru:", req.body);
  console.log("File:", req.file);

  const {
    reporter_name,
    reporter_id,
    reporter_role,
    reporter_email,
    violation_type,
    violation_date,
    violation_time,
    violation_location,
    violation_description,
  } = req.body;

  // Validasi
  if (
    !reporter_name ||
    !reporter_id ||
    !reporter_role ||
    !reporter_email ||
    !violation_type ||
    !violation_date ||
    !violation_location ||
    !violation_description
  ) {
    return res.status(400).json({
      success: false,
      message: "Semua field wajib diisi",
    });
  }

  //generate ID
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900) + 100;
  const reportId = `LP-${year}-${month}${day}${random}`;

  const submissionDate = new Date().toISOString().split("T")[0];
  const fileName = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      `INSERT INTO pengaduan 
      (report_id, reporter_name, reporter_id, reporter_role, reporter_email, 
       violation_type, violation_date, violation_time, violation_location, 
       violation_description, file_name, submission_date, status, status_notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', 'Laporan telah diterima')`,
      [
        reportId,
        reporter_name,
        reporter_id,
        reporter_role,
        reporter_email,
        violation_type,
        violation_date,
        violation_time || null,
        violation_location,
        violation_description,
        fileName,
        submissionDate,
      ],
    );

    console.log(" Laporan tersimpan dengan ID:", reportId);

    //kirim email konfirmasi
    const reportData = {
      report_id: reportId,
      reporter_name: reporter_name,
      violation_type: violation_type,
      violation_date: violation_date,
      violation_location: violation_location,
      violation_description: violation_description,
      submission_date: submissionDate,
    };

    sendConfirmationEmail(reporter_email, reportData).catch(console.error);

    res.json({
      success: true,
      message: "Laporan berhasil dikirim",
      data: { report_id: reportId },
    });
  } catch (error) {
    console.error("Error INSERT:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN API
// Login Admin
app.post("/api/admin/login", async (req, res) => {
  console.log(" Login attempt:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      success: false,
      message: "Username dan password harus diisi",
    });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.json({ success: false, message: "Username tidak ditemukan" });
    }

    if (users[0].password !== password) {
      return res.json({ success: false, message: "Password salah" });
    }

    req.session.user = {
      id: users[0].id,
      username: users[0].username,
      role: "admin",
    };

    console.log(" Login berhasil:", username);
    res.json({
      success: true,
      message: "Login berhasil",
      user: { username: users[0].username },
    });
  } catch (error) {
    console.error(" Login error:", error);
    res.json({ success: false, message: error.message });
  }
});

// Logout
app.post("/api/admin/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Cek session
app.get("/api/admin/check-session", (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    res.json({ success: true, isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ success: true, isLoggedIn: false });
  }
});

// Dashboard statistik
app.get("/api/admin/dashboard", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.json({ success: false, message: "Unauthorized" });
  }

  try {
    const [total] = await db.query("SELECT COUNT(*) as count FROM pengaduan");
    const [submitted] = await db.query(
      'SELECT COUNT(*) as count FROM pengaduan WHERE status = "submitted"',
    );
    const [process] = await db.query(
      'SELECT COUNT(*) as count FROM pengaduan WHERE status = "process"',
    );
    const [completed] = await db.query(
      'SELECT COUNT(*) as count FROM pengaduan WHERE status = "completed"',
    );
    const [rejected] = await db.query(
      'SELECT COUNT(*) as count FROM pengaduan WHERE status = "rejected"',
    );

    res.json({
      success: true,
      data: {
        total: total[0].count,
        submitted: submitted[0].count,
        process: process[0].count,
        completed: completed[0].count,
        rejected: rejected[0].count,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

//get adm
app.get("/api/admin/pengaduan", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.json({ success: false, message: "Unauthorized" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM pengaduan ORDER BY created_at DESC",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

//update status
app.put("/api/admin/pengaduan/:id/status", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.params;
  const { status, status_notes } = req.body;

  try {
    await db.query(
      "UPDATE pengaduan SET status = ?, status_notes = ? WHERE id = ?",
      [status, status_notes || "", id],
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

//delete pengaduan
app.delete("/api/admin/pengaduan/:id", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT file_name FROM pengaduan WHERE id = ?",
      [id],
    );
    if (rows.length > 0 && rows[0].file_name) {
      const filePath = path.join(__dirname, "uploads", rows[0].file_name);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query("DELETE FROM pengaduan WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

//start server
app.listen(PORT, () => {
  console.log(` 
     SERVER BERJALAN DI http://localhost:${PORT}
     API Pengaduan: http://localhost:${PORT}/api/pengaduan
     Admin Login: http://localhost:${PORT}/admin.html
     Login: admin / admin123 
    `);
});
