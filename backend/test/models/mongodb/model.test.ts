import request from 'supertest';
import '../../../src/models/mongodb/db';
import { Model } from '../../../src/models/mongodb/model';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Mongodb tests', () => {
    const model_db = new Model();
    let model:any;
    let initialCount:number;

    // Set up initial data before running tests
    before(async () => {
        initialCount = await model_db.countModels();
        model = { "name": "model_test" };
        const model_id = await model_db.createModel(model);
        model.id = model_id;
    });

    // Clean up after running tests
    after(async () => {
        await model_db.deleteModel(model.id);
    });

    it('should count initial models', async () => {
        expect(initialCount).to.be.a('number');
    });

    it('should find a model', async () => {
        const response = await model_db.findModel(model.id);
        expect(response).to.not.equal(null);
        expect(response.id).to.equal(model.id);
    });

    it('should update a model', async () => {
        model.name = "model_test_updated";
        await model_db.updateModelById(model);
        const response = await model_db.findModel(model.id);
        expect(response).to.not.equal(null);
        expect(response.name).to.equal(model.name);
    });

    it('should delete a model', async () => {
        const response = await model_db.deleteModel(model.id);
        expect(response).to.not.equal(null);
        expect(response).to.equal(model.id);
    });

    it('should count models', async () => {
        const response = await model_db.countModels();
        expect(response).to.equal(initialCount);
    });

    it('should list models', async () => {
        const response = await model_db.listModels();
        expect(Array.isArray(response)).to.equal(true);
    });
});