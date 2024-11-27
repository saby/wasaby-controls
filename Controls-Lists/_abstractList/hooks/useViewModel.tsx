/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import {
    AbstractListSlice,
    IAbstractListAPI,
    IAbstractListState,
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
        const abstractListAPI: IAbstractListAPI = {
            connect: slice.connect.bind(slice),
            disconnect: slice.disconnect.bind(slice),

            openOperationsPanel: slice.openOperationsPanel.bind(slice),
            closeOperationsPanel: slice.closeOperationsPanel.bind(slice),
            openFilterDetailPanel: slice.openFilterDetailPanel.bind(slice),
            closeFilterDetailPanel: slice.closeFilterDetailPanel.bind(slice),

            mark: slice.mark.bind(slice),
            select: slice.select.bind(slice),
            selectAll: slice.selectAll.bind(slice),
            resetSelection: slice.resetSelection.bind(slice),
            invertSelection: slice.invertSelection.bind(slice),
            getSelection: slice.getSelection.bind(slice),
            expand: slice.expand.bind(slice),
            collapse: slice.collapse.bind(slice),
            changeRoot: slice.changeRoot.bind(slice),
            next: slice.next.bind(slice),
            prev: slice.prev.bind(slice),
            setFilter: slice.setFilter.bind(slice),
            search: slice.search.bind(slice),
            resetSearch: slice.resetSearch.bind(slice),
        };

        return abstractListAPI as TAbstractListAPI;
    }, [slice]);

    return {
        viewModelAPI,
        viewModelState: slice ? (slice.state as TAbstractListState) : null,
    };
}
