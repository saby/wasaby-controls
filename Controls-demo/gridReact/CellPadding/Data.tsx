import { RecordSet } from 'Types/collection';
import { ItemCounter } from './CellTemplates/ItemCounter';
import { ItemTpl } from './CellTemplates/ItemTpl';

interface IData {
    key: number;
    number?: string;
    country?: string;
    capital?: string;
    population?: number;
    square?: number;
    populationDensity?: number;
}

function getData(): IData[] {
    return [
        {
            key: 0,
            number: 'Russian Federation',
            country: 'Российская Федерация',
            capital: 'Москва',
            population: 143420300,
            square: 17075200,
            populationDensity: 8,
        },
        {
            key: 1,
            number: 'Canada',
            country: 'Канада',
            capital: 'Оттава',
            population: 32805000,
            square: 9976140,
            populationDensity: 3,
        },
        {
            key: 2,
            number: 'Unated States of America',
            country: 'Соединенные Штаты Америки',
            capital: 'Вашингтон',
            population: 295734100,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 3,
            number: 'Peoples Republic of China',
            country: 'Китайская народная республика',
            capital: 'Пекин',
            population: 1306313800,
            square: 9596960,
            populationDensity: 136.12,
        },
        {
            key: 4,
            number: 'trinidad and tabago',
            country: 'Тринидад и Табаго',
            capital: 'Город',
            population: 186112800,
            square: 8511965,
            populationDensity: 21.86,
        },
    ];
}

export function getColumns() {
    return [
        {
            displayProperty: 'number',
            width: '100px',
            render: <ItemCounter />,
            getCellProps: () => {
                return {
                    padding: {
                        right: 's',
                    },
                };
            },
        },
        {
            displayProperty: 'country',
            width: '100px',
            render: <ItemTpl />,
            cellPadding: {
                left: 's',
                right: 'null',
            },
        },
        {
            displayProperty: 'capital',
            width: '100px',
            cellPadding: {
                right: 'm',
            },
        },
        {
            displayProperty: 'population',
            width: '100px',
            cellPadding: {
                left: 'l',
                right: 'l',
            },
        },
        {
            displayProperty: 'square',
            width: '100px',
            cellPadding: {
                left: 'xl',
            },
        },
    ];
}

export function getHeader() {
    return [
        {
            title: 'right: S',
            cellPadding: {
                right: 's',
            },
        },
        {
            title: 'left: S and right: null',
            cellPadding: {
                left: 's',
                right: 'null',
            },
        },
        {
            title: 'left: default, right: m',
            cellPadding: {
                right: 'm',
            },
        },
        {
            title: 'left: l, right: l',
            cellPadding: {
                left: 'l',
                right: 'l',
            },
        },
        {
            title: 'left: xl',
            cellPadding: {
                left: 'xl',
            },
        },
    ];
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}
