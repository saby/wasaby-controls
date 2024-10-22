import { date as formatDate } from 'Types/formatter';
import { useAggregationData } from 'Controls-Lists/timelineGrid';
import * as React from 'react';

export default function AggregationRender(): React.ReactElement {
    const { item, dateRange, aggregationQuantum } = useAggregationData();

    if (item.getKey() === 1) {
        return null;
    }
    const format = aggregationQuantum === 'day' ? 'DD-MM' : 'HH:mm';
    return (
        <div className="controls-fontsize-s controls-text-label">
            {formatDate(dateRange.start, format)}-{formatDate(dateRange.end, format)}
        </div>
    );
}
