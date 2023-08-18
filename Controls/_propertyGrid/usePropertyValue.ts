import { useState, useEffect } from 'react';
import { SyntheticEvent } from 'UICommon/Events';

import { IEditorProps } from './IEditor';

type ISetValueFunction<T> = (value: T) => void;

interface IPropertyBind<T> {
    value: T;
    onChange: ISetValueFunction<T>;
    onPropertyValueChanged: ISetValueFunction<T>;
}

type IValueComparatorFunction<T> = (newValue: T, initValue: T) => boolean;

function defaultValueComparator<T>(newValue: T, initValue: T): boolean {
    return newValue !== initValue;
}

/**
 * Пользовательский хук для работы со значениями в редакторах PropertyGrid
 * @param props опции редактора PropertyGrid
 * @param isValueChanged функция, возвращающая признак изменения значения
 */
export function usePropertyValue<T = unknown>(
    props: IEditorProps<T>,
    isValueChanged: IValueComparatorFunction<T> = defaultValueComparator
): IPropertyBind<T> {
    const { propertyValue } = props;
    const onValueChanged = props.onPropertyValueChanged;

    const [value, setStateValue] = useState<T>(propertyValue);
    const [initValue, setInitValue] = useState<T>(propertyValue);

    useEffect(() => {
        setStateValue(propertyValue);
        setInitValue(propertyValue);
    }, [propertyValue]);

    const onChange: ISetValueFunction<T> = (event: SyntheticEvent, value: T) => {
        return setStateValue(value);
    };

    const onPropertyValueChanged: ISetValueFunction<T> = (value: T) => {
        if (isValueChanged(value, initValue)) {
            setStateValue(value);
            setInitValue(value);
            // TODO: удалить после перевода всех редакторов на реакт
            const event = new SyntheticEvent(null, {
                type: 'propertyValueChanged',
            });
            onValueChanged?.(event, value, true);
        }
    };

    return {
        value,
        onChange,
        onPropertyValueChanged,
    };
}
