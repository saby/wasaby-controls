import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/SelectedKeys/Template';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKey1: string | null = '1';
    protected _selectedKey2: string | null = '4';
    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'Item 1',
                },
                {
                    id: '2',
                    caption: 'Item 2',
                },
                {
                    id: '3',
                    caption: 'Item 3',
                },
                {
                    id: '4',
                    caption: 'Item 4',
                },
            ],
            keyProperty: 'id',
        });
    }
}
