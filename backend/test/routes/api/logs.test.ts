import request from 'supertest';
import app from '../../../src/index'; // Adjust the path as needed
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Logs API', function() {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block
  let logId = '';

  it('should respond with 200 and have a logs array on GET /logs', async function() {
    const res = await request(app).get('/api/logs').query({ page: 1, limit: 10 });
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should create a log and respond with 201 and log id on POST /logs', async function() {
    const logData = {
      // Your log data here
    };
    
    const res = await request(app).post('/api/logs').send(logData);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    logId = res.body.id;
  });

  it('should respond with 200 and the log JSON on GET /logs/:id', async function() {

    const res = await request(app).get(`/api/logs/${logId}`);
    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    // You can add more specific checks for the log JSON properties here
  });

  it('should respond with 404 on GET /logs/:id with non-existent id', async function() {
    const nonExistentLogId = '6507d3ddb7bf7679fb132df5';
    const res = await request(app).get(`/api/logs/${nonExistentLogId}`);
    expect(res.status).to.equal(404);
  });

});