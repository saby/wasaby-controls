import { useState, useRef, useCallback } from 'react';

interface IUseInputEditorValueOptions<T> {
    /**
     * state значения
     */
    value: T;

    onChange?: (value: T) => void;
}

export function useInputEditorValue<T extends string | number | undefined | null>(
    options: IUseInputEditorValueOptions<T | undefined | null>
) {
    const { value, onChange } = options;
    const valueRef = useRef<T | undefined | null>(value);

    const needValueFromPropsRef = useRef(true);

    const isValueChanged = valueRef.current !== value || needValueFromPropsRef.current;
    valueRef.current = value;

    const [localValue, setLocalValue] = useState(value);

    const inputCompleteHandler = useCallback(
        (value: T) => {
            valueRef.current = undefined;
            needValueFromPropsRef.current = true;
            onChange?.(value);
        },
        [onChange]
    );

    const changeLocalValue = useCallback((value: T) => {
        needValueFromPropsRef.current = false;
        setLocalValue(value);
    }, []);

    return {
        localValue: (isValueChanged ? value : localValue) as T,
        changeHandler: changeLocalValue,
        inputCompleteHandler,
    };
}
