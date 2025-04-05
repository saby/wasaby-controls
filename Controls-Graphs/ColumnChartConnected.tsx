import * as React from 'react';
import ColumnChart, { IColumnChartProps } from 'Controls-Graphs/ColumnChart';
import { useDataFromSlice, IConnectedGraphProps } from 'Controls-Graphs/data';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { isEqual } from 'Types/object';

/**
 * @public
 * @interface Controls-Graphs/ColumnChartConnected/IColumnChartConnectedProps
 * @implements Controls-Graphs/data/IConnectedGraphProps
 * @implements Controls-Graphs/ColumnChart/IColumnChartProps
 * @ignoreOptions data
 * Интерфейс, описывающий опции столбачатой диаграммы, которая имеет возможность запрашивать данные из контекста.
 */
export interface IColumnChartConnectedProps
    extends Omit<IColumnChartProps, 'data'>,
        IConnectedGraphProps {}

/**
 * @public
 * @class Controls-Graphs/ColumnChartConnected
 * @implements Controls-Graphs/ColumnChartConnected/IColumnChartConnectedProps
 * Контрол, столбчатой диграммы, которая имеет возможность запрашивать данные из контекста.
 * @demo Controls-Graphs-demo/ColumnChartConnected/Items/Index
 * @demo Controls-Graphs-demo/ColumnChartConnected/Source/Index
 */
const ColumnChartConnected = React.forwardRef(
    (props: IColumnChartConnectedProps, ref: React.Ref<HTMLDivElement>) => {
        const { legendVisible = false } = props;
        const {
            data,
        }: {
            data: ISingleItem[];
            series: ISingleSeriesItem[];
        } = useDataFromSlice(props.storeId, props.series, props.name);
        const [graphDataProps, setGraphDataProps] = React.useState({
            data,
            series: props.series,
        });
        const currentDataProps = React.useRef<null | {
            storeId: IColumnChartConnectedProps['storeId'];
            series: ISingleSeriesItem[];
            name: IColumnChartConnectedProps['name'];
        }>(null);
        React.useEffect(() => {
            props.hasDataCallback?.(data);
        }, [data, props.hasDataCallback]);
        React.useEffect(() => {
            if (currentDataProps.current === null) {
                currentDataProps.current = {
                    storeId: props.storeId,
                    series: props.series,
                    name: props.name,
                };
            } else if (
                currentDataProps.current.storeId !== props.storeId ||
                currentDataProps.current.name !== props.name ||
                !isEqual(props.series, currentDataProps.current.series) ||
                !isEqual(data, graphDataProps.data)
            ) {
                currentDataProps.current = {
                    storeId: props.storeId,
                    series: props.series,
                    name: props.name,
                };
                setGraphDataProps({ series: props.series, data });
            }
        }, [props.storeId, props.series, props.name, data]);
        return (
            <ColumnChart
                ref={ref}
                legendVisible={legendVisible}
                legendHorizontalAlignment={props.legendHorizontalAlignment}
                legendVerticalPosition={props.legendVerticalPosition}
                data={graphDataProps.data}
                series={graphDataProps.series}
                className={props.className}
                yAxis={props.yAxis}
            />
        );
    }
);

ColumnChartConnected.displayName = 'Controls-Graphs/ColumnChartConnected';

export default ColumnChartConnected;
