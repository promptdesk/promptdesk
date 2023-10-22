import request from 'supertest';
import app from '../src/index'
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Express App Server', () => {
  it('should respond with pong on GET /', (done) => {
    request(app)
      .get('/api/ping')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Assert that the response contains the expected text
        if (res.text === 'pong') {
          done();
        } else {
          done(new Error('Unexpected response text'));
        }
      });
  });
});