export type TDecomposedPromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};

type TExecutor<T> = (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
) => void;

export const getDecomposedPromise = <T>(executor?: TExecutor<T>): TDecomposedPromise<T> => {
    let resolve: (value: T | PromiseLike<T>) => void;
    let reject: (reason?: any) => void;

    const promise = new Promise<T>((onResolve, onReject) => {
        resolve = onResolve;
        reject = onReject;
        executor?.(onResolve, onReject);
    });

    return {
        promise,
        // @ts-ignore
        resolve,
        // @ts-ignore
        reject,
    };
};