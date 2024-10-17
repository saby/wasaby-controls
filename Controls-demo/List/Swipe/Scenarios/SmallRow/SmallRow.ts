import { Control } from 'UI/Base';
import * as template from 'wml!Controls-demo/List/Swipe/Scenarios/SmallRow/SmallRow';
// @ts-ignore
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const itemActions = [
    {
        id: 1,
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: 2,
    },
    {
        id: 2,
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: 2,
    },
    {
        id: 3,
        icon: 'icon-Profile',
        title: 'profile',
        showType: 0,
    },
    {
        id: 4,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'delete',
        showType: 2,
    },
];

const header = [
    {
        title: '',
        displayProperty: 'title',
    },
    {
        title: 'Ед. изм.',
        displayProperty: 'unit',
    },
];

const columns = [
    {
        displayProperty: 'title',
    },
    {
        displayProperty: 'unit',
        width: '100px',
    },
];

function getData() {
    return [
        {
            id: 0,
            title: 'Домашняя птица',
            parent: null,
            'parent@': true,
        },
        {
            id: 1,
            title: 'Индейка',
            unit: 'кг',
            parent: 0,
            'parent@': null,
        },
        {
            id: 2,
            title: 'Кура',
            unit: 'кг',
            parent: 0,
            'parent@': null,
        },
    ];
}

export default class SmallRow extends Control {
    protected _template: Function = template;
    protected _itemActions: object[] = itemActions;
    protected _header: object[] = header;
    protected _columns: object[] = columns;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SwipeSmallRow: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        parentProperty: 'parent',
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
