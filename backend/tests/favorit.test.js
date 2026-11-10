const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Modul Ayat Favorit (T-08)', () => {
  let tokenUserA;
  let tokenUserB;

  beforeEach(async () => {
    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'User A',
      email: 'userA@example.com',
      password: 'password123',
    });
    tokenUserA = resA.body.data.token;

    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'User B',
      email: 'userB@example.com',
      password: 'password123',
    });
    tokenUserB = resB.body.data.token;
  });

  test('T-08: Tambah ayat favorit lalu ambil daftar -> 201 Created & daftar hanya berisi data milik pengguna', async () => {
    // User A menambahkan ayat favorit
    const addRes = await request(app)
      .post('/api/v1/favorit')
      .set('Authorization', `Bearer ${tokenUserA}`)
      .send({
        kitab: 'Filipi',
        pasal: 4,
        ayat: 13,
        teks_ayat: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.success).toBe(true);

    // Ambil daftar favorit User A -> Harus berisi 1 item
    const getResA = await request(app)
      .get('/api/v1/favorit')
      .set('Authorization', `Bearer ${tokenUserA}`);

    expect(getResA.status).toBe(200);
    expect(getResA.body.data.length).toBe(1);
    expect(getResA.body.data[0].kitab).toBe('Filipi');

    // Ambil daftar favorit User B -> Harus kosong (0 item, isolasi data terbukti)
    const getResB = await request(app)
      .get('/api/v1/favorit')
      .set('Authorization', `Bearer ${tokenUserB}`);

    expect(getResB.status).toBe(200);
    expect(getResB.body.data.length).toBe(0);
  });
});

