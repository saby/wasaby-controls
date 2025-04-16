/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

import * as React from 'react';
import { Model } from 'Types/entity';
import { CollectionItemContext } from 'Controls/listsCommonLogic';
import { useWatchRecord, IRenderData, RawData } from 'Controls/gridRender';
import { TreeItem } from 'Controls/tree';

/**
 * Хук, позволяющий получить данные записи-корня для отрисовки контента ячейки nodeFooter
 * @param {string[]} properties Зависимые поля. При изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useNodeFooterData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[],
>(properties?: TProperties): IRenderData<TItem, Partial<TRawData>> {
    const item = (React.useContext(CollectionItemContext) as unknown as TreeItem)?.getParent?.();
    return useWatchRecord(item, properties);
}
