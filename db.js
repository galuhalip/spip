const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_pengaduan",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// Test koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Gagal konek ke database:", err.message);
  } else {
    console.log("Koneksi database BERHASIL!");
    connection.release();
  }
});

module.exports = promisePool;
