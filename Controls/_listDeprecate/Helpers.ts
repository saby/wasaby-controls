/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey, LOCAL_MOVE_POSITION } from 'Types/source';
import { canMoveToDirection, getSiblingItem } from 'Controls/baseList';

enum MOVE_DIRECTION {
    UP = 'up',
    DOWN = 'down',
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
        return canMoveToDirection({
            direction:
                direction === MOVE_DIRECTION.UP
                    ? LOCAL_MOVE_POSITION.Before
                    : LOCAL_MOVE_POSITION.After,
            item,
            items,
            parentProperty,
            nodeProperty,
            root,
        });
    },

    getSiblingItem(
        direction: string,
        item: Model,
        items: RecordSet,
        parentProperty?: string,
        nodeProperty?: string,
        root?: CrudEntityKey
    ): Model {
        return getSiblingItem({
            direction:
                direction === MOVE_DIRECTION.UP
                    ? LOCAL_MOVE_POSITION.Before
                    : LOCAL_MOVE_POSITION.After,
            item,
            items,
            parentProperty,
            nodeProperty,
            root,
        });
    },
};

export = helpers;
