import '../../../src/models/mongodb/db';
import { Prompt } from '../../../src/models/mongodb/prompt';
import { Organization } from '../../../src/models/mongodb/organization';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Mongodb tests for Prompt', () => {
    const prompt_db = new Prompt();
    const organization_db = new Organization();
    let organization:any;
    let prompt:any;
    let initialCount:number;

    // Set up initial data before running tests
    before(async () => {
        organization = await organization_db.getOrganization();
        initialCount = await prompt_db.countPrompts(organization.id); // Assuming you have a countPrompts method
        prompt = { "name": "prompt_test" };
        const response = await prompt_db.createPrompt(prompt, organization.id);
        prompt.id = response;
    });

    // Clean up after running tests
    after(async () => {
        await prompt_db.deletePrompt(prompt.id, organization.id);
    });

    it('should count initial prompts', async () => {
        expect(initialCount).to.be.a('number');
    });

    it('should find a prompt', async () => {
        const response = await prompt_db.findPrompt(prompt.id, organization.id);
        expect(response).to.not.equal(null);
        expect(response.id).to.equal(prompt.id);
    });

    it('should update a prompt', async () => {
        prompt.name = "prompt_test_updated";
        await prompt_db.updatePrompt(prompt, organization.id);
        const response = await prompt_db.findPrompt(prompt.id, organization.id);
        expect(response).to.not.equal(null);
        expect(response.name).to.equal(prompt.name);
    });

    it('should delete a prompt', async () => {
        const response = await prompt_db.deletePrompt(prompt.id, organization.id);
        expect(response).to.not.equal(null);
        expect(response).to.equal(prompt.id);
    });

    it('should count prompts', async () => {
        const response = await prompt_db.countPrompts(organization.id);
        expect(response).to.equal(initialCount);
    });

    it('should list prompts', async () => {
        const response = await prompt_db.listPrompts(organization.id);
        expect(Array.isArray(response)).to.equal(true);
    });
});
