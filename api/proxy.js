export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // GANTI DENGAN URL WEB APP APPS SCRIPT ANDA
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxlI-Mq4g8QV_603mEd0fBsAnEnhmC8jL8YC-NhlmFm_hxRGeQrZkyTX0ykC5KjqHNHmg/exec';

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body) // { action, data }
    });

    const text = await response.text();
    // Coba parse JSON
    try {
      const json = JSON.parse(text);
      return res.status(response.status).json(json);
    } catch (e) {
      console.error('GAS mengembalikan HTML:', text.substring(0, 200));
      return res.status(502).json({ 
        error: 'GAS response bukan JSON', 
        hint: 'Pastikan Web App di-deploy dengan akses "Anyone" dan tidak ada file HTML',
        preview: text.substring(0, 200)
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
