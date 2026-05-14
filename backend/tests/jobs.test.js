const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jobsRouter = require('../routes/jobs');

const app = express();
app.use(express.json());
app.use('/api/jobs', jobsRouter);

describe('Jobs API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test_db');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/jobs', () => {
    it('should return all jobs', async () => {
      const res = await request(app)
        .get('/api/jobs');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/jobs', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
});