import { useState, useEffect, useRef, useCallback } from 'react';
import { SyntheticEvent } from 'UICommon/Events';
import { debounce } from 'Types/function';

const ON_CHANGE_ADAPTIVE_DEBOUNCE_TIME = 500;

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

    const isMounted = useRef<boolean>(false);

    useEffect(() => {
        isMounted.current = true;
        setStateValue(propertyValue);
        setInitValue(propertyValue);

        return () => {
            isMounted.current = false;
        };
    }, [propertyValue]);

    const onPropertyValueChanged = useCallback<ISetValueFunction<T>>(
        (value: T) => {
            if (isValueChanged(value, initValue)) {
                setStateValue(value);
                setInitValue(value);
                // TODO: удалить после перевода всех редакторов на реакт
                const event = new SyntheticEvent(null, {
                    type: 'propertyValueChanged',
                });
                onValueChanged?.(event, value, true);
            }
        },
        [setStateValue, setInitValue, onValueChanged, initValue]
    );

    const propChangedDebounce = useCallback(
        debounce((newPropertyValue) => {
            if (isMounted.current && newPropertyValue !== propertyValue) {
                onPropertyValueChanged(newPropertyValue);
            }
        }, ON_CHANGE_ADAPTIVE_DEBOUNCE_TIME),
        [onPropertyValueChanged]
    );

    const onChange = useCallback<ISetValueFunction<T>>(
        (event: SyntheticEvent, value: T) => {
            // Попытка починить проблему изменения значений редакторов на адаптиве
            // на мобильных устройствах есть ситуации, когда событие editingObjectChanged
            // может стрельнуть синхронно несколько раз (пример в ошибке https://online.sbis.ru/opendoc.html?guid=3dbdb31a-0280-47d6-bf3e-1008d595c767&client=3)
            // При этом прикладные контролы не успевают обновиться и в опциях у них старое значение
            if (props.isAdaptive) {
                propChangedDebounce(value);
            }
            return setStateValue(value);
        },
        [setStateValue, propChangedDebounce]
    );

    return {
        value,
        onChange,
        onPropertyValueChanged,
    };
}
