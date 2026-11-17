const mongoose = require('mongoose');
const dns = require('dns');

// Gunakan Google Public DNS untuk mengatasi error querySrv ECONNREFUSED pada jaringan ISP tertentu
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // abaikan jika tidak didukung environment
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/habits_bible_tracker');
    console.log(`[MongoDB] Terhubung: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Gagal terhubung: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

