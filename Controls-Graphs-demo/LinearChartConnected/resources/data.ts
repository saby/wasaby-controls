import { ISingleSeriesItem } from 'Controls-Graphs/base';

export const LINEAR_CHART_DATA = [
    {
        id: 1,
        name: 'First',
        count: 10000,
        percent: 50000,
        total: 25000,
    },
    {
        id: 2,
        name: 'Second',
        count: 20000,
        percent: 40000,
        total: 45000,
    },
    {
        id: 3,
        name: 'Third',
        count: 30000,
        percent: 30000,
        total: 10000,
    },
    {
        id: 4,
        name: 'Fourth',
        count: 40000,
        percent: 20000,
        total: 8000,
    },
    {
        id: 5,
        name: 'Fifth',
        count: 50000,
        percent: 10000,
        total: 15000,
    },
];

export const LINEAR_CHART_SERIES_CONFIG: ISingleSeriesItem[] = [
    {
        valueProperty: 'count',
        colorIndex: 2,
        name: 'Количество',
    },
    {
        valueProperty: 'percent',
        colorIndex: 4,
        name: 'Процент',
    },
    {
        valueProperty: 'total',
        colorIndex: 6,
        name: 'Всего',
    },
];
