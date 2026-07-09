const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // ⬅️ Tambahkan baris ini agar mau konek ke Aiven Cloud
  },
});

const promisePool = pool.promise();

// Test koneksi x
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Gagal konek ke database:", err.message);
  } else {
    console.log("Koneksi database BERHASIL!");
    connection.release();
  }
});

module.exports = promisePool;
