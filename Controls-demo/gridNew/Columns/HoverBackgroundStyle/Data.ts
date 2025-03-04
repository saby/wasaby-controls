import { IColumn } from 'Controls/grid';
import { IData } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';

import * as CountryColumnTemplate from 'wml!Controls-demo/gridNew/Columns/HoverBackgroundStyle/CountryColumn';

export const Data = {
    getColumns: (): IColumn[] => {
        return [
            {
                displayProperty: 'number',
                width: '30px',
            },
            {
                displayProperty: 'country',
                width: '200px',
                template: CountryColumnTemplate,
            },
            {
                displayProperty: 'capital',
                width: '100px',
                hoverBackgroundStyle: 'warning',
            },
            {
                displayProperty: 'population',
                width: '150px',
            },
            {
                displayProperty: 'square',
                width: '100px',
            },
            {
                displayProperty: 'populationDensity',
                width: '120px',
            },
        ];
    },
    getData: (): IData[] => {
        return [
            {
                key: 0,
                number: 1,
                country: 'Россия',
                capital: 'Москва',
                population: 143420300,
                square: 17075200,
                populationDensity: 8,
            },
            {
                key: 1,
                number: 2,
                country: 'Канада',
                capital: 'Оттава',
                population: 32805000,
                square: 9976140,
                populationDensity: 3,
            },
            {
                key: 2,
                number: 3,
                country: 'Соединенные Штаты Америки',
                capital: 'Вашингтон',
                population: 295734100,
                square: 9629091,
                populationDensity: 30.71,
            },
            {
                key: 3,
                number: 4,
                country: 'Китай',
                capital: 'Пекин',
                population: 1306313800,
                square: 9596960,
                populationDensity: 136.12,
            },
        ];
    },
};
