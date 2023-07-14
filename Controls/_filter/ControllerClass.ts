/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { IPrefetchHistoryParams, IPrefetchParams, IPrefetch } from 'Controls/filter';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';

import { updateFilterDescription, isCallbacksLoaded } from 'Controls/_filter/Utils/CallbackUtils';
import { getHistorySource, getParamHistoryIds } from 'Controls/_filter/HistoryUtils';
import mergeSource from 'Controls/_filter/Utils/mergeSource';
import { resetFilter } from 'Controls/_filter/resetFilterUtils';
import { _assignServiceFilters } from '../_search/Utils/FilterUtils';
import { selectionToRecord } from 'Controls/operations';
import { TKeysSelection, TFilter, TStoreImport } from 'Controls/interface';
import { loadSavedConfig } from 'Controls/Application/SettingsController';
import { Logger } from 'UI/Utils';
import { FilterSource } from 'Controls/history';

import * as clone from 'Core/core-clone';
import {
    CrudWrapper,
    NewSourceController as SourceController,
    FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD,
} from 'Controls/dataSource';
import { object, mixin } from 'Types/util';
import { isEqual } from 'Types/object';
import {
    Model,
    ObservableMixin,
    SerializableMixin,
    OptionsToPropertyMixin,
    ISerializableState as IDefaultSerializableState,
} from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Deferred } from 'Types/deferred';
import { ICrud, PrefetchProxy, Rpc } from 'Types/source';
import getFilterByFilterDescription from 'Controls/_filter/filterCalculator';
import isFilterItemChanged from 'Controls/_filter/Utils/isFilterItemChanged';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';

import { updateUrlByFilter, getFilterFromUrl } from 'Controls/_filter/Utils/Url';
import { IFilterItemConfiguration } from './View/interface/IFilterItemConfiguration';

export interface IFilterHistoryData {
    items: IFilterItem[];
    prefetchParams?: IPrefetchHistoryParams;
}

type THistoryData = IFilterHistoryData | IFilterItem[];

export interface IFilterControllerOptions {
    prefetchParams?: IPrefetchParams;
    prefetchSessionId?: string;
    filter?: TFilter;
    useStore?: boolean;
    filterButtonSource: IFilterItem[];
    filterDescription?: IFilterItem[];
    historyItems?: IFilterItem[];
    historyId?: string;
    searchValue?: string;
    searchParam?: string;
    minSearchLength?: number;
    parentProperty?: string;
    selectedKeys?: TKeysSelection;
    excludedKeys?: TKeysSelection;
    source?: ICrud;
    selectionViewMode?: string;
    historySaveCallback?: (
        historyData: Record<string, unknown>,
        filterButtonItems: IFilterItem[]
    ) => void;
}

export interface ICalculateFilterParams {
    historyId: string;
    historyItems?: IFilterItem[];
    prefetchParams?: IPrefetchHistoryParams;
    filter: TFilter;
    filterButtonSource: IFilterItem[];
}
export interface ICalculatedFilter {
    filter: TFilter;
    historyItems: IFilterItem[];
    filterButtonItems: IFilterItem[];
}

interface IFilterControllerOptionsSerialized extends IFilterControllerOptions {
    filterButtonItems?: IFilterItem[]; // приходит в опции при сериализации
}
type ISerializableState = IDefaultSerializableState<IFilterControllerOptionsSerialized>;

const getPropValue = object.getPropertyValue;
const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

const ACTIVE_HISTORY_FILTER_INDEX = 0;
const SELECTION_PATH_FILTER_FIELD = 'SelectionWithPath';
const MIN_SEARCH_LENGTH = 3;

const PREFETCH_MODULE = 'Controls-ListEnv/filterPrefetch';

export default class FilterControllerClass extends mixin<
    ObservableMixin,
    SerializableMixin,
    OptionsToPropertyMixin
