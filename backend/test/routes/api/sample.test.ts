import request from 'supertest';
import app from '../../../src/index'; // Adjust the path as needed
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { Organization } from '../../../src/models/mongodb/organization'; // Adjust the path as needed
import fs from 'fs';
import path from 'path';
import { Prompt } from '../../../src/models/mongodb/prompt';

describe('Samples API', function() {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block
  let sampleId = '';
  let token = '';
  let organizationId = ''; // You'll need to set this based on your test setup
  let promptId = ''; // Example prompt ID, adjust as necessary
  let prompt:any;

before(async () => {
    const organization_db = new Organization();
    const organization = await organization_db.getOrganization();
    console.log(organization);
    token = organization.keys[0].key;
    organizationId = organization.id; // Assuming organization object has an id
    const prompt_db = new Prompt();
    prompt = await prompt_db.findPromptByName('yoda-test', organization.id);
    promptId = prompt.id;
});

  it('should get samples with pagination', async function() {
    const res = await request(app).get('/api/samples')
      .query({ page: 1, limit: 10, prompt_id: promptId })
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('page');
    expect(res.body).to.have.property('total');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.be.an('array');
    sampleId = res.body.data[0].id; // Assuming the first sample has an id
  });

  it('should patch a sample', async function() {
    const sampleData = {
      status: 'approved'
    };
    const res = await request(app).patch(`/api/samples/${sampleId}`)
      .send(sampleData)
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    // Add any assertions here for the response, if needed
  });

  it('should delete a sample', async function() {
    const res = await request(app).delete(`/api/samples/${sampleId}`)
      .set('Authorization', 'Bearer ' + token);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', sampleId);
  });

});