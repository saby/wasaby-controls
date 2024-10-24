/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import { ISelection, TFilter } from 'Controls-DataEnv/interface';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import type { ISnapshotsStore } from '../types/ISnapshotsStore';
import { SnapshotName } from '../types/SnapshotName';
import { TSelectionViewMode } from 'Controls/_interface/ISelectionViewMode';
import { isEqual } from 'Types/object';
import { AbstractListSlice } from 'Controls/_dataFactory/AbstractList/AbstractListSlice';
import { TMiddlewaresPropsForMigrationToDispatcher } from 'Controls/_dataFactory/ListWebDispatcher/actions/beforeApplyState';
import { getStateOnSearchReset } from 'Controls/_dataFactory/ListWebDispatcher/middlewares/_search';
import { TSelectionCountMode } from 'Controls/_interface/ISelectionCountMode';

import asyncMiddlewareFactory from '../middlewareFactory/async';

export const operationsPanel = asyncMiddlewareFactory(
    'Controls/listWebReducers:operationsPanel',
    'operationsPanel',
    [
        'openOperationsPanel',
        'closeOperationsPanel',
        'updateOperationsSelection',
        'setSelectionViewMode',
        'resetSelectionViewMode',
        'updateOperationsPanel',
    ]
);

function getListCommandsSelection(
    nextState: IListState,
    snapshots: ISnapshotsStore
): ISelection | undefined {
    if (isLoaded('Controls/operations')) {
        return loadSync<typeof import('Controls/operations')>(
            'Controls/operations'
        ).getListCommandsSelection(
            { selectedKeys: nextState.selectedKeys, excludedKeys: nextState.excludedKeys },
            // @ts-ignore
            nextState.markedKey,
            snapshots.get(SnapshotName.BeforeShowOnlySelected)
        );
    }
}

function getSelectionViewMode(currentState: IListState, nextState: IListState): TSelectionViewMode {
    let selectionViewMode = nextState.selectionViewMode;
    const needCalcSelectionViewMode =
        !isEqual(currentState.selectedKeys, nextState.selectedKeys) ||
        !isEqual(currentState.excludedKeys, nextState.excludedKeys) ||
        currentState.searchValue !== nextState.searchValue ||
        currentState.root !== nextState.root ||
        !isEqual(currentState.expandedItems, nextState.expandedItems);

    if (needCalcSelectionViewMode && isLoaded('Controls/operations')) {
        selectionViewMode = AbstractListSlice.getOperationsModuleSync().getSelectionViewMode(
            selectionViewMode,
            nextState
        );
    }

    return selectionViewMode;
}

function getStateForOnlySelectedItems(
    state: IListState,
    props: TMiddlewaresPropsForMigrationToDispatcher,
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
        newState.viewMode = props.sliceProperties.previousViewMode;
        state.sourceController?.setFilter(newState.filter);
    }

    if (state.filterDescription) {
        const { FilterDescription, FilterCalculator } = AbstractListSlice.getFilterModuleSync();

        if (FilterDescription.isFilterDescriptionChanged(state.filterDescription)) {
            newState.filterDescription = FilterDescription.resetFilterDescription(
                state.filterDescription,
                true
            );
            newState.filter = FilterCalculator.getFilterByFilterDescription(
                newState.filter,
                newState.filterDescription
            );
            state.sourceController?.setFilter(newState.filter);
        }
    }

    if (state.count) {
        state.showSelectedCount = state.count;
    }
    state.listCommandsSelection = getListCommandsSelection(state, snapshots);

    return newState as Partial<IListState>;
}

type ICountConfig = Required<IListState>['selectedCountConfig'];

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

function getCountConfig(selectedCountConfig: ICountConfig, filter: TFilter): ICountConfig {
    const data = selectedCountConfig.data || {};
    const selectedFilter = data.filter ? { ...filter, ...data.filter } : filter;
    return {
        ...selectedCountConfig,
        data: {
            filter: {
                ...selectedFilter,
            },
        },
    };
}

export {
    getSelectionViewMode,
    getListCommandsSelection,
    getCountConfig,
    loadCount,
    getStateForOnlySelectedItems,
};
