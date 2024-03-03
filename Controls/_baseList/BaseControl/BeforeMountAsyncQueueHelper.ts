/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */

/**
 * @class Controls/_baseList/BaseControl/BeforeMountAsyncQueueHelper
 * @public
 */

export default class {
    private _result: void | Promise<unknown> = null;
    private _state: 'sync' | 'async' = 'sync';

    addOperation = (callback: Function) => {
        if (this._state === 'sync') {
            this._result = callback(this._result);
            this._state = this._result instanceof Promise ? 'async' : 'sync';
        } else {
            (this._result as Promise<unknown>).then(callback);
        }
        return this;
    };

    getResult(): void | Promise<unknown> {
        return this._result;
    }
}
