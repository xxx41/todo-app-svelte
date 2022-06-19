import LocalStorageManager from "./LocalStorageManager";
import type { Todo } from "../interface/Todo";

const TODO_KEY = 'todos';
const INDEX_KEY = 'index';

class TodoRepository {
    storageManager: LocalStorageManager;

    constructor() {
        this.storageManager = new LocalStorageManager();
    }

    insert(todo: Todo): void {
        let currentIndex = this.getCurrentIndex();
        let newIndex = parseInt(currentIndex ? currentIndex : '0') + 1;

        let stored = this.findAll() ?? {};
        todo.index = newIndex.toString();
        stored[newIndex] = todo;

        this.storageManager.insert(TODO_KEY, JSON.stringify(stored));
        this.storageManager.insert(INDEX_KEY, newIndex.toString());
    }

    update(todos: Array<Todo>): void {
        this.storageManager.insert(TODO_KEY, JSON.stringify(todos));
    }

    findAll(): Array<Todo> {
        return JSON.parse(this.storageManager.get(TODO_KEY) ?? '');
    }

    getCurrentIndex(): string {
        return this.storageManager.get(INDEX_KEY);
    }
}

export default new TodoRepository();