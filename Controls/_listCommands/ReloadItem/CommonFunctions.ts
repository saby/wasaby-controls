import { TKey } from 'Controls/interface';
import { relation, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

export interface IReloadArgs {
    items: RecordSet;
    root: TKey;
    expandedItems: TKey[];
    parentProperty: string;
    nodeProperty: string;
    keyProperty: string;
}

/**
 * Возвращает родителя записи по ключу
 * @param items
 * @param item
 * @param parentProperty
 */
function getParent(items: RecordSet, item: Model, parentProperty: string): Model {
    return items.getRecordById(item.get(parentProperty));
}

/**
 * Собирает иерархию итема коллекции в виде массива из его id и id его родительских узлов.
 * Первым элементом массива будет текущий root коллекции, а последним сам итем.
 */
export function getItemHierarchy(itemKey: TKey, args: IReloadArgs): TKey[] {
    // Условие про undefined не понятное, просто оставил как было
    const result = [];
    let item = args.items.getRecordById(itemKey);

    if (!item) {
        return [args.root];
    }

    while (item) {
        const parent = getParent(args.items, item, args.parentProperty);

        if (parent) {
            result.unshift(parent.get(args.keyProperty));
        }

        item = parent;
    }
    result.unshift(args.root);
    if (!result.includes(itemKey)) {
        result.push(itemKey);
    }
    return result;
}

/**
 * Рекурсивно итерируется по всем дочерним записям и для каждой записи вызывает либо nodeCallback, либо leafCallback.
 * @param nodeKey - идентификатор узла с дочерних записей которого начинаем перебор
 * @param args - параметры для итерирования
 * @param nodeCallback - ф-ия обратного вызова, которая будет вызвана для все дочерних узлов
 * @param leafCallback - ф-ия обратного вызова, которая будет вызвана для все дочерних листов
 */
function nodeChildrenIterator(
    nodeKey: TKey,
    args: IReloadArgs,
    nodeCallback: (item: Model) => void,
    leafCallback?: (item: Model) => void
): void {
    const item = args.items.getRecordById(nodeKey);

    if (!item) {
        return;
    }

    const hierarchyRelation = new relation.Hierarchy({
        parentProperty: args.parentProperty,
        nodeProperty: args.nodeProperty,
        keyProperty: args.keyProperty,
    });

    hierarchyRelation.getChildren(item.getKey(), args.items).forEach((elem) => {
        if (hierarchyRelation.isNode(elem)) {
            if (nodeCallback) {
                nodeCallback(elem as Model);
            }
            return;
        } else if (leafCallback) {
            leafCallback(elem as Model);
        }

        nodeChildrenIterator((elem as Model).getKey(), args, nodeCallback, leafCallback);
    });
}

/**
 * Ф-ия предназначена для обработки результата глубокой перезагрузки узла дерева.
 * Удаляет из коллекции старые данные, которые отсутствуют в newItems.
 * Поиск старых идет вглубь относительно указанного nodeKey.
 */
export function applyReloadedNodes(nodeKey: TKey, newItems: RecordSet, args: IReloadArgs): void {
    const itemsToRemove = [];
    const checkItemForRemove = (item): void => {
        if (newItems.getIndexByValue(args.keyProperty, item.getKey()) === -1) {
            itemsToRemove.push(item);
        }
    };
    const items = args.items;

    nodeChildrenIterator(nodeKey, args, checkItemForRemove, checkItemForRemove);

    items.setEventRaising(false, true);

    itemsToRemove.forEach((item) => {
        items.remove(item);
    });

    items.setEventRaising(true, true);
}

/**
 * Относительно переданного набора ids возвращает массив, который содержит
 * все идентификаторы их родительских узлов включая root.
 * Результирующий массив содержит только уникальные значения.
 */
export function getReloadItemsHierarchy(ids: TKey[], args: IReloadArgs): TKey[] {
    const result = [];

    // Для каждого id из ids получаем его иерархию
    // и в результирующий массив добавляем только уникальные значения
    for (let i = 0; i < ids.length; i++) {
        getItemHierarchy(ids[i], args)
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
 * Относительно переданного nodeKey собирает идентификаторы родительских и дочерних раскрытых узлов.
 */
export function getRootsForHierarchyReload(nodeKey: TKey, args: IReloadArgs): TKey[] {
    const result = getItemHierarchy(nodeKey, args);

    // Собираем идентификаторы дочерних раскрытых узлов
    nodeChildrenIterator(nodeKey, args, (elem) => {
        const key = elem.getKey();

        // Не добавляем узел если он свернут, т.к. если данных не было то и незачем их обновлять
        if (args.expandedItems.includes(key)) {
            result.push(key);
        }
    });

    return result;
}
