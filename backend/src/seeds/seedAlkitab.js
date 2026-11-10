const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Alkitab = require('../models/Alkitab');

dotenv.config();

const DAFTAR_KITAB = [
  // Perjanjian Lama (39 Kitab)
  { testament: 'Perjanjian Lama', kitab: 'Kejadian', singkatan: 'Kej', total_pasal: 50, urutan: 1 },
  { testament: 'Perjanjian Lama', kitab: 'Keluaran', singkatan: 'Kel', total_pasal: 40, urutan: 2 },
  { testament: 'Perjanjian Lama', kitab: 'Imamat', singkatan: 'Ima', total_pasal: 27, urutan: 3 },
  { testament: 'Perjanjian Lama', kitab: 'Bilangan', singkatan: 'Bil', total_pasal: 36, urutan: 4 },
  { testament: 'Perjanjian Lama', kitab: 'Ulangan', singkatan: 'Ula', total_pasal: 34, urutan: 5 },
  { testament: 'Perjanjian Lama', kitab: 'Yosua', singkatan: 'Yos', total_pasal: 24, urutan: 6 },
  { testament: 'Perjanjian Lama', kitab: 'Hakim-hakim', singkatan: 'Hak', total_pasal: 21, urutan: 7 },
  { testament: 'Perjanjian Lama', kitab: 'Rut', singkatan: 'Rut', total_pasal: 4, urutan: 8 },
  { testament: 'Perjanjian Lama', kitab: '1 Samuel', singkatan: '1Sam', total_pasal: 31, urutan: 9 },
  { testament: 'Perjanjian Lama', kitab: '2 Samuel', singkatan: '2Sam', total_pasal: 24, urutan: 10 },
  { testament: 'Perjanjian Lama', kitab: '1 Raja-raja', singkatan: '1Raj', total_pasal: 22, urutan: 11 },
  { testament: 'Perjanjian Lama', kitab: '2 Raja-raja', singkatan: '2Raj', total_pasal: 25, urutan: 12 },
  { testament: 'Perjanjian Lama', kitab: '1 Tawarikh', singkatan: '1Taw', total_pasal: 29, urutan: 13 },
  { testament: 'Perjanjian Lama', kitab: '2 Tawarikh', singkatan: '2Taw', total_pasal: 36, urutan: 14 },
  { testament: 'Perjanjian Lama', kitab: 'Ezra', singkatan: 'Ezr', total_pasal: 10, urutan: 15 },
  { testament: 'Perjanjian Lama', kitab: 'Nehemia', singkatan: 'Neh', total_pasal: 13, urutan: 16 },
  { testament: 'Perjanjian Lama', kitab: 'Ester', singkatan: 'Est', total_pasal: 10, urutan: 17 },
  { testament: 'Perjanjian Lama', kitab: 'Ayub', singkatan: 'Ayb', total_pasal: 42, urutan: 18 },
  { testament: 'Perjanjian Lama', kitab: 'Mazmur', singkatan: 'Maz', total_pasal: 150, urutan: 19 },
  { testament: 'Perjanjian Lama', kitab: 'Amsal', singkatan: 'Ams', total_pasal: 31, urutan: 20 },
  { testament: 'Perjanjian Lama', kitab: 'Pengkhotbah', singkatan: 'Pkh', total_pasal: 12, urutan: 21 },
  { testament: 'Perjanjian Lama', kitab: 'Kidung Agung', singkatan: 'Kid', total_pasal: 8, urutan: 22 },
  { testament: 'Perjanjian Lama', kitab: 'Yesaya', singkatan: 'Yes', total_pasal: 66, urutan: 23 },
  { testament: 'Perjanjian Lama', kitab: 'Yeremia', singkatan: 'Yer', total_pasal: 52, urutan: 24 },
  { testament: 'Perjanjian Lama', kitab: 'Ratapan', singkatan: 'Rat', total_pasal: 5, urutan: 25 },
  { testament: 'Perjanjian Lama', kitab: 'Yehezkiel', singkatan: 'Yeh', total_pasal: 48, urutan: 26 },
  { testament: 'Perjanjian Lama', kitab: 'Daniel', singkatan: 'Dan', total_pasal: 12, urutan: 27 },
  { testament: 'Perjanjian Lama', kitab: 'Hosea', singkatan: 'Hos', total_pasal: 14, urutan: 28 },
  { testament: 'Perjanjian Lama', kitab: 'Yoel', singkatan: 'Yoe', total_pasal: 3, urutan: 29 },
  { testament: 'Perjanjian Lama', kitab: 'Amos', singkatan: 'Amo', total_pasal: 9, urutan: 30 },
  { testament: 'Perjanjian Lama', kitab: 'Obaja', singkatan: 'Oba', total_pasal: 1, urutan: 31 },
  { testament: 'Perjanjian Lama', kitab: 'Yunus', singkatan: 'Yun', total_pasal: 4, urutan: 32 },
  { testament: 'Perjanjian Lama', kitab: 'Mikha', singkatan: 'Mik', total_pasal: 7, urutan: 33 },
  { testament: 'Perjanjian Lama', kitab: 'Nahum', singkatan: 'Nah', total_pasal: 3, urutan: 34 },
  { testament: 'Perjanjian Lama', kitab: 'Habakuk', singkatan: 'Hab', total_pasal: 3, urutan: 35 },
  { testament: 'Perjanjian Lama', kitab: 'Zefanya', singkatan: 'Zef', total_pasal: 3, urutan: 36 },
  { testament: 'Perjanjian Lama', kitab: 'Hagai', singkatan: 'Hag', total_pasal: 2, urutan: 37 },
  { testament: 'Perjanjian Lama', kitab: 'Zakharia', singkatan: 'Zak', total_pasal: 14, urutan: 38 },
  { testament: 'Perjanjian Lama', kitab: 'Maleakhi', singkatan: 'Mal', total_pasal: 4, urutan: 39 },

  // Perjanjian Baru (27 Kitab)
  { testament: 'Perjanjian Baru', kitab: 'Matius', singkatan: 'Mat', total_pasal: 28, urutan: 40 },
  { testament: 'Perjanjian Baru', kitab: 'Markus', singkatan: 'Mrk', total_pasal: 16, urutan: 41 },
  { testament: 'Perjanjian Baru', kitab: 'Lukas', singkatan: 'Luk', total_pasal: 24, urutan: 42 },
  { testament: 'Perjanjian Baru', kitab: 'Yohanes', singkatan: 'Yoh', total_pasal: 21, urutan: 43 },
  { testament: 'Perjanjian Baru', kitab: 'Kisah Para Rasul', singkatan: 'Kis', total_pasal: 28, urutan: 44 },
  { testament: 'Perjanjian Baru', kitab: 'Roma', singkatan: 'Rom', total_pasal: 16, urutan: 45 },
  { testament: 'Perjanjian Baru', kitab: '1 Korintus', singkatan: '1Kor', total_pasal: 16, urutan: 46 },
  { testament: 'Perjanjian Baru', kitab: '2 Korintus', singkatan: '2Kor', total_pasal: 13, urutan: 47 },
  { testament: 'Perjanjian Baru', kitab: 'Galatia', singkatan: 'Gal', total_pasal: 6, urutan: 48 },
  { testament: 'Perjanjian Baru', kitab: 'Efesus', singkatan: 'Efe', total_pasal: 6, urutan: 49 },
  { testament: 'Perjanjian Baru', kitab: 'Filipi', singkatan: 'Flp', total_pasal: 4, urutan: 50 },
  { testament: 'Perjanjian Baru', kitab: 'Kolose', singkatan: 'Kol', total_pasal: 4, urutan: 51 },
  { testament: 'Perjanjian Baru', kitab: '1 Tesalonika', singkatan: '1Tes', total_pasal: 5, urutan: 52 },
  { testament: 'Perjanjian Baru', kitab: '2 Tesalonika', singkatan: '2Tes', total_pasal: 3, urutan: 53 },
  { testament: 'Perjanjian Baru', kitab: '1 Timotius', singkatan: '1Tim', total_pasal: 6, urutan: 54 },
  { testament: 'Perjanjian Baru', kitab: '2 Timotius', singkatan: '2Tim', total_pasal: 4, urutan: 55 },
  { testament: 'Perjanjian Baru', kitab: 'Titus', singkatan: 'Tit', total_pasal: 3, urutan: 56 },
  { testament: 'Perjanjian Baru', kitab: 'Filemon', singkatan: 'Flm', total_pasal: 1, urutan: 57 },
  { testament: 'Perjanjian Baru', kitab: 'Ibrani', singkatan: 'Ibr', total_pasal: 13, urutan: 58 },
  { testament: 'Perjanjian Baru', kitab: 'Yakobus', singkatan: 'Yak', total_pasal: 5, urutan: 59 },
  { testament: 'Perjanjian Baru', kitab: '1 Petrus', singkatan: '1Pet', total_pasal: 5, urutan: 60 },
  { testament: 'Perjanjian Baru', kitab: '2 Petrus', singkatan: '2Pet', total_pasal: 3, urutan: 61 },
  { testament: 'Perjanjian Baru', kitab: '1 Yohanes', singkatan: '1Yoh', total_pasal: 5, urutan: 62 },
  { testament: 'Perjanjian Baru', kitab: '2 Yohanes', singkatan: '2Yoh', total_pasal: 1, urutan: 63 },
  { testament: 'Perjanjian Baru', kitab: '3 Yohanes', singkatan: '3Yoh', total_pasal: 1, urutan: 64 },
  { testament: 'Perjanjian Baru', kitab: 'Yudas', singkatan: 'Yud', total_pasal: 1, urutan: 65 },
  { testament: 'Perjanjian Baru', kitab: 'Wahyu', singkatan: 'Why', total_pasal: 22, urutan: 66 },
];

