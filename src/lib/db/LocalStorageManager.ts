export default class LocalStorageManager {
    storage: Storage;

    constructor() {
        this.storage = window.localStorage;
    }

    insert(key: string, value: string): void {
        this.storage.setItem(key, value);
    }

    delete(key: string): void {
        this.storage.removeItem(key);
    }

    get(key: string): string {
        return this.storage.getItem(key);
    }
}