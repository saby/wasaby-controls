import { ITwoDimensionalPoint } from 'Controls-Graphs/base';

interface IPoint extends ITwoDimensionalPoint {
    [key: string]: unknown;
}

export default interface ILinearChartTooltipFormatterProps extends ITwoDimensionalPoint {
    points: IPoint[];
}