>(ObservableMixin, SerializableMixin, OptionsToPropertyMixin) {
    private _crudWrapper: CrudWrapper;
    private _$filterButtonItems: IFilterItem[] = null;
    private _$filter: TFilter = {};
    private _$filterDescriptionUsed: boolean = false;

    /* Флаг необходим, т.к. добавлять запись в историю после изменения фильтра
   необходимо только после загрузки данных, т.к. только в ответе списочного метода
   можно получить идентификатор закэшированных данных для этого фильтра */
    private _isFilterChanged: boolean = false;

    constructor(options: Partial<IFilterControllerOptions>) {
        super(options);
        ObservableMixin.initMixin(this, options);
        OptionsToPropertyMixin.initMixin(this, options);
        this._options = options;
        this._$filter = options.filter || {};
        this._$filterDescriptionUsed = !!options.filterDescription;

        const filterDescription =
            this._$filterButtonItems ||
            FilterControllerClass._getFilterButtonItems(
                options.filterDescription || options.filterButtonSource
            );
        const filterButtonItems =
            FilterControllerClass._prepareFilterDescription(filterDescription);
        const filterFromUrl = this._getFilterFromUrl(filterButtonItems);
        if (options.prefetchParams) {
            if (!isLoaded(PREFETCH_MODULE)) {
                Logger.error(
                    `${this._moduleName} для работы кэширования необходимо загрузить модуль: ${PREFETCH_MODULE}`,
                    this
                );
            }
            this._$filter = this._preparePrefetchFilter(this._$filter, options);

            if (!options.historyItems || !options.historyItems.length) {
                this._isFilterChanged = true;
            }
        }

        if (
            filterButtonItems &&
            this._isFilterItemsChanged(filterButtonItems) &&
            isCallbacksLoaded(filterButtonItems)
        ) {
            updateFilterDescription(
                filterButtonItems,
                this._$filter,
                getFilterByFilterDescription(this._$filter, filterButtonItems) as TFilter,
                (newItems) => {
                    this._setFilterDescription(newItems, void 0, filterFromUrl);
                }
            );
        } else {
            this._setFilterDescription(filterButtonItems, null, filterFromUrl);
        }
        this._updateFilter(options);
    }

    private _isFunction(value: any): boolean {
        return typeof value === 'function';
    }

    applyFilterDescriptionFromHistory(historyItems: THistoryData, newFilter?: TFilter): void {
        const filterDescription =
            this._options.filterDescription || this._options.filterButtonSource;
        const currentFilter = this.getFilter() || newFilter;
        let filterItems;

        if (this._options.useStore && !filterDescription) {
            const state = getStore().getState();
            filterItems = state.filterSource;
        } else {
            filterItems = this._isFunction(filterDescription)
                ? filterDescription
                : this._$filterButtonItems;
        }
        filterItems = FilterControllerClass._prepareFilterDescription(
            this._getItemsWithHistory(filterItems, historyItems)
        );

        if (this._options.prefetchParams && historyItems instanceof Array && historyItems.length) {
            this._processHistoryOnItemsChanged(
                historyItems,
                this._options as IFilterControllerOptions
            );
        }
        const filter = getFilterByFilterDescription(
            this._applyPrefetchFromHistoryIfNeed(this.getFilter(), historyItems, this._options),
            filterItems
        );
        this._setFilter(filter);
        if (isCallbacksLoaded(filterItems)) {
            updateFilterDescription(filterItems, currentFilter, filter, (newItems) => {
                this._setFilterDescription(newItems, null);
            });
        } else {
            this._setFilterDescription(filterItems, null);
        }
    }

    applyFilterDescription(filterDescription: IFilterItem[]): IFilterItem[] {
        this.updateFilterItems(filterDescription);
        return this.getFilterButtonItems();
    }

    setFilterDescription(filterItems: IFilterItem[]): void {
        this._setFilterDescription(filterItems, null);
        this._notify('filterSourceChanged', this._$filterButtonItems);
    }

    loadFilterItemsFromHistory(): Promise<THistoryData> {
        // TODO: storefix207100
        if (this._options.useStore && !this._options.filterButtonSource) {
            const state = getStore().getState();
            const loadedSources = state && state.loadedSources && state.loadedSources[0];
            if (loadedSources) {
                return this._resolveItemsWithHistory(loadedSources, loadedSources.filter);
            } else {
                return this._resolveItemsWithHistory(
                    {
                        historyId: state.historyId || this._options.historyId,
                        filterButtonSource: state.filterSource || this._options.filterButtonSource,
                        historyItems: this._options.historyItems,
                    },
                    state.filter || this._options.filter
                );
            }
        } else {
            return this._resolveItemsWithHistory(this._options, this._$filter);
        }
    }

    loadFilterConfiguration(propStorageId: string): Promise<void> {
        return loadSavedConfig(propStorageId, ['filterUserConfiguration']).then(
            (configurationPromiseResult) => {
                const userSettings = configurationPromiseResult?.filterUserConfiguration;
                if (Array.isArray(userSettings) && userSettings.length) {
                    const filterButtonItems = this._applyFilterConfigurationToSource(
                        this.getFilterButtonItems(),
                        userSettings
                    );
                    this._setFilterDescription(filterButtonItems);
                }
            }
        );
    }

    update(newOptions: IFilterControllerOptions): void | boolean {
        const filterButtonChanged =
            !this._$filterDescriptionUsed &&
            !isEqual(this._options.filterButtonSource, newOptions.filterButtonSource);
        const newFilter = newOptions.filter;
        const filterChanged = !isEqual(this._options.filter, newFilter);
        const isFilterChangedWithPrefetch = this._isFilterChanged;
        const selectionViewModeChanged =
            this._options.selectionViewMode !== newOptions.selectionViewMode;
        const prefetchSessionIdChanged =
            this._options.prefetchSessionId !== newOptions.prefetchSessionId;
        const prefetchParams = newOptions.prefetchParams;

        if (filterButtonChanged) {
            this._setFilterDescription(
                filterButtonChanged ? newOptions.filterButtonSource : this._$filterButtonItems
            );
            this._addToUrl(this._$filterButtonItems);
        }

        if (filterChanged || prefetchSessionIdChanged) {
            const filter = prefetchParams
                ? this._preparePrefetchFilter(newFilter, newOptions)
                : newFilter;

            this._applyItemsToFilter(filter);
            if (prefetchParams && !isEqual(newFilter, this.getFilter())) {
                this._isFilterChanged = true;
            }
        }

        if (filterButtonChanged && prefetchParams && !isFilterChangedWithPrefetch) {
            this._$filter = this._getPrefetch().clearPrefetchSession(this._$filter);
        }

        if (newOptions.historyId !== this._options.historyId) {
            this._crudWrapper = null;
        }

        this._options = newOptions;
        if (filterChanged || selectionViewModeChanged) {
            this._updateFilter(this._options);
        }
        return filterChanged || filterButtonChanged || selectionViewModeChanged;
    }

    resetPrefetch(): void {
        const filter = clone(this._$filter);
        this._isFilterChanged = true;
        this._setFilterAndNotify(loadSync(PREFETCH_MODULE).Prefetch.clearPrefetchSession(filter));
    }

    updateHistory(history: THistoryData): void {
        if (this._options.prefetchParams) {
            this._processHistoryOnItemsChanged(history.items || history, this._options, true);
        }
    }

    updateFilterItems(items: IFilterItem[]): void {
        const currentFilterButtonItems = this._$filterButtonItems;
        const currentFilter = this._$filter;

        this._updateFilterItems(items);
        const newFilter = getFilterByFilterDescription(
            currentFilter,
            this._$filterButtonItems
        ) as TFilter;

        if (!isEqual(currentFilterButtonItems, this._$filterButtonItems)) {
            updateFilterDescription(
                this._$filterButtonItems,
                currentFilter,
                newFilter,
                (newItems) => {
                    this._setFilterDescription(newItems, null);
                    this._onFilterItemsChanged();
                    this._notify('filterSourceChanged', this._$filterButtonItems);
                }
            );
        }
    }

    setFilter(filter: object): void {
        this._setFilterAndNotify(this._preparePrefetchFilter(filter, this._options));
    }

    handleDataLoad(items: RecordSet): void {
        if (this._options.historyId) {
            if (this._isFilterChanged) {
                if (
                    this._getHistorySource(
                        this._options.historyId,
                        this._$filterButtonItems,
                        !!this._options.prefetchParams ||
                            this._isFavoriteMode(this._options.historySaveMode)
                    ).historyReady()
                ) {
                    this._deleteCurrentFilterFromHistory();
                }
                this._addToHistory(
                    this._$filterButtonItems,
                    this._options.historyId,
                    this._options.prefetchParams
                        ? this._getPrefetch().getPrefetchParamsForSave(items)
                        : null
                );
            }

            // Намеренное допущение, что меняем объект по ссылке.
            // Сейчас по-другому не сделать, т.к. контроллер фильтрации находится над
            // контейнером и списком, которые владеют данными.
            // А изменение фильтра вызывает повторный запрос за данными.
            if (this._options.prefetchParams) {
                this._getPrefetch().applyPrefetchFromItems(this._$filter, items);
            }
        }

        this._isFilterChanged = false;
    }

    handleDataError(): void {
        if (this._options.historyId && this._isFilterChanged) {
            const currentAppliedHistoryItems = this._getHistoryByItems(
                this._options.historyId,
                this._$filterButtonItems
            );

            if (currentAppliedHistoryItems) {
                Object.assign(
                    this._$filter,
                    this._applyPrefetchFromHistoryIfNeed(
                        this._$filter,
                        currentAppliedHistoryItems.data,
                        this._options
                    )
                );
            }
        }
    }

    getFilter(): TFilter {
        return this._$filter;
    }

    getFilterButtonItems(): IFilterItem[] {
        return this._$filterButtonItems;
    }

    getHistoryId(): string {
        return this._options.historyId;
    }

    getCalculatedFilter(config: object) {
        return getCalculatedFilter.call(this, config);
    }

    saveFilterToHistory(config: object) {
        return saveFilterToHistory.call(this, config);
    }

    resetFilterItems(): void {
        const filterItems = object.clonePlain(this._$filterButtonItems);
        resetFilter(filterItems);
        this.updateFilterItems(filterItems);
    }

    resetFilterDescription(): IFilterItem[] {
        this.resetFilterItems();
        return this._$filterButtonItems;
    }

    reloadFilterItem(filterName: string): void | Promise<RecordSet | Error> {
        const filterItem = this.getFilterButtonItems().find(({ name }) => {
            return name === filterName;
        });

        if (!filterItem) {
            Logger.error(
                `${this._moduleName}::reloadFilterItem() в структуре фильтров отстуствует элемент с именем ${filterName}`,
                this
            );
            return;
        }

        const editorOptions = filterItem.editorOptions;

        if (!editorOptions.source) {
            Logger.error(
                `${this._moduleName}::reloadFilterItem() элемент структуры фильтров ${filterName} не поддерживает перезагрузку.`,
                this
            );
            return;
        }

        return editorOptions.sourceController.reload().then((result) => {
            if (!isEqual(editorOptions.items, editorOptions.sourceController.getItems())) {
                editorOptions.items.assign(editorOptions.sourceController.getItems());
            }
            return result;
        }).catch((error) => {
            return error;
        });
    }

    openDetailPanel(): void {
        this._notify('openDetailPanel');
    }

    openFilterDetailPanel(): void {
        this._notify('openDetailPanel');
    }

    closeFilterDetailPanel(): void {
        this._notify('closeDetailPanel');
    }

    private _getPrefetch(): IPrefetch {
        return loadSync(PREFETCH_MODULE).Prefetch;
    }

    private _applyPrefetchFromHistoryIfNeed(
        filter: object,
        filterItems: IFilterItem[],
        options: Partial<IFilterControllerOptions>
    ): object {
        if (options.prefetchParams) {
            return this._getPrefetch().applyPrefetchFromHistory(filter, filterItems);
        } else {
            return filter;
        }
    }

    private _preparePrefetchFilter(
        filter: TFilter,
        { prefetchParams, prefetchSessionId }: IFilterControllerOptions
    ): object {
        if (prefetchParams) {
            const prefetchSession =
                prefetchSessionId || this.getFilter()[this._getPrefetch().PREFETCH_SESSION_FIELD];
            return this._getPrefetch().prepareFilter(filter, prefetchParams, prefetchSession);
        }
        return { ...filter };
    }

    private _onFilterItemsChanged(): void {
        this._addToUrl(this._$filterButtonItems);
        if (this._options.historyId) {
            if (this._options.prefetchParams) {
                if (!this._isFilterChanged) {
                    this._deleteCurrentFilterFromHistory();
                    this._getPrefetch().clearPrefetchSession(this._$filter);
                }
                this._isFilterChanged = true;
            } else if (this._options.historyId) {
                this._addToHistory(this._$filterButtonItems, this._options.historyId);
            }
        }
        this._notify('filterButtonSourceChanged', [this._$filterButtonItems]);
    }

    private _updateFilterItems(newItems: IFilterItem[]): void {
        if (this._$filterButtonItems) {
            this._$filterButtonItems = FilterControllerClass._cloneItems(this._$filterButtonItems);
            mergeSource(this._$filterButtonItems, newItems);
        }
    }

    private _updateFilter(options: Partial<IFilterControllerOptions>): void {
        if (options.searchParam && options.searchValue) {
            this._prepareSearchFilter(this._$filter, options);
        }
        if (options.selectedKeys) {
            this._prepareOperationsFilter(this._$filter, options);
        }
    }

    private _getFilterFromUrl(filterButtonItems: IFilterItem[]): void | IFilterItem[] {
        const filterItems = FilterControllerClass._getFilterButtonItems(filterButtonItems);
        if (filterItems && this._getSaveToUrlItems(filterItems).length) {
            return getFilterFromUrl();
        }
    }

    private _resolveItemsWithHistory(
        options: Partial<IFilterControllerOptions>
    ): Promise<THistoryData> {
        return this._resolveHistoryItems(options).then((history) => {
            this.applyFilterDescriptionFromHistory(history);
            if (
                options.historyItems &&
                options.historyItems.length &&
                options.historyId &&
                options.prefetchParams
            ) {
                this._processHistoryOnItemsChanged(
                    options.historyItems,
                    options as IFilterControllerOptions
                );
            }
            return history;
        });
    }

    private _isFavoriteMode(saveMode: string): boolean {
        return saveMode === 'favorite';
    }

    // Получает итемы с учетом истории.
    private _resolveHistoryItems({
        historyId,
        historyItems,
        prefetchParams,
        filterButtonSource,
        filterDescription,
        historySaveMode,
    }: {
        historyId: string;
        historyItems: IFilterItem[];
        prefetchParams: IPrefetchHistoryParams;
        filterButtonSource: IFilterItem[];
        filterDescription: IFilterItem[];
        historySaveMode: string;
    }): Promise<THistoryData> {
        const filterSource = filterButtonSource || filterDescription;
        const isFavoriteSaveMode = this._isFavoriteMode(historySaveMode);
        if (historyItems && prefetchParams && historyItems?.length) {
            return this._loadHistoryItems(
                historyId,
                filterSource,
                prefetchParams,
                isFavoriteSaveMode
            ).then((result) => {
                return historyItems ? historyItems : result;
            });
        } else {
            return historyItems
                ? Promise.resolve(historyItems)
                : this._loadHistoryItems(
                      historyId,
                      filterSource,
                      prefetchParams,
                      isFavoriteSaveMode
                  );
        }
    }

    private _loadHistoryItems(
        historyId: string,
        filterSource: IFilterItem[],
        prefetchParams?: IPrefetchHistoryParams,
        isFavoriteSaveMode?: boolean
    ): Promise<THistoryData> {
        let result;

        if (!historyId) {
            result = Promise.resolve([]);
        } else {
            const filterButtonItems = FilterControllerClass._getFilterButtonItems(filterSource);
            const source = this._getHistorySource(
                historyId,
                filterButtonItems,
                !!prefetchParams || isFavoriteSaveMode
            );

            if (!this._crudWrapper) {
                this._crudWrapper = new CrudWrapper({
                    source,
                });
            } else {
                this._crudWrapper.updateOptions({ source });
            }

            result = this._loadHistorySource(source);
        }

        return result;
    }

    private _loadHistorySource(source: typeof FilterSource): Promise<THistoryData> {
        return new Promise((resolve) => {
            this._crudWrapper
                .query({ filter: { $_history: true } })
                .then((res) => {
                    let historyResult;
                    const recent = source.getRecent();

                    if (recent.getCount()) {
                        const lastFilter = recent.at(ACTIVE_HISTORY_FILTER_INDEX);
                        const lastFilterData = source.getDataObject(lastFilter);
                        historyResult = Object.keys(lastFilterData).length ? lastFilterData : [];
                    } else {
                        historyResult = [];
                    }
                    historyResult = this._mergeHistoryParams(historyResult, source);
                    resolve(historyResult);
                    return res;
                })
                .catch((error) => {
                    error.processed = true;
                    resolve([]);
                    return error;
                });
        });
    }

    private _mergeHistoryParams(
        filterSource: IFilterItem[],
        source: typeof FilterSource
    ): IFilterItem[] {
        const paramsHistoryIds = source.getParams();
        const history = filterSource.items ? filterSource.items : filterSource;
        const historyParams = [];
        for (const historyId in paramsHistoryIds) {
            if (paramsHistoryIds.hasOwnProperty(historyId)) {
                historyParams.push(source.getDataObject(paramsHistoryIds[historyId]));
            }
        }
        historyParams.forEach((hParam) => {
            const historyItem = this._getItemByName(history, hParam.name);
            if (!historyItem) {
                history.push(hParam);
            } else {
                const index = history.indexOf(historyItem);
                history[index] = { ...hParam };
            }
        });
        return filterSource;
    }

    private _getItemByName(items: IFilterItem[], name: string): IFilterItem {
        return items.find((item) => {
            return item.name === name;
        });
    }

    private _deleteCurrentFilterFromHistory(): void {
        const history = this._getHistoryByItems(
            this._options.historyId,
            this._$filterButtonItems,
            this._options.prefetchParams,
            this._options.historySaveMode
        );

        if (history) {
            FilterControllerClass._deleteFromHistory(history.item, this._options.historyId);
        }
    }

    private _getHistoryByItems(
        historyId: string,
        items: IFilterItem[],
        prefetchParams?: IPrefetchParams,
        historySaveMode?: string
    ): IFilterItem | null {
        let result;
        this._updateMeta = null;

        result = this._findItemInHistory(historyId, items, prefetchParams, historySaveMode);

        // Метод используется для поиска элемента для удаления и последующего
        // сохранения нового элемента с новыми данными
        // Если элемент запинен или добавлен в избранное, его нельзя удалять.
        if (result) {
            const isPinned = result.item.get('pinned');
            const isFavorite = result.item.get('client');
            if (isFavorite || isPinned) {
                this._updateMeta = {
                    item: result.item,
                    isClient: result.data.isClient,
                };
                if (isPinned) {
                    this._updateMeta.$_pinned = true;
                }
                if (this._options.prefetchParams) {
                    this._updateMeta.$_favorite = true;
                }
                result = null;
            }
        }
        return result;
    }

    private _findItemInHistory(
        historyId: string,
        items: IFilterItem[],
        prefetchParams?: IPrefetchParams,
        historySaveMode?: string
    ): void {
        let result;
        let historyData;
        let minimizedItemFromHistory;
        let minimizedItemFromOption;

        const isFavoriteSaveMode = this._isFavoriteMode(historySaveMode);
        const historySource = this._getHistorySource(
            historyId,
            this._$filterButtonItems,
            !!prefetchParams || isFavoriteSaveMode
        );
        /* На сервере historySource не кэшируется и история никогда не будет проинициализирована
           Нужно переводить кэширование на сторы Санникова
           https://online.sbis.ru/opendoc.html?guid=4ca5d3b8-65a7-4d98-8ca4-92ed1fbcc0fc
         */
        if (!historySource.historyReady()) {
            return;
        }
        const historyItems = historySource.getItems();
        if (historyItems && historyItems.getCount()) {
            historyItems.each((item, index) => {
                if (!result) {
                    historyData = historySource.getDataObject(item);

                    if (historyData) {
                        const itemsToSave =
                            FilterControllerClass._getFilterDescriptionForHistory(items);
                        minimizedItemFromOption = this._minimizeFilterItems(itemsToSave);
                        minimizedItemFromHistory = this._minimizeFilterItems(
                            historyData.items || historyData
                        );
                        if (minimizedItemFromOption.length && minimizedItemFromHistory.length) {
                            const keyFromOption = minimizedItemFromOption[0].hasOwnProperty('name')
                                ? 'name'
                                : 'id';
                            const keyFromHistory = minimizedItemFromHistory[0].hasOwnProperty(
                                'name'
                            )
                                ? 'name'
                                : 'id';
                            if (keyFromOption !== keyFromHistory) {
                                minimizedItemFromHistory = minimizedItemFromHistory.map(
                                    (historyItem) => {
                                        historyItem[keyFromOption] = historyItem[keyFromHistory];
                                        delete historyItem[keyFromHistory];
                                        return historyItem;
                                    }
                                );
                            }
                        }
                        if (isEqual(minimizedItemFromOption, minimizedItemFromHistory)) {
                            result = {
                                item,
                                data: historyData,
                                index,
                            };
                        }
                    }
                }
            });
        }

        return result;
    }

    private _getHistorySource(historyId: string, filterSource: IFilterItem[], favorite?: boolean) {
        return getHistorySource({
            historyId,
            historyIds: getParamHistoryIds(filterSource),
            favorite,
        });
    }

    private _minimizeFilterItems(items: IFilterItem[]): IFilterItem[] {
        const minItems = [];
        items.forEach((item) => {
            minItems.push(FilterControllerClass._minimizeItem(item));
        });
        return minItems;
    }

    private _addToHistory(
        filterButtonItems: IFilterItem[],
        historyId: string,
        prefetchParams?: IPrefetchHistoryParams,
        historySaveMode?: string
    ): Promise<any> {
        const meta = this._updateMeta || { $_addFromData: true };
        const historySource = this._getHistorySource(
            historyId,
            filterButtonItems,
            !!prefetchParams || historySaveMode === 'favorite'
        );

        const update = () => {
            let historyData;
            if (this._updateMeta) {
                historyData = this._updateMeta.item;
                if (historyData && prefetchParams) {
                    const historyItems = JSON.parse(historyData.get('ObjectData'));
                    const currentSessionId = historyItems.prefetchParams.PrefetchSessionId;
                    const newSessionId = prefetchParams?.PrefetchSessionId;
                    if (newSessionId && currentSessionId !== newSessionId) {
                        historyItems.prefetchParams.PrefetchSessionId = newSessionId;
                        historyData.set('ObjectData', JSON.stringify(historyItems));
                    }
                }
            } else {
                historyData = this._getHistoryData(filterButtonItems, prefetchParams);
                if (this._options.historySaveCallback instanceof Function) {
                    this._options.historySaveCallback(historyData, filterButtonItems);
                }
            }

            return historySource.update(historyData, meta);
        };

        if (!historySource.historyReady()) {
            // Getting history before updating if it hasn’t already done
            return this._loadHistoryItems(historyId, filterButtonItems).then(() => {
                return update();
            });
        } else {
            return update();
        }
    }

    private _addToUrl(filterButtonItems: IFilterItem[]): void {
        if (!filterButtonItems) {
            return;
        }

        const items: IFilterItem[] = this._getSaveToUrlItems(filterButtonItems);

        if (items.length) {
            updateUrlByFilter(items);
        }
    }

    private _getSaveToUrlItems(filterButtonItems: IFilterItem[]): IFilterItem[] {
        return filterButtonItems.filter((item) => {
            return item.saveToUrl || (this._options.saveToUrl && !item.hasOwnProperty('saveToUrl'));
        });
    }

    private _getHistoryData(
        filterButtonItems: IFilterItem[],
        prefetchParams?: IPrefetchHistoryParams
    ): THistoryData {
        let result = {} as IFilterHistoryData;

        /* An empty filter should not appear in the history,
           but should be applied when loading data from the history.
           To understand this, save an empty object in history. */
        if (
            this._isFilterItemsChanged(
                FilterControllerClass._getFilterDescriptionForHistory(filterButtonItems)
            ) ||
            this._hasHistoryParams(filterButtonItems)
        ) {
            result = prefetchParams
                ? this._getPrefetch().addPrefetchToHistory(result, prefetchParams)
                : result;
            result.items = this._prepareHistoryItems(filterButtonItems);
        }
        return result;
    }

    private _hasHistoryParams(filterSource: IFilterItem[]): boolean {
        return filterSource.some((filterItem) => {
            return filterItem.historyId;
        });
    }

    private _prepareHistoryItems(filterButtonItems: IFilterItem[]): IFilterItem[] {
        const historyItems = FilterControllerClass._cloneItems(filterButtonItems);
        return this._minimizeFilterItems(
            FilterControllerClass._getFilterDescriptionForHistory(historyItems)
        );
    }

    private _processHistoryOnItemsChanged(
        items: IFilterItem[],
        options: IFilterControllerOptions,
        doNotDeleteCurrentHistory?: boolean
    ): void {
        this._processPrefetchOnItemsChanged(options, items, doNotDeleteCurrentHistory);
        this._isFilterChanged = true;
    }

    private _processPrefetchOnItemsChanged(
        options: IFilterControllerOptions,
        items: IFilterItem[],
        doNotDeleteCurrentHistory?: boolean
    ): void {
        const prefetch = this._getPrefetch();
        const historyReady = this._getHistorySource(
            options.historyId,
            this._$filterButtonItems,
            !!options.prefetchParams || this._isFavoriteMode(options.historySaveMode)
        ).historyReady();
        // Меняют фильтр с помощью кнопки фильтров,
        // но такой фильтр уже может быть сохранён в истории и по нему могут быть закэшированные данные,
        // поэтому ищем в истории такой фильтр, если есть, смотрим валидны ли ещё закэшированные данные,
        // если валидны, то просто добавляем идентификатор сессии в фильтр,
        // если данные не валидны, то такую запись из истории надо удалить
        let history = this._getHistoryByItems(
            options.historyId,
            items || this._$filterButtonItems,
            options.prefetchParams,
            options.historySaveMode
        );
        if (!history) {
            history = this._findItemInHistory(
                options.historyId,
                items || this._$filterButtonItems,
                options.prefetchParams,
                options.historySaveMode
            );
        }
        let filter = this._$filter;
        let needDeleteFromHistory = false;
        let needApplyPrefetch = false;

        if (history) {
            const prefetchParams = prefetch.getPrefetchFromHistory(history.data);
            const needInvalidate =
                prefetchParams && prefetch.needInvalidatePrefetch(history.data);

            if (needInvalidate) {
                needDeleteFromHistory = true;
            }

            if (prefetchParams && !needInvalidate) {
                needApplyPrefetch = true;
            }
        }

        if (needApplyPrefetch) {
            filter = this._applyPrefetchFromHistoryIfNeed(this._$filter, history.data, options);

            if (!isEqual(filter, this._$filter) && !doNotDeleteCurrentHistory) {
                needDeleteFromHistory = true;
            }
            // Построение отчёта в новом окне происходит без загрузки истории, по historyItems,
            // в таком случае, чистить сессию кэша в фильтре не надо
            // чистим её только когда понимаем явно, что в истории такой структуры фильтра нет
        } else if (historyReady) {
            filter = prefetch.clearPrefetchSession(this._$filter);
        }

        if (needDeleteFromHistory) {
            FilterControllerClass._deleteFromHistory(history.item, options.historyId);
        }

        this._setFilterAndNotify(filter);
    }

    private _setFilterDescription(
        filterButtonOption: IFilterItem[],
        history?: THistoryData,
        filterFromUrl?: IFilterItem[]
    ): void {
        this._$filterButtonItems = this._getItemsWithHistory(
            filterButtonOption,
            history,
            filterFromUrl
        );
        this._applyItemsToFilter();
    }

    private _getItemsWithHistory(
        filterDescription: IFilterItem[],
        history?: THistoryData,
        filterFromUrl?: IFilterItem
    ): IFilterItem[] {
        let historyItems;

        if (history) {
            historyItems = history.items || (Array.isArray(history) ? history : []);
        }
        return FilterControllerClass._getItemsByOption(
            filterDescription,
            historyItems,
            filterFromUrl
        );
    }

    private _isFilterItemsChanged(filterButtonItems: IFilterItem[]): boolean {
        let isChanged = false;
        filterButtonItems.forEach((filterItem) => {
            if (!isChanged) {
                isChanged = isFilterItemChanged(filterItem);
            }
        });
        return isChanged;
    }

    private _applyItemsToFilter(
        filter: object = this._$filter,
        filterButtonItems: IFilterItem[] = this._$filterButtonItems
    ): void {
        this._setFilterAndNotify(getFilterByFilterDescription(filter, filterButtonItems));
    }

    private _prepareSearchFilter(
        filter: object,
        {
            searchValue,
            searchParam,
            minSearchLength = MIN_SEARCH_LENGTH,
            parentProperty,
        }: Partial<IFilterControllerOptions>
    ): void {
        const preparedFilter = { ...filter } || {};
        if (searchValue && searchParam && searchValue.length >= minSearchLength) {
            preparedFilter[searchParam] = searchValue;
            _assignServiceFilters({}, preparedFilter, parentProperty);
        }
        this._setFilterAndNotify(preparedFilter);
    }

    private _prepareOperationsFilter(
        filter: object,
        {
            selectedKeys = [],
            excludedKeys = [],
            source,
            selectionViewMode,
        }: Partial<IFilterControllerOptions>
    ): object {
        const preparedFilter = { ...filter } || {};

        if (selectionViewMode === 'selected') {
            const listSource = (source as PrefetchProxy).getOriginal
                ? (source as PrefetchProxy).getOriginal()
                : source;
            preparedFilter[SELECTION_PATH_FILTER_FIELD] = selectionToRecord(
                {
                    selected: selectedKeys || [],
                    excluded: excludedKeys || [],
                },
                (listSource as Rpc).getAdapter(),
                'all',
                false
            );
        } else {
            delete preparedFilter[SELECTION_PATH_FILTER_FIELD];
        }

        this._setFilterAndNotify(preparedFilter);
        return preparedFilter;
    }

    private _setFilter(filter: TFilter): void {
        if (!isEqual(this._$filter, filter)) {
            this._$filter = filter;
        }
    }

    private _setFilterAndNotify(filter: object): void {
        this._setFilter(filter as TFilter);
        this._notify('filterChanged', this._$filter);
    }

    private _applyFilterConfigurationToSource(
        items: IFilterItem[],
        config: IFilterItemConfiguration[]
    ): IFilterItem[] {
        const itemsClone = object.clonePlain(items);
        return itemsClone.map((item) => {
            const filterConfiguration = config.find((configItem) => {
                return configItem.name === item.name;
            });
            if (filterConfiguration?.viewMode) {
                item.viewMode = filterConfiguration.viewMode;
            }
            return item;
        });
    }

    _setSerializableState(state: ISerializableState): Function {
        const filterDescriptions =
            state.$options.filterButtonItems || state.$options.filterButtonSource;
        if (filterDescriptions) {
            state.$options.filterButtonSource = state.$options.filterButtonItems =
                FilterControllerClass._prepareFilterDescription(filterDescriptions);
        }
        const fromSerializableMixin = super._setSerializableState(state);
        return function (): void {
            fromSerializableMixin.call(this);
        };
    }

    private static _getFilterDescriptionForHistory(
        filterDescription: IFilterItem[]
    ): IFilterItem[] {
        return filterDescription.filter((item) => {
            return !item.doNotSaveToHistory;
        });
    }

    private static _isNeedPrepareFilterDescription(filterDescription: IFilterItem[]): boolean {
        return (
            Array.isArray(filterDescription) &&
            filterDescription.some((filterItem) => {
                return FilterControllerClass._isNeedPrepareFilterItem(filterItem);
            })
        );
    }

    private static _prepareFilterDescription(filterDescription: IFilterItem[]): IFilterItem[] {
        if (FilterControllerClass._isNeedPrepareFilterDescription(filterDescription)) {
            const preparedFilterDescription = [];

            filterDescription.forEach((filterItem) => {
                if (FilterControllerClass._isNeedPrepareFilterItem(filterItem)) {
                    // делаем поверхностное клонирование, чтобы сохранить ссылку на items
                    const newFilterItem = object.clonePlain(filterItem, {processCloneable: false});
                    newFilterItem.editorOptions.sourceController = new SourceController({
                        ...filterItem.editorOptions,
                        items: filterItem.editorOptions.items,
                    });
                    preparedFilterDescription.push(newFilterItem);
                } else {
                    preparedFilterDescription.push(filterItem);
                }
            });

            return preparedFilterDescription;
        } else {
            return filterDescription;
        }
    }

    private static _isNeedPrepareFilterItem({
        editorOptions,
        editorTemplateName,
        type,
    }: IFilterItem): boolean {
        const loadByType =
            FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD.includes(editorTemplateName) || type === 'list';
        return !!(
            editorOptions &&
            loadByType &&
            editorOptions.source &&
            !editorOptions.sourceController
        );
    }

    private static _getFilterButtonItems(filterSource: IFilterItem[]): IFilterItem[] {
        return FilterControllerClass._getItemsByOption(filterSource, []);
    }

    private static _minimizeItem(item: IFilterItem): IFilterItem {
        const textValue = getPropValue(item, 'textValue');
        // Two case of saving filter in history
        // 1 case - need to hide textValue in line near button, but save value in history
        // 2 case - need to hide textValue in line near button and not save value in history
        // if textValue is empty string (''), save filter in history
        // if textValue is null, do not save
        const isNeedSaveHistory = textValue !== undefined && textValue !== null;
        const visibility =
            !isNeedSaveHistory && getPropValue(item, 'visibility')
                ? false
                : getPropValue(item, 'visibility');
        const minimizedItem = {} as IFilterItem;
        const value = getPropValue(item, 'value');
        const isNeedSaveValue =
            getPropValue(item, 'resetValue') !== undefined
                ? !isEqual(value, getPropValue(item, 'resetValue')) && isNeedSaveHistory
                : true;

        if (
            visibility !== undefined &&
            (!item.editorTemplateName || item.filterVisibilityCallback)
        ) {
            minimizedItem.visibility = visibility;
        }

        if (isNeedSaveValue && value !== undefined) {
            minimizedItem.value = value;
        }

        if (visibility !== false && textValue !== getPropValue(item, 'resetTextValue')) {
            if (isEqual(value, getPropValue(item, 'resetValue'))) {
                minimizedItem.textValue = '';
            } else {
                minimizedItem.textValue = getPropValue(item, 'textValue');
            }
        }

        if (getPropValue(item, 'id')) {
            minimizedItem.id = getPropValue(item, 'id');
        } else {
            minimizedItem.name = getPropValue(item, 'name');
            minimizedItem.viewMode = getPropValue(item, 'viewMode');
        }

        if (getPropValue(item, 'historyId')) {
            minimizedItem.historyId = getPropValue(item, 'historyId');
        }

        if (getPropValue(item, 'textValueVisible') !== undefined) {
            minimizedItem.textValueVisible = getPropValue(item, 'textValueVisible');
        }
        return minimizedItem;
    }

    private static _deleteFromHistory(item: Model, historyId: string): void {
        getHistorySource({ historyId }).destroy(item.getKey(), {
            $_history: true,
        });
    }

    // Возвращает итемы смерженнные с историей.
    private static _getItemsByOption(
        option: IFilterItem[] | Function,
        history?: IFilterItem[],
        filterFromUrl?: IFilterItem[]
    ): IFilterItem[] {
        let result;

        if (option) {
            if (typeof option === 'function') {
                result = option(history);
            } else if (filterFromUrl) {
                result = mergeSource(FilterControllerClass._cloneItems(option), filterFromUrl);
            } else if (history) {
                result = mergeSource(FilterControllerClass._cloneItems(option), history);
            } else {
                result = FilterControllerClass._cloneItems(option);
            }
        }

        return result;
    }

    private static _cloneItems(items: IFilterItem[] | RecordSet<IFilterItem>): IFilterItem[] {
        let resultItems;

        if (items['[Types/_entity/CloneableMixin]']) {
            resultItems = (items as RecordSet<IFilterItem>).clone();
        } else {
            resultItems = [];
            items.forEach((item) => {
                resultItems.push({ ...item });
            });
        }
        return resultItems;
    }

    // Методы добавлены для совместимости, чтобы не сломался код у прикладных программистов,
    // которые используют статический метод getCalculatedFilter у Controls/filter:Controller
    // будет исправлено по задаче https://online.sbis.ru/opendoc.html?guid=8bd01598-d6cd-4581-ae3a-2a6915b34b79
    static getCalculatedFilter(cfg: object): Promise<any> {
        return new FilterControllerClass({}).getCalculatedFilter(cfg);
    }

    static updateFilterHistory(cfg: object): Promise<any> {
        return new FilterControllerClass({}).saveFilterToHistory(cfg);
    }
}

