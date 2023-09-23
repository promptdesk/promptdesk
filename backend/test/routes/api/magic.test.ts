import request from 'supertest';
import app from '../../../src/index'
import { expect } from 'chai';
import { describe, it } from 'mocha';
import axios from 'axios';

var payload = {
  "model": "6507d2b59df2cc0108a9ab1e",
  "prompt_parameters": {
      "max_tokens": 700,
      "temperature": "0.26",
      "top_p": "0"
  },
  "prompt_data": {
      "context": "Act as Yoda from Star Wars.",
      "messages": [
          {
              "role": "user",
              "content": "Hello, how are you??"
          }
      ]
  },
  "id": "6507d3ddb7bf7679fb132df5"
}

describe('Express App Server', async () => {
  it('should respond with 200 on POST /api/magic/generate', async function() {
    this.timeout(10000); // Set timeout to 10 seconds

    const res = await request(app).post('/api/magic').send(payload);
    expect(res.status).to.equal(200);

    //expect the following keys to be present in the response body
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('message');
    expect(res.body.data).to.have.property('error');
    expect(res.body.data).to.have.property('raw_response');
    expect(res.body.data).to.have.property('raw_request');
    expect(res.body.data).to.have.property('status');
    expect(res.body.data).to.have.property('model_id');
    expect(res.body.data).to.have.property('prompt_id');

  });
});