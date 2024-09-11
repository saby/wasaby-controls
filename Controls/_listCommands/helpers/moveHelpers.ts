/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';

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

type IGetSiblingItemResult = Model | null;

function getHierarchicalSiblingItem(props: IGetSiblingItem): IGetSiblingItemResult {
    const { direction, item, items, parentProperty } = props;
    const itemKey = item.getKey();
    const itemParent = item.get(parentProperty as string);
    const rootItems: Model[] = [];
    let itemIndexInRootItems = -1;

    items.forEach((rsItem) => {
        if (rsItem.get(parentProperty as string) === itemParent) {
            rootItems.push(rsItem);
            if (rsItem.getKey() === itemKey) {
                itemIndexInRootItems = rootItems.length - 1;
            }
        }
    });

    if (itemIndexInRootItems === -1) {
        return null;
    }

    const siblingItemIndex =
        direction === LOCAL_MOVE_POSITION.Before
            ? itemIndexInRootItems - 1
            : itemIndexInRootItems + 1;

    return rootItems[siblingItemIndex] || null;
}

function getFlatSiblingItem(props: IGetSiblingItem): IGetSiblingItemResult {
    const { direction, item, items } = props;
    const itemIndex = items.getIndexByValue(items.getKeyProperty(), item.getKey());
    const siblingItemIndex =
        direction === LOCAL_MOVE_POSITION.Before ? itemIndex - 1 : itemIndex + 1;

    return items.at(siblingItemIndex) || null;
}

function getSiblingItem(props: IGetSiblingItem): IGetSiblingItemResult {
    return props.parentProperty ? getHierarchicalSiblingItem(props) : getFlatSiblingItem(props);
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
