/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import rk = require('i18n!Controls');
import { Control } from 'UI/Base';
import template = require('wml!Controls/_lookupPopup/List/Container');
import { Record } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IItemAction } from 'Controls/itemActions';

type Key = string | number;
type SelectionChangedEventResult = [Key[], Key[], Key[]];

export enum showType {
    MENU,
    MENU_TOOLBAR,
    TOOLBAR,
}

const SELECT_ACTION_ID = 'selector.action';
const ACTION = {
    id: SELECT_ACTION_ID,
    icon: 'icon-RoundPlus',
    showType: showType.TOOLBAR,
    viewMode: 'filled',
};

const _private = {
    getItemActivateResult(
        itemKey: Key,
        keys: Key[],
        multiSelect: boolean
    ): SelectionChangedEventResult {
        const added = [];
        const removed = [];
        const itemIndex = keys.indexOf(itemKey);
        keys = keys.slice();

        if (itemIndex === -1) {
            if (!multiSelect && keys.length) {
                removed.push(keys[0]);
                keys.splice(0, 1);
            }

            keys.push(itemKey);
            added.push(itemKey);
        } else if (multiSelect) {
            keys.splice(itemIndex, 1);
            removed.push(itemKey);
        }

        return [keys, added, removed];
    },

    isSelectedAll(self): boolean {
        return self._options.root !== undefined
            ? self._options.selectedKeys.includes(self._options.root)
            : self._options.selectedKeys.includes(null);
    },

    selectItem(self, item: Record): void {
        const itemKey = item.get(self._options.keyProperty);
        const eventResult = [
            [itemKey],
            [itemKey],
            [],
        ] as SelectionChangedEventResult;
        _private.notifySelectedKeysChanged(self, eventResult);
        self._notify('selectComplete', [self._options.multiSelect, true], {
            bubbling: true,
        });
    },

    selectionChanged(self, item: Record): void {
        const itemKey = item.get(self._options.keyProperty);
        const isSelectedAll = _private.isSelectedAll(self);
        let eventName;
        let keys;

        if (isSelectedAll) {
            eventName = 'notifyExcludedKeysChanged';
            keys = self._options.excludedKeys;
        } else {
            eventName = 'notifySelectedKeysChanged';
            keys = self._options.selectedKeys;
        }

        _private[eventName](
            self,
            _private.getItemActivateResult(
                itemKey,
                keys,
                self._options.multiSelect
            )
        );
    },

    notifySelectedKeysChanged(self, result: SelectionChangedEventResult): void {
        self._notify('listSelectedKeysChanged', result, { bubbling: true });
    },

    notifyExcludedKeysChanged(self, result: SelectionChangedEventResult): void {
        self._notify('listExcludedKeysChanged', result, { bubbling: true });
    },

    getItemActions(self, options) {
        let itemActions = options.itemActions || [];

        if (options.selectionType !== 'leaf') {
            const selectAction = {
                ...ACTION,
                handler: (item) => {
                    return _private.selectItem(self, item);
                },
            };
            itemActions = itemActions.concat(selectAction);
        }

        return itemActions;
    },

    getItemActionVisibilityCallback(options) {
        return (action, item, isEditing) => {
            let showByOptions;
            let showByItemType;

            if (action.id === SELECT_ACTION_ID) {
                showByOptions =
                    !options.multiSelect || !options.selectedKeys.length;
                showByItemType =
                    options.selectionType === 'node'
                        ? true
                        : item.get(options.nodeProperty);
                return showByOptions && showByItemType;
            } else {
                return options.itemActionVisibilityCallback
                    ? options.itemActionVisibilityCallback(
                          action,
                          item,
                          isEditing
                      )
                    : true;
            }
        };
    },

    itemActivate(self, item: Record): void {
        const isMultiSelect = self._options.multiSelect;
        const selectedKeys = self._options.selectedKeys;

        if (!isMultiSelect || !selectedKeys.length) {
            _private.selectItem(self, item);
        } else {
            _private.selectionChanged(self, item);
        }
    },

    getMarkedKeyBySelectedKeys(
        selectedKeys: number[] | string[]
    ): null | string | number {
        let result = null;

        if (selectedKeys.length === 1) {
            result = selectedKeys[0];
        }

        return result;
    },

    getSelectedKeysFromOptions(options): number[] | string[] {
        return options.multiSelect ? options.selectedKeys : [];
    },
};
/**
 *
 * Контейнер для списков, который отслеживает нажатия на его элементы и уведомляет с помощью события «selectComplete», когда выбор завершен.
 * Также добавляет действие «Выбрать» в иерархические списки.
 * Используется внутри {@link Controls/lookupPopup:Controller} и {@link Controls/lookupPopup:Container}.
 *
 * Подробное описание и инструкцию по настройке смотрите в <a href='/doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/'>статье</a>.
 *
 * <a href="/materials/DemoStand/app/Engine-demo%2FSelector">Пример</a> использования контрола.
 *
 * @class Controls/_lookupPopup/List/Container
 * @extends UI/Base:Control
 * @implements Controls/interface:IMultiSelectable
 *
 * @public
 */

