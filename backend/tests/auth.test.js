const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
require('./setup');

describe('Modul Autentikasi & Keamanan JWT (T-01 s/d T-05)', () => {
  const sampleUser = {
    name: 'I Komang Swastika Adnyana',
    email: 'swastika@primakara.ac.id',
    password: 'PasswordRahasia123',
  };

  test('T-01: Registrasi dengan data valid -> 201 Created & password di-hash', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(sampleUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(sampleUser.email);
    expect(res.body.data.token).toBeDefined();

    // Verifikasi password tersimpan di database dalam bentuk hash
    const savedUser = await User.findOne({ email: sampleUser.email }).select('+password');
    expect(savedUser).not.toBeNull();
    expect(savedUser.password).not.toBe(sampleUser.password);
    expect(savedUser.password.startsWith('$2')).toBe(true);
  });

  test('T-02: Registrasi dengan email yang sudah terdaftar -> 400 Bad Request', async () => {
    // Daftarkan pengguna pertama
    await request(app).post('/api/v1/auth/register').send(sampleUser);

    // Coba daftarkan kembali dengan email yang sama
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Pengguna Kloning',
        email: sampleUser.email,
        password: 'PasswordLain123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/sudah terdaftar/i);
  });

  test('T-03: Login dengan kredensial benar -> 200 OK & JWT token valid', async () => {
    await request(app).post('/api/v1/auth/register').send(sampleUser);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: sampleUser.email,
        password: sampleUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
  });

  test('T-04: Login dengan password salah -> 401 Unauthorized', async () => {
    await request(app).post('/api/v1/auth/register').send(sampleUser);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: sampleUser.email,
        password: 'PasswordSalahTotal',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/kredensial tidak valid/i);
  });

  test('T-05: Akses endpoint terproteksi tanpa header Bearer -> 401 Unauthorized', async () => {
    // Coba akses endpoint renungan tanpa Authorization header
    const res = await request(app).get('/api/v1/renungan');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/akses ditolak/i);
  });
});

