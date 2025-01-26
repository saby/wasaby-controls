import ILinearChartProps from '../interfaces/ILinearChartProps';

export const prepareSeriesData = (props: ILinearChartProps) => {
    return {
        series: props.series?.map?.((item, index) => {
            return {
                colorIndex: `base-${item.colorIndex || index + 1}`,
                zIndex: index + 1,
                name: item.name,
                data: props.data.map((dataItem) => dataItem[item.valueProperty]),
            };
        }),
    };
};
