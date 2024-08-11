import type { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import type { IListSavedState } from 'Controls/dataSource';
import type { INavigationSourceConfig } from 'Controls/interface';
import type { IListState } from 'Controls/dataFactory';
import type { TAbstractComplexUpdateAction } from '../../AbstractDispatcher/types/TAbstractComplexUpdateAction';

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

export type TLoadAction = TAbstractAction<'load', {}>;

export const load = (): TLoadAction => ({
    type: 'load',
    payload: {},
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

export type TSourceActions =
    | TSetSavedSourceStateAction
    | TUpdateSavedSourceStateAction
    | TReloadAction
    | TComplexUpdateSourceAction
    | TFetchAction
    | TLoadAction
    | TRequestFetchAction
    | TAwaitAllRequests
    | TInitSourceAction;
