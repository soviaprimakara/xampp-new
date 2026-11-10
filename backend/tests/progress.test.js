const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Modul Progres Bacaan & Performa (T-09 s/d T-10)', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Pembaca Alkitab',
      email: 'reader@example.com',
      password: 'password123',
    });
    token = res.body.data.token;
  });

  test('T-09: Tandai pasal selesai, termasuk saat dokumen progres belum ada -> 200 OK & tanpa duplikat', async () => {
    // 1. Tandai saat dokumen progres belum pernah dibuat sama sekali
    const res1 = await request(app)
      .put('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kitab: 'Kejadian',
        pasal: 1,
      });

    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);
    expect(res1.body.data.pasal_selesai.length).toBe(1);
    expect(res1.body.data.pasal_selesai[0].kitab).toBe('Kejadian');
    expect(res1.body.data.pasal_selesai[0].pasal).toBe(1);

    // 2. Tandai pasal yang sama lagi -> Tidak boleh ada duplikasi
    const res2 = await request(app)
      .put('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kitab: 'Kejadian',
        pasal: 1,
      });

    expect(res2.status).toBe(200);
    expect(res2.body.data.pasal_selesai.length).toBe(1); // Tetap 1, tidak bertambah 2!

    // 3. Tandai pasal baru
    const res3 = await request(app)
      .put('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        kitab: 'Kejadian',
        pasal: 2,
      });

    expect(res3.status).toBe(200);
    expect(res3.body.data.pasal_selesai.length).toBe(2);
  });

  test('T-10: Panggil endpoint utama di bawah beban simulasi -> Response time < 500 ms', async () => {
    const startTime = Date.now();

    // Lakukan request paralel ke endpoint dashboard stats & alkitab
    const [resStats, resKitab] = await Promise.all([
      request(app).get('/api/v1/dashboard/stats').set('Authorization', `Bearer ${token}`),
      request(app).get('/api/v1/alkitab/kitab'),
    ]);

    const duration = Date.now() - startTime;

    expect(resStats.status).toBe(200);
    expect(resKitab.status).toBe(200);
    expect(duration).toBeLessThan(500); // Harus di bawah 500 ms sesuai NFR
  });
});

