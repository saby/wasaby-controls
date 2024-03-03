/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterOld/Container';
import { default as FilterController } from 'Controls/_filterOld/ControllerClass';
import { IFilterHistoryData, FilterDescription } from 'Controls/filter';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';
import { ListSlice } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import { IListConfigResult } from 'Controls/dataSource';
import { connectToDataContext, IContextValue } from 'Controls/context';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport } from 'Controls/interface';
import { isEqual } from 'Types/object';

export interface IFilterViewContainerOptions extends IControlOptions {
    _dataOptionsValue: any;
    useStore: boolean;
    storeId: string | number;
    preloadedSources?: IListConfigResult[];
    filterNames?: string[];
}

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

// eslint-disable-next-line deprecated-anywhere
/**
 * Контрол используют в качестве контейнера для {@link Controls/filter:View}. Он обеспечивает передачу параметров фильтрации между {@link Controls/browser:Browser} и {@link Controls/filter:View}.
 * Используется в устаревшей схеме связывания через {@link Controls/browser:Browser} (например, в {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/ окнах выбора}).
 * В остальных случаях, чтобы связать фильтры со списком, используйте {@link Controls-ListEnv/filterConnected:View}.
 *
 * @remark
 * Подробнее об организации поиска и фильтрации в реестре читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/#deprecated-c-controlsbrowserbrowser здесь}.
 *
 * @implements Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 * @extends UI/Base:Control
 * @public
 */

/*
 * Special container for {@link Controls/_filter/View}.
 * Listens for child's "itemsChanged" event and notify bubbling event "filterChanged".
 * Receives props from context and pass to {@link Controls/_filter/View}.
 * NOTE: Must be located inside Controls/_filter/Controller.
 *
 * More information you can read <a href='/doc/platform/developmentapl/interface-development/controls/filter-search/'>here</a>.
 *
 * @class Controls/_filter/View/Container
 * @extends UI/Base:Control
 * @author Герасимов А.М.
 *
 * @public
 */

const COMPATIBLE_TYPE_TO_INTERFACE = {
    list: '[IListSlice]',
};

function getStoreData(
    state: Record<string, object>,
    storeId: string | string[],
    firstOfType?: string
): object | Record<string, object> {
    if (storeId instanceof Array) {
        const result = {};
        Object.entries(state).forEach(([key, value]) => {
            if (storeId.includes(key)) {
                result[key] = value;
            }
        });
        return result;
    } else if (storeId !== null && storeId !== undefined) {
        return state[storeId];
    } else if (firstOfType) {
        return Object.values(state).find((value) => {
            return value?.[COMPATIBLE_TYPE_TO_INTERFACE[firstOfType]];
        });
    }
}

