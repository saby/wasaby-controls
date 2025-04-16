import {
    LegacyRef,
    forwardRef,
    useRef,
    MutableRefObject,
    useState,
    useCallback,
    useEffect,
} from 'react';
import IRoundChartProps from 'Controls-Graphs/interfaces/IRoundChartProps';
import {
    HighChartsLight,
    LegendWrapper,
    EmptyView,
    IChartOptions,
    ISingleItem,
    TSetVisibleItems,
} from 'Controls-Graphs/base';
import { getChartConfig } from './_RoundChart/utils/getChartConfig';
import { default as Async } from 'Controls/Container/Async';
import 'css!Controls-Graphs/RoundChart';
import { UNIQ_ROUND_CHART_ID } from './_RoundChart/constants';

/**
 * Контрол круговой диаграммы.
 * @public
 * @class Controls-Graphs/RoundChart
 * @implements Controls-Graphs/interfaces/IRoundChartProps
 * @demo Controls-Graphs-demo/RoundChart/Type/Index
 */
export default forwardRef(function RoundChart(
    props: IRoundChartProps,
    ref: LegacyRef<HighChartsLight> | Function | MutableRefObject<HighChartsLight>
) {
    const chartRef = useRef<HighChartsLight>();
    const {
        animation = true,
        type = 'donut',
        legendVisible = false,
        legendVerticalPosition = 'top',
        legendHorizontalAlignment = 'center',
    } = props;
    const [visibleData, setVisibleData] = useState<ISingleItem[]>(props.data);
    const handleChangeVisibleData = useCallback((newData: ISingleItem[]) => {
        setVisibleData(newData);
    }, []);
    useEffect(() => {
        setVisibleData(props.data);
    }, [props.data]);
    const chartOptions = getChartConfig({
        ...props,
        data: legendVisible ? visibleData : props.data,
    });
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
            } else {
                (ref as MutableRefObject<HighChartsLight>).current = element;
            }
        }
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
                <LegendWrapper
                    legendHorizontalAlignment={legendHorizontalAlignment}
                    legendVisible={legendVisible}
                    legendVerticalPosition={legendVerticalPosition}
                    data={props.data}
                    series={props.series}
                    setVisibleItems={handleChangeVisibleData as TSetVisibleItems}
                    visibleItems={visibleData}
                    chartRef={chartRef}
                    instanceId={UNIQ_ROUND_CHART_ID}
                >
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
                </LegendWrapper>
            )}
        </div>
    );
});

export {
    default as IRoundChartProps,
    TRoundChartType,
} from 'Controls-Graphs/interfaces/IRoundChartProps';
export { default as Tooltip } from './_RoundChart/templates/Tooltip';
export { default as InnerTemplate } from './_RoundChart/templates/InnerTemplate';

export { preparedTooltipFormatter } from './_RoundChart/utils/preparedTooltipFormatter';
export { tooltipFormatter } from './_RoundChart/utils/tooltipFormatter';

export { getColorIndex } from './_RoundChart/utils/getColorIndex';
