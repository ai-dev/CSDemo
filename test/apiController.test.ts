import { expect } from 'chai';
const Server = require('../src/server');

after(() => Server.stop({ timeout: 0 }));

describe('API controller', () => {
    const text = 'This is a test';

    it('should return the list of Todos', async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/api/todo',
        });

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.an('array');
        expect(response.result.length).to.be.equal(0);
    });

    it('should create a todo item and return it', async () => {
        const response = await Server.inject({
            method: 'POST',
            url: '/api/todo',
            payload: {
                text,
            },
        });

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.an('object');
        expect(response.result).to.be.equal({text, done: false});
    });

    it('should return the list of Todos after one has been created', async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/api/todo',
        });

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.an('array');
        expect(response.result.length).to.be.equal(1);
        expect(response.result).to.be.equal({text, done: false});
    });

    it('should change the status of a Todo item and return it', async () => {
        const response = await Server.inject({
            method: 'PUT',
            url: '/api/todo/0',
        });

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.an('object');
        expect(response.result.length).to.be.equal(1);
        expect(response.result).to.be.equal({text, done: true});
    });
});
