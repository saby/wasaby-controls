import { useCallback, useEffect, useState } from 'react';

interface IuseInputEditorValueOptions<T extends string | number> {
    /**
     * state значения
     */
    value: T;
}

export function useInputEditorValue<T extends string | number>(
    options: IuseInputEditorValueOptions<T>
) {
    const { value } = options;
    const [localValue, setLocalValue] = useState(value);

    const changeHandler = useCallback((value: T) => {
        return setLocalValue(value);
    }, []);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return {
        localValue,
        changeHandler,
    };
}
