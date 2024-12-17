import { useEffect, useRef } from 'react';

/**
 * Хук, позволяющий сохранять значения между рендерами
 * @param value
 * @param initialValue
 */
export const usePreviousProps = <T extends {}>(value: T, initialValue: T = {} as T): T => {
    const ref = useRef<T>(initialValue);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
