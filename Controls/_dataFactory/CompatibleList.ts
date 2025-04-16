import { IListLoadResult } from './interface/IListLoadResult';
import { isEqual } from 'Types/object';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { IFilterItem } from 'Controls/filter';
import { Slice as CurrentListSlice, IListState, loadData } from 'Controls-DataEnv/currentList';
import {
    type ControllerClass as FilterController,
    type IFilterControllerOptions,
} from 'Controls/filterOld';
import { IRouter } from 'Router/router';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';
import { ICompatibleListDataFactoryArguments } from './interface/IListDataFactoryCompatible';
import { IListDataFactoryLoadResult } from './interface/IListDataFactory';

interface ICompatibleListLoadResult extends IListLoadResult {
    /**
     * @deprecated настройку фильтров необходимо передавать в поле filterDescription
     */
    filterButtonSource?: IFilterItem[];
}

interface ICompatibleListState extends IListState {
    filterController: FilterController;
}
/**
 * Совместимый слайс для старого описания данных списка (с type = 'list')
 * Отличается от стандартного списочного слайса наличием классов контроллеров.
 * @private
 */
export class CompatibleListSlice<
    T extends IListState = ICompatibleListState,
> extends CurrentListSlice<T> {
    readonly '[ICompatibleSlice]': boolean = true;
    private _filterController: FilterController;

    protected _initState(
        loadResult: ICompatibleListLoadResult,
        config: ICompatibleListDataFactoryArguments
    ): T {
        // Патчинг конфига и результатов загрузки
        // Слайс работает c filterDescription, но при конфигурировании загрузки в старом формате
        // до сих пор задают filterButtonSource
        if (config.filterButtonSource) {
            config.filterDescription = config.filterButtonSource;

            if (loadResult.filterButtonSource) {
                loadResult.filterDescription = loadResult.filterButtonSource;
            }
        }
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

        if (config.isSelectorPopup) {
            Object.assign(
                compatibleState,
                loadSync<typeof import('Controls/lookupPopup')>('Controls/lookupPopup').initState(
                    loadResult,
                    config
                )
            );
        }

        return compatibleState;
    }

    applyFilterDescription(
        filterDescription: IFilterItem[],
        newState?: Partial<IListState>,
        appliedFrom?: string
    ) {
        this._unsubscribe({});
        const filterController = this.state.filterController;
        // this.state.sourceController - пока считаем, что в sourceController'e самый актуальный фильтр
        // это чинит кейс, когда на виджете фильтре установлен storeId, но список обёрнут в Browser.
        // В таком случае Browser может обновить фильтр в sourceController'e,
        // а слайс об этом ничего не узнает и стейте будет неактульный фильтр
        // откатить в 23.1000 тут
        // https://online.sbis.ru/opendoc.html?guid=5f4048af-5b22-4191-8aa3-097adc792a01&client=3
        filterController.setFilter(this.state.sourceController.getFilter());
        const newFilterDescription = filterController.applyFilterDescription(
            filterDescription,
            appliedFrom
        );
        const newFilter = filterController.getFilter();

        this.setState({
            filterDescription: newFilterDescription,
            filter: newFilter,
            ...newState,
        });
        this._subscribe({});
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

    protected _subscribe(state: IListState): void {
        super._subscribe(state);
        if (this._filterController) {
            this._filterController.subscribe(
                'filterSourceChanged',
                this._filterDescriptionChanged,
                this
            );
        }
    }

    protected _unsubscribe(state: IListState): void {
        super._unsubscribe(state);
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

function isNeedPrepareFilter(loadDataConfig: ICompatibleListDataFactoryArguments): boolean {
    return !!(
        loadDataConfig.filterDescription ||
        loadDataConfig.filterButtonSource ||
        loadDataConfig.searchParam
    );
}

function loadDataCompatible(
    config: ICompatibleListDataFactoryArguments,
    dependenciesResults: {},
    Router: IRouter,
    _clearResult?: boolean,
    fabricId?: string
): Promise<IListDataFactoryLoadResult> {
    // Здесь ок, т.к. фабрика compatible и используется при старой конфигурации фабрики и в Browser
    // + чтобы потом не упала ошибка в обычной loadData
    let hasFilterButtonSource = false;
    if (!config.filterDescription && config.filterButtonSource) {
        hasFilterButtonSource = true;
        config.filterDescription = config.filterButtonSource;
    }
    const loadPromises = [
        loadData(config, dependenciesResults, Router, _clearResult, fabricId),
        loadAsync('Controls/filterOld'),
        loadAsync<typeof import('Controls/filter')>('Controls/filter'),
    ];

    if (config.isSelectorPopup) {
        loadPromises.push(loadAsync('Controls/lookupPopup'));
    }
    return Promise.all(loadPromises).then(([result]) => {
        addPageDeps(['Controls/filterOld']);
        const loadedData = result.data;
        let filterController;

        if (isNeedPrepareFilter(config)) {
            const { FilterLoader } = loadSync<typeof import('Controls/filter')>('Controls/filter');

            if (Array.isArray(config.filterDescription)) {
                result.filterDescription = FilterLoader.restoreItemsCallbacks(
                    result.filterDescription,
                    config.filterDescription
                );
            }
            filterController = result.filterController =
                result.filterController ||
                getFilterController({
                    ...config,
                    filterDescription: result.filterDescription,
                } as IFilterControllerOptions);

            if (result.filterButtonSource && !result.filterDescription) {
                filterController.applyFilterDescriptionFromHistory(
                    result.filterButtonSource,
                    undefined,
                    !!result.prefetchParams
                );
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

        // Если задавали filterButtonSource, то его и надо вернуть из загрузки
        // Обращаются из prefetchResult и потом отдают в Browser
        // Перенёс эту логику из loadData чистой в compatibleLoadData
        if (hasFilterButtonSource) {
            result.filterButtonSource = result.filterDescription;
            delete result.filterDescription;
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
    isHandlingTimeoutError: true,
};
