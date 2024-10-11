/*
 * Файл содержит публичный хук useItemData и вспомогательные методы.
 * Хук useItemData позволяет получить доступ к рекорду.
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import { CollectionItemContext } from 'Controls/baseList';
import { useWatchRecord, IRenderData, RawData } from './useWatchRecord';

/*
 * Хук, позволяющий получить данные для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля. При изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useItemData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    const item = React.useContext(CollectionItemContext);
    return useWatchRecord(item, properties);
}
