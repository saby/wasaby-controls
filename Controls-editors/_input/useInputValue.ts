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
    const valueRef = useRef<T | undefined>(value);

    const needValueFromPropsRef = useRef(true);

    const isValueChanged = valueRef.current !== value || needValueFromPropsRef.current;
    valueRef.current = value;

    const [localValue, setLocalValue] = useState(value);

    const inputCompleteHandler = useCallback(
        (value: T) => {
            valueRef.current = undefined;
            needValueFromPropsRef.current = true;
            setLocalValue(undefined);
            onChange?.(value);
        },
        [onChange]
    );

    const changeLocalValue = useCallback((value: T) => {
        needValueFromPropsRef.current = false;
        setLocalValue(value);
    }, []);

    return {
        localValue: isValueChanged ? value : localValue,
        changeHandler: changeLocalValue,
        inputCompleteHandler,
    };
}
