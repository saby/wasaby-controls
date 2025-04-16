import { forwardRef, LegacyRef } from 'react';
import { LINEAR_CHART_DATA, LINEAR_CHART_SERIES_CONFIG } from './resources/data';
import LinearChart from 'Controls-Graphs/LinearChart';

export default forwardRef(function LinearChartDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref}>
            <LinearChart data={LINEAR_CHART_DATA} series={LINEAR_CHART_SERIES_CONFIG} />
        </div>
    );
});
