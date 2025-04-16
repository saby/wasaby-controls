import * as React from 'react';
import ColumnChart from 'Controls-Graphs/ColumnChart';
import { useDataFromSlice } from 'Controls-Graphs/data';
import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { isEqual } from 'Types/object';
import IConnectedGraphProps from 'Controls-Graphs/interfaces/IConnectedGraphProps';
import IColumnChartProps from 'Controls-Graphs/interfaces/IColumnChartProps';

export interface IColumnChartConnectedProps
    extends Omit<IColumnChartProps, 'data'>,
        IConnectedGraphProps {}

/**
 * Контрол, столбчатой диграммы, которая имеет возможность запрашивать данные из контекста.
 * @public
 * @class Controls-Graphs/ColumnChartConnected
 * @implements Controls-Graphs/interfaces/IColumnChartProps
 * @implements Controls-Graphs/interfaces/IConnectedGraphProps
 * @ignoreOptions data
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
                config={props.config}
            />
        );
    }
);

ColumnChartConnected.displayName = 'Controls-Graphs/ColumnChartConnected';

export default ColumnChartConnected;
