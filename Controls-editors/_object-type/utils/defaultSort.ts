import { BooleanType, FunctionType, Meta } from 'Types/meta';

/**
 * Возвращает важность свойства.
 * @param type
 */
function getImportance(type: Meta<any>): number {
    if (type.getOrder() !== undefined) {
        return Number.MAX_SAFE_INTEGER - type.getOrder();
    }
    let importance = 0;
    if (type.isRequired()) {
        importance += 1;
    }
    if (type.is(FunctionType)) {
        importance -= 10; // eslint-disable-line no-magic-numbers
    }
    if (type.is(BooleanType)) {
        importance -= 20; // eslint-disable-line no-magic-numbers
    }
    return importance;
}

/**
 * Сортирует свойства алгоритмом по-умолчанию.
 * @param a
 * @param b
 */
export function defaultSort(a: Meta<any>, b: Meta<any>): number {
    return (
        getImportance(b) - getImportance(a) ||
        ((b.getTitle() || b.getId() || '') > (a.getTitle() || a.getId() || '')
            ? -1
            : 1)
    );
}
