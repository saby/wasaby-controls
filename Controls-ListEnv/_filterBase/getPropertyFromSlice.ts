import { ListSlice } from 'Controls/dataFactory';

export function getSlices(context, storeId: string | string[]): unknown {
    const id = !Array.isArray(storeId) ? [storeId] : storeId;
    return context.getStoreData(id);
}

export function getSlice(context, storeId: string | string[]): ListSlice {
    return Object.values(getSlices(context, storeId))[0];
}

export function getPropertyFromSlice<T>(context, storeId: string | string[], property: string): T {
    const slice = getSlice(context, storeId);
    return slice[property];
}
