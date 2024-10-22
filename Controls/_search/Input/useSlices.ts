import { useMemo } from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';

export default function useSlices(storeId: string | string[]): Record<string, ListSlice> {
    const storeIds = useMemo(() => {
        if (Array.isArray(storeId)) {
            return storeId;
        }
        return [storeId];
    }, [storeId]);
    const slicesObj = {};

    storeIds.forEach((id) => {
        slicesObj[id] = useSlice(id);
    });

    return useMemo(() => slicesObj, Object.values(slicesObj));
}
