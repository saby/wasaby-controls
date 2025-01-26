import IColumnChartProps from '../interfaces/IColumnChartProps';

export const getLegendItems = (props: IColumnChartProps) => {
    return props.series.map((item, index) => ({
        caption: item.name,
        colorIndex: 'base-' + (item.colorIndex || index + 1),
    }));
};
