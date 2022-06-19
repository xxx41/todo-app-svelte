<script lang="typescript">
    import { todoList } from './store/store.js';
    import TodoRepository from "./db/TodoRepository";
    import type { Todo } from './interface/Todo.js';

    let todo: string = '';
    let todoListValue: Array<Todo>;

    todoList.subscribe(value => todoListValue = value);

    function addTodo(): void {
        if (todo.length !== 0) {
            const todoObject: Todo = getTodoDefaultObject(todo);
            todoListValue.push(todoObject);
            todoList.update(() => todoListValue);
            TodoRepository.insert(todoObject);
            todo = '';
        }
    }

    function handleKeypressOnAdderInput(event: KeyboardEvent): void {
        if (event.key === 'Enter') addTodo();
    }

    function getTodoDefaultObject(todo: string): Todo {
        return {
            message: todo,
            status: 'pending',
            editActivated: false,
            index: null,
        };
    }
</script>

<main class="todo-adder">
    <input
        on:keypress="{handleKeypressOnAdderInput}"
        type=text bind:value="{todo}"
        placeholder="Add new task"
        class="todo-adder__input-text"
    >
    <button class="todo-adder__add-button" on:click="{addTodo}">Add</button>
</main>

<style lang="scss">
    @import "../styles/variables.scss";
    @import "../styles/mixins.scss";

    .todo-adder {
        align-items: center;
        display: flex;
        justify-content: center;

        &__add-button {
            background: $orange;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            border: none;
            color: $white;
            height: 37px;
            padding: 0 30px;

            @include hoverAndActive;
        }

        input[type=text] {
            border: solid 1px $placeholder;
            border-right: none;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            color: $black;
            font-size: 1rem;
            height: 35px;
            max-width: 400px;
            padding: 0 15px;
            width: 100%;

            &:focus-visible {
                border-color: $orange;
                outline: 0;
            }

            &::placeholder {
                color: $placeholder;
            }
        }
    }
</style>