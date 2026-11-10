const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Modul Renungan (T-06 s/d T-07)', () => {
  let tokenUserA;
  let tokenUserB;

  beforeEach(async () => {
    // Buat User A
    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'User A',
      email: 'userA@example.com',
      password: 'password123',
    });
    tokenUserA = resA.body.data.token;

    // Buat User B
    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'User B',
      email: 'userB@example.com',
      password: 'password123',
    });
    tokenUserB = resB.body.data.token;
  });

  test('T-06: Tambah renungan valid (201 Created) dan tidak valid (400 Bad Request)', async () => {
    // 1. Data valid
    const resValid = await request(app)
      .post('/api/v1/renungan')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        kitab: 'Yohanes',
        pasal: 3,
        ayat_referensi: '16',
        isi_renungan: 'Kasih Allah begitu nyata dan tanpa syarat.',
      });

    expect(resValid.status).toBe(201);
    expect(resValid.body.success).toBe(true);
    expect(resValid.body.data.kitab).toBe('Yohanes');

    // 2. Data tidak valid (field kosong)
    const resInvalid = await request(app)
      .post('/api/v1/renungan')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        kitab: '',
        pasal: 0,
      });

    expect(resInvalid.status).toBe(400);
    expect(resInvalid.body.success).toBe(false);
  });

  test('T-07: Ubah atau hapus renungan milik pengguna lain -> 404 Not Found', async () => {
    // User A membuat renungan
    const createRes = await request(app)
      .post('/api/v1/renungan')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        kitab: 'Mazmur',
        pasal: 23,
        ayat_referensi: '1-6',
        isi_renungan: 'Tuhan adalah gembalaku.',
      });

    const renunganId = createRes.body.data._id;

    // User B mencoba mengubah renungan milik User A
    const updateRes = await request(app)
      .put(`/api/v1/renungan/${renunganId}`)
      .set('Authorization', `Bearer ${tokenUserB}`)
      .send({
        isi_renungan: 'Mencoba meretas renungan orang lain',
      });

    expect(updateRes.status).toBe(404);
    expect(updateRes.body.success).toBe(false);

    // User B mencoba menghapus renungan milik User A
    const deleteRes = await request(app)
      .delete(`/api/v1/renungan/${renunganId}`)
      .set('Authorization', `Bearer ${tokenUserB}`);

    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.success).toBe(false);
  });
});

