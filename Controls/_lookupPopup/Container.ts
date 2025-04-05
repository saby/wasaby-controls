/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Control } from 'UI/Base';
import template = require('wml!Controls/_lookupPopup/Container');
import chain = require('Types/chain');
import { CrudWrapper } from 'Controls/dataSource';
import { QueryWhereExpression } from 'Types/source';
import { List, RecordSet } from 'Types/collection';
import { ISelectionObject, TKey } from 'Controls/interface';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { process } from 'Controls/error';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';
import LookupUtils from 'Controls/lookupUtils';

const SELECTION_TYPES = ['all', 'leaf', 'node'];

const _private = {
    getDataOptions(options) {
        return options.storeId
            ? options._dataOptionsValue[options.storeId]
            : options._dataOptionsValue?._dataSyntheticStoreId ||
                  options.dataContextCompatibleValue ||
                  options._dataOptionsValue;
    },

    getStoreId(options): string {
        return options.storeId || options.dataContextCompatibleValue?.listStoreId;
    },

    getListOptions(options) {
        return _private.getStoreId(options) ? _private.getDataOptions(options) : options;
    },
    getFilteredItems(items, filterFunc) {
        return chain.factory(items).filter(filterFunc).value();
    },

    getFilterFunction(func) {
        return func ? func : () => true;
    },

    getSelectedKeys(options): TKey[] {
        let selectedKeys;

        if (_private.getListOptions(options).selectedKeys) {
            selectedKeys = [..._private.getListOptions(options).selectedKeys];
        } else if (options.selectedItems && options.selectedItems.getCount()) {
            const selectedItems = _private.getSelectedItems(options);
            const items = _private.getFilteredItems(
                selectedItems,
                _private.getFilterFunction(options.selectionFilter)
            );
            selectedKeys = getKeysByItems(items, _private.getDataOptions(options).keyProperty);
        } else {
            selectedKeys = [];
        }
        return selectedKeys;
    },

    // TODO: вообще не уверен что это нужно, но я побоялся трогать
    getSelectedItems(options): List | RecordSet {
        return options.selectedItems || new List();
    },

    getCrudWrapper(source) {
        return new CrudWrapper({
            source,
        });
    },

    getValidSelectionType(selectionType) {
        let type;

        if (SELECTION_TYPES.indexOf(selectionType) !== -1) {
            type = selectionType;
        } else {
            type = 'all';
        }

        return type;
    },

    prepareResult(result, initialSelection, keyProperty, selectCompleteInitiator) {
        return {
            resultSelection: result,
            initialSelection,
            keyProperty,
            selectCompleteInitiator,
        };
    },

    getInitialSelectedItems(self, options): List | RecordSet {
        const selectedItems = _private.getSelectedItems(options).clone();
        const itemsToRemove = [];
        const keyProp = _private.getDataOptions(options).keyProperty;

        selectedItems.each((item) => {
            if (!self._selectedKeys.includes(item.get(keyProp))) {
                itemsToRemove.push(item);
            }
        });

        itemsToRemove.forEach((item) => {
            selectedItems.remove(item);
        });

        return selectedItems;
    },

    needLoadItemsOnSelectComplete(self): boolean {
        const hasSelectedItems = self._selectedKeys.length || self._excludedKeys.length;
        let result;

        if (self._options.multiSelect) {
            result = hasSelectedItems;
        } else {
            result = hasSelectedItems && self._selectCompleteInitiator;
        }

        return result;
    },

    loadSelectedItems(self: object, filter: QueryWhereExpression<unknown>): Promise<RecordSet> {
        const { items, sorting, source, nodeProperty, parentProperty } = _private.getDataOptions(
            self._options
        );
        let loadItemsPromise;

        if (_private.needLoadItemsOnSelectComplete(self)) {
            if (!self._options.multiSelect) {
                const selectedItems = LookupUtils.getEmptyItems(items);

                selectedItems.add(items.getRecordById(self._selectedKeys[0]));
                loadItemsPromise = Promise.resolve(selectedItems);
            } else {
                _private.showIndicator(self);
                loadItemsPromise = _private
                    .getCrudWrapper(source)
                    .query({
                        filter,
                        sorting,
                        select: _private.getListOptions(self._options).selectFields,
                    })
                    .then((rs) => {
                        const selectedKeysLength = self._selectedKeys?.length;
                        const isNodeSelected =
                            selectedKeysLength === 1 &&
                            LookupUtils.hasSelectedNodes(items, self._selectedKeys, nodeProperty);
                        if (source['[Types/_source/SbisService]']) {
                            const methodName = `${source.getEndpoint().contract}.${
                                source.getBinding().query
                            }`;
                            if (
                                !rs.getCount() &&
                                items.getCount() &&
                                (!isNodeSelected || self._options.selectionType !== 'leaf')
                            ) {
                                Logger.error(`Метод БЛ ${methodName} не вернул записей для окна выбора. 
                            Метод БЛ должен поддерживать параметр фильтрации selection.
                            Подробнее тут: https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/logic/list/list-iterator/`);
                            }
                            if (
                                !parentProperty &&
                                selectedKeysLength &&
                                self._selectedKeys[0] !== null &&
                                selectedKeysLength !== rs.getCount()
                            ) {
                                Logger.error(`Метод БЛ ${methodName} вернул неправильное кол-во записей для окна выбора. 
                                Должен вернуться RecordSet записей с ключами ${JSON.stringify(
                                    self._selectedKeys
                                )}`);
                            }
                        }
                        return rs;
                    })
                    .catch((error) => {
                        process({ error });
                        return Promise.reject(error);
                    })
                    .finally(() => {
                        _private.hideIndicator(self);
                    });
            }
        } else {
            loadItemsPromise = Promise.resolve(LookupUtils.getEmptyItems(items));
        }

        return loadItemsPromise;
    },

    showIndicator(self): void {
        self._loadingIndicatorId = self._notify('showIndicator', [], {
            bubbling: true,
        });
    },

    hideIndicator(self): void {
        if (self._loadingIndicatorId) {
            self._notify('hideIndicator', [self._loadingIndicatorId], {
                bubbling: true,
            });
            self._loadingIndicatorId = null;
        }
    },
};

