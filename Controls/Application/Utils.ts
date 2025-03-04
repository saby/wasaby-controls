import { withWasabyEventObject } from 'UI/Events';

export function mergeHandlers(
    handler1: (...args: any[]) => void,
    handler2: (...args: any[]) => void,
    saveWasabyEventObject?: boolean
): (...args: any[]) => void {
    if (!handler1) {
        return saveWasabyEventObject ? withWasabyEventObject(handler2) : handler2;
    }
    if (!handler2) {
        return saveWasabyEventObject ? withWasabyEventObject(handler1) : handler1;
    }
    const resultFn = (...args: any[]) => {
        handler1(...args);
        handler2(...args);
    };
    return saveWasabyEventObject ? withWasabyEventObject(resultFn) : resultFn;
}
export function mergeRefs<T = any>(
    refs: (React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null)[]
): React.RefCallback<T> {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(value);
            } else if (ref != null) {
                (ref as React.MutableRefObject<T | null>).current = value;
            }
        });
    };
}
export function utilHandler(handler: Function) {
    return function (e: CustomEvent) {
        const result = handler(...e.detail);
        e.resultValue = result;
        return result;
    };
}
