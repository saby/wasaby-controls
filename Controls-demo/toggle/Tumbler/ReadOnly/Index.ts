import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/ReadOnly/ReadOnly';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items1: RecordSet;
    protected _selectedKey1: string = '1';
    protected _selectedKey2: string = '2';
    protected _beforeMount(): void {
        this._items1 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Item 1',
                },
                {
                    id: '2',
                    caption: 'Item 2',
                },
            ],
            keyProperty: 'id',
        });
    }
}