export function getKeysByItems(
    items: RecordSet | List<Model> | Model[],
    keyProperty?: string
): TKey[] {
    return factory(items).reduce<TKey[]>((result, item): TKey[] => {
        result?.push(keyProperty ? (item.get(keyProperty) as TKey) : item.getKey());
        return result || [];
    }, []);
}

/**
 * Контейнер принимает опцию selectedItems от {@link Controls/lookupPopup:Controller} и устанавливает опцию selectedKeys для дочернего списка.
 * Загружает список записей по списку первичных ключей из опции selectedKeys при завершении выбора
 * Должен использоваться внутри Controls/lookupPopup:Controller.
 * В одном Controls/lookupPopup:Controller можно использовать несколько контейнеров.
 *
 * Подробное описание и инструкцию по настройке смотрите в <a href='/doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/'>статье</a>.
 *
 * <a href="/materials/DemoStand/app/Engine-demo%2FSelector">Пример</a> использования контрола.
 *
 * @class Controls/_lookupPopup/Container
 * @extends UI/Base:Control
 *
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISelectionType
 * @public
 */

/*
 * Container transfers selected items fromControls/lookupPopup:Controller to a specific list.
 * Loading data by selectedKeys on selection complete.
 * Must used inside Controls/lookupPopup:Controller.
 * In one Controls/lookupPopup:Controller can be used some Containers.
 *
 * More information you can read
 * <a href='/doc/platform/developmentapl/interface-development/controls/layout-selector-stack/'>here</a>.
 *
 * <a href="/materials/DemoStand/app/Engine-demo%2FSelector">Here</a> you can see a demo.
 *
 * @class Controls/_lookupPopup/Container
 * @extends UI/Base:Control
 *
 * @implements Controls/interface:ISource
 * @public
 * @author Герасимов Александр Максимович
 */
