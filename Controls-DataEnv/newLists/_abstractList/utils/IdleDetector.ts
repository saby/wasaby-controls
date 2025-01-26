/**
 * Утилитный класс, предоставляющий функционал для отслеживания незавершенных Promise.
 * */
export class IdleDetector {
    private _pendingPromisesMap: Map<Symbol, Promise<unknown>> = new Map<
        Symbol,
        Promise<unknown>
    >();

    /**
     * Флаг, отражающий отсутствие зарегистрированных незавершенных Promise
     * */
    isIdle: boolean = true;

    /**
     * Метод для регистрации Promise
     * */
    registerPendingPromise<T>(key: Symbol, promise: Promise<T>): Promise<T> {
        if (this._pendingPromisesMap.has(key)) {
            return promise;
        }

        if (this._pendingPromisesMap.size === 0) {
            this.isIdle = false;
        }

        this._pendingPromisesMap.set(key, promise);

        return promise.finally(() => {
            this._pendingPromisesMap.delete(key);

            // Необходимо для регистрации вложенных Promise
            setTimeout(() => {
                if (this._pendingPromisesMap.size === 0) {
                    this.isIdle = true;
                }
            }, 0);
        });
    }
}
