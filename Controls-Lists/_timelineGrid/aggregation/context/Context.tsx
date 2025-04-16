/**
 * Предоставляет контекст для дополнительной колонки
 */
import * as React from 'react';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

export interface IAggregationContext {
    /**
     * Видимость дополнительной колонки
     */
    isShown: boolean;
    /**
     * Квант для разбиения на колонки
     */
    quantum: Quantum;
    setQuantum: (quantum: Quantum) => void;
    /**
     * Шаблон колонки
     */
    columnRender?: JSX.Element;
    /**
     * Отображаемый период
     */
    range: IRange;
    /**
     * Данные для построения динамической сетки
     */
    dynamicColumnsGridData: Date[];
}

function emptyFunction(): void {
    return;
}

/**
 * Контекст дополнительной колонки
 */
export const AggregationContext = React.createContext<IAggregationContext>({
    isShown: false,
    quantum: 'hour' as Quantum,
    setQuantum: emptyFunction,
    range: {
        start: new Date(),
        end: new Date(),
    },
    dynamicColumnsGridData: [],
});
