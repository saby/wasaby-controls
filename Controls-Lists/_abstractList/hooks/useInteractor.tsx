/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { Slice } from 'Controls-DataEnv/slice';
import { useStrictSlice } from 'Controls-DataEnv/context';
import {
    _private_extractUtil,
    IAbstractListAPI,
    IAbstractListState,
} from 'Controls-DataEnv/abstractList';

/**
 * Хук, который умеет добывать состояние интерактора и API для его модификации.
 * @param storeId Идентификатор слайса.
 */
export function useInteractor<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
>(
    storeId: string
): {
    viewModelAPI: TListAPI;
    viewModelState: TListState;
} {
    // Слайс списка
    const slice = useStrictSlice<TListAPI & Slice<TListState>>(storeId);

    const viewModelAPI = React.useMemo<TListAPI>(() => {
        const apiOwner: IAbstractListAPI = slice;

        // Тип обязателен, иначе не будет ошибок при нехватке методов
        const api: IAbstractListAPI = _private_extractUtil(
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

        return api as TListAPI;
    }, [slice]);

    return {
        viewModelAPI,
        viewModelState: slice.state as TListState,
    };
}

export default useInteractor;
