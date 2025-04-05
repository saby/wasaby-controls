import { ColumnTemplate } from 'Controls-editors-demo/RecordsetEditor/render/ColumnTemplate';
import { RowEditor } from 'Controls-editors-demo/RecordsetEditor/render/RowEditor';
import * as React from 'react';
export const data = [
    {
        key: '1',
        name: '@Работа',
        type: 'Auto',
        comment: '',
        unique: false,
        fieldType: 'Field',
    },
    {
        key: '2',
        name: 'КолВо',
        type: 'Double',
        comment: '',
        unique: true,
        fieldType: 'Field',
    },
    {
        key: '3',
        name: 'Цена',
        type: 'Decimal',
        comment: '',
        unique: false,
        fieldType: 'Expression',
    },
    {
        key: '4',
        name: 'Флаги',
        type: 'Flags',
        comment: 'Признаки события',
        unique: true,
        fieldType: 'Expression',
    },
    {
        key: '5',
        name: 'Время',
        type: 'Time',
        comment: 'Длительность выполнения работы',
        unique: true,
        fieldType: 'Field',
    },
];
export const fieldsData = [
    {
        key: '1',
        type: 'Int64',
    },
    {
        key: '2',
        type: 'Bool',
    },
];
export const columns = [
    {
        displayProperty: 'name',
        width: '100px',
        tooltipProperty: 'name',
        editorRender: React.createElement(RowEditor),
    },
    {
        displayProperty: 'type',
        tooltipProperty: 'type',
        width: '300px',
        render: React.createElement(ColumnTemplate),
    },
    {
        displayProperty: 'comment',
        tooltipProperty: 'comment',
        width: '200px',
    },
    {
        displayProperty: 'unique',
        tooltipProperty: 'unique',
        width: '50px',
    },
];

export const displayProperties = ['name', 'type', 'comment', 'unique', 'fieldType'];
