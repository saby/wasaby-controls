/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListSavedState } from 'Controls/dataSource';
import type { IBaseSourceConfig, INavigationSourceConfig } from 'Controls/interface';
import type { IListState } from '../../interface/IListState';
import type { CrudEntityKey } from 'Types/source';
import type { IReloadItemOptions } from 'Controls/listCommands';
import type { source } from '../types';

// FIXME: Типы действий описаны только чтобы собралась дока,
//  т.к. сами действия не те, что должны быть.
/**
 * Конструктор действия setSavedSourceState
 */
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

/**
 * Конструктор действия updateSavedState
 */
export const updateSavedState = (): source.TUpdateSavedSourceStateAction => ({
    type: 'updateSavedSourceState',
    payload: {},
});

/**
 * Конструктор действия reload
 */
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

/**
 * Конструктор действия newItemsReceived
 */
export const newItemsReceived = (
    payload: source.TNewItemsReceivedAction['payload']
): source.TNewItemsReceivedAction => ({
    type: 'newItemsReceived',
    payload,
});

/**
 * Конструктор действия complexUpdateSource
 */
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

/**
 * Конструктор действия load
 */
export const load = (sourceConfig?: IBaseSourceConfig): source.TLoadAction => ({
    type: 'load',
    payload: { sourceConfig },
});

/**
 * Конструктор действия oldSliceLoad
 */
export const oldSliceLoad = (
    payload: source.TOldSliceLoadAction['payload']
): source.TOldSliceLoadAction => ({
    type: 'oldSliceLoad',
    payload,
});

/**
 * Конструктор действия dataLoadedSuccess
 */
export const dataLoadedSuccess = (
    payload: source.TDataLoadedSuccessAction['payload']
): source.TDataLoadedSuccessAction => ({
    type: 'dataLoadedSuccess',
    payload,
});

/**
 * Конструктор действия fetch
 */
export const fetch = (): source.TFetchAction => ({
    type: 'fetch',
    payload: {},
});

/**
 * Конструктор действия requestFetch
 */
export const requestFetch = (): source.TRequestFetchAction => ({
    type: 'requestFetch',
    payload: {},
});

/**
 * Конструктор действия initSource
 */
export const initSource = (): source.TInitSourceAction => ({
    type: 'initSource',
    payload: {},
});

/**
 * Конструктор действия awaitAllRequests
 */
export const awaitAllRequests = (): source.TAwaitAllRequests => ({
    type: 'awaitAllRequests',
    payload: {},
});

/**
 * Конструктор действия loadOnSourceController
 */
export const loadOnSourceController = (
    payload: source.TLoadOnSourceControllerAction['payload']
): source.TLoadOnSourceControllerAction => ({
    type: 'loadOnSourceController',
    payload,
});

/**
 * Конструктор действия reloadOnSourceController
 */
export const reloadOnSourceController = (
    payload: source.TReloadOnSourceControllerAction['payload']
): source.TReloadOnSourceControllerAction => ({
    type: 'reloadOnSourceController',
    payload: {
        ...payload,
        isFirstLoad: !!payload.isFirstLoad,
    },
});

/**
 * Конструктор действия loadNodes
 */
export const loadNodes = (
    payload: source.TLoadNodesAction['payload']
): source.TLoadNodesAction => ({
    type: 'loadNodes',
    payload,
});

/**
 * Конструктор действия loadToDirectionOld
 */
export const loadToDirectionOld = (
    payload: source.TLoadToDirectionOldAction['payload']
): source.TLoadToDirectionOldAction => ({
    type: 'loadToDirectionOld',
    payload,
});

/**
 * Конструктор действия loadToDirectionNew
 */
export const loadToDirectionNew = (
    payload: source.TLoadToDirectionNewAction['payload']
): source.TLoadToDirectionNewAction => ({
    type: 'loadToDirectionNew',
    payload,
});

/**
 * Конструктор действия setPreloadedItems
 */
export const setPreloadedItems = (
    payload: source.TSetPreloadedItemsAction['payload']
): source.TSetPreloadedItemsAction => ({
    type: 'setPreloadedItems',
    payload,
});

/**
 * Конструктор действия resolveStateAfterUpdateItems
 */
export const resolveStateAfterUpdateItems = (
    payload: source.TResolveStateAfterUpdateItemsAction['payload']
): source.TResolveStateAfterUpdateItemsAction => ({
    type: 'resolveStateAfterUpdateItems',
    payload,
});

/**
 * Конструктор действия reloadItem
 */
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

/**
 * Конструктор действия reloadItems
 */
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