const Container = Control.extend({
    _template: template,
    _selectedKeys: null,
    _selection: null,
    _excludedKeys: null,
    _selectCompleteInitiator: false,
    _loadingIndicatorId: null,

    _beforeMount(options): void {
        this._selectedKeys = _private.getSelectedKeys(options);
        this._excludedKeys = _private.getListOptions(options).excludedKeys;
        this._initialSelection = _private.getInitialSelectedItems(this, options);
    },

    _afterMount(): void {
        RegisterUtil(this, 'selectComplete', this._selectComplete.bind(this));
    },

    _beforeUpdate(newOptions): void {
        const currentSelectedItems = this._options.selectedItems;
        const newSelectedItems = newOptions.selectedItems;
        const storeId = _private.getStoreId(newOptions);

        if (
            currentSelectedItems !== newSelectedItems ||
            newOptions.storeId ||
            !isEqual(
                _private.getListOptions(this._options).selectedKeys,
                _private.getListOptions(newOptions).selectedKeys
            )
        ) {
            const selectedKeys = _private.getSelectedKeys(newOptions);

            if (!isEqual(selectedKeys, this._selectedKeys) && storeId) {
                this._selectedKeysChanged(null, selectedKeys);
            } else {
                this._selectedKeys = selectedKeys;
            }
        }

        if (
            storeId ||
            !isEqual(
                _private.getListOptions(this._options).excludedKeys,
                _private.getListOptions(newOptions).excludedKeys
            )
        ) {
            const excludedKeys = _private.getListOptions(newOptions).excludedKeys;

            if (!isEqual(excludedKeys, this._excludedKeys) && storeId) {
                this._excludedKeysChanged(null, excludedKeys);
            } else {
                this._excludedKeys = excludedKeys;
            }
        }
    },

    _beforeUnmount(): void {
        UnregisterUtil(this, 'selectComplete');
        _private.hideIndicator(this);
    },

    _selectComplete(): void {
        const options = this._options;
        const dataOptions = _private.getDataOptions(options);
        const items = dataOptions.items;
        const keyProperty = _private.getDataOptions(options).keyProperty;
        const root = _private.getListOptions(options).root;
        let loadPromise;

        const isRecursive = _private.getListOptions(options).recursiveSelection;
        let selectionObject: ISelectionObject = {
            selected: this._selectedKeys,
            excluded: this._excludedKeys,
        };
        const isRootSelected =
            this._selectedKeys.includes(root) && this._excludedKeys.includes(root);
        const isSearch = !!dataOptions.filter[_private.getListOptions(options).searchParam];

        if (!isRecursive && !(isSearch && isRootSelected)) {
            selectionObject = LookupUtils.prepareNotRecursiveSelection(
                selectionObject,
                items,
                keyProperty,
                _private.getListOptions(options).parentProperty,
                _private.getListOptions(options).nodeProperty,
                root
            );
        }
        const adapter = LookupUtils.getSourceAdapter(dataOptions.source);
        const selection = LookupUtils.getSelection(
            selectionObject,
            adapter,
            options.selectionType,
            isRecursive
        );
        const filter = LookupUtils.prepareFilter({
            filter: dataOptions.filter,
            selection,
            searchParam: _private.getListOptions(options).searchParam,
            parentProperty: _private.getListOptions(options).parentProperty,
            nodeProperty: _private.getListOptions(options).nodeProperty,
            selectionType: options.selectionType,
            root,
            items,
        });

        // FIXME https://online.sbis.ru/opendoc.html?guid=7ff270b7-c815-4633-aac5-92d14032db6f
        // необходимо уйти от опции selectionLoadMode и вынести загрузку
        // выбранный записей в отдельный слой.
        // здесь будет только формирование фильтра
        if (this._options.selectionLoadMode) {
            loadPromise = _private.loadSelectedItems(this, filter).then((loadedItems) => {
                return _private.prepareResult(
                    loadedItems,
                    this._initialSelection,
                    keyProperty,
                    this._selectCompleteInitiator
                );
            });
        } else {
            loadPromise = Promise.resolve(filter);
        }

        this._notify('selectionLoad', [loadPromise], { bubbling: true });
        return loadPromise;
    },

    _selectedKeysChanged(event, selectedKeys, added, removed, listId, isSelectComplete) {
        this._selectedKeys = selectedKeys;

        if (!isSelectComplete) {
            this._notify('selectedKeysChanged', [selectedKeys, added, removed], {
                bubbling: true,
            });
        }
    },

    _excludedKeysChanged(event, excludedKey, added, removed) {
        this._excludedKeys = excludedKey;
        this._notify('excludedKeysChanged', [excludedKey, added, removed], {
            bubbling: true,
        });
    },

    _selectCompleteHandler() {
        this._selectCompleteInitiator = true;
    },
});

