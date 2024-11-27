import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice, IListState } from 'Controls/dataFactory';

export function getSlices(storeId: string | string[]): Record<string, ListSlice> {
    const result = {};
    const ids = !Array.isArray(storeId) ? [storeId] : storeId;

    ids.forEach((id) => {
        result[id] = useSlice(id);
    });
    return result;
}

export function getSlice(storeId: string | string[]): ListSlice {
    return Object.values(getSlices(storeId))[0];
}

export function getPropertyFromSlice<T = unknown>(
    storeId: string | string[],
    property: keyof IListState
): T {
    const slice = getSlice(storeId);
    return slice.state[property];
}
