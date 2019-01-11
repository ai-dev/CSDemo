import React, {Component} from 'react';
import styled, {css} from 'styled-components';
import { Todo }  from '../../src/types/Todo';
import './App.css';

interface IPropsButton {
    primary?: boolean;
    disabled?: boolean;
}

const Button = styled.button<IPropsButton>`
    background: transparent;
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
    margin: 0.5em 1em;
    padding: 0.25em 1em;

    ${props => props.primary && css`
        background: palevioletred;
        color: white;
    `}
    
    ${props => props.disabled && css`
        background: grey;
        border: grey;
        color: white;
    `}
    
`;


const Input = styled.input`
    padding: 0.5em;
    margin: 0.5em;
`;

interface State {
    todos: Todo[],
    newTodo: string,
}

class App extends Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {
            todos: [],
            newTodo: '',
        };
    }

    async componentDidMount() {
        try {
            const todos = await this.getTodos();
            this.setState({ todos });
        } catch (error) {
            console.log(error);
        }
    };

    getTodos = async () : Promise<Todo[]>=> {
        const response = await fetch('/api/todo');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    saveTodo = async (text: string) : Promise<Todo>=> {
        const response = await fetch('/api/todo', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ text }),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    updateStatusTodo = async (index: number, done: boolean) : Promise<Todo>=> {
        const response = await fetch(`/api/todo/${index}`, {
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ done }),
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    onItemAdd = async () => {
        if (this.state.newTodo.length === 0) {
            return;
        }

        const newTodo = await this.saveTodo(this.state.newTodo);
        this.setState({ todos: [...this.state.todos, newTodo], newTodo: ''});
    };

    onStatusChange = async (index: number, done: boolean) => {
        const updatedTodo = await this.updateStatusTodo(index, done);
        let todos = [...this.state.todos];
        todos[index] = updatedTodo;
        this.setState({todos});
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Input value={this.state.newTodo} onChange={e => this.setState({newTodo: e.target.value})}/>
                    <Button primary onClick={this.onItemAdd} disabled={this.state.newTodo.length === 0}>Add Todo Item</Button>
                    <div>
                        <ol>
                            {this.state.todos.map((todo, i) => {
                                return <li key={i}>
                                    {todo.text} <input type="checkbox" checked={todo.done} onChange={e => this.onStatusChange(i, e.target.checked)}/>
                                </li>
                            })}
                        </ol>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
