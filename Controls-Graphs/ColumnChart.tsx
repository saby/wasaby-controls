import { forwardRef, LegacyRef, RefObject, useRef, useMemo, useCallback } from 'react';
import IColumnChartProps from 'Controls-Graphs/interfaces/IColumnChartProps';
import {
    EmptyView,
    HighChartsLight,
    ILegendItem,
    Legend,
    IChartOptions,
} from 'Controls-Graphs/base';
import { getChartConfig } from './_ColumnChart/utils/getChartConfig';
import 'css!Controls-Graphs/ColumnChart';

const getLegendItems = (series: IColumnChartProps['series']) => {
    return !!series?.length
        ? series?.map?.((item, index) => ({
              caption: item.name,
              colorIndex:
                  'base-' + (typeof item.colorIndex === 'number' ? item.colorIndex : index + 1),
          }))
        : [];
};

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
    const config = useMemo(
        () => getChartConfig(props),
        [props.series, props.data, props.yAxis, props.xAxis]
    );
    const legendItems = getLegendItems(props.series);

    const legendItemClickHandler = (colorIndex: ILegendItem['colorIndex'], show: boolean) => {
        const colorIndexWithoutPostfix = Number((colorIndex as unknown as string).slice(5));
        const serie = props.series.find((item, idx) => {
            return (
                item.colorIndex === colorIndexWithoutPostfix || idx + 1 === colorIndexWithoutPostfix
            );
        });
        chartRef.current
            ?.callMethodOnChartInstance('get', ['controlsGraphs__ColumnChart' + serie?.name])
            .then((context: object) => {
                //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                context.points[0]?.series?.update?.({ visible: show }, true);
            });
    };

    const LegendCallback = useCallback(() => {
        return (
            <Legend
                legendHorizontalAlignment={legendHorizontalAlignment}
                className="controls-Graphs-ColumnChart__legend tw-flex-wrap"
                legendItemClickHandler={legendItemClickHandler}
                //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                items={legendItems}
            />
        );
    }, [props.series, legendItems, legendHorizontalAlignment, legendItemClickHandler]);

    return (
        <div
            ref={ref}
            className={`controls_Graphs_theme-default controls-Graphs-ColumnChart__minHeight ${
                !props.data?.length ? 'tw-flex tw-justify-center' : ''
            } ${props.className}`}
        >
            {!props.data.length ? (
                <EmptyView className="controlsGraphs_base_emptyView__height" />
            ) : (
                <>
                    {legendVisible && legendVerticalPosition === 'top' ? <LegendCallback /> : null}
                    <HighChartsLight
                        chartOptions={config as unknown as IChartOptions}
                        animation={animation}
                        ref={chartRef}
                        className="graphs-Chart tw-h-full"
                    />
                    {legendVisible && legendVerticalPosition === 'bottom' ? (
                        <div className="controls-margin_top-s">
                            <LegendCallback />
                        </div>
                    ) : null}
                </>
            )}
        </div>
    );
});
