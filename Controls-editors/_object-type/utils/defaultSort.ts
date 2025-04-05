import { BooleanType, FunctionType, Meta } from 'Meta/types';

/**
 * Возвращает важность свойства.
 * @param type
 * @private
 */
function getImportance(type: Meta<any>): number {
    const order = type.getOrder();
    if (order !== undefined) {
        return Number.MAX_SAFE_INTEGER - order;
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
 * Сортирует свойства алгоритмом по умолчанию.
 * @param a
 * @param b
 */
export function defaultSort(a: Meta<any>, b: Meta<any>): number {
    return (
        getImportance(b) - getImportance(a) ||
        ((b.getTitle() || b.getId() || '') > (a.getTitle() || a.getId() || '') ? -1 : 1)
    );
}
