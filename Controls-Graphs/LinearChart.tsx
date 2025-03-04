import { forwardRef, LegacyRef, useRef, RefObject, useCallback } from 'react';
import ILinearChartProps from './_LinearChart/interfaces/ILinearChartProps';
import { HighChartsLight, Legend, IChartOptions, ILegendItem } from 'Controls-Graphs/base';
import { getChartConfig } from './_LinearChart/utils/getChartConfig';

const getLegendItems = (series) =>
    series?.map?.((item, index) => ({
        colorIndex: 'base-' + (item.colorIndex || index + 1),
        caption: item.name,
    })) || [];

export default forwardRef(function LinearChart(
    props: ILinearChartProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const {
        animation = true,
        legendVisible = true,
        legendHorizontalAlignment = 'center',
        legendVerticalPosition = 'top',
    } = props;
    const chartRef = useRef() as RefObject<HighChartsLight>;
    const linearChartConfig = getChartConfig(props) as unknown as IChartOptions;
    const legendItems = getLegendItems(props.series);

    const legendItemClickHandler = (colorIndex: ILegendItem['colorIndex'], show: boolean) => {
        const colorIndexWithoutPostfix = Number(colorIndex.slice(5));
        const serie = props.series.find((item, idx) => {
            return (
                item.colorIndex === colorIndexWithoutPostfix || idx + 1 === colorIndexWithoutPostfix
            );
        });
        chartRef.current
            .callMethodOnChartInstance('get', ['controlsGraphs__LinearChart' + serie?.name])
            .then((context: object) => {
                context.points[0].series.update({ visible: show }, true);
            });
    };

    const LegendCallback = useCallback(() => {
        return (
            <Legend
                legendHorizontalAlignment={legendHorizontalAlignment}
                items={legendItems}
                legendItemClickHandler={legendItemClickHandler}
                className="controls-Graphs-LinearChart__legend tw-flex-wrap"
            />
        );
    }, [props.series, legendItems, legendHorizontalAlignment, legendItemClickHandler]);

    return (
        <div ref={ref} className={`controls_Graphs_theme-default ${props.className}`}>
            {legendVisible && legendVerticalPosition === 'top' ? <LegendCallback /> : null}
            <HighChartsLight
                chartOptions={linearChartConfig}
                animation={animation}
                ref={chartRef}
                className="graphs-Chart controls-Graphs-LinearChart"
            />
            {legendVisible && legendVerticalPosition === 'bottom' ? (
                <div className="controls-margin_top-s tw-w-full">
                    <LegendCallback />
                </div>
            ) : null}
        </div>
    );
});

export { ILinearChartProps };
export { tooltipFormatter } from './_LinearChart/utils/tooltipFormatter';
