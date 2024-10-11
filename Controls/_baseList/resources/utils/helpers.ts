/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Model } from 'Types/entity';
import { CollectionItem } from 'Controls/display';
import { CrudEntityKey } from 'Types/source';

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
