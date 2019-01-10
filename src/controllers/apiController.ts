import * as Hapi from 'hapi';
import { Todo } from '../types/Todo';
import TodoStorage from '../TodoStorage';

export const getTodo = (request: Hapi.Request, h: Hapi.ResponseToolkit): Todo[] => {
    return TodoStorage.get();
};

export const postTodo = (request: Hapi.Request, h: Hapi.ResponseToolkit): Todo => {
    const { text } =  <Todo> request.payload;

    TodoStorage.add(text);

    return {
        text,
        done: false,
    }
};

export const putTodo = (request: Hapi.Request, h: Hapi.ResponseToolkit): Todo|Hapi.ResponseObject => {
    const { done } = (<Todo> request.payload);
    const index = parseInt(request.params.index);

    try {
        return TodoStorage.updateStatus(index, done);
    } catch (e) {
        return h.response(e.message).code(500);
    }
};