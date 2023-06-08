import type { NameBindingType, BindingPathItem, IConnectedWidgetProps } from 'Controls/interface';

const DEFAULT_DELIMITER = '.';

export type BindingType = {
    slice: BindingPathItem;
    field: BindingPathItem;
};

/**
 * Функция разбирает значение пропса name и возвращает отдельно контекс и поле контекста.
 * @param name
 */
export function parseConnectedBinding(name: NameBindingType): BindingType {
    const [slice, ...fields] = name;
    return {
        slice,
        field: fields.join(DEFAULT_DELIMITER),
    };
}
