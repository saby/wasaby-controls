import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { Form } from 'Controls-DataEnv/dataFactory';

type NamePropType = string[];
type BindingType = {
    sliceName: string;
    fieldName: string;
};

export type WidgetProps = {
    name: NamePropType;
};

/**
 * Хук для работы со слайсом формы
 * @param props
 */
export const useConnectedValue = (name: NamePropType) => {
    const bindings = getBindings(name);
    const context = React.useContext(DataContext);
    const slice = getSlice(context, bindings);

    const [connectedValue, setConnectedValue] = React.useState(slice.get(bindings.fieldName));

    return {
        value: connectedValue,
        onChange: (value) => {
            setConnectedValue(value);
            slice.set(bindings.fieldName, value);
        },
    };
};

/**
 * Возвращает подходящий слайс из контекста
 * @param binding
 */
function getSlice(context: Record<TKey, unknown>, binding: BindingType): (typeof Form)['slice'] {
    const { sliceName } = binding;

    if (context.hasOwnProperty(sliceName)) {
        return context[sliceName];
    }
    throw new Error(`Слайс формы с именем ${sliceName} не найден в контексте.`);
}

function getBindings(name: NamePropType): BindingType {
    const [sliceName, fieldName] = name;
    return {
        sliceName,
        fieldName,
    };
}

/**
 * Функция возвращает очищенные пропсы для передачи в children
 * @param props
 */
export function clearProps(props: WidgetProps): object {
    const { name, ...result } = props;
    return result;
}
