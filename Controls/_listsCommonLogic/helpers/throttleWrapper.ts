import { InnerFunction, throttle } from 'Types/function';

export function throttleWrapper<TCallback extends (...args: any[]) => void>(
    func: TCallback,
    delay: number
): {
    call: TCallback;
    clearThrottle: () => void;
} {
    let throttledFunc: TCallback | undefined;
    const wrappedFunc = ((...args: Parameters<TCallback>) => {
        if (!throttledFunc) {
            throttledFunc = throttle(func as InnerFunction, delay) as TCallback;
        }
        return throttledFunc(...args);
    }) as TCallback;
    const clearThrottle = () => {
        throttledFunc = undefined;
    };

    return {
        call: wrappedFunc,
        clearThrottle,
    };
}
