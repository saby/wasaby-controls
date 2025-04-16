import type { IListSavedState } from 'Controls/dataSource';
import type { IBaseSourceConfig, INavigationSourceConfig } from 'Controls-DataEnv/listTypes';
import type { IListState } from '../../interface/IListState';
import type { CrudEntityKey } from 'Types/source';
import type { IReloadItemOptions } from 'Controls/listCommands';
import type { source } from '../types';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';

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
 * Конструктор действия для отмены текущей загрузки
 */
export const rejectLoad = (): source.TRejectLoadAction => ({
    type: 'rejectLoad',
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
 * Конструктор действия loadToDirection
 */
export const loadToDirection = (
    payload: source.TLoadToDirectionAction['payload']
): source.TLoadToDirectionAction => ({
    type: 'loadToDirection',
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

/**
 * Конструктор действия updateHasMoreStorage
 */
export const updateHasMoreStorage = (
    nextState: IListState,
    hasMoreStorage: IHasMoreStorage
): source.TUpdateHasMoreStorageAction => ({
    type: 'updateHasMoreStorage',
    payload: {
        nextState,
        hasMoreStorage,
    },
});
