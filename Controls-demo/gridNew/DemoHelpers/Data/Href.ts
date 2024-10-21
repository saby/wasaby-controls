import * as itemCountr from 'wml!Controls-demo/gridNew/resources/CellTemplates/CountryTemp';

export const Href = {
    getColumns: () => {
        return [
            {
                displayProperty: 'number',
                width: '100px',
                template: itemCountr,
                cellPadding: {
                    right: 's',
                },
            },
        ];
    },
    getData: () => {
        return [
            {
                key: 0,
                number: 'Russian Federation',
                country: 'Российская Федерация',
                capital: 'Москва',
                population: 143420300,
                square: 17075200,
                populationDensity: 8,
                href: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0',
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
                href: 'https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D0%B5%D0%B4%D0%B8%D0%BD%D1%91%D0%BD%D0%BD%D1%8B%D0%B5_%D0%A8%D1%82%D0%B0%D1%82%D1%8B_%D0%90%D0%BC%D0%B5%D1%80%D0%B8%D0%BA%D0%B8',
            },
            {
                key: 3,
                number: 'Peoples Republic of China',
                country: 'Китайская народная республика',
                capital: 'Пекин',
                population: 1306313800,
                square: 9596960,
                populationDensity: 136.12,
                href: 'https://ru.wikipedia.org/wiki/%D0%9A%D0%B8%D1%82%D0%B0%D0%B9',
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
    },
};
