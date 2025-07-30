// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
const path = require('path');
// STATIC: arahkan ke folder public (bukan pwa-input lagi)
app.use(express.static(path.join(__dirname, '../public')));


// Setup Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
 // File dari Google Cloud Console
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const spreadsheetId = '11M-qp_L4LJbMg-xl-KKUSrcOrCqFLZFSk_bWYU67RJo'; // Ganti dengan ID Google Sheet-mu

// Endpoint login
app.post('/login', (req, res) => {
  const { kode } = req.body;
  const sql = 'SELECT * FROM users WHERE kode_akses = ?';
  db.query(sql, [kode], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({ success: true, nama: user.nama });
    } else {
      res.json({ success: false, message: 'Kode salah' });
    }
  });
});

// Endpoint submit data
app.post('/submit', async (req, res) => {
  const { tanggal, bahan, tipe, user } = req.body;

  if (!tanggal || !bahan || !tipe || !user) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

const values = bahan.map(item => [
  item.nama,
  tanggal,
  tipe === 'masuk' ? item.jumlah : '',
  tipe === 'keluar' ? item.jumlah : '',
  user.nama,
  user.kode_akses
]);

const sql = 'INSERT INTO input (nama_bahan, tanggal, masuk, keluar, user_nama, user_kode) VALUES ?';


  db.query(sql, [values], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Gagal menyimpan data ke MySQL' });
    }

    // Kirim ke Google Sheets
    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: 'v4', auth: client });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'INPUT!B:G', // 5 kolom: nama_bahan, tanggal, masuk, keluar, user
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: values,
        },
      });

      res.json({ success: true, message: 'Data berhasil disimpan ke MySQL dan Google Sheets' });
    } catch (err) {
      console.error('Gagal kirim ke Google Sheets:', err);
      res.status(500).json({ success: false, message: 'Gagal kirim ke Google Sheets' });
    }
  });
});

// Endpoint cek server
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Jalankan server
app.listen(port, '0.0.0.0' , () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
