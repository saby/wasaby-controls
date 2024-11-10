import {RecordSet} from 'Types/collection';

export const list = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '0',
            title: 'Опросы'
        },
        {
            id: '1',
            title: 'Должности'
        },
        {
            id: '2',
            title: 'Список дел'
        },
        {
            id: '3',
            title: 'Новый документ'
        }
    ]
});
