import { IColumn, IHeaderCell } from 'Controls/grid';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/EditArrow/resources/ColumnTemplate';

export const TreeHeader: IHeaderCell[] = [
    {
        caption: '',
    },
    {
        caption: 'price',
        align: 'right',
    },
    {
        caption: 'count',
        align: 'right',
    },
];

export const TreeColumns: IColumn[] = [
    {
        displayProperty: 'title',
        width: '300px',
        textOverflow: 'ellipsis',
    },
    {
        displayProperty: 'price',
        width: '100px',
        align: 'right',
    },
    {
        displayProperty: 'count',
        width: '100px',
        align: 'right',
    },
];

export const TreeColumnsWithTemplate: IColumn[] = [
    {
        displayProperty: 'title',
        width: '300px',
        template: ColumnTemplate,
    },
    {
        displayProperty: 'price',
        width: '100px',
        align: 'right',
        template: ColumnTemplate,
    },
    {
        displayProperty: 'count',
        width: '100px',
        align: 'right',
        template: ColumnTemplate,
    },
];

export const TreeData = [
    {
        key: 1,
        parent: null,
        'parent@': true,
        title: 'First Node',
        description: 'description',
        price: '100',
        count: '10',
    },
    {
        key: 2,
        parent: null,
        'parent@': true,
        title: 'Second Node',
        description: 'description',
        price: '200',
        count: '30',
    },
    {
        key: 3,
        parent: 2,
        'parent@': true,
        title: 'Third Node with veeeery long caption, so it fits only in two lines',
        description: 'description',
        price: '100',
        count: '10',
    },
    {
        key: 4,
        parent: 3,
        'parent@': null,
        title: 'Fourth Node',
        description: 'description',
        price: '200',
        count: '30',
    },
    {
        key: 5,
        parent: null,
        'parent@': null,
        title: 'Leaf 1',
        description: 'description',
        price: '200',
        count: '30',
    },
    {
        key: 6,
        parent: 1,
        'parent@': null,
        title: 'Leaf 2',
        description: 'description',
        price: '200',
        count: '30',
    },
    {
        key: 7,
        parent: 2,
        'parent@': null,
        title: 'Leaf 3',
        description: 'description',
        price: '200',
        count: '30',
    },
];
