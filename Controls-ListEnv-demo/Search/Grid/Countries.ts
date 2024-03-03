import { Enum } from 'Types/collection';

export interface IData {
    key: number;
    number?: number;
    country?: string;
    capital?: string;
    population?: number;
    square?: number;
    populationDensity?: number;
    date?: string | Date;
    month?: string;
    day?: string;
    time?: string;
    name?: string;
    message?: string;
    photo?: string;
    state?: string;
    fullName?: string;
    invoice?: number;
    documentSign?: number;
    documentNum?: number;
    taxBase?: number;
    document?: string;
    documentDate?: null | string;
    serviceContract?: null | string;
    description?: string;
    group?: string;
    shipper?: null | string;
    tagStyle?: null | string;
    width?: string;
    height?: string;
}

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

export const Countries = {
    getData: (count?: number): IData[] => {
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
            {
                key: 5,
                number: 6,
                ladder: 1,
                country: 'Австралия',
                capital: 'Канберра',
                population: 20090400,
                square: 7686850,
                populationDensity: 3,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 111111,
                currency: getCurrencyEnum(5),
            },
            {
                key: 6,
                number: 7,
                ladder: 2,
                country: 'Индия',
                capital: 'Нью-Дели',
                population: 1080264400,
                square: 3287590,
                populationDensity: 328.59,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11111,
                currency: getCurrencyEnum(6),
            },
            {
                key: 7,
                number: 8,
                ladder: 2,
                country: 'Аргентина',
                capital: 'Буэнос-Айрес',
                population: 39537900,
                square: 2766890,
                populationDensity: 4.29,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 1111,
                currency: getCurrencyEnum(7),
            },
            {
                key: 8,
                number: 9,
                ladder: 2,
                country: 'Казахстан',
                capital: 'Нур-Султан',
                population: 15185000,
                square: 2717300,
                populationDensity: 6.0,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 111,
                currency: getCurrencyEnum(8),
            },
            {
                key: 9,
                number: 10,
                ladder: 2,
                country: 'Судан',
                capital: 'Хартум',
                population: 40187500,
                square: 2505810,
                populationDensity: 16.04,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11,
                currency: getCurrencyEnum(9),
            },
            {
                key: 10,
                number: 11,
                ladder: 2,
                country: 'Алжир',
                capital: 'Алжир',
                population: 32531900,
                square: 2381740,
                populationDensity: 13.66,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 1,
                currency: getCurrencyEnum(10),
            },
            {
                key: 11,
                number: 12,
                ladder: 3,
                country: 'Конго',
                capital: 'Браззавиль',
                population: 60085800,
                square: 2345410,
                populationDensity: 25.62,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 0.1,
                currency: getCurrencyEnum(11),
            },
            {
                key: 12,
                number: 13,
                ladder: 3,
                country: 'Мексика',
                capital: 'Мехико',
                population: 106202900,
                square: 1972550,
                populationDensity: 53.84,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 0.11,
                currency: getCurrencyEnum(12),
            },
            {
                key: 13,
                number: 14,
                ladder: 3,
                country: 'Саудовская Аравия',
                capital: 'Эр-Рияд',
                population: 26417600,
                square: 1960582,
                populationDensity: 13.47,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 0.111,
                currency: getCurrencyEnum(13),
            },
            {
                key: 14,
                number: 15,
                ladder: 3,
                country: 'Индонезия',
                capital: 'Джакарта',
                population: 241973900,
                square: 1919440,
                populationDensity: 126.06,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11111,
                currency: getCurrencyEnum(14),
            },
            {
                key: 15,
                number: 16,
                ladder: 3,
                country: 'Ливия',
                capital: 'Триполи',
                population: 5765600,
                square: 1759540,
                populationDensity: 3.0,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11111,
                currency: getCurrencyEnum(15),
            },
            {
                key: 16,
                number: 17,
                ladder: 3,
                country: 'Иран',
                capital: 'Тегеран',
                population: 68017900,
                square: 1648000,
                populationDensity: 41.27,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11111,
                currency: getCurrencyEnum(16),
            },
            {
                key: 17,
                number: 18,
                ladder: 3,
                country: 'Монголия',
                capital: 'Улан-Батор',
                population: 2791300,
                square: 1565000,
                populationDensity: 2.0,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11111,
                currency: getCurrencyEnum(17),
            },
            {
                key: 18,
                number: 19,
                ladder: 3,
                country: 'Перу',
                capital: 'Лима',
                population: 27925600,
                square: 1285220,
                populationDensity: 21.73,
                date: new Date('December 17, 2021 10:00:00'),
                gdp: 11111,
                currency: getCurrencyEnum(18),
            },
        ].slice(0, count || undefined);
    },
};
