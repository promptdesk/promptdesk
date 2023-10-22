import request from 'supertest';
import app from '../../../src/index'; // Adjust the path as needed
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Organization } from '../../../src/models/mongodb/organization';

describe('Prompt API', function() {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block
  let promptId = '';
  let token = '';
  const organization_db = new Organization();

  before(async () => {
    const organization = await organization_db.getOrganization();
    token = organization.keys[0].key
  })

  it('should respond with 200 and have a prompts array on GET /prompts', async function() {
    const res = await request(app).get('/api/prompts').set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should create a prompt and respond with 201 and prompt id on POST /prompt', async function() {
    const promptData = {
      // Your prompt data here
    };
    
    const res = await request(app).post('/api/prompt').send(promptData).set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    promptId = res.body.id;
  });

  it('should respond with 200 and the prompt JSON on GET /prompt/:id', async function() {
    const res = await request(app).get(`/api/prompt/${promptId}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    // You can add more specific checks for the prompt JSON properties here
  });

  it('should update the prompt and respond with 200 on PUT /prompt/:id', async function() {
    const updatedPromptData = {
      // Your updated prompt data here
    };
    
    const res = await request(app).put(`/api/prompt/${promptId}`).send(updatedPromptData).set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    // Check if the updated data is returned or if necessary, do a GET request to verify updates
  });

  it('should delete the prompt and respond with 200 on DELETE /prompt/:id', async function() {
    const res = await request(app).delete(`/api/prompt/${promptId}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', promptId);
  });

  it('should respond with 404 on GET /prompt/:id with non-existent id', async function() {
    const nonExistentPromptId = promptId;
    const res = await request(app).get(`/api/prompt/${nonExistentPromptId}`).set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(404);
  });

});