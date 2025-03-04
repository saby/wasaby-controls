import { ColumnTemplate } from 'Controls-editors-demo/RecordsetEditor/render/ColumnTemplate';
import * as React from 'react';
export const data = [
    {
        key: '1',
        name: '@Работа',
        type: 'Auto',
        comment: '',
        unique: false,
    },
    {
        key: '2',
        name: 'КолВо',
        type: 'Double',
        comment: '',
        unique: true,
    },
    {
        key: '3',
        name: 'Цена',
        type: 'Decimal',
        comment: '',
        unique: false,
    },
    {
        key: '4',
        name: 'Флаги',
        type: 'Flags',
        comment: 'Признаки события',
        unique: true,
    },
    {
        key: '5',
        name: 'Время',
        type: 'Time',
        comment: 'Длительность выполнения работы',
        unique: true,
    },
];
export const columns = [
    {
        displayProperty: 'name',
        width: '100px',
    },
    {
        displayProperty: 'type',
        width: '300px',
        render: React.createElement(ColumnTemplate),
    },
    {
        displayProperty: 'comment',
        width: '200px',
    },
    {
        displayProperty: 'unique',
        width: '50px',
    },
];
