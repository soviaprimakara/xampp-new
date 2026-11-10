# Habits Bible Tracker - Backend REST API

RESTful API backend untuk aplikasi **Habits Bible Tracker**, dirancang dan dikembangkan untuk Ujian Tengah Semester (UTS) mata kuliah **Pemrograman Web Lanjutan**, Universitas Primakara.

- **Kelompok**: Peace Maker Joy
- **Backend & API Engineer**: I Komang Swastika Adnyana (NIM: 2401020075)
- **Arsitektur**: Decoupled System (Node.js, Express.js, MongoDB, Mongoose, JWT, Jest, Supertest)

---

##  Fitur Utama

1. **FR-001 (Autentikasi & Keamanan)**:
   - Registrasi pengguna & login dengan enkripsi kata sandi (Bcrypt).
   - JSON Web Token (JWT) pada header `Authorization: Bearer <token>`.
   - Profil pengguna & perubahan kata sandi.
2. **FR-002 (CRUD Progres Bacaan, Ayat Favorit, dan Renungan Pribadi)**:
   - Pencatatan posisi bacaan terakhir dan checklist pasal selesai tanpa duplikasi.
   - Manajemen ayat Alkitab favorit per pengguna.
   - Penulisan, pembacaan, pengubahan, dan penghapusan renungan pribadi.
3. **FR-003 (Pencarian & Filtering)**:
   - Filter renungan berdasarkan kata kunci (`q`), nama kitab, dan rentang tanggal (`dari` & `sampai`).
   - Filter ayat favorit berdasarkan kitab dan kata kunci pencarian.
   - Pagination (`page` & `limit`) serta sorting dinamis.
4. **FR-004 (Dashboard & Monitoring)**:
   - Ringkasan statistik realtime: jumlah pasal dibaca, ayat favorit, renungan, persentase kemajuan Perjanjian Lama dan Baru.
5. **Katalog Kitab & Bacaan Alkitab**:
   - Seed 66 kitab (39 Perjanjian Lama + 27 Perjanjian Baru) dan teks ayat bacaan per pasal.

---

##  Struktur Direktori

```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Koneksi Mongoose ke MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Registrasi, Login, Profil
│   │   ├── renunganController.js # CRUD & Pencarian Renungan
│   │   ├── favoritController.js  # CRUD Ayat Favorit
│   │   ├── progressController.js # Progres & Posisi Bacaan
│   │   ├── dashboardController.js# Statistik Dashboard Ringkasan (FR-004)
│   │   └── alkitabController.js  # Katalog Kitab & Teks Bacaan
│   ├── middlewares/
│   │   ├── authMiddleware.js     # Validasi JWT Bearer Token & Role Guard
│   │   ├── validateMiddleware.js # Input sanitasi & validasi error formatter
│   │   └── errorMiddleware.js    # 404 Handler & Centralized Exception Handler
│   ├── models/
│   │   ├── User.js               # Skema Pengguna & Bcrypt Hooks
│   │   ├── Renungan.js           # Skema Renungan (Text & Compound Indexes)
│   │   ├── AyatFavorit.js        # Skema Ayat Favorit (Compound Index)
│   │   ├── ProgressBacaan.js     # Skema Progres Bacaan (1:1 per user)
│   │   └── Alkitab.js            # Skema Daftar Kitab & Sampel Ayat
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── renunganRoutes.js
│   │   ├── favoritRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── alkitabRoutes.js
│   │   └── index.js              # Router agregator (/api/v1)
│   ├── seeds/
│   │   └── seedAlkitab.js        # Seeder daftar kitab & ayat
│   ├── app.js                    # Inisialisasi Express & middleware
│   └── server.js                 # Entry point server (port listener)
├── tests/
│   ├── setup.js                  # In-Memory MongoDB Server untuk testing
│   ├── auth.test.js              # Skenario T-01 s/d T-05
│   ├── renungan.test.js          # Skenario T-06 s/d T-07
│   ├── favorit.test.js           # Skenario T-08
│   └── progress.test.js          # Skenario T-09 s/d T-10
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Instalasi & Menjalankan Server

### 1. Masuk ke direktori backend
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi dalam `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/habits_bible_tracker
JWT_SECRET=supersecretjwtkey_habits_bible_tracker_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 4. Menjalankan Inisialisasi & Seeder Database (MongoDB)
Untuk mengisi database dengan seluruh collection, data dummy pengguna, renungan, ayat favorit, progres bacaan, serta 66 kitab Alkitab:
```bash
npm run seed
```
> **Akun Pengguna Default**:
> - Email: `swastika@primakara.ac.id` | Kata Sandi: `password123` (Admin)
> - Email: `sovia@primakara.ac.id` | Kata Sandi: `password123` (User)
> - Email: `demo@peacemakerjoy.com` | Kata Sandi: `password123` (User)

