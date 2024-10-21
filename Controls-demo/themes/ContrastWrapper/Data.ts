import { CrudEntityKey } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';

import 'wml!Controls-demo/themes/ContrastWrapper/_cellEditor';

interface IData {
    key: CrudEntityKey;
    number: number;
    ladder: number;
    country: string;
    capital: string;
    population: string;
    square: string;
    populationDensity: string;
}

export const Data = {
    getRootData(): { key: CrudEntityKey; title: string }[] {
        return [
            {
                key: 1,
                title: 'Запись списка верхнего уровня. В шаблоне содержится вложенный список',
            },
        ];
    },
    getData(): IData[] {
        return [
            {
                key: 0,
                number: 1,
                ladder: 1,
                country: 'Россия',
                capital: 'Москва',
                population: '143420300',
                square: '17075200',
                populationDensity: '8',
            },
            {
                key: 1,
                number: 2,
                ladder: 1,
                country: 'Канада',
                capital: 'Оттава',
                population: '32805000',
                square: '9976140',
                populationDensity: '3',
            },
            {
                key: 2,
                number: 3,
                ladder: 1,
                country: 'Соединенные Штаты Америки',
                capital: 'Вашингтон',
                population: '295734100',
                square: '9629091',
                populationDensity: '30.71',
            },
            {
                key: 3,
                number: 4,
                ladder: 1,
                country: 'Китай',
                capital: 'Пекин',
                population: '1306313800',
                square: '9596960',
                populationDensity: '136.12',
            },
            {
                key: 4,
                number: 5,
                ladder: 1,
                country: 'Бразилия',
                capital: 'Бразилиа',
                population: '186112800',
                square: '8511965',
                populationDensity: '21.86',
            },
            {
                key: 5,
                number: 6,
                ladder: 1,
                country: 'Австралия',
                capital: 'Канберра',
                population: '20090400',
                square: '7686850',
                populationDensity: '3',
            },
        ];
    },
    getHeader(): IHeaderCell[] {
        return [
            { caption: '#' },
            { caption: 'Страна' },
            { caption: 'Столица' },
            { caption: 'Население' },
            { caption: 'Площадь км2' },
            { caption: 'Плотность населения чел/км2' },
        ];
    },
    getColumns(): IColumn[] {
        return [
            {
                displayProperty: 'number',
                width: '30px',
            },
            {
                displayProperty: 'country',
                width: '150px',
                template: 'wml!Controls-demo/themes/ContrastWrapper/_cellEditor',
            },
            {
                displayProperty: 'capital',
                width: '100px',
                template: 'wml!Controls-demo/themes/ContrastWrapper/_cellEditor',
            },
            {
                displayProperty: 'population',
                width: '150px',
                template: 'wml!Controls-demo/themes/ContrastWrapper/_cellEditor',
            },
            {
                displayProperty: 'square',
                width: '100px',
                template: 'wml!Controls-demo/themes/ContrastWrapper/_cellEditor',
            },
            {
                displayProperty: 'populationDensity',
                width: '120px',
                template: 'wml!Controls-demo/themes/ContrastWrapper/_cellEditor',
            },
        ];
    },
};
