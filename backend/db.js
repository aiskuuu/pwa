// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '195.88.211.226',
  port: 3306,
  user: 'rosttoin_rizky',
  password: 'Rizkyaisyah1997', // jaga kerahasiaannya
  database: 'rosttoin_rizky',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tidak perlu pool.connect()

module.exports = pool;