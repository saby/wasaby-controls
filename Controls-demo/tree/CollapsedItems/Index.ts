import { Control, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, HierarchicalMemory } from 'Types/source';

import * as Template from 'wml!Controls-demo/tree/CollapsedItems/CollapsedItems';

const data = [
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

export default class CollapsedItems extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _collapsedItems: CrudEntityKey[] = [1];
    protected _expandedItems: CrudEntityKey[] = [null];

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data,
            parentProperty: 'parent',
            filter: () => {
                return true;
            },
        });
    }

    static _styles: string[] = ['DemoStand/Controls-demo'];
}
