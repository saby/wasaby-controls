import { RecordSet } from 'Types/collection';

export const Data = [
    {
        id: 1,
        name: 'Сделать',
        total: 3,
        items: new RecordSet({
            rawData: [
                {
                    text: 'Сделай а',
                },
                {
                    text: 'Давай делай',
                },
                {
                    text: 'Вот задача тебе',
                },
                {
                    text: 'Сделаешь?',
                },
                {
                    text: 'Нормально написал?',
                },
                {
                    text: 'СРОК ЗАВТРА УТРА',
                },
                {
                    text: 'Задача номер 141042388',
                },
                {
                    text: 'Поручение для тебя, чтоб сделал',
                },
                {
                    text: 'Пойдет?',
                },
            ],
            keyProperty: 'text',
        }),
    },
    {
        id: 2,
        name: 'На проверке',
        total: 1,
        items: new RecordSet({
            rawData: [
                {
                    text: 'Проверяется уже',
                },
            ],
            keyProperty: 'text',
        }),
    },
    {
        id: 3,
        name: 'Выполнено',
        total: 1,
        items: new RecordSet({
            rawData: [
                {
                    text: 'Нормально сделано конечно',
                },
            ],
            keyProperty: 'text',
        }),
    },
    {
        id: 4,
        name: 'Удаленные',
        total: 2,
        items: new RecordSet({
            rawData: [
                {
                    text: 'Не нужно',
                },
                {
                    text: 'Удалил и забыл',
                },
            ],
            keyProperty: 'text',
        }),
    },
];
