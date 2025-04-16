import { CancelablePromise } from 'Types/entity';

/**
 * Стратегия обработки дубликатов
 * @variant throwError Выбрасывает ошибку
 * @variant replace Отменяет предыдущий Promise и заменяет его в коллекции
 * */
export type AsyncOperationsOrchestratorStrategy = 'throwError' | 'replace';

// Эту ошибку не вынести в дескрипторы, т.к. она нужна синхронно.
const PROMISE_REGISTRATION_DUPLICATE = (key: string) => {
    return `Controls-DataEnv/abstractList:AsyncOperationsOrchestrator: Обнаружена повторная регистрация Promise с ключом ${key}.`;
};

type TEmptyFn = () => void;

/**
 * Утилитный класс, предоставляющий функционал для отслеживания незавершенных Promise.
 * */
export default class AsyncOperationsOrchestrator {
    private _pendingPromisesMap: Map<string, CancelablePromise<unknown>> = new Map<
        string,
        CancelablePromise<unknown>
    >();

    private readonly _disableAsyncValidation: boolean;
    private readonly _onRun?: TEmptyFn;
    private readonly _onIdle?: TEmptyFn;

    constructor({
        _disableAsyncValidation,
        onRun,
        onIdle,
    }: {
        _disableAsyncValidation?: boolean;
        onRun?: TEmptyFn;
        onIdle?: TEmptyFn;
    } = {}) {
        this._disableAsyncValidation = !!_disableAsyncValidation;
        this._onRun = onRun;
        this._onIdle = onIdle;
    }

    /**
     * Флаг, отражающий отсутствие зарегистрированных незавершенных Promise
     * */
    isIdle: boolean = true;

    /**
     * Метод для регистрации Promise
     * В зависимости от переданной стратегии при добавлении Promise с одинаковыми ключами выбрасывает ошибку либо отменяет первый из них
     * */
    registerPendingPromise<T>(
        key: string,
        promise: Promise<T>,
        strategy: AsyncOperationsOrchestratorStrategy = 'throwError'
    ): Promise<T> {
        const {
            _disableAsyncValidation: disableAsyncValidation,
            _pendingPromisesMap: promisesMap,
        } = this;
        if (disableAsyncValidation) {
            return promise;
        }

        const existingPromise = promisesMap.get(key);

        if (existingPromise) {
            if (strategy === 'replace') {
                existingPromise.cancel(PROMISE_REGISTRATION_DUPLICATE(key));
            } else {
                // Fixme: Вызывает ошибки поиска при сбросе значения
                // throw new Error(PROMISE_REGISTRATION_DUPLICATE(key));
            }
        }

        if (promisesMap.size === 0) {
            this._setIsIdle(false);
        }

        const cancellablePromise = new CancelablePromise(promise);

        promisesMap.set(key, cancellablePromise);

        return cancellablePromise.promise.finally(() => {
            this._removePromise(key);
        });
    }

    /**
     * Метод для отмены всех незавершенных Promise
     * */
    rejectPendingOperations(): void {
        this._clearPromises();
    }

    /**
     * Разрушить оркестратор.
     */
    destroy() {
        // TODO: Вероятно, тут нужно еще и отменять промисы, но сначала нужно написать тесты на интеракторы.
        this._clearPromises(false);
    }

    /**
     * Метод для удаления всех Promise
     * */
    private _clearPromises(shouldCancel: boolean = true): void {
        this._pendingPromisesMap.forEach((promise, key) => {
            if (shouldCancel) {
                promise.cancel(key);
            }
            this._removePromise(key);
        });
    }

    private _removePromise(key: string): void {
        const { _pendingPromisesMap: promisesMap } = this;
        promisesMap.delete(key);

        // Необходимо для регистрации вложенных Promise
        setTimeout(() => {
            if (promisesMap.size === 0) {
                this._setIsIdle(true);
            }
        }, 0);
    }

    private _setIsIdle(value: boolean) {
        if (this.isIdle === value) {
            return;
        }
        this.isIdle = value;

        if (value) {
            this._onIdle?.();
        } else {
            this._onRun?.();
        }
    }
}

/**
 * Возвращаемый тип регистратора Promise
 * */
export type TRegisterPendingPromise = AsyncOperationsOrchestrator['registerPendingPromise'];
