/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IRenderData, getRenderValues } from 'Controls/gridReact';
import { CollectionContext } from 'Controls/baseList';
import { Collection } from 'Controls/display';
import { DynamicGridColumnContext } from '../context/DynamicGridColumnContext';

type RawData<T> = T extends Model<infer DataType> ? DataType : never;

/**
 * Хук для получения данных для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля, при изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useItemData<TItem extends Model = Model, TRawData = RawData<TItem>>(
    properties?: readonly (keyof TRawData)[]
): IRenderData<TItem, unknown> {
    const { renderData, columnIndex } = React.useContext(DynamicGridColumnContext);
    const item = renderData?.at(columnIndex);
    return {
        item,
        renderValues: getRenderValues(item, properties),
    };
}

/**
 * Хук для получения данных для ячейки динамического заголовка.
 * Данные для заголовка берутся из рекордсета headers метаданных коллекции.
 */
export function useDynamicHeaderData(): Model | undefined {
    const collection = React.useContext(CollectionContext) as Collection;
    const { columnIndex } = React.useContext(DynamicGridColumnContext);
    const items = collection.getCollection();
    if (items) {
        const headers = items.getMetaData().headers as RecordSet;
        if (headers) {
            return headers.at(columnIndex);
        }
    }
}
