/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model, relation, IObject } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';

let cachedHierarchyRelation: relation.Hierarchy;
enum MOVE_DIRECTION {
    UP = 'up',
    DOWN = 'down',
}

interface IGetSiblingItemParams {
    direction: MOVE_DIRECTION;
    items: RecordSet;
    item: Model;
    parentProperty: string;
    keyProperty: string;
    nodeProperty?: string;
    root?: CrudEntityKey;
}

/**
 * HierarchyRelation умеет работать только когда root присутствует в коллекции или null.
 * Если нам сюда указали значение root, значит произошло проваливание в папку,
 * и root может отсутствовать в коллекции, поэтому клонируем коллекцию и добавляет запись root
 * @param params
 */
function getItemsWithRoot(params: IGetSiblingItemParams): RecordSet {
    const record = new Model({
        keyProperty: params.keyProperty,
        adapter: params.items.getAdapter(),
    });

    record.addField({
        name: params.keyProperty,
        type: 'string',
        defaultValue: params.root,
    });
    record.addField({
        name: params.parentProperty,
        type: 'string',
        defaultValue: null,
    });
    if (params.nodeProperty && params.nodeProperty.length) {
        record.addField({
            name: params.nodeProperty,
            type: 'boolean',
            defaultValue: true,
        });
    }

    const result = params.items.clone();
    result.add(record, 0);
    return result;
}

/**
 * Пересоздание экземпляра HierarchyRelation увеличивает время отработки метода в 2 раза.
 * Поэтому кешируем его и возвращаем сохранённое статическое значение экземпляра.
 * @param keyProperty
 * @param parentProperty
 * @param nodeProperty
 */
function getHierarchyRelation(
    keyProperty: string,
    parentProperty: string,
    nodeProperty: string
): relation.Hierarchy {
    if (
        !cachedHierarchyRelation ||
        keyProperty !== cachedHierarchyRelation.getKeyProperty() ||
        parentProperty !== cachedHierarchyRelation.getParentProperty() ||
        nodeProperty !== cachedHierarchyRelation.getNodeProperty()
    ) {
        cachedHierarchyRelation = new relation.Hierarchy({
            keyProperty,
            parentProperty,
            nodeProperty,
        });
    }
    return cachedHierarchyRelation;
}

/**
 * Делаем выборку из коллекции по родителю текущей записи.
 * @param params
 */
function getSubSet(params: IGetSiblingItemParams): IObject[] {
    const hierarchyRelation = getHierarchyRelation(
        params.keyProperty,
        params.parentProperty,
        params.nodeProperty
    );
    let recordSet: RecordSet;
    if (
        params.root === undefined ||
        params.root === null ||
        params.items.getRecordById(params.root)
    ) {
        // В режиме поиска могут запросить расчёт для записи, у которой точно есть parent,
        // при этом запись parent отсутствует в RecordSet, а root не указан.
        // В таком случае root для HierarchyRelation нужно создать из parent текущего item.
        if (
            params.item.get(params.parentProperty) &&
            !hierarchyRelation.hasParent(params.item, params.items)
        ) {
            params.root = params.item.get(params.parentProperty);
            recordSet = getItemsWithRoot(params);
        } else {
            recordSet = params.items;
        }
    } else {
        // Если указан root, то пробуем получить RecordSet с этим Root
        recordSet = getItemsWithRoot(params);
    }
    const parent = hierarchyRelation.getParent(params.item, recordSet);
    return hierarchyRelation.getChildren(parent, recordSet);
}

/**
 * Список хелперов для отображения панели операций над записью.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @class Controls/_list/ItemActions/Helpers
 * @public
 */

/*
 * List of helpers for displaying item actions.
 * @class Controls/_list/ItemActions/Helpers
 * @public
 * @author Авраменко А.С.
 */
