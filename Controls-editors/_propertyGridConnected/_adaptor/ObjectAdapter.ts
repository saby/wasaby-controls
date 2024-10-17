import { IAdapter } from './factory';

/**
 * Адаптер по-умолчанию для работы с объектами
 */
export class ObjectAdapter implements IAdapter {
    constructor(private _initialValue: object = {}) {}

    set(val: object): void {
        this._initialValue = val;
    }

    get(): object {
        return this._initialValue;
    }
}
