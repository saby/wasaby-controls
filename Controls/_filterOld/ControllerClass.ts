/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import {
    IFilterItem,
    FilterDescription,
    FilterHistory,
    FilterCalculator,
    FilterLoader,
    IPrefetchHistoryParams,
    IPrefetchParams,
    IAdditionalHistoryData,
    IFindHistoryResult,
    IFilterHistoryData,
} from 'Controls/filter';
import { _assignServiceFilters } from '../_search/Utils/FilterUtils';
import { TFilter, TStoreImport } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { FilterSource } from 'Controls/history';

import * as clone from 'Core/core-clone';
import { CrudWrapper } from 'Controls/dataSource';
import { object, mixin } from 'Types/util';
import { isEqual } from 'Types/object';
import {
    ObservableMixin,
    SerializableMixin,
    OptionsToPropertyMixin,
    ISerializableState as IDefaultSerializableState,
} from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Deferred } from 'Types/deferred';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';

export type THistoryData = IFilterHistoryData | IFilterItem[];

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

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

const ACTIVE_HISTORY_FILTER_INDEX = 0;
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
        const filterButtonItems = FilterLoader.initFilterDescriptionFromData(filterDescription);
        const filterFromUrl = FilterDescription.getFilterFromURL(
            filterDescription,
            options.saveToUrl
        );
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

        if (filterButtonItems && FilterLoader.isCallbacksLoaded(filterButtonItems)) {
            FilterDescription.initFilterDescription(
                filterButtonItems,
                FilterCalculator.getFilterByFilterDescription(
                    this._$filter,
                    filterButtonItems
                ) as TFilter,
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
        filterItems = FilterLoader.initFilterDescriptionFromData(
            this._getItemsWithHistory(filterItems, historyItems)
        );

        if (this._options.prefetchParams && historyItems instanceof Array && historyItems.length) {
            this._processHistoryOnItemsChanged(
                historyItems,
                this._options as IFilterControllerOptions
            );
        }
        const filter = FilterCalculator.getFilterByFilterDescription(
            this._applyPrefetchFromHistoryIfNeed(this.getFilter(), historyItems, this._options),
            filterItems
        );
        this._setFilter(filter);
        if (FilterLoader.isCallbacksLoaded(filterItems)) {
            FilterDescription.updateFilterDescription(
                filterItems,
                currentFilter,
                filter,
                (newItems) => {
                    this._setFilterDescription(newItems, null);
                }
            );
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
        return FilterLoader.loadFilterConfiguration(propStorageId).then((userSettings) => {
            if (Array.isArray(userSettings) && userSettings.length) {
                const filterButtonItems = FilterDescription.applyFilterUserHistoryToDescription(
                    this.getFilterButtonItems(),
                    userSettings
                );
                this._setFilterDescription(filterButtonItems);
            }
        });
    }

    update(newOptions: IFilterControllerOptions): void | boolean {
        const filterButtonChanged =
            !this._$filterDescriptionUsed &&
            !isEqual(this._options.filterButtonSource, newOptions.filterButtonSource);
        const newFilter = newOptions.filter;
        const filterChanged = !isEqual(this._options.filter, newFilter);
        const isFilterChangedWithPrefetch = this._isFilterChanged;
        const prefetchSessionIdChanged =
            this._options.prefetchSessionId !== newOptions.prefetchSessionId;
        const prefetchParams = newOptions.prefetchParams;

        if (filterButtonChanged) {
            this._setFilterDescription(
                filterButtonChanged ? newOptions.filterButtonSource : this._$filterButtonItems
            );
            FilterDescription.applyFilterDescriptionToURL(
                this._$filterButtonItems,
                this._options.saveToUrl
            );
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
        if (filterChanged) {
            this._updateFilter(this._options);
        }
        return filterChanged || filterButtonChanged;
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
        const newFilter = FilterCalculator.getFilterByFilterDescription(
            currentFilter,
            this._$filterButtonItems
        ) as TFilter;

        if (!isEqual(currentFilterButtonItems, this._$filterButtonItems)) {
            FilterDescription.updateFilterDescription(
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
        const historyId = this._options.historyId;
        const prefetchParams = this._options.prefetchParams;
        if (historyId) {
            if (this._isFilterChanged) {
                const currentHistory = this._getCurrentHistory();
                this._deleteCurrentFilterFromHistory();
                this._addToHistory(this._$filterButtonItems, historyId, {
                    columns: currentHistory?.data?.columns,
                    prefetchParams: prefetchParams
                        ? this._getPrefetch().getPrefetchParamsForSave(items)
                        : null,
                });
            }

            // Намеренное допущение, что меняем объект по ссылке.
            // Сейчас по-другому не сделать, т.к. контроллер фильтрации находится над
            // контейнером и списком, которые владеют данными.
            // А изменение фильтра вызывает повторный запрос за данными.
            if (prefetchParams) {
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
        FilterDescription.resetFilterDescription(filterItems);
        this.updateFilterItems(filterItems);
    }

    resetFilterDescription(): IFilterItem[] {
        this.resetFilterItems();
        return this._$filterButtonItems;
    }

    reloadFilterItem(filterName: string): void | Promise<RecordSet | Error> {
        return FilterLoader.reloadFilterItem(filterName, this._$filterButtonItems);
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

    private _getPrefetch(): typeof import('Controls-ListEnv/filterPrefetch').Prefetch {
        return loadSync<typeof import('Controls-ListEnv/filterPrefetch')>(PREFETCH_MODULE).Prefetch;
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
    ): TFilter {
        if (prefetchParams) {
            return this._getPrefetch().prepareFilter(filter, prefetchParams, prefetchSessionId);
        }
        return { ...filter };
    }

    private _onFilterItemsChanged(): void {
        FilterDescription.applyFilterDescriptionToURL(
            this._$filterButtonItems,
            this._options.saveToUrl
        );
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
            FilterDescription.mergeFilterDescriptions(this._$filterButtonItems, newItems);
        }
    }

    private _updateFilter(options: Partial<IFilterControllerOptions>): void {
        if (options.searchParam && options.searchValue) {
            this._prepareSearchFilter(this._$filter, options);
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
                !!prefetchParams || isFavoriteSaveMode,
                prefetchParams
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
                    const items = FilterHistory.mergeHistoryParams(historyResult, source);
                    // Для своместимости с прикладным кодом, который использует старый FilterController
                    if (historyResult.items) {
                        resolve({
                            items,
                        });
                    } else {
                        resolve(items);
                    }
                    return res;
                })
                .catch((error) => {
                    error.processed = true;
                    resolve([]);
                    return error;
                });
        });
    }

    private _deleteCurrentFilterFromHistory(): void {
        const history = this._getCurrentHistory();

        if (history) {
            FilterControllerClass._deleteFromHistory(history.item, this._options.historyId);
        }
    }

    private _getCurrentHistory(): IFindHistoryResult | null {
        return this._getHistoryByItems(
            this._options.historyId,
            this._$filterButtonItems,
            this._options.prefetchParams,
            this._options.historySaveMode
        );
    }

    private _getHistoryByItems(
        historyId: string,
        items: IFilterItem[],
        prefetchParams?: IPrefetchParams,
        historySaveMode?: string
    ): IFindHistoryResult | null {
        let result;
        this._updateMeta = undefined;

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

    private _getHistorySource(
        historyId: string,
        filterSource: IFilterItem[],
        favorite?: boolean,
        prefetchParams?: IPrefetchHistoryParams
    ) {
        return FilterHistory.getFilterHistorySource({
            historyId,
            historyIds: FilterHistory.getHistoryIdsFromDescription(filterSource),
            favorite,
            prefetchParams,
        });
    }

    private _findItemInHistory(
        historyId: string,
        items: IFilterItem[],
        prefetchParams?: IPrefetchParams,
        historySaveMode?: string
    ): IFindHistoryResult | void {
        return FilterHistory.findItemInHistory(historyId, items, prefetchParams, historySaveMode);
    }

    private _addToHistory(
        filterButtonItems: IFilterItem[],
        historyId: string,
        additionalHistoryData?: IAdditionalHistoryData,
        historySaveMode?: string
    ): Promise<any> {
        const meta = this._updateMeta;
        const prefetchParams = additionalHistoryData?.prefetchParams;
        const historySource = this._getHistorySource(
            historyId,
            filterButtonItems,
            !!prefetchParams || historySaveMode === 'favorite',
            prefetchParams
        );

        const update = () => {
            return FilterHistory.updateFilterHistory(
                meta,
                historySource,
                filterButtonItems,
                additionalHistoryData,
                this._options.historySaveCallback
            );
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
            !!options.prefetchParams || this._isFavoriteMode(options.historySaveMode),
            options.prefetchParams
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
            const needInvalidate = prefetchParams && prefetch.needInvalidatePrefetch(history.data);

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

    private _applyItemsToFilter(
        filter: TFilter = this._$filter,
        filterButtonItems: IFilterItem[] = this._$filterButtonItems
    ): void {
        this._setFilterAndNotify(
            FilterCalculator.getFilterByFilterDescription(filter, filterButtonItems)
        );
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

    private _setFilter(filter: TFilter): void {
        if (!isEqual(this._$filter, filter)) {
            this._$filter = filter;
        }
    }

    private _setFilterAndNotify(filter: object): void {
        this._setFilter(filter as TFilter);
        this._notify('filterChanged', this._$filter);
    }

    _setSerializableState(state: ISerializableState): Function {
        const filterDescriptions =
            state.$options.filterButtonItems || state.$options.filterButtonSource;
        if (filterDescriptions) {
            state.$options.filterButtonSource = state.$options.filterButtonItems =
                FilterLoader.initFilterDescriptionFromData(filterDescriptions);
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

    private static _getFilterButtonItems(filterSource: IFilterItem[]): IFilterItem[] {
        return FilterControllerClass._getItemsByOption(filterSource, []);
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
                result = FilterDescription.mergeFilterDescriptions(
                    FilterControllerClass._cloneItems(option),
                    filterFromUrl
                );
            } else if (history) {
                result = FilterDescription.mergeFilterDescriptions(
                    FilterControllerClass._cloneItems(option),
                    history
                );
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
    private static _deleteFromHistory(item: Model, historyId: string): void {
        FilterHistory.removeItem(historyId, item.getKey());
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
            const filterFromUrl = FilterDescription.getFilterFromURL(
                filterDescription,
                config.saveToUrl
            );
            this._setFilterDescription(clone(filterDescription), items, filterFromUrl);
            let calculatedFilter;
            try {
                calculatedFilter = FilterCalculator.getFilterByFilterDescription(
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
        throw new Error('Controls/filterOld/Controller::historyId is required');
    }
    return this._addToHistory(
        config.filterButtonItems,
        config.historyId,
        { prefetchParams: config.prefetchParams },
        config.historySaveMode
    );
}

Object.assign(FilterControllerClass.prototype, {
    _moduleName: 'Controls/filterOld:ControllerClass',
});