import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/toggle/Chips/Multiline/Template';
import { RecordSet } from 'Types/collection';

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
                    caption: 'Chips 1',
                },
                {
                    id: '2',
                    caption: 'Chips 2',
                },
                {
                    id: '3',
                    caption: 'Chips 3',
                },
                {
                    id: '4',
                    caption: 'Chips 4',
                },
                {
                    id: '5',
                    caption: 'Chips 5',
                },
                {
                    id: '6',
                    caption: 'Chips 6',
                },
                {
                    id: '7',
                    caption: 'Chips 7',
                },
            ],
            keyProperty: 'id',
        });
    }
}