/*
 *
 * Container for list controls, that tracks click on list items and notifying "selectComplete" event, when selection is completed.
 * Also adding "select" item action to a hierarchical lists.
 * Used inside Controls/lookupPopup:Controller and Controls/lookupPopup:Container.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/layout-selector-stack/'>here</a>.
 *
 * <a href="/materials/DemoStand/app/Engine-demo%2FSelector">Here</a> you can see a demo.
 *
 * @class Controls/_lookupPopup/List/Container
 * @extends UI/Base:Control
 * @implements Controls/interface:IMultiSelectable
 *
 * @public
 * @author Герасимов Александр Максимович
 */
const Container = Control.extend({
    _template: template,
    _selectedKeys: null,
    _markedKey: null,
    _itemsActions: null,

    constructor(options, context) {
        Container.superclass.constructor.call(this, options, context);
    },

    _beforeMount(options): void {
        this._selectedKeys = _private.getSelectedKeysFromOptions(options);
        this._markedKey = _private.getMarkedKeyBySelectedKeys(
            options.selectedKeys
        );
        this._itemActions = _private.getItemActions(this, options);
        this._itemActionVisibilityCallback =
            _private.getItemActionVisibilityCallback(options);
    },

    _beforeUpdate(newOptions) {
        const selectionTypeChanged =
            newOptions.selectionType !== this._options.selectionType;
        const selectedKeysChanged =
            newOptions.selectedKeys !== this._options.selectedKeys;

        if (selectedKeysChanged) {
            this._selectedKeys = newOptions.selectedKeys;
        }

        if (selectedKeysChanged || selectionTypeChanged) {
            this._itemActionVisibilityCallback =
                _private.getItemActionVisibilityCallback(newOptions);
        }

        if (
            newOptions.itemActions !== this._options.itemActions ||
            selectionTypeChanged
        ) {
            this._itemActions = _private.getItemActions(this, newOptions);
        }
    },

    _beforeUnmount() {
        this._itemActions = null;
        this._visibilityCallback = null;
        this._itemActionsClick = null;
        this._selectedKeys = null;
    },

    _itemActivate(event: SyntheticEvent, item: Record): void {
        const nodeValue = item.get(this._options.nodeProperty);
        const isLeaf = nodeValue === null;
        const isHiddenNode = nodeValue === false;
        const isNode = nodeValue === true;
        const selectionType = this._options.selectionType || 'all';
        const onlyLeaf = this._options.onlyLeaf;

        const canSelect =
            selectionType === 'all' ||
            selectionType === 'allBySelectAction' ||
            (selectionType === 'node' && (isNode || isHiddenNode)) ||
            (selectionType === 'leaf' && !onlyLeaf && !isNode) ||
            (selectionType === 'leaf' && onlyLeaf && isLeaf);
        if (canSelect) {
            _private.itemActivate(this, item);
        }
    },
});

Container._private = _private;

Container.getDefaultOptions = function getDefaultOptions() {
    return {
        selectionType: 'all',
    };
};

/**
 * @typedef {Object} ItemAction
 * @property {String} id Идентификатор операции над записью.
 * @property {String} title Название операции операции над записью.
 * @property {String} icon Иконка операции операции над записью.
 * @property {Number} showType Расположение операции операции над записью.
 * @property {String} style Стиль операции операции над записью.
 * @property {String} iconStyle Стиль иконки операции операции над записью. (secondary | warning | danger | success).
 * @property {Function} handler Обработчик события клика по операции операции над записью.
 * @property {String} parent Ключ родителя операции операции над записью.
 * @property {Boolean|Null} parent@ Поле, определяющее иерархический тип операции над записью (list, node, hidden node).
 */

