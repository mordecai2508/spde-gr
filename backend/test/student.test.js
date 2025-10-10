const request = require('supertest');
const app = require('../src/app');

describe('Student CRUD', () => {
  it('should create a student', async () => {
    const res = await request(app)
      .post('/api/students')
      .send({ first_name: 'John', last_name: 'Doe', student_code: 'ST001', /* ... */ });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
});