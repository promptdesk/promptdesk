import request from 'supertest';
import app from '../src/index'
import { expect } from 'chai';


describe('Express App Tests', () => {
  it('should respond with "INFO :: Root route called" on GET /', (done) => {
    request(app)
      .get('/ping')
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