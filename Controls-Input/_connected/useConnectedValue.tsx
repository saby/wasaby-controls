import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { Form } from 'Controls-DataEnv/dataFactory';
import type { NameBindingType, IConnectedWidgetProps, BindingPathItem } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';

/**
 * Хук для работы со слайсом формы
 * @param props
 */
export const useConnectedValue = (name: NameBindingType = []) => {
    const context = React.useContext(DataContext);
    const bindings = parseConnectedBinding(name, context);
    const slice = getSlice(context, bindings);

    const [connectedValue, setConnectedValue] = React.useState(slice.get(bindings.field));

    return {
        value: connectedValue,
        onChange: (value) => {
            setConnectedValue(value);
            slice.set(bindings.field, value);
        },
    };
};

/**
 * Возвращает подходящий слайс из контекста
 * @param binding
 */
export function getSlice(
    context: Record<string, unknown>,
    binding: BindingType
): typeof Form.slice {
    const { slice } = binding;
    if (context && slice && context.hasOwnProperty(slice)) {
        return context[slice];
    }

    Logger.warn(`Слайс формы с именем ${slice} не найден в контексте.`);
    return {
        get: () => null,
    };
}

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
    field: BindingPathItem;
};

/**
 * Функция разбирает значение пропса name и возвращает отдельно контекс и поле контекста.
 * @param name
 */
export function parseConnectedBinding(
    name: NameBindingType,
    context: Record<string, unknown>
): BindingType {
    const [slice, ...fields] = name;

    /*
     * В режиме published данные возвращает один метод БЛ.
     * Вместо отдельного слайса "Пользовательские данные", записи окажутся в поле "Сделка.UserData"
     * TODO: удалить после доработки метода БЛ SiteDataObject.Read
     */
    if (slice === 'Пользовательские данные' && !context.hasOwnProperty(slice)) {
        const patchedBinding: BindingType = {
            slice: 'Сделка',
            field: ['UserData', ...fields].join(DEFAULT_DELIMITER),
        };
        return patchedBinding;
    }
    return {
        slice,
        field: fields.join(DEFAULT_DELIMITER),
    };
}
