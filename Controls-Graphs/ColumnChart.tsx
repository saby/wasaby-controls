import { forwardRef, LegacyRef, RefObject, useRef } from 'react';
import IColumnChartProps from './_ColumnChart/interfaces/IColumnChartProps';
import { HighChartsLight, Legend } from 'Controls-Graphs/base';
import { getChartConfig } from './_ColumnChart/utils/getChartConfig';
import { getLegendItems } from './_ColumnChart/utils/getLegendItems';

export default forwardRef(function ColumnChart(
    props: IColumnChartProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const {
        animation = true,
        legendVisible = true,
        legendHorizontalAlignment = 'center',
        legendVerticalPosition = 'top',
    } = props;
    const chartRef = useRef() as RefObject<HighChartsLight>;
    const config = getChartConfig(props);
    const legendItems = getLegendItems(props);
    return (
        <div ref={ref} className={`controls_Graphs_theme-default ${props.className}`}>
            {legendVisible && legendVerticalPosition === 'top' ? (
                <Legend legendHorizontalAlignment={legendHorizontalAlignment} items={legendItems} />
            ) : null}
            <HighChartsLight
                chartOptions={config}
                animation={animation}
                ref={chartRef}
                className="graphs-Chart"
            />
            {legendVisible && legendVerticalPosition === 'bottom' ? (
                <Legend legendHorizontalAlignment={legendHorizontalAlignment} items={legendItems} />
            ) : null}
        </div>
    );
});

export { default as IColumnChartProps } from './_RoundChart/interfaces/IRoundChartProps';
