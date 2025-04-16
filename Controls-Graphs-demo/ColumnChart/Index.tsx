import { forwardRef, LegacyRef } from 'react';
import { DATA, COLUMN_CHART_SERIES_CONFIG } from './resources/data';
import ColumnChart from 'Controls-Graphs/ColumnChart';

export default forwardRef(function ColumnChartDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <ColumnChart data={DATA} series={COLUMN_CHART_SERIES_CONFIG} />
        </div>
    );
});
