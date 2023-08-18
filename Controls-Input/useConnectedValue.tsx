import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { FormSlice } from 'Controls-DataEnv/dataFactory';
import type { NameBindingType, IConnectedWidgetProps, BindingPathItem } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import type { format } from 'Types/entity';

const DEFAULT_DATA_SLICE = 'FormData';

/**
 * Хук для работы со слайсом формы
 * @param name
 * @param defaultValue
 */
export const useConnectedValue = (name: NameBindingType = [], defaultValue: unknown = null) => {
    const context = React.useContext(DataContext);
    const bindings = parseConnectedBinding(name, context);
    const slice = getSlice(context, bindings);
    const connectedValue = slice.get(bindings.field);

    return React.useMemo(() => {
        return {
            value: connectedValue !== undefined ? connectedValue : defaultValue,
            onChange: (value) => {
                slice?.set(bindings.field, value);
            },
            type:
                getFieldType(slice, bindings.field) ||
                getFieldTypeInFields(context?.FieldsData, name),
        };
    }, [name, connectedValue]);
};

/**
 * Возвращает подходящий слайс из контекста
 * @param context
 * @param binding
 */
export function getSlice(
    context: Record<string, unknown>,
    binding: BindingType
): FormSlice {
    const {slice} = binding;

    if (context && slice && context.hasOwnProperty(slice)) {
        return context[slice] as FormSlice;
    }

    Logger.warn(`Слайс формы с именем ${slice} не найден в контексте.`);
    return {
        get: () => undefined,
    };
}

/**
 * Функция возвращает очищенные пропсы для передачи в children
 * @param props
 */
export function clearProps(props: IConnectedWidgetProps): object {
    const {name, ...result} = props;
    return result;
}

const DEFAULT_DELIMITER = '.';

export type BindingType = {
    slice: BindingPathItem;
    field: BindingPathItem;
};

/**
 * Функция разбирает значение пропса name и возвращает отдельно контекс и поле контекста.
 * @param name
 * @param context
 */
export function parseConnectedBinding(
    name: NameBindingType,
    context: Record<string, unknown>
): BindingType {
    const [slice, ...fields] = name;

    if (context && slice && context.hasOwnProperty(slice)) {
        return {
            slice,
            field: fields.join(DEFAULT_DELIMITER),
        };
    }

    return {
        slice: DEFAULT_DATA_SLICE,
        field: [slice, ...fields].join(DEFAULT_DELIMITER),
    };
}

function getFieldType(slice: FormSlice, field: BindingPathItem): format.Field | void {
    const format = slice.store?.getStore?.().getFormat?.();
    if (!format) {
        return;
    }
    const index = format.getFieldIndex(field);
    if (index === null || index === undefined || index < 0) {
        return;
    }
    return format.at(index);
}

/**
 * Получение типа данных на основе списка полей карты данных (без самих данных)
 * @param fieldsData
 * @param field
 */
function getFieldTypeInFields(fieldsData, field: BindingPathItem): format.Field | undefined {
    return fieldsData?.state?.find((x) => x.Title === field.join('.'))?.FieldType;
}
