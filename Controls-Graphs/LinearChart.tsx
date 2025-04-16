import { forwardRef, LegacyRef, useRef, RefObject, useState, useCallback, useEffect } from 'react';
import ILinearChartProps from 'Controls-Graphs/interfaces/ILinearChartProps';
import {
    HighChartsLight,
    LegendWrapper,
    IChartOptions,
    EmptyView,
    ISingleSeriesItem,
    TSetVisibleItems,
} from 'Controls-Graphs/base';
import { getChartConfig, getGraphsCategories } from './_LinearChart/utils/getChartConfig';
import 'css!Controls-Graphs/LinearChart';

/**
 * Контрол линейного графика.
 * @public
 * @class Controls-Graphs/LinearChart
 * @implements Controls-Graphs/interfaces/ILinearChartProps
 * @demo Controls-Graphs-demo/LinearChart/Index
 */
export default forwardRef(function LinearChart(
    props: ILinearChartProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const {
        animation = true,
        legendVisible = true,
        legendVerticalPosition = 'top',
        legendHorizontalAlignment = 'center',
    } = props;
    const chartRef = useRef() as RefObject<HighChartsLight>;
    const [visibleSeries, setVisibleSeries] = useState(props.series);
    const handleChangeVisibleSeries = useCallback((newSeries: ISingleSeriesItem[]) => {
        setVisibleSeries(newSeries);
    }, []);
    useEffect(() => {
        setVisibleSeries(props.series);
    }, [props.series]);
    const linearChartConfig = getChartConfig(
        {
            ...props,
            series: visibleSeries,
        },
        getGraphsCategories(props.series, props.data) as string[]
    ) as unknown as IChartOptions;

    return (
        <div
            ref={ref}
            className={`controls_Graphs_theme-default controls-Graphs-LinearChart__minHeight ${
                !props.data?.length ? 'tw-flex tw-justify-center' : 'controls-Graphs_chart_wrapper'
            } ${props.className}`}
        >
            {!props.data?.length ? (
                <EmptyView className="controlsGraphs_base_emptyView__height" />
            ) : (
                <LegendWrapper
                    series={props.series}
                    legendVisible={legendVisible}
                    legendVerticalPosition={legendVerticalPosition}
                    legendHorizontalAlignment={legendHorizontalAlignment}
                    setVisibleItems={handleChangeVisibleSeries as TSetVisibleItems}
                    visibleItems={visibleSeries}
                >
                    <HighChartsLight
                        chartOptions={linearChartConfig}
                        animation={animation}
                        ref={chartRef}
                        className={`graphs-Chart tw-w-full controls-Graphs-LinearChart${
                            legendVisible ? ' controls-Graphs_chart_minHeight' : ''
                        }`}
                    />
                </LegendWrapper>
            )}
        </div>
    );
});

export { tooltipFormatter, ITooltipFormatterProps } from './_LinearChart/utils/tooltipFormatter';
