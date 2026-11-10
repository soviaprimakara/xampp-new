const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Renungan = require('../models/Renungan');
const AyatFavorit = require('../models/AyatFavorit');
const ProgressBacaan = require('../models/ProgressBacaan');
const Alkitab = require('../models/Alkitab');
const { DAFTAR_KITAB, AYAT_SAMPEL } = require('./seedAlkitab');

dotenv.config();

const seedFullDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/habits_bible_tracker';
    console.log(`[Database Seed] Menghubungkan ke MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Database Seed] Terhubung ke MongoDB!');

    // 1. Bersihkan data lama
    console.log('[Database Seed] Membersihkan data collection lama...');
    await Promise.all([
      User.deleteMany({}),
      Renungan.deleteMany({}),
      AyatFavorit.deleteMany({}),
      ProgressBacaan.deleteMany({}),
      Alkitab.deleteMany({}),
    ]);
    console.log('[Database Seed] Seluruh collection telah dibersihkan.');

    // 2. Seed Users
    console.log('[Database Seed] Mengisi collection `users`...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const usersToInsert = [
      {
        name: 'I Komang Swastika Adnyana',
        email: 'swastika@primakara.ac.id',
        password: passwordHash,
        role: 'admin',
      },
      {
        name: 'Sovia Suma’a',
        email: 'sovia@primakara.ac.id',
        password: passwordHash,
        role: 'user',
      },
      {
        name: 'Pengguna Demo',
        email: 'demo@peacemakerjoy.com',
        password: passwordHash,
        role: 'user',
      },
    ];

    // Gunakan insertMany langsung agar password tidak di-hash dua kali
    const createdUsers = await User.insertMany(usersToInsert);
    const userSwastika = createdUsers[0];
    const userSovia = createdUsers[1];
    console.log(`[Database Seed] Berhasil membuat ${createdUsers.length} pengguna (Password default: password123).`);

    // 3. Seed Alkitab (66 Kitab & Sampel Ayat)
    console.log('[Database Seed] Mengisi collection `alkitabs` (Katalog 66 Kitab)...');
    const alkitabData = DAFTAR_KITAB.map((item) => {
      const ayatList = AYAT_SAMPEL[item.kitab] || [];
      return {
        ...item,
        ayat_list: ayatList,
      };
    });
    await Alkitab.insertMany(alkitabData);
    console.log(`[Database Seed] Berhasil mengisi ${alkitabData.length} kitab Alkitab.`);

    // 4. Seed Progres Bacaan
    console.log('[Database Seed] Mengisi collection `progres_bacaan`...');
    const progressToInsert = [
      {
        user_id: userSwastika._id,
        kitab_terakhir: 'Kejadian',
        pasal_terakhir: 3,
        pasal_selesai: [
          { kitab: 'Kejadian', pasal: 1, selesai_pada: new Date(Date.now() - 86400000 * 2) },
          { kitab: 'Kejadian', pasal: 2, selesai_pada: new Date(Date.now() - 86400000) },
          { kitab: 'Kejadian', pasal: 3, selesai_pada: new Date() },
          { kitab: 'Matius', pasal: 1, selesai_pada: new Date() },
        ],
      },
      {
        user_id: userSovia._id,
        kitab_terakhir: 'Mazmur',
        pasal_terakhir: 23,
        pasal_selesai: [
          { kitab: 'Mazmur', pasal: 23, selesai_pada: new Date() },
          { kitab: 'Yohanes', pasal: 1, selesai_pada: new Date() },
        ],
      },
    ];
    await ProgressBacaan.insertMany(progressToInsert);
    console.log(`[Database Seed] Berhasil membuat data progres bacaan.`);

    // 5. Seed Ayat Favorit
    console.log('[Database Seed] Mengisi collection `ayat_favorit`...');
    const favoritToInsert = [
      {
        user_id: userSwastika._id,
        kitab: 'Yohanes',
        pasal: 3,
        ayat: 16,
        teks_ayat: 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.',
      },
      {
        user_id: userSwastika._id,
        kitab: 'Filipi',
        pasal: 4,
        ayat: 13,
        teks_ayat: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
      },
      {
        user_id: userSwastika._id,
        kitab: 'Roma',
        pasal: 8,
        ayat: 28,
        teks_ayat: 'Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia.',
      },
      {
        user_id: userSovia._id,
        kitab: 'Mazmur',
        pasal: 23,
        ayat: 1,
        teks_ayat: 'TUHAN adalah gembalaku, takkan kekurangan aku.',
      },
    ];
    await AyatFavorit.insertMany(favoritToInsert);
    console.log(`[Database Seed] Berhasil membuat ${favoritToInsert.length} ayat favorit.`);

    // 6. Seed Renungan
    console.log('[Database Seed] Mengisi collection `renungan`...');
    const renunganToInsert = [
      {
        user_id: userSwastika._id,
        kitab: 'Kejadian',
        pasal: 1,
        ayat_referensi: '1-3',
        isi_renungan: 'Allah adalah pencipta dari ketiadaan menjadi ada. Terang-Nya mampu menghalau kegelapan terdalam dalam hidup kita.',
      },
      {
        user_id: userSwastika._id,
        kitab: 'Filipi',
        pasal: 4,
        ayat_referensi: '6-7',
        isi_renungan: 'Kunci damai sejahtera adalah mengalihkan kekhawatiran menjadi doa dan ucapan syukur. Allah memelihara hati dan pikiran kita.',
      },
      {
        user_id: userSovia._id,
        kitab: 'Mazmur',
        pasal: 23,
        ayat_referensi: '1-6',
        isi_renungan: 'Bahkan ketika melewati lembah kelam, kita tidak perlu takut karena gada dan tongkat Tuhan senantiasa menghibur dan menuntun langkah kita.',
      },
    ];
    await Renungan.insertMany(renunganToInsert);
    console.log(`[Database Seed] Berhasil membuat ${renunganToInsert.length} renungan.`);

    // 7. Bangun Indexes
    console.log('[Database Seed] Memastikan seluruh index database terbentuk...');
    await Promise.all([
      User.syncIndexes(),
      Renungan.syncIndexes(),
      AyatFavorit.syncIndexes(),
      ProgressBacaan.syncIndexes(),
      Alkitab.syncIndexes(),
    ]);
    console.log('[Database Seed] Seluruh Index (Unique, Compound, Text Index) berhasil di-sync.');

    console.log(`=======================================================`);
    console.log(` Inisialisasi Database MongoDB Berhasil Sempurna!`);
    console.log(` Akun Demo Login:`);
    console.log(` 1. Email: swastika@primakara.ac.id | Password: password123`);
    console.log(` 2. Email: sovia@primakara.ac.id     | Password: password123`);
    console.log(` 3. Email: demo@peacemakerjoy.com    | Password: password123`);
    console.log(`=======================================================`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Database Seed Error]:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedFullDatabase();
}

module.exports = seedFullDatabase;
