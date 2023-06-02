/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/View/Container';
import {
    IFilterItem,
    ControllerClass as FilterController,
} from 'Controls/filter';
import { isEqual } from 'Types/object';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { TStoreImport } from 'Controls/interface';

export interface IFilterViewContainerOptions extends IControlOptions {
    _dataOptionsValue: unknown;
    useStore: boolean;
    storeId: string | number;
    filterNames?: string[];
}

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};
/**
 * Контрол используют в качестве контейнера для {@link Controls/filterPanel:View}. Обеспечивает передачу параметров фильтрации между {@link Controls/filter:Controller} и {@link Controls/filterPanel:View}.
 * @class Controls/_filterPanel/View/Container
 * @extends UI/Base:Control
 *
 * @public
 */

export default class Container extends Control<IFilterViewContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _filterController: FilterController;
    protected _source: IFilterItem[];
    private _sourceChangedCallbackId: string;

    protected _getFilterController(
        dataOptions: unknown,
        key: string | number
    ): FilterController {
        return dataOptions.getStoreData(key, 'list')?.filterController;
    }

    protected _beforeMount(options: IFilterViewContainerOptions): void {
        this._filterController = this._getFilterController(
            options._dataOptionsValue,
            options.storeId
        );
        if (this._filterController) {
            this._initFilterSource(options.filterNames);
        }
    }

    protected _beforeUpdate(options: IFilterViewContainerOptions): void {
        if (
            this._options._dataOptionsValue !== options._dataOptionsValue ||
            this._options.storeId !== options.storeId ||
            !isEqual(this._options.filterNames, options.filterNames)
        ) {
            this._filterController = this._getFilterController(
                options._dataOptionsValue,
                options.storeId
            );
            if (this._filterController) {
                this._initFilterSource(options.filterNames);
            }
        }
    }

    protected _afterMount(options: IFilterViewContainerOptions): void {
        if (options.useStore) {
            this._sourceChangedCallbackId = getStore().onPropertyChanged(
                'filterSource',
                (filterSource: IFilterItem[]) => {
                    this._source = this._getFilterSourceByNames(
                        filterSource,
                        this._options.filterNames
                    );
                }
            );
            this._filterController.subscribe(
                'filterSourceChanged',
                this._filterSourceChanged,
                this
            );
        }
    }

    protected _beforeUnmount(): void {
        if (this._sourceChangedCallbackId) {
            getStore().unsubscribe(this._sourceChangedCallbackId);
        }
        this._filterController.unsubscribe(
            'filterSourceChanged',
            this._filterSourceChanged
        );
    }

    private _initFilterSource(filterNames: string[]): void {
        const filterControllerItems =
            this._filterController.getFilterButtonItems();
        this._source = this._getFilterSourceByNames(
            filterControllerItems,
            filterNames
        );
    }

    private _getFilterSourceByNames(
        source: IFilterItem[],
        filterNames: string[]
    ): IFilterItem[] {
        return source.filter(({ name }) => {
            return !filterNames || filterNames.includes(name);
        });
    }

    protected _sourceChanged(event: Event, items: IFilterItem[]): void {
        event.stopPropagation();
        this._filterController.updateFilterItems(items);
    }

    protected _filterSourceChanged(event: Event, items: IFilterItem[]): void {
        if (this._options.useStore) {
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
        }
    }
}
