import { AbstractSlice } from 'Controls-DataEnv/slice';
import useSliceInternal from 'Controls-DataEnv/_context/hooks/private/useSliceInternal';
/**
 * Хук для получения контроллера слайса
 * @private
 * @param selector
 */
export default function useSliceActions<SliceType extends AbstractSlice = AbstractSlice>(
    storeId: string
): SliceType | undefined {
    return useSliceInternal<SliceType>(storeId, false);
}
