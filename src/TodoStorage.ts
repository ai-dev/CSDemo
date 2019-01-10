import { Todo } from './types/Todo';

let todos: Todo[] = [];

export = {
    add: (text: string) => todos.push({text, done: false}),
    get: ():Todo[] => todos,
    updateStatus: (index: number, done: boolean): Todo => {

        if(index > todos.length -1) {
            throw new Error(`Item with index ${index} not found`);
        }

        todos[index].done = done;
        return todos[index];
    }
};