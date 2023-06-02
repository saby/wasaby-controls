/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filter/View/Container';
import {
    default as FilterController,
    IFilterHistoryData,
} from 'Controls/_filter/ControllerClass';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';
import mergeSource from 'Controls/_filter/Utils/mergeSource';
import { IBrowserSlice } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import { IListConfigResult } from 'Controls/dataSource';
import { IContextValue, IFilterSlice } from 'Controls/context';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport } from 'Controls/interface';

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
/**
 * Контрол используют в качестве контейнера для {@link Controls/filter:View}. Он обеспечивает передачу параметров фильтрации между {@link Controls/browser:Browser} и {@link Controls/filter:View}.
 * @remark
 * Подробнее об организации поиска и фильтрации в реестре читайте {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ здесь}.
 *
 * @class Controls/_filter/View/Container
 * @implements Controls/interface:IStoreId
 * @mixes Controls-ListEnv/filter:IFilterNames
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

class Container extends Control<IFilterViewContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _source: IFilterItem[];
    protected _slice: IBrowserSlice;
    protected _historyId: string;
    private _storeCtxCallbackId: string;
    private _sourceChangedCallbackId: string;
    protected _filterController: FilterController;

    protected _getFilterController(
        dataOptions: IContextValue,
        key: string | number
    ): FilterController {
        return dataOptions.getStoreData<Record<string, IFilterSlice>>(
            key,
            'list'
        )?.filterController;
    }

    protected _getSlice(options: IFilterViewContainerOptions): IBrowserSlice {
        return options._dataOptionsValue[options.storeId];
    }

    protected _beforeMount(options: IFilterViewContainerOptions): void {
        if (options.storeId) {
            this._slice = this._getSlice(options);
            this._source = this._slice.filterDescription;
            this._historyId = this._slice.historyId;
        } else {
            if (options.preloadedSources) {
                this._initCompatible(
                    options.filterNames,
                    options.preloadedSources
                );
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
                    this._options.preloadedSources
                );
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
                items
                    ? [
                          ...this._getFilterSourceByNames(
                              items,
                              this._options.filterNames
                          ),
                      ]
                    : []
            );
        } else {
            this._notify('filterItemsChanged', [items], { bubbling: true });
        }
    }

    protected _filterChanged(event: Event): void {
        event.stopPropagation();
    }

    protected _historyApply(
        event: Event,
        history: IFilterHistoryData | IFilterItem[]
    ): void {
        if (!this._options.storeId) {
            this._notify('filterHistoryApply', [history], { bubbling: true });
        }
    }

    private _initFilterSource(filterNames: string[]): void {
        const filterControllerItems =
            this._filterController.getFilterButtonItems();
        this._source = this._getFilterSourceByNames(
            filterControllerItems,
            filterNames
        );
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
        oldPreloadedSources?: IListConfigResult[]
    ): void {
        if (newPreloadedSources === oldPreloadedSources) {
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
            historyItems =
                historyItems.items ||
                (Array.isArray(historyItems) ? historyItems : []);
        }
        this._source = this._getSourceByHistory(
            mainSource.filterButtonSource,
            historyItems
        );

        if (!oldPreloadedSources && this._source) {
            this._source = this._getFilterSourceByNames(
                this._source,
                filterNames
            );
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

    private _getFilterSourceByNames(
        source: IFilterItem[],
        filterNames: string[]
    ): IFilterItem[] {
        return source.filter(({ name }) => {
            return !filterNames || filterNames.includes(name);
        });
    }

    private _getSourceByHistory(
        source: unknown,
        historyItems: IFilterItem[]
    ): IFilterItem[] {
        let result;
        if (source) {
            if (typeof source === 'function') {
                result = source(historyItems);
            } else if (historyItems) {
                result = mergeSource(this._cloneItems(source), historyItems);
            } else {
                result = this._cloneItems(source);
            }
        }
        return result;
    }

    private _cloneItems(
        items: IFilterItem[] | RecordSet<IFilterItem>
    ): IFilterItem[] {
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

export default Container;
