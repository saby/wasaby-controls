/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type {
    AbstractListSlice,
    IAbstractListAPI,
    IAbstractListState,
} from 'Controls-DataEnv/abstractList';
import { useSlice } from 'Controls-DataEnv/context';

export type TUseViewModelHook<
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
> = (...args: [storeId: string]) => {
    viewModelAPI: TAbstractListAPI | null;
    viewModelState: TAbstractListState | null;
};

export type TViewModelProvidedProps<
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
> = {
    viewModelAPI: TAbstractListAPI;
    viewModelState: TAbstractListState;
};

export function withViewModel<
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
    TOuter extends {
        storeId: string;
    },
>(
    Component: React.ComponentType<
        TOuter & TViewModelProvidedProps<TAbstractListAPI, TAbstractListState>
    >,
    useViewModelHook: TUseViewModelHook<TAbstractListAPI, TAbstractListState>
) {
    function Composed(props: TOuter) {
        const slice = useSlice<AbstractListSlice>(props.storeId);
        const { viewModelState, viewModelAPI } = useViewModelHook(props.storeId);

        React.useEffect(() => {
            viewModelAPI?.connect();
            return () => {
                viewModelAPI?.disconnect();
            };
        }, [slice]);

        if (!viewModelState || !viewModelAPI) {
            return null;
        }

        return <Component {...props} viewModelState={viewModelState} viewModelAPI={viewModelAPI} />;
    }

    Composed.displayName = `withViewModel(${Component.displayName || Component.name})`;

    return Composed;
}
