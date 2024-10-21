/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import type { IListSavedState } from 'Controls/dataSource';
import type { INavigationSourceConfig } from 'Controls/interface';
import type { IListState } from 'Controls/dataFactory';
import type { TAbstractComplexUpdateAction } from '../../AbstractDispatcher/types/TAbstractComplexUpdateAction';
import type { IBaseSourceConfig } from 'Controls/interface';
import type { Direction, TFilter, TKey } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { IReloadItemOptions } from 'Controls/_listCommands/ReloadItem/IReloadItemOptions';

export type TSetSavedSourceStateAction = TAbstractAction<
    'setSavedSourceState',
    {
        id: string;
        state: IListSavedState;
    }
>;

export const setSavedSourceState = (
    id: string,
    state: Partial<IListSavedState>
): TSetSavedSourceStateAction => ({
    type: 'setSavedSourceState',
    payload: {
        id,
        state,
    },
});

export type TUpdateSavedSourceStateAction = TAbstractAction<'updateSavedSourceState', {}>;

export const updateSavedState = (): TUpdateSavedSourceStateAction => ({
    type: 'updateSavedSourceState',
    payload: {},
});

export type TReloadAction = TAbstractAction<
    'reload',
    {
        sourceConfig?: INavigationSourceConfig;
        keepNavigation?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export const reload = (
    sourceConfig?: INavigationSourceConfig,
    keepNavigation?: boolean,
    onResolve?: Function,
    onReject?: Function
): TReloadAction => ({
    type: 'reload',
    payload: {
        sourceConfig,
        keepNavigation,
        onResolve,
        onReject,
    },
});

export type TNewItemsReceivedAction = TAbstractAction<
    'newItemsReceived',
    {
        nextState?: IListState;
        currentState?: IListState;
        items: RecordSet;
        additionalPromise?: Promise<unknown>;
        itemsDirection?: Direction;
        loadConfig?: { sourceConfig?: IBaseSourceConfig; keepNavigation?: boolean } | null;

        onResolve?: Function;
        onReject?: Function;
    }
>;

export const newItemsReceived = (
    payload: TNewItemsReceivedAction['payload']
): TNewItemsReceivedAction => ({
    type: 'newItemsReceived',
    payload,
});

export type TComplexUpdateSourceAction = TAbstractComplexUpdateAction<'Source'>;
export const complexUpdateSource = (
    prevState: IListState,
    nextState: IListState
): TComplexUpdateSourceAction => ({
    type: 'complexUpdateSource',
    payload: {
        prevState,
        nextState,
    },
});

export type TLoadAction = TAbstractAction<
    'load',
    {
        sourceConfig?: IBaseSourceConfig;
    }
>;

export const load = (sourceConfig?: IBaseSourceConfig): TLoadAction => ({
    type: 'load',
    payload: { sourceConfig },
});

export type TOldSliceLoadAction = TAbstractAction<
    'oldSliceLoad',
    {
        state?: IListState;
        direction?: Direction;
        key?: TKey;
        filter?: TFilter;
        addItemsAfterLoad?: boolean;
        navigationSourceConfig?: IBaseSourceConfig;
        disableSetState?: boolean;

        awaitLoad?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export const oldSliceLoad = (payload: TOldSliceLoadAction['payload']): TOldSliceLoadAction => ({
    type: 'oldSliceLoad',
    payload,
});

export type TDataLoadedSuccessAction = TAbstractAction<
    'dataLoadedSuccess',
    {
        items: RecordSet;
        direction?: Direction;
        key?: TKey;
        nextState: IListState;
        additionalPromise?: Promise<unknown>;
        currentState: IListState;

        onResolve?: Function;
        onReject?: Function;
    }
>;
export const dataLoadedSuccess = (
    payload: TDataLoadedSuccessAction['payload']
): TDataLoadedSuccessAction => ({
    type: 'dataLoadedSuccess',
    payload,
});

export type TFetchAction = TAbstractAction<'fetch', {}>;
export const fetch = (): TFetchAction => ({
    type: 'fetch',
    payload: {},
});

export type TRequestFetchAction = TAbstractAction<'requestFetch', {}>;
export const requestFetch = (): TRequestFetchAction => ({
    type: 'requestFetch',
    payload: {},
});

export type TInitSourceAction = TAbstractAction<'initSource', {}>;
export const initSource = (): TInitSourceAction => ({
    type: 'initSource',
    payload: {},
});

export type TAwaitAllRequests = TAbstractAction<'awaitAllRequests', {}>;
export const awaitAllRequests = (): TAwaitAllRequests => ({
    type: 'awaitAllRequests',
    payload: {},
});

export type TLoadOnSourceControllerAction = TAbstractAction<
    'loadOnSourceController',
    {
        state?: IListState;
        direction?: Direction;
        key?: TKey;
        filter?: TFilter;
        addItemsAfterLoad?: boolean;
        navigationSourceConfig?: IBaseSourceConfig;
        keepNavigation?: boolean;
        useServicePool?: boolean;

        awaitLoad?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;
export const loadOnSourceController = (
    payload: TLoadOnSourceControllerAction['payload']
): TLoadOnSourceControllerAction => ({
    type: 'loadOnSourceController',
    payload,
});

export type TReloadOnSourceControllerAction = TAbstractAction<
    'reloadOnSourceController',
    {
        sourceController: Exclude<IListState['sourceController'], undefined>;
        sourceConfig?: IBaseSourceConfig;
        isFirstLoad?: boolean;
        addItemsAfterLoad?: boolean;
        keepNavigation?: boolean;

        onResolve?: Function;
        onReject?: Function;
    }
>;
export const reloadOnSourceController = (
    payload: TReloadOnSourceControllerAction['payload']
): TReloadOnSourceControllerAction => ({
    type: 'reloadOnSourceController',
    payload: {
        ...payload,
        isFirstLoad: !!payload.isFirstLoad,
    },
});

export type TLoadNodesAction = TAbstractAction<
    'loadNodes',
    {
        keys: TKey[];
        currentState: IListState;
        nextState: IListState;

        awaitLoad?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;
export const loadNodes = (payload: TLoadNodesAction['payload']): TLoadNodesAction => ({
    type: 'loadNodes',
    payload,
});

export type TLoadToDirectionOldAction = TAbstractAction<
    'loadToDirectionOld',
    {
        direction: Direction;
        addItemsAfterLoad?: boolean;
        useServicePool?: boolean;

        retryAction?: () => void;

        onResolve?: Function;
        onReject?: Function;
    }
>;
export const loadToDirectionOld = (
    payload: TLoadToDirectionOldAction['payload']
): TLoadToDirectionOldAction => ({
    type: 'loadToDirectionOld',
    payload,
});

export type TLoadToDirectionNewAction = TAbstractAction<
    'loadToDirectionNew',
    {
        direction: Direction;

        onResolve?: Function;
        onReject?: Function;
    }
>;
export const loadToDirectionNew = (
    payload: TLoadToDirectionNewAction['payload']
): TLoadToDirectionNewAction => ({
    type: 'loadToDirectionNew',
    payload,
});
export type TSetPreloadedItemsAction = TAbstractAction<
    'setPreloadedItems',
    {
        direction?: Direction;
        items: RecordSet;
        onResolve?: Function;
        onReject?: Function;
    }
>;
export const setPreloadedItems = (
    payload: TSetPreloadedItemsAction['payload']
): TSetPreloadedItemsAction => ({
    type: 'setPreloadedItems',
    payload,
});
export type TResolveStateAfterUpdateItemsAction = TAbstractAction<
    'resolveStateAfterUpdateItems',
    {
        currentState: IListState;
        nextState?: IListState;

        resultRef: {
            current: object;
        };
    }
>;
export const resolveStateAfterUpdateItems = (
    payload: TResolveStateAfterUpdateItemsAction['payload']
): TResolveStateAfterUpdateItemsAction => ({
    type: 'resolveStateAfterUpdateItems',
    payload,
});

export type TReloadItemAction = TAbstractAction<
    'reloadItem',
    {
        key: CrudEntityKey;
        options?: IReloadItemOptions;
        onResolve?: Function;
        onReject?: Function;
    }
>;
export const reloadItem = (
    key: CrudEntityKey,
    options?: IReloadItemOptions,
    onResolve?: Function,
    onReject?: Function
): TReloadItemAction => ({
    type: 'reloadItem',
    payload: {
        key,
        options,
        onResolve,
        onReject,
    },
});

export type TReloadItemsAction = TAbstractAction<
    'reloadItems',
    {
        keys: CrudEntityKey[];
        onResolve?: Function;
        onReject?: Function;
    }
>;
export const reloadItems = (
    keys: CrudEntityKey[],
    onResolve?: Function,
    onReject?: Function
): TReloadItemsAction => ({
    type: 'reloadItems',
    payload: {
        keys,
        onResolve,
        onReject,
    },
});

/*
 * ДОКАЗАНО.
 * 1) Экшен при успешной дозагрузке, нотифицирующий прикладника.
 * Сейчас это dataLoadedSuccess, было - dataLoadedInner.
 * 2) Приватный экшен вызова загрузки на sourceController.
 * Сейчас это loadOnSourceController.
 * Все обращения к контроллеру должны быть единичными, т.е. вызываться из уничерсального экшена.
 * */
export type TSourceActions =
    | TSetSavedSourceStateAction
    | TUpdateSavedSourceStateAction
    | TReloadAction
    | TComplexUpdateSourceAction
    | TFetchAction
    | TNewItemsReceivedAction
    | TLoadOnSourceControllerAction
    | TReloadItemAction
    | TReloadItemsAction
    | TReloadOnSourceControllerAction
    | TResolveStateAfterUpdateItemsAction
    | TLoadNodesAction
    | TLoadAction
    | TLoadToDirectionOldAction
    | TLoadToDirectionNewAction
    | TDataLoadedSuccessAction
    | TSetPreloadedItemsAction
    | TOldSliceLoadAction
    | TRequestFetchAction
    | TAwaitAllRequests
    | TInitSourceAction;
