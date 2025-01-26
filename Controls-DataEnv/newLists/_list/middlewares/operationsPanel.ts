/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ISelection, TFilter, IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import { TSelectionCountMode, TSelectionViewMode } from 'Controls-DataEnv/listTypes';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';

import { IListState } from '../interface/IListState';
import { ISnapshotsStore } from '../types/ISnapshotsStore';
import { SnapshotName } from '../types/SnapshotName';
import { getFilterModuleSync } from '../loadData/getFilterModuleSync';
import { TListActions } from '../actions';

/**
 * Функция возвращает объект с отметкой в списке "selection" для выполнения массовых операций над записями.
 * Функция учитывает особенности массовых операций, такие как:
 * - если в списке не установлено отметки, то операция должна применяться к записи, на которой установлен маркер
 * - если применили команду "Отобрать отмеченные" и в списке нет отмеченных записей, то операция должна применяться ко всем отобранным записям
 * */
function getListCommandsSelection(
    nextState: IListState,
    snapshots: ISnapshotsStore
): ISelection | undefined {
    if (isLoaded('Controls/operations')) {
        return loadSync<typeof import('Controls/operations')>(
            'Controls/operations'
        ).getListCommandsSelection(
            { selectedKeys: nextState.selectedKeys, excludedKeys: nextState.excludedKeys },
            nextState.markedKey,
            snapshots.get(SnapshotName.BeforeShowOnlySelected)
        );
    }
}

/**
 * Получение режима отображения по текущему и следующему состоянию
 * */
function getSelectionViewMode(
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
 * Получение нового состояния для выделенных элементов
 * */
function getStateForOnlySelectedItems(
    state: IListState,
    props: TListActions.complexUpdate.TMiddlewaresPropsForMigrationToDispatcher,
    snapshots: ISnapshotsStore
): Partial<IListState> {
    const newState: Record<string, unknown> = {
        breadCrumbsItems: null,
        breadCrumbsItemsWithoutBackButton: null,
        backButtonCaption: '',
        filter: state.filter,
    };

    if (state.searchValue) {
        Object.assign(newState, getStateOnSearchReset(state, snapshots));
        newState.viewMode = props?.sliceProperties?.previousViewMode;
        state.sourceController?.setFilter(newState.filter as TFilter);
    }

    if (state.filterDescription) {
        const { FilterDescription, FilterCalculator } = getFilterModuleSync();

        if (FilterDescription.isFilterDescriptionChanged(state.filterDescription)) {
            newState.filterDescription = state.filterDescription.map((filterItem) => {
                if (!filterItem.doNotSaveToHistory) {
                    return FilterDescription.resetFilterItem({ ...filterItem });
                }
                return filterItem;
            });
            newState.filter = FilterCalculator.getFilterByFilterDescription(
                newState.filter as TFilter,
                newState.filterDescription as IFilterDescriptionItem[]
            );
            state.sourceController?.setFilter(newState.filter as TFilter);
        }
    }

    if (state.count) {
        state.showSelectedCount = state.count;
    }
    state.listCommandsSelection = getListCommandsSelection(state, snapshots);

    return newState as Partial<IListState>;
}

type ICountConfig = Required<IListState>['selectedCountConfig'];

/**
 * Функция загрузки количества выделенных элементов
 * */
function loadCount(
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
 * Функция конфигурации количества выделенных элементов
 * */
function getCountConfig(selectedCountConfig: ICountConfig, filter: TFilter): ICountConfig {
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
 * Получение нового состояния при сбросе поиска
 * */
function getStateOnSearchReset(state: IListState, snapshots: ISnapshotsStore): Partial<IListState> {
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

export {
    getSelectionViewMode,
    getListCommandsSelection,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
    getStateOnSearchReset,
};
