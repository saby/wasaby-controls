/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
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

export function getValidatedItemKey(key: string): CrudEntityKey {
    // Если в начале строки точка, то нельзя приводить этот ключ к числу, т.к. получим число 0.XXXX
    return isNaN(key) || (typeof key === 'string' && key[0] === '.')
        ? key
        : Number(key);
}

export function getKey(item: Model | string): CrudEntityKey {
    if (item['[Types/_entity/Model]']) {
        return item.getKey();
    }

    return item as string;
}
