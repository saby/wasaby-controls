import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/AllowEmptySelection/Template';
import { RecordSet } from 'Types/collection';
import 'css!DemoStand/Controls-demo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _selectedKeys1: string[] = ['1'];
    protected _selectedKeys2: string[] = ['2'];

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    id: '1',
                    caption: 'chips 1',
                },
                {
                    id: '2',
                    caption: 'chips 2',
                },
                {
                    id: '3',
                    caption: 'chips 3',
                },
                {
                    id: '4',
                    caption: 'chips 4',
                },
                {
                    id: '5',
                    caption: 'chips 5',
                },
            ],
            keyProperty: 'id',
        });
    }
}
