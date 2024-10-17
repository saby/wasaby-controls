import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/CollapsedItems/CollapsedItems';
import { CrudEntityKey } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from '../DemoHelpers/ExpandedSource';

function getData() {
    return [
        {
            key: 1,
            title: 'Node',
            Раздел: null,
            'Раздел@': true,
            Раздел$: null,
            hasChild: true,
        },
        {
            key: 11,
            title: 'Node',
            Раздел: 1,
            'Раздел@': true,
            Раздел$: null,
        },
        {
            key: 111,
            title: 'Leaf',
            Раздел: 11,
            'Раздел@': null,
            Раздел$: null,
        },
        {
            key: 12,
            title: 'Hidden node',
            Раздел: 1,
            'Раздел@': false,
            Раздел$: true,
            hasChild: false,
        },
        {
            key: 13,
            title: 'Leaf',
            Раздел: 1,
            'Раздел@': null,
            Раздел$: null,
        },
        {
            key: 2,
            title: 'Node 2',
            Раздел: null,
            'Раздел@': true,
            Раздел$: null,
            hasChild: true,
        },
        {
            key: 21,
            title: 'Leaf 21',
            Раздел: 2,
            'Раздел@': null,
            Раздел$: null,
        },
        {
            key: 3,
            title: 'Node 3',
            Раздел: null,
            'Раздел@': true,
            Раздел$: null,
            hasChild: false,
        },
        {
            key: 31,
            title: 'Leaf 31',
            Раздел: 3,
            'Раздел@': null,
            Раздел$: null,
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];
    protected _collapsedItems: CrudEntityKey[] = [1];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            CollapsedItems: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'Раздел',
                    }),
                    collapsedItems: [1],
                    expandedItems: [null],
                    keyProperty: 'key',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    }
}
