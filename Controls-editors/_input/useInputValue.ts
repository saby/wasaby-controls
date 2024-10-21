import { useState, useRef, useCallback } from 'react';

interface IuseInputEditorValueOptions<T extends string | number> {
    /**
     * state значения
     */
    value: T;

    onChange?(value: T);
}

export function useInputEditorValue<T extends string | number>(
    options: IuseInputEditorValueOptions<T>
) {
    const { value, onChange } = options;
    const valueRef = useRef(value);
    const isValueChanged = valueRef.current !== value;
    valueRef.current = value;

    const [localValue, setLocalValue] = useState(value);

    const inputCompleteHandler = useCallback(
        (value: T) => {
            valueRef.current = undefined;
            setLocalValue(undefined);
            onChange?.(value);
        },
        [onChange]
    );

    return {
        localValue: isValueChanged ? value : localValue,
        changeHandler: setLocalValue,
        inputCompleteHandler,
    };
}
