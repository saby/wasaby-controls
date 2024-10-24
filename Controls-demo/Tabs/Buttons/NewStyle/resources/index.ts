import { RecordSet } from 'Types/collection';

export const ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Document',
        },
        {
            id: '2',
            title: 'Files',
        },
        {
            id: '3',
            title: 'Orders',
        },
    ],
});

export const ITEMS_WITH_ICON_AND_COUNTER = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            title: 'Document',
        },
        {
            id: '2',
            title: 'Files',
            mainCounter: 3,
        },
        {
            id: '3',
            title: 'Orders',
            icon: 'icon-EmptyMessage',
            iconStyle: 'label',
        },
    ],
});
