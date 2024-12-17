/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import { resolveSearchViewMode } from 'Controls/_dataFactory/List/utils';
import { TLoadResult } from 'Controls/_dataFactory/List/Slice';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';

import { SnapshotName } from '../types/SnapshotName';
import { ISnapshotsStore } from '../types/ISnapshotsStore';

import { TMiddlewaresPropsForMigrationToDispatcher } from '../actions/beforeApplyState';
import * as sourceActions from '../actions/source';

import { isViewModeLoaded, loadViewModeFn } from './_loadViewMode';
import { getSourceControllerOptions } from 'Controls/_dataFactory/ListWebInitializer/source';
import { getDecomposedPromise } from '../../helpers/DecomposedPromise';

async function getFilterResolver() {
    const { FilterResolver } = await loadAsync<typeof import('Controls/search')>('Controls/search');
    return FilterResolver;
}

async function search(
    currentState: IListState,
    nextState: IListState = currentState,
    value: string,
    props: TMiddlewaresPropsForMigrationToDispatcher,
    snapshots: ISnapshotsStore,
    dispatch: Function
): Promise<unknown> {
    const FilterResolver = await getFilterResolver();

    let searchValue = value;
    if (currentState.searchValueTrim) {
        searchValue = value && value.trim();
    }
    if (!currentState.searchValue) {
        snapshots.set(SnapshotName.BeforeSearch, {
            ...snapshots.get(SnapshotName.BeforeSearch),
            root: undefined,
            hasHierarchyFilter: FilterResolver.hasHierarchyFilter(nextState.filter),
            hasRootInFilter: nextState.filter.hasOwnProperty(currentState.parentProperty),
        });
    }
    const { sourceController, viewMode, parentProperty } = nextState;
    const searchViewMode = resolveSearchViewMode(nextState.adaptiveSearchMode, viewMode);
    const breadCrumbsItems =
        snapshots.get(SnapshotName.BeforeShowOnlySelected)?.breadCrumbsItems ||
        nextState.breadCrumbsItems;
    const rootForSearch = FilterResolver.getRootForSearch(
        breadCrumbsItems,
        nextState.root,
        parentProperty,
        nextState.searchStartingWith
    );
    if (viewMode !== searchViewMode) {
        const currentRoot = props.sliceProperties.sourceController.getRoot();

        if (currentRoot !== rootForSearch) {
            snapshots.set(SnapshotName.BeforeSearch, {
                hasHierarchyFilter: false,
                hasRootInFilter: false,
                ...snapshots.get(SnapshotName.BeforeSearch),
                root: currentRoot,
            });
        }
        props.sliceProperties.previousViewMode = viewMode;
    }
    const filterForSearch = FilterResolver.getFilterForSearch(
        {
            filter: nextState.filter,
            root: nextState.root,
            deepReload: nextState.deepReload,
            parentProperty: nextState.parentProperty,
            searchParam: nextState.searchParam,
            searchStartingWith: nextState.searchStartingWith,
            breadCrumbsItems,
            sourceController: nextState.sourceController,
        },
        searchValue,
        snapshots.get(SnapshotName.BeforeSearch)?.root
    );
    if (!nextState.deepReload && !sourceController?.isExpandAll()) {
        sourceController?.setExpandedItems([]);
    }
    const dPromise = getDecomposedPromise();

    await dispatch(
        sourceActions.oldSliceLoad({
            state: nextState,
            key: rootForSearch,
            filter: filterForSearch,
            addItemsAfterLoad: false,
            onResolve: dPromise.resolve,
            onReject: dPromise.reject,
        })
    );

    const promises = [dPromise.promise];

    if (!isViewModeLoaded(currentState, searchViewMode)) {
        promises.push(loadViewModeFn(currentState, searchViewMode));
    }

    const [items] = await Promise.all(promises);

    return {
        items,
        root: rootForSearch,
        searchValue: FilterResolver.needChangeSearchValueToSwitchedString(items)
            ? FilterResolver.getSwitcherStrFromData(items)
            : searchValue,
    };
}

async function resetSearch(
    currentState: IListState,
    nextState: IListState,
    props: TMiddlewaresPropsForMigrationToDispatcher,
    snapshots: ISnapshotsStore,
    dispatch: Function
): Promise<TLoadResult> {
    const FilterResolver = await getFilterResolver();

    const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
    const filter = FilterResolver.getResetSearchFilter(
        nextState.filter,
        // FIXME: Types
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        nextState.searchParam,
        nextState.parentProperty,
        !beforeSearchSnapshot?.hasHierarchyFilter,
        !beforeSearchSnapshot?.hasRootInFilter
    );

    if (beforeSearchSnapshot?.root !== undefined && currentState.parentProperty) {
        props.sliceProperties.sourceController?.setRoot(beforeSearchSnapshot.root);
    }
    nextState.sourceController?.setFilter(filter);
    const sourceControllerOptions = getSourceControllerOptions(nextState);
    nextState.sourceController?.updateOptions({
        ...sourceControllerOptions,
        root: nextState.sourceController.getRoot(),
        filter,
    });

    const dReloadPromise = getDecomposedPromise<TLoadResult>();

    await dispatch(
        sourceActions.reloadOnSourceController({
            sourceController: (nextState || currentState).sourceController,
            addItemsAfterLoad: false,
            onResolve: dReloadPromise.resolve,
            onReject: dReloadPromise.reject,
        })
    );

    return dReloadPromise.promise;
}

function getStateOnSearchReset(state: IListState, snapshots: ISnapshotsStore): Partial<IListState> {
    const beforeSearchSnapshot = snapshots.get(SnapshotName.BeforeSearch);
    return {
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
    } as Partial<IListState>;
}

export { search, resetSearch, getStateOnSearchReset };
