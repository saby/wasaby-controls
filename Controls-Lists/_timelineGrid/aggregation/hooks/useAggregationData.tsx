/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { Model } from 'Types/entity';
import { useItemData } from 'Controls/gridReact';
import { AggregationContext, IAggregationContext } from '../context/Context';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

type RawData<T> = T extends Model<infer DataType> ? DataType : never;

/**
 * Интерфейс оъекта, содержащего диапазон индексов
 * @interface Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/IIndexesRange
 * @public
 */
export type IIndexesRange = {
    /**
     * Начальный индекс диапазона
     * @cfg {Number}
     * @field Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/IIndexesRange#start
     */
    start: number;
    /**
     * Конечный индекс диапазона
     * @cfg {Number}
     * @field Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/IIndexesRange#end
     */
    end: number;
};

function getIndexesRange(
    dynamicColumnsGridData: IAggregationContext['dynamicColumnsGridData'],
    range: IAggregationContext['range']
): IIndexesRange {
    let startIndex = -1;
    let endIndex = -1;

    const startUTC = range.start.toUTCString();
    const endUTC = range.end.toUTCString();

    for (
        let i = 0;
        (startIndex === -1 || endIndex === -1) && i < dynamicColumnsGridData.length;
        i++
    ) {
        const dateUTC = dynamicColumnsGridData[i].toUTCString();
        if (dateUTC === startUTC) {
            startIndex = i;
        }
        if (dateUTC === endUTC) {
            endIndex = i;
        }
    }

    return {
        start: startIndex === -1 ? 0 : startIndex,
        end: endIndex === -1 ? 0 : endIndex,
    };
}

/**
 * Интерфейс объекта, который возвращает хук useAggregationData
 * @interface Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/IAggregationData
 * @template TItem Запись RecordSet
 * @template TRawData Сырые данные модели
 * @public
 */
export interface IAggregationData<TItem extends Model, TRawData = RawData<TItem>> {
    /**
     * Квант для колонки агрегации. Выбирается из выпадающего списка в заголоке дополнительной колонки.
     */
    aggregationQuantum: Quantum;
    /**
     * Диапазон дат
     */
    dateRange: IRange;
    /**
     * Диапазон индексов колонок
     */
    indexesRange: IIndexesRange;
    /**
     * Запись RecordSet
     * @cfg {Types/entity:Model}
     * @field Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/IAggregationData#item
     */
    item: TItem;
    /**
     * Объект, содержащий Наблюдаемые значения RecordSet
     * @cfg {Object}
     * @field Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData/IAggregationData#renderValues
     */
    renderValues: Partial<TRawData>;
}

/**
 * Хук для получения данных дополнительной колонки
 * @param {Array.<String>} properties массив названий свойств для получения наблюдаемых значений из RecordSet.
 * @example
 * <pre class="brush='js'">
 * import * as React from 'react';
 * import { date as formatDate } from 'Types/formatter';
 * import { useAggregationData } from 'Controls-Lists/timelineGrid';
 *
 * export default function AggregationRender(): React.ReactElement {
 *     const { item, dateRange, aggregationQuantum } = useAggregationData();
 *
 *     if (item.getKey() === 1) {
 *         return null;
 *     }
 *     const format = aggregationQuantum === 'day' ? 'DD-MM' : 'HH:mm';
 *     return (
 *         <div className="controls-fontsize-s controls-text-label">
 *             {formatDate(dateRange.start, format)}-{formatDate(dateRange.end, format)}
 *         </div>
 *     );
 * }
 * </pre>
 * @see Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments#aggregationVisibility
 * @see Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps#aggregationRender
 */
export function useAggregationData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(properties?: TProperties): IAggregationData<TItem, TRawData> {
    const aggregationCtx = React.useContext(AggregationContext);
    const { item, renderValues } = useItemData<TItem, TRawData, TProperties>(properties);
    const indexesRange = getIndexesRange(
        aggregationCtx.dynamicColumnsGridData,
        aggregationCtx.range
    );

    return {
        aggregationQuantum: aggregationCtx.quantum,
        dateRange: aggregationCtx.range,
        indexesRange,
        item,
        renderValues,
    };
}
