import { expect } from 'chai';
import { describe, it } from 'mocha';
import mongoose from 'mongoose';
import request from 'supertest';
import connectToDatabase from '../../../src/models/mongodb/db';

describe('MongoDB Database Connection', () => {
  before(async () => {
    await mongoose.connection.close();
  });

  it('should successfully connect to the database', async () => {
    const result = await connectToDatabase();
    expect(result).to.equal("CONNECTED");
  });

});