// Contoh sampel ayat untuk beberapa kitab populer
const AYAT_SAMPEL = {
  Kejadian: [
    { pasal: 1, ayat: 1, teks: 'Pada mulanya Allah menciptakan langit dan bumi.' },
    { pasal: 1, ayat: 2, teks: 'Bumi belum berbentuk dan kosong; gelap gulita menutupi samudera raya, dan Roh Allah melayang-layang di atas permukaan air.' },
    { pasal: 1, ayat: 3, teks: 'Berfirmanlah Allah: "Jadilah terang." Lalu terang itu jadi.' },
    { pasal: 1, ayat: 4, teks: 'Allah melihat bahwa terang itu baik, lalu dipisahkan-Nyalah terang itu dari gelap.' },
    { pasal: 1, ayat: 5, teks: 'Dan Allah menamai terang itu siang, dan gelap itu malam. Jadilah petang dan jadilah pagi, itulah hari pertama.' },
  ],
  Mazmur: [
    { pasal: 23, ayat: 1, teks: 'TUHAN adalah gembalaku, takkan kekurangan aku.' },
    { pasal: 23, ayat: 2, teks: 'Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke air yang tenang;' },
    { pasal: 23, ayat: 3, teks: 'Ia menyegarkan jiwaku. Ia menuntun aku di jalan yang benar oleh karena nama-Nya.' },
    { pasal: 23, ayat: 4, teks: 'Sekalipun aku berjalan dalam lembah kekelaman, aku tidak takut bahaya, sebab Engkau besertaku; gada-Mu dan tongkat-Mu, itulah yang menghibur aku.' },
    { pasal: 23, ayat: 5, teks: 'Engkau menyediakan hidangan bagiku, di hadapan lawanku; Engkau mengurapi kepalaku dengan minyak; pialaku penuh melimpah.' },
    { pasal: 23, ayat: 6, teks: 'Kebajikan dan kemurahan belaka akan mengikuti aku, seumur hidupku; dan aku akan diam dalam rumah TUHAN sepanjang masa.' },
  ],
  Yohanes: [
    { pasal: 1, ayat: 1, teks: 'Pada mulanya adalah Firman; Firman itu bersama-sama dengan Allah dan Firman itu adalah Allah.' },
    { pasal: 1, ayat: 2, teks: 'Ia pada mulanya bersama-sama dengan Allah.' },
    { pasal: 1, ayat: 3, teks: 'Segala sesuatu dijadikan oleh Dia dan tanpa Dia tidak ada suatupun yang telah jadi dari segala yang telah dijadikan.' },
    { pasal: 3, ayat: 16, teks: 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.' },
    { pasal: 14, ayat: 6, teks: 'Kata Yesus kepadanya: "Akulah jalan dan kebenaran dan hidup. Tidak ada seorangpun yang datang kepada Bapa, kalau tidak melalui Aku."' },
  ],
  Filipi: [
    { pasal: 4, ayat: 6, teks: 'Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.' },
    { pasal: 4, ayat: 7, teks: 'Damai sejahtera Allah, yang melampaui segala akal, akan memelihara hati dan pikiranmu dalam Kristus Yesus.' },
    { pasal: 4, ayat: 13, teks: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.' },
  ],
  Roma: [
    { pasal: 8, ayat: 28, teks: 'Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.' },
    { pasal: 8, ayat: 31, teks: 'Sebab itu apakah yang akan kita katakan tentang semuanya itu? Jika Allah di pihak kita, siapakah yang akan melawan kita?' },
  ],
};

const seedAlkitab = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/habits_bible_tracker';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Terhubung ke MongoDB...');

    // Hapus data alkitab lama
    await Alkitab.deleteMany({});
    console.log('[Seed] Data lama dibersihkan...');

    const dataToInsert = DAFTAR_KITAB.map((item) => {
      const ayatList = AYAT_SAMPEL[item.kitab] || [];
      return {
        ...item,
        ayat_list: ayatList,
      };
    });

    await Alkitab.insertMany(dataToInsert);
    console.log(`[Seed] Berhasil memasukkan ${dataToInsert.length} kitab Alkitab!`);

    await mongoose.disconnect();
    console.log('[Seed] Koneksi ditutup.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Terjadi kesalahan:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAlkitab();
}

module.exports = { DAFTAR_KITAB, AYAT_SAMPEL, seedAlkitab };

