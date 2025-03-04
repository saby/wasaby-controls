import { forwardRef, LegacyRef, RefObject, useRef, useMemo, useCallback } from 'react';
import IColumnChartProps from './_ColumnChart/interfaces/IColumnChartProps';
import { HighChartsLight, ILegendItem, Legend } from 'Controls-Graphs/base';
import { getChartConfig } from './_ColumnChart/utils/getChartConfig';
import 'css!Controls-Graphs/ColumnChart';

const getLegendItems = (series: IColumnChartProps['series']) => {
    return !!series?.length
        ? series?.map?.((item, index) => ({
              caption: item.name,
              colorIndex: 'base-' + (item.colorIndex || index + 1),
          }))
        : [];
};

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
    const config = useMemo(
        () => getChartConfig(props),
        [props.series, props.yAxis, props.xAxis, props.tooltip]
    );
    const legendItems = getLegendItems(props.series);

    const legendItemClickHandler = (colorIndex: ILegendItem['colorIndex'], show: boolean) => {
        const colorIndexWithoutPostfix = Number(colorIndex.slice(5));
        const serie = props.series.find((item, idx) => {
            return (
                item.colorIndex === colorIndexWithoutPostfix || idx + 1 === colorIndexWithoutPostfix
            );
        });
        chartRef.current
            .callMethodOnChartInstance('get', ['controlsGraphs__ColumnChart' + serie?.name])
            .then((context: object) => {
                context.points[0].series.update({ visible: show }, true);
            });
    };

    const LegendCallback = useCallback(() => {
        return (
            <Legend
                legendHorizontalAlignment={legendHorizontalAlignment}
                className="controls-Graphs-ColumnChart__legend tw-flex-wrap"
                legendItemClickHandler={legendItemClickHandler}
                items={legendItems}
            />
        );
    }, [props.series, legendItems, legendHorizontalAlignment, legendItemClickHandler]);

    return (
        <div ref={ref} className={`controls_Graphs_theme-default ${props.className}`}>
            {legendVisible && legendVerticalPosition === 'top' ? <LegendCallback /> : null}
            <HighChartsLight
                chartOptions={config}
                animation={animation}
                ref={chartRef}
                className="graphs-Chart"
            />
            {legendVisible && legendVerticalPosition === 'bottom' ? (
                <div className="controls-margin_top-s">
                    <LegendCallback />
                </div>
            ) : null}
        </div>
    );
});

export { default as IColumnChartProps } from './_RoundChart/interfaces/IRoundChartProps';
