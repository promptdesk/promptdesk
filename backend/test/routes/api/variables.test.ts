import request from 'supertest';
import app from '../../../src/index'; // Adjust the path as needed
import { Variable } from '../../../src/models/mongodb/variable'; // Adjust the path to the Variable model
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';

describe.skip('Variable API', function() {
  this.timeout(10000); // Set timeout to 10 seconds for all tests in this describe block
  
  const variableDbInstance = new Variable();

  // Test data
  const initialVariableData = {
    data: [
      {
        name: "Variable1",
        value: "Value1"
      }
    ]
  };

  // Set up initial data before running tests
  before(async () => {
    await variableDbInstance.createVariables(initialVariableData.data);
  });

  // Clean up data after running tests
  after(async () => {
    await variableDbInstance.deleteVariables();
  });

  it('should respond with 200 and the variable JSON on GET /variables', async function() {
    const res = await request(app).get('/api/variables');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    // You can add more specific checks for the variable JSON properties here
  });

  it('should update the variable and respond with 200 on PUT /variables', async function() {
    const updatedVariableData = {
      // Updated variable data here
    };

    const res = await request(app).put('/api/variables').send(updatedVariableData);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Variable updated successfully');
    // You can perform a GET request here to verify the updates if necessary
  });

});
