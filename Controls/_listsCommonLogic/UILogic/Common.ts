import type { Model } from 'Types/entity';
import type { CrudEntityKey } from 'Types/source';
import type { CollectionItem } from 'Controls/display';

export function getKey(item: Model | Model[] | string): CrudEntityKey {
    if (item === null) {
        return item;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (item['[Types/_entity/Model]']) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return item.getKey();
    }

    if (item instanceof Array) {
        return getKey(item[item.length - 1]);
    }

    return item as string;
}

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
