import { forwardRef, LegacyRef } from 'react';
import ColumnChart, { IColumnChartProps } from 'Controls-Graphs/ColumnChart';

export default forwardRef(function ColumnChartDemoTemplate(
    props: IColumnChartProps,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div ref={ref}>
            <ColumnChart />
        </div>
    );
});
