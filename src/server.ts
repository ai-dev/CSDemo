"use strict";
import * as Hapi from 'hapi';
import * as apiController from './controllers/apiController';

const server = new Hapi.Server({
    port: 3000,
    host: 'localhost'
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

server.route({
    method: 'GET',
    path: '/',
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
        return 'Hello, world!';
    }
});

server.route({
    method: 'GET',
    path: '/api/todo',
    handler: apiController.getTodo,
});

server.route({
    method: 'POST',
    path: '/api/todo',
    handler: apiController.postTodo,
});

server.route({
    method: 'PUT',
    path: '/api/todo/{index}',
    handler: apiController.putTodo,
});


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

export = server;