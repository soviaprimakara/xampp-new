const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middleware dasar
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (hanya saat development)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Route API utama (v1)
app.use('/api/v1', routes);

// Root route informasi API & Interactive Explorer
app.get('/', (req, res) => {
  // Jika request secara eksplisit meminta JSON (misal dari aplikasi/curl)
  if (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html')) {
    return res.json({
      name: 'Habits Bible Tracker REST API',
      version: '1.0.0',
      documentation: 'https://documenter.getpostman.com/view/59208278/2sBYHUULNZ',
      team: 'Peace Maker Joy - Universitas Primakara',
      author: 'I Komang Swastika Adnyana (2401020075)',
      status: 'Active',
    });
  }

  // Tampilkan UI Dashboard Explorer interaktif untuk browser
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Habits Bible Tracker - Backend API Portal</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --bg: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #10b981;
      --code-bg: #0b1120;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 30px 20px;
    }
    .container { max-width: 1000px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      backdrop-filter: blur(10px);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge::before {
      content: "";
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }
    h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
    .subtitle { color: var(--text-muted); font-size: 16px; margin-bottom: 20px; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }
    .meta-card {
      background: var(--card);
      border: 1px solid var(--border);
      padding: 16px 20px;
      border-radius: 12px;
    }
    .meta-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
    .meta-value { font-size: 15px; font-weight: 600; color: #e2e8f0; margin-top: 4px; }
    
    .section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .notice {
      background: rgba(59, 130, 246, 0.1);
      border-left: 4px solid #3b82f6;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #bfdbfe;
    }
    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    button {
      background: #334155;
      color: #ffffff;
      border: 1px solid #475569;
      padding: 10px 18px;
      border-radius: 10px;
      font-family: inherit;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    button:hover { background: var(--primary); border-color: var(--primary); transform: translateY(-1px); }
    button.btn-primary { background: var(--primary); border-color: var(--primary); }
    button.btn-primary:hover { background: var(--primary-hover); }
    
    .console {
      background: var(--code-bg);
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 20px;
      position: relative;
    }
    .console-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #1e293b;
      font-size: 13px;
      color: var(--text-muted);
    }
    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: #38bdf8;
      overflow-x: auto;
      white-space: pre-wrap;
      max-height: 400px;
    }
    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .link-card {
      display: block;
      text-decoration: none;
      background: #0f172a;
      border: 1px solid var(--border);
      padding: 16px;
      border-radius: 12px;
      color: var(--text);
      transition: all 0.2s;
    }
    .link-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    .link-name { font-weight: 700; font-size: 15px; color: #818cf8; }
    .link-desc { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">REST API Active & Connected to MongoDB Atlas</div>
      <h1>Habits Bible Tracker - Backend API Portal</h1>
      <p class="subtitle">Platform RESTful API untuk pencatatan progres bacaan Alkitab, renungan pribadi, dan ayat favorit.</p>
      
      <div class="meta-grid">
        <div class="meta-card">
          <div class="meta-label">Mata Kuliah & Tim</div>
          <div class="meta-value">Pemrograman Web Lanjutan &bull; Peace Maker Joy</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Backend & API Engineer</div>
          <div class="meta-value">I Komang Swastika Adnyana (2401020075)</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Frontend Engineer</div>
          <div class="meta-value">Sovia Suma’a (2401020097)</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Arsitektur</div>
          <div class="meta-value">Decoupled System (Node.js & MongoDB)</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">💡 Penjelasan Arsitektur Sistem (Backend vs Frontend)</div>
      <div class="notice">
        <strong>Mengapa tampilannya seperti ini?</strong> Sesuai dokumen SRS & SDS, sistem ini mengusung <em>Decoupled Architecture</em>. Bagian Anda (Backend) bertugas melayani data mentah berformat <strong>JSON</strong> melalui endpoint REST API. Antarmuka grafis (UI tombol, form, desain warna seperti di Figma) dikembangkan secara terpisah oleh <strong>Frontend Engineer (Sovia)</strong> menggunakan <strong>React.js</strong> di port <code>3000</code>.
      </div>
    </div>

    <div class="section">
      <div class="section-title">⚡ Live API Tester (Uji Coba Endpoint Langsung)</div>
      <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">
        Klik salah satu tombol di bawah untuk menguji endpoint REST API secara langsung dari browser Anda:
      </p>

      <div class="btn-group">
        <button class="btn-primary" onclick="testLogin()">🔑 1. Test Login (Admin Swastika)</button>
        <button onclick="testDashboard()">📊 2. Cek Statistik Dashboard (FR-004)</button>
        <button onclick="testAlkitab()">📖 3. Daftar Kitab Alkitab (Seed 66 Kitab)</button>
        <button onclick="testBacaan()">📜 4. Baca Yohanes Pasal 3</button>
        <button onclick="testHealth()">🩺 5. Health Check API</button>
      </div>

      <div class="console">
        <div class="console-header">
          <span id="endpoint-name">Endpoint: GET /api/v1/health</span>
          <span id="status-code" style="color: #34d399; font-weight: 700;">Status: Siap</span>
        </div>
        <pre id="output">{ "message": "Silakan klik tombol di atas untuk menguji respons data JSON dari database MongoDB Atlas Anda!" }</pre>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🔗 Tautan Kolaborasi Proyek</div>
      <div class="links-grid">
        <a href="https://documenter.getpostman.com/view/59208278/2sBYHUULNZ" target="_blank" class="link-card">
          <div class="link-name">Dokumentasi Postman ↗</div>
          <div class="link-desc">Spesifikasi 11 endpoint API & contoh request/response</div>
        </a>
        <a href="https://www.figma.com/design/PjeclfvZBwjs2PwIa5FX8q/HABITS-BIBLE-TRACKER" target="_blank" class="link-card">
          <div class="link-name">Mockup Figma ↗</div>
          <div class="link-desc">Desain antarmuka mobile & desktop oleh Frontend</div>
        </a>
        <a href="https://github.com/soviaprimakara/xampp-new" target="_blank" class="link-card">
          <div class="link-name">Repositori GitHub ↗</div>
          <div class="link-desc">Branch main & development kode program tim</div>
        </a>
      </div>
    </div>
  </div>

  <script>
    let authToken = "";

    async function displayResult(url, options = {}, name = "") {
      document.getElementById('endpoint-name').innerText = "Memanggil: " + name;
      document.getElementById('status-code').innerText = "Loading...";
      document.getElementById('status-code').style.color = "#fbbf24";
      document.getElementById('output').innerText = "Mengambil data dari server backend...";

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        document.getElementById('status-code').innerText = "Status: " + res.status + " " + res.statusText;
        document.getElementById('status-code').style.color = res.ok ? "#34d399" : "#f87171";
        document.getElementById('output').innerText = JSON.stringify(data, null, 2);
        return data;
      } catch (err) {
        document.getElementById('status-code').innerText = "Error";
        document.getElementById('status-code').style.color = "#f87171";
        document.getElementById('output').innerText = "Gagal memanggil API: " + err.message;
      }
    }

    async function testHealth() {
      displayResult('/api/v1/health', {}, 'GET /api/v1/health');
    }

    async function testAlkitab() {
      displayResult('/api/v1/alkitab/kitab', {}, 'GET /api/v1/alkitab/kitab');
    }

    async function testBacaan() {
      displayResult('/api/v1/alkitab/Yohanes/3', {}, 'GET /api/v1/alkitab/Yohanes/3');
    }

    async function testLogin() {
      const data = await displayResult('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'swastika@primakara.ac.id',
          password: 'password123'
        })
      }, 'POST /api/v1/auth/login (Login Admin Swastika)');

      if (data && data.data && data.data.token) {
        authToken = data.data.token;
      }
    }

    async function testDashboard() {
      if (!authToken) {
        // Otomatis login dulu jika belum
        const loginRes = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'swastika@primakara.ac.id', password: 'password123' })
        });
        const loginData = await loginRes.json();
        if (loginData.data && loginData.data.token) {
          authToken = loginData.data.token;
        }
      }

      displayResult('/api/v1/dashboard/stats', {
        headers: { 'Authorization': 'Bearer ' + authToken }
      }, 'GET /api/v1/dashboard/stats (Statistik Realtime)');
    }
  </script>
</body>
</html>
  `);
});

// Middleware 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;

