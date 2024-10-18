import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/GoToItem/GoToPrev/GoToPrev';
import { RecordSet } from 'Types/collection';
import { View } from 'Controls/treeGrid';

function getData(): object[] {
    return [
        {
            key: 0,
            title: 'Item 0',
            parent: null,
            type: true,
        },
        {
            key: 1,
            title: 'Item 1',
            parent: 0,
            type: null,
        },
        {
            key: 2,
            title: 'Item 2',
            parent: null,
            type: true,
        },
        {
            key: 3,
            title: 'Item 3',
            parent: 2,
            type: null,
        },
        {
            key: 4,
            title: 'Item 4',
            parent: 2,
            type: null,
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _columns: unknown[] = [{ displayProperty: 'title' }];
    protected _children: { tree: View };

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: getData(),
        });
    }

    protected _goToPrev(): void {
        this._children.tree.goToPrev();
    }

    protected _goToNext(): void {
        this._children.tree.goToNext();
    }
}