Container.getDefaultOptions = function getDefaultOptions() {
    return {
        recursiveSelection: true,
        selectionLoadMode: true,
        excludedKeys: [],
    };
};

Container._private = _private;
/**
 * @name Controls/_lookupPopup/Container#selectionFilter
 * @cfg {Function} Функция обратного вызова, с помощью которой происходит фильтрация выбранных записей для конкретного списка.
 * Функция должна вернуть true если запись относится к данному списку или false, если не относится.
 * @remark По умолчанию опция selectionFilter установлена как функция, которая всегда возвращает true.
 * @example
 *
 * WML:
 * <pre>
 *    <Controls.lookupPopup:Container selectionFilter="{{_selectionFilter}}">
 *        ...
 *    </Controls.lookupPopup:Container>
 * </pre>
 *
 * JS:
 * <pre>
 *     _selectionFilter: function(item, index) {
 *        let filterResult = false;
 *
 *        if (item.get('Компания')) {
 *            filterResult = true;
 *        }
 *
 *        return filterResult;
 *     }
 * </pre>
 */

/*
 * @name Controls/_lookupPopup/Container#selectionFilter
 * @cfg {Function} Function that filters selectedItems from Controls/lookupPopup:Controller for a specific list.
 * @remark By default selectionFilter option is setted as function that always returns true.
 * @example
 *
 * WML:
 * <pre>
 *    <Controls.lookupPopup:Container selectionFilter="{{_selectionFilter}}">
 *        ...
 *    </Controls.lookupPopup:Container>
 * </pre>
 *
 * JS:
 * <pre>
 *     _selectionFilter: function(item, index) {
 *        let filterResult = false;
 *
 *        if (item.get('Компания')) {
 *            filterResult = true;
 *        }
 *
 *        return filterResult;
 *     }
 * </pre>
 */

/**
 * @name Controls/_lookupPopup/Container#selectionType
 * @cfg {String} Тип записей, которые можно выбрать.
 * @variant node только узлы доступны для выбора
 * @variant leaf только листья доступны для выбора
 * @variant all все типы записей доступны для выбора
 * @example
 * В данном примере для выбора доступны только листья.
 * <pre>
 *    <Controls.lookupPopup:ListContainer selectionType="leaf">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */

/*
 * @name Controls/_lookupPopup/Container#selectionType
 * @cfg {String} Type of records that can be selected.
 * @variant node only nodes are available for selection
 * @variant leaf only leafs are available for selection
 * @variant all all types of records are available for selection
 * @example
 * In this example only leafs are available for selection.
 * <pre>
 *    <Controls.lookupPopup:ListContainer selectionType="leaf">
 *        ...
 *    </Controls.lookupPopup:ListContainer>
 * </pre>
 */
export default Container;
