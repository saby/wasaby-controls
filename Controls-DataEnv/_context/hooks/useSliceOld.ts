import SliceContext from '../contexts/SliceContext';
import { useContext } from 'react';
import useSlice from 'Controls-DataEnv/_context/hooks/useSlice';

/**
 * Временный хук для совместимости
 * @private
 * @param storeId
 */
export default function useSliceOld<T>(storeId: string): T | undefined {
    const context = useContext(SliceContext);
    const sliceFromStore = useSlice(storeId);

    return context?.[storeId]
        ? (context[storeId] as unknown as T)
        : (sliceFromStore as unknown as T);
}
