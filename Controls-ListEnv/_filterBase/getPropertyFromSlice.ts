import { useCallback, useMemo } from 'react';
import { useSlice, useSliceActions, useSelector } from 'Controls-DataEnv/context';
import { ListSlice, IListState } from 'Controls/dataFactory';

export function getSlices(storeId: string | string[]): Record<string, ListSlice> {
    const result = {};
    const ids = !Array.isArray(storeId) ? [storeId] : storeId;

    ids.forEach((id) => {
        result[id] = useSlice(id);
    });
    return result;
}

export const getSlicesActions = function useGetSlicesActions(
    storeId: string | string[]
): Record<string, ListSlice> {
    const result: Record<string, ListSlice> = {};
    const ids = !Array.isArray(storeId) ? [storeId] : storeId;

    ids.forEach((id) => {
        const dispatcher = useSliceActions<ListSlice>(id);
        if (dispatcher) {
            result[id] = dispatcher;
        }
    });
    return result;
};

export function getSlice(storeId: string | string[]): ListSlice {
    return Object.values(getSlices(storeId))[0];
}

export const getPropertyFromSlice = function useGetPropertyFromSlice<T = unknown>(
    storeId: string | string[],
    propertyName: keyof IListState
): T {
    const propertyFromSliceSelector = useCallback(
        (stateObj: Record<string, IListState> | undefined) => {
            if (!stateObj) {
                return;
            }
            const ids = !Array.isArray(storeId) ? [storeId] : storeId;
            for (const id of ids) {
                const state = stateObj[id];
                if (state) {
                    return state[propertyName];
                }
            }
        },
        [storeId]
    );
    const propertyFromSlice = useSelector<Record<string, IListState>>(propertyFromSliceSelector);
    return propertyFromSlice as T;
};
