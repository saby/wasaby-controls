import * as React from 'react';
import { TColumnWidth } from 'Controls/gridRender';
import type { IRange } from '../interfaces/IEventRenderProps';

export interface IDynamicColumnsInfoContextValue {
    columnsCount: number; // Общее число динамических колонок
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
