import { IAbstractListDataFactoryLoadResult } from './interface/factory/IAbstractListDataFactoryLoadResult';
import { IAbstractListDataFactoryArguments } from './interface/factory/IAbstractListDataFactoryArguments';
import { IAbstractListState } from './interface/IAbstractListState';

import initCoreState, { getDebugCookie } from './initializers/core';
import initActionsState from './initializers/actions';
import initOperationPanelState from './initializers/operationPanel';
import initSelectionState from './initializers/selection';
import initHierarchyState from './initializers/hierarchy';
import initMarkerState from './initializers/marker';
import initItemsState from './initializers/items';
import initFilterState from './initializers/filter';
import initFilterPanelState from './initializers/filterPanel';
import initErrorState from './initializers/error';
import initSortingState from './initializers/sorting';
import initSearchState from './initializers/search';
import initHighlightState from './initializers/highlight';
import initColumnsState, { resolveColumnsStateSync } from './initializers/columns';
import initTileState from './initializers/tile';

const CORE_INIT_API = {
    getDebugCookie,
} as const;

const COLUMNS_INIT_API = {
    resolveColumnsStateSync,
} as const;

/**
 * Класс отвечает за инициализацию первичного состояния интерактора.
 * Состояние инициализируется по частям, в соответствии с функциональностями интерактора.
 * Части состояния могут зависеть от других частей общего состояния,
 * это нормальный сценарий и поддерживается на уровне класса.
 * Части состояния инициализируются единожды, внутри используется механизм кеширования.
 */
export class Initializer {
    private _results: Map<string, object> = new Map();
    private readonly _loadResult: IAbstractListDataFactoryLoadResult;
    private readonly _config: IAbstractListDataFactoryArguments;

    /**
     * Конструктор класса.
     * Класс не поддерживает создание экземпляра извне.
     * Работа с классом производится с помощью статического метода.
     * @param loadResult Результат загрузки фабрики данных списка
     * @param config Аргументы фабрики данных списка
     * @protected
     */
    protected constructor(
        loadResult: IAbstractListDataFactoryLoadResult,
        config: IAbstractListDataFactoryArguments
    ) {
        this._loadResult = loadResult;
        this._config = config;
    }

    getCoreState() {
        return this._cacheState('core', initCoreState);
    }

    getSelectionState() {
        return this._cacheState('selection', initSelectionState);
    }

    getOperationPanelState() {
        return this._cacheState('operationPanel', initOperationPanelState);
    }

    getHierarchyState() {
        return this._cacheState('hierarchy', initHierarchyState);
    }

    getActionsState() {
        return this._cacheState('actions', initActionsState);
    }

    getMarkerState() {
        return this._cacheState('marker', initMarkerState);
    }

    getItemsState() {
        return this._cacheState('items', initItemsState);
    }

    getFilterState() {
        return this._cacheState('filter', initFilterState);
    }

    getFilterPanelState() {
        return this._cacheState('filterPanel', initFilterPanelState);
    }

    getErrorState() {
        return this._cacheState('error', initErrorState);
    }

    getSortingState() {
        return this._cacheState('sorting', initSortingState);
    }

    getSearchState() {
        return this._cacheState('search', initSearchState);
    }

    getHighlightState() {
        return this._cacheState('highlight', initHighlightState);
    }

    getColumnsState() {
        return this._cacheState('columns', initColumnsState);
    }

    getTileState() {
        return this._cacheState('tile', initTileState);
    }

    destroy() {
        this._results.clear();
    }

    private _cacheState<
        T extends (
            initializer: Initializer,
            loadResult: IAbstractListDataFactoryLoadResult,
            config: IAbstractListDataFactoryArguments
        ) => object,
    >(name: string, getter: T): ReturnType<T> {
        if (!this._results.has(name)) {
            this._results.set(name, getter(this, this._loadResult, this._config));
        }

        return this._results.get(name) as ReturnType<T>;
    }

    static core = CORE_INIT_API;
    static columns = COLUMNS_INIT_API;

    static getState(
        loadResult: IAbstractListDataFactoryLoadResult,
        config: IAbstractListDataFactoryArguments
    ): IAbstractListState {
        const stateInitializer = new Initializer(loadResult, config);

        const state: IAbstractListState = {
            ...stateInitializer.getCoreState(),

            ...stateInitializer.getSelectionState(),
            ...stateInitializer.getOperationPanelState(),
            ...stateInitializer.getHierarchyState(),
            ...stateInitializer.getActionsState(),
            ...stateInitializer.getMarkerState(),
            ...stateInitializer.getItemsState(),
            ...stateInitializer.getFilterState(),
            ...stateInitializer.getFilterPanelState(),
            ...stateInitializer.getErrorState(),
            ...stateInitializer.getSortingState(),
            ...stateInitializer.getSearchState(),
            ...stateInitializer.getHighlightState(),
            ...stateInitializer.getColumnsState(),
            ...stateInitializer.getTileState(),

            viewMode: config.viewMode || loadResult.viewMode,
            needShowStub: false,
        };

        stateInitializer.destroy();

        return state;
    }
}
