import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/Direction/Template';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items1: RecordSet;
    protected _selectedKey1: string | null = '1';
    protected _selectedKey2: string | null = '1';
    protected _beforeMount(): void {
        this._items1 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    title: 'Item 1',
                    icon: 'icon-EmptyMessage',
                },
                {
                    id: '2',
                    title: 'Item 2',
                    icon: 'icon-Email',
                },
                {
                    id: '3',
                    title: 'Item 3',
                    icon: 'icon-Edit',
                },
            ],
            keyProperty: 'id',
        });
    }
}