function getCalculatedFilter(config: object) {
    const def = new Deferred();
    this._resolveHistoryItems(config)
        .then((items) => {
            const filterDescription = config.filterDescription || config.filterButtonSource;
            const filterFromUrl = this._getFilterFromUrl(filterDescription);
            this._setFilterDescription(clone(filterDescription), items, filterFromUrl);
            let calculatedFilter;
            try {
                calculatedFilter = getFilterByFilterDescription(
                    config.filter,
                    this._$filterButtonItems
                );

                if (config.prefetchParams && config.historyId) {
                    const history = this._findItemInHistory(
                        config.historyId,
                        this._$filterButtonItems,
                        config.prefetchParams,
                        config.historySaveMode
                    );

                    if (history && !this._getPrefetch().needInvalidatePrefetch(history.data)) {
                        calculatedFilter = this._applyPrefetchFromHistoryIfNeed(
                            calculatedFilter,
                            history.data,
                            config
                        );
                    }
                    calculatedFilter = this._preparePrefetchFilter(calculatedFilter, config);
                }
            } catch (err) {
                def.errback(err);
                throw err;
            }
            def.callback({
                filter: calculatedFilter,
                historyItems: items,
                filterButtonItems: this._$filterButtonItems,
            });
            return items;
        })
        .addErrback((err) => {
            def.errback(err);
            return err;
        });
    return def;
}

function saveFilterToHistory(config: object) {
    if (!config.historyId) {
        throw new Error('Controls/filter/Controller::historyId is required');
    }
    return this._addToHistory(
        config.filterButtonItems,
        config.historyId,
        config.prefetchParams,
        config.historySaveMode
    );
}

Object.assign(FilterControllerClass.prototype, {
    _moduleName: 'Controls/filter:ControllerClass',
});
