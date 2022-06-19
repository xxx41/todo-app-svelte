<script lang="typescript">
    import { todoList } from './store/store.js';
    import { onMount } from "svelte";
    import TodoRepository from "./db/TodoRepository";
    import type { Todo } from './interface/Todo.js';

    let active: String = 'all';
    let todoListValue: Array<Todo>;
    let filtered: Array<Todo>;

    todoList.subscribe(value => todoListValue = value);

    $: if (active == 'all') {
        filtered = todoListValue;
    } else {
        filtered = todoListValue.filter(element => element.status == active);
    }

    onMount(() => getTodos());

    function getTodos(): void {
        const todos: Array<Todo> = TodoRepository.findAll();
        todoList.update(() => Object.values(todos));
    }

    function doneToggle(todo: Todo): void {
        todo.status = todo.status == 'done' ? 'pending' : 'done';
        todoList.update(() => Object.values(todoListValue));
    }

    function editToggle(todo: Todo): void {
        if (todo.editActivated) {
            TodoRepository.update(todoListValue);
        }
        todo.editActivated = !todo.editActivated;
        todoList.update(() => Object.values(todoListValue));
    }

    function deleteToggle(todo: Todo): void {
        const index: number = todoListValue.findIndex(element => element == todo)
        todoListValue.splice(index, 1);
        todoList.update(() => Object.values(todoListValue));
    }

    function handleKeypressOnEditInput(event: KeyboardEvent, todo: Todo): void {
        if (event.key === 'Enter') editToggle(todo);
    }
</script>

<main class="todo-list">
    <ul class="todo-list__filter">
        <li
            class="todo-list__filter-item"
            class:active="{ active == 'all'}"
            on:click={() => active = 'all'}
        >All</li>
        <li
            class="todo-list__filter-item"
            class:active="{ active == 'pending'}"
            on:click={() => active = 'pending'}
        >Pending</li>
        <li
            class="todo-list__filter-item"
            class:active="{ active == 'done'}"
            on:click={() => active ='done'}
        >Done</li>
    </ul>
    <ul class="todo-list__list">
        {#if filtered.length == 0}
            <li class="todo-list__item empty">
                There is no {#if active !== 'all'}{active} {/if}tasks added yet
            </li>
        {:else}
            {#each filtered as todo}
                <li class="todo-list__item">
                    {#if todo.editActivated}
                        <input
                            type=text
                            bind:value="{todo.message}"
                            class="todo-list__item-message edit"
                            on:keypress|capture="{(event) => handleKeypressOnEditInput(event, todo)}"
                        >
                    {:else}
                        <span
                            class="todo-list__item-message"
                            class:done={todo.status === 'done'}
                        >{todo.message}</span>
                    {/if}
                    <button
                        class="todo-list__item-button"
                        class:done={todo.status !== 'done'}
                        class:undo={todo.status === 'done'}
                        on:click="{() => doneToggle(todo)}"
                    ></button>
                    <button
                        class="todo-list__item-button"
                        class:save={todo.editActivated}
                        class:edit={!todo.editActivated}
                        on:click="{() => editToggle(todo)}"
                        ></button>
                    <button
                        class="todo-list__item-button delete"
                        on:click="{() => deleteToggle(todo)}"
                    ></button>
                </li>
            {/each}
        {/if}
    </ul>
</main>

<style lang="scss">
    @import "../styles/variables.scss";
    @import "../styles/mixins.scss";

    .todo-list {
        display: flex;
        justify-content: center;
        flex-flow: column nowrap;
        margin: 0 auto;
        max-width: 515px;
        width: 100%;

        &__list {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            border-top: none;
            border: solid 1px $placeholder;
            list-style: none;
            margin: 0;
            max-height: 335px;
            overflow-y: scroll;
            padding: 0;
            scrollbar-base-color: $orange;
        }

        &__item {
            align-items: center;
            display: flex;
            gap: 0 5px;
            justify-content: center;
            padding: 15px;

            &.empty {
                color: $placeholder;
                font-size: .8rem;
                padding: 20px 0;
            }

            &:not(.empty) {
                &:not(:last-child) {
                    border-bottom: solid 1px rgba(0,0,0,.1);
                }
            }

            &-message {
                color: $orange;
                font-size: .9rem;
                margin: 0 auto 0 0;
                padding: 0 10px 0 0;
                text-align: left;

                &.edit {
                    border-radius: 5px;
                    border: solid 1px $placeholder;
                    color: $black;
                    height: 30px;
                    padding: 0 10px;
                    width: 100%;
                }

                &.done {
                    text-decoration: line-through;
                    text-decoration-color: $orange;
                    color: $placeholder;
                }
            }

            &-button {
                background-position: center;
                background-repeat: no-repeat;
                background-size: 60%;
                border-radius: 5px;
                border: none;
                height: 25px;
                padding: 10px 15px;

                @include hoverAndActive;

                &.edit {
                    background-color: rgb(189, 189, 255);
                    background-image: url(https://cdn-icons-png.flaticon.com/512/1214/1214514.png);
                }

                &.delete {
                    background-color: rgb(252, 166, 166);
                    background-image: url(https://cdn-icons-png.flaticon.com/512/1214/1214428.png);
                }

                &.done {
                    background-color: rgb(143, 193, 143);
                    background-image: url(https://cdn-icons-png.flaticon.com/512/1214/1214416.png);
                }

                &.undo {
                    background-color: rgb(184, 219, 184);
                    background-image: url(https://cdn-icons-png.flaticon.com/512/1214/1214533.png);
                }

                &.save {
                    background-color: rgb(209, 209, 246);
                    background-image: url(https://cdn-icons-png.flaticon.com/512/1214/1214445.png);
                }
            }
        }

        &__filter {
            align-items: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            justify-content: center;
            list-style: none;
            margin: 20px 0 0;
            padding: 0;
            width: 100%;
        }

        &__filter-item {
            cursor: auto;
            font-size: .8rem;
            padding: 10px;
            user-select: none;
            width: 100%;

            &:hover {
                &:not(.active) {
                    background: #eaeaea;
                }
            }

            &:not(.active) {
                border-top: solid 1px $placeholder;
            }

            &.active {
                border-top: solid 1px $orange;
            }

            &:first-child {
                border-top-left-radius: 5px;

                &:not(.active) {
                    border-left: solid 1px $placeholder;
                }

                &.active {
                    border-left: solid 1px $orange;
                }
            }

            &:last-child {
                border-top-right-radius: 5px;

                &:not(.active) {
                    border-right: solid 1px $placeholder;
                }

                &.active {
                    border-right: solid 1px $orange;
                }
            }

            &.active {
                background: $orange;
                color: $white;
            }
        }
    }
</style>