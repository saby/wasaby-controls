import { RecordSet, isRecordSet } from 'Types/collection';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Функция возвращает первый элемент из navigationItems или из items
 * */
export function getActiveElementByItems(items: RecordSet): TKey {
    let activeElement;
    const navigationItems = items?.getMetaData()?.navigation;
    if (isRecordSet(navigationItems) && navigationItems.getCount()) {
        activeElement = navigationItems.at(0)?.getKey();
    } else {
        activeElement = items?.at(0)?.getKey();
    }
    return activeElement;
}
