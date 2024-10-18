import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/ItemTemplate/itemTemplate';
import { RecordSet } from 'Types/collection';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items1: RecordSet;
    protected _selectedKeys1: string[] = ['1'];
    protected _selectedKeys2: string[] = ['1'];

    protected _beforeMount(): void {
        this._items1 = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'chips 1',
                    counter: 500,
                    icon: 'icon-RoundPlus',
                    color: 'danger',
                },
                {
                    id: '2',
                    caption: 'chips 2',
                    counter: 100,
                    color: 'warning',
                },
                {
                    id: '3',
                    caption: 'chips 3',
                    counter: 200,
                    icon: 'icon-RoundPlus',
                    color: 'info',
                },
            ],
            keyProperty: 'id',
        });
    }
}
