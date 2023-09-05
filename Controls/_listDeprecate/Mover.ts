/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { BaseAction } from 'Controls/list';
import cInstance = require('Core/core-instance');
import { getItemsBySelection } from 'Controls/baseList';
import { Logger } from 'UI/Utils';

import {
    Move as MoveAction,
    MoveWithDialog as MoveWithDialogAction,
    IMoveActionOptions,
} from 'Controls/listCommands';
import { Move as MoveViewAction } from 'Controls/viewCommands';
import { Model } from 'Types/entity';
import { LOCAL_MOVE_POSITION, DataSet } from 'Types/source';

// @TODO Если убрать отсюда шаблон, то operationPanel перестаёт получать события
//   selectedTypeChanged даже от MultiSelect
//  https://online.sbis.ru/doc/0445b971-8675-42ef-b2bc-e68d7f82e0ac
import * as Template from 'wml!Controls/_listDeprecate/Mover/Mover';
import { getSiblingItem, MOVE_DIRECTION } from './Helpers';
import { ISelectionObject } from 'Controls/interface';
import { IMoverDialogTemplateOptions } from 'Controls/moverDialog';
import { BEFORE_ITEMS_MOVE_RESULT, IMoveItemsParams } from './interface/IMoverAndRemover';

const DEFAULT_SORTING_ORDER = 'asc';

const _private = {
    moveItems(self, items, target, position) {
        const afterItemsMove = (result) => {
            _private.afterItemsMove(self, items, target, position, result);
            return result;
        };
        return _private
            .beforeItemsMove(self, items, target, position)
            .then((beforeItemsMoveResult) => {
                if (beforeItemsMoveResult === BEFORE_ITEMS_MOVE_RESULT.MOVE_IN_ITEMS) {
                    return _private.moveInItems(self, items, target, position);
                } else if (beforeItemsMoveResult !== BEFORE_ITEMS_MOVE_RESULT.CUSTOM) {
                    return _private
                        .moveInSource(self, items, target, position)
                        .then((moveResult) => {
                            return _private.moveInItems(self, items, target, position).then(() => {
                                return moveResult;
                            });
                        });
                }
            })
            .then((result) => {
                return afterItemsMove(result);
            })
            .catch((error) => {
                return afterItemsMove(error);
            });
    },

    beforeItemsMove(self, items, target, position) {
        const beforeItemsMoveResult = self._notify('beforeItemsMove', [items, target, position]);
        return beforeItemsMoveResult instanceof Promise
            ? beforeItemsMoveResult
            : Promise.resolve(beforeItemsMoveResult);
    },

    afterItemsMove(self, items, target, position, result) {
        self._notify('afterItemsMove', [items, target, position, result]);

        // According to the standard, after moving the items, you need to unselect all in the table view.
        // The table view and Mover are in a common container (Control.Container.MultiSelector)
        // and do not know about each other.
        // The only way to affect the selection in the table view is to send the selectedTypeChanged event.
        // You need a schema in which Mover will not work directly with the selection.
        // Will be fixed by: https://online.sbis.ru/opendoc.html?guid=dd5558b9-b72a-4726-be1e-823e943ca173
        self._notify('selectedTypeChanged', ['unselectAll'], {
            bubbling: true,
        });
    },

    moveInItems(self, items, target, position) {
        const selection = _private.prepareSelection(items);
        const targetKey = target?.getKey ? target.getKey() : target;
        return new MoveViewAction({
            items: selection.selected,
            target: targetKey,
            position,
            parentProperty: self._options.parentProperty,
            nodeProperty: self._options.nodeProperty,
            collection: self._items,
            keyProperty: self._keyProperty,
            root: self._options.root !== undefined ? self._options.root : null,
        }).execute();
    },

    moveInSource(self, items, target, position) {
        const selection = _private.prepareSelection(items);
        return new MoveAction({
            source: self._source,
            parentProperty: self._options.parentProperty,
        }).execute({
            selection,
            filter: _private.prepareFilter(self, self._filter, selection),
            targetKey: _private.getIdByItem(self, target),
            position,
            useDefaultMoveMethod: self._useDefaultMoveMethod,
        });
    },

    moveItemToSiblingPosition(self, item, position) {
        const direction =
            position === LOCAL_MOVE_POSITION.Before ? MOVE_DIRECTION.UP : MOVE_DIRECTION.DOWN;
        const selectedItem = item.getKey ? item : self._items.getRecordById(item);
        const target = getSiblingItem(
            direction,
            selectedItem,
            self._items,
            self._options.parentProperty,
            self._options.nodeProperty
        );
        return target ? self.moveItems([item], target, position) : Promise.resolve();
    },

    updateDataOptions(self, newOptions, contextDataOptions) {
        self._items = newOptions.items || contextDataOptions?.items;

        const controllerOptions: Partial<IMoveActionOptions> = {
            parentProperty: newOptions.parentProperty,
        };
        if (contextDataOptions) {
            controllerOptions.source = newOptions.source || contextDataOptions.source;
            self._keyProperty = newOptions.keyProperty || contextDataOptions.keyProperty;
            self._filter = contextDataOptions.filter;
        } else {
            controllerOptions.source = newOptions.source;
            self._keyProperty = newOptions.keyProperty;
            self._filter = newOptions.filter;
        }
        self._source = controllerOptions.source;
    },

    getIdByItem(self, item) {
        return cInstance.instanceOfModule(item, 'Types/entity:Model')
            ? item.get(self._keyProperty)
            : item;
    },

    getItemsBySelection(self, selection): Promise<any> {
        let resultSelection;
        // Support moving with mass selection.
        // Full transition to selection will be made by:
        // https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
        selection.recursive = false;
        if (selection instanceof Array) {
            resultSelection = Promise.resolve(selection);
        } else {
            // getItemsBySelection работает только с ISelectionObject
            const selectionObject = _private.prepareSelection(selection);
            const filter = _private.prepareFilter(self, self._filter, selection);
            resultSelection = getItemsBySelection(
                selectionObject,
                self._source,
                self._items,
                filter
            );
        }

        return resultSelection;
    },

    prepareFilter(self, filter, selection): object {
        const searchParam = self._options.searchParam;
        const root = self._options.root;
        let resultFilter = filter;

        if (searchParam && !selection.selected.includes(root)) {
            resultFilter = { ...filter };
            delete resultFilter[searchParam];
        }

        return resultFilter;
    },

    moveWithDialog(self, selection: ISelectionObject, filter): Promise<DataSet | void> {
        return new Promise((resolve, reject) => {
            new MoveWithDialogAction({
                source: self._source,
                parentProperty: self._options.parentProperty,
                popupOptions: {
                    opener: self,
                    template: self._moveDialogTemplate,
                    templateOptions: {
                        movedItems: selection.selected,
                        source: self._source,
                        keyProperty: self._keyProperty, // keyProperty может быть заменён в moveDialogOptions
                        ...(self._moveDialogOptions as IMoverDialogTemplateOptions),
                    },
                    beforeMoveCallback: (resultSelection: ISelectionObject, target: Model) => {
                        _private
                            .moveItems(self, selection.selected, target, LOCAL_MOVE_POSITION.On)
                            .then((result) => {
                                return resolve(result);
                            })
                            .catch((error) => {
                                return reject(error);
                            });
                        return false;
                    },
                },
            })
                .execute({
                    selection,
                    filter,
                    useDefaultMoveMethod: self._useDefaultMoveMethod,
                })
                .catch(() => {});
        });
    },

    prepareSelection(selection): ISelectionObject {
        let selectionObject: ISelectionObject;
        if (selection.selected) {
            selectionObject = selection;
        } else if (selection.selectedKeys) {
            selectionObject = {
                selected: selection.selectedKeys,
                excluded: selection.excludedKeys,
            };
        } else if (selection.forEach) {
            selectionObject = {
                selected: selection,
                excluded: [],
            };
        }
        // первый элемент в selected может быть Null
        if (selectionObject.selected[0]?.getKey) {
            selectionObject.selected = selectionObject.selected.map((item) => {
                return item.getKey();
            });
        }
        return selectionObject;
    },
};

