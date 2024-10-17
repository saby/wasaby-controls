/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import type { Collection, CollectionItem } from 'Controls/display';
import { CrudEntityKey } from 'Types/source';
import { TItemEventHandler } from 'Controls/_baseList/ItemComponent';

/**
 * TODO нужно выпилить этот метод при переписывании моделей. item.getContents() должен возвращать Record
 *  https://online.sbis.ru/opendoc.html?guid=acd18e5d-3250-4e5d-87ba-96b937d8df13
 * @param item
 */
export function getPlainItemContents(item: CollectionItem<Model>): Model {
    let contents = item.getContents();
    if (item['[Controls/_baseTree/BreadcrumbsItem]'] || item.breadCrumbs) {
        contents = contents[(contents as any).length - 1];
    }
    return contents;
}

export function getKey(item: Model | Model[] | string): CrudEntityKey {
    if (item === null) {
        return item;
    }
    if (item['[Types/_entity/Model]']) {
        return item.getKey();
    }

    if (item instanceof Array) {
        return getKey(item[item.length - 1]);
    }

    return item as string;
}

// Метод позволяет позвать обработчики событий в BaseControl, если у записи нет доступа к коллекции списков
// здесь item - это рекорд, т.к. в новых компонентах на CollectionItem не получается забиндить
export function callWithCollectionItem(
    item: Model,
    collection: Collection,
    callback: (collectionItem: CollectionItem) => unknown
): unknown {
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
