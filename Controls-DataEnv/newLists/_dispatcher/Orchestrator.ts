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

/**
 * Утилитный класс, предоставляющий функционал для отслеживания незавершенных Promise.
 * */
export default class AsyncOperationsOrchestrator {
    private _pendingPromisesMap: Map<string, CancelablePromise<unknown>> = new Map<
        string,
        CancelablePromise<unknown>
    >();

    private _disableAsyncValidation: boolean;

    constructor(_disableAsyncValidation?: boolean) {
        this._disableAsyncValidation = _disableAsyncValidation === true;
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
        if (this._disableAsyncValidation) {
            return promise;
        }

        const existingPromise = this._pendingPromisesMap.get(key);

        if (existingPromise) {
            if (strategy === 'replace') {
                existingPromise.cancel(PROMISE_REGISTRATION_DUPLICATE(key));
            } else {
                throw new Error(PROMISE_REGISTRATION_DUPLICATE(key));
            }
        }

        if (this._pendingPromisesMap.size === 0) {
            this.isIdle = false;
        }

        const cancellablePromise = new CancelablePromise(promise);

        this._pendingPromisesMap.set(key, cancellablePromise);

        return cancellablePromise.promise.finally(() => {
            this._removePendingOperation(key);
        });
    }

    /**
     * Метод для отмены всех незавершенных Promise
     * */
    rejectPendingOperations(): void {
        this._removePendingOperations();
    }

    /**
     * Разрушить оркестратор.
     */
    destroy() {
        // TODO: Вероятно, тут нужно еще и отменять промисы, но сначала нужно написать тесты на интеракторы.
        this._removePendingOperations(false);
    }

    /**
     * Метод для удаления всех Promise
     * */
    private _removePendingOperations(shouldCancel: boolean = true): void {
        this._pendingPromisesMap.forEach((promise, key) => {
            if (shouldCancel) {
                promise.cancel(key);
            }
            this._removePendingOperation(key);
        });
    }

    private _removePendingOperation(key: string): void {
        this._pendingPromisesMap.delete(key);

        // Необходимо для регистрации вложенных Promise
        setTimeout(() => {
            if (this._pendingPromisesMap.size === 0) {
                this.isIdle = true;
            }
        }, 0);
    }
}

/**
 * Возвращаемый тип регистратора Promise
 * */
export type TRegisterPendingPromise = AsyncOperationsOrchestrator['registerPendingPromise'];
