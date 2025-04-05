import { Memory } from 'Types/source';

export const variants = [
    { fontSize: 'l', inlineHeight: 'l' },
    { fontSize: 'm', inlineHeight: 'm' },
    { fontSize: 'm', inlineHeight: 'm', iconSize: 's' },
    { fontSize: undefined, inlineHeight: undefined },
    { fontSize: undefined, inlineHeight: undefined, iconSize: 's' },
];

export const source = new Memory({
    keyProperty: 'key',
    data: [
        { key: 1, title: 'Ярославль', icon: 'icon-Add' },
        { key: 2, title: 'Москва', icon: 'icon-Add' },
    ],
});

export const sourceWithoutIcons = new Memory({
    keyProperty: 'key',
    data: [
        { key: 1, title: 'Ярославль' },
        { key: 2, title: 'Москва' },
    ],
});

export const sourceWithIcon = new Memory({
    keyProperty: 'key',
    data: [
        { key: 1, title: 'Ярославль' },
        { key: 2, title: 'Москва', icon: 'icon-Add' },
    ],
});
