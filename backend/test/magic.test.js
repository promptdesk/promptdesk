import request from 'supertest';
import app from '../app.js'
import { expect } from 'chai'; // Import expect from Chai

describe('Main /magic/generate route', () => {

    //before wait 2 seconds to allow the model to load
    before(done => async () => {
        await setTimeout(() => {
            done();
        }, 1900);
    })

    it('should respond with a message stating the a prompt name is required', async () => {
        const response = await request(app)
            .post('/api/magic/generate')
            .send({
            });

        expect(response.status).to.equal(404)
    });

    it('should respond with a message stating the prompt cannot be found', async () => {
        const response = await request(app)
            .post('/api/magic/generate')
            .send({
                "prompt_name": "non-existent-prompt",
            });

        expect(response.status).to.equal(404)
    });

    it('should respond with a 200 success', async () => {

        const response = await request(app)
            .post('/api/magic/generate')
            .send({
                "prompt_name": "yoda-test",
            });

        console.log(response.body)

        expect(response.status).to.equal(200)

    });

    /*it('should respond with a message stating that variables are required', async () => {

        const response = await request(app)
            .post('/api/magic/generate')
            .send({
                "prompt_name": "yoda-test-variables",
            });

        //console.log(response.body)
        expect(response.status).to.equal(400)

    });

    it('should respond with a generated prompt and a 200 success', async () => {

        const response = await request(app)
            .post('/api/magic/generate')
            .send({
                "prompt_name": "yoda-test-variables",
                "variables": {
                    "message": "What is your name?",
                    "character": "James Bond",
                    "movie": "Skyfall"
                }
            });

        //console.log(response.body)
        expect(response.status).to.equal(200)

    });*/

});