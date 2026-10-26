# Proyek UTS 
# Habits Bible Tracker

Aplikasi web pencatat kebiasaan membaca Alkitab. Membantu pembaca mengingat posisi bacaan terakhir, menandai pasal yang sudah dibaca, menyimpan ayat favorit, dan menulis renungan pribadi.

Proyek UTS mata kuliah **Pemrograman Web Lanjutan (IF23P1405)**, Teknik Informatika, Universitas Primakara, TA 2026/2027.
Kelompok: **Peace Maker Joy**

## Tim

| Peran | Nama | NIM |
|---|---|---|
| Project Lead & Integration Engineer | I Komang Swastika Adnyana dan Sovia Suma'a | 2401020075, 2401020097 |
| Backend & API Engineer | I Komang Swastika Adnyana | 2401020075 |
| Frontend Engineer | Sovia Suma'a | 2401020097 |

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Frontend | React.js |
| Backend REST API | Node.js, Express.js |
| Database | MongoDB (NoSQL) |
| Autentikasi | JSON Web Token (JWT), Bcrypt |
| Pengujian | Jest, Supertest |

Arsitektur: **Decoupled System** (frontend dan backend terpisah, berkomunikasi lewat REST API berformat JSON).

## Fitur Utama

- Registrasi dan login dengan JWT (FR-001)
- Progres bacaan, renungan, dan ayat favorit (CRUD) (FR-002)
- Pencarian dan filter data (FR-003)
- Dashboard statistik bacaan (FR-004)

## Struktur Repositori

```
backend/    # REST API (Node.js, Express, MongoDB)
frontend/   # Antarmuka pengguna (React.js)
docs/       # Dokumen SRS/SDS, laporan, dan presentasi
```

## Alur Git (Git Flow)

| Branch | Fungsi |
|---|---|
| `main` | Kode stabil, siap didemokan |
| `development` | Cabang integrasi semua fitur |
| `feature/*` | Satu branch per fitur, contoh `feature/auth-jwt` |

Setiap fitur dikerjakan di feature branch, digabung ke `development` lewat pull request, dan `main` hanya diperbarui dari `development` setelah pengujian lolos.

## Tautan Proyek

- Mockup Figma: https://www.figma.com/design/PjeclfvZBwjs2PwIa5FX8q/HABITS-BIBLE-TRACKER
- Dokumentasi API (Postman): https://documenter.getpostman.com/view/59208278/2sBYHUULNZ

## Status

Tahap UTS: perancangan (SRS/SDS, mockup, timeline, repositori). Implementasi backend direncanakan W8-W10 dan frontend W11-W13.
