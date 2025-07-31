// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'dirgantara.arenhost.com',
  port: 2083, // <- WAJIB ditambahkan karena defaultnya 3306
  user: 'rosttoin_rizky',
  password: 'Rizkyaisyah1997', // jaga kerahasiaannya nanti ya
  database: 'rizky' // pastikan ini nama database kamu
});

connection.connect(err => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
  } else {
    console.log('Terhubung ke database.');
  }
});

module.exports = connection;