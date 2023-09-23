import request from 'supertest';
import '../../../src/models/mongodb/db';
import { Log } from '../../../src/models/mongodb/log';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Log tests', () => {
    const log_db = new Log();
    let log: any;
    let initialCount;

    // Set up initial data before running tests
    before(async () => {
        log = { "message": "Test log message", "status": 200 };
        const response = await log_db.createLog(log);
        log.id = response;
    });

    it('should create a log', async () => {
        expect(log.id).to.be.a('string');
    });

    it('should find a log', async () => {
        const response = await log_db.findLog(log.id);
        expect(response).to.not.equal(null);
        expect(response.id).to.equal(log.id);
    });

    it('should get logs with pagination', async () => {
        const page = 1;
        const limit = 10; // Set a limit for testing
        const response = await log_db.getLogs(page, limit);
        expect(Array.isArray(response)).to.equal(true);
        expect(response.length).to.be.lessThanOrEqual(limit);
    });

});