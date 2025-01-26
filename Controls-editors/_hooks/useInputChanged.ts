import { useCallback, useEffect, useState } from 'react';

const CUSTOM_EVENTS = ['onValueChanged', 'onInputCompleted'];

export function useInputChanged(value, onChange) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const onValueChanged = useCallback(
        (res) => {
            setLocalValue(res);
        },
        [setLocalValue]
    );

    const onInputCompleted = useCallback(
        (res) => {
            onChange(res);
        },
        [onChange]
    );
    return {
        value: localValue,
        onValueChanged,
        onInputCompleted,
        customEvents: CUSTOM_EVENTS,
    };
}
