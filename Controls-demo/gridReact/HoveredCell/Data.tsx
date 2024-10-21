import { Enum, RecordSet } from 'Types/collection';

const CURRENCIES = [
    'Российский рубль',
    'Канадский доллар',
    'Доллар США',
    'Китайский юань',
    'Бразильский реал',
    'Австралийский доллар',
    'Индийская рупия',
    'Аргентинское песо',
    'Казахстанский тенге',
    'Суданский фунт',
    'Алжирский динар',
    'Конголезский франк',
    'Мексиканское песо',
    'Саудовский риял',
    'Индонезийская рупия',
    'Ливийский динар',
    'Иранский риал',
    'Монгольский тугрик',
    'Перуанский новый соль',
];

function getCurrencyEnum(nameOrIndex: string | number): Enum<string> {
    let index: number;

    if (typeof nameOrIndex === 'string') {
        index = CURRENCIES.indexOf(nameOrIndex);

        if (index < 0) {
            return undefined;
        }
    } else {
        index = nameOrIndex;
    }

    return new Enum<string>({
        index,
        dictionary: CURRENCIES,
    });
}

export function getData() {
    return [
        {
            key: 0,
            number: 1,
            ladder: 1,
            country: 'Россия',
            capital: 'Москва',
            population: 143420300,
            square: 17075200,
            populationDensity: 8,
            date: new Date('December 17, 2021 10:00:00'),
            gdp: 11111111111,
            currency: getCurrencyEnum(0),
        },
        {
            key: 1,
            number: 2,
            ladder: 1,
            country: 'Канада',
            capital: 'Оттава',
            population: 32805000,
            square: 9976140,
            populationDensity: 3,
            date: new Date('December 17, 2021 10:00:00'),
            gdp: 1111111111,
            currency: getCurrencyEnum(1),
        },
        {
            key: 2,
            number: 3,
            ladder: 1,
            country: 'Соединенные Штаты Америки',
            capital: 'Вашингтон',
            population: 295734100,
            square: 9629091,
            populationDensity: 30.71,
            date: new Date('December 17, 2021 10:00:00'),
            gdp: 111111111,
            currency: getCurrencyEnum(2),
        },
        {
            key: 3,
            number: 4,
            ladder: 1,
            country: 'Китай',
            capital: 'Пекин',
            population: 1306313800,
            square: 9596960,
            populationDensity: 136.12,
            date: new Date('December 17, 2021 10:00:00'),
            gdp: 11111111,
            currency: getCurrencyEnum(3),
        },
        {
            key: 4,
            number: 5,
            ladder: 1,
            country: 'Бразилия',
            capital: 'Бразилиа',
            population: 186112800,
            square: 8511965,
            populationDensity: 21.86,
            date: new Date('December 17, 2021 10:00:00'),
            gdp: 1111111,
            currency: getCurrencyEnum(4),
        },
    ];
}

export function getColumns() {
    return [
        {
            displayProperty: 'number',
            width: '30px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: '100px',
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
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}
