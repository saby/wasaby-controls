import type { TViewMode, TFilter, ISelection } from 'Controls-DataEnv/interface';
import type { IListState, ISnapshotsStore } from 'Controls-DataEnv/list';
import type { TSelectionViewMode, TSelectionCountMode } from 'Controls-DataEnv/listTypes';
import type { TKey } from 'Controls-DataEnv/interface';
import type { Direction } from 'Controls-DataEnv/listTypes';

import { SnapshotName } from 'Controls-DataEnv/list';
import { loadSync, isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import { PromiseCanceledError } from 'Types/entity';
import { getError } from 'Controls-DataEnv/abstractList';
import { getConfigAfterLoadError } from 'Controls-DataEnv/listLoader';

/**
 * Режим отображения поиска
 * */
export type TSearchViewMode = 'search' | 'searchTile';
type ICountConfig = Required<IListState>['selectedCountConfig'];

/**
 * Конфигурация ошибки загрузки
 * @private
 * */
export type TErrorQueryConfig = {
    root?: TKey;
    loadKey?: TKey;
    direction?: Direction;
    action?: () => void;
};

/**
 * Функция вычисляет необходимый к установке режим поиска в зависимости от текущего режима отображения.
 * @param adaptiveSearchMode Режим адаптивного поиска, позволяет отображать результаты поиска в виде "searchTile"
 * при переходе в поиск из режимов "tile" или "composite".
 * @param viewMode Режим отображения, из которого осуществляется переход в поиск.
 */
export function resolveSearchViewMode(
    adaptiveSearchMode: boolean,
    viewMode: TViewMode
): TSearchViewMode {
    const needSearchTileMode =
        viewMode === 'composite' || viewMode === 'tile' || viewMode === 'searchTile';
    return adaptiveSearchMode && needSearchTileMode ? 'searchTile' : 'search';
}

/**
 * Получение нового состояния при сбросе поиска
 * */
export function getStateOnSearchReset(
    state: IListState,
    snapshots: ISnapshotsStore
): Partial<IListState> {
    const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
    return state.filter && state.searchParam && state.parentProperty
        ? ({
              filter: loadSync<typeof import('Controls/search')>(
                  'Controls/search'
              ).FilterResolver.getResetSearchFilter(
                  state.filter,
                  state.searchParam,
                  state.parentProperty,
                  !beforeSearchSnapshot?.hasHierarchyFilter,
                  !beforeSearchSnapshot?.hasRootInFilter
              ),
              searchValue: '',
              searchInputValue: '',
              searchMisspellValue: '',
          } as Partial<IListState>)
        : state;
}

/**
 * Получение режима отображения по текущему и следующему состоянию
 * */
export function getSelectionViewMode(
    currentState: IListState,
    nextState: IListState
): TSelectionViewMode | undefined {
    let selectionViewMode = nextState.selectionViewMode;
    const needCalcSelectionViewMode =
        !isEqual(currentState.selectedKeys, nextState.selectedKeys) ||
        !isEqual(currentState.excludedKeys, nextState.excludedKeys) ||
        currentState.searchValue !== nextState.searchValue ||
        currentState.root !== nextState.root ||
        !isEqual(currentState.expandedItems, nextState.expandedItems);

    if (
        nextState.sourceController &&
        selectionViewMode &&
        needCalcSelectionViewMode &&
        isLoaded('Controls/operations')
    ) {
        selectionViewMode = loadSync<typeof import('Controls/operations')>(
            'Controls/operations'
        ).getSelectionViewMode(selectionViewMode, {
            ...nextState,
            sourceController: nextState.sourceController,
        });
    }

    return selectionViewMode;
}

/**
 * Функция конфигурации количества выделенных элементов
 * */
export function getCountConfig(selectedCountConfig: ICountConfig, filter: TFilter): ICountConfig {
    const data = selectedCountConfig.data || {};
    const selectedFilter = (data as { filter: TFilter }).filter
        ? {
              ...filter,
              ...(
                  data as {
                      filter: TFilter;
                  }
              ).filter,
          }
        : filter;
    return {
        ...selectedCountConfig,
        data: {
            filter: {
                ...selectedFilter,
            },
        },
    };
}

/**
 * Функция загрузки количества выделенных элементов
 * */
export function loadCount(
    selection: ISelection,
    countConfig: ICountConfig,
    selectionCountMode: TSelectionCountMode = 'all',
    recursive?: boolean
): Promise<number | null | void> {
    return loadAsync<typeof import('Controls/operations')>('Controls/operations').then(
        ({ getCount }) => {
            return getCount
                .getCount(selection, countConfig, selectionCountMode, recursive)
                .then((newCount) => {
                    return newCount;
                });
        }
    );
}

/**
 * Получение модифицированного состояния с обработанным состояние ошибки
 * */
export async function getStateAfterLoadError<TState extends IListState = IListState>(
    sliceCurrentState: TState,
    sliceNextState: TState,
    loadError: Error,
    queryConfig: TErrorQueryConfig
): Promise<TState> {
    const isCancelablePromiseError = loadError instanceof PromiseCanceledError;

    if (loadError && !isCancelablePromiseError) {
        // Выводим ошибку в консоль, иначе из-за того, что она произошла в Promise,
        // у которого есть обработка ошибок через catch, никто о ней не узнает
        if (!loadError.hasOwnProperty('httpError')) {
            await getError('LOAD_DATA_ERROR', loadError);
        }

        return getConfigAfterLoadError(sliceNextState, loadError, queryConfig);
    } else {
        return {
            ...sliceNextState,
            loading: isCancelablePromiseError ? sliceCurrentState.loading : sliceNextState.loading,
        };
    }
}
