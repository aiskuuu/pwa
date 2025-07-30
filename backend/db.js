// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       // sesuaikan dengan password MySQL kamu
  database: 'rizky' // ganti dengan nama database kamu
});

connection.connect(err => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
  } else {
    console.log('Terhubung ke database.');
  }
});

module.exports = connection;
