import * as React from 'react';
import { IRange } from 'Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps';
import { TColumnWidth } from 'Controls/_gridRender/cell/interface/ICell';

export interface IDynamicColumnsInfoContextValue {
    columnsCount: number; //Общее число динамических колонок
    visibleRange: IRange; // Видимый диапазон динамических колонок
    columnWidth: TColumnWidth; // Ширина колонки
}

/**
 * Контекст, хранящий информацию об отображаемых колонках.
 * Необходим для использования на прикладной стороне. Доступ к данным контекста осуществляется
 * при помощи хука useDynamicColumnsInfo.
 * */
export const DynamicColumnsInfoContext =
    React.createContext<IDynamicColumnsInfoContextValue>(undefined);
DynamicColumnsInfoContext.displayName = 'Controls/dynamicGrid:DynamicGridColumnContext';
