/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import { CollectionItemContext, ICollectionItemContextValue } from 'Controls/listsCommonLogic';
import { useWatchRecord, IRenderData, RawData } from './useWatchRecord';

/**
 * Хук, позволяющий получить данные записи для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля. При изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useItemData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[],
>(properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    const { item, itemContents } = React.useContext(
        CollectionItemContext
    ) as ICollectionItemContextValue;
    return useWatchRecord(item, itemContents, properties);
}
