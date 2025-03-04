import { Slice } from '../../slice';
import useSliceInternal from 'Controls-DataEnv/_context/hooks/private/useSliceInternal';

/**
 * Хук для получения слайса из контекста данных (см. подробнее в статье {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/ Управление данными для страниц и окон})
 * @param storeId уникальный идентификатор значения в контексте
 * @public
 */
export default function useSlice<T extends Slice>(storeId: string): T | undefined {
    return useSliceInternal<T>(storeId);
}
