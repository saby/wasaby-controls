/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import TreeItem from './TreeItem';
import { Model } from 'Types/entity';
import { CollectionEnumerator } from 'Controls/display';

/**
 * Возвращает соседний элемент проекции в рамках одного парента с исходным
 * @param collectionRoot - корневой узел дерева
 * @param enumerator Энумератор элементов
 * @param item Элемент проекции относительно которого искать
 * @param isNext Искать следующий или предыдущий элемент
 * @param [conditionProperty] Свойство, по которому происходит отбор элементов
 */
export function getTreeNearbyItem<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>>(
    collectionRoot: T,
    enumerator: CollectionEnumerator<T>,
    item: T,
    isNext: boolean,
    conditionProperty?: string
): T {
    const method = isNext ? 'moveNext' : 'movePrevious';
    const parent = (item && item.getParent && item.getParent()) || collectionRoot;
    let hasItem = true;
    const initial = enumerator.getCurrent();
    let sameParent = false;
    let current;
    let nearbyItem;
    let isTreeItem;

    enumerator.setCurrent(item);

    // TODO: отлеживать по level, что вышли "выше"
    while (hasItem && !sameParent) {
        hasItem = enumerator[method]();
        nearbyItem = enumerator.getCurrent();

        // если мы пришли сюда, когда в enumerator ещё ничего нет, то nearbyItem будет undefined
        if (!!nearbyItem && conditionProperty && !nearbyItem[conditionProperty]) {
            nearbyItem = undefined;
            continue;
        }
        // Когда _getNearbyItem используется для обычных групп, у них нет getParent
        isTreeItem =
            nearbyItem &&
            (nearbyItem['[Controls/_display/TreeItem]'] ||
                nearbyItem['[Controls/_baseTree/BreadcrumbsItem]']);
        sameParent = nearbyItem && isTreeItem ? nearbyItem.getParent() === parent : false;
        current = hasItem && (!isTreeItem || sameParent) ? nearbyItem : undefined;
    }

    enumerator.setCurrent(initial);

    return current;
}
