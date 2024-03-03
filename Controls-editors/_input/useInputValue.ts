import { useCallback, useEffect, useState } from 'react';

interface IuseInputEditorValueOptions<T extends string | number> {
    /**
     * state значения
     */
    value: T;

    /**
     * Диспатчер изменения значения
     * @param value
     */
    onApply: (value: T) => void;
}

export function useInputEditorValue<T extends string | number>(
    options: IuseInputEditorValueOptions<T>
) {
    const { onApply: originOnApply, value } = options;
    const [localValue, setLocalValue] = useState(value);

    const changeHandler = useCallback((value: T) => {
        return setLocalValue(value);
    }, []);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const onApply = useCallback(
        (inputValue) => {
            originOnApply(inputValue);
        },
        [originOnApply]
    );

    return {
        localValue,
        changeHandler,
        onApply,
    };
}
