import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import mongoose from 'mongoose';
import { Organization } from '../../../src/models/mongodb/organization'; // Adjust the path as needed
import { Sample } from '../../../src/models/mongodb/sample'; // Adjust the path as needed
import { canonical_json_stringify } from '../../../src/utils/canonicalJson'; // Adjust the path as needed
import crypto from 'crypto';

describe('Sample tests', () => {
    const sampleModel = new Sample();
    let organization_db = new Organization();
    let organization: any;
    let sample: any;
    let promptId = "abcdefg1234567"; // Example prompt ID
    let variables = { key: 'value' }; // Example variables
    let prompt = { question: 'What is the meaning of life?' }; // Example prompt
    let result = '42'; // Example result

    // Set up initial data before running tests
    before(async () => {
        organization = await organization_db.getOrganization();
    });

    it('should record sample data if needed', async () => {
        // Use the recordSampleDataIfNeeded function to insert or update the sample data
        await sampleModel.recordSampleDataIfNeeded(variables, prompt, result, promptId, organization.id);

        // Compute the hash to verify the record was inserted correctly
        const hashJsonString = canonical_json_stringify(variables);
        const hash = crypto.createHash('sha256').update(hashJsonString).digest('hex');

        // Find the sample in the database
        const sampleInDb = await mongoose.model('Sample').findOne({ hash, prompt_id: promptId, organization_id: organization.id });
        expect(sampleInDb).to.not.be.null;
        sample = sampleInDb; // Save for further tests
    });

    it('should get samples with pagination', async () => {
        const { data, page, per_page, total, total_pages } = await sampleModel.getSamples(1, 10, organization.id, promptId);
        expect(data).to.be.an('array');
        expect(page).to.equal(1);
        expect(per_page).to.equal(10);
        expect(total).to.be.a('number');
        expect(total_pages).to.be.a('number');
        if (data.length > 0) {
            expect(data[0].id).to.be.a('string');
        }
    });

    it('should patch a sample', async () => {
        const changes = { status: 'approved' };
        await sampleModel.patchSample(sample._id.toString(), changes, organization.id);

        const updatedSample = await mongoose.model('Sample').findOne({ _id: sample._id });
        expect(updatedSample.status).to.equal('approved');
        expect(updatedSample.sort_order).to.equal(2);
    });

    it('should delete a sample', async () => {
        const deletedId = await sampleModel.deleteSample(sample._id.toString(), organization.id);
        expect(deletedId).to.equal(sample._id.toString());

        const sampleInDb = await mongoose.model('Sample').findOne({ _id: sample._id });
        expect(sampleInDb).to.be.null;
    });
});