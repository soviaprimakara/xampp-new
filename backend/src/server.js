const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Jalankan koneksi database lalu start HTTP server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Habits Bible Tracker REST API Server Aktif`);
      console.log(` Mode    : ${process.env.NODE_ENV || 'development'}`);
      console.log(` Port    : ${PORT}`);
      console.log(` URL     : http://localhost:${PORT}`);
      console.log(` Base API: http://localhost:${PORT}/api/v1`);
      console.log(`=======================================================`);
    });
  })
  .catch((err) => {
    console.error('Server gagal dimulai karena kesalahan koneksi database:', err.message);
  });

