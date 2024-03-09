// app.test.js

const request = require('supertest');
const app = require('../app');
const models = require('../models');

describe('GET /hi', () => {
  test('responds with JSON message', async () => {
    const response = await request(app).get('/hi');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Success!!' });
  });
});

describe('POST /createuser', () => {
  beforeEach(async () => {
    // 테스트용 데이터베이스 초기화
    await models.User.destroy({ truncate: true });
  });

  it('creates a new user', async () => {
    const userData = {
      name: 'John',
      age: 30
    };

    const response = await request(app)
      .post('/createuser')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'success' });

    // 테스트 후 데이터베이스 상태 확인
    const users = await models.User.findAll();
    expect(users.length).toBe(1);
    expect(users[0].name).toBe(userData.name);
    expect(users[0].age).toBe(userData.age);
  });
});
