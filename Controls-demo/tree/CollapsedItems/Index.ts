import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-demo/tree/data/ExpandedSource';

import * as Template from 'wml!Controls-demo/tree/CollapsedItems/CollapsedItems';

function getData() {
    return [
        {
            key: 1,
            title: 'Node',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 11,
            title: 'Node',
            parent: 1,
            type: true,
            hasChild: false,
        },
        {
            key: 111,
            title: 'Leaf',
            parent: 11,
            type: null,
        },
        {
            key: 12,
            title: 'Hidden node',
            parent: 1,
            type: true,
            hasChild: false,
        },
        {
            key: 13,
            title: 'Leaf',
            parent: 1,
            type: null,
        },
        {
            key: 2,
            title: 'Node 2',
            parent: null,
            type: true,
            hasChild: true,
        },
        {
            key: 21,
            title: 'Leaf 21',
            parent: 2,
            type: null,
        },
        {
            key: 3,
            title: 'Node 3',
            parent: null,
            type: true,
            hasChild: false,
        },
        {
            key: 31,
            title: 'Leaf 31',
            parent: 3,
            type: null,
        },
    ];
}

export default class CollapsedItems extends Control {
    protected _template: TemplateFunction = Template;
    protected _collapsedItems: CrudEntityKey[] = [1];
    protected _expandedItems: CrudEntityKey[] = [null];

    static _styles: string[] = ['DemoStand/Controls-demo'];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    hasChildrenProperty: 'hasChildren',
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    collapsedItems: [1],
                    expandedItems: [null],
                },
            },
        };
    }
}
