# PANDUAN LENGKAP BACKEND & MATERI RESPONSI UTS
## Proyek: Habits Bible Tracker
**Mata Kuliah:** Pemrograman Web Lanjutan (IF23P1405)  
**Program Studi:** S1 Informatika – Universitas Primakara  
**Dosen Pengampu:** I Made Winardana, S.Kom., M.Kom.  
**Kelompok:** Peace Maker Joy  
**Nama Mahasiswa / Peran:** I Komang Swastika Adnyana (NIM: 2401020075) – *Backend & API Engineer*  
**Rekan Tim:** Sovia Suma’a (NIM: 2401020097) – *Frontend Engineer*  

---

## DAFTAR ISI
1. [Gambaran Umum Proyek & Peran Backend](#1-gambaran-umum-proyek--peran-backend)
2. [Konsep Arsitektur Terpisah (Decoupled Architecture)](#2-konsep-arsitektur-terpisah-decoupled-architecture)
3. [Perancangan Database NoSQL (MongoDB Atlas)](#3-perancangan-database-nosql-mongodb-atlas)
4. [Sistem Autentikasi & Keamanan (JWT & Bcrypt)](#4-sistem-autentikasi--keamanan-jwt--bcrypt)
5. [Spesifikasi & Logika 11 Endpoint RESTful API](#5-spesifikasi--logika-11-endpoint-restful-api)
6. [Struktur Folder & Alur Kode Modular (MVC)](#6-struktur-folder--alur-kode-modular-mvc)
7. [Automated Testing (Jest & Supertest: T-01 s/d T-10)](#7-automated-testing-jest--supertest-t-01-sd-t-10)
8. [Bank Soal Responsi Dosen & Kunci Jawaban Lengkap](#8-bank-soal-responsi-dosen--kunci-jawaban-lengkap)
9. [Panduan Praktis Ujian / Demonstrasi Live](#9-panduan-praktis-ujian--demonstrasi-live)

---

## 1. GAMBARAN UMUM PROYEK & PERAN BACKEND

### Apa itu Habits Bible Tracker?
Aplikasi web pencatat kebiasaan membaca Alkitab yang membantu pengguna:
1. Mengingat posisi bacaan terakhir.
2. Menandai pasal yang sudah selesai dibaca.
3. Menyimpan ayat-ayat Alkitab favorit.
4. Menulis dan mengelola renungan pribadi dari ayat yang dibaca.
5. Melihat ringkasan statistik kemajuan membaca Alkitab secara dinamis.

### Tanggung Jawab Utama Anda (Backend & API Engineer):
- **Database NoSQL**: Merancang skema dokumen MongoDB (Mongoose), indexing, dan seeder data Alkitab.
- **RESTful API**: Membangun 11 endpoint dengan Express.js berformat JSON.
- **Autentikasi & Otorisasi**: Implementasi enkripsi kata sandi Bcrypt dan token JWT pada rute privat.
- **Testing**: Menjamin keandalan API menggunakan pengujian otomatis (Jest & Supertest).

---

## 2. KONSEP ARSITEKTUR TERPISAH (DECOUPLED ARCHITECTURE)

Sistem ini tidak menggunakan arsitektur monolitik (di mana HTML/tampilan digabung langsung dengan backend PHP/Node), melainkan **Decoupled Architecture**:

```text
┌───────────────────────────────────────┐           HTTP REST (JSON / JWT)          ┌───────────────────────────────────────┐
│            FRONTEND LAYER             │ ◄───────────────────────────────────────► │             BACKEND LAYER             │
│          Aplikasi React.js            │                                           │         Node.js & Express.js          │
│        Port: localhost:3000           │                                           │         Port: localhost:5000          │
│   Penanggung Jawab: Sovia Suma'a      │                                           │  Penanggung Jawab: Swastika Adnyana   │
│   Tugas: Tampilan visual, form,       │                                           │  Tugas: Validasi, logika bisnis,      │
│   tombol baca pasal, warna tema       │                                           │  keamanan JWT, CRUD data JSON         │
└───────────────────────────────────────┘                                           └───────────────────────────────────────┘
                                                                                                        │
                                                                                                        │ ODM Mongoose
                                                                                                        ▼
                                                                                    ┌───────────────────────────────────────┐
                                                                                    │            DATABASE LAYER             │
                                                                                    │         MongoDB Atlas (Cloud)         │
                                                                                    │   users, renungan, ayat_favorit,      │
                                                                                    │     progres_bacaan, alkitabs          │
                                                                                    └───────────────────────────────────────┘
```

### Mengapa Memilih Arsitektur Ini? (4 Keuntungan Utama):
1. **Pekerjaan Paralel**: Frontend Engineer dan Backend Engineer dapat bekerja bersamaan asalkan kontrak endpoint API (format JSON request & response) sudah disepakati.
2. **Pengujian Mandiri (Independent Testing)**: Backend dapat diuji secara terisolasi tanpa memerlukan browser atau tampilan grafis (menggunakan Supertest & Postman).
3. **Deployment & Skalabilitas Terpisah**: Frontend dan Backend dapat di-deploy di server terpisah (misalnya Frontend di Vercel, Backend di Render/Railway).
4. **Dukungan Multi-Platform di Masa Depan**: API yang sama dapat dipakai langsung oleh aplikasi Mobile (Flutter/React Native) tanpa mengubah satu baris pun kode logika backend.

---

## 3. PERANCANGAN DATABASE NoSQL (MONGODB ATLAS)

### Mengapa Menggunakan MongoDB (NoSQL) Dibanding MySQL (SQL Relasional)?
1. **Struktur Data Dokumen JSON Alami**: Data renungan, ayat favorit, dan profil pengguna berbentuk dokumen terisolasi per akun pengguna, sangat cocok disimpan dalam format BSON/JSON.
2. **Array Bersarang Tanpa Tabel Relasi Tambahan**: Pada data progres bacaan, daftar pasal selesai (`pasal_selesai`) disimpan sebagai array objek `[{ kitab, pasal, selesai_pada }]` langsung di dalam dokumen pengguna, tanpa perlu membuat tabel relasi tambahan (*junction table*).
3. **Pola Query Cepat (Tanpa JOIN Berat)**: Hampir seluruh query adalah *"ambil data milik pengguna X"*, yang sangat cepat dieksekusi dengan indeks pada `user_id` tanpa operasi JOIN multi-tabel yang membebani memori server.

### Penjelasan 4 Collection Utama + 1 Collection Katalog:

#### 1. Collection `users`
- Menyimpan identitas akun pengguna.
- **Fields:** `_id`, `name`, `email` (unik), `password` (hash Bcrypt), `role` (`admin`/`user`), `createdAt`, `updatedAt`.
- **Indeks:** `email` (Unique Index).

#### 2. Collection `renungan`
- Menyimpan renungan pribadi yang ditulis pengguna.
- **Fields:** `_id`, `user_id` (relasi ke `users._id`), `kitab`, `pasal`, `ayat_referensi`, `isi_renungan`, `createdAt`, `updatedAt`.
- **Indeks:** 
  - Compound Index: `{ user_id: 1, createdAt: -1 }` (mengurutkan renungan pengguna dari yang terbaru).
  - Text Index: `{ isi_renungan: 'text', kitab: 'text', ayat_referensi: 'text' }` (mendukung pencarian kata kunci cepat pada FR-003).

#### 3. Collection `ayat_favorit`
- Menyimpan ayat-ayat Alkitab yang ditandai sebagai favorit oleh pengguna.
- **Fields:** `_id`, `user_id`, `kitab`, `pasal`, `ayat`, `teks_ayat`, `createdAt`.
- **Indeks:**
  - Compound Index: `{ user_id: 1, kitab: 1 }`.
  - Unique Constraint: `{ user_id: 1, kitab: 1, pasal: 1, ayat: 1 }` (mencegah pengguna menyimpan ayat yang sama berulang kali).

#### 4. Collection `progres_bacaan`
- Menyimpan riwayat bacaan pengguna. Kardinalitas **1 : 1** dengan `users`.
- **Fields:** `_id`, `user_id` (unik), `kitab_terakhir`, `pasal_terakhir`, `pasal_selesai` (array objek `{ kitab, pasal, selesai_pada }`), `updatedAt`.
- **Indeks:** `user_id` (Unique Index).

#### 5. Collection `alkitabs` (Data Katalog / Seed)
- Menyimpan daftar 66 kitab (39 Perjanjian Lama, 27 Perjanjian Baru) beserta jumlah pasal dan sampel teks bacaan ayat per pasal (memenuhi batasan sistem bahwa teks Alkitab di-seed di database).

---

## 4. SISTEM AUTENTIKASI & KEAMANAN (JWT & BCRYPT)

### A. Password Hashing dengan Bcrypt
- Kata sandi tidak pernah disimpan dalam bentuk teks biasa (plain text).
- Sebelum disimpan ke MongoDB, Mongoose menjalankan hook `pre('save')`:
  ```javascript
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  ```
- Saat login, password yang diketik dicocokkan menggunakan `bcrypt.compare()`.

### B. Mekanisme JSON Web Token (JWT)
1. Saat pengguna login berhasil, server menandatangani token JWT berisi payload `{ id: user._id, role: user.role }` dengan kunci rahasia `JWT_SECRET`.
2. Token ini dikirim kembali ke frontend dengan masa berlaku 7 hari (`JWT_EXPIRES_IN=7d`).
3. Frontend menyimpan token dan mengirimkannya di setiap request pada header:
   ```http
   Authorization: Bearer <token_jwt>
   ```
4. **Middleware `authMiddleware.js` (`protect`)**:
   - Memeriksa keberadaan header `Authorization`.
   - Melakukan decode dan verifikasi token dengan `jwt.verify()`.
   - Jika valid: Menyuntikkan identitas pengguna ke `req.user = { id, role }` dan meneruskan ke controller.
   - Jika tidak valid / kedaluwarsa / tanpa token: Memotong request dan langsung mengembalikan respons `401 Unauthorized`.

---

## 5. SPESIFIKASI & LOGIKA 11 ENDPOINT RESTful API

Base URL API: `http://localhost:5000/api/v1`

| No | Method | Endpoint | Auth Required | Deskripsi Logika & Status Code |
|:---:|---|---|:---:|---|
| 1 | `POST` | `/auth/register` | Tidak | Memvalidasi input nama, email, dan password min. 6 karakter. Cek email duplikat (`400`). Hash password dan simpan user baru (`201 Created`). |
| 2 | `POST` | `/auth/login` | Tidak | Cek keberadaan email & verifikasi kecocokan password dengan Bcrypt. Jika salah `401 Unauthorized`. Jika benar, terbitkan token JWT (`200 OK`). |
| 3 | `GET` | `/renungan` | Ya (Bearer) | Mengambil daftar renungan milik pengguna login (`req.user.id`). Mendukung query filter: kata kunci `q`, nama `kitab`, rentang tanggal `dari` & `sampai`, `page`, dan `limit`. (`200 OK`). |
| 4 | `POST` | `/renungan` | Ya (Bearer) | Validasi input renungan. Simpan renungan baru yang terikat ke `user_id` pengguna login. (`201 Created`). |
| 5 | `PUT` | `/renungan/:id` | Ya (Bearer) | Mencari renungan berdasarkan ID yang dimiliki user login. Update data. Jika renungan milik user lain atau tidak ditemukan, kembalikan `404 Not Found`. (`200 OK`). |
| 6 | `DELETE`| `/renungan/:id` | Ya (Bearer) | Menghapus renungan milik pengguna login. Return `404 Not Found` jika bukan miliknya. (`200 OK`). |
| 7 | `GET` | `/favorit` | Ya (Bearer) | Mengambil daftar ayat favorit khusus milik pengguna yang login. Support filter kitab dan pencarian teks ayat. (`200 OK`). |
| 8 | `POST` | `/favorit` | Ya (Bearer) | Menambahkan ayat Alkitab ke daftar favorit. Mencegah duplikasi ayat yang sama persis (`400 Bad Request`). (`201 Created`). |
| 9 | `DELETE`| `/favorit/:id` | Ya (Bearer) | Menghapus ayat favorit berdasarkan ID. Return `404` jika tidak ada atau milik user lain. (`200 OK`). |
| 10 | `GET` | `/progress` | Ya (Bearer) | Mengambil data posisi bacaan terakhir dan daftar pasal yang sudah selesai. Jika user baru pertama kali akses, otomatis buatkan dokumen default Kejadian pasal 1. (`200 OK`). |
| 11 | `PUT` | `/progress` | Ya (Bearer) | Memperbarui posisi terakhir dan menandai pasal selesai. Menggunakan pengecekan duplikasi array agar pasal yang sama tidak tercatat ganda. (`200 OK`). |

### Endpoint Pendukung Tambahan:
- `GET /dashboard/stats` (Auth): Menghitung total pasal selesai dibaca, total favorit, total renungan, serta persentase progres Perjanjian Lama & Baru secara realtime (FR-004).
- `GET /alkitab/kitab` (Publik): Mengambil daftar 66 kitab Alkitab dengan filter testament (Perjanjian Lama/Baru).
- `GET /alkitab/:kitab/:pasal` (Publik): Mengambil teks ayat bacaan untuk pasal tertentu.
- `GET /auth/me`, `PUT /auth/profile`, `PUT /auth/password`: Fitur profil dan ganti kata sandi.

---

## 6. STRUKTUR FOLDER & ALUR KODE MODULAR (MVC)

Struktur kode di folder [`backend/`](file:///c:/projek/xampp-new-main/backend):
```text
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Koneksi Mongoose ke MongoDB Atlas + DNS fallback
│   ├── controllers/              # Logika bisnis & manipulasi database
│   │   ├── authController.js     # Logika Register, Login, Profil
│   │   ├── renunganController.js # Logika CRUD & Pencarian Renungan
│   │   ├── favoritController.js  # Logika CRUD Ayat Favorit
│   │   ├── progressController.js # Logika Riwayat & Posisi Bacaan
│   │   ├── dashboardController.js# Perhitungan Statistik Realtime
│   │   └── alkitabController.js  # Penyedia Daftar Kitab & Bacaan Ayat
│   ├── middlewares/              # Penjaga gerbang request HTTP
│   │   ├── authMiddleware.js     # Validasi Header Bearer JWT
│   │   ├── validateMiddleware.js # Penampung error validasi express-validator
│   │   └── errorMiddleware.js    # Penanganan error 404 & Centralized 500
│   ├── models/                   # Skema struktur dokumen MongoDB (Mongoose)
│   │   ├── User.js
│   │   ├── Renungan.js
│   │   ├── AyatFavorit.js
│   │   ├── ProgressBacaan.js
│   │   └── Alkitab.js
│   ├── routes/                   # Pemetaan URL endpoint API
│   │   ├── authRoutes.js
│   │   ├── renunganRoutes.js
│   │   ├── favoritRoutes.js
│   │   ├── progressRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── alkitabRoutes.js
│   │   └── index.js              # Router Agregator (/api/v1)
│   ├── seeds/                    # Script pengisian data awal
│   │   ├── seedAlkitab.js        # Seeder katalog Alkitab
│   │   └── seedDatabase.js       # Seeder lengkap (User, Renungan, Favorit, Progres)
│   ├── app.js                    # Konfigurasi Express, CORS, middleware, portal web
│   └── server.js                 # Entry point server (menjalankan port 5000)
├── database/                     # Berkas backup JSON untuk MongoDB Compass
│   ├── users.json
│   ├── renungan.json
│   ├── ayat_favorit.json
│   ├── progres_bacaan.json
│   └── init-mongo.js
├── tests/                        # Suite automated testing Jest & Supertest
│   ├── setup.js                  # In-memory MongoDB server
│   ├── auth.test.js              # Pengujian T-01 s/d T-05
│   ├── renungan.test.js          # Pengujian T-06 s/d T-07
│   ├── favorit.test.js           # Pengujian T-08
│   └── progress.test.js          # Pengujian T-09 s/d T-10
├── .env                          # Konfigurasi rahasia lokal (Port, Mongo URI, JWT)
├── .env.example                  # Template variabel lingkungan
└── package.json                  # Konfigurasi dependensi & scripts npm
```

### Alur Kerja Sebuah Request (Request Lifecycle):
1. **Client (Browser/React/Postman)** mengirim request HTTP ke `http://localhost:5000/api/v1/renungan`.
2. Request diterima oleh **`app.js`** -> diarahkan ke router di **`routes/index.js`** -> diteruskan ke **`routes/renunganRoutes.js`**.
3. Middleware **`authMiddleware.js`** mengecek token JWT di header. Jika valid, request diteruskan.
4. **`renunganController.js`** memproses permintaan: mengambil data dari model **`Renungan.js`** yang terhubung ke **MongoDB Atlas**.
5. Controller menyusun respons berformat JSON standar:
   ```json
   {
     "success": true,
     "count": 10,
     "data": [ ... ]
   }
   ```
6. Client menerima respons JSON dan menampilkannya pada UI.

---

## 7. AUTOMATED TESTING (JEST & SUPERTEST: T-01 s/d T-10)

Pengujian backend dirancang otomatis menggunakan **Jest** dan **Supertest** dengan bantuan **`mongodb-memory-server`** (database MongoDB virtual sementara di RAM, sehingga pengujian dapat berjalan tanpa mengganggu data asli di cloud Atlas).

| Kode | Modul | Skenario Pengujian | Hasil yang Diharapkan |
|:---:|---|---|---|
| **T-01** | Auth | Registrasi dengan data lengkap & valid | Status `201 Created`, token terbit, password tersimpan dalam bentuk hash Bcrypt (`$2a$10...`). |
| **T-02** | Auth | Registrasi dengan email yang sudah terdaftar | Ditolak dengan status `400 Bad Request` dan pesan "Email sudah terdaftar". |
| **T-03** | Auth | Login dengan email dan password yang benar | Status `200 OK` dan menghasilkan string JWT yang valid. |
| **T-04** | Auth | Login dengan kata sandi yang salah | Ditolak dengan status `401 Unauthorized`. |
| **T-05** | Keamanan | Mengakses rute terproteksi (`/renungan`) tanpa Bearer token | Ditolak langsung oleh middleware dengan status `401 Unauthorized`. |
| **T-06** | Renungan | Tambah renungan dengan data valid vs field kosong | Data valid menghasilkan `201 Created`; data kosong menghasilkan `400 Bad Request`. |
| **T-07** | Renungan | Mengubah atau menghapus renungan milik pengguna lain | Ditolak dengan status `404 Not Found` (mencegah manipulasi data lintas user). |
| **T-08** | Favorit | Menambah ayat favorit lalu mengambil daftar | Status `201 Created`; daftar hanya mengembalikan data milik user tersebut (data terisolasi). |
| **T-09** | Progres | Menandai pasal selesai pada user baru & pasal berulang | Status `200 OK`; array `pasal_selesai` bertambah tanpa ada duplikasi data. |
| **T-10** | Performa | Panggilan request paralel ke endpoint utama | Waktu respons di bawah 500 ms (memenuhi Non-Functional Requirement). |

---

## 8. BANK SOAL RESPONSI DOSEN & KUNCI JAWABAN LENGKAP

Berikut adalah 10 pertanyaan yang paling sering diajukan dosen penguji beserta jawaban yang tepat:

#### 1. Dosen: *"Apa peran kamu di kelompok Peace Maker Joy?"*
> **Jawaban:**  
> *"Peran saya adalah **Backend & API Engineer**. Tanggung jawab utama saya adalah merancang database NoSQL MongoDB, mengembangkan 11 endpoint RESTful API menggunakan Express.js, menerapkan sistem autentikasi JWT dan hashing Bcrypt, serta menyusun skenario automated testing menggunakan Jest dan Supertest."*

#### 2. Dosen: *"Sistem kalian katanya Decoupled Architecture, maksudnya bagaimana?"*
> **Jawaban:**  
> *"Sistem kami memisahkan lapisan Frontend (React.js) dan Backend (Express.js) secara total. Keduanya hanya berkomunikasi melalui protokol HTTP dengan format pertukaran data standar JSON. Backend saya tidak merender halaman web statis melainkan melayani data API murni, sehingga frontend bisa dikerjakan terpisah oleh rekan saya (Sovia) dan backend dapat diuji secara independen."*

#### 3. Dosen: *"Mengapa memilih database NoSQL MongoDB dan bukan MySQL?"*
> **Jawaban:**  
> *"Ada tiga alasan teknis sesuai SRS kami:  
> Pertama, data seperti renungan, ayat favorit, dan progres bacaan berpusat pada satu user dan strukturnya fleksibel menyerupai dokumen JSON.  
> Kedua, pada progres bacaan, daftar pasal yang selesai dibaca berbentuk array objek `[{ kitab, pasal }]` yang dapat disimpan langsung di dalam satu dokumen pengguna tanpa perlu tabel junction relasi tambahan.  
> Ketiga, mayoritas query adalah pencarian berbasis `user_id`, sehingga sangat cepat dioptimalkan dengan indexing tanpa perlu join tabel relasional yang berat."*

#### 4. Dosen: *"Bisa jelaskan 4 Collection yang ada di MongoDB kalian?"*
> **Jawaban:**  
> *"Keempat collection tersebut adalah:  
> 1. `users`: Menyimpan akun pengguna, email unik, dan password ter-hash.  
> 2. `renungan`: Menyimpan renungan pengguna dengan relasi 1:N ke users dan dilengkapi Text Index.  
> 3. `ayat_favorit`: Menyimpan ayat Alkitab yang disukai pengguna dengan relasi 1:N.  
> 4. `progres_bacaan`: Menyimpan posisi terakhir dan array pasal selesai dengan relasi 1:1 ke users."*

#### 5. Dosen: *"Bagaimana kalian menjamin keamanan data dan kata sandi pengguna?"*
> **Jawaban:**  
> *"Pertama, kata sandi di-hash satu arah menggunakan algoritma **Bcrypt** dengan salt 10 rounds saat pre-save Mongoose, sehingga jika database bocor, password tidak bisa dibaca.  
> Kedua, kami menerapkan otentikasi stateless berbasis **JSON Web Token (JWT)**. Setiap endpoint privat dilindungi oleh middleware yang memvalidasi token pada header `Authorization: Bearer <token>`. Jika token tidak ada atau dipalsukan, server langsung merespons 401 Unauthorized."*

#### 6. Dosen: *"Bagaimana backend mencegah User A mengubah atau menghapus data milik User B?"*
> **Jawaban:**  
> *"Saat token JWT diverifikasi, middleware mengekstrak ID pengguna yang login ke `req.user.id`. Saat melakukan operasi update atau delete pada renungan atau favorit, query database kami selalu menyertakan filter ganda: `findOne({ _id: req.params.id, user_id: req.user.id })`. Jika record tidak ditemukan atas nama user tersebut, API mengembalikan `404 Not Found`."*

#### 7. Dosen: *"Bagaimana fitur pencarian dan filter diimplementasikan di backend?"*
> **Jawaban:**  
> *"Fitur pencarian (FR-003) diimplementasikan lewat parameter query di endpoint `GET /api/v1/renungan`:  
> Parameter `q` mencari teks pada `isi_renungan`, `kitab`, atau `ayat_referensi` dengan Text Index dan regex case-insensitive.  
> Parameter `kitab` memfilter nama kitab tertentu.  
> Parameter `dari` dan `sampai` memfilter rentang tanggal pembuatan dokumen menggunakan operator `$gte` dan `$lte` pada field `createdAt`."*

#### 8. Dosen: *"Bagaimana cara kerja penandaan pasal selesai pada progres bacaan agar tidak duplikat?"*
> **Jawaban:**  
> *"Di `progressController.js`, sebelum menambahkan pasal baru ke dalam array `pasal_selesai`, sistem melakukan pengecekan dengan method `.some()` untuk memastikan kombinasi `kitab` dan `pasal` tersebut belum pernah ada di riwayat. Jika belum ada, data di-push; jika sudah ada, sistem tidak menduplikasinya dan tetap mengembalikan status 200 OK."*

#### 9. Dosen: *"Di mana database kalian di-host saat ini?"*
> **Jawaban:**  
> *"Database kami sudah online di cloud menggunakan **MongoDB Atlas** (Cluster AWS di kawasan Asia Tenggara/Singapore). Hal ini memungkinkan backend lokal saya maupun aplikasi frontend rekan saya dapat terhubung secara realtime ke sumber data yang sama tanpa perlu berada dalam satu jaringan lokal."*

#### 10. Dosen: *"Bagaimana cara kamu menguji endpoint yang sudah dibuat?"*
> **Jawaban:**  
> *"Pertama, secara otomatis menggunakan **Jest dan Supertest** dengan 10 skenario pengujian unit & integration test.  
> Kedua, kami memiliki dokumentasi API resmi di **Postman**.  
> Ketiga, saya membangun portal live testing langsung di root server `http://localhost:5000` di mana kita bisa menguji login, cek data kitab, dan statistik dashboard langsung dari browser."*

---

## 9. PANDUAN PRAKTIS UJIAN / DEMONSTRASI LIVE

### Perintah Terminal yang Perlu Anda Ketahui:

1. **Menyalakan Server Backend (Mode Development):**
   ```bash
   cd backend
   npm run dev
   ```
   *Output normal:*
   ```text
   [MongoDB] Terhubung: ac-vftqzhn-shard-00-00.txzb0n8.mongodb.net/habits_bible_tracker
   =======================================================
    Habits Bible Tracker REST API Server Aktif
    Port    : 5000
    Base API: http://localhost:5000/api/v1
   =======================================================
   ```

2. **Menjalankan Seeder (Jika Data Ingin Direset Ulang):**
   ```bash
   npm run seed
   ```

3. **Menjalankan Automated Testing:**
   ```bash
   npm test
   ```

### Alur Demonstrasi di Depan Dosen:
1. Jalankan `npm run dev` di terminal VS Code Anda.
2. Buka browser dan ketik: `http://localhost:5000`.
3. Tunjukkan ke dosen tampilan **Backend API Portal** kelompok Anda.
4. Klik tombol **"🔑 1. Test Login (Admin Swastika)"** -> Tunjukkan respons token JWT yang dihasilkan.
5. Klik tombol **"📊 2. Cek Statistik Dashboard"** -> Tunjukkan ringkasan data dinamis dari MongoDB Atlas.
6. Klik tombol **"📖 3. Daftar Kitab Alkitab"** -> Tunjukkan 66 kitab yang sudah di-seed.
7. Jelaskan bahwa seluruh data tersebut tersimpan aman secara online di cloud database MongoDB Atlas!
