import request from 'supertest';
import '../../../src/models/mongodb/db'; // Make sure to adjust the path to your MongoDB connection setup
import { Variable } from '../../../src/models/mongodb/variable'; // Adjust the path to the Variable model
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Variable tests', () => {
    const variable_db = new Variable();
    let variable:any;

    // Set up initial data before running tests
    before(async () => {
        variable = { "data": [{ "name": "Variable1", "value": "Value1" }] };
        const response = await variable_db.createVariable(variable.data);
        variable.id = response;
    });

    it('should create a variable', async () => {
        expect(variable.id).to.be.a('string');
    });

    it('should find a variable', async () => {
        const response = await variable_db.getVariables();
        expect(response).to.not.equal(null);
    });

    it('should update a variable', async () => {
        const newData = [{ "name": "UpdatedVariable", "value": "UpdatedValue" }];
        await variable_db.updateVariables(newData);
        const updatedVariable = await variable_db.getVariables();
        expect(updatedVariable?.data).to.deep.equal(newData);
    });

    it('should remove all variables', async () => {
        await variable_db.deleteVariables();
        const response = await variable_db.deleteVariables();
        expect(response).to.equal(undefined);
    })

    // You can add more test cases as needed

    after(async () => {
        // Clean up after the tests if necessary
        // For example, you may want to delete the test data from the database
        // You can use variable.id to identify the data you created for testing
    });
});
