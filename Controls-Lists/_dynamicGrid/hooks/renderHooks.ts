import * as React from 'react';
import { Model } from 'Types/entity';
import { IRenderData, getRenderValues } from 'Controls/gridReact';

type RawData<T> = T extends Model<infer DataType> ? DataType : never;

const DynamicGridContext = React.createContext(null);

/**
 * Хук для получения данных для отрисовки контента ячейки
 * @param {string[]} properties Зависимые поля, при изменении значений в этих полях будет вызываться перерисовка контента ячейки
 */
export function useItemData<TItem extends Model = Model, TRawData = RawData<TItem>>(
    properties?: readonly (keyof TRawData)[]
): IRenderData<TItem, unknown> {
    const { renderData, columnIndex } = React.useContext(DynamicGridContext);
    const item = renderData.at(columnIndex);
    return {
        item,
        renderValues: getRenderValues(item, properties),
    };
}
