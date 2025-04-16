import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

export const DATA: ISingleItem[] = [
    {
        id: 1,
        name: 'First',
        count: 9000,
        percent: 8000,
        total: 7000,
    },
    {
        id: 2,
        name: 'Second',
        count: 11000,
        percent: 12000,
        total: 13000,
    },
    {
        id: 3,
        name: 'Third',
        count: 5000,
        percent: 4000,
        total: 2000,
    },
    {
        id: 4,
        name: 'Fourth',
        count: 10000,
        percent: 11000,
        total: 9000,
    },
    {
        id: 5,
        name: 'Fifth',
        count: 5000,
        percent: 6000,
        total: 7000,
    },
];

export const COLUMN_CHART_SERIES_CONFIG: ISingleSeriesItem[] = [
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

export const XAXIS = {
    categories: ['В янв', 'В фев', 'В мар', 'В апр', 'В мае', 'В июн'],
};
