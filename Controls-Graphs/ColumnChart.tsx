import {
    forwardRef,
    LegacyRef,
    RefObject,
    useRef,
    useMemo,
    useState,
    useCallback,
    useEffect,
} from 'react';
import IColumnChartProps from 'Controls-Graphs/interfaces/IColumnChartProps';
import {
    EmptyView,
    HighChartsLight,
    IChartOptions,
    LegendWrapper,
    TSetVisibleItems,
    ISingleSeriesItem,
} from 'Controls-Graphs/base';
import { getChartConfig, getGraphsCategories } from './_ColumnChart/utils/getChartConfig';
import 'css!Controls-Graphs/ColumnChart';

/**
 * Контрол столбчатой диаграммы.
 * @public
 * @class Controls-Graphs/ColumnChart
 * @implements Controls-Graphs/interfaces/IColumnChartProps
 * @demo Controls-Graphs-demo/ColumnChart/Index
 */
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
    const [visibleSeries, setVisibleSeries] = useState<ISingleSeriesItem[]>(props.series);
    const handleChangeVisibleSeries = useCallback((newSeries: ISingleSeriesItem[]) => {
        setVisibleSeries(newSeries);
    }, []);
    useEffect(() => {
        setVisibleSeries(props.series);
    }, [props.series]);
    const config = useMemo(
        () =>
            getChartConfig(
                {
                    ...props,
                    series: visibleSeries,
                },
                getGraphsCategories(props.series, props.data) as string[]
            ),
        [props.series, props.data, props.yAxis, props.xAxis, visibleSeries]
    );

    return (
        <div
            ref={ref}
            className={`controls_Graphs_theme-default controls-Graphs-ColumnChart__minHeight ${
                !props.data?.length ? 'tw-flex tw-justify-center' : 'controls-Graphs_chart_wrapper'
            } ${props.className}`}
        >
            {!props.data.length ? (
                <EmptyView className="controlsGraphs_base_emptyView__height" />
            ) : (
                <LegendWrapper
                    visibleItems={visibleSeries}
                    setVisibleItems={handleChangeVisibleSeries as TSetVisibleItems}
                    series={props.series}
                    legendVisible={legendVisible}
                    legendVerticalPosition={legendVerticalPosition}
                    legendHorizontalAlignment={legendHorizontalAlignment}
                >
                    <HighChartsLight
                        chartOptions={config as unknown as IChartOptions}
                        animation={animation}
                        ref={chartRef}
                        className={`graphs-Chart tw-w-full tw-h-full${
                            legendVisible ? ' controls-Graphs_chart_minHeight' : ''
                        }`}
                    />
                </LegendWrapper>
            )}
        </div>
    );
});
