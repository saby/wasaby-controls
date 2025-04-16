import { TKey } from 'Controls/interface';
import { QueryWhereExpression } from 'Types/source';

export default function prepareFilterWithExpandedItems(
    filter: QueryWhereExpression<unknown>,
    expandedItems: TKey[],
    parentProperty: string,
    root: TKey
): Record<string, unknown> {
    const resultFilter = { ...filter };
    // Набираем все раскрытые узлы
    if (expandedItems?.length && expandedItems?.[0] !== null) {
        resultFilter[parentProperty] = Array.isArray(resultFilter[parentProperty])
            ? (resultFilter[parentProperty] as TKey[])
            : [];
        // Добавляет root в фильтр expanded узлов
        if ((resultFilter[parentProperty] as TKey[]).indexOf(root) === -1) {
            (resultFilter[parentProperty] as TKey[]).push(root);
        }
        // Добавляет отсутствующие expandedItems в фильтр expanded узлов
        resultFilter[parentProperty] = (resultFilter[parentProperty] as TKey[]).concat(
            expandedItems.filter((key) => {
                return (resultFilter[parentProperty] as TKey[]).indexOf(key) === -1;
            })
        );
    } else if (root !== undefined) {
        resultFilter[parentProperty] = root;
    }

    return resultFilter;
}
