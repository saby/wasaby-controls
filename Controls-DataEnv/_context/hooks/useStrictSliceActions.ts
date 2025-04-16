/**
 * @kaizenZone 997e2040-c20b-4857-8580-c283c4b85f85
 * @module
 * @public
 */
import { Slice } from 'Controls-DataEnv/slice';

import useSliceActions from './useSliceActions';

/**
 * Хук для получения контроллера слайса
 * @private
 * @param storeId
 */
function useStrictSliceActions<T extends Slice>(storeId: string): T {
    const slice = useSliceActions<T>(storeId);

    if (!slice) {
        throw Error(`В конексте данных отсутствует слайс с идентификатором - ${storeId}`);
    }

    return slice;
}

export default useStrictSliceActions;
