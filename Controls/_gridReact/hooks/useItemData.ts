import * as React from 'react';

import { Model } from 'Types/entity';
import { CollectionItemContext } from 'Controls/baseList';
import { useWatchRecord, IRenderData, RawData } from './useWatchRecord';

/**
 * Хук для получения данных для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля, при изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useItemData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    const item = React.useContext(CollectionItemContext);
    return useWatchRecord(item, properties);
}
