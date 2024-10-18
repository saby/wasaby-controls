/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListSavedState } from 'Controls/dataSource';
import type { IBaseSourceConfig, INavigationSourceConfig } from 'Controls/interface';
import type { IListState } from '../../interface/IListState';
import type { CrudEntityKey } from 'Types/source';
import type { IReloadItemOptions } from 'Controls/listCommands';
import type { source } from '../types';

export const setSavedSourceState = (
    id: string,
    state: Partial<IListSavedState>
): source.TSetSavedSourceStateAction => ({
    type: 'setSavedSourceState',
    payload: {
        id,
        state,
    },
});

export const updateSavedState = (): source.TUpdateSavedSourceStateAction => ({
    type: 'updateSavedSourceState',
    payload: {},
});

export const reload = (
    sourceConfig?: INavigationSourceConfig,
    keepNavigation?: boolean,
    onResolve?: Function,
    onReject?: Function
): source.TReloadAction => ({
    type: 'reload',
    payload: {
        sourceConfig,
        keepNavigation,
        onResolve,
        onReject,
    },
});

export const newItemsReceived = (
    payload: source.TNewItemsReceivedAction['payload']
): source.TNewItemsReceivedAction => ({
    type: 'newItemsReceived',
    payload,
});

export const complexUpdateSource = (
    prevState: IListState,
    nextState: IListState
): source.TComplexUpdateSourceAction => ({
    type: 'complexUpdateSource',
    payload: {
        prevState,
        nextState,
    },
});

export const load = (sourceConfig?: IBaseSourceConfig): source.TLoadAction => ({
    type: 'load',
    payload: { sourceConfig },
});

export const oldSliceLoad = (
    payload: source.TOldSliceLoadAction['payload']
): source.TOldSliceLoadAction => ({
    type: 'oldSliceLoad',
    payload,
});

export const dataLoadedSuccess = (
    payload: source.TDataLoadedSuccessAction['payload']
): source.TDataLoadedSuccessAction => ({
    type: 'dataLoadedSuccess',
    payload,
});

export const fetch = (): source.TFetchAction => ({
    type: 'fetch',
    payload: {},
});

export const requestFetch = (): source.TRequestFetchAction => ({
    type: 'requestFetch',
    payload: {},
});

export const initSource = (): source.TInitSourceAction => ({
    type: 'initSource',
    payload: {},
});

export const awaitAllRequests = (): source.TAwaitAllRequests => ({
    type: 'awaitAllRequests',
    payload: {},
});

export const loadOnSourceController = (
    payload: source.TLoadOnSourceControllerAction['payload']
): source.TLoadOnSourceControllerAction => ({
    type: 'loadOnSourceController',
    payload,
});

export const reloadOnSourceController = (
    payload: source.TReloadOnSourceControllerAction['payload']
): source.TReloadOnSourceControllerAction => ({
    type: 'reloadOnSourceController',
    payload: {
        ...payload,
        isFirstLoad: !!payload.isFirstLoad,
    },
});

export const loadNodes = (
    payload: source.TLoadNodesAction['payload']
): source.TLoadNodesAction => ({
    type: 'loadNodes',
    payload,
});

export const loadToDirectionOld = (
    payload: source.TLoadToDirectionOldAction['payload']
): source.TLoadToDirectionOldAction => ({
    type: 'loadToDirectionOld',
    payload,
});

export const loadToDirectionNew = (
    payload: source.TLoadToDirectionNewAction['payload']
): source.TLoadToDirectionNewAction => ({
    type: 'loadToDirectionNew',
    payload,
});

export const setPreloadedItems = (
    payload: source.TSetPreloadedItemsAction['payload']
): source.TSetPreloadedItemsAction => ({
    type: 'setPreloadedItems',
    payload,
});

export const resolveStateAfterUpdateItems = (
    payload: source.TResolveStateAfterUpdateItemsAction['payload']
): source.TResolveStateAfterUpdateItemsAction => ({
    type: 'resolveStateAfterUpdateItems',
    payload,
});

export const reloadItem = (
    key: CrudEntityKey,
    options?: IReloadItemOptions,
    onResolve?: Function,
    onReject?: Function
): source.TReloadItemAction => ({
    type: 'reloadItem',
    payload: {
        key,
        options,
        onResolve,
        onReject,
    },
});

export const reloadItems = (
    keys: CrudEntityKey[],
    onResolve?: Function,
    onReject?: Function
): source.TReloadItemsAction => ({
    type: 'reloadItems',
    payload: {
        keys,
        onResolve,
        onReject,
    },
});
