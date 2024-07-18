import { IListState } from './List/_interface/IListState';
import { default as loadData, isNeedPrepareFilter } from './List/loadData';
import slice from './List/Slice';
import { IListLoadResult } from './List/_interface/IListLoadResult';
import { IListDataFactoryArguments } from './List/_interface/IListDataFactoryArguments';
import { isEqual } from 'Types/object';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { IFilterItem } from 'Controls/filter';
import {
    type ControllerClass as FilterController,
    type IFilterControllerOptions,
} from 'Controls/filterOld';
import { IListDataFactoryLoadResult } from './_interface/IListDataFactory';
import { IRouter } from 'Router/router';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';

/**
 * Совместимый слайс для старого описания данных списка (с type = 'list')
 * Отличается от стандартного списочного слайса наличием классов контроллеров.
 * @private
 */
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
            compatibleState.historyId = compatibleState.filterController?.getHistoryId();
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

    protected _subscribeOnControllersChanges(
        controllers: Pick<IListState, 'operationsController'>
    ): void {
        super._subscribeOnControllersChanges(controllers);
        if (this._filterController) {
            this._filterController.subscribe(
                'filterSourceChanged',
                this._filterDescriptionChanged,
                this
            );
        }
    }

    protected _unsubscribeFromControllersChanged(
        controllers: Pick<IListState, 'operationsController'>
    ): void {
        super._unsubscribeFromControllersChanged(controllers);
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
            if (isLoaded('Controls/filterOld')) {
                const filterLib =
                    loadSync<typeof import('Controls/filterOld')>('Controls/filterOld');
                this._filterController = new filterLib.ControllerClass(props);
            } else {
                Logger.error(`Метод getConfig, возвращающий объект конфигурации контекста, должен быть синхронным.
                    'Подробнее читайте в статье: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/`);
            }
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

function getFilterController(options: IFilterControllerOptions): FilterController {
    if (options.filterController) {
        return options.filterController;
    }

    const controllerClass =
        loadSync<typeof import('Controls/filterOld')>('Controls/filterOld').ControllerClass;

    return new controllerClass({
        prefetchParams: options.prefetchParams,
        prefetchSessionId: options.prefetchSessionId,
        filter: options.filter,
        useStore: options.useStore,
        filterButtonSource: options.filterButtonSource,
        filterDescription: options.filterDescription,
        historyItems: options.historyItems,
        historyId: options.historyId,
        searchValue: options.searchValue,
        searchParam: options.searchParam,
        minSearchLength: options.minSearchLength,
        parentProperty: options.parentProperty,
        historySaveCallback: options.historySaveCallback,
    });
}

function loadDataCompatible(
    config: IListDataFactoryArguments,
    dependenciesResults: {},
    Router: IRouter,
    _clearResult?: boolean
): Promise<IListDataFactoryLoadResult> {
    return Promise.all([
        loadData(config, dependenciesResults, Router, _clearResult),
        loadAsync('Controls/filterOld'),
    ]).then(([result]) => {
        addPageDeps(['Controls/filterOld']);
        const loadedData = result.data;
        let filterController;

        if (isNeedPrepareFilter(config)) {
            filterController = result.filterController =
                result.filterController ||
                getFilterController({
                    ...config,
                    filterDescription: result.filterDescription,
                } as IFilterControllerOptions);

            if (result.filterButtonSource && !result.filterDescription) {
                filterController.applyFilterDescriptionFromHistory(result.filterButtonSource);
            }
        }

        if (loadedData && filterController) {
            filterController.handleDataLoad(loadedData);

            // ссессия кэша известна только после загрузки данных
            // поэтому и ссессия кэша в фильтр попадает после загрузки
            if (config.prefetchParams) {
                result.sourceController.setFilter(filterController.getFilter());
            }
        }

        // TODO удалить после полного перехода на фильтрацию через слайсы
        // сейчас требуется, чтобы структура фильтра в опциях контроллера совпадала со структурой,
        // которая передаётся в опции Browser'a, иначе при синхронизации может портиться структура в контроллере
        if (typeof config.filterButtonSource !== 'function' && config.task1186685666) {
            filterController.update({
                ...config,
                filterButtonSource: filterController.getFilterButtonItems(),
            } as IFilterControllerOptions);
        }

        if (result.error) {
            // Костыль для совместимости,
            // Обработка ошибок в списках без storeId происходит в старом DataContainer
            result.error.processed = false;
        }

        return {
            ...result,
            type: 'list',
        };
    });
}

export default {
    loadData: loadDataCompatible,
    slice: CompatibleListSlice,
};
