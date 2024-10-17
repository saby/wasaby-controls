import { useAggregationData } from 'Controls-Lists/timelineGrid';
import * as React from 'react';

export default function AggregationRender(): React.ReactElement {
    const { item, dateRange, aggregationQuantum } = useAggregationData();

    if (item.getKey() === 1) {
        return null;
    }
    const h = (dateRange.end.getTime() - dateRange.start.getTime()) / 1000 / 60 / 60;
    const amount = aggregationQuantum === 'day' ? Math.floor(h / 24) : Math.floor(h);
    return <div className="controls-fontsize-s controls-text-label">{amount}</div>;
}
