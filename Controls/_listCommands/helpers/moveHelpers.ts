/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model, relation, IObject } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';

let cachedHierarchyRelation: relation.Hierarchy;

interface IGetSiblingItemParams {
    direction: LOCAL_MOVE_POSITION;
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
 * Параметры хелпера, определяющего возможность перемещения в указанном направлении.
 * @interface Controls/_listCommands/helpers/moveHelpers/MoveHelpers/IMoveToDirection
 * @public
 */
export interface IGetSiblingItem {
    /**
     * Направление перемещения.
     */
    direction: LOCAL_MOVE_POSITION;
    /**
     * Экземпляр элемента, относительно которого производится поиск.
     */
    item: Model;
    /**
     * Список всех элементов.
     */
    items: RecordSet;
    /**
     * Имя поля, содержащего сведения о родительском узле.
     */
    parentProperty?: string;
    /**
     * Имя поля, описывающего тип узла (список, узел, скрытый узел).
     */
    nodeProperty?: string;
    /**
     * Текущий корень иерархии.
     */
    root?: CrudEntityKey;
}

function getSiblingItem(props: IGetSiblingItem): Model {
    const { direction, item, items, parentProperty, nodeProperty, root } = props;
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
            direction === LOCAL_MOVE_POSITION.Before ? --itemIndex : ++itemIndex
        ] as Model;
    }
    itemIndex = items.getIndex(item);
    return items.at(direction === LOCAL_MOVE_POSITION.Before ? --itemIndex : ++itemIndex);
}

function canMoveToDirection(props: IGetSiblingItem): boolean {
    const { item, parentProperty, nodeProperty } = props;
    const siblingItem = getSiblingItem(props);

    return (
        !!siblingItem &&
        // items in the same folder
        (!parentProperty || siblingItem.get(parentProperty) === item.get(parentProperty)) &&
        // items of the same type
        (!nodeProperty || siblingItem.get(nodeProperty) === item.get(nodeProperty))
    );
}

/**
 * Вспомогательные утилиты для отображения комманд перемещения
 * @class Controls/_listCommands/helpers/moveHelpers/MoveHelpers
 * @public
 */
export const MoveHelpers = {
    /**
     * Утилита, позволяющая найти соседнюю запись RecordSet с учётом иерархии.
     * @function Controls/_listCommands/helpers/moveHelpers/MoveHelpers#getSiblingItem
     * @param {Controls/_listCommands/helpers/moveHelpers/MoveHelpers/IMoveToDirection} props Параметры хелпера.
     */
    getSiblingItem,
    /**
     * Утилита, позволяющая определить, можно ли переместить запись вверх/вниз с учётом иерархии
     * @function Controls/_listCommands/helpers/moveHelpers/MoveHelpers#canMoveToDirection
     * @param {Controls/_listCommands/helpers/moveHelpers/MoveHelpers/IMoveToDirection} props Параметры хелпера.
     * @example
     * В следующем примере разрешается перемещать только элементы, находящиеся в одном родительском элементе.
     * TS:
     * <pre>
     * protected _itemActionVisibilityCallback(action: IItemAction, item: Model) {
     *    var result = true;
     *
     *    if (action.id === 'up' || action.id === 'down') {
     *       const direction = action.id === 'up' ? LOCAL_MOVE_POSITION.Before : LOCAL_MOVE_POSITION.After;
     *       result = canMoveToDirection({
     *          direction,
     *          item,
     *          collection: this._items,
     *          parentProperty: 'Parent'
     *       });
     *    }
     *
     *    return result;
     * }
     * </pre>
     *
     * В следующем примере разрешается перемещать только элементы, которые находятся в том же родительском элементе и имеют тот же тип.
     * TS:
     * <pre>
     * protected _itemActionVisibilityCallback(action: IItemAction, item: Model) {
     *    var result = true;
     *
     *    if (action.id === 'up' || action.id === 'down') {
     *       const direction = action.id === 'up' ? LOCAL_MOVE_POSITION.Before : LOCAL_MOVE_POSITION.After;
     *       result = canMoveToDirection({
     *          direction,
     *          item,
     *          collection: this._items,
     *          parentProperty: 'Parent',
     *          nodeProperty: 'Parent@'
     *       });
     *    }
     *
     *    return result;
     * }
     * </pre>
     */
    canMoveToDirection,
};
