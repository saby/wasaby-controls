/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeItem from './TreeItem';
import { Model } from 'Types/entity';
import { CollectionEnumerator } from 'Controls/display';

function hasInParents<T extends TreeItem>(item: T, targetParent: T): boolean {
    if (targetParent.isRoot()) {
        return true;
    }
    let current = item;
    while (current) {
        current = current.getParent();
        if (current.isRoot()) {
            return false;
        } else if (current === targetParent) {
            return true;
        }
    }
    return false;
}

/**
 * Возвращает соседний элемент проекции
 * @param collectionRoot - корневой узел дерева
 * @param enumerator Энумератор элементов
 * @param item Элемент проекции относительно которого искать
 * @param isNext Искать следующий или предыдущий элемент
 * @param [conditionProperty] Свойство, по которому происходит отбор элементов
 * @param [isShallow] Искать среди одного уровня с родителем исходного или среди всех уровней
 */
export function getTreeNearbyItem<S extends Model = Model, T extends TreeItem<S> = TreeItem<S>>(
    collectionRoot: T,
    enumerator: CollectionEnumerator<T>,
    item: T,
    isNext: boolean,
    conditionProperty?: string,
    isShallow: boolean = true
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
        sameParent =
            nearbyItem && isTreeItem
                ? isShallow
                    ? nearbyItem.getParent() === parent
                    : hasInParents(nearbyItem, parent)
                : false;
        current = hasItem && (!isTreeItem || sameParent) ? nearbyItem : undefined;
    }

    enumerator.setCurrent(initial);

    return current;
}
