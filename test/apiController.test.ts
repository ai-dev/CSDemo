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
        expect(response.result).to.be.deep.equal({text, done: false});
    });

    it('should return the list of Todos after one has been created', async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/api/todo',
        });

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.an('array');
        expect(response.result.length).to.be.equal(1);
        expect(response.result).to.be.deep.equal([{text, done: false}]);
    });

    it('should change the status of a Todo item and return it', async () => {
        const done = true;
        const response = await Server.inject({
            method: 'PUT',
            url: '/api/todo/0',
            payload: {
                done,
            },
        });

        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.an('object');
        expect(response.result).to.be.deep.equal({text, done});
    });

    it('should throw an error if the item that we want to update doens\'t exist', async () => {
        const index = 30;
        const done = true;
        const response = await Server.inject({
            method: 'PUT',
            url: `/api/todo/${index}`,
            payload: {
                done,
            },
        });

        expect(response.statusCode).to.be.equal(500);
        expect(response.result).to.be.an('string');
        expect(response.result).to.be.equal(`Item with index ${index} not found`);
    });
});
