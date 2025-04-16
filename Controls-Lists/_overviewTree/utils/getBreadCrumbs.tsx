import { ListSlice } from 'Controls/dataFactory';
import type { TKey } from 'Controls-DataEnv/interface';

export function getBreadCrumbs(slice: ListSlice, activeElement: TKey, root: TKey): TKey[] {
    const result: TKey[] = [];

    // Рекурсивная функция для сбора родителей
    function collectParents(currentId: TKey): void {
        if (!currentId) return;

        const record = slice.state.items?.getRecordById(currentId);

        if (!record || !slice.state.parentProperty || !slice.state.nodeProperty) return;

        const parentId = record.get(slice.state.parentProperty);
        if (parentId === root) {
            // Если достигли корня, добавляем текущий элемент и завершаем рекурсию
            result.unshift(currentId);
            return;
        }

        // Добавляем текущий элемент в начало массива
        if (record.get(slice.state.nodeProperty)) {
            result.unshift(currentId);
        }

        // Продолжаем рекурсию для родительского элемента
        collectParents(parentId);
    }

    // Начинаем сбор родителей с activeElement
    collectParents(activeElement);

    return result;
}
