import * as React from 'react';
import type { FormSlice } from 'Controls-DataEnv/dataFactory';
import type { BindingPathItem, IConnectedWidgetProps, NameBindingType } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import type { format } from 'Types/entity';
import useSlice from './useSlice';

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
    const [sliceName, ...fields] = getSafeFieldType(name).name;

    const formDataSlice = useSlice(DEFAULT_DATA_SLICE);
    const dataObjectSlice = useSlice(sliceName);
    const typeRepository = useSlice('TypeRepository');

    const slice = (dataObjectSlice || formDataSlice || EMPTY_SLICE) as FormSlice;
    const binding = dataObjectSlice ? fields : name;

    const connectedValue = binding.length !== 0 ? slice.get(binding) : undefined;

    return React.useMemo(() => {
        return {
            value: connectedValue !== undefined ? connectedValue : defaultValue,
            onChange: (value: any) => {
                if (!name.length) {
                    return Logger.warn(
                        'useConnectedValue: Не задана привязка name, запись значения невозможна.'
                    );
                }
                slice?.set(binding, value);
            },
            type: getFieldType(slice, binding) || getFieldTypeInFields(typeRepository, name),
        };
    }, [name, connectedValue, defaultValue]);
};

/**
 * Функция возвращает очищенные пропсы для передачи в children
 *  @param props
 */
export function clearProps(props: IConnectedWidgetProps): object {
    const { name, ...result } = props;
    return result;
}

/**
 *
 */
export interface BindingType {
    /**
     *
     */
    slice: BindingPathItem;
    /**
     *
     */
    field: NameBindingType;
}

function getFieldType(slice: FormSlice, field: NameBindingType): format.Field | void {
    return slice.store?.getType?.(field);
}

/**
 * Получение типа данных на основе списка полей карты данных (без самих данных)
 * @param typeRepository
 * @param field
 */
function getFieldTypeInFields(
    typeRepository: any,
    field: NameBindingType
): format.Field | undefined {
    const fieldData = typeRepository?.getPlatformFieldType(field);
    if (!fieldData) {
        return;
    }
    return fieldData;
}

export function getSafeFieldType(field: unknown): { name: NameBindingType } {
    if (Array.isArray(field)) {
        return {
            name: field,
        };
    }
    return field as { name: NameBindingType };
}
