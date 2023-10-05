/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { IStickyPopupOptions, StackOpener, StickyOpener } from 'Controls/popup';
import IDropdownController, {
    IDropdownControllerOptions,
} from 'Controls/_dropdown/interface/IDropdownController';
import {
    getSourceFilter,
    isHistorySource,
    getSource,
    getMetaHistory,
} from 'Controls/_dropdown/dropdownHistoryUtils';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { IDropdownReceivedState, filterBySelectionUtil } from 'Controls/_dropdown/BaseDropdown';
import loadMenuTemplates from 'Controls/_dropdown/Utils/loadMenuTemplates';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { process } from 'Controls/error';
import { IndicatorOpener } from 'Controls/LoadingIndicator';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { CancelablePromise, descriptor, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { PrefetchProxy, ICrudPlus, Memory } from 'Types/source';
import * as mStubs from 'Core/moduleStubs';
import * as cInstance from 'Core/core-instance';
import * as Merge from 'Core/core-merge';
import { TSelectedKeys } from 'Controls/interface';

/**
 * Контроллер для выпадающих списков.
 *
 * @class Controls/_dropdown/_Controller
 * @extends UI/Base:Control
 * @mixes Controls/_dropdown/interface/IDropdownController
 *
 * @private
 */

/*
 * Controller for dropdown lists
 *
 * @class Controls/_dropdown/_Controller
 * @extends UI/Base:Control
 * @mixes Controls/_dropdown/interface/IDropdownController
 * @author Герасимов А.М.
 *
 * @private
 */

const DEPEND_TEMPLATES = [
    'headTemplate',
    'headerTemplate',
    'headerContentTemplate',
    'itemTemplate',
    'groupTemplate',
    'footerContentTemplate',
];

export default class Controller implements IDropdownController {
    protected _items: RecordSet = null;
    protected _loadItemsTempPromise: Promise<any> = null;
    protected _options: IDropdownControllerOptions = null;
    protected _source: ICrudPlus = null;
    protected _preloadedItems: RecordSet = null;
    protected _selectedKeys: TSelectedKeys = null;
    protected _sourceController: SourceController = null;
    private _filter: object;
    private _selectedItems: RecordSet<Model>;
    private _sticky: StickyOpener;
    private _stackOpener: StackOpener;
    private _popupOptions: IStickyPopupOptions = {};
    private _isOpened: boolean = false;
    private _menuSource: Memory | PrefetchProxy = null;
    private _opening: boolean = false;
    private _loadMenuTempPromise: Promise<void> = null;
    private _loadDependsPromise: Promise<void> = null;
    private _updateHistoryPromise: Promise<void> = null;

    constructor(options: IDropdownControllerOptions) {
        this._options = options;
        this._selectedKeys = options.selectedKeys;
        this._sticky = new StickyOpener();
    }

    loadItems(): Promise<IDropdownReceivedState> {
        return this._loadItems(this._options).then((items) => {
            const beforeMountResult = {};

            if (isHistorySource(this._source)) {
                beforeMountResult.history = this._source.getHistory();
                beforeMountResult.items = this._source.getItems(false);
            } else {
                beforeMountResult.items = items;
            }
            return beforeMountResult;
        });
    }

    loadSelectedItems(): Promise<IDropdownReceivedState> {
        return this._loadSelectedItems(this._options).then((newItems) => {
            this._resolveLoadedItems(this._options, newItems);
            this._selectedItems = newItems;
            this._sourceController = null;
            this._setItemsAndMenuSource(null);
            return {
                items: newItems,
                history: null,
            };
        });
    }

    updateSelectedItems(items: RecordSet<Model>): void {
        if (items) {
            this._selectedItems = items;
            this._updateSelectedItems(this._options, items);
        }
    }

    setItems(items?: RecordSet): Promise<void> | void {
        this._items = items;
        this._resolveLoadedItems(this._options, items);
        if (this._options.sourceController) {
            this._sourceController = this._options.sourceController;
            const hasUnloadedItem = this._selectedKeys?.some((key) => {
                return (
                    !this._items.getRecordById(key) &&
                    (!this._options.emptyText || key !== this._options.emptyKey)
                );
            });
            if (hasUnloadedItem) {
                this.loadSelectedItems();
            }
        } else {
            return this._getSourceController(this._options)
                .then((sourceController) => {
                    this._setItemsAndMenuSource(items);
                    sourceController.setItems(this._items);
                })
                .catch((error) => {
                    return error;
                });
        }
    }

    setHistoryItems(history?: RecordSet): void {
        if (history) {
            this._source.setHistory(history);
            this._setItemsAndMenuSource(this._source.prepareItems(this._items));
        }
    }

    update(newOptions: IDropdownControllerOptions): Promise<RecordSet | void> | void {
        const oldOptions = { ...this._options };
        this._options = newOptions;

        if (
            !newOptions.source &&
            newOptions.selectedItems &&
            newOptions.selectedItems !== oldOptions.selectedItems
        ) {
            this.setSelectedItems(newOptions.selectedItems);
        } else if (
            !newOptions.source &&
            newOptions.items &&
            oldOptions.items !== newOptions.items
        ) {
            this.setItems(newOptions.items);
        }

        if (newOptions.readOnly && newOptions.readOnly !== oldOptions.readOnly) {
            this._closeDropdownList();
        }

        if (this._templateOptionsChanged(newOptions, oldOptions)) {
            this._loadMenuTempPromise = null;
            this._loadDependsPromise = null;
            if (this._isOpened) {
                this._open();
            }
        }
        if (newOptions.searchValue !== oldOptions.searchValue) {
            if (this._isOpened) {
                this._openPopup();
            }
        }
        const selectedKeysChanged =
            newOptions.selectedKeys && newOptions.selectedKeys !== this._selectedKeys;
        const sourceChanged = newOptions.source !== oldOptions.source;
        const sourceControllerChanged = newOptions.sourceController !== oldOptions.sourceController;
        const navigationChanged = !isEqual(newOptions.navigation, oldOptions.navigation);
        const filterChanged = !isEqual(newOptions.filter, oldOptions.filter);

        if (selectedKeysChanged) {
            this._selectedKeys = newOptions.selectedKeys;
        }

        let newKeys = [];
        if (selectedKeysChanged && (newOptions.navigation || oldOptions.selectedItems)) {
            newKeys = this._getUnloadedKeys(this._items || this._selectedItems, newOptions);
        }
        if (
            !(newOptions.sourceController && newOptions.sourceController.isLoading()) &&
            newOptions.source &&
            (sourceChanged ||
                (!this._sourceController && !this._selectedItems) ||
                sourceControllerChanged ||
                navigationChanged ||
                filterChanged)
        ) {
            if (this._sourceController && !this._sourceController.isLoading()) {
                this._source = null;
                this._sourceController = null;
            }

            if (sourceChanged) {
                this._resetLoadPromises();
                if (!this._opening) {
                    this._loadDependsPromise = null;
                }
            }

            if (newOptions.lazyItemsLoading && !this._isOpened && !newKeys.length) {
                /* source changed, items is not actual now */
                this._preloadedItems = null;
                this._setItemsAndMenuSource(null);
            } else if (
                this._items &&
                selectedKeysChanged &&
                newKeys.length &&
                !isHistorySource(newOptions.source)
            ) {
                return this._reloadSelectedItems(newOptions);
            } else {
                if (this._updateHistoryPromise) {
                    this._updateHistoryPromise.then(() => {
                        return this._reload(filterChanged);
                    });
                } else {
                    return this._reload(filterChanged);
                }
            }
        } else if (selectedKeysChanged) {
            const items = this._items || this._selectedItems;
            if (newKeys.length) {
                if (this._sourceController && !this._sourceController.isLoading()) {
                    this._source = null;
                    this._sourceController = null;
                }
                if (this._updateHistoryPromise) {
                    this._updateHistoryPromise.then(() => {
                        this._reloadSelectedItems(newOptions);
                    });
                } else {
                    this._reloadSelectedItems(newOptions);
                }
            } else if (
                items?.getCount() ||
                (newOptions.emptyText && newOptions.selectedKeys?.includes(newOptions.emptyKey))
            ) {
                this._updateSelectedItems(newOptions, items);
            }
        }
    }

    reload(): Promise<RecordSet> {
        return this._reload(true);
    }

    tryPreloadItems(): Promise<void> {
        let source = this._options.source;
        if (isHistorySource(source) && source.getOriginSource && source.getOriginSource()) {
            source = source.getOriginSource();
        }
        if (source instanceof PrefetchProxy) {
            source = source.getOriginal();
        }

        const sourceController = new SourceController({
            source,
            filter: this._options.filter,
            keyProperty: this._options.keyProperty,
            navigation: {
                source: 'page',
                view: 'pages',
                sourceConfig: {
                    pageSize: 1,
                    page: 0,
                    limit: 1,
                },
            },
        });
        return sourceController.load().then((items) => {
            if (
                items instanceof RecordSet &&
                items.getCount() === 1 &&
                !sourceController.hasMoreData('down')
            ) {
                this._preloadedItems = items;
            }
        });
    }

    loadDependencies(
        needLoadMenuTemplates: boolean = true,
        source?: ICrudPlus
    ): Promise<unknown[]> {
        if (this._loadDependsPromise) {
            return this._loadDependsPromise;
        }

        const deps = [];

        if (needLoadMenuTemplates) {
            deps.push(this._loadMenuTemplates(this._options));
        }

        if (!this._items) {
            deps.push(
                this._getLoadItemsPromise(source)
                    .then(() => {
                        return this._loadItemsTemplates(this._options);
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    })
            );
        } else if (needLoadMenuTemplates) {
            deps.push(this._loadItemsTemplates(this._options));
        }

        return (this._loadDependsPromise = Promise.allSettled(deps).then((results) => {
            this._loadDependsPromise = null;

            const errorResult = results.find((result) => {
                return result.reason;
            });
            if (errorResult) {
                return Promise.reject(errorResult.reason);
            }
        }));
    }

    setMenuPopupTarget(target: Element): void {
        this.target = target;
    }

    openSelectorDialog(items: object[]): void {
        const config = {
            closeOnOutsideClick: true,
            templateOptions: {
                selectedItems: items,
                handlers: {
                    onSelectComplete: (event, result) => {
                        this._selectorDialogResult(result);
                    },
                },
                ...this._options.selectorTemplate.templateOptions,
            },
            opener: this._popupOptions.opener || this._options.openerControl,
            template: this._options.selectorTemplate.templateName,
            isCompoundTemplate: this._options.isCompoundTemplate,
            eventHandlers: {
                onResult: (result, event) => {
                    this._selectorDialogResult(result);
                },
            },
            ...this._options.selectorTemplate.popupOptions,
        };
        if (!this._stackOpener) {
            this._stackOpener = new StackOpener();
        }
        this._stackOpener.open(config);
        this._closeDropdownList();
    }

    openMenu(popupOptions?: object): Promise<any> {
        if (this._options.reloadOnOpen) {
            this._setItemsAndMenuSource(null);
            this._loadDependsPromise = null;
            this._sourceController = null;
        }
        return this._open(popupOptions);
    }

    closeMenu(): void {
        this._closeDropdownList();
    }

    destroy(): void {
        if (this._sourceController) {
            if (!this._options.sourceController) {
                this._sourceController.cancelLoading();
            }
            this._sourceController = null;
        }
        if (isHistorySource(this._source)) {
            this._source.setDataLoadCallback(null);
        }
        this._setItemsAndMenuSource(null);
        this._closeDropdownList();
        this._sticky = null;
        if (this._stackOpener) {
            this._stackOpener.destroy();
            this._stackOpener = null;
        }
    }

    setSelectedKeys(keys: TSelectedKeys): void {
        this._selectedKeys = keys;
    }

    updateSelection(selectedKeys: TSelectedKeys, excludedKeys: TSelectedKeys): Model[] | void {
        return this._updateSelectedItems({
            ...this._options,
            selectedKeys,
            excludedKeys,
        });
    }

    setSelectedItems(selectedItems: RecordSet): void {
        this._selectedItems = selectedItems.clone(true);
        this._resolveLoadedItems(this._options, this._selectedItems);
        this._setItemsAndMenuSource(null);
        this._getSourceController(this._options).catch((error) => {
            if (!error.isCanceled) {
                return Promise.reject(error);
            }
        });
    }

    updateHistory(data): void {
        this._updateHistory(data);
    }

    updateHistoryAndCloseMenu(data: RecordSet): void {
        this._updateHistory(data);
        this._closeDropdownList();
    }

    getPreparedItem(item: Model): Model {
        return this._prepareItem(item, this._options.keyProperty, this._source);
    }

    getFormattedSelectedItems(selectedItems: RecordSet, selectedKeys: TSelectedKeys): Model[] {
        // Когда выбранная запись с таким ключом уже есть в списке, но с другими полями.
        // Нужно установить текстовое значение старой записи
        const items = [];
        selectedKeys.forEach((key) => {
            const item =
                // ищем запись в текущих
                this._getItemByKey(this._items, key, this._options.keyProperty) ||
                // или ищем в только что выбранных
                this._getItemByKey(selectedItems, key, this._options.keyProperty);
            items.push(item);
        });
        return items;
    }

    handleSelectorResult(selectedItems: RecordSet): void {
        const newItems = this._getNewItems(this._items, selectedItems, this._options.keyProperty);
        // From selector dialog records may return not yet been loaded,
        // so we save items in the history and then load data.
        if (isHistorySource(this._source)) {
            this._updateHistory(factory(selectedItems).toArray());
        } else {
            this._prependNewItems(this._items, newItems);
            this._setItemsAndMenuSource(this._items);
            this._updateSelectedItems({
                ...this._options,
                selectedKeys: this._selectedKeys,
            });
        }
        this._selectedItems = selectedItems;
    }

    handleClose(searchValue: string): void {
        if (searchValue && this._options.searchParam) {
            this._setItemsAndMenuSource(null);
            if (
                this._options.sourceController &&
                this._isSearched(this._options.sourceController)
            ) {
                this._options.sourceController.setFilter(this._options.filter || {});
                this._reloadOnOpen = true;
            }
        }
        this._isOpened = false;
        this._menuSource = null;
    }

    pinClick(item: Model): void {
        const preparedItem = this._prepareItem(item, this._options.keyProperty, this._source);
        this._source
            .update(preparedItem, {
                $_pinned: !preparedItem.get('pinned'),
            })
            .then(() => {
                this._setItemsAndMenuSource(this._source.getItems());
                this._open();
            })
            .catch((error) => {
                return error;
            });
    }

    getItems(): RecordSet<Model> {
        return this._items;
    }

    getPopupOptions(): IStickyPopupOptions {
        return this._popupOptions;
    }

    isOpenedMenu(): boolean {
        return this._isOpened;
    }

    private _open(popupOptions?: object): Promise<unknown[]> {
        if (this._options.readOnly) {
            return Promise.resolve();
        }

        this._opening = true;
        let source;
        if (popupOptions) {
            this._popupOptions = popupOptions;
            if (popupOptions.templateOptions?.source) {
                source = popupOptions.templateOptions.source;
                delete popupOptions.templateOptions.source;
            }
        }

        if (this._preloadedItems) {
            this._source = this._options.source;
            this._resolveLoadedItems(this._options, this._preloadedItems);
        }

        const indicatorId = IndicatorOpener.show();
        return this.loadDependencies(!this._preloadedItems, source)
            .finally(() => {
                IndicatorOpener.hide(indicatorId);
            })
            .then(
                () => {
                    const count = this._items?.getCount() || 0;
                    if (
                        this._isOpened ||
                        count > 1 ||
                        (count === 1 &&
                            (this._options.emptyText ||
                                this._options.selectedAllText ||
                                this._options.footerContentTemplate))
                    ) {
                        this._createMenuSource(this._items);
                        return this._openPopup();
                    } else if (count === 1) {
                        return Promise.resolve([this._items.at(0)]);
                    }
                },
                (error) => {
                    // Если не загрузился модуль меню, то просто выводим сообщение о ошибке загрузки
                    if (!requirejs.defined('Controls/menu')) {
                        process({ error });
                    } else if (this._menuSource) {
                        return this._openPopup();
                    }
                }
            );
    }

    private _openPopup(): void {
        this._isOpened = true;
        this._opening = false;
        this._sticky.open(this._getPopupOptions(this._popupOptions));
    }

    private _selectorDialogResult(result: RecordSet): void {
        this._options.selectorDialogResult(result);
        this._stackOpener.close();
    }

    private _getLoadItemsPromise(source?: ICrudPlus): Promise<any> {
        if (this._items) {
            // Обновляем данные в источнике, нужно для работы истории
            this._setItemsAndMenuSource(this._items);
            this._loadItemsPromise = Promise.resolve();
        } else if (!this._loadItemsPromise || (this._loadItemsPromise.resolved && !this._items)) {
            if ((this._options.source || this._options.sourceController) && !this._items) {
                this._loadItemsPromise = this._loadItems(this._options, source);
            } else {
                this._loadItemsPromise = Promise.resolve(this._options.items);
                if (this._options.items) {
                    this._resolveLoadedItems(this._options, this._options.items);
                }
            }
        }
        return this._loadItemsPromise;
    }

    private _setItemsAndMenuSource(items: RecordSet | null): void {
        if (items) {
            this._createMenuSource(items);
        } else {
            this._loadItemsPromise = null;
        }
        this._items = items;
    }

    private _createMenuSource(items: RecordSet): void {
        if (this._options.items && !this._options.source) {
            this._menuSource = new Memory({
                data: items.getRawData(),
                keyProperty: this._options.keyProperty,
                adapter: items.getAdapter(),
                model: items.getModel(),
                filter: () => {
                    return true;
                },
            });
        } else if (this._source) {
            this._menuSource = new PrefetchProxy({
                target: this._source,
                data: {
                    query: items,
                },
            });
        }
    }

    private _createSourceController(options: IDropdownControllerOptions, filter: object) {
        if (!this._sourceController) {
            this._sourceController = new SourceController({
                source: this._source,
                filter,
                keyProperty: options.keyProperty,
                navigation: options.navigation,
            });
        }
        return this._sourceController;
    }

    private _hasHistory(options: IDropdownControllerOptions): boolean {
        return options.historyId || isHistorySource(options.source);
    }

    private _isLocalSource(source: IDropdownControllerOptions['source']): boolean {
        if (source instanceof PrefetchProxy) {
            return cInstance.instanceOfModule(source.getOriginal(), 'Types/source:Local');
        }
        return cInstance.instanceOfModule(source, 'Types/source:Local');
    }

    private _isSearched(sourceController: SourceController): boolean {
        return !!sourceController.getFilter()?.[this._options.searchParam];
    }

    private _loadError(error: Error): void {
        if (this._options.dataLoadErrback) {
            this._options.dataLoadErrback(error);
        }
        this._loadItemsPromise = null;
        this._createMenuSource(error);
    }

    private _prepareFilterForQuery(options: IDropdownControllerOptions): object {
        let filter = options.filter;

        if (this._hasHistory(options)) {
            if (this._isLocalSource(options.source) || !options.historyNew) {
                filter = getSourceFilter(options.filter, this._source);
            } else {
                filter.historyIds = [options.historyId];
            }
        }

        return filter;
    }

    private _getSourceController(
        options: IDropdownControllerOptions,
        source?: ICrudPlus
    ): Promise<SourceController> {
        if (this._sourcePromise) {
            this._sourcePromise.cancel();
            this._sourcePromise = null;
        }
        let sourcePromise;

        if (options.sourceController) {
            this._filter = this._prepareFilterForQuery(options);
            this._sourceController = options.sourceController;
            if (!isEqual(this._filter, this._sourceController.getFilter())) {
                this._sourceController.setFilter(this._filter);
            }
            return Promise.resolve(options.sourceController);
        }

        if (
            this._hasHistory(options) &&
            this._isLocalSource(options.source) &&
            !options.historyNew
        ) {
            sourcePromise = getSource(this._source || options.source, options);
        } else {
            sourcePromise = Promise.resolve(source || options.source);
        }
        this._sourcePromise = new CancelablePromise(sourcePromise);
        return this._sourcePromise.promise.then((result) => {
            this._source = result;
            if (isHistorySource(this._source)) {
                this._source.setDataLoadCallback(options.dataLoadCallback);
            }
            this._filter = this._prepareFilterForQuery(options);
            this._sourcePromise = null;
            return this._createSourceController(options, this._filter);
        });
    }

    private _loadItems(
        options: IDropdownControllerOptions,
        source?: ICrudPlus,
        isReload?: boolean
    ): Promise<RecordSet | Error> {
        const filter = options.filter || {};
        if (
            options.sourceController &&
            !this._reloadOnOpen &&
            !options.reloadOnOpen &&
            !isReload &&
            isEqual(filter, options.sourceController.getFilter())
        ) {
            this._source = options.source;
            this._sourceController = options.sourceController;
            return Promise.resolve(
                this._resolveLoadedItems(options, options.sourceController.getItems())
            );
        } else {
            return this._getItemsFromSource(options, source).then(
                (items) => {
                    return this._resolveLoadedItems(options, items);
                },
                (error) => {
                    if (!error.isCanceled) {
                        return Promise.reject(error);
                    }
                }
            );
        }
    }

    private _getItemsFromSource(
        options: IDropdownControllerOptions,
        source?: ICrudPlus
    ): Promise<RecordSet> {
        return this._getSourceController(options, source).then(
            (sourceController) => {
                return sourceController.load(undefined, undefined, this._filter).catch((error) => {
                    if (!error.isCanceled) {
                        this._loadError(error);
                    }
                    return Promise.reject(error);
                });
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    private _loadSelectedItems(options: IDropdownControllerOptions): Promise<RecordSet> {
        const filter = { ...options.filter };
        filter[options.keyProperty] = this._selectedKeys;
        const config = {
            source: options.source,
            keyProperty: options.keyProperty,
            filter,
            emptyText: options.emptyText,
            emptyKey: options.emptyKey,
            selectedAllText: options.selectedAllText,
            selectedAllKey: options.selectedAllKey,
            selectedKeys: this._selectedKeys,
            selectedItemsChangedCallback: options.selectedItemsChangedCallback,
        };
        return this._getItemsFromSource(config);
    }

    private _reloadSelectedItems(options: IDropdownControllerOptions): Promise<void> {
        if (!this._items) {
            return this._loadSelectedItems(options).then((newItems) => {
                this._resolveLoadedItems(this._options, newItems);
                this._selectedItems = newItems;
                this._sourceController = null;
                this._setItemsAndMenuSource(null);
            });
        } else {
            return this._loadSelectedItems(options).then((newItems) => {
                this._selectedItems = newItems;
                this._resolveLoadedItems(options, this._items || newItems);
                if (isHistorySource(this._source)) {
                    this._source.prepareItems(this._items);
                }
            });
        }
    }

    private _reload(isFullReload?: boolean): Promise<void> {
        this._preloadedItems = null;
        return this._loadItems(this._options, null, isFullReload);
    }

    private _resolveLoadedItems(
        options: IDropdownControllerOptions,
        items: RecordSet<Model>
    ): RecordSet<Model> {
        if (options.dataLoadCallback && !isHistorySource(this._source)) {
            options.dataLoadCallback(items);
        }
        if (this._selectedItems) {
            this._prependNewItems(
                items,
                this._getNewItems(items, this._selectedItems, options.keyProperty)
            );
            this._selectedItems = null;
        }
        this._setItemsAndMenuSource(items);
        this._updateSelectedItems(options);
        if (items && this._isOpened) {
            this._open();
        }
        return items;
    }

    private _prependNewItems(items: RecordSet<Model>, newItems: Model[]): void {
        if (isHistorySource(this._source)) {
            const at = items.getIndexByValue('pinned', false);

            // Выбранная запись должна добавляться после запиненных в меню,
            // но если все записи запинены, то просто добавляем в конец
            if (at !== -1) {
                newItems.forEach((item, index) => {
                    items.add(item, at + index);
                });
            } else {
                items.append(newItems);
            }
        } else {
            items.prepend(newItems);
        }
    }

    private _resetLoadPromises(): void {
        this._loadMenuTempPromise = null;
        this._loadItemsPromise = null;
        this._loadItemsTempPromise = null;
    }

    private _getItemByKey(items: RecordSet, key: string, keyProperty: string): void | Model {
        let item;

        if (items) {
            item = items.at(items.getIndexByValue(keyProperty, key));
        }

        return item;
    }

    private _updateSelectedItems(
        options: IDropdownControllerOptions,
        items: RecordSet = this._items
    ): Model[] | void {
        const selectedKeys = this._selectedKeys || options.selectedKeys;
        const { excludedKeys, emptyKey, emptyText, selectedAllText, selectedAllKey } = options;
        let selectedItems = [];
        const isEmptyKey = !selectedKeys || !selectedKeys.length;

        const addEmptyTextToSelected = () => {
            selectedItems.push(null);
            this._selectedKeys = selectedKeys;
        };

        if (options.selectedItemsChangedCallback) {
            if (selectedAllText && (isEmptyKey || selectedKeys[0] === selectedAllKey)) {
                addEmptyTextToSelected();
            } else if (isEmptyKey || selectedKeys[0] === emptyKey) {
                if (emptyText) {
                    addEmptyTextToSelected();
                } else {
                    const item = this._getItemByKey(items, emptyKey, options.keyProperty);
                    if (item) {
                        selectedItems.push(item);
                    }
                }
            } else {
                if (
                    options.parentProperty &&
                    options.multiSelect &&
                    isLoaded(filterBySelectionUtil)
                ) {
                    selectedItems = loadSync(filterBySelectionUtil).filterRecordSetBySelection(
                        selectedKeys,
                        excludedKeys,
                        items,
                        options
                    );
                } else {
                    factory(selectedKeys).each((key: string) => {
                        const selectedItem = this._getItemByKey(items, key, options.keyProperty);

                        if (selectedItem) {
                            selectedItems.push(selectedItem);
                        }
                    });
                }

                if (selectedKeys[0] !== undefined && !selectedItems.length && emptyText) {
                    addEmptyTextToSelected();
                }
            }
            options.selectedItemsChangedCallback(selectedItems);
            return selectedItems;
        }
    }

    private _getUnloadedKeys(items: RecordSet, options: IDropdownControllerOptions): string[] {
        const keys = [];
        if (!this._selectedKeys.length && !this._options.emptyText) {
            keys.push(this._options.emptyKey);
        } else {
            this._selectedKeys.forEach((key) => {
                if (
                    (key !== options.emptyKey || !this._options.emptyText) &&
                    !this._getItemByKey(items, key, options.keyProperty)
                ) {
                    keys.push(key);
                }
            });
        }
        return keys;
    }

    private _getNewItems(items: RecordSet, selectedItems: RecordSet, keyProperty: string): Model[] {
        const newItems = [];

        factory(selectedItems).each((item) => {
            if (!this._getItemByKey(items, item.get(keyProperty), keyProperty)) {
                newItems.push(item);
            }
        });
        return newItems;
    }

    private _prepareItem(
        item: Model,
        keyProperty: string,
        source: IDropdownControllerOptions['source']
    ): Model {
        if (this._isHistoryMenu()) {
            const key = item.getKey();
            if (key === this._options.emptyKey) {
                item.set(keyProperty, key);
            }
            return source.resetHistoryFields(item, keyProperty);
        } else {
            return item;
        }
    }

    private _updateHistory(items: RecordSet): void {
        if (isHistorySource(this._source)) {
            // FIXME https://online.sbis.ru/opendoc.html?guid=300c6a3f-6870-492e-8308-34a457ad7b85
            if (this._options.emptyText) {
                const item = this._items.getRecordById(this._options.emptyKey);
                if (item) {
                    this._items.remove(item);
                }
            }
            this._updateHistoryPromise = this._source.update(items, getMetaHistory()).then(() => {
                this._updateHistoryPromise = null;
                if (
                    this._sourceController &&
                    this._source.getItems &&
                    (!this._options.searchParam || (this._items && this._items.getCount()))
                ) {
                    this._setItemsAndMenuSource(this._source.getItems());
                }
            });
        }
    }

    private _closeDropdownList(): void {
        this._sticky.close();
        this._isOpened = false;
    }

    private _templateOptionsChanged(
        newOptions: IDropdownControllerOptions,
        options: IDropdownControllerOptions
    ): boolean {
        const isTemplateChanged = (tplOption) => {
            return (
                typeof newOptions[tplOption] === 'string' &&
                newOptions[tplOption] !== options[tplOption]
            );
        };

        if (
            DEPEND_TEMPLATES.find((template) => {
                return isTemplateChanged(template);
            })
        ) {
            return true;
        }
    }

    private _loadItemsTemplates(options: IDropdownControllerOptions): Promise<any> {
        if (!this._loadItemsTempPromise) {
            const templatesToLoad = this._getItemsTemplates(options);
            this._loadItemsTempPromise = mStubs.require(templatesToLoad);
        }
        return this._loadItemsTempPromise;
    }

    private _loadMenuTemplates(options: object): Promise<unknown> {
        if (!this._loadMenuTempPromise) {
            this._loadMenuTempPromise = loadMenuTemplates(options, options.theme);
        }
        return this._loadMenuTempPromise;
    }

    private _getItemsTemplates(options: IDropdownControllerOptions) {
        const templates = {};
        const itemTemplateProperty = options.itemTemplateProperty;

        if (itemTemplateProperty) {
            this._items.each((item) => {
                const itemTemplate = item.get(itemTemplateProperty);

                if (typeof itemTemplate === 'string') {
                    templates[itemTemplate] = true;
                }
            });
        }

        return Object.keys(templates);
    }

    private _isHistoryMenu(): boolean {
        return isHistorySource(this._source) && this._items && this._items.at(0)?.has('HistoryId');
    }

    private _getPopupOptions(popupOptions?: object): object {
        const baseConfig = { ...this._options };
        const ignoreOptions = [
            'iWantBeWS3',
            '_$createdFromCode',
            '_logicParent',
            'theme',
            'vdomCORE',
            'name',
            'esc',
        ];

        for (let i = 0; i < ignoreOptions.length; i++) {
            const option = ignoreOptions[i];
            if (this._options[option] !== undefined) {
                delete baseConfig[option];
            }
        }
        let source = this._menuSource;
        if (!source && this._options.searchParam) {
            source = this._options.sourceController?.getSource();
        }
        const templateOptions = {
            selectedKeys: this._selectedKeys,
            dataLoadCallback: this._options.menuDataLoadCallback,
            emptyText: this._options.emptyText,
            selectedAllText: this._options.selectedAllText,
            allowPin: this._options.allowPin && this._hasHistory(this._options),
            keyProperty: this._isHistoryMenu() ? 'copyOriginalId' : baseConfig.keyProperty,
            headerTemplate: this._options.headTemplate || this._options.headerTemplate,
            footerContentTemplate: this._options.footerContentTemplate,
            items: !this._isHistoryMenu() ? this._items : null,
            footerVisibility: this._options.footerVisibility,
            source,
            sourceController: this._options.sourceController ? this._sourceController : undefined,
            filter:
                this._filter || this._options.sourceController?.getFilter() || this._options.filter,
            // FIXME this._container[0] delete after
            // https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            width:
                this._options.width !== undefined
                    ? (this.target[0] || this.target).offsetWidth
                    : undefined,
            hasMoreButton: this._sourceController?.hasMoreData('down'),
            draggable: this._options.menuDraggable,
            focusable: false,
        };
        const config = {
            allowAdaptive: this._options.allowAdaptive,
            adaptiveOptions: {
                modal: true,
            },
            templateOptions: { ...baseConfig, ...templateOptions },
            className:
                this._options.popupClassName +
                ` controls_dropdownPopup_theme-${this._options.theme}
          controls_popupTemplate_theme-${this._options.theme}`,
            template: 'Controls/menu:Popup',
            actionOnScroll: 'close',
            target: this.target || this._options.target,
            targetPoint: this._options.targetPoint,
            opener: this._popupOptions.opener || this._options.openerControl,
            fittingMode: {
                vertical: 'adaptive',
                horizontal: 'overflow',
            },
            autofocus: false,
            closeOnOutsideClick: this._options.closeMenuOnOutsideClick,
        };
        const popupConfig = Merge(popupOptions, this._options.menuPopupOptions || {});
        const result = Merge(config, popupConfig || {});
        const root = result.templateOptions.root;
        if (root) {
            this._updateSourceInOptions(root, result);
        }
        return result;
    }

    private _updateSourceInOptions(root: string, result: object): void {
        const parent = this._items.getRecordById(root)?.getKey();
        if (this._items.getIndexByValue(this._options.parentProperty, parent) === -1) {
            result.templateOptions.source = this._options.source;
        }
    }
}

Controller.getDefaultOptions = function getDefaultOptions() {
    return {
        filter: {},
        selectedKeys: [],
        allowPin: true,
    };
};

Controller.getOptionTypes = function getOptionTypes() {
    return {
        selectedKeys: descriptor(Array),
    };
};
/**
 * @event selectedItemsChanged Происходит при изменении набора выбранных элементов.
 * @name Controls/_dropdown/_Controller#selectedItemsChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/collection:RecordSet} items Выбранные элементы.
 */
