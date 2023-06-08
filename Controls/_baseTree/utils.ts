/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { Model } from 'Types/entity';
import Tree from './display/Tree';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';

/**
 * Относительно переданного nodeKey собирает идентификаторы родительских и дочерних раскрытых узлов.
 */
export function getRootsForHierarchyReload(viewModel: Tree, nodeKey: TKey): TKey[] {
    const items = getItemHierarchy(viewModel, nodeKey);

    // Собираем идентификаторы дочерних раскрытых узлов
    nodeChildrenIterator(viewModel, nodeKey, (elem) => {
        const key = elem.getKey();

        // Не добавляем узел если он свернут, т.к. если данных не было то и незачем их обновлять
        if (viewModel.getExpandedItems().indexOf(key) >= 0) {
            items.push(key);
        }
    });

    return items;
}

/**
 * Относительно переданного набора ids возвращает массив, который содержит
 * все идентификаторы их родительских узлов включая root.
 * Результирующий массив содержит только уникальные значения.
 */
export function getReloadItemsHierarchy(collection: Tree, ids: TKey[]): TKey[] {
    const result = [];

    // Для каждого id из ids получаем его иерархию
    // и в результирующий массив добавляем только уникальные значения
    for (let i = 0; i < ids.length; i++) {
        getItemHierarchy(collection, ids[i])
            // Последний элемент это id самого итема, нам его не надо
            .slice(0, -1)
            // Оставляем только уникальные значения
            .forEach((id) => {
                if (result.indexOf(id) < 0) {
                    result.push(id);
                }
            });
    }

    return result;
}

/**
 * Собирает иерархию итема коллекции в виде массива из его id и id его родительских узлов.
 * Первым элементом массива будет текущий root коллекции, а последним сам итем.
 */
export function getItemHierarchy(viewModel: Tree, itemKey: TKey): TKey[] {
    // Условие про undefined не понятное, просто оставил как было
    const hierarchy = [itemKey !== undefined ? itemKey : null];
    const item = viewModel.getItemBySourceKey(itemKey);

    if (!item) {
        return hierarchy;
    }

    let parent = item.getParent();
    const root = viewModel.getRoot();

    // Добавляем идентификаторы родительских узлов
    while (parent !== root) {
        const contents = parent.getContents();

        // Если contents это массив, значит parent это BreadcrumbsRow
        // и необходимая иерархия уже содержится в ней
        if (Array.isArray(contents)) {
            hierarchy.unshift(
                ...contents.map((i) => {
                    return i.getKey();
                })
            );
        } else {
            hierarchy.unshift(contents.getKey());
        }

        parent = parent.getParent();
    }

    // Добавляем идентификатор корня
    hierarchy.unshift(root.getContents());

    return hierarchy;
}

/**
 * Рекурсивно итерируется по всем дочерним записям и для каждой записи вызывает либо nodeCallback, либо leafCallback.
 * @param viewModel - коллекция по которой итерируемся
 * @param nodeKey - идентификатор узла с дочерних записей которого начинаем перебор
 * @param nodeCallback - ф-ия обратного вызова, которая будет вызвана для все дочерних узлов
 * @param leafCallback - ф-ия обратного вызова, которая будет вызвана для все дочерних листов
 */
function nodeChildrenIterator(
    viewModel: Tree,
    nodeKey: TKey,
    nodeCallback: (item: Model) => void,
    leafCallback?: (item: Model) => void
): void {
    const item = viewModel.getItemBySourceKey(nodeKey);

    if (!item) {
        return;
    }

    viewModel.getChildren(item).forEach((elem) => {
        if (elem['[Controls/_display/SpaceCollectionItem]']) {
            return;
        }

        if (elem.isNode() === null) {
            if (leafCallback) {
                leafCallback(elem.getContents());
            }
            return;
        }

        if (nodeCallback) {
            nodeCallback(elem.getContents());
        }

        nodeChildrenIterator(viewModel, elem.getContents().getKey(), nodeCallback, leafCallback);
    });
}

/**
 * Ф-ия предназначена для обработки результата глубокой перезагрузки узла дерева.
 * Удаляет из коллекции старые данные, которые отсутствуют в newItems.
 * Поиск старых идет вглубь относительно указанного nodeKey.
 */
export function applyReloadedNodes(viewModel: Tree, nodeKey: TKey, newItems: RecordSet): void {
    const itemsToRemove = [];
    const items = viewModel.getSourceCollection() as unknown as RecordSet;
    const checkItemForRemove = (item): void => {
        if (newItems.getIndexByValue(viewModel.getKeyProperty(), item.getKey()) === -1) {
            itemsToRemove.push(item);
        }
    };

    nodeChildrenIterator(viewModel, nodeKey, checkItemForRemove, checkItemForRemove);

    items.setEventRaising(false, true);

    itemsToRemove.forEach((item) => {
        items.remove(item);
    });

    items.setEventRaising(true, true);
}
