export function getSlices(context, storeId: string|string[]): unknown {
    const id = !Array.isArray(storeId) ? [storeId] : storeId;
    return context.getStoreData(id);
}

export function getPropertyFromSlice(context, storeId: string|string[], property: string): unknown {
    const slice = Object.values(getSlices(context, storeId))[0];
    return slice[property];
}