class Container extends Control<IFilterViewContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _source: IFilterItem[];
    protected _slice: ListSlice;
    protected _historyId: string;
    private _storeCtxCallbackId: string;
    private _sourceChangedCallbackId: string;
    protected _filterController: FilterController;

    protected _getFilterController(
        dataOptions: IContextValue,
        key: string | number
    ): FilterController {
        return getStoreData<Record<string, ListSlice>>(dataOptions, key, 'list')?.filterController;
    }

    protected _getSlice(options: IFilterViewContainerOptions): ListSlice {
        return options._dataOptionsValue[options.storeId];
    }

    protected _beforeMount(options: IFilterViewContainerOptions): void {
        if (options.storeId) {
            this._slice = this._getSlice(options);
            this._source = this._slice.state.filterDescription;
            this._historyId = this._slice.state.historyId;
        } else {
            if (options.preloadedSources) {
                this._initCompatible(options.filterNames, options.preloadedSources);
            } else if (options.useStore) {
                this._filterController = this._getFilterController(
                    options._dataOptionsValue,
                    options.storeId
                );
                if (this._filterController) {
                    this._initFilterSource(options.filterNames);
                }
            }
        }
    }

    protected _beforeUpdate(options: IFilterViewContainerOptions): void {
        if (options.storeId) {
            if (
                this._options._dataOptionsValue !== options._dataOptionsValue ||
                this._options.storeId !== options.storeId
            ) {
                this._slice = this._getSlice(options);
                if (this._slice) {
                    this._source = this._slice.filterDescription;
                    this._historyId = this._slice.historyId;
                }
            }
        } else {
            if (options.preloadedSources) {
                this._initCompatible(
                    options.filterNames,
                    options.preloadedSources,
                    this._options.filterNames,
                    this._options.preloadedSources
                );
                if (!isEqual(options.filterNames, this._options.filterNames)) {
                    this._source = this._getFilterSourceByNames(this._source, options.filterNames);
                }
            } else if (options.useStore) {
                this._filterController = this._getFilterController(
                    options._dataOptionsValue,
                    options.storeId
                );
                if (this._filterController) {
                    this._initFilterSource(options.filterNames);
                }
            }
        }
    }

    protected _afterMount(options: IFilterViewContainerOptions): void {
        if (options.useStore) {
            this._createNewStoreObserver();
            this._storeCtxCallbackId = getStore().onPropertyChanged(
                '_contextName',
                () => {
                    this._createNewStoreObserver();
                },
                true
            );
        }
    }

    protected _beforeUnmount(): void {
        if (this._sourceChangedCallbackId) {
            getStore().unsubscribe(this._sourceChangedCallbackId);
        }
        if (this._storeCtxCallbackId) {
            getStore().unsubscribe(this._storeCtxCallbackId);
        }
    }

    protected _itemsChanged(event: Event, items: IFilterItem[]): void {
        event.stopPropagation();

        if (this._options.storeId) {
            this._slice.applyFilterDescription(items);
        } else if (this._options.useStore) {
            getStore().dispatch(
                'filterSource',
                items ? [...this._getFilterSourceByNames(items, this._options.filterNames)] : []
            );
        } else {
            this._notify('filterItemsChanged', [items], { bubbling: true });
        }
    }

    protected _filterChanged(event: Event): void {
        event.stopPropagation();
    }

    protected _historyApply(event: Event, history: IFilterHistoryData | IFilterItem[]): void {
        if (!this._options.storeId) {
            this._notify('filterHistoryApply', [history], { bubbling: true });
        }
    }

    private _initFilterSource(filterNames: string[]): void {
        const filterControllerItems = this._filterController.getFilterButtonItems();
        this._source = this._getFilterSourceByNames(filterControllerItems, filterNames);
    }

    private _createNewStoreObserver(): void {
        if (this._sourceChangedCallbackId) {
            getStore().unsubscribe(this._sourceChangedCallbackId);
        }

        this._sourceChangedCallbackId = getStore().onPropertyChanged(
            'filterSource',
            (filterSource: IFilterItem[]) => {
                if (this._options.storeId) {
                    if (this._historyId === filterSource.historyId) {
                        this._slice.applyFilterDescription(filterSource);
                    }
                } else {
                    this._source = this._getFilterSourceByNames(
                        filterSource,
                        this._options.filterNames
                    );
                }
            }
        );
    }

    // TODO CONTEXT SLICE
    private _initCompatible(
        filterNames?: string[],
        newPreloadedSources?: IListConfigResult[],
        oldFilterNames?: string[],
        oldPreloadedSources?: IListConfigResult[]
    ): void {
        if (newPreloadedSources === oldPreloadedSources && isEqual(filterNames, oldFilterNames)) {
            return;
        }
        if (!newPreloadedSources || !newPreloadedSources[0]) {
            this._source = null;
            return;
        }

        const mainSource = newPreloadedSources[0];
        this._historyId = mainSource.historyId;
        // если есть предзагруженные данные в истории, то нужно их подмержить в сурс
        // эта часть аналогична тому что делает _filter/Controller
        let historyItems = mainSource.historyItems;
        if (historyItems) {
            historyItems = historyItems.items || (Array.isArray(historyItems) ? historyItems : []);
        }
        const source = mainSource.filterDescription || mainSource.filterButtonSource;
        const filterFromUrl = FilterDescription.getFilterFromURL(source, mainSource.saveToUrl);
        this._source = this._getSourceByHistory(source, historyItems, filterFromUrl);

        if (!oldPreloadedSources && this._source) {
            this._source = this._getFilterSourceByNames(this._source, filterNames);
            // Изменение поля filterSource слушает Browser.
            // При изменении filterSource Browser вызывает загрузку данных и сохранение истории фильтров.
            // Делаем запись только при инициализации фильтров.

            /* FIXME: historyId нужен для браузера,
               В случае маунта кнопки, браузер может обновляться. dispatch синхронный
               запустит сразу запись в историю, а там будет старый historyId.
               Тоже самое и про source. */
            this._source.historyId = this._historyId;
            this._source.source = mainSource.source;

            getStore().dispatch('filterSource', this._source);
        }
    }

    private _getFilterSourceByNames(source: IFilterItem[], filterNames: string[]): IFilterItem[] {
        return source.filter(({ name }) => {
            return !filterNames || filterNames.includes(name);
        });
    }

    private _getSourceByHistory(
        source: unknown,
        historyItems: IFilterItem[],
        filterFromUrl: IFilterItem[]
    ): IFilterItem[] {
        let result;
        if (source) {
            if (typeof source === 'function') {
                result = source(historyItems);
            } else if (filterFromUrl) {
                result = FilterDescription.mergeFilterDescriptions(
                    this._cloneItems(source),
                    filterFromUrl
                );
            } else if (historyItems) {
                result = FilterDescription.mergeFilterDescriptions(
                    this._cloneItems(source),
                    historyItems
                );
            } else {
                result = this._cloneItems(source);
            }
        }
        return result;
    }

    private _cloneItems(items: IFilterItem[] | RecordSet<IFilterItem>): IFilterItem[] {
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
}

export default connectToDataContext(Container);
