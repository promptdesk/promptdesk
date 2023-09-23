import { expect } from 'chai';
import { describe, it } from 'mocha';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import request from 'supertest';
import connectToDatabase from '../../../src/models/mongodb/db';

dotenv.config({ path: '../.env' });

describe('MongoDB Database Connection', () => {
  before(async () => {
    // Ensure the mongoose default connection is closed before the tests
    await mongoose.connection.close();
  });

  it('should successfully connect to the database', async () => {
    const result = await connectToDatabase();
    expect(result).to.equal("CONNECTED");
  });

  after(async () => {
    // Close the mongoose connection after all tests are done
    //await mongoose.connection.close();
  });
});