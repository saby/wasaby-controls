/**
 * Модуль с совместимостью для поиска/фильтра/панели действий
 * слушает события от старых контереров поиска, пишет в слайс, работает с Controls/Store.
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { ListSlice } from 'Controls/dataFactory';
import { TStoreImport, TFilter, TSourceOption, TItemsOrder } from 'Controls/interface';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import * as template from 'wml!Controls/_browserSliced/BrowserSliced/ListEnvCompatible';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { NewSourceController } from 'Controls/dataSource';

interface IListEnvCompatibleProps extends IControlOptions {
    slice: ListSlice;
    useStore?: boolean;
    operationsPanelExpanded?: boolean;
}

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

export default class ListEnvCompatible extends Control<IListEnvCompatibleProps> {
    _storeSubscriptions: string[] = [];
    _template: TemplateFunction = template;

    _afterMount(): void {
        if (this._options.useStore) {
            this._subscribeOnStoreChanges();
            getStore().onPropertyChanged('_contextName', () => {
                this._unsubscribeStoreChanges();
                this._subscribeOnStoreChanges();
            });
        }
    }

    _beforeUnmount(): void {
        if (this._options.useStore) {
            this._unsubscribeStoreChanges();
        }
    }

    _beforeUpdate({ operationsPanelExpanded }: IListEnvCompatibleProps): void {
        if (this._options.operationsPanelExpanded !== operationsPanelExpanded) {
            this._options.slice[
                operationsPanelExpanded ? 'openOperationsPanel' : 'closeOperationsPanel'
            ]();
        }
    }

    _subscribeOnStoreChanges(): void {
        const store = getStore();

        this._storeSubscriptions = [
            store.onPropertyChanged('searchValue', (searchValue) => {
                this._options.slice.setState({
                    searchValue: searchValue as string,
                });
            }),
            store.onPropertyChanged('filter', (filter) => {
                this._options.slice.setState({
                    filter: filter as TFilter,
                });
            }),
            store.onPropertyChanged('selectedType', (type) => {
                this._options.slice.setState({
                    command: type as string,
                });
            }),
            store.onPropertyChanged('operationsPanelExpanded', (value) => {
                this._options.slice[value ? 'openOperationsPanel' : 'closeOperationsPanel']();
            }),
            store.onPropertyChanged('filterSource', (data: unknown) => {
                const sliceState = this._options.slice.state;
                const filterSource = data as IFilterItem[] & {
                    historyId?: string;
                    source?: TSourceOption;
                    sourceController?: NewSourceController;
                };
                if (filterSource || !isEqual(filterSource, sliceState.filterDescription)) {
                    const historyIdFromSource = filterSource.historyId;
                    const sourceFromFilterSource = filterSource.source;
                    const controllerFromFilterSource = filterSource.sourceController;
                    const isSourceDifferent =
                        sourceFromFilterSource !== undefined
                            ? sourceFromFilterSource !== sliceState.source
                            : controllerFromFilterSource &&
                              controllerFromFilterSource !== sliceState.sourceController;
                    delete filterSource.source;
                    delete filterSource.sourceController;

                    if (
                        (historyIdFromSource && historyIdFromSource !== sliceState.historyId) ||
                        isSourceDifferent
                    ) {
                        return;
                    } else {
                        this._options.slice.applyFilterDescription(filterSource);
                    }
                }
            }),
            store.onPropertyChanged('itemsOrderChanged', (itemsOrder) => {
                this._options.slice.setState({
                    itemsOrder: itemsOrder as TItemsOrder | undefined,
                });
            }),
        ];
    }

    _unsubscribeStoreChanges(): void {
        const store = getStore();
        this._storeSubscriptions.forEach((id) => {
            return store.unsubscribe(id);
        });
        this._storeSubscriptions = [];
    }

    protected _search(_e: unknown, value: string): void {
        this._options.slice.search(value);
    }

    protected _searchReset(): void {
        this._options.slice.resetSearch();
    }

    protected _filterItemsChanged(_e: Event, filterDescription: IFilterItem[]): void {
        this._options.slice.applyFilterDescription(filterDescription);
    }
}
