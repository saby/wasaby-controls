import { LegacyRef, forwardRef, useRef, useMemo } from 'react';
import IRoundChartProps from './_RoundChart/interfaces/IRoundChartProps';
import { HighChartsLight, Legend, EmptyView, IChartOptions } from 'Controls-Graphs/base';
import { getChartConfig } from './_RoundChart/utils/getChartConfig';
import { default as Async } from 'Controls/Container/Async';
import { UNIQ_ROUND_CHART_ID } from './_RoundChart/constants';
import 'css!Controls-Graphs/RoundChart';

export const getLegendItems = (
    data: IRoundChartProps['data'],
    series: IRoundChartProps['series']
) => {
    return !!series?.length
        ? series
              .map((item) => {
                  return data.map((dataItem, dataItemIndex) => ({
                      colorIndex:
                          'base-' +
                          (typeof dataItem.colorIndex === 'number'
                              ? dataItem.colorIndex
                              : dataItemIndex + 1 > 12
                              ? (dataItemIndex + 1) % 12
                              : dataItemIndex + 1),
                      caption: dataItem?.[item.displayProperty as string],
                  }));
              })
              .flat()
        : [];
};

/**
 * @public
 * @class Controls-Graphs/RoundChart
 * Контрол круговой диаграммы.
 * @implements Controls-Graphs/RoundChart/IRoundChartProps
 * @demo Controls-Graphs-demo/RoundChart/Index
 */
export default forwardRef(function RoundChart(
    props: IRoundChartProps,
    ref: LegacyRef<HighChartsLight>
) {
    const chartRef = useRef<HighChartsLight>();
    const {
        animation = true,
        type = 'donut',
        legendVisible = false,
        legendVerticalPosition = 'bottom',
        legendHorizontalAlignment = 'center',
    } = props;
    const chartOptions = getChartConfig(props);
    const legendItems = useMemo(
        () => getLegendItems(props.data, props.series),
        [props.series, props.data]
    );

    const getInnerTemplate = () => {
        if (typeof props.diagramInnerTemplate === 'string') {
            return <Async templateName={props.diagramInnerTemplate} templateOptions={{}} />;
        }
        return <props.diagramInnerTemplate />;
    };

    const setRefs = (element: HighChartsLight): void => {
        if (element) {
            chartRef.current = element;
        }
        if (ref) {
            if (typeof ref === 'function') {
                ref(element);
            }
        }
    };

    const legendElementHoverHandler = (colorIndex: number, show: boolean): void => {
        chartRef.current
            ?.callMethodOnChartInstance('get', [UNIQ_ROUND_CHART_ID])
            .then((context: object) => {
                //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                context.points.forEach((point) => {
                    if (!show) {
                        point.setState('normal');
                        return;
                    }
                    if (String(point.colorIndex) === String(colorIndex)) {
                        point.setState('hover');
                    } else {
                        point.setState('inactive');
                    }
                });
            });
    };

    const legendElementClickHandler = (colorIndex: number, show: boolean) => {
        chartRef.current
            ?.callMethodOnChartInstance('get', [UNIQ_ROUND_CHART_ID])
            .then((context: object) => {
                //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                context.points.forEach((point) => {
                    if (String(point.colorIndex) === String(colorIndex)) {
                        point.update({ visible: show }, undefined, animation);
                    }
                });
            });
    };

    let wrapperClassName = 'controls-Graphs_RoundChart';
    if (props.className) {
        wrapperClassName += ` ${props.className}`;
    }
    return (
        <div className={wrapperClassName}>
            {!props.data?.length ? (
                <EmptyView />
            ) : (
                <>
                    {legendVisible && !!legendItems?.length && legendVerticalPosition === 'top' ? (
                        <Legend
                            legendHorizontalAlignment={legendHorizontalAlignment}
                            //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                            items={legendItems}
                            className="controls-margin_bottom-m"
                            legendItemHoverHandler={legendElementHoverHandler}
                            legendItemClickHandler={legendElementClickHandler}
                        />
                    ) : null}
                    <div
                        className={`controls-Graphs_RoundChart__graphsContainer controls-Graphs_RoundChart__graphsContainerSize_${
                            legendVisible ? 'short' : 'full'
                        }`}
                    >
                        {props.diagramInnerTemplate && (
                            <div className="controls-Graphs_RoundChart__innerContainer">
                                {type === 'donut' && getInnerTemplate()}
                            </div>
                        )}
                        <HighChartsLight
                            ref={setRefs}
                            animation={animation}
                            chartOptions={chartOptions as unknown as IChartOptions}
                        />
                    </div>
                    {legendVisible &&
                    !!legendItems?.length &&
                    legendVerticalPosition === 'bottom' ? (
                        <Legend
                            legendHorizontalAlignment={legendHorizontalAlignment}
                            //@ts-expect-error TODO поправить при рефакторе легенды в 1 общий компонент
                            items={legendItems}
                            className="controls-margin_top-m"
                            legendItemHoverHandler={legendElementHoverHandler}
                            legendItemClickHandler={legendElementClickHandler}
                        />
                    ) : null}
                </>
            )}
        </div>
    );
});

export {
    default as IRoundChartProps,
    TRoundChartType,
} from './_RoundChart/interfaces/IRoundChartProps';
export { default as Tooltip } from './_RoundChart/templates/Tooltip';
export { default as InnerTemplate } from './_RoundChart/templates/InnerTemplate';

export { preparedTooltipFormatter } from './_RoundChart/utils/preparedTooltipFormatter';
export { tooltipFormatter } from './_RoundChart/utils/tooltipFormatter';

export { getColorIndex } from './_RoundChart/utils/getColorIndex';
