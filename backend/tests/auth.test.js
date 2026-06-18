const request = require('supertest');
const app = require('../src/server');
const { sequelize, connectDB } = require('../src/config/database');
const { User } = require('../src/models');

beforeAll(async () => {
  await connectDB();
  // Disable FK checks, truncate, re-enable — works on MySQL
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await User.destroy({ where: {}, truncate: true });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

  await User.create({
    name: 'Test Admin',
    email: 'testadmin@tms.com',
    password: 'Admin@1234',
    role: 'Admin',
    mustResetPassword: false,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  test('POST /api/auth/login - success with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@tms.com', password: 'Admin@1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toBe('testadmin@tms.com');
  });

  test('POST /api/auth/login - fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@tms.com', password: 'WrongPass1' });

    expect(res.statusCode).toBe(401);
    expect(res.body.errorCode).toBe('INVALID_CREDENTIALS');
  });

  test('POST /api/auth/login - fails with invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'Admin@1234' });

    expect(res.statusCode).toBe(400);
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
  });

  test('GET /api/auth/me - requires authentication', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.errorCode).toBe('NO_TOKEN');
  });

  test('GET /api/auth/me - returns user with valid token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@tms.com', password: 'Admin@1234' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('testadmin@tms.com');
  });
});
