/**
 * mock(30000, 5000) Мокает setTimeOut для демок, выполняя все таймауты 30000мс за 5000мс.
 * recover(30000) Восстанавливает setTimeOut для значения 30000мс
 * isMocked(30000) Проверяет, замокано ли значение таймаута
 * recover() Сбрасывает все замоканые значения
 * isMocked() Проверяет, замокано ли хотя бы одно значение таймаута
 */
class SetTimeoutMocker {
    private readonly _original: Function;
    private _timeoutMap: Map<number, number>;

    constructor() {
        this._original = SetTimeoutMocker.getGlobal().setTimeout.bind(window);
        this._initTimeoutMap();
    }

    mock(oldTimeOut: number, newTimeOut: number): void {
        this._timeoutMap.set(oldTimeOut, newTimeOut);
        SetTimeoutMocker.getGlobal().setTimeout = function (
            callback: Function,
            timeOut: number
        ): number {
            return this._timeoutMap.has(timeOut)
                ? this._original(callback, this._timeoutMap.get(timeOut))
                : this._original(callback, timeOut);
        }.bind(this);
    }

    recover(oldTimeOut?: number): void {
        if (oldTimeOut && this._timeoutMap.has(oldTimeOut)) {
            this._timeoutMap.delete(oldTimeOut);
        } else {
            this._initTimeoutMap();
            SetTimeoutMocker.getGlobal().setTimeout = this._original;
        }
    }

    isMocked(oldTimeOut?: number): boolean {
        if (oldTimeOut) {
            return this._timeoutMap.has(oldTimeOut);
        }
        return this._timeoutMap.size > 0;
    }

    destroy(): void {
        SetTimeoutMocker.getGlobal().mockSetTimeout = undefined;
        SetTimeoutMocker.getGlobal().recoverSetTimeout = undefined;
    }

    private _initTimeoutMap(): void {
        this._timeoutMap = new Map();
    }

    static getGlobal(): {
        mockSetTimeout: Function;
        recoverSetTimeout: Function;
        setTimeout: Function;
    } {
        return window || global;
    }

    static initialize(): SetTimeoutMocker {
        const instance = new SetTimeoutMocker();
        this.getGlobal().mockSetTimeout = instance.mock.bind(instance);
        this.getGlobal().recoverSetTimeout = instance.recover.bind(instance);
        return instance;
    }
}

export const setTimeoutMocker = SetTimeoutMocker.initialize();
