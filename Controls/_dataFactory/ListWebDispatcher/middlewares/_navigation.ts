/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls-DataEnv/interface';

// возвращает первый элемент из navigationItems или из items
export function getActiveElementByItems(items: RecordSet): TKey {
    let activeElement;
    const navigationItems = items?.getMetaData()?.navigation;
    if (navigationItems?.['[Types/_collection/RecordSet]'] && navigationItems.getCount()) {
        activeElement = navigationItems.at(0)?.getKey();
    } else {
        activeElement = items?.at(0)?.getKey();
    }
    return activeElement;
}
