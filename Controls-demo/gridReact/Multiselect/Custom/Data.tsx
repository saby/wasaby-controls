import { RecordSet } from 'Types/collection';
import { CellCapital } from './CellTemplates/CellCapital';

export enum Images {
    Green = 'green',
    Red = 'red',
    Yellow = 'yellow',
    Blue = 'blue',
}

export function getData() {
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
            country: 'Соединенные Штаты Америки',
            capital: 'Вашингтон',
            population: 295734100,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 2,
            number: 3,
            country: 'Доминиканская Республика',
            capital: 'Санто-Доминго',
            population: 10499707,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 3,
            number: 4,
            country: 'Новая Зеландия',
            capital: 'Веллингтон',
            population: 4942500,
            square: 9629091,
            populationDensity: 30.71,
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            capital: 'Бразилиа',
            population: 186112800,
            square: 8511965,
            populationDensity: 21.86,
        },
    ];
}

export function getColumns() {
    return [
        {
            displayProperty: 'country',
            width: '',
        },
        {
            displayProperty: 'capital',
            render: <CellCapital />,
            width: '',
        },
        {
            displayProperty: 'population',
            width: '',
        },
    ];
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}