/*
 * @typedef {Object} ItemAction
 * @property {String} id Identifier of operation.
 * @property {String} title Operation name.
 * @property {String} icon Operation icon.
 * @property {Number} showType Location of operation.
 * @property {String} style Operation style.
 * @property {String} iconStyle Style of the action's icon. (secondary | warning | danger | success).
 * @property {Function} handler Operation handler.
 * @property {String} parent Key of the action's parent.
 * @property {boolean|null} parent@ Field that describes the type of the node (list, node, hidden node).
 */

/**
 * @name Controls/_lookupPopup/List/Container#itemActions
 * @cfg {Array.<Controls/itemActions:IItemAction>} Массив конфигурационных объектов для кнопок, которые будут отображаться, когда пользователь наводит курсор на элемент.
 * <a href="/materials/DemoStand/app/Controls-demo%2FList%2FList%2FItemActionsPG">Пример</a>.
 */

/*
 * @name Controls/_lookupPopup/List/Container#itemActions
 * @cfg {Array.<Controls/itemActions:IItemAction>} Array of configuration objects for buttons which will be shown when the user hovers over an item.
 * <a href="/materials/DemoStand/app/Controls-demo%2FList%2FList%2FItemActionsPG">Example</a>.
 */

/**
 * @name Controls/_lookupPopup/List/Container#itemActionVisibilityCallback
 * @cfg {Controls/itemActions/TItemActionVisibilityCallback.typedef} Функция управления видимостью операций над записью.
 * @remark Если из функции возвращается true, то операция отображается.
 * @example
 *
 * TS:
 * <pre>
 *     function _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
 *         return action.id !== 'delete' || item.get('isDeletable');
 *     }
 * </pre>
 */

/*
 * @name Controls/_lookupPopup/List/Container#itemActionVisibilityCallback
 * @cfg {function} item operation visibility filter function
 * @param {Controls/itemActions:IItemAction} action Object with configuration of an action.
 * @param {Types/entity:Model} item Instance of the item whose action is being processed.
 * @returns {Boolean} Determines whether the action should be rendered.
 * @example
 *
 * JS:
 * <pre>
 *     _actionVisibilityCallback: function(action, item) {
 *         let actionVisibility = true;
 *
 *         if (action.id === 'delete' && !item.get('isDeletable')) {
 *             actionVisibility = false;
 *         }
 *
 *         return actionVisibility;
 *     }
 * </pre>
 */

/**
 * @name Controls/_lookupPopup/List/Container#selectionType
 * @cfg {String} Тип записей, которые можно выбрать.
 * @variant node только узлы доступны для выбора
 * @variant leaf only только листья доступны для выбора
 * @variant all все типы записей доступны для выбора
 * @variant allBySelectAction все типы записей доступны для выбора. Действие «Выбрать» будет отображаться для всех типов записей.
 * @example
 * В этом примере для выбора доступны только листья.
 * <pre>
 *    <Controls.lookupPopup:ListContainer selectionType="leaf">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */

/*
 * @name Controls/_lookupPopup/List/Container#selectionType
 * @cfg {String} Type of records that can be selected.
 * @variant node only nodes are available for selection
 * @variant leaf only leafs are available for selection
 * @variant all all types of records are available for selection
 * @variant allBySelectAction all types of records are available for selection. "Select" item action will showed on all types of records.
 * @example
 * In this example only leafs are available for selection.
 * <pre>
 *    <Controls.lookupPopup:ListContainer selectionType="leaf">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */

/**
 * @name Controls/_lookupPopup/List/Container#multiSelect
 * @cfg {Boolean} Определяет, установлен ли множественный выбор.
 * @example
 * <pre>
 *    <Controls.lookupPopup:ListContainer multiSelect="{{true}}">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */

/*
 * @name Controls/_lookupPopup/List/Container#multiSelect
 * @cfg {Boolean} Determines whether multiple selection is set.
 * @example
 * <pre>
 *    <Controls.lookupPopup:ListContainer multiSelect="{{true}}">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */

export = Container;
