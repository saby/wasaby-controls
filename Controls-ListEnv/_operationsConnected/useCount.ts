import type { ListSlice } from 'Controls/dataFactory';
import { useEffect, useState } from 'react';

export default function useCount(slice: ListSlice): number | null {
    const [count, setCount] = useState(slice.state.count);

    useEffect(() => {
        if (!slice.state.countLoading) {
            setCount(slice.state.count);
        }
    }, [slice.state.count, slice.state.countLoading]);

    return count;
}
