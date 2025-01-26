/**
 * Методы разобранного Promise
 * */
export type TDecomposedPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};

/**
 * Функция, которую нужно вызвать при вызове Promise
 * */
export type TExecutor<T> = (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
) => void;

/**
 * Утилита для разбора Promise на отдельные методы
 * */
export const getDecomposedPromise = <T>(executor?: TExecutor<T>): TDecomposedPromise<T> => {
    let resolve: (value: T | PromiseLike<T>) => void = (_) => {};
    let reject: (reason?: any) => void = () => {};

    const promise = new Promise<T>((onResolve, onReject) => {
        resolve = onResolve;
        reject = onReject;
        executor?.(onResolve, onReject);
    });

    return {
        promise,
        resolve,
        reject,
    };
};
