import { IListState } from './List/_interface/IListState';
import loadData from './List/loadData';
import slice from './List/Slice';
import { IListLoadResult } from './List/_interface/IListLoadResult';
import { IListDataFactoryArguments } from './List/_interface/IListDataFactoryArguments';
import { isEqual } from 'Types/object';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import {
    ControllerClass as FilterController,
    IFilterControllerOptions,
    IFilterItem,
} from 'Controls/filter';

class CompatibleListSlice<T extends IListState = IListState> extends slice<T> {
    readonly '[ICompatibleSlice]': boolean = true;
    private _filterController: FilterController;

    protected _initState(loadResult: IListLoadResult, config: IListDataFactoryArguments): T {
        const compatibleState = super._initState(loadResult, config);
        if (compatibleState.filterDescription) {
            compatibleState.filterController =
                config.filterController ||
                this._getFilterController({
                    filterDescription: compatibleState.filterDescription,
                    filterButtonSource: compatibleState.filterDescription,
                    historyId: config.historyId,
                    prefetchParams: config.prefetchParams,
                });
            compatibleState.filterDescription =
                compatibleState.filterController?.getFilterButtonItems();
            compatibleState.historyId = compatibleState.filterController.getHistoryId();
        }
        return compatibleState;
    }

    applyFilterDescription(filterDescription: [], newState?: Partial<IListState>) {
        const filterController = this.state.filterController;
        // this.state.sourceController - пока считаем, что в sourceController'e самый актуальный фильтр
        // это чинит кейс, когда на виджете фильтре установлен storeId, но список обёрнут в Browser.
        // В таком случае Browser может обновить фильтр в sourceController'e,
        // а слайс об этом ничего не узнает и стейте будет неактульный фильтр
        // откатить в 23.1000 тут
        // https://online.sbis.ru/opendoc.html?guid=5f4048af-5b22-4191-8aa3-097adc792a01&client=3
        filterController.setFilter(this.state.sourceController.getFilter());
        const newFilterDescription = filterController.applyFilterDescription(filterDescription);
        const newFilter = filterController.getFilter();

        this.setState({
            filterDescription: newFilterDescription,
            filter: newFilter,
            ...newState,
        });
    }

    resetFilterDescription() {
        this.state.filterController.setFilter(this.state.filter);
        const newFilterDescription = this.state.filterController.resetFilterDescription();
        const newFilter = this.state.filterController.getFilter();
        this.setState({
            filterDescription: newFilterDescription,
            filter: newFilter,
        });
    }

    protected _subscribeOnControllersChanges(): void {
        super._subscribeOnControllersChanges();
        if (this._filterController) {
            this._filterController.subscribe(
                'filterSourceChanged',
                this._filterDescriptionChanged,
                this
            );
        }
    }

    protected _unsubscribeFromControllersChanged(): void {
        super._unsubscribeFromControllersChanged();
        if (this._filterController) {
            this._filterController.unsubscribe(
                'filterSourceChanged',
                this._filterDescriptionChanged,
                this
            );
        }
    }

    private _filterDescriptionChanged(e: unknown, filterDescription: IFilterItem[]): void {
        if (!isEqual(filterDescription, this.state.filterDescription)) {
            this._applyState({ filterDescription });
        }
    }

    private _getFilterController(props: IFilterControllerOptions): FilterController {
        if (!this._filterController) {
            const filterLib = loadSync<typeof import('Controls/filter')>('Controls/filter');
            this._filterController = new filterLib.ControllerClass(props);
        }
        return this._filterController;
    }

    protected _beforeApplyState(nextState: T): Promise<T> | T {
        const filterDetailPanelVisibleChanged =
            nextState.filterDetailPanelVisible !== this.state.filterDetailPanelVisible;
        if (filterDetailPanelVisibleChanged) {
            if (nextState.filterDetailPanelVisible) {
                nextState.filterController.openFilterDetailPanel();
            } else {
                nextState.filterController.closeFilterDetailPanel();
            }
        }
        return super._beforeApplyState(nextState);
    }
}

export default {
    loadData,
    slice: CompatibleListSlice,
};
