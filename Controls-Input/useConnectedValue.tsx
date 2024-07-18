import * as React from 'react';
import type { FormSlice } from 'Controls-DataEnv/dataFactory';
import type { NameBindingType, IConnectedWidgetProps, BindingPathItem } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import type { format } from 'Types/entity';
import { useSlice, DataContext } from 'Controls-DataEnv/context';

const DEFAULT_DATA_SLICE = 'FormData';
const EMPTY_SLICE = {
    get: () => undefined,
    set: () => undefined,
};

/**
 * Хук для работы со слайсом формы
 * @param name
 * @param defaultValue
 */
export const useConnectedValue = (name: NameBindingType = [], defaultValue: unknown = null) => {
    const context = React.useContext(DataContext);
    const bindings = parseConnectedBinding(name, context);
    const slice = useSlice(bindings.slice) || EMPTY_SLICE;
    const fieldData = useSlice('FieldData');
    const connectedValue = slice.get(bindings.field);

    return React.useMemo(() => {
        return {
            value: connectedValue !== undefined ? connectedValue : defaultValue,
            onChange: (value) => {
                if (!name.length) {
                    return Logger.warn(
                        'useConnectedValue: Не задана привязка name, запись значения невозможна.'
                    );
                }
                slice?.set(bindings.field, value);
            },
            type: getFieldType(slice, bindings.field) || getFieldTypeInFields(fieldData, name),
        };
    }, [name, connectedValue, defaultValue]);
};

/**
 * Функция возвращает очищенные пропсы для передачи в children
 * @param props
 */
export function clearProps(props: IConnectedWidgetProps): object {
    const { name, ...result } = props;
    return result;
}

const DEFAULT_DELIMITER = '.';

export type BindingType = {
    slice: BindingPathItem;
    field: NameBindingType;
};

/**
 * Функция разбирает значение пропса name и возвращает отдельно контекс и поле контекста.
 * @param name
 * @param context
 */
export function parseConnectedBinding(
    name: NameBindingType,
    context?: Record<string, unknown>
): BindingType {
    const [slice, ...fields] = name;

    if (context && slice && context.hasOwnProperty(slice)) {
        return {
            slice,
            field: fields,
        };
    }

    return {
        slice: DEFAULT_DATA_SLICE,
        field: [slice, ...fields],
    };
}

function getFieldType(slice: FormSlice, field: NameBindingType): format.Field | void {
    return slice.store?.getType?.(field);
}

/**
 * Получение типа данных на основе списка полей карты данных (без самих данных)
 * @param fieldsData
 * @param field
 */
function getFieldTypeInFields(fieldsData, field: NameBindingType): format.Field | undefined {
    const fieldData = fieldsData?.findByBind(field);
    if (!fieldData) {
        return;
    }
    return fieldData.FieldType;
}
