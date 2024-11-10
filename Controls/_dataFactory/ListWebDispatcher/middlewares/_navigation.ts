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