Tersedia juga file dokumen JSON siap import di folder `backend/database/` untuk MongoDB Compass:
- `database/users.json`
- `database/renungan.json`
- `database/ayat_favorit.json`
- `database/progres_bacaan.json`
- `database/init-mongo.js` (Script pembuatan index untuk mongosh / shell)

### 5. Jalankan Server
- Mode Development (Auto reload dengan Nodemon):
  ```bash
  npm run dev
  ```
- Mode Production:
  ```bash
  npm start
  ```

---

##  Menjalankan Automated Testing (Jest & Supertest)

Pengujian backend ini menggunakan **`mongodb-memory-server`**, sehingga Anda dapat menjalankan test otomatis **tanpa memerlukan instalasi atau koneksi MongoDB eksternal**:

```bash
npm test
```

### Pemenuhan Tabel Skenario Pengujian (SRS/SDS):
- **T-01**: Registrasi valid (201 Created & Bcrypt Hash)
- **T-02**: Registrasi duplikat email (400 Bad Request)
- **T-03**: Login valid (200 OK & JWT valid)
- **T-04**: Login password salah (401 Unauthorized)
- **T-05**: Akses endpoint terproteksi tanpa Bearer token (401 Unauthorized)
- **T-06**: Tambah renungan valid & invalid (201 & 400)
- **T-07**: Proteksi akses ubah/hapus data milik user lain (404 Not Found)
- **T-08**: Tambah ayat favorit & isolasi data per user (201)
- **T-09**: Tandai pasal selesai pada dokumen baru & pencegahan duplikasi (200 OK)
- **T-10**: Pengujian performa response time (< 500 ms)

---

##  Daftar Endpoint RESTful API (Base URL: `/api/v1`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/auth/register` | No | Registrasi pengguna baru |
| `POST` | `/auth/login` | No | Login pengguna & penerbitan JWT |
| `GET` | `/auth/me` | Bearer | Mendapatkan profil pengguna saat ini |
| `PUT` | `/auth/profile` | Bearer | Memperbarui nama/profil |
| `PUT` | `/auth/password` | Bearer | Mengubah kata sandi |
| `GET` | `/renungan` | Bearer | List renungan (+ filter `q`, `kitab`, `dari`, `sampai`, `page`, `limit`) |
| `POST` | `/renungan` | Bearer | Menambah renungan baru |
| `GET` | `/renungan/:id` | Bearer | Detail satu renungan |
| `PUT` | `/renungan/:id` | Bearer | Mengubah renungan |
| `DELETE` | `/renungan/:id` | Bearer | Menghapus renungan |
| `GET` | `/favorit` | Bearer | List ayat favorit (+ filter `kitab`, `q`, `page`, `limit`) |
| `POST` | `/favorit` | Bearer | Menambah ayat ke favorit |
| `DELETE` | `/favorit/:id` | Bearer | Menghapus ayat dari favorit |
| `GET` | `/progress` | Bearer | Mendapatkan posisi terakhir & riwayat pasal selesai |
| `PUT` | `/progress` | Bearer | Memperbarui posisi & mencatat pasal selesai |
| `GET` | `/dashboard/stats` | Bearer | Ringkasan statistik dashboard dinamis (FR-004) |
| `GET` | `/alkitab/kitab` | No | Daftar 66 kitab (+ filter `testament`, `q`) |
| `GET` | `/alkitab/:kitab/:pasal` | No | Teks bacaan ayat per pasal |

