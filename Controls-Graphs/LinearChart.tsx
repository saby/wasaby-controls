import { forwardRef, LegacyRef, useRef, RefObject, useCallback } from 'react';
import ILinearChartProps from './_LinearChart/interfaces/ILinearChartProps';
import {
    HighChartsLight,
    Legend,
    IChartOptions,
    ILegendItem,
    EmptyView,
    ISingleSeriesItem,
} from 'Controls-Graphs/base';
import { getChartConfig } from './_LinearChart/utils/getChartConfig';
import 'css!Controls-Graphs/LinearChart';

const getLegendItems = (series: ISingleSeriesItem[]) =>
    series?.map?.((item, index) => ({
        colorIndex: 'base-' + (typeof item.colorIndex === 'number' ? item.colorIndex : index + 1),
        caption: item.name,
    })) || [];

/**
 * @public
 * @class Controls-Graphs/LinearChart
 * Контрол линейного графика.
 * @implements Controls-Graphs/LinearChart/ILinearChartProps
 * @demo Controls-Graphs-demo/LinearChart/Index
 */
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
        // TODO поправить при рефакторе легенды в 1 общий компонент
        const colorIndexWithoutPostfix = Number((colorIndex as unknown as string).slice(5));
        const serie = props.series.find((item, idx) => {
            return (
                item.colorIndex === colorIndexWithoutPostfix || idx + 1 === colorIndexWithoutPostfix
            );
        });
        chartRef.current
            ?.callMethodOnChartInstance('get', ['controlsGraphs__LinearChart' + serie?.name])
            .then((context: object) => {
                // @ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                context.points[0]?.series?.update?.({ visible: show }, true);
            });
    };

    const LegendCallback = useCallback(() => {
        return (
            <Legend
                legendHorizontalAlignment={legendHorizontalAlignment}
                //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                items={legendItems}
                legendItemClickHandler={legendItemClickHandler}
                className="controls-Graphs-LinearChart__legend tw-flex-wrap"
            />
        );
    }, [props.series, legendItems, legendHorizontalAlignment, legendItemClickHandler]);

    return (
        <div
            ref={ref}
            className={`controls_Graphs_theme-default controls-Graphs-LinearChart__minHeight ${
                !props.data?.length ? 'tw-flex tw-justify-center' : ''
            } ${props.className}`}
        >
            {!props.data?.length ? (
                <EmptyView className="controlsGraphs_base_emptyView__height" />
            ) : (
                <>
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
                </>
            )}
        </div>
    );
});

export { ILinearChartProps };
export { tooltipFormatter, ITooltipFormatterProps } from './_LinearChart/utils/tooltipFormatter';
