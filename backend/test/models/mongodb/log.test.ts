import request from 'supertest';
import '../../../src/models/mongodb/db';
import { Log } from '../../../src/models/mongodb/log';
import { Organization } from '../../../src/models/mongodb/organization';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Log tests', () => {
    const log_db = new Log();
    let log: any;
    let organization_db = new Organization();
    let organization: any;
    let initialCount;

    // Set up initial data before running tests
    before(async () => {
        organization = await organization_db.getOrganization();
        log = { "message": "Test log message", "status": 200 };
        const response = await log_db.createLog(log, organization.id);
        log.id = response;
    });

    it('should create a log', async () => {
        expect(log.id).to.be.a('string');
    });

    it('should find a log', async () => {
        const response = await log_db.findLog(log.id, organization.id);
        expect(response).to.not.equal(null);
        expect(response.id).to.equal(log.id);
    });

    it('should get logs with pagination', async () => {
        const page = 1;
        const limit = 10; // Set a limit for testing
        const response = await log_db.getLogs(page, limit, organization.id);
        expect(Array.isArray(response.data)).to.equal(true);
        expect(response.data.length).to.be.lessThanOrEqual(limit);
    });

});