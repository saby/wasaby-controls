import { RecordSet } from 'Types/collection';

export const CHIPS_ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            icon: 'icon-Birthday',
            iconStyle: 'success',
            counter: 1,
        },
        {
            id: '2',
            icon: 'icon-ChangeAccount',
            iconStyle: 'danger',
            counter: 0,
        },
        {
            id: '3',
            caption: 'Нарушения',
        },
        {
            id: '4',
            caption: 'Поощрения',
            counter: 4,
        },
        {
            id: '5',
            caption: 'Зарплата',
            counter: 352000,
        },
        {
            id: '6',
            caption: 'Контакты',
            counter: 17,
        },
    ],
});
