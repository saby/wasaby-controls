import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

export const DATA: ISingleItem[] = [
    {
        value: 170,
        name: 'Статья расходов 1',
    },
    {
        value: 250,
        name: 'Статья расходов 2',
    },
    {
        value: 300,
        name: 'Статья расходов 3',
    },
    {
        value: 50,
        name: 'Статья расходов 4',
    },
    {
        value: 110,
        name: 'Статья расходов 5',
    },
];

export const VALUE_PROPERTY = 'value';

export const SERIES: ISingleSeriesItem[] = [
    {
        valueProperty: 'value',
        displayProperty: 'name',
    },
];
