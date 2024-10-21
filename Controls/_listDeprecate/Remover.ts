/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { BaseAction } from 'Controls/list';
import { Remove as RemoveAction, getItemsBySelection } from 'Controls/listCommands';
import { AtomicRemove } from 'Controls/viewCommands';
import { Logger } from 'UI/Utils';
import { ISelectionObject } from 'Controls/_interface/ISelectionType';
import { RecordSet } from 'Types/collection';
import { SbisService } from 'Types/source';
import { process } from 'Controls/error';
import * as Template from 'wml!Controls/_listDeprecate/Render/Template';

interface IOptions {
    source: SbisService;
    filter?: object;
    items?: RecordSet;
}

const _private = {
    removeFromItems(self, keys) {
        return new AtomicRemove({
            filter: self.filter,
            selection: { selected: keys, excluded: [] },
            items: self._items,
            parentProperty: self._options.parentProperty,
            nodeProperty: self._options.nodeProperty,
            root: self._options.root,
        }).execute({});
    },

    beforeItemsRemove(self, keys) {
        const beforeItemsRemoveResult = self._notify('beforeItemsRemove', [keys]);
        return beforeItemsRemoveResult instanceof Promise
            ? beforeItemsRemoveResult
            : Promise.resolve(beforeItemsRemoveResult);
    },

    afterItemsRemove(self, keys, result) {
        const afterItemsRemoveResult = self._notify('afterItemsRemove', [keys, result]);

        // According to the standard, after moving the items, you need to unselect all in the table view.
        // The table view and Mover are in a common container (Control.Container.MultiSelector)
        // and do not know about each other.
        // The only way to affect the selection in the table view is to send the selectedTypeChanged event.
        // You need a schema in which Mover will not work directly with the selection.
        // Will be fixed by: https://online.sbis.ru/opendoc.html?guid=dd5558b9-b72a-4726-be1e-823e943ca173
        self._notify('selectedTypeChanged', ['unselectAll'], {
            bubbling: true,
        });

        return Promise.resolve(afterItemsRemoveResult);
    },

    updateDataOptions(self, newOptions?: IOptions): void {
        const dataOptions = self._getContextValue(newOptions);
        self._source = newOptions?.source ? newOptions.source : dataOptions?.source;
        self._filter = newOptions?.filter ? newOptions.filter : dataOptions?.filter;
        self._items = newOptions?.items ? newOptions.items : dataOptions?.items;
        if (!self._source) {
            Logger.warn("source не был задан ни в опциях Remover'а ни в контексте.", this);
        }
    },

    getItemsBySelection(self, keys): Promise<ISelectionObject> {
        // Выбранные ключи могут быть массивом или selection'ом
        // Полный переход к selection'у:
        // https://online.sbis.ru/opendoc.html?guid=080d3dd9-36ac-4210-8dfa-3f1ef33439aa
        return keys instanceof Array
            ? Promise.resolve(keys)
            : getItemsBySelection(
                  keys,
                  self._source,
                  self._items,
                  self._filter,
                  null,
                  self._options.selectionTypeForAllSelected
              );
    },
};

/**
 * Контрол для удаления элементов списка в recordSet и dataSource.
 * Контрол должен располагаться в том же контейнере (см. {@link Controls/listDataOld:DataContainer}), что и список.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FList%2FRemove демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/commands/new-remover/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @class Controls/_listDeprecate/Remover
 * @implements Controls/interface/IRemovable
 * @deprecated Класс устарел и будет удалён. Используйте методы интерфейса {@link Controls/list:IRemovableList}, который по умолчанию подключен в списки.
 *
 * @public
 */
const Remover = BaseAction.extend({
    _template: Template,

    _beforeMount(options) {
        _private.updateDataOptions(this, options);
        Logger.warn(
            'Controls/listDeprecate:Remover: Класс устарел и будет удалён.' +
                ' Используйте методы интерфейса Controls/list:IRemovableList, который ' +
                'по умолчанию подключен в списки.',
            this
        );
    },

    _getContextValue(options) {
        return options.dataContextCompatibleValue || options._dataOptionsValue;
    },

    _beforeUpdate(options) {
        _private.updateDataOptions(this, options);
    },

    removeItems(keys: string[]): Promise<void> {
        const both = (result) => {
            if (this._destroyed) {
                return Promise.reject();
            }
            return _private.afterItemsRemove(this, keys, result).then((eventResult) => {
                if (eventResult === false || !(result instanceof Error)) {
                    return;
                }

                if (!result?.processed) {
                    process({ error: result });
                }
            });
        };
        return _private.getItemsBySelection(this, keys).then((selection) => {
            return _private.beforeItemsRemove(this, selection).then((result) => {
                // если отменили удаление, то надо вернуть false
                if (result === false) {
                    return Promise.resolve(result);
                }
                return new RemoveAction({
                    source: this._source,
                    filter: this._filter,
                    selection:
                        selection instanceof Array
                            ? {
                                  selected: selection,
                                  excluded: [],
                              }
                            : selection,
                })
                    .execute()
                    .then((promiseResult) => {
                        if (this._destroyed) {
                            return Promise.reject();
                        }
                        _private.removeFromItems(this, selection);
                        return promiseResult;
                    })
                    .then((promiseResult) => {
                        return both(promiseResult);
                    })
                    .catch((promiseResult) => {
                        return both(promiseResult);
                    });
            });
        });
    },
});

export = Remover;
