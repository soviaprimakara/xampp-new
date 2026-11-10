// Script inisialisasi MongoDB untuk Habits Bible Tracker
// Dapat dijalankan di mongosh: mongosh mongodb://localhost:27017/habits_bible_tracker init-mongo.js

db = db.getSiblingDB('habits_bible_tracker');

print('[Init] Membuat index untuk collection `users`...');
db.users.createIndex({ email: 1 }, { unique: true });

print('[Init] Membuat index untuk collection `renungan`...');
db.renungans.createIndex({ user_id: 1, createdAt: -1 });
db.renungans.createIndex({ isi_renungan: 'text', kitab: 'text', ayat_referensi: 'text' });

print('[Init] Membuat index untuk collection `ayat_favorit`...');
db.ayatfavorits.createIndex({ user_id: 1, kitab: 1 });
db.ayatfavorits.createIndex({ user_id: 1, kitab: 1, pasal: 1, ayat: 1 }, { unique: true });

print('[Init] Membuat index untuk collection `progres_bacaan`...');
db.progressbacaans.createIndex({ user_id: 1 }, { unique: true });

print('[Init] Index database habits_bible_tracker berhasil dibuat.');
