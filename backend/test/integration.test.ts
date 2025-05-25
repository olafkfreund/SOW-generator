import request from 'supertest';
import { app } from '../src/index';

describe('Integration Tests', () => {
  it('should create an engineer successfully', async () => {
    const res = await request(app)
      .post('/api/engineers')
      .send({
        name: 'Jane Developer',
        role: 'Full Stack Engineer',
        hourlyRate: 120
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Jane Developer');
  });

  it('should create a calendar entry successfully', async () => {
    const res = await request(app)
      .post('/api/calendar')
      .send({
        engineerId: '1',
        date: '2025-07-01',
        type: 'vacation',
        description: 'Summer break'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.engineerId).toBe('1');
  });

  it('should create a price item successfully', async () => {
    const res = await request(app)
      .post('/api/pricing')
      .send({
        service: 'Docker Containerization',
        price: 2500,
        unit: 'project'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.service).toBe('Docker Containerization');
  });
});