/**
 * Контрол для перемещения элементов списка в recordSet и dataSource.
 *
 * @remark
 * Контрол должен располагаться в одном контейнере {@link Controls/list:DataContainer} со списком.
 * В случае использования {@link Controls/operations:Controller} для корректной обработки событий необходимо помещать Controls/listDeprecate:Mover внутри Controls/operations:Controller.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/mover/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @class Controls/_listDeprecate/Mover
 * @implements Controls/interface/IMovable
 * @implements Controls/interface:IHierarchy
 * @deprecated Класс устарел и буден удалён. Используйте методы интерфейса {@link Controls/list:IMovableList}, который по умолчанию подключен в списки.
 * @demo Controls-demo/treeGridNew/Mover/Base/Index
 * @public
 */
const Mover = BaseAction.extend({
    _action: null,
    _moveDialogTemplate: null,
    _moveDialogOptions: null,
    _template: Template,
    _useDefaultMoveMethod: false,
    _beforeMount(options) {
        _private.updateDataOptions(this, options, this._getContextValue(options));
        Logger.warn(
            'Controls/listDeprecate:Mover: Класс устарел и буден удалён.' +
                ' Используйте методы интерфейса Controls/list:IMovableList, ' +
                'который по умолчанию подключен в списки.',
            this
        );
    },

    _beforeUpdate(options) {
        _private.updateDataOptions(this, options, this._getContextValue(options));
    },

    _getContextValue(options) {
        return options.dataContextCompatibleValue || options._dataOptionsValue;
    },

    moveItemUp(item) {
        return _private.moveItemToSiblingPosition(this, item, LOCAL_MOVE_POSITION.Before);
    },

    moveItemDown(item) {
        return _private.moveItemToSiblingPosition(this, item, LOCAL_MOVE_POSITION.After);
    },

    moveItems(items: [] | IMoveItemsParams, target, position): Promise<any> {
        if (target === undefined) {
            return Promise.resolve();
        }
        this._useDefaultMoveMethod = !items.selected;
        return _private.getItemsBySelection(this, items).then((selectItems) => {
            return selectItems.length
                ? _private.moveItems(this, selectItems, target, position)
                : Promise.resolve();
        });
    },

    moveItemsWithDialog(items: [] | IMoveItemsParams): Promise<any> {
        if (!this._options.moveDialogTemplate?.templateName) {
            Logger.error(
                'Mover: Wrong type of moveDialogTemplate option,' +
                    'use object notation instead of template function',
                self
            );
        }
        this._useDefaultMoveMethod = !items.selected;
        this._moveDialogTemplate = this._options.moveDialogTemplate.templateName;
        this._moveDialogOptions = this._options.moveDialogTemplate.templateOptions;
        if (this.validate(items)) {
            return _private.getItemsBySelection(this, items).then((selectItems: []) => {
                const selection = _private.prepareSelection(selectItems);
                return _private.moveWithDialog(this, selection, this._filter);
            });
        }
        return Promise.resolve();
    },
});

Mover.getDefaultOptions = () => {
    return {
        sortingOrder: DEFAULT_SORTING_ORDER,
    };
};

Mover._private = _private;

export = Mover;
