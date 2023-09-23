import request from 'supertest';
import app from '../../../src/index'; // Adjust the path as needed
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Model API', function() {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block
  let modelId = '';

  it('should respond with 200 and have a models array on GET /models', async function() {
    const res = await request(app).get('/api/models');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should create a model and respond with 201 and model id on POST /model', async function() {
    const modelData = {
      // Your model data here
    };
    
    const res = await request(app).post('/api/model').send(modelData);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    modelId = res.body.id;
  });

  it('should respond with 200 and the model JSON on GET /model/:id', async function() {
    const res = await request(app).get(`/api/model/${modelId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    // You can add more specific checks for the model JSON properties here
  });

  it('should update the model and respond with 200 on PUT /model/:id', async function() {
    const updatedModelData = {
      // Your updated model data here
    };
    
    const res = await request(app).put(`/api/model/${modelId}`).send(updatedModelData);
    expect(res.status).to.equal(200);
    // Check if the updated data is returned or if necessary, do a GET request to verify updates
  });

  it('should delete the model and respond with 200 on DELETE /model/:id', async function() {
    const res = await request(app).delete(`/api/model/${modelId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', modelId);
  });

  it('should respond with 404 on GET /model/:id with non-existent id', async function() {
    const nonExistentModelId = modelId;
    const res = await request(app).get(`/api/model/${nonExistentModelId}`);
    expect(res.status).to.equal(404);
  });

});