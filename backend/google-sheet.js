// google-sheet.js
const { google } = require('googleapis');
const path = require('path');
const credentials = require(path.join(__dirname, 'credentials.json'));


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES
});

const sheets = google.sheets({ version: 'v4', auth });

async function appendToSheet(data) {
  const spreadsheetId = '1ScGD42LkdfT9i5NHde5jbcNss2seTppYUiZ8T8_mQfg'; // ← ganti ini
  const range = 'INPUT!B:G'; // ganti jika nama sheet-nya beda

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data
      }
    });
    console.log('Data berhasil dikirim ke Google Sheet');
    return response.data;
  } catch (error) {
    console.error('Gagal mengirim ke Google Sheet:', error);
    throw error;
  }
}

module.exports = appendToSheet;
