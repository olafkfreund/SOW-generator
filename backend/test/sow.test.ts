import request from 'supertest';
import { app } from '../src/index';

describe('SOW API', () => {
  it('should return placeholder on GET /api/sow', async () => {
    const res = await request(app).get('/api/sow');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should require file upload for SOW generation', async () => {
    const res = await request(app)
      .post('/api/sow/generate')
      .send({ 
        projectName: 'Test Project',
        description: 'A test project description'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'No document uploaded');
  });
});

describe('Engineers API', () => {
  it('should return engineers list', async () => {
    const res = await request(app).get('/api/engineers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should accept POST to add engineer', async () => {
    const res = await request(app)
      .post('/api/engineers')
      .send({
        name: 'John Doe',
        role: 'Senior Developer'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'John Doe');
  });
});

describe('Calendar API', () => {
  it('should return calendar entries', async () => {
    const res = await request(app).get('/api/calendar');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Pricing API', () => {
  it('should return pricing list', async () => {
    const res = await request(app).get('/api/pricing');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
