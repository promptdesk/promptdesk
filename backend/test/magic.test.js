import request from 'supertest';
import app from '../app.js'
import { expect } from 'chai'; // Import expect from Chai

describe('API Routes', () => {
    it('should respond with a message from /api/magic/gpt-3.5-turbo', async () => {
        const response = await request(app)
            .post('/api/magic/gpt-3.5-turbo')
            .send({
                "messages": [
                    {
                        "role": "user",
                        "content": "Hello!"
                    },
                    {
                        "role": "assistant",
                        "content": "Hey! How can I help you?"
                    },
                    {
                        "role": "user",
                        "content": "In a single word, what color is the sky?"
                    }
                ]
            });
        
        //console.log(response.body)
        expect(response.status).to.equal(200)
    });

    it('should respond with a message from /api/magic/text-davinci-003', async () => {
        const response = await request(app)
            .post('/api/magic/text-davinci-003')
            .send({
                "prompt": "In a single word, what color is the sky?"
            });

        // Assert the response
        // For example, if you expect a 200 status code:
        expect(response.status).to.equal(200);
        // Add more assertions as needed
    });

    // Add similar tests for other routes
});
