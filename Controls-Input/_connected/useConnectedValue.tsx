import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { Form } from 'Controls-DataEnv/dataFactory';
import type { NameBindingType, IConnectedWidgetProps } from 'Controls/interface';
import { parseConnectedBinding, BindingType } from './utils';

/**
 * Хук для работы со слайсом формы
 * @param props
 */
export const useConnectedValue = (name: NameBindingType) => {
    const bindings = parseConnectedBinding(name);
    const context = React.useContext(DataContext);
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

    if (context.hasOwnProperty(slice)) {
        return context[slice];
    }
    throw new Error(`Слайс формы с именем ${slice} не найден в контексте.`);
}

/**
 * Функция возвращает очищенные пропсы для передачи в children
 * @param props
 */
export function clearProps(props: IConnectedWidgetProps): object {
    const { name, ...result } = props;
    return result;
}
