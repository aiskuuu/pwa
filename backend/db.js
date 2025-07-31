// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '195.88.211.226', 
  port: 3306, // <- WAJIB ditambahkan karena defaultnya 3306
  user: 'rosttoin_rizky',
  password: 'Rizkyaisyah1997', // jaga kerahasiaannya nanti ya
  database: 'rosttoin_rizky' // pastikan ini nama database 
});

connection.connect(err => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
  } else {
    console.log('Terhubung ke database.');
  }
});

module.exports = connection;