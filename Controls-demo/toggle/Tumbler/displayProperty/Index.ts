import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Tumbler/displayProperty/Template';
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
                    caption: 'Item caption 1',
                    title: 'Item title 1',
                },
                {
                    id: '2',
                    caption: 'Item Caption 2',
                    title: 'Item title 2',
                },
            ],
            keyProperty: 'id',
        });
    }
}
