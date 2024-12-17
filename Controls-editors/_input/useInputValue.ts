import { useState, useRef } from 'react';

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
    const valueRef = useRef(value);
    const isValueChanged = valueRef.current !== value;
    valueRef.current = value;

    const [localValue, setLocalValue] = useState(value);

    return {
        localValue: isValueChanged ? value : localValue,
        changeHandler: setLocalValue,
    };
}
