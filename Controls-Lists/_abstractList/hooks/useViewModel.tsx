/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';
import { useStrictSlice } from 'Controls-DataEnv/context';
import {
    IAbstractListAPI,
    IAbstractListState,
    _private_extractUtil,
} from 'Controls-DataEnv/abstractList';

export function useViewModel<
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
>(
    storeId: string
): {
    viewModelAPI: TAbstractListAPI;
    viewModelState: TAbstractListState;
} {
    // Слайс списка
    const slice = useStrictSlice<TAbstractListAPI & Slice<TAbstractListState>>(storeId);

    const viewModelAPI = React.useMemo<TAbstractListAPI>(() => {
        const apiOwner: IAbstractListAPI = slice;
        const api = _private_extractUtil(
            apiOwner,
            [
                'connect',
                'disconnect',
                'openOperationsPanel',
                'closeOperationsPanel',
                'openFilterDetailPanel',
                'closeFilterDetailPanel',
                'mark',
                'select',
                'selectAll',
                'resetSelection',
                'invertSelection',
                'getSelection',
                'expand',
                'collapse',
                'changeRoot',
                'next',
                'prev',
                'setFilter',
                'search',
                'resetSearch',
                'isIdle',
            ],
            (method) => method.bind(slice)
        );

        return api as TAbstractListAPI;
    }, [slice]);

    return {
        viewModelAPI,
        viewModelState: slice.state as TAbstractListState,
    };
}
