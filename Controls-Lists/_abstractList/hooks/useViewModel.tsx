/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import {
    AbstractListSlice,
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
    viewModelAPI: TAbstractListAPI | null;
    viewModelState: TAbstractListState | null;
} {
    // Слайс списка
    const slice = useSlice<AbstractListSlice>(storeId);

    const viewModelAPI = React.useMemo<TAbstractListAPI | null>(() => {
        if (!slice) {
            return null;
        }
        return _private_extractUtil(
            slice,
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
            ],
            (method) => method.bind(slice)
        ) as TAbstractListAPI;
    }, [slice]);

    return {
        viewModelAPI,
        viewModelState: slice ? (slice.state as TAbstractListState) : null,
    };
}
