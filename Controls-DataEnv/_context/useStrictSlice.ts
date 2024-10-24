/**
 * @kaizenZone 997e2040-c20b-4857-8580-c283c4b85f85
 * @module
 * @public
 */
import { Slice } from 'Controls-DataEnv/slice';

import useSlice from './useSlice';

/**
 * Хук для получения слайса из контекста данных (см. подробнее в статье {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/ Управление данными для страниц и окон}). В случае отсутствия слайса в контексте данных, выбрасывается исключение.
 * @param storeId Уникальный идентификатор значения в контексте.
 * @public
 */
function useStrictSlice<T extends Slice>(storeId: string): T {
    const slice = useSlice<T>(storeId);

    if (!slice) {
        throw Error(`В конексте данных отсутствует слайс с идентификатором - ${storeId}`);
    }

    return slice;
}

export default useStrictSlice;
