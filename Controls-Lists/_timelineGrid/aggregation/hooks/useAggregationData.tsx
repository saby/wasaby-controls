import * as React from 'react';
import { Model } from 'Types/entity';
import { useItemData } from 'Controls/gridReact';
import { AggregationContext, IAggregationContext } from '../context/Context';

type RawData<T> = T extends Model<infer DataType> ? DataType : never;
type TIndexesRange = {
    start: number;
    end: number;
};

function getIndexesRange(
    dynamicColumnsGridData: IAggregationContext['dynamicColumnsGridData'],
    range: IAggregationContext['range']
): TIndexesRange {
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
        end: endIndex === -1 ? 0 : endIndex
    };
}

export function useAggregationData<
    TItem extends Model,
    TRawData = RawData<TItem>,
    TProperties extends readonly (keyof TRawData)[] = readonly (keyof TRawData)[]
>(
    properties?: TProperties
): {
    aggregationQuantum: IAggregationContext['quantum'];
    dateRange: IAggregationContext['range'];
    indexesRange: TIndexesRange;
    item: TItem;
    renderValues: Partial<TRawData>;
} {
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
