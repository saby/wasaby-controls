/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Model } from 'Types/entity';
import type { Collection, CollectionItem } from 'Controls/display';
import { UILogic } from 'Controls/listsCommonLogic';

export const getPlainItemContents = UILogic.Common.getPlainItemContents;
export const getKey = UILogic.Common.getKey;

// Метод позволяет позвать обработчики событий в BaseControl, если у записи нет доступа к коллекции списков
// здесь item - это рекорд, т.к. в новых компонентах на CollectionItem не получается забиндить
export function callWithCollectionItem(
    item: Model,
    collection: Collection,
    callback: (collectionItem: CollectionItem) => unknown
): unknown {
    // Если item уже CollectionItem, то сразу выполняем
    if (item?.contents) {
        return callback(item as unknown as CollectionItem);
    }
    const key = getKey(item);
    const collectionItem = collection.getItemBySourceKey(key, false);
    if (collectionItem) {
        return callback(collectionItem);
    }
    //Если в первом случае item не был найден, то возможно это новая добавленная запись и ключ у неё с префиксом "adding-"
    const createdItem = collection.getItemBySourceKey(`adding-${key}`, false);
    if (createdItem) {
        return callback(createdItem);
    }
}