const helpers = {
    /**
     * @typedef {String} MoveDirection
     * @variant up Двигаться вверх.
     * @variant down Двигаться вниз
     */

    /*
     * @typedef {String} MoveDirection
     * @variant up Move up
     * @variant down Move down
     */
    MOVE_DIRECTION,

    /**
     * Хелпер для отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ панели опций записи} наверху/внизу.
     * @function Controls/_list/ItemActions/Helpers#reorderMoveActionsVisibility
     * @param {MoveDirection} direction Направление.
     * @param {Types/entity:Record} item Экземпляр элемента, действие которого обрабатывается.
     * @param {Types/collection:RecordSet} items Список всех элементов.
     * @param {Controls/_interface/IHierarchy#parentProperty} parentProperty Имя поля, содержащего сведения о родительском узле.
     * @param {Controls/_interface/IHierarchy#nodeProperty} nodeProperty Имя поля, описывающего тип узла (список, узел, скрытый узел).
     * @example
     * В следующем примере разрешается перемещать только элементы, находящиеся в одном родительском элементе.
     * JS:
     * <pre>
     * _itemActionVisibilityCallback: function(action, item) {
     *    var result = true;
     *
     *    if (action.id === 'up' || action.id === 'down') {
     *       result = visibilityCallback.reorderMoveActionsVisibility(action.id, item, this._items, 'Parent');
     *    }
     *
     *    return result;
     * }
     * </pre>
     *
     * В следующем примере разрешается перемещать только элементы, которые находятся в том же родительском элементе и имеют тот же тип.
     * JS:
     * <pre>
     * _itemActionVisibilityCallback: function(action, item) {
     *    var result = true;
     *
     *    if (action.id === 'up' || action.id === 'down') {
     *       result = visibilityCallback.reorderMoveActionsVisibility(action.id, item, this._items, 'Parent', 'Parent@');
     *    }
     *
     *    return result;
     * }
     * </pre>
     */

    /*
     * Helper to display up/down item actions.
     * @function
     * @name Controls/_list/ItemActions/Helpers#reorderMoveActionsVisibility
     * @param {MoveDirection} direction
     * @param {Types/entity:Record} item Instance of the item whose action is being processed.
     * @param {Types/collection:RecordSet} items List of all items.
     * @param {Controls/_interface/IHierarchy#parentProperty} parentProperty Name of the field that contains information about parent node.
     * @param {Controls/_interface/IHierarchy#nodeProperty} nodeProperty Name of the field describing the type of the node (list, node, hidden node).
     * @param {String} root Current root
     * @example
     */

    /*
     * @example
     * In the following example, only items that are in the same parent are allowed to be moved.
     * JS:
     * <pre>
     * _itemActionVisibilityCallback: function(action, item) {
     *    var result = true;
     *
     *    if (action.id === 'up' || action.id === 'down') {
     *       result = visibilityCallback.reorderMoveActionsVisibility(action.id, item, this._items, 'Parent', '', this._root);
     *    }
     *
     *    return result;
     * }
     * </pre>
     *
     * In the following example, only items that are in the same parent and have the same type are allowed to be moved.
     * JS:
     * <pre>
     * _itemActionVisibilityCallback: function(action, item) {
     *    var result = true;
     *
     *    if (action.id === 'up' || action.id === 'down') {
     *       result = visibilityCallback.reorderMoveActionsVisibility(action.id, item, this._items, 'Parent', 'Parent@', this._root);
     *    }
     *
     *    return result;
     * }
     * </pre>
     */
    reorderMoveActionsVisibility(
        direction: string,
        item: Model,
        items: RecordSet,
        parentProperty?: string,
        nodeProperty?: string,
        root?: CrudEntityKey
    ): boolean {
        const siblingItem = this.getSiblingItem(
            direction,
            item,
            items,
            parentProperty,
            nodeProperty,
            root
        );

        return (
            !!siblingItem &&
            // items in the same folder
            (!parentProperty ||
                siblingItem.get(parentProperty) === item.get(parentProperty)) &&
            // items of the same type
            (!nodeProperty ||
                siblingItem.get(nodeProperty) === item.get(nodeProperty))
        );
    },

    getSiblingItem(
        direction: MOVE_DIRECTION,
        item: Model,
        items: RecordSet,
        parentProperty?: string,
        nodeProperty?: string,
        root?: CrudEntityKey
    ): Model {
        let itemIndex: number;
        const key = item.getKey();
        // Для дерева (Когда есть parentProperty) создём HierarchyRelation
        // и выбираем только среди записей внутри одного родителя
        if (parentProperty) {
            const subset = getSubSet({
                keyProperty: items.getKeyProperty(),
                direction,
                item,
                items,
                parentProperty,
                nodeProperty,
                root,
            });
            itemIndex = subset.findIndex((it: Model) => {
                return it.getKey() === key;
            });
            return subset[
                direction === MOVE_DIRECTION.UP ? --itemIndex : ++itemIndex
            ] as Model;
        }
        itemIndex = items.getIndex(item);
        return items.at(
            direction === MOVE_DIRECTION.UP ? --itemIndex : ++itemIndex
        );
    },
};

export = helpers;
