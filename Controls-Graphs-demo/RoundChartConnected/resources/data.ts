import { ISingleSeriesItem, ISingleItem } from 'Controls-Graphs/base';

export const ROUND_CHART_DATA: ISingleItem[] = [
    {
        id: 1,
        name: 'First',
        count: 10000,
        colorIndex: 1,
    },
    {
        id: 2,
        name: 'Second',
        count: 20000,
        colorIndex: 2,
    },
    {
        id: 3,
        name: 'Third',
        count: 30000,
        colorIndex: 3,
    },
    {
        id: 4,
        name: 'Fourth',
        count: 40000,
        colorIndex: 4,
    },
    {
        id: 5,
        name: 'Fifth',
        count: 50000,
        colorIndex: 5,
    },
];

export const ROUND_CHART_SERIES_CONFIG: ISingleSeriesItem[] = [
    {
        valueProperty: 'count',
        colorProperty: 'colorIndex',
        displayProperty: 'name',
    },
];
