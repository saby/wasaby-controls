import * as React from 'react';
import type { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Logger } from 'UICommon/Utils';
import { format } from 'Types/entity';
import useSelector from './useSelector';
import useSliceActions from './useSliceActions';

const DEFAULT_DATA_SLICE = 'FormData';
const DEFAULT_DELIMITER = '.';

const EMPTY_SLICE = {
    get: () => undefined,
    set: () => undefined,
};

const EMPTY_NAME: string[] = [];

/**
 * Элемент привязки к контексту
 */
export type BindingPathItem = string;
/**
 * Тип привязки к объекту в контексте
 */
export type NameBindingType = BindingPathItem[];

/**
 * Интерфейс для виджетов, с возможностью прямой работы с контекстом данных.
 * @public
 */
export interface IConnectedWidgetProps {
    name: NameBindingType;
    value: null;
    onChange: null;
}

/**
 * Результата использования хука useConnectedValue
 * @public
 */
export type IConnectedValueResult<T> = {
    value: T;
    onChange: (value: T) => void;
    type: unknown;
};

/**
 * Хук для работы со слайсом формы
 * @param name
 * @param defaultValue
 */
export function useConnectedValue<T>(
    name: NameBindingType = EMPTY_NAME,
    defaultValue: unknown = null
): IConnectedValueResult<T> {
    const [sliceName, ...fields] = React.useMemo(() => {
        return getSafeFieldType(name).name;
    }, [name]);

    const typeRef = React.useRef<any>(null);

    const formDataSlice = useSliceActions(DEFAULT_DATA_SLICE);
    const dataObjectSlice = useSliceActions(sliceName);

    const slice = (dataObjectSlice || formDataSlice || EMPTY_SLICE) as FormSlice;
    const binding: string[] = dataObjectSlice ? fields : name;

    const connectedValueSelector = React.useCallback(
        (state): T => {
            const formState = state?.[sliceName] || state?.[DEFAULT_DATA_SLICE];
            const value = binding.length !== 0 ? formState?.store?.get(binding) : undefined;
            return value !== undefined ? value : defaultValue;
        },
        [binding, sliceName, defaultValue]
    );

    const typeSelector = React.useCallback(
        (state) => {
            const formState = state?.[sliceName] || state?.[DEFAULT_DATA_SLICE];
            const type =
                formState?.store?.getType(binding) ||
                getFieldTypeInFields(state?.TypeRepository, name);
            if (type?.getType() !== typeRef.current?.getType()) {
                typeRef.current = type;
            }

            return typeRef.current;
        },
        [binding, sliceName, name]
    );

    const connectedValue: T = useSelector<unknown, T>(connectedValueSelector);
    const type = useSelector<unknown>(typeSelector);

    return React.useMemo(() => {
        return {
            value: connectedValue,
            onChange: (value: any) => {
                if (!name.length) {
                    return Logger.warn(
                        'useConnectedValue: Не задана привязка name, запись значения невозможна.'
                    );
                }
                slice?.set(binding, value);
            },
            type,
        };
    }, [name, connectedValue, slice, binding, type]);
}

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

function getPlatformFieldType(name: string | string[], state: any): format.Field | undefined {
    const id = Array.isArray(name) ? name.join(DEFAULT_DELIMITER) : name;
    const typeDescription = state?.fieldTypeStore?.find((x: any) => x.name === id);

    if (!typeDescription) {
        return;
    }

    try {
        return format.fieldsFactory({
            name: typeDescription.name,
            type: typeDescription.type,
        });
    } catch {
        // TODO: поддержать RPC v7, в котором вместо рекорда может быть ПО
        return format.fieldsFactory({
            name: typeDescription.name,
            type: 'record',
        });
    }
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
    const fieldData = getPlatformFieldType(field, typeRepository);
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